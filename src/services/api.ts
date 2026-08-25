import type {
  AlertItem,
  Camp,
  Unit,
  IncidentRecord,
  DroneTelemetry,
  MissionItem,
  DashboardStats,
  FieldResources,
  DetectionSummary,
  WaterLevelPoint,
  PredictionMilestone,
  MeteoData,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8005/api';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`[API] Failed request to ${url}:`, error);
    throw error;
  }
}

export const api = {
  // Dashboard
  getDashboardStats: () => fetchJson<DashboardStats>('/dashboard/stats'),
  getFieldResources: () => fetchJson<FieldResources>('/dashboard/resources'),

  // Alerts
  getAlerts: (severity?: string) =>
    fetchJson<AlertItem[]>(severity && severity !== 'all' ? `/alerts?severity=${severity}` : '/alerts'),
  getAlertById: (id: string) => fetchJson<AlertItem>(`/alerts/${id}`),
  createAlert: (alert: { title: string; severity: string; area: string; body: string; channels?: string[] }) =>
    fetchJson<AlertItem>('/alerts', {
      method: 'POST',
      body: JSON.stringify(alert),
    }),

  // Camps
  getCamps: (status?: string) =>
    fetchJson<Camp[]>(status && status !== 'all' ? `/camps?status=${status}` : '/camps'),
  getCampById: (id: string) => fetchJson<Camp>(`/camps/${id}`),
  createCamp: (camp: Partial<Camp>) =>
    fetchJson<Camp>('/camps', {
      method: 'POST',
      body: JSON.stringify(camp),
    }),

  // Units
  getUnits: (status?: string) =>
    fetchJson<Unit[]>(status && status !== 'all' ? `/units?status=${status}` : '/units'),
  createUnit: (unit: Partial<Unit>) =>
    fetchJson<Unit>('/units', {
      method: 'POST',
      body: JSON.stringify(unit),
    }),
  updateUnit: (id: string, updates: Partial<Unit>) =>
    fetchJson<Unit>(`/units/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  // Incidents
  getIncidents: (params?: { search?: string; status?: string; severity?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.severity && params.severity !== 'all') query.append('severity', params.severity);
    const qs = query.toString();
    return fetchJson<IncidentRecord[]>(qs ? `/incidents?${qs}` : '/incidents');
  },
  createIncident: (incident: Partial<IncidentRecord>) =>
    fetchJson<IncidentRecord>('/incidents', {
      method: 'POST',
      body: JSON.stringify(incident),
    }),

  // Missions & Telemetry
  getMissions: () => fetchJson<MissionItem[]>('/missions'),
  getMissionTelemetry: (missionId: string) => fetchJson<DroneTelemetry>(`/missions/${missionId}/telemetry`),
  createMission: (mission: Partial<MissionItem>) =>
    fetchJson<MissionItem>('/missions', {
      method: 'POST',
      body: JSON.stringify(mission),
    }),

  // Detections
  getLatestDetections: () => fetchJson<DetectionSummary>('/detections'),
  getMissionDetections: (missionId: string) => fetchJson<DetectionSummary>(`/detections/${missionId}`),

  // Flood Predictions & Meteo
  getWaterLevels: (sector?: string) => fetchJson<WaterLevelPoint[]>(`/flood/water-levels?sector=${sector || 'Sector 7'}`),
  getFloodPredictions: () => fetchJson<PredictionMilestone[]>('/flood/predictions'),
  getMeteoData: (sector?: string) => fetchJson<MeteoData>(`/flood/meteo?sector=${sector || 'Sector 7'}`),

  // Situation Reports
  getLatestSitRep: () => fetchJson<any>('/reports/latest'),
};
