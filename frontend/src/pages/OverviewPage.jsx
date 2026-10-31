import React from 'react';
import {
  AlertTriangle,
  CloudRain,
  Car,
  Activity,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  Cpu
} from 'lucide-react';

export default function OverviewPage({ data, onNavigate, onTriggerCycle, isExecutingCycle }) {
  const overview = data || {
    cityRiskScore: 74,
    riskLevel: 'High',
    activeIncidentsCount: 4,
    activeEmergencies: [
      { id: "EMG-01", title: "Subway Submergence & Waterlogging", location: "Narendra Nagar Railway Underpass", severity: "Critical", division: "URBAN", status: "Response Underway" },
      { id: "EMG-02", title: "Sludge & Drainage Congestion", location: "Manish Nagar Subway", severity: "High", division: "URBAN", status: "Monitoring" },
      { id: "EMG-03", title: "Citrus Orchard Inundation Threat", location: "Hingna & Katol Talukas", severity: "High", division: "RURAL", status: "Advisory Dispatched" },
      { id: "EMG-04", title: "Arterial Transit Gridlock", location: "Wardha Road Corridor", severity: "High", division: "URBAN", status: "Diversion Recommended" }
    ],
    weatherSummary: {
      condition: 'Severe Thunderstorm & Convective Downpour',
      rainfallRateMmHr: 62.5,
      accumulated24hMm: 142.0,
      warning: 'Orange Alert (IMD Nagpur)'
    },
    trafficSummary: {
      congestionLevel: 'Critical',
      averageSpeedKmh: 14.2,
      blockedRoadsCount: 2,
      primaryChokepoint: 'Wardha Road - Narendra Nagar Subway'
    },
    departmentReadiness: {
      trafficPolice: 'Deployed (Barricades Pre-Staged at Shatabdi Sq)',
      municipalWorks: 'Active (4 Dewatering Pumps Operational)',
      healthServices: 'Alert (Ambulances Rerouted via Chhatrapati Flyover)',
      agriculture: 'Rural Inundation Advisory Dispatched (Hingna/Saoner)'
    },
    highRiskZones: [
      { name: "Narendra Nagar Underpass", type: "Subway Flood", risk: "Critical (3.8 ft)" },
      { name: "Manish Nagar Flyover Subway", type: "Water Accumulation", risk: "High (2.1 ft)" },
      { name: "Ambazari Lake Spillway", type: "Conduit Ingress", risk: "Monitored (92% Cap)" },
      { name: "Sitabuldi Interchange", type: "Bus Bay Ponding", risk: "Moderate (1.2 ft)" }
    ],
    pendingApprovalsCount: 1,
    recentAgentActivity: []
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Nagpur Emergency Command Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              ACTIVE MONSOON ALERT
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Synthesized multi-agent intelligence across Wardha Road basin, Sitabuldi corridor, and peri-urban Vidarbha.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('digital-twin')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <span>Run Digital Twin Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onTriggerCycle}
            disabled={isExecutingCycle}
            className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <Cpu className={`w-4 h-4 text-amber-600 ${isExecutingCycle ? 'animate-spin' : ''}`} />
            <span>{isExecutingCycle ? 'Synchronizing...' : 'Trigger Swarm Cycle'}</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Risk Score */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-2">
            <span>Overall City Risk Index</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 font-mono">
              {overview.cityRiskScore}
            </span>
            <span className="text-sm font-semibold text-gray-400">/ 100</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              {overview.riskLevel} Tier
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>Subway depth +65mm/hr rain stress</span>
          </div>
        </div>

        {/* Total Incidents & Emergencies */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-2">
            <span>Active Emergencies</span>
            <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 font-mono">
              {overview.activeIncidentsCount}
            </span>
            <span className="text-sm font-semibold text-gray-400">Hotspots</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
              1 Critical
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500 truncate">
            Primary: Narendra Nagar Railway Underpass
          </div>
        </div>

        {/* Weather Warning */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-2">
            <span>IMD Rain Intensity</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <CloudRain className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 font-mono">
              {overview.weatherSummary?.rainfallRateMmHr || 62.5}
            </span>
            <span className="text-sm font-semibold text-gray-400">mm / hr</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Orange Alert
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            24h Total: {overview.weatherSummary?.accumulated24hMm || 142} mm (Sonegaon)
          </div>
        </div>

        {/* Arterial Traffic */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-2">
            <span>Arterial Velocity</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Car className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900 font-mono">
              {overview.trafficSummary?.averageSpeedKmh || 14.2}
            </span>
            <span className="text-sm font-semibold text-gray-400">km / h</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">
              Gridlock
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {overview.trafficSummary?.blockedRoadsCount || 2} Subway Corridors Blocked
          </div>
        </div>
      </div>

      {/* Middle Grid: Active Emergencies (Left) & High-Risk Zones + Department Readiness (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Emergencies (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Active Emergencies & High-Risk Hotspots
              </h2>
            </div>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {overview.activeEmergencies?.map((emg) => (
              <div
                key={emg.id}
                className={`p-4 rounded-xl border ${
                  emg.severity === 'Critical'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-amber-50/50 border-amber-200'
                } space-y-1.5`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    emg.severity === 'Critical' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {emg.severity}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    {emg.division}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm mt-1">{emg.title}</h3>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{emg.location}</span>
                </div>
                <div className="text-[11px] font-semibold text-amber-800 pt-1">
                  Status: {emg.status}
                </div>
              </div>
            ))}
          </div>

          {/* High Risk Zones Quick Bar */}
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider font-mono">
              Monitored Urban Sump Catchments
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {overview.highRiskZones?.map((zone, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="font-bold text-gray-900 truncate">{zone.name}</div>
                  <div className="text-[11px] text-gray-500">{zone.type}</div>
                  <div className="text-[11px] font-semibold text-amber-700 font-mono mt-0.5">{zone.risk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Department Readiness Status (1 Col) */}
        <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Department Response Status
              </h2>
            </div>
            <button
              onClick={() => onNavigate('departments')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
            >
              Action Center
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                <span>Traffic Police (Nagpur)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">DEPLOYED</span>
              </div>
              <p className="text-gray-600 text-[11px]">
                {overview.departmentReadiness?.trafficPolice}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                <span>Municipal Works (NMC)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">ACTIVE</span>
              </div>
              <p className="text-gray-600 text-[11px]">
                {overview.departmentReadiness?.municipalWorks}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                <span>Health & 108 EMS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">ALERT</span>
              </div>
              <p className="text-gray-600 text-[11px]">
                {overview.departmentReadiness?.healthServices}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between font-bold text-gray-900 mb-0.5">
                <span>Agriculture Extension</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">ADVISORY</span>
              </div>
              <p className="text-gray-600 text-[11px]">
                {overview.departmentReadiness?.agriculture}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Commissioner Approval Gate Callout & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approval Callout */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Human-in-the-Loop Approval Required</span>
            </div>
            <h3 className="text-base font-extrabold text-gray-900">
              Narendra Nagar Subway Response Plan Pending
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Planner Agent has generated <strong>Plan A</strong> (Complete Closure & Ring Road Diversion) vs <strong>Plan B</strong> (Active Dewatering Pumping).
              Public alerts remain <strong>locked</strong> until Municipal Commissioner authorization.
            </p>
          </div>
          <button
            onClick={() => onNavigate('approvals')}
            className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Review & Authorize in Commissioner Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent AI Agent Feed (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-gray-900 text-base">
                Recent AI Multi-Agent Activities
              </h2>
            </div>
            <button
              onClick={() => onNavigate('agents')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
            >
              Control Center (10 Agents)
            </button>
          </div>

          <div className="space-y-2">
            {(overview.recentAgentActivity && overview.recentAgentActivity.length > 0
              ? overview.recentAgentActivity
              : [
                  {
                    agent: 'WeatherAgent',
                    action: 'Detected 62.5 mm/hr downpour intensity over Sitabuldi and Wardha Road catchments',
                    timestamp: '2026-10-31T17:28:10Z'
                  },
                  {
                    agent: 'TrafficAgent',
                    action: 'Identified Wardha Road chokepoint; calculated 18-minute detour capacity along Ring Road',
                    timestamp: '2026-10-31T17:22:00Z'
                  },
                  {
                    agent: 'DisasterRiskAgent',
                    action: 'Updated Nagpur City composite risk rating to 74/100 (High Alert Tier)',
                    timestamp: '2026-10-31T17:15:00Z'
                  },
                  {
                    agent: 'PlannerAgent',
                    action: 'Generated Plan A (Subway Closure) vs Plan B (Active Dewatering) simulation trade-offs',
                    timestamp: '2026-10-31T17:10:00Z'
                  }
                ]
            ).map((act, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900 mr-1.5">{act.agent}:</span>
                    <span className="text-gray-700">{act.action}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-mono shrink-0">
                  {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() : 'Just now'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
