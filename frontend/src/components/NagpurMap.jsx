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
const createPulsingIcon = (colorClass, textLabel) => {
  return L.divIcon({
    className: 'custom-pulse-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
        <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background-color: ${colorClass}; opacity: 0.35;" class="animate-ping"></div>
        <div style="position: relative; width: 20px; height: 20px; border-radius: 50%; background-color: ${colorClass}; border: 2px solid white; box-shadow: 0 0 10px ${colorClass}; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
          ${textLabel}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
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

    // Dark cartographic tiles for Command Center look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // 1. Critical Narendra Nagar Underpass Marker
    const narendraMarker = L.marker([21.1085, 79.0792], {
      icon: createPulsingIcon('#ef4444', '!'),
    }).addTo(map);

    narendraMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
          <span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">CRITICAL INUNDATION</span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-weight: 700; font-size: 13px; color: #f8fafc;">Narendra Nagar Railway Underpass</h4>
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #94a3b8;">Water Depth: <strong>3.8 Feet</strong> (Rising fast)</p>
        <div style="background: rgba(239, 68, 68, 0.15); border-left: 3px solid #ef4444; padding: 6px; font-size: 10px; color: #fca5a5;">
          ${activePlan === 'PLAN-A' ? 'ACTIVE PLAN A: Subway Closed. Diverting all traffic to Ring Road.' : 'PLAN B: 4 Dewatering Pumps active. High residual risk.'}
        </div>
      </div>
    `);

    // 2. Manish Nagar Underpass
    const manishMarker = L.marker([21.0965, 79.0720], {
      icon: createPulsingIcon('#f97316', '▲'),
    }).addTo(map);

    manishMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <span style="background: #f97316; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">HIGH SLUDGE RISK</span>
        <h4 style="margin: 6px 0 4px 0; font-weight: 700; font-size: 13px; color: #f8fafc;">Manish Nagar Flyover Subway</h4>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">Water depth 2.1 ft. Police patrol stationed.</p>
      </div>
    `);

    // 3. Ambazari Lake Spillway
    const ambazariMarker = L.marker([21.1340, 79.0490], {
      icon: createPulsingIcon('#06b6d4', '≈'),
    }).addTo(map);

    ambazariMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <span style="background: #06b6d4; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">DRAINAGE MONITOR</span>
        <h4 style="margin: 6px 0 4px 0; font-weight: 700; font-size: 13px; color: #f8fafc;">Ambazari Spillway & Nag River Conduit</h4>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">High discharge volume. Municipal sluice gates opened 45%.</p>
      </div>
    `);

    // 4. Sitabuldi Interchange
    const sitabuldiMarker = L.marker([21.1460, 79.0850], {
      icon: createPulsingIcon('#eab308', '●'),
    }).addTo(map);

    sitabuldiMarker.bindPopup(`
      <div style="padding: 4px; font-family: Inter, sans-serif;">
        <span style="background: #eab308; color: black; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">BUS BAY PONDING</span>
        <h4 style="margin: 6px 0 4px 0; font-weight: 700; font-size: 13px; color: #f8fafc;">Sitabuldi Central Interchange</h4>
        <p style="margin: 0; font-size: 11px; color: #94a3b8;">Water pooling at curb; city bus rerouting prepped.</p>
      </div>
    `);

    // Road Polylines:
    // Blocked Wardha Road Subway Corridor (Red)
    const blockedWardhaRd = L.polyline(
      [
        [21.1150, 79.0760],
        [21.1085, 79.0792],
        [21.1020, 79.0815],
      ],
      {
        color: '#ef4444',
        weight: 6,
        opacity: 0.9,
        dashArray: '8, 8',
      }
    ).addTo(map);
    blockedWardhaRd.bindTooltip('BLOCKED CORRIDOR: Wardha Rd Narendra Nagar Subway (Inundated)');

    // Alternate Ring Road Diversion Route (Cyan / Green)
    const diversionRoute = L.polyline(
      [
        [21.1150, 79.0760],
        [21.1140, 79.0980],
        [21.1030, 79.0820],
        [21.1020, 79.0815],
      ],
      {
        color: '#06b6d4',
        weight: 5,
        opacity: 0.9,
      }
    ).addTo(map);
    diversionRoute.bindTooltip('PLAN A ACTIVE DETOUR: Ring Road via Shatabdi Square (+18 min)');

    // Clear Civil Lines corridor
    const clearRoute = L.polyline(
      [
        [21.1460, 79.0850],
        [21.1550, 79.0720],
        [21.1492, 79.0578],
      ],
      {
        color: '#10b981',
        weight: 4,
        opacity: 0.7,
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
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-navy-950">
      {/* Map container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Overlay Legend */}
      <div className="absolute top-4 right-4 z-10 bg-navy-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-xl text-xs space-y-2 pointer-events-auto max-w-[240px]">
        <div className="font-bold text-slate-200 border-b border-slate-700 pb-1 flex items-center justify-between">
          <span>Digital Twin Network</span>
          <span className="text-[10px] font-mono text-cyan-400">Nagpur</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-rose-500 rounded-full inline-block"></span>
            <span className="text-slate-300">Inundated / Blocked Route</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-cyan-400 rounded-full inline-block"></span>
            <span className="text-slate-300">Plan A Detour (Ring Rd)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block"></span>
            <span className="text-slate-300">Clear Arterial Flow</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
            <span className="text-rose-400 font-semibold">Subway Hazard Marker</span>
          </div>
        </div>
      </div>
    </div>
  );
}
