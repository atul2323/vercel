import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useWebSocket } from '../services/useWebSocket';
import type { DetectionSummary, DroneTelemetry } from '../types';

export const DetectionAnalysisWorkspace: React.FC = () => {
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [detections, setDetections] = useState<DetectionSummary>({
    mission_id: 'MISSION-DRONE-001',
    victims_count: 7,
    boats_count: 2,
    vehicles_count: 4,
    obstacles_count: 3,
    water_coverage_pct: 68,
    submerged_roads: 3,
    road_blockages: 2,
    ai_model: 'YOLOv8-Disaster-v4.2',
    confidence_pct: 92.8,
  });

  const [drone, setDrone] = useState<DroneTelemetry>({
    id: 'DRONE-001',
    name: 'Alpha Recon 1',
    battery_pct: 74,
    altitude_m: 82,
    speed_kmh: 45,
    lat: 34.0522,
    lng: -118.2437,
    signal_pct: 98,
    status: 'Active',
    target_area: 'Sector 12',
  });

  const { lastMessage } = useWebSocket('/telemetry/DRONE-001');

  useEffect(() => {
    api.getLatestDetections()
      .then((data) => {
        if (data) setDetections(data);
      })
      .catch(() => {});

    api.getMissionTelemetry('MISSION-DRONE-001')
      .then((data) => {
        if (data) setDrone(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (lastMessage?.event === 'telemetry_update') {
      setDrone((prev) => ({
        ...prev,
        battery_pct: lastMessage.battery_pct ?? prev.battery_pct,
        altitude_m: lastMessage.altitude_m ?? prev.altitude_m,
        speed_kmh: lastMessage.speed_kmh ?? prev.speed_kmh,
        lat: lastMessage.lat ?? prev.lat,
        lng: lastMessage.lng ?? prev.lng,
        signal_pct: lastMessage.signal_pct ?? prev.signal_pct,
      }));
    }
  }, [lastMessage]);

  return (
    <div className="p-4 md:p-6 lg:p-xl w-full min-h-full flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-on-surface font-bold">
            Detection & Analysis Workspace
          </h1>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">
            Sector 12 · DRONE-001 · AI Vision Model: <span className="font-mono font-semibold">{detections.ai_model}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowBoundingBoxes((prev) => !prev)}
            className="px-md py-sm bg-surface border border-outline-variant rounded-lg font-label-md text-xs font-semibold text-on-surface flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">filter_list</span>
            {showBoundingBoxes ? 'Hide Overlays' : 'Show Overlays'}
          </button>
          <button className="px-md py-sm bg-primary-container text-on-primary rounded-lg font-label-md text-xs font-semibold flex items-center gap-1.5 hover:bg-primary transition-colors shadow-xs cursor-pointer">
            <span className="material-symbols-outlined text-base">download</span>
            Export Annotated Frame
          </button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Panel: Survey Footage Analysis */}
        <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col relative shadow-xs p-3 md:p-4">
          <div className="px-3 py-2 border-b border-outline-variant bg-surface rounded-t-lg flex justify-between items-center z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-label-md text-xs text-on-surface font-bold">MISSION FOOTAGE (RECORDED)</span>
            </div>
            <span className="font-data-mono text-xs text-on-surface-variant">REC 00:14:32:05 · HD 1080P</span>
          </div>

          <div className="relative flex-1 bg-inverse-surface w-full min-h-[380px] overflow-hidden rounded-lg mt-2">
            <img
              alt="Drone Reconnaissance Frame"
              className="w-full h-full object-cover opacity-90"
              data-alt="Aerial view of flooded suburban sector with computer vision overlays"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAuWBn-OvaKI4G019GpMSeEw6JfjDjpMZdlgKq4sI9jb9kO9ZzZYpMCI6_b0yKBCNgLU6fPAfq4UPHx5kfw2TOnPHPTZZWO5P07BZlYJtONa8biKbG9YNDETWfxgGUFzflKPK4LLpXVhNJFWCKhJY49SLGJ3uZFn_n0dbyhumLlX8pcAQKASwa0Slj2Tz9aTIhy2f714EspXnFSg6Prjg_dmU26gdwFoETUsk2Nd_Vd-SN75hK3vt4i"
            />

            {/* Bounding Boxes Overlay */}
            {showBoundingBoxes && (
              <div className="absolute inset-0 pointer-events-none">
                {/* Person Detection */}
                <div className="absolute top-[30%] left-[45%] w-[48px] h-[68px] border-2 border-error bg-error/15 rounded-xs animate-pulse">
                  <div className="absolute -top-[22px] -left-[2px] bg-error text-white px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap rounded-t-xs shadow-xs">
                    Person - 94%
                  </div>
                </div>

                {/* Rescue Boat Detection */}
                <div className="absolute top-[40%] left-[20%] w-[130px] h-[55px] border-2 border-primary-container bg-primary-container/15 rounded-xs">
                  <div className="absolute -top-[22px] -left-[2px] bg-primary-container text-white px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap rounded-t-xs shadow-xs">
                    Rescue Boat - 96%
                  </div>
                </div>

                {/* Submerged Vehicle Detection */}
                <div className="absolute top-[60%] right-[30%] w-[90px] h-[75px] border-2 border-[#a33500] bg-[#a33500]/15 rounded-xs">
                  <div className="absolute -top-[22px] -left-[2px] bg-[#a33500] text-white px-1.5 py-0.5 text-[10px] font-mono font-bold whitespace-nowrap rounded-t-xs shadow-xs">
                    Vehicle - 88%
                  </div>
                </div>
              </div>
            )}

            {/* Telemetry HUD Overlay (Bottom) */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap justify-between items-center text-white font-data-mono text-[11px] bg-on-background/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 gap-2">
              <span>LAT: {drone.lat.toFixed(4)}° N</span>
              <span>LONG: {drone.lng.toFixed(4)}° W</span>
              <span>ALT: {drone.altitude_m}m AGL</span>
              <span>SPD: {drone.speed_kmh} km/h</span>
              <span>CONFIDENCE: {detections.confidence_pct}%</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Mission Telemetry & Detection Summary */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          {/* Mission Info Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs">
            <h3 className="font-headline-md text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">flight_takeoff</span>
              Mission Status & Health
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <p className="text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">Battery</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">battery_5_bar</span>
                  <span className="font-data-mono text-base font-bold text-on-surface">{drone.battery_pct}%</span>
                </div>
              </div>
              <div className="bg-surface p-3 rounded-lg border border-outline-variant">
                <p className="text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">Signal Link</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container text-[20px]">signal_cellular_4_bar</span>
                  <span className="font-data-mono text-base font-bold text-on-surface">
                    {drone.signal_pct > 90 ? 'Strong' : 'Moderate'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-surface-variant">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-on-surface-variant">Target Altitude</span>
                <span className="font-mono font-bold text-on-surface">{drone.altitude_m}m</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-on-surface-variant">Area Scanned</span>
                <span className="font-mono font-bold text-on-surface">3.2 km²</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-on-surface-variant">Return ETA</span>
                <span className="font-mono font-bold text-on-surface">18m 42s</span>
              </div>
            </div>
          </div>

          {/* Detection Summary Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 md:p-5 shadow-xs flex-1">
            <h3 className="font-headline-md text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">troubleshoot</span>
              AI Detection Summary
            </h3>

            <div className="space-y-2.5 mt-3">
              {/* Victims */}
              <div className="bg-error-container/20 border border-error/30 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-error/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-error text-[18px]">person_alert</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Victims Detected</p>
                    <p className="text-[11px] text-error font-semibold">Critical Priority</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-error">{detections.victims_count}</span>
              </div>

              {/* Boats */}
              <div className="bg-primary-container/10 border border-primary-container/25 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary-container/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">sailing</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Rescue Boats</p>
                    <p className="text-[11px] text-on-surface-variant">Active Assets</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-primary-container">{detections.boats_count}</span>
              </div>

              {/* Vehicles */}
              <div className="bg-[#a33500]/10 border border-[#a33500]/25 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#a33500]/15 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#a33500] text-[18px]">directions_car</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Vehicles</p>
                    <p className="text-[11px] text-on-surface-variant">Stranded / Submerged</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-[#a33500]">{detections.vehicles_count}</span>
              </div>

              {/* Obstacles */}
              <div className="bg-surface border border-outline-variant p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-[18px]">warning</span>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Road Obstacles</p>
                    <p className="text-[11px] text-on-surface-variant">Debris & Fallen Trees</p>
                  </div>
                </div>
                <span className="font-data-mono text-2xl font-black text-on-surface">{detections.obstacles_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
