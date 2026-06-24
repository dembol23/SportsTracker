from django.db import models
from django.contrib.auth.models import User

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities', null=True)

    strava_id = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    sport_type = models.CharField(max_length=50, blank=True, default='')
    date = models.DateField(null=True, blank=True)
    start_date = models.DateTimeField(null=True, blank=True)

    distance_km = models.FloatField(default=0)
    moving_time = models.IntegerField(default=0)       # seconds
    elapsed_time = models.IntegerField(default=0)      # seconds
    total_elevation_gain = models.FloatField(default=0)  # meters

    average_heartrate = models.FloatField(null=True, blank=True)
    max_heartrate = models.FloatField(null=True, blank=True)

    polyline = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.date} - {self.name} ({self.distance_km} km)"