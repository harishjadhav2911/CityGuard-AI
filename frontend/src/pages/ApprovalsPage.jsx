import React, { useState, useEffect } from 'react';
import {
  Stamp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Radio,
  Send,
  Volume2,
  Globe,
  Clock,
  ShieldCheck,
  FileCheck,
  Building2
} from 'lucide-react';
import { api } from '../services/api';

export default function ApprovalsPage({ showToast, onRefreshHeader }) {
  const [approvalState, setApprovalState] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [officerName, setOfficerName] = useState('Dr. V. Raman (Municipal Commissioner, NMC)');
  const [officerNotes, setOfficerNotes] = useState('');
  const [activeLang, setActiveLang] = useState('en'); // 'en', 'mr', 'hi'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState('Adjust traffic detour signage on Ring Road; deploy 2 extra towing units.');

  const fetchData = async () => {
    try {
      const [appRes, altRes] = await Promise.all([
        api.getApprovalState(),
        api.getAlertPreviews(),
      ]);
      setApprovalState(appRes);
      setAlertData(altRes);
    } catch (e) {
      console.error('Failed to load approval & alerts data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (actionType, customNotes) => {
    setIsProcessing(true);
    try {
      const res = await api.executeApprovalAction({
        planId: approvalState?.currentPlanId || 'PLAN-A',
        action: actionType,
        officerName: officerName,
        notes: customNotes || officerNotes,
      });

      if (showToast) {
        showToast(res.message, actionType === 'APPROVE' ? 'success' : actionType === 'REJECT' ? 'error' : 'info');
      }

      await fetchData();
      if (onRefreshHeader) onRefreshHeader();
    } catch (e) {
      if (showToast) showToast('Failed to execute Commissioner action', 'error');
    } finally {
      setIsProcessing(false);
      setShowReviseModal(false);
    }
  };

  const handleReleaseAlerts = async () => {
    setIsReleasing(true);
    try {
      const res = await api.releaseAlerts();
      if (showToast) {
        showToast('Emergency Trilingual Citizen Alerts officially RELEASED to broadcast channels!', 'success');
      }
      await fetchData();
    } catch (err) {
      if (showToast) {
        showToast(err.message || 'Cannot release alerts: Plan not approved!', 'error');
      }
    } finally {
      setIsReleasing(false);
    }
  };

  // Preview object for selected language
  const currentPreview = alertData?.previews?.[activeLang] || {
    language: 'English',
    headline: 'FLASH FLOOD EMERGENCY: Narendra Nagar Subway Closed',
    message: 'Narendra Nagar Railway Underpass is completely shut due to deep waterlogging (3.8 ft). All traffic is diverted via Shatabdi Square and Ring Road.',
    safetyInstructions: 'Keep windows up; do not drive into stagnant water; seek elevated bypass roads.',
  };

  const isApproved = approvalState?.status === 'APPROVED';
  const isReleased = alertData?.isReleased;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-white">
                Commissioner Approval & Citizen Alerts Gatekeeper
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                isApproved
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : approvalState?.status === 'REJECTED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                STATUS: {approvalState?.status || 'PENDING SIGN-OFF'}
              </span>
            </div>
            <p className="text-slate-400 text-xs md:text-sm mt-1">
              Statutory human-in-the-loop governance. Emergency public broadcasts remain cryptographically locked until authorized.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Sign-off Authority:</span>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-xs text-slate-200 font-medium focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Grid: Commissioner Review Card (Left) vs Citizen Alerts Dispatcher (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: COMMISSIONER DECISION DESK */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Stamp className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-slate-100 text-base">
                  Emergency Plan Submitted for Review
                </h2>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300">
                {approvalState?.currentPlanId || 'PLAN-A'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-white">
                {approvalState?.selectedPlanTitle || 'Immediate Subway Closure & Ring Road Diversion'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Strategy: <strong>{approvalState?.planSummary?.strategyType}</strong> • Simulated Residual Risk:{' '}
                <strong className="text-teal-400">{approvalState?.planSummary?.simulatedRiskScore}/100</strong>
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Public Safety Score</div>
                <div className="text-lg font-bold text-teal-400 font-mono">
                  {100 - (approvalState?.planSummary?.simulatedRiskScore || 28)}%
                </div>
                <div className="text-[10px] text-slate-500">Zero drowning risk</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Detour Impact</div>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  +{approvalState?.planSummary?.trafficDelayMins || 18} mins
                </div>
                <div className="text-[10px] text-slate-500">Ring Rd routing</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Deployment ETA</div>
                <div className="text-lg font-bold text-cyan-400 font-mono">
                  {approvalState?.planSummary?.estimatedResponseMins || 12} mins
                </div>
                <div className="text-[10px] text-slate-500">Zone 3 squads</div>
              </div>
            </div>

            {/* Trade-off and reasoning */}
            <div className="p-3.5 rounded-xl bg-navy-950/60 border border-slate-800 text-xs space-y-1">
              <span className="text-slate-400 font-semibold block">AI Planner Trade-off & Rationale:</span>
              <p className="text-slate-200 leading-relaxed">
                {approvalState?.planSummary?.tradeOff || 'Eliminates citizen vehicle submergence; minor Ring Road detour.'}
              </p>
            </div>

            {/* Commissioner Directive Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-medium">Commissioner Directives / Notes:</label>
              <textarea
                rows={2}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="e.g. Approved. Deploy extra marshals at Shatabdi Sq junction to regulate right turns."
                className="w-full p-2.5 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Action Buttons: APPROVE, REVISE, REJECT */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAction('APPROVE')}
              disabled={isProcessing}
              className="py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE</span>
            </button>

            <button
              onClick={() => setShowReviseModal(true)}
              disabled={isProcessing}
              className="py-2.5 px-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-amber-300 border border-amber-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REVISE</span>
            </button>

            <button
              onClick={() => handleAction('REJECT', 'Rejected by Commissioner')}
              disabled={isProcessing}
              className="py-2.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>REJECT</span>
            </button>
          </div>
        </div>

        {/* RIGHT: MULTILINGUAL CITIZEN ALERTS DISPATCHER */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Radio className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-slate-100 text-base">
                  Multilingual Citizen Emergency Broadcast
                </h2>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex bg-navy-950 p-1 rounded-lg border border-slate-800 text-xs">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'mr', label: 'मराठी' },
                  { id: 'hi', label: 'हिन्दी' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLang(l.id)}
                    className={`px-2.5 py-1 rounded font-medium transition-all ${
                      activeLang === l.id
                        ? 'bg-cyan-500 text-navy-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Status Gatekeeper Callout */}
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                isReleased
                  ? 'bg-teal-950/40 border-teal-500/40 text-teal-200'
                  : isApproved
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {isReleased ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                ) : isApproved ? (
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                )}
                <span>
                  {isReleased
                    ? 'BROADCAST RELEASED to citizen emergency channels.'
                    : isApproved
                    ? 'APPROVED BY COMMISSIONER: Ready for release.'
                    : 'BROADCAST LOCKED: Awaiting Commissioner approval.'}
                </span>
              </div>
              <span className="font-mono text-[11px] opacity-75">
                {isReleased ? 'ACTIVE' : isApproved ? 'ARMED' : 'LOCKED'}
              </span>
            </div>

            {/* Trilingual Preview Card */}
            <div className="p-4 rounded-xl bg-navy-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
                <span>Language: <strong className="text-cyan-400">{currentPreview.language}</strong></span>
                <span>Location: Narendra Nagar Subway</span>
              </div>

              {/* Headline */}
              <div className="text-sm font-extrabold text-rose-300">
                {currentPreview.headline}
              </div>

              {/* Emergency Message */}
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                {currentPreview.message}
              </p>

              {/* Safety Instructions */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
                <span className="text-amber-400 font-semibold block text-[11px]">
                  Safety Instructions / सुरक्षिततेचे नियम:
                </span>
                <span className="text-slate-300">{currentPreview.safetyInstructions}</span>
              </div>

              {/* Channels */}
              <div className="text-[11px] text-slate-400 font-mono pt-1">
                Channels: SMS Gateway • WhatsApp Citizen Bot • City VMD Displays • AIR Nagpur FM
              </div>
            </div>
          </div>

          {/* Release Button (Strict Gatekeeping) */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={handleReleaseAlerts}
              disabled={!isApproved || isReleasing || isReleased}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isReleased
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/40 cursor-default'
                  : isApproved
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-xl shadow-rose-950 cursor-pointer animate-pulse'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>
                {isReleased
                  ? 'EMERGENCY BROADCAST ALREADY RELEASED'
                  : isApproved
                  ? 'RELEASE EMERGENCY BROADCAST (CITIZEN CHANNELS)'
                  : 'APPROVE PLAN FIRST TO UNLOCK BROADCAST'}
              </span>
            </button>
            <p className="text-[11px] text-center text-slate-500 font-mono">
              * Simulated hackathon demonstration. No actual telecommunication dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* REVISE MODAL */}
      {showReviseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-navy-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
              <RotateCcw className="w-5 h-5" />
              <span>Commissioner Revision Directive</span>
            </div>
            <p className="text-xs text-slate-300">
              Provide specific operational instructions to the AI Planner Agent before resubmitting for approval.
            </p>
            <textarea
              rows={3}
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-navy-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReviseModal(false)}
                className="px-4 py-2 rounded-lg bg-navy-800 text-slate-400 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('REVISE', revisionFeedback)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-navy-950 font-bold text-xs hover:bg-amber-400"
              >
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
