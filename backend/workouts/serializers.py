from rest_framework import serializers
from .models import Activity

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            'id',
            'strava_id',
            'name',
            'sport_type',
            'date',
            'start_date',
            'distance_km',
            'moving_time',
            'elapsed_time',
            'total_elevation_gain',
            'average_heartrate',
            'max_heartrate',
            'polyline',
        ]