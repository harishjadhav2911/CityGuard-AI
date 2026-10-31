import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Play,
  ArrowRight,
  Check,
  Info
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
      if (data?.recommendedPlan) {
        setSelectedPlanId(data.recommendedPlan);
      }
    } catch {
      // Fallback
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
      setSelectedPlanId(res?.recommendedPlan || 'PLAN-A');
      if (showToast) {
        showToast('Digital Twin runoff simulation completed for Narendra Nagar scenario', 'success', 'Simulation Finished');
      }
    } catch {
      if (showToast) showToast('Simulation run failed', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSelectPlan = async (planId) => {
    setSelectedPlanId(planId);
    try {
      await api.selectPlan({
        incidentId: 'INC-NGP-2026-089',
        selectedPlanId: planId,
        selectionNotes: `Selected ${planId} via Digital Twin control console.`,
      });
      if (showToast) {
        showToast(`Forwarded ${planId} to Municipal Commissioner for authorization`, 'success', 'Plan Forwarded');
      }
    } catch {
      if (showToast) showToast('Failed to select response plan', 'error');
    }
  };

  const planA = plansData?.planA || {
    planId: 'PLAN-A',
    title: 'Immediate Subway Closure & Ring Road Diversion',
    strategyType: 'FULL_DIVERSION',
    description: 'Full physical barricading of Narendra Nagar subway mouth with police marshals and automated dynamic message sign diversion to Ring Road.',
    simulatedRiskScore: 28,
    trafficImpactDelayMins: 18,
    estimatedResponseTimeMins: 12,
    departmentResources: { trafficMarshals: 14, barricades: 40, heavyTowingTrucks: 2, dewateringPumps: 1 },
    tradeOff: 'Guarantees zero vehicle drowning casualties (simulated risk drops to 28/100). Imposes 18-minute detour delay on commuters.',
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
    tradeOff: 'Minimizes arterial traffic bottleneck (+6 min minor delay), but leaves significant residual risk (58/100) if cloudburst continues.',
    status: 'Alternative'
  };

  return (
    <div className="space-y-6">
      {/* Title & Scenario Configuration Bar */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                AI Planner & Digital Twin Simulator
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                NAGPUR ROAD NETWORK
              </span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Active Scenario: <strong>Heavy Monsoon Inundation at Narendra Nagar Railway Underpass (Wardha Rd Corridor)</strong>
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <Play className={`w-4 h-4 fill-current ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Simulating Runoff...' : 'RUN SIMULATION'}</span>
          </button>
        </div>

        {/* Dynamic Parameter Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
          <div>
            <div className="flex justify-between font-medium mb-1.5">
              <span className="text-gray-700">Simulated Precipitation Rate</span>
              <span className="text-amber-800 font-mono font-bold">{rainfallMmHr} mm / hr</span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              step="5"
              value={rainfallMmHr}
              onChange={(e) => setRainfallMmHr(e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>20mm (Moderate)</span>
              <span>65mm (Design Sump Capacity)</span>
              <span>120mm (Cloudburst)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1.5">
              <span className="text-gray-700">Underpass Sump Water Depth</span>
              <span className="text-red-700 font-mono font-bold">{underpassDepth} Feet</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="7.0"
              step="0.2"
              value={underpassDepth}
              onChange={(e) => setUnderpassDepth(e.target.value)}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>1.0 ft (Caution)</span>
              <span>3.5 ft (Vehicle Stall Level)</span>
              <span>7.0 ft (Submergence)</span>
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
            <GitCompare className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-extrabold text-gray-900">
              Competing AI Response Strategies (Trade-off Matrix)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>All values labeled as simulated estimates</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PLAN A CARD */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all ${
              selectedPlanId === 'PLAN-A'
                ? 'border-amber-500 ring-2 ring-amber-200 shadow-md'
                : 'border-gray-200 opacity-95 hover:opacity-100 shadow-sm'
            } flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      PLAN A
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      AI RECOMMENDED
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mt-1.5">{planA.title}</h3>
                </div>

                {selectedPlanId === 'PLAN-A' && (
                  <div className="p-1 rounded-full bg-amber-100 text-amber-800">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">{planA.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <div>
                  <div className="text-[10px] text-gray-500">Estimated Safety Risk</div>
                  <div className="text-lg font-mono font-extrabold text-emerald-700">
                    {planA.simulatedRiskScore}/100
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Low Residual Hazard</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Estimated Traffic Delay</div>
                  <div className="text-lg font-mono font-extrabold text-amber-800">
                    +{planA.trafficImpactDelayMins}m
                  </div>
                  <div className="text-[10px] text-gray-500">Via Ring Road</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Estimated Response Time</div>
                  <div className="text-lg font-mono font-extrabold text-gray-900">
                    {planA.estimatedResponseTimeMins}m
                  </div>
                  <div className="text-[10px] text-gray-500">Barricades Staged</div>
                </div>
              </div>

              {/* Resource Commitment */}
              <div className="text-xs space-y-1.5 pt-1">
                <span className="text-gray-700 font-semibold">Required Resources (Estimated):</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-800">
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Traffic Marshals: <strong>{planA.departmentResources?.trafficMarshals || 14}</strong>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Barricades: <strong>{planA.departmentResources?.barricades || 40}</strong>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Dewatering Pumps: <strong>{planA.departmentResources?.dewateringPumps || 1}</strong>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Heavy Tow Trucks: <strong>{planA.departmentResources?.heavyTowingTrucks || 2}</strong>
                  </div>
                </div>
              </div>

              {/* Trade-off statement */}
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <strong>Safety Trade-off Analysis:</strong> {planA.tradeOff}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('PLAN-A')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedPlanId === 'PLAN-A'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
              }`}
            >
              {selectedPlanId === 'PLAN-A' ? 'SELECTED FOR COMMISSIONER' : 'SELECT PLAN A'}
            </button>
          </div>

          {/* PLAN B CARD */}
          <div
            className={`p-6 rounded-2xl bg-white border transition-all ${
              selectedPlanId === 'PLAN-B'
                ? 'border-amber-500 ring-2 ring-amber-200 shadow-md'
                : 'border-gray-200 opacity-95 hover:opacity-100 shadow-sm'
            } flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded font-mono text-xs font-extrabold bg-gray-100 text-gray-800 border border-gray-300">
                      PLAN B
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                      ALTERNATIVE
                    </span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-base mt-1.5">{planB.title}</h3>
                </div>

                {selectedPlanId === 'PLAN-B' && (
                  <div className="p-1 rounded-full bg-amber-100 text-amber-800">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">{planB.description}</p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <div>
                  <div className="text-[10px] text-gray-500">Estimated Safety Risk</div>
                  <div className="text-lg font-mono font-extrabold text-red-600">
                    {planB.simulatedRiskScore}/100
                  </div>
                  <div className="text-[10px] text-red-600 font-semibold">Elevated Residual Risk</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Estimated Traffic Delay</div>
                  <div className="text-lg font-mono font-extrabold text-emerald-700">
                    +{planB.trafficImpactDelayMins}m
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Minimal Delay</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500">Estimated Response Time</div>
                  <div className="text-lg font-mono font-extrabold text-gray-900">
                    {planB.estimatedResponseTimeMins}m
                  </div>
                  <div className="text-[10px] text-gray-500">Pumps Staged</div>
                </div>
              </div>

              {/* Resource Commitment */}
              <div className="text-xs space-y-1.5 pt-1">
                <span className="text-gray-700 font-semibold">Required Resources (Estimated):</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-800">
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Traffic Marshals: <strong>{planB.departmentResources?.trafficMarshals || 6}</strong>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Barricades: <strong>{planB.departmentResources?.barricades || 12}</strong>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Dewatering Pumps: <strong>{planB.departmentResources?.dewateringPumps || 4}</strong>
                  </div>
                  <div className="p-2 rounded bg-gray-50 border border-gray-200">
                    Heavy Tow Trucks: <strong>{planB.departmentResources?.heavyTowingTrucks || 1}</strong>
                  </div>
                </div>
              </div>

              {/* Trade-off statement */}
              <div className="p-3 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-700">
                <strong>Safety Trade-off Analysis:</strong> {planB.tradeOff}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan('PLAN-B')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                selectedPlanId === 'PLAN-B'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
              }`}
            >
              {selectedPlanId === 'PLAN-B' ? 'SELECTED FOR COMMISSIONER' : 'SELECT PLAN B'}
            </button>
          </div>
        </div>
      </div>

      {/* Forward to Commissioner Action Banner */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="text-xs text-gray-700">
          Currently selected plan: <strong className="text-amber-800">{selectedPlanId}</strong>. Ready for Commissioner review desk.
        </div>
        <button
          onClick={() => onNavigate('approvals')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>Go to Commissioner Desk</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
