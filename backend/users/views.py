from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile

class UpdateStravaTokenView(APIView):
    """Widok pozwalający zalogowanemu użytkownikowi zapisać swój token ze Stravy."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        
        if not refresh_token:
            return Response({"error": "Brak tokenu w zapytaniu!"}, status=400)

        # Pobieramy profil lub tworzymy nowy dla zalogowanego usera
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        
        # Zapisujemy token i aktualizujemy bazę
        profile.strava_refresh_token = refresh_token
        profile.save()

        return Response({"message": "Token Stravy został pomyślnie zapisany!"}, status=200)