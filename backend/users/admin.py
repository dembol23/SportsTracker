from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'strava_refresh_token', 'strava_access_token']
    search_fields = ['user__username']