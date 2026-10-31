import React, { useState, useEffect } from 'react';
import {
  Building2,
  Shield,
  Truck,
  HeartPulse,
  ShieldAlert,
  Wheat,
  CheckCircle,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function DepartmentsPage({ showToast }) {
  const [tasks, setTasks] = useState([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchTasks = async () => {
    try {
      const data = await api.getDepartmentTasks(selectedDept === 'All' ? null : selectedDept);
      setTasks(data || []);
    } catch {
      // Fallback
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
        showToast(`Task ${taskId} status transitioned to "${newStatus}"`, 'success', 'Task Updated');
      }
    } catch {
      if (showToast) showToast('Failed to update task status', 'error');
    }
  };

  const departments = [
    { id: 'All', name: 'All Departments', icon: Building2 },
    { id: 'Traffic', name: 'Traffic Department', icon: Shield },
    { id: 'Municipal', name: 'Municipal Department', icon: Truck },
    { id: 'Health', name: 'Health Department', icon: HeartPulse },
    { id: 'Police', name: 'Police Department', icon: ShieldAlert },
    { id: 'Agriculture', name: 'Agriculture Department', icon: Wheat },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (selectedStatus === 'All') return true;
    return t.status === selectedStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              Department Action Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
              5 DEPARTMENTS
            </span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            Inter-agency operational tasking automatically formulated from selected disaster response plans.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-300 text-xs text-gray-800 focus:outline-none focus:border-amber-500 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Department Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {departments.map((dept) => {
          const Icon = dept.icon;
          const isSelected = selectedDept === dept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-amber-600' : 'text-gray-400'}`} />
              <span className="truncate">{dept.name}</span>
            </button>
          );
        })}
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all shadow-sm space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-800">{task.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-gray-100 text-gray-700 border border-gray-200">
                      {task.department}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mt-1">{task.title}</h3>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      task.priority === 'Critical'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : task.priority === 'High'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <span className="text-[10px] font-mono text-gray-500">
                    Status: <strong className="text-gray-900 font-semibold">{task.status}</strong>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed">
                <span className="text-amber-800 font-semibold block mb-0.5">Recommended Action:</span>
                {task.recommendedAction}
              </div>

              <div className="text-[11px] text-gray-500 flex items-center justify-between pt-1">
                <span>Assigned Unit: <strong className="text-gray-800 font-sans">{task.assignedUnits}</strong></span>
                <span className="font-mono text-gray-400">{task.relatedIncidentId}</span>
              </div>
            </div>

            {/* Quick Status Transition Buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 text-xs">
              {task.status !== 'In Progress' && task.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200 font-semibold transition-all"
                >
                  Mark In Progress
                </button>
              )}
              {task.status !== 'Completed' && (
                <button
                  onClick={() => handleUpdateStatus(task.id, 'Completed')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center gap-1 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
              )}
              {task.status === 'Completed' && (
                <span className="text-emerald-700 font-mono flex items-center gap-1 font-semibold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
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
