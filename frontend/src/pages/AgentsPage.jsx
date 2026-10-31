import React, { useState, useEffect } from 'react';
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';

export default function AgentsPage({ onTriggerCycle, isExecutingCycle, showToast }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [cycleSummary, setCycleSummary] = useState(null);

  const fetchAgents = async () => {
    try {
      const res = await api.getAgentsStatus();
      if (res && res.agents) {
        setAgents(res.agents);
      }
    } catch (e) {
      console.error('Failed to fetch agents:', e);
    } finally {
      setLoading(false);
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
        showToast(`Coordinated 10 agents in ${result.durationMs}ms. Composite Risk: ${result.compositeRiskScore}/100`, 'success');
      }
    } catch (e) {
      if (showToast) showToast('Failed to trigger agent coordination cycle', 'error');
    }
  };

  const toggleExpand = (id) => {
    setExpandedAgent(expandedAgent === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header and Orchestrator Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              AI Agent Control Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              10 SPECIALIZED AGENTS
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Autonomous multi-agent pipeline executing ingestion, threat assessment, strategic response planning, and trilingual alerts.
          </p>
        </div>

        <button
          onClick={handleRunCycle}
          disabled={isExecutingCycle}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          <Cpu className={`w-4 h-4 ${isExecutingCycle ? 'animate-spin' : ''}`} />
          <span>{isExecutingCycle ? 'Coordinating Swarm...' : 'Trigger Full Multi-Agent Cycle'}</span>
        </button>
      </div>

      {/* Cycle Results Banner (If recently run) */}
      {cycleSummary && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950/60 via-navy-900 to-navy-950 border border-teal-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <span className="font-bold text-teal-300">Coordination Cycle Completed:</span>{' '}
              <span className="text-slate-200">
                Processed 10 agents in <strong className="text-cyan-400">{cycleSummary.durationMs}ms</strong> with composite risk score{' '}
                <strong className="text-rose-400">{cycleSummary.compositeRiskScore}/100 ({cycleSummary.riskLevel})</strong>.
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 shrink-0">
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
              className={`p-5 rounded-2xl bg-navy-900/90 border transition-all ${
                agent.name.includes('Orchestrator')
                  ? 'border-indigo-500/50 shadow-indigo-950/40'
                  : 'border-slate-800 hover:border-cyan-500/40'
              } shadow-lg space-y-3`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{agent.name}</h3>
                    <p className="text-xs text-slate-400">{agent.role}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {agent.status || 'Active'}
                </span>
              </div>

              {/* Key Findings */}
              <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold block mb-1">Agent Intelligence Finding:</span>
                {agent.keyFindings}
              </div>

              {/* Execution telemetry summary */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Runs: <strong className="text-slate-200">{agent.executionCount}</strong></span>
                <span>Confidence: <strong className="text-teal-400">{(agent.confidenceScore * 100).toFixed(0)}%</strong></span>
                <button
                  onClick={() => toggleExpand(agent.id)}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  <span>{isExpanded ? 'Hide Pipeline' : 'Inspect Pipeline'}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Collapsible I/O artifacts drawer */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Input Data Sources:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {agent.inputDataSources?.map((src, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Generated Artifacts:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {agent.outputArtifacts?.map((art, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 font-mono text-[10px]">
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
