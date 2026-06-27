from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='strava_profile')
    
    strava_access_token = models.CharField(max_length=255, blank=True, null=True)
    strava_refresh_token = models.CharField(max_length=255, blank=True, null=True)
    height = models.PositiveIntegerField(blank=True, null=True, help_text="Users height in cm")

    def __str__(self):
        return f"User: {self.user.username}"
    
class WeightRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='weight_history')
    weight = models.DecimalField(max_digits=5, decimal_places=2, help_text="User's weight")
    date = models.DateField(default=timezone.now, help_text="Date of entry")

    class Meta:
        ordering = ['-date']
        verbose_name = "Record"
        verbose_name_plural = "Weight history"

    def __str__(self):
        return f"{self.user.username} - {self.weight} kg ({self.date})"