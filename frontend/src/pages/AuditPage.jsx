import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function AuditPage({ showToast }) {
  const [logs, setLogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    try {
      setRefreshing(true);
      const data = await api.getAuditLogs(selectedCategory === 'ALL' ? null : selectedCategory);
      setLogs(data || []);
    } catch {
      // Fallback
    } finally {
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
    if (showToast) showToast('Audit logs exported successfully as JSON', 'success', 'Audit Exported');
  };

  const categories = ['ALL', 'APPROVAL', 'AGENT', 'SIGNAL', 'SIMULATION', 'ALERT', 'SYSTEM'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Activity & Audit Logs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              TAMPER-EVIDENT TRAIL
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Chronological audit trail of agent inferences, sensor signals, Commissioner approvals, work order dispatches, and public broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={fetchLogs}
            disabled={refreshing}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 text-xs transition-all"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 text-amber-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-white font-bold shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search actor or action..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-amber-500 text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Details & Event Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap text-[11px]">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : 'Live'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        log.category === 'APPROVAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : log.category === 'AGENT'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : log.category === 'SIMULATION'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : log.category === 'ALERT'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 whitespace-nowrap">
                    {log.actor}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700 whitespace-nowrap text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-gray-600 max-w-md truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-xs">
              No audit log entries matching criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
