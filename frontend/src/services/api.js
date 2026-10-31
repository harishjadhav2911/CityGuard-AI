// API service client for CITYGUARD AI
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[CITYGUARD API ERROR] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  getHealth: () => fetchJson('/health'),

  // Overview
  getOverview: () => fetchJson('/overview'),

  // Signals
  getWeatherSignals: () => fetchJson('/signals/weather'),
  getCitizenReports: () => fetchJson('/signals/citizen-reports'),
  getTrafficSignals: () => fetchJson('/signals/traffic'),

  // Agents
  getAgentsStatus: () => fetchJson('/agents/status'),
  triggerAgentCycle: () => fetchJson('/agents/trigger-cycle', { method: 'POST' }),

  // Simulation & Plans
  getCurrentPlans: () => fetchJson('/simulation/current'),
  runSimulation: (params) => fetchJson('/simulation/run', {
    method: 'POST',
    body: JSON.stringify(params),
  }),
  selectPlan: (payload) => fetchJson('/simulation/select-plan', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Departments
  getDepartmentTasks: (dept) => fetchJson(dept ? `/departments/tasks?department=${encodeURIComponent(dept)}` : '/departments/tasks'),
  updateTaskStatus: (taskId, status) => fetchJson(`/departments/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),

  // Farmer
  getFarmerDistricts: () => fetchJson('/farmer/districts'),
  getFarmerIntelligence: (district, taluka) => {
    let url = `/farmer/intelligence?district=${encodeURIComponent(district)}`;
    if (taluka) url += `&taluka=${encodeURIComponent(taluka)}`;
    return fetchJson(url);
  },

  // Approvals
  getApprovalState: () => fetchJson('/approvals/current'),
  executeApprovalAction: (payload) => fetchJson('/approvals/action', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),

  // Alerts
  getAlertPreviews: () => fetchJson('/alerts/previews'),
  releaseAlerts: () => fetchJson('/alerts/release', { method: 'POST' }),

  // Audit
  getAuditLogs: (category) => fetchJson(category ? `/audit/logs?category=${encodeURIComponent(category)}` : '/audit/logs'),
};
