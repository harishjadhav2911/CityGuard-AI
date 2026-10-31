import React from 'react';
import {
  AlertTriangle,
  CloudRain,
  Car,
  Activity,
  ShieldCheck,
  CheckCircle,
  Clock,
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
    pendingApprovalsCount: 1,
    recentAgentActivity: []
  };

  return (
    <div className="space-y-6">
      {/* Banner / Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-cyan-500/30 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Nagpur Emergency Command Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
              ACTIVE MONSOON SURGE
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Synthesized multi-agent intelligence across Wardha Road basin, Sitabuldi corridor, and peri-urban Vidarbha.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('digital-twin')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <span>Run Digital Twin Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onTriggerCycle}
            disabled={isExecutingCycle}
            className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/30 font-semibold text-xs flex items-center gap-2 transition-all"
          >
            <Cpu className={`w-4 h-4 ${isExecutingCycle ? 'animate-spin' : ''}`} />
            <span>{isExecutingCycle ? 'Agents Synchronizing...' : 'Trigger Agent Cycle'}</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City Risk Index */}
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-rose-500/30 shadow-lg relative overflow-hidden group hover:border-rose-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Overall City Risk Index</span>
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">
              {overview.cityRiskScore}
            </span>
            <span className="text-sm font-semibold text-slate-400">/ 100</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {overview.riskLevel} Tier
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
            <span>Subway inundation +65mm/hr rain stress</span>
          </div>
        </div>

        {/* Active Incidents */}
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-amber-500/30 shadow-lg relative overflow-hidden group hover:border-amber-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Active Incidents</span>
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">
              {overview.activeIncidentsCount}
            </span>
            <span className="text-sm font-semibold text-slate-400">Hotspots</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              1 Critical
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400 truncate">
            Primary: Narendra Nagar Railway Underpass
          </div>
        </div>

        {/* Doppler Weather Feed */}
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-cyan-500/30 shadow-lg relative overflow-hidden group hover:border-cyan-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>IMD Rain Intensity</span>
            <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <CloudRain className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">
              {overview.weatherSummary?.rainfallRateMmHr || 62.5}
            </span>
            <span className="text-sm font-semibold text-slate-400">mm / hr</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Orange Alert
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            24h Total: {overview.weatherSummary?.accumulated24hMm || 142} mm (Sonegaon AWS)
          </div>
        </div>

        {/* Traffic Velocity */}
        <div className="p-5 rounded-2xl bg-navy-900/90 border border-teal-500/30 shadow-lg relative overflow-hidden group hover:border-teal-500/60 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all" />
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Arterial Velocity</span>
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Car className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-400 font-mono">
              {overview.trafficSummary?.averageSpeedKmh || 14.2}
            </span>
            <span className="text-sm font-semibold text-slate-400">km / h</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Gridlock
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            {overview.trafficSummary?.blockedRoadsCount || 2} Subway Corridors Blocked
          </div>
        </div>
      </div>

      {/* Middle Grid: Affected Locations & Department Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Affected Hotspots (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-slate-100 text-sm md:text-base">
                Affected Municipal Locations (Nagpur)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Spot 1 */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  Narendra Nagar Underpass
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-rose-500/20 text-rose-300">
                  Critical • 3.8 ft
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Railway subway submerged; 2 passenger cars stalled. Water ingress rate exceeds sump capacity.
              </p>
              <div className="text-[11px] text-cyan-400 font-mono">
                Action: Full Barricading & Ring Road Diversion
              </div>
            </div>

            {/* Spot 2 */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Manish Nagar Flyover Subway
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-amber-500/20 text-amber-300">
                  High • 2.1 ft
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Heavy silt buildup and sluggish transit. Two-wheeler skidding risk reported.
              </p>
              <div className="text-[11px] text-amber-400 font-mono">
                Action: Police Escort & Traffic Slowing
              </div>
            </div>

            {/* Spot 3 */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300">
                  Ambazari Lake Overflow Spillway
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-cyan-500/20 text-cyan-300">
                  Monitored • 1.8 ft
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Discharge conduit at 92% capacity towards Nag River. Silt grates cleared.
              </p>
              <div className="text-[11px] text-cyan-400 font-mono">
                Action: NMC Irrigation Squad on Alert
              </div>
            </div>

            {/* Spot 4 */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Sitabuldi Central Interchange
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                  Moderate • 1.2 ft
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Mor Bhavan bus bay entry ponding. City buses rerouting via VIP road.
              </p>
              <div className="text-[11px] text-teal-400 font-mono">
                Action: Catchment Suction Tankers Deployed
              </div>
            </div>
          </div>
        </div>

        {/* Department Readiness Status (1 Col) */}
        <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <h2 className="font-bold text-slate-100 text-sm md:text-base">
                Department Response Status
              </h2>
            </div>
            <button
              onClick={() => onNavigate('departments')}
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold"
            >
              Action Center
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-navy-950/80 border border-cyan-500/20">
              <div className="flex items-center justify-between text-cyan-300 font-bold mb-1">
                <span>Traffic Police (Nagpur)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">DEPLOYED</span>
              </div>
              <p className="text-slate-400">
                {overview.departmentReadiness?.trafficPolice}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-teal-500/20">
              <div className="flex items-center justify-between text-teal-300 font-bold mb-1">
                <span>Municipal Works (NMC)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">ACTIVE</span>
              </div>
              <p className="text-slate-400">
                {overview.departmentReadiness?.municipalWorks}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-amber-500/20">
              <div className="flex items-center justify-between text-amber-300 font-bold mb-1">
                <span>Health & 108 EMS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">ALERT</span>
              </div>
              <p className="text-slate-400">
                {overview.departmentReadiness?.healthServices}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-navy-950/80 border border-emerald-500/20">
              <div className="flex items-center justify-between text-emerald-300 font-bold mb-1">
                <span>Agriculture Extension</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">ADVISORY</span>
              </div>
              <p className="text-slate-400">
                {overview.departmentReadiness?.agriculture}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Pending Approval Banner & Recent Agent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approval Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-navy-900 to-navy-950 border border-rose-500/30 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Human-in-the-Loop Approval Required</span>
            </div>
            <h3 className="text-base font-extrabold text-white">
              Narendra Nagar Subway Response Plan Pending
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Planner Agent has generated <strong>Plan A</strong> (Complete Closure & Ring Road Diversion) vs <strong>Plan B</strong> (Active Dewatering Pumping).
              By policy, citizen alerts and emergency dispatches remain <strong>locked</strong> until Municipal Commissioner authorization.
            </p>
          </div>
          <button
            onClick={() => onNavigate('approvals')}
            className="mt-4 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950 flex items-center justify-center gap-2 transition-all"
          >
            <span>Review & Authorize in Commissioner Desk</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Recent AI Agent Feed (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-slate-100 text-sm md:text-base">
                Recent AI Agent Synchronizations
              </h2>
            </div>
            <button
              onClick={() => onNavigate('agents')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Control Center (10 Agents)
            </button>
          </div>

          <div className="space-y-2.5">
            {(overview.recentAgentActivity && overview.recentAgentActivity.length > 0
              ? overview.recentAgentActivity
              : [
                  {
                    agent: 'WeatherAgent',
                    action: 'Detected 62.5 mm/hr downpour intensity over Sitabuldi and Wardha Road catchments',
                    timestamp: new Date().toISOString()
                  },
                  {
                    agent: 'TrafficAgent',
                    action: 'Identified Wardha Road gridlock; calculated 18-minute detour capacity along Ring Road',
                    timestamp: new Date().toISOString()
                  },
                  {
                    agent: 'DisasterRiskAgent',
                    action: 'Updated Nagpur City composite risk rating to 74/100 (High Alert)',
                    timestamp: new Date().toISOString()
                  },
                  {
                    agent: 'PlannerAgent',
                    action: 'Generated Plan A (Subway Closure) vs Plan B (Active Dewatering) simulation trade-offs',
                    timestamp: new Date().toISOString()
                  }
                ]
            ).map((act, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-cyan-300 mr-2">{act.agent}:</span>
                    <span className="text-slate-300">{act.action}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
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
