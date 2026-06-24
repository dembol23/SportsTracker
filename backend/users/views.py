from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import UserProfile


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        errors = {}

        if not username:
            errors['username'] = ['To pole jest wymagane.']
        elif User.objects.filter(username=username).exists():
            errors['username'] = ['Użytkownik o tej nazwie już istnieje.']

        if not password:
            errors['password'] = ['To pole jest wymagane.']
        else:
            try:
                validate_password(password)
            except ValidationError as e:
                errors['password'] = list(e.messages)

        if errors:
            return Response(errors, status=400)

        user = User.objects.create_user(username=username, password=password)
        return Response({'id': user.id, 'username': user.username}, status=201)


class UpdateStravaTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')

        if not refresh_token:
            return Response({"error": "Brak tokenu w zapytaniu!"}, status=400)

        profile, _ = UserProfile.objects.get_or_create(user=request.user)
        profile.strava_refresh_token = refresh_token
        profile.save()

        return Response({"message": "Token Stravy został pomyślnie zapisany!"}, status=200)