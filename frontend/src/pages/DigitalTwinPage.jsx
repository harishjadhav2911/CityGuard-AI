import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  Car,
  ShieldAlert,
  ArrowRight,
  Sliders,
  Check,
  RefreshCw
} from 'lucide-react';
import NagpurMap from '../components/NagpurMap';
import { api } from '../services/api';

export default function DigitalTwinPage({ onNavigate, showToast }) {
  const [plansData, setPlansData] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('PLAN-A');
  const [isSimulating, setIsSimulating] = useState(false);
  const [rainfallMmHr, setRainfallMmHr] = useState(65);
  const [underpassDepth, setUnderpassDepth] = useState(3.8);

  const fetchCurrentPlans = async () => {
    try {
      const data = await api.getCurrentPlans();
      setPlansData(data);
      if (data.recommendedPlan) {
        setSelectedPlanId(data.recommendedPlan);
      }
    } catch (e) {
      console.error('Failed to load simulation plans:', e);
    }
  };

  useEffect(() => {
    fetchCurrentPlans();
  }, []);

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await api.runSimulation({
        scenario: 'heavy_rainfall_underpass_waterlogging',
        rainfallMmHr: parseFloat(rainfallMmHr),
        underpassDepthFeet: parseFloat(underpassDepth),
      });
      setPlansData(res);
      setSelectedPlanId(res.recommendedPlan || 'PLAN-A');
      if (showToast) {
        showToast('Digital Twin simulation completed for Narendra Nagar scenario', 'success');
      }
    } catch (e) {
      if (showToast) showToast('Simulation run failed', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSelectPlan = async (planId) => {
    setSelectedPlanId(planId);
    try {
      const res = await api.selectPlan({
        incidentId: 'INC-NGP-2026-089',
        selectedPlanId: planId,
        selectionNotes: `Selected ${planId} via Digital Twin control console.`,
      });
      if (showToast) {
        showToast(`Forwarded ${planId} to Municipal Commissioner for final authorization`, 'success');
      }
    } catch (e) {
      if (showToast) showToast('Failed to select response plan', 'error');
    }
  };

  const planA = plansData?.planA || {
    planId: 'PLAN-A',
    title: 'Immediate Subway Closure & Ring Road Diversion',
    strategyType: 'FULL_DIVERSION',
    description: 'Full physical closure of Narendra Nagar subway mouth with concrete barricades and dynamic message sign diversion to Ring Road.',
    simulatedRiskScore: 28,
    trafficImpactDelayMins: 18,
    estimatedResponseTimeMins: 12,
    departmentResources: { trafficMarshals: 14, barricades: 40, heavyTowingTrucks: 2, dewateringPumps: 1 },
    tradeOff: 'Eliminates citizen vehicle drowning hazard (simulated risk score drops to 28/100). Imposes 18-minute detour delay on commuters.',
    status: 'Recommended'
  };

  const planB = plansData?.planB || {
    planId: 'PLAN-B',
    title: 'High-Capacity Dewatering Pumping & Monitored Slow-Lane Transit',
    strategyType: 'ACTIVE_DEWATERING',
    description: 'Deploy 4 heavy-duty submersible dewatering pumps to clear subway ingress while keeping one elevated lane open under police supervision.',
    simulatedRiskScore: 58,
    trafficImpactDelayMins: 6,
    estimatedResponseTimeMins: 22,
    departmentResources: { trafficMarshals: 6, barricades: 12, heavyTowingTrucks: 1, dewateringPumps: 4 },
    tradeOff: 'Minimizes arterial traffic bottleneck (+6 min minor slowdown), but exposes commuters to elevated 58/100 hazard if cloudburst continues.',
    status: 'Alternative'
  };

  return (
    <div className="space-y-6">
      {/* Title & Scenario Configuration Bar */}
      <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-white">
                AI Planner & Digital Twin Simulator
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                NAGPUR ROAD NETWORK
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Active Scenario: <strong>Heavy Monsoon Inundation at Narendra Nagar Railway Underpass (Wardha Rd Corridor)</strong>
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Dynamic Runoff...' : 'RUN SIMULATION'}</span>
          </button>
        </div>

        {/* Dynamic Parameter Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-navy-950/80 border border-slate-800 text-xs">
          <div>
            <div className="flex justify-between font-medium mb-1.5">
              <span className="text-slate-300">Simulated Precipitation Rate</span>
              <span className="text-cyan-400 font-mono font-bold">{rainfallMmHr} mm / hr</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={rainfallMmHr}
              onChange={(e) => setRainfallMmHr(e.target.value)}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>20mm (Moderate)</span>
              <span>65mm (Design Capacity)</span>
              <span>120mm (Cloudburst)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1.5">
              <span className="text-slate-300">Underpass Sump Water Depth</span>
              <span className="text-rose-400 font-mono font-bold">{underpassDepth} Feet</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="7.0"
              step="0.2"
              value={underpassDepth}
              onChange={(e) => setUnderpassDepth(e.target.value)}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>1.0 ft (Caution)</span>
              <span>3.5 ft (Vehicle Stall)</span>
              <span>7.0 ft (Total Submergence)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nagpur Interactive Map */}
      <NagpurMap activePlan={selectedPlanId} />

      {/* Competing Plans Matrix: Plan A vs Plan B */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-extrabold text-white">
              Competing AI Response Strategies (Trade-off Matrix)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            * All values labeled as simulated estimates
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PLAN A CARD */}
          <div
            className={`p-6 rounded-2xl bg-navy-900 border transition-all ${
              selectedPlanId === 'PLAN-A'
                ? 'border-cyan-400 ring-2 ring-cyan-500/20 shadow-xl shadow-cyan-950/60'
                : 'border-slate-800 opacity-90 hover:opacity-100'
            } flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      PLAN A
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300">
                      AI RECOMMENDED
                    </span>
                  </div>
                  <h3 className="font-extrabold text-white text-base mt-1.5">{planA.title}</h3>
                </div>

                {selectedPlanId === 'PLAN-A' && (
                  <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{planA.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Residual Risk</div>
                  <div className="text-lg font-mono font-extrabold text-teal-400">
                    {planA.simulatedRiskScore}/100
                  </div>
                  <div className="text-[10px] text-teal-500 font-semibold">Low Hazard</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Detour Delay</div>
                  <div className="text-lg font-mono font-extrabold text-amber-400">
                    +{planA.trafficImpactDelayMins}m
                  </div>
                  <div className="text-[10px] text-slate-400">Via Ring Road</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Response ETA</div>
                  <div className="text-lg font-mono font-extrabold text-cyan-400">
                    {planA.estimatedResponseTimeMins}m
                  </div>
                  <div className="text-[10px] text-slate-400">Barricades Set</div>
                </div>
              </div>

              {/* Resource Commitment */}
              <div className="text-xs space-y-1.5 pt-1">
                <span className="text-slate-400 font-medium">Department Resources Required:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded bg-slate-800/60">
                    👮 Traffic Marshals: <strong>{planA.departmentResources?.trafficMarshals || 14}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-800/60">
                    🚧 Barricades: <strong>{planA.departmentResources?.barricades || 40}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-800/60">
                    🚒 Dewatering Pumps: <strong>{planA.departmentResources?.dewateringPumps || 1}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-800/60">
                    🚛 Tow Trucks: <strong>{planA.departmentResources?.heavyTowingTrucks || 2}</strong>
                  </div>
                </div>
              </div>

              {/* Trade-off statement */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-300">
                <strong>Safety Trade-off:</strong> {planA.tradeOff}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('PLAN-A')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedPlanId === 'PLAN-A'
                  ? 'bg-cyan-500 text-navy-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-navy-800 hover:bg-navy-750 text-slate-300 border border-slate-700'
              }`}
            >
              {selectedPlanId === 'PLAN-A' ? 'SELECTED FOR COMMISSIONER' : 'SELECT PLAN A'}
            </button>
          </div>

          {/* PLAN B CARD */}
          <div
            className={`p-6 rounded-2xl bg-navy-900 border transition-all ${
              selectedPlanId === 'PLAN-B'
                ? 'border-amber-400 ring-2 ring-amber-500/20 shadow-xl shadow-amber-950/60'
                : 'border-slate-800 opacity-90 hover:opacity-100'
            } flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      PLAN B
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700 text-slate-300">
                      ALTERNATIVE
                    </span>
                  </div>
                  <h3 className="font-extrabold text-white text-base mt-1.5">{planB.title}</h3>
                </div>

                {selectedPlanId === 'PLAN-B' && (
                  <div className="p-1 rounded-full bg-amber-500/20 text-amber-400">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{planB.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-navy-950/80 border border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Residual Risk</div>
                  <div className="text-lg font-mono font-extrabold text-rose-400">
                    {planB.simulatedRiskScore}/100
                  </div>
                  <div className="text-[10px] text-rose-400 font-semibold">Elevated Risk</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Detour Delay</div>
                  <div className="text-lg font-mono font-extrabold text-teal-400">
                    +{planB.trafficImpactDelayMins}m
                  </div>
                  <div className="text-[10px] text-teal-400 font-semibold">Minor Delay</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Response ETA</div>
                  <div className="text-lg font-mono font-extrabold text-amber-400">
                    {planB.estimatedResponseTimeMins}m
                  </div>
                  <div className="text-[10px] text-slate-400">Pumps Staged</div>
                </div>
              </div>

              {/* Resource Commitment */}
              <div className="text-xs space-y-1.5 pt-1">
                <span className="text-slate-400 font-medium">Department Resources Required:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded bg-slate-800/60">
                    👮 Traffic Marshals: <strong>{planB.departmentResources?.trafficMarshals || 6}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-800/60">
                    🚧 Barricades: <strong>{planB.departmentResources?.barricades || 12}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-800/60">
                    🚒 Dewatering Pumps: <strong>{planB.departmentResources?.dewateringPumps || 4}</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-800/60">
                    🚛 Tow Trucks: <strong>{planB.departmentResources?.heavyTowingTrucks || 1}</strong>
                  </div>
                </div>
              </div>

              {/* Trade-off statement */}
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300">
                <strong>Safety Trade-off:</strong> {planB.tradeOff}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('PLAN-B')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedPlanId === 'PLAN-B'
                  ? 'bg-amber-500 text-navy-950 shadow-lg shadow-amber-500/20'
                  : 'bg-navy-800 hover:bg-navy-750 text-slate-300 border border-slate-700'
              }`}
            >
              {selectedPlanId === 'PLAN-B' ? 'SELECTED FOR COMMISSIONER' : 'SELECT PLAN B'}
            </button>
          </div>
        </div>
      </div>

      {/* Forward to Commissioner Action Banner */}
      <div className="p-4 rounded-xl bg-navy-900 border border-cyan-500/30 flex items-center justify-between">
        <div className="text-xs text-slate-300">
          Selected plan: <strong className="text-cyan-400">{selectedPlanId}</strong>. Ready for Commissioner sign-off desk.
        </div>
        <button
          onClick={() => onNavigate('approvals')}
          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs flex items-center gap-1.5 transition-all"
        >
          <span>Go to Commissioner Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
