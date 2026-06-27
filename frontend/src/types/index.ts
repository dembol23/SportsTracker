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

export type SetType = 'normal' | 'warmup' | 'dropset' | 'failure';

export interface WorkoutSet {
  id?: number;
  exercise?: string;
  exercise_name?: string;
  order: number;
  set_index: number;
  set_type: SetType;
  weight_kg?: number | null;
  reps?: number | null;
  duration_seconds?: number | null;
  distance_km?: number | null;
  rpe?: number | null;
}

export interface Workout {
  id: number;
  title: string;
  started_at: string;
  ended_at?: string | null;
  notes?: string;
  source: 'manual' | 'hevy_csv';
  duration_seconds?: number | null;
  sets: WorkoutSet[];
}

export interface Exercise {
  id: number;
  name: string;
  category?: string;
  equipment?: string;
}