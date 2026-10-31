import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored HTML circle icons for Nagpur hotspots
const createPulsingIcon = (colorHex, textLabel) => {
  return L.divIcon({
    className: 'custom-pulse-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 30px; height: 30px;">
        <div style="position: absolute; width: 26px; height: 26px; border-radius: 50%; background-color: ${colorHex}; opacity: 0.35;" class="animate-ping"></div>
        <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background-color: ${colorHex}; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
          ${textLabel}
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
};

export default function NagpurMap({ activePlan = 'PLAN-A' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Center on Nagpur
    const map = L.map(mapContainerRef.current, {
      center: [21.1180, 79.0750],
      zoom: 13,
      zoomControl: true,
    });

    // Clean government open street tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // 1. Critical Narendra Nagar Underpass Marker
    const narendraMarker = L.marker([21.1085, 79.0792], {
      icon: createPulsingIcon('#DC2626', '!'),
    }).addTo(map);

    narendraMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
          <span style="background: #DC2626; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">CRITICAL INUNDATION</span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-weight: 700; font-size: 13px; color: #1F2937;">Narendra Nagar Railway Underpass</h4>
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #4B5563;">Water Depth: <strong>3.8 Feet</strong> (Vehicle hazard)</p>
        <div style="background: #FEF2F2; border-left: 3px solid #DC2626; padding: 6px; font-size: 11px; color: #991B1B;">
          ${activePlan === 'PLAN-A' ? 'ACTIVE PLAN A: Subway Closed. Diverting all traffic to Ring Road.' : 'PLAN B: 4 Dewatering Pumps active. High residual risk.'}
        </div>
      </div>
    `);

    // 2. Manish Nagar Underpass
    const manishMarker = L.marker([21.0965, 79.0720], {
      icon: createPulsingIcon('#D99A36', '▲'),
    }).addTo(map);

    manishMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <span style="background: #D99A36; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">HIGH SLUDGE RISK</span>
        <h4 style="margin: 6px 0 4px 0; font-weight: 700; font-size: 13px; color: #1F2937;">Manish Nagar Flyover Subway</h4>
        <p style="margin: 0; font-size: 11px; color: #4B5563;">Water depth 2.1 ft. Police patrol stationed for slow transit.</p>
      </div>
    `);

    // 3. Ambazari Lake Spillway
    const ambazariMarker = L.marker([21.1340, 79.0490], {
      icon: createPulsingIcon('#0284C7', '≈'),
    }).addTo(map);

    ambazariMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <span style="background: #0284C7; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">DRAINAGE MONITOR</span>
        <h4 style="margin: 6px 0 4px 0; font-weight: 700; font-size: 13px; color: #1F2937;">Ambazari Spillway & Nag River Conduit</h4>
        <p style="margin: 0; font-size: 11px; color: #4B5563;">Discharge volume at 92% capacity. Municipal sluice gates opened 45%.</p>
      </div>
    `);

    // 4. Sitabuldi Interchange
    const sitabuldiMarker = L.marker([21.1460, 79.0850], {
      icon: createPulsingIcon('#F59E0B', '●'),
    }).addTo(map);

    sitabuldiMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <span style="background: #F59E0B; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">BUS BAY PONDING</span>
        <h4 style="margin: 6px 0 4px 0; font-weight: 700; font-size: 13px; color: #1F2937;">Sitabuldi Central Interchange</h4>
        <p style="margin: 0; font-size: 11px; color: #4B5563;">Water pooling at curb; city bus rerouting prepped.</p>
      </div>
    `);

    // Polylines:
    // Blocked Wardha Road Corridor (Red dashed)
    const blockedWardhaRd = L.polyline(
      [
        [21.1150, 79.0760],
        [21.1085, 79.0792],
        [21.1020, 79.0815],
      ],
      {
        color: '#DC2626',
        weight: 6,
        opacity: 0.9,
        dashArray: '8, 8',
      }
    ).addTo(map);
    blockedWardhaRd.bindTooltip('BLOCKED: Wardha Road Underpass (Inundated 3.8 ft)');

    // Alternate Ring Road Diversion Route (Amber)
    const diversionRoute = L.polyline(
      [
        [21.1150, 79.0760],
        [21.1140, 79.0980],
        [21.1030, 79.0820],
        [21.1020, 79.0815],
      ],
      {
        color: '#D99A36',
        weight: 5,
        opacity: 0.9,
      }
    ).addTo(map);
    diversionRoute.bindTooltip('PLAN A DETOUR: Ring Road via Shatabdi Square (+18 min)');

    // Clear Civil Lines corridor (Green)
    const clearRoute = L.polyline(
      [
        [21.1460, 79.0850],
        [21.1550, 79.0720],
        [21.1492, 79.0578],
      ],
      {
        color: '#059669',
        weight: 4,
        opacity: 0.8,
      }
    ).addTo(map);
    clearRoute.bindTooltip('CLEAR: Civil Lines - Law College corridor');

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activePlan]);

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Overlay Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-gray-200 shadow-md text-xs space-y-2 pointer-events-auto max-w-[240px]">
        <div className="font-bold text-gray-900 border-b border-gray-200 pb-1.5 flex items-center justify-between">
          <span>Digital Twin Map</span>
          <span className="text-[10px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Nagpur</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-red-600 rounded-full inline-block"></span>
            <span className="text-gray-700">Blocked Subway Corridor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-amber-500 rounded-full inline-block"></span>
            <span className="text-gray-700">Plan A Detour (Ring Rd)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full inline-block"></span>
            <span className="text-gray-700">Clear Arterial Flow</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-ping"></span>
            <span className="text-red-700 font-semibold">Subway Hazard Marker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
