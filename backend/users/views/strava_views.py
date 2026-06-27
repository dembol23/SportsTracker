from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import UserProfile

class UpdateStravaTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({"error": "No token"}, status=400)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.strava_refresh_token = refresh_token
        profile.save()

        return Response({"message": "Strava token successfully saved!"}, status=200)