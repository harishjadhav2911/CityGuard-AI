import React, { useState, useEffect } from 'react';
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Clock,
  Shield,
  RefreshCw,
  Cpu,
  Radio,
  Stamp,
  Activity
} from 'lucide-react';
import { api } from '../services/api';

export default function AuditPage({ showToast }) {
  const [logs, setLogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      const data = await api.getAuditLogs(selectedCategory === 'ALL' ? null : selectedCategory);
      setLogs(data);
    } catch (e) {
      console.error('Failed to load audit logs:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedCategory]);

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.actor?.toLowerCase().includes(term) ||
      log.action?.toLowerCase().includes(term) ||
      log.details?.toLowerCase().includes(term)
    );
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cityguard_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    if (showToast) showToast('Audit logs exported successfully as JSON', 'success');
  };

  const categories = ['ALL', 'AGENT', 'SIGNAL', 'SIMULATION', 'APPROVAL', 'ALERT', 'SYSTEM'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              Activity & Audit Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
              TAMPER-EVIDENT RECORD
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Chronological audit trail of agent inferences, sensor signal updates, digital twin runs, Commissioner decisions, and citizen broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={fetchLogs}
            disabled={refreshing}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 border border-slate-700 text-xs transition-all"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-navy-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search actor or action..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table / Cards */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950/80 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details & Event Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-navy-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap text-[11px]">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : '2026-10-31 17:30:00'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.category === 'APPROVAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : log.category === 'AGENT'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : log.category === 'SIMULATION'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : log.category === 'ALERT'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-cyan-300 whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200 whitespace-nowrap text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs">
              No audit log entries matching criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
