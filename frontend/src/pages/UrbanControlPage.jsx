import React, { useState, useEffect } from 'react';
import {
  Building,
  CloudRain,
  Sun,
  HeartPulse,
  ShieldAlert,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function UrbanControlPage({ onNavigate, showToast }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadUrbanData = async () => {
      try {
        const res = await api.getUrbanControlData();
        setData(res);
      } catch {
        // Fallback to local
      }
    };
    loadUrbanData();
  }, []);

  const handleSimulateDispatch = (actionName) => {
    if (showToast) {
      showToast(`${actionName} order dispatched to Nagpur Emergency Field Squads`, 'success', 'Urban Command Action');
    }
  };

  const urban = data || {
    city: "Nagpur, Maharashtra",
    wardCount: 10,
    populationCovered: "2.8 Million",
    floodAndCloudburst: {
      status: "Severe Downpour Precursor Active",
      rainfallIntensity: "62.5 mm/hr",
      catchmentLevel: "Nag River / Pili River at 78% capacity",
      criticalUnderpasses: [
        { name: "Narendra Nagar Subway", depth: "3.8 ft", status: "Closed / Diverted" },
        { name: "Manish Nagar Subway", depth: "2.1 ft", status: "Caution / Sludge" },
        { name: "Sitabuldi Interchange", depth: "1.2 ft", status: "Monitored" }
      ]
    },
    heatwaveMonitoring: {
      temperature: "26.4 °C",
      heatIndex: "28.1 °C",
      riskLevel: "Low (Monsoon Dampening)",
      activeCoolingShelters: "Standby Mode"
    },
    waterloggingDrainage: {
      pumpsDeployed: 4,
      sumpPumpingRate: "18,000 L/min",
      sluiceGateStatus: "Ambazari Spillway open 45%",
      dewateringCrews: 6
    },
    hospitalCoordination: {
      aiimsNagpur: { icuBedsAvailable: 14, ambulanceStatus: "Normal Access via MIHAN" },
      gmcNagpur: { icuBedsAvailable: 8, ambulanceStatus: "Rerouted via Chhatrapati Flyover" },
      superSpeciality: { icuBedsAvailable: 12, ambulanceStatus: "Clear Access" },
      ambulances108Active: 22,
      averageResponseTimeMins: 9.5
    },
    policeEmergencyResponse: {
      controlRoomStatus: "Dial 112 Active",
      trafficMarshalsDeployed: 48,
      mobilePatrolVans: 18,
      barricadesPlaced: 52,
      towingTrucksStaged: 3
    },
    safeRoutes: [
      { from: "Chatrapati Square", to: "Airport", via: "Wardha Flyover Elevated Corridor", status: "Clear" },
      { from: "Sitabuldi", to: "Sonegaon", via: "Ring Road via Shatabdi Sq", status: "Active Detour (+18 min)" },
      { from: "Civil Lines", to: "Dharampeth", via: "West High Court Rd", status: "Clear" }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Urban Control Room — Nagpur City Protection
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              URBAN DIVISION
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Real-time urban surveillance for 10 Municipal Wards, covering flood mitigation, drainage dewatering, EMS transit, and police response.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('digital-twin')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Open Urban Digital Twin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid: Flood & Drainage (Left) and Heatwave + Traffic (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flood & Cloudburst Monitoring (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CloudRain className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Flood, Cloudburst & Drainage Monitoring
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {urban.floodAndCloudburst?.rainfallIntensity}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Precipitation Rate</div>
              <div className="text-xl font-bold font-mono text-gray-900">
                {urban.floodAndCloudburst?.rainfallIntensity}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-1">
                Threshold: High Inundation
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Nag River Basin Level</div>
              <div className="text-xl font-bold font-mono text-gray-900">
                78% Capacity
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Ambazari Sluice: Open 45%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Active Dewatering Pumps</div>
              <div className="text-xl font-bold font-mono text-emerald-700">
                {urban.waterloggingDrainage?.pumpsDeployed} Heavy Units
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                Rate: 18,000 L/min
              </div>
            </div>
          </div>

          {/* Underpass Status Cards */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
              Critical Low-Lying Underpasses (Nagpur)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {urban.floodAndCloudburst?.criticalUnderpasses?.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border ${
                    item.status.includes('Closed')
                      ? 'bg-red-50 border-red-200 text-red-950'
                      : item.status.includes('Caution')
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                >
                  <div className="font-bold">{item.name}</div>
                  <div className="font-mono mt-1 font-semibold">Depth: {item.depth}</div>
                  <div className="text-[11px] mt-0.5 opacity-80">{item.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Drainage Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => handleSimulateDispatch('High-Capacity Dewatering Pump Mobilization')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-all"
            >
              Deploy Standby Dewatering Pump
            </button>
            <button
              onClick={() => handleSimulateDispatch('NMC Sluice Gate Aperture Increase')}
              className="px-3.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs border border-gray-200 transition-all"
            >
              Adjust Ambazari Spillway (+15%)
            </button>
          </div>
        </div>

        {/* Heatwave & Atmospheric Monitoring (1 Col) */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-gray-900 text-base">
                Heatwave & Climate Monitor
              </h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Low Threat
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-gray-500">Air Temperature</div>
                <div className="text-lg font-bold font-mono text-gray-900">
                  {urban.heatwaveMonitoring?.temperature}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-500">Heat Index</div>
                <div className="text-lg font-bold font-mono text-amber-700">
                  {urban.heatwaveMonitoring?.heatIndex}
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-xs leading-relaxed">
              Monsoon precipitation is suppressing summer thermal extremes across Nagpur urban core. NMC Cooling Centers currently on standby.
            </p>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-xs font-bold text-amber-900 block mb-0.5">Civil Protection Note:</span>
              <span className="text-amber-800 text-[11px]">
                High relative humidity (94%) requires hydration readiness for outdoor municipal sanitation squads.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Hospital Coordination (Left) vs Police & Emergency Response (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital & Ambulance Coordination */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Hospital & 108 EMS Ambulance Coordination
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-gray-500">
              22 Ambulances Active
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">AIIMS Nagpur (MIHAN)</span>
                <span className="text-gray-500 text-[11px]">Normal access via elevated expressway</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 font-mono">
                14 ICU Beds Free
              </span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">Government Medical College (GMC)</span>
                <span className="text-amber-700 text-[11px]">Rerouted via Chhatrapati Flyover (avoid subway)</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 font-mono">
                8 ICU Beds Free
              </span>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-gray-900 block">Super Speciality Hospital</span>
                <span className="text-gray-500 text-[11px]">Clear access via Medical Square</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 font-mono">
                12 ICU Beds Free
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
            <span className="text-gray-600 font-medium">Average 108 EMS Response:</span>
            <span className="font-mono font-bold text-gray-900">9.5 Minutes</span>
          </div>
        </div>

        {/* Police & Emergency Response */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Police & Emergency Response Teams
              </h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold border border-amber-200">
              Dial 112 Active
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-gray-500 text-[11px]">Traffic Marshals Deployed</div>
              <div className="text-2xl font-bold font-mono text-gray-900 mt-1">48</div>
              <div className="text-[10px] text-gray-500">Key Chokepoints</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-gray-500 text-[11px]">Mobile Police Patrol Vans</div>
              <div className="text-2xl font-bold font-mono text-gray-900 mt-1">18</div>
              <div className="text-[10px] text-gray-500">Underpass Patrol</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-gray-500 text-[11px]">Road Barricades Placed</div>
              <div className="text-2xl font-bold font-mono text-amber-700 mt-1">52</div>
              <div className="text-[10px] text-gray-500">Subways & Ramps</div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div className="text-gray-500 text-[11px]">Heavy Tow Trucks</div>
              <div className="text-2xl font-bold font-mono text-gray-900 mt-1">3</div>
              <div className="text-[10px] text-gray-500">Vehicle Extrication</div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-600">Police Wireless Channel:</span>
            <span className="font-mono text-gray-900 font-semibold">Nagpur VHF Tactical Net 4</span>
          </div>
        </div>
      </div>

      {/* Safe Routes & Citizen Transit Guidance */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-gray-900 text-base">
              Recommended Safe Transit Corridors (Nagpur Urban)
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">Real-Time Transit Guidance</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {urban.safeRoutes?.map((route, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{route.from} ➔ {route.to}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  route.status.includes('Clear') ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}>
                  {route.status}
                </span>
              </div>
              <p className="text-gray-600 text-[11px]">
                <strong className="text-gray-800">Via:</strong> {route.via}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
