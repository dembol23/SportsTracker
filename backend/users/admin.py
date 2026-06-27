from django.contrib import admin
from .models import UserProfile, WeightRecord


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'strava_refresh_token', 'strava_access_token']
    list_editable = ['strava_refresh_token', 'strava_access_token']
    search_fields = ['user__username']

@admin.register(WeightRecord)
class WeightRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'weight', 'date')
    list_filter = ('date', 'user')
    search_fields = ('user__username',)