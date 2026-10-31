import React from 'react';
import {
  LayoutDashboard,
  Radio,
  Cpu,
  Building,
  Wheat,
  GitCompare,
  Building2,
  Stamp,
  HeartHandshake,
  ScrollText,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, counts = {}, activeDivision }) {
  const allNavItems = [
    {
      id: 'overview',
      name: '1. City Overview',
      division: 'ALL',
      icon: LayoutDashboard,
      badge: 'Nagpur',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'signals',
      name: '2. Live Signals',
      division: 'ALL',
      icon: Radio,
      badge: '3 Sources',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      id: 'agents',
      name: '3. AI Agent Control Center',
      division: 'ALL',
      icon: Cpu,
      badge: '10 Swarm',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      id: 'urban',
      name: '4. Urban Control Room',
      division: 'URBAN',
      icon: Building,
      badge: 'Nagpur HQ',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      id: 'rural',
      name: '5. Rural Intelligence',
      division: 'RURAL',
      icon: Wheat,
      badge: '10 Districts',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'digital-twin',
      name: '6. AI Planner & Digital Twin',
      division: 'URBAN',
      icon: GitCompare,
      badge: 'Plan A/B',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'departments',
      name: '7. Department Action Center',
      division: 'ALL',
      icon: Building2,
      badge: counts.tasks ? `${counts.tasks} Tasks` : '5 Depts',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      id: 'approvals',
      name: '8. Commissioner & Alerts',
      division: 'URBAN',
      icon: Stamp,
      badge: counts.pendingApproval ? 'Sign-Off Req' : 'Locked Gate',
      badgeColor: counts.pendingApproval ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold' : 'bg-gray-100 text-gray-700 border-gray-200'
    },
    {
      id: 'farmer',
      name: '9. Farmer Protection',
      division: 'RURAL',
      icon: HeartHandshake,
      badge: 'PMFBY 72h',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'audit',
      name: '10. Activity & Audit Logs',
      division: 'ALL',
      icon: ScrollText,
      badge: 'Audit Trail',
      badgeColor: 'bg-gray-100 text-gray-700 border-gray-200'
    }
  ];

  // Filter items if user selected specific division
  const filteredNavItems = allNavItems.filter(item => {
    if (!activeDivision || activeDivision === 'ALL') return true;
    if (item.division === 'ALL') return true;
    return item.division === activeDivision;
  });

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 shadow-sm">
      {/* City Status Badge Card */}
      <div className="p-3.5 border-b border-gray-200">
        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500 text-white">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">Nagpur Monsoon Alert</div>
              <div className="text-[11px] text-amber-800 font-semibold">Orange Warning Active</div>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-amber-300 text-amber-900 font-extrabold font-mono shadow-xs">
            74/100
          </span>
        </div>
      </div>

      {/* Navigation list */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 font-mono">
          Command Modules
        </div>
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all group ${
                isActive
                  ? 'bg-amber-50 text-amber-900 font-bold border-l-4 border-amber-500 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-amber-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-amber-600 translate-x-0.5' : 'text-gray-300 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer system specs */}
      <div className="p-3.5 border-t border-gray-200 text-[11px] text-gray-500 font-mono bg-gray-50">
        <div className="flex items-center justify-between text-gray-700 mb-1">
          <span>Engine Status</span>
          <span className="text-emerald-700 font-bold">ONLINE (10 Swarm)</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Primary Division</span>
          <span className="text-amber-800 font-bold">NMC Urban + Maha Rural</span>
        </div>
      </div>
    </aside>
  );
}
