import React, { useState, useEffect } from 'react';
import {
  Building2,
  Shield,
  Truck,
  HeartPulse,
  Wheat,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function DepartmentsPage({ showToast }) {
  const [tasks, setTasks] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await api.getDepartmentTasks(selectedDept === 'All' ? null : selectedDept);
      setTasks(data);
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDept]);

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
      if (showToast) {
        showToast(`Task ${taskId} status transitioned to "${newStatus}"`, 'success');
      }
    } catch (e) {
      if (showToast) showToast('Failed to update task status', 'error');
    }
  };

  const departments = [
    { id: 'All', name: 'All Departments', icon: Building2 },
    { id: 'Traffic', name: 'Traffic Police', icon: Shield },
    { id: 'MunicipalWorks', name: 'Municipal Works (NMC)', icon: Truck },
    { id: 'Health', name: 'Health & EMS', icon: HeartPulse },
    { id: 'Agriculture', name: 'Agriculture Dept', icon: Wheat },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedStatus === 'All') return true;
    return t.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-navy-900 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-white">
              Department Action Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              SIMULATED DISPATCHES
            </span>
          </div>
          <p className="text-slate-400 text-xs md:text-sm mt-1">
            Inter-agency operational tasking automatically formulated from selected disaster response plans.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {departments.map((dept) => {
          const Icon = dept.icon;
          const isSelected = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-950/40'
                  : 'bg-navy-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-navy-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span className="truncate">{dept.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-navy-900/90 border border-slate-800 hover:border-slate-700 transition-all shadow-lg space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{task.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
                      {task.department}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm mt-1">{task.title}</h3>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.priority === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : task.priority === 'High'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Status: <strong className="text-slate-200">{task.status}</strong>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-navy-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="text-cyan-400 font-semibold block mb-0.5">Recommended Action:</span>
                {task.recommendedAction}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                <span>Assigned Unit: <strong className="text-slate-200">{task.assignedUnits}</strong></span>
                <span className="font-mono text-slate-500">{task.relatedIncidentId}</span>
              </div>
            </div>

            {/* Quick Status Transition Buttons */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
              {task.status !== 'In Progress' && task.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-cyan-300 border border-cyan-500/30 font-medium transition-all"
                >
                  Mark In Progress
                </button>
              )}
              {task.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateStatus(task.id, 'Completed')}
                  className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold transition-all flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
              )}
              {task.status === 'Completed' && (
                <span className="text-teal-400 font-mono flex items-center gap-1 font-semibold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed & Logged</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
