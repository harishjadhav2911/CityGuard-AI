import React, { useState, useEffect } from 'react';
import {
  Stamp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  AlertTriangle,
  Radio,
  Send,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function ApprovalsPage({ showToast, onRefreshHeader }) {
  const [approvalState, setApprovalState] = useState(null);
  const [alertData, setAlertData] = useState(null);
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
    } catch {
      // Fallback
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
        showToast(
          res.message,
          actionType === 'APPROVE' ? 'success' : actionType === 'REJECT' ? 'error' : 'info',
          `Commissioner Action: ${actionType}`
        );
      }

      await fetchData();
      if (onRefreshHeader) onRefreshHeader();
    } catch {
      if (showToast) showToast('Failed to execute Commissioner action', 'error');
    } finally {
      setIsProcessing(false);
      setShowReviseModal(false);
    }
  };

  const handleReleaseAlerts = async () => {
    setIsReleasing(true);
    try {
      await api.releaseAlerts();
      if (showToast) {
        showToast(
          'Emergency Trilingual Citizen Alerts officially RELEASED to broadcast channels!',
          'success',
          'Broadcast Activated'
        );
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
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                Commissioner Approval & Citizen Alerts Gatekeeper
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : approvalState?.status === 'REJECTED'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                STATUS: {approvalState?.status || 'PENDING SIGN-OFF'}
              </span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm mt-1">
              Statutory human-in-the-loop governance. Emergency public broadcasts remain locked until authorized by the Municipal Commissioner.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">Authority:</span>
            <input
              type="text"
              value={officerName}
              onChange={(e) => setOfficerName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-xs text-gray-800 font-medium focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Grid: Commissioner Review Desk (Left) vs Citizen Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: COMMISSIONER DECISION DESK */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Stamp className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-gray-900 text-base">
                  Emergency Response Plan Review
                </h2>
              </div>
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                {approvalState?.currentPlanId || 'PLAN-A'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                {approvalState?.selectedPlanTitle || 'Immediate Subway Closure & Ring Road Diversion'}
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Strategy: <strong>{approvalState?.planSummary?.strategyType}</strong> • Simulated Residual Risk:{' '}
                <strong className="text-emerald-700">{approvalState?.planSummary?.simulatedRiskScore}/100</strong>
              </p>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-center">
              <div>
                <div className="text-[10px] text-gray-500">Public Safety Score</div>
                <div className="text-lg font-bold text-emerald-700 font-mono">
                  {100 - (approvalState?.planSummary?.simulatedRiskScore || 28)}%
                </div>
                <div className="text-[10px] text-gray-400">Zero drowning risk</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Detour Impact</div>
                <div className="text-lg font-bold text-amber-800 font-mono">
                  +{approvalState?.planSummary?.trafficDelayMins || 18} mins
                </div>
                <div className="text-[10px] text-gray-400">Ring Rd routing</div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500">Deployment ETA</div>
                <div className="text-lg font-bold text-gray-900 font-mono">
                  {approvalState?.planSummary?.estimatedResponseMins || 12} mins
                </div>
                <div className="text-[10px] text-gray-400">Traffic marshals</div>
              </div>
            </div>

            {/* AI Explanation & Trade-off */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
              <span className="text-amber-900 font-bold block">AI Planner Rationale & Explanation:</span>
              <p className="text-amber-800 leading-relaxed">
                {approvalState?.planSummary?.tradeOff || 'Eliminates citizen vehicle submergence; minor Ring Road detour.'}
              </p>
            </div>

            {/* Commissioner Directive Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-600 font-medium">Commissioner Directives / Notes:</label>
              <textarea
                rows={2}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="e.g. Approved. Deploy extra marshals at Shatabdi Sq junction to regulate right turns."
                className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Action Buttons: APPROVE, REVISE, REJECT */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
            <button
              onClick={() => handleAction('APPROVE')}
              disabled={isProcessing}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>APPROVE</span>
            </button>

            <button
              onClick={() => setShowReviseModal(true)}
              disabled={isProcessing}
              className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REVISE</span>
            </button>

            <button
              onClick={() => handleAction('REJECT', 'Rejected by Commissioner')}
              disabled={isProcessing}
              className="py-2.5 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <XCircle className="w-4 h-4" />
              <span>REJECT</span>
            </button>
          </div>
        </div>

        {/* RIGHT: TRILINGUAL CITIZEN ALERTS DISPATCHER */}
        <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-amber-600" />
                <h2 className="font-bold text-gray-900 text-base">
                  Multilingual Citizen Broadcast
                </h2>
              </div>

              {/* Language Switcher Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs">
                {[
                  { id: 'en', label: 'English' },
                  { id: 'mr', label: 'मराठी' },
                  { id: 'hi', label: 'हिन्दी' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLang(l.id)}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${
                      activeLang === l.id
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
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
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : isApproved
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center gap-2">
                {isReleased ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isApproved ? (
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                )}
                <span>
                  {isReleased
                    ? 'BROADCAST RELEASED to citizen emergency channels.'
                    : isApproved
                    ? 'PLAN APPROVED: Broadcast unlocked & ready for release.'
                    : 'BROADCAST LOCKED: Awaiting Commissioner approval.'}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold">
                {isReleased ? 'ACTIVE' : isApproved ? 'ARMED' : 'LOCKED'}
              </span>
            </div>

            {/* Trilingual Preview Card */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-gray-500 border-b border-gray-200 pb-2">
                <span>Language: <strong className="text-gray-900">{currentPreview.language}</strong></span>
                <span>Location: Narendra Nagar Subway</span>
              </div>

              {/* Headline */}
              <div className="text-sm font-extrabold text-red-700">
                {currentPreview.headline}
              </div>

              {/* Emergency Message */}
              <p className="text-xs text-gray-800 leading-relaxed font-sans">
                {currentPreview.message}
              </p>

              {/* Safety Instructions */}
              <div className="p-3 rounded-lg bg-white border border-gray-200 text-xs space-y-1">
                <span className="text-amber-900 font-bold block text-[11px]">
                  Safety Instructions / सुरक्षिततेचे नियम:
                </span>
                <span className="text-gray-700">{currentPreview.safetyInstructions}</span>
              </div>

              {/* Channels */}
              <div className="text-[11px] text-gray-500 font-mono pt-1">
                Channels: SMS Gateway • WhatsApp Citizen Bot • City VMD Displays • AIR Nagpur FM
              </div>
            </div>
          </div>

          {/* Release Button (Strict Gatekeeping) */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <button
              onClick={handleReleaseAlerts}
              disabled={!isApproved || isReleasing || isReleased}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                isReleased
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default'
                  : isApproved
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm cursor-pointer'
                  : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
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
            <p className="text-[11px] text-center text-gray-400 font-mono">
              * Simulated hackathon demonstration. No actual telecom carrier SMS dispatches.
            </p>
          </div>
        </div>
      </div>

      {/* REVISE MODAL */}
      {showReviseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Commissioner Revision Directive</span>
            </div>
            <p className="text-xs text-gray-600">
              Provide operational instructions to the AI Planner Agent before resubmitting for approval.
            </p>
            <textarea
              rows={3}
              value={revisionFeedback}
              onChange={(e) => setRevisionFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-300 text-xs text-gray-900 focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowReviseModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-xs hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction('REVISE', revisionFeedback)}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 shadow-sm"
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
