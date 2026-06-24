from django.urls import path
from .views import ActivityListView, StravaSyncView

urlpatterns = [
    path('api/activities/', ActivityListView.as_view(), name='activity-list'),
    path('api/strava/sync/', StravaSyncView.as_view(), name='strava-sync'),
]