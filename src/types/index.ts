export interface AlertItem {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info';
  area: string;
  time: string;
  reach: string;
  body: string;
}

export interface Camp {
  id: string;
  name: string;
  location: string;
  status: 'Critical' | 'Warning' | 'Stable';
  occupancy: number;
  capacity: number;
  foodDays: string;
  foodCritical?: boolean;
  waterDays: string;
  waterCritical?: boolean;
  medsStatus: 'Low' | 'Ok' | 'Adequate';
  personnel: number;
}

export interface Unit {
  id: string;
  name: string;
  type: string;
  location: string;
  status: 'En Route' | 'On Site' | 'Available';
  personnel: number;
}

export interface IncidentRecord {
  id: string;
  date: string;
  sector: string;
  type: string;
  severity: 'Critical' | 'Warning' | 'Moderate';
  victims: number;
  status: 'Resolved' | 'Under Action' | 'Archived';
}

export interface DroneTelemetry {
  id: string;
  name: string;
  battery_pct: number;
  altitude_m: number;
  speed_kmh: number;
  lat: number;
  lng: number;
  signal_pct: number;
  status: string;
  target_area: string;
}

export interface MissionItem {
  id: string;
  drone_id: string;
  title: string;
  target_area: string;
  status: string;
  assigned_time: string;
  waypoints_completed: number;
  waypoints_total: number;
}

export interface DashboardStats {
  water_coverage_pct: number;
  victims_detected: number;
  road_blockages: number;
  submerged_roads: number;
  boats_available: number;
}

export interface FieldResources {
  rescue_boats: number;
  life_jackets: number;
  medical_kits: number;
}

export interface DetectionSummary {
  mission_id: string;
  victims_count: number;
  boats_count: number;
  vehicles_count: number;
  obstacles_count: number;
  water_coverage_pct: number;
  submerged_roads: number;
  road_blockages: number;
  ai_model: string;
  confidence_pct: number;
}

export interface WaterLevelPoint {
  id: string;
  sector: string;
  timestamp: string;
  level_m: number;
  is_predicted: boolean;
}

export interface PredictionMilestone {
  id: string;
  time: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'MONITOR' | string;
}

export interface MeteoData {
  sector: string;
  rainfall_mm: number;
  river_discharge_m3s: number;
  soil_saturation_pct: number;
  breach_likelihood_pct: number;
  evacuation_required_pct: number;
  power_grid_failure_pct: number;
}
