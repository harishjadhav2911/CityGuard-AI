import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Cpu,
  GitCompare,
  Building2,
  Wheat,
  Stamp,
  ScrollText,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, counts = {} }) {
  const navItems = [
    {
      id: 'overview',
      name: 'City Overview',
      icon: LayoutDashboard,
      badge: 'Nagpur',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      id: 'signals',
      name: 'Live Signals',
      icon: Radio,
      badge: '3 Feeds',
      badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    },
    {
      id: 'agents',
      name: 'AI Agent Control Center',
      icon: Cpu,
      badge: '10 Agents',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    },
    {
      id: 'digital-twin',
      name: 'AI Planner & Digital Twin',
      icon: GitCompare,
      badge: 'Plan A/B',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      id: 'departments',
      name: 'Department Action Center',
      icon: Building2,
      badge: counts.tasks ? `${counts.tasks} Tasks` : '4 Depts',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'farmer',
      name: 'Farmer Protection',
      icon: Wheat,
      badge: 'Maharashtra',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'approvals',
      name: 'Commissioner & Alerts',
      icon: Stamp,
      badge: counts.pendingApproval ? 'Pending Sign-off' : 'Enforced Gate',
      badgeColor: counts.pendingApproval ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse' : 'bg-slate-700 text-slate-300 border-slate-600'
    },
    {
      id: 'audit',
      name: 'Activity & Audit Logs',
      icon: ScrollText,
      badge: 'Immutable',
      badgeColor: 'bg-slate-800 text-slate-400 border-slate-700'
    }
  ];

  return (
    <aside className="w-full lg:w-72 bg-navy-900 border-r border-slate-800/80 flex flex-col shrink-0">
      {/* City Status Badge */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="p-3 rounded-xl bg-gradient-to-br from-navy-950 to-navy-850 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Nagpur Monsoon Alert</div>
              <div className="text-[11px] text-rose-400 font-mono">Orange Warning Active</div>
            </div>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
            74/100
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          Command Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-cyan-500/10 to-transparent text-cyan-300 border-l-4 border-cyan-400 shadow-lg shadow-cyan-950/50'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-navy-800/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer system specs */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>Engine Status</span>
          <span className="text-teal-400">ONLINE</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Simulation Model</span>
          <span className="text-cyan-400">NMC-v1.0</span>
        </div>
      </div>
    </aside>
  );
}
