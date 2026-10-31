import React, { useState, useEffect } from 'react';
import {
  Cpu,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';

export default function AgentsPage({ isExecutingCycle, showToast }) {
  const [agents, setAgents] = useState([]);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [cycleSummary, setCycleSummary] = useState(null);

  const fetchAgents = async () => {
    try {
      const res = await api.getAgentsStatus();
      if (res && res.agents) {
        setAgents(res.agents);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleRunCycle = async () => {
    try {
      const result = await api.triggerAgentCycle();
      setCycleSummary(result);
      if (result.agents) {
        setAgents(result.agents);
      }
      if (showToast) {
        showToast(
          `Swarm coordinated in ${result.durationMs}ms. Composite Risk: ${result.compositeRiskScore}/100`,
          'success',
          'Agent Swarm Completed'
        );
      }
    } catch {
      if (showToast) showToast('Failed to trigger agent coordination cycle', 'error');
    }
  };

  const toggleExpand = (id) => {
    setExpandedAgent(expandedAgent === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header and Orchestrator Trigger */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              AI Agent Control Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              10 SPECIALIZED AGENTS
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Autonomous multi-agent architecture coordinating ingestion, civic intelligence, risk modeling, simulation, and trilingual broadcasts.
          </p>
        </div>

        <button
          onClick={handleRunCycle}
          disabled={isExecutingCycle}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
        >
          <Cpu className={`w-4 h-4 ${isExecutingCycle ? 'animate-spin' : ''}`} />
          <span>{isExecutingCycle ? 'Coordinating Swarm...' : 'Trigger Full Multi-Agent Cycle'}</span>
        </button>
      </div>

      {/* Cycle Results Banner (If recently run) */}
      {cycleSummary && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">Swarm Coordination Cycle Complete:</span>{' '}
              <span className="text-emerald-900">
                10 agents processed in <strong className="font-mono text-emerald-950">{cycleSummary.durationMs}ms</strong>. Composite risk index:{' '}
                <strong className="text-amber-800 font-mono">{cycleSummary.compositeRiskScore}/100 ({cycleSummary.riskLevel})</strong>.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 shrink-0">
            Cycle ID: {cycleSummary.cycleId}
          </span>
        </div>
      )}

      {/* Agents Grid (10 Agents) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent, index) => {
          const isExpanded = expandedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className={`p-5 rounded-2xl bg-white border transition-all ${
                agent.name.includes('Orchestrator')
                  ? 'border-amber-400 ring-2 ring-amber-100 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 shadow-sm'
              } space-y-3`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-amber-800 font-mono text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{agent.name}</h3>
                    <p className="text-xs text-gray-500">{agent.role}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {agent.status || 'Active'}
                </span>
              </div>

              {/* Analysis Summary & Findings */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed">
                <span className="text-amber-800 font-semibold block mb-1">
                  Analysis Summary & Findings:
                </span>
                {agent.keyFindings}
              </div>

              {/* Execution telemetry summary */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono pt-1">
                <span>Runs: <strong className="text-gray-900 font-sans">{agent.executionCount}</strong></span>
                <span>Confidence: <strong className="text-emerald-700 font-sans">{(agent.confidenceScore * 100).toFixed(0)}%</strong></span>
                <button
                  onClick={() => toggleExpand(agent.id)}
                  className="text-amber-700 hover:text-amber-800 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  <span>{isExpanded ? 'Hide Data Pipeline' : 'Inspect Pipeline'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Collapsible I/O artifacts drawer */}
              {isExpanded && (
                <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Input Data Sources:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {agent.inputDataSources?.map((src, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-mono text-[10px] border border-gray-200">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Generated Artifacts:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {agent.outputArtifacts?.map((art, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px]">
                          {art}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
