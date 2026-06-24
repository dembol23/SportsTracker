from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import requests

from .models import Activity
from .serializers import ActivitySerializer
from users.models import UserProfile


class ActivityListView(generics.ListAPIView):
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Activity.objects.filter(user=self.request.user).order_by('-date')


class StravaSyncView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        if not profile.strava_refresh_token:
            return Response(
                {"error": "Nie połączyłeś konta ze Stravą! (Brak tokenu w bazie)"},
                status=400,
            )

        # Refresh the access token
        token_response = requests.post(
            "https://www.strava.com/oauth/token",
            data={
                "client_id": settings.STRAVA_CLIENT_ID,
                "client_secret": settings.STRAVA_CLIENT_SECRET,
                "grant_type": "refresh_token",
                "refresh_token": profile.strava_refresh_token,
            },
        )

        if token_response.status_code != 200:
            return Response({"error": "Nie udało się odświeżyć tokenu Stravy."}, status=400)

        token_data = token_response.json()
        profile.strava_access_token = token_data.get("access_token", profile.strava_access_token)
        profile.strava_refresh_token = token_data.get("refresh_token", profile.strava_refresh_token)
        profile.save()

        # Fetch ALL activities from Strava with pagination (200 per page is the API max)
        headers = {"Authorization": f"Bearer {profile.strava_access_token}"}
        activities = []
        page = 1

        while True:
            response = requests.get(
                "https://www.strava.com/api/v3/athlete/activities",
                headers=headers,
                params={"per_page": 200, "page": page},
            )
            if response.status_code != 200:
                return Response({"error": "Błąd komunikacji ze Stravą przy pobieraniu tras."}, status=400)

            batch = response.json()
            if not batch:
                break  # empty page means we've fetched everything

            activities.extend(batch)

            if len(batch) < 200:
                break  # last page, no need to request another

            page += 1

        saved_count = 0

        for act in activities:
            poly = act.get("map", {}).get("summary_polyline")

            Activity.objects.update_or_create(
                strava_id=act["id"],
                defaults={
                    "user": user,
                    "name": act.get("name", "Trening"),
                    "sport_type": act.get("sport_type") or act.get("type", ""),
                    "date": act.get("start_date_local", "")[:10] or None,
                    "start_date": act.get("start_date") or None,
                    "distance_km": round(act.get("distance", 0) / 1000, 3),
                    "moving_time": act.get("moving_time", 0),
                    "elapsed_time": act.get("elapsed_time", 0),
                    "total_elevation_gain": act.get("total_elevation_gain", 0),
                    "average_heartrate": act.get("average_heartrate"),
                    "max_heartrate": act.get("max_heartrate"),
                    "polyline": poly or "",
                },
            )
            saved_count += 1

        return Response({"message": f"Zsynchronizowano {saved_count} tras!"}, status=200)