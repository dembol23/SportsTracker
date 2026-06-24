export interface Activity {
  id: number;
  strava_id: string;
  name: string;
  sport_type: string;
  date: string;
  start_date: string;
  distance_km: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  average_heartrate: number | null;
  max_heartrate: number | null;
  polyline: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface User {
  username: string;
}