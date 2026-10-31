// ============================================================================
// CITYGUARD AI - FRONTEND API & DATA SERVICE LAYER
// Seamlessly connects to FastAPI backend or falls back to structured mock data.
// Complies with API_CONTRACT.md
// ============================================================================

import {
  mockOverviewData,
  mockWeatherSignals,
  mockCitizenReports,
  mockTrafficSignals,
  mockFarmerReports,
  mockAgentsStatus,
  mockUrbanControlData,
  mockRuralIntelligenceData,
  mockSimulationPlans,
  mockDepartmentTasks,
  mockApprovalState,
  mockAlertPreviews,
  mockAuditLogs,
  mockGovernmentSchemes
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

// Mutable in-memory store for offline fallback / interactive demo state
let localOverview = { ...mockOverviewData };
let localCitizenReports = [...mockCitizenReports];
let localTrafficSignals = [...mockTrafficSignals];
let localFarmerReports = [...mockFarmerReports];
let localAgents = [...mockAgentsStatus];
let localTasks = [...mockDepartmentTasks];
let localApprovalState = { ...mockApprovalState };
let localAlerts = { ...mockAlertPreviews };
let localAuditLogs = [...mockAuditLogs];
let localSimulation = { ...mockSimulationPlans };

let backendConnected = false;

async function fetchJson(endpoint, options = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s quick timeout before mock fallback

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errorBody.detail || `Request failed with status ${res.status}`);
    }
    backendConnected = true;
    return await res.json();
  } catch {
    // Graceful offline fallback to mock data
    backendConnected = false;
    return null; // Return null so caller triggers fallback
  }
}

export const api = {
  // Connection status
  isBackendConnected: () => backendConnected,

  // 1. Health & Overview
  getHealth: async () => {
    const remote = await fetchJson('/health');
    if (remote) return remote;
    return {
      status: "healthy (simulated)",
      service: "CITYGUARD AI Frontend Mock Engine",
      version: "1.0.0",
      city: "Nagpur, Maharashtra",
      timestamp: new Date().toISOString()
    };
  },

  getOverview: async () => {
    const remote = await fetchJson('/overview');
    if (remote) return remote;
    return localOverview;
  },

  // 2. Live Civic & Sensor Signals
  getWeatherSignals: async () => {
    const remote = await fetchJson('/signals/weather');
    if (remote) return remote;
    return mockWeatherSignals;
  },

  getCitizenReports: async () => {
    const remote = await fetchJson('/signals/citizen-reports');
    if (remote) return remote;
    return localCitizenReports;
  },

  createCitizenReport: async (payload) => {
    const remote = await fetchJson('/signals/citizen-reports', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (remote) {
      localCitizenReports.unshift(remote);
      return remote;
    }
    const newReport = {
      id: `CR-NGP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      category: payload.category || "General Grievance",
      location: payload.location || "Nagpur Urban Zone",
      ward: payload.ward || "Central Ward",
      waterDepthFeet: parseFloat(payload.waterDepthFeet || 1.0),
      severity: payload.severity || "Moderate",
      status: "Verified",
      description: payload.description || "Report submitted via CityGuard AI",
      coordinates: payload.coordinates || { lat: 21.1200, lng: 79.0800 },
      division: "URBAN"
    };
    localCitizenReports.unshift(newReport);
    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "SIGNAL",
      actor: "CitizenSignalFeed",
      action: "SUBMIT_CITIZEN_REPORT",
      details: `New report ${newReport.id} received at ${newReport.location}: ${newReport.description}`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });
    return newReport;
  },

  getTrafficSignals: async () => {
    const remote = await fetchJson('/signals/traffic');
    if (remote) return remote;
    return localTrafficSignals;
  },

  getFarmerReports: async () => {
    return localFarmerReports;
  },

  createFarmerReport: async (payload) => {
    const newReport = {
      id: `FRM-MAH-${Math.floor(100 + Math.random() * 900)}`,
      farmerName: payload.farmerName || "Farmer",
      district: payload.district || "Nagpur",
      taluka: payload.taluka || "Hingna",
      village: payload.village || "Local Village",
      category: payload.category || "Crop Damage",
      crop: payload.crop || "Nagpur Santra",
      acreageAffected: parseFloat(payload.acreageAffected || 1.0),
      description: payload.description || "Agro-damage report logged",
      photoName: payload.photoName || null,
      timestamp: new Date().toISOString(),
      status: "Assigned for Panchnama",
      division: "RURAL"
    };
    localFarmerReports.unshift(newReport);
    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "SIGNAL",
      actor: "FarmerAssistancePortal",
      action: "SUBMIT_FARMER_GRIEVANCE",
      details: `Grievance ${newReport.id} logged for ${newReport.crop} at ${newReport.village}, ${newReport.taluka}`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });
    return newReport;
  },

  // 3. AI Agent Control Center
  getAgentsStatus: async () => {
    const remote = await fetchJson('/agents/status');
    if (remote && remote.agents) return remote;
    return {
      totalAgents: 10,
      activeCount: 10,
      agents: localAgents
    };
  },

  triggerAgentCycle: async () => {
    const remote = await fetchJson('/agents/trigger-cycle', { method: 'POST' });
    if (remote) return remote;

    const duration = Math.floor(280 + Math.random() * 120);
    localOverview.recentAgentActivity.unshift({
      agent: "OrchestratorAgent",
      action: `Coordinated all 10 specialized agent intelligence layers in ${duration}ms.`,
      timestamp: new Date().toISOString()
    });

    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "AGENT",
      actor: "OrchestratorAgent",
      action: "TRIGGER_COORDINATION_CYCLE",
      details: `Executed full coordination cycle across 10 agents in ${duration}ms.`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      cycleId: `CYC-${Date.now()}`,
      durationMs: duration,
      compositeRiskScore: 74,
      riskLevel: "High",
      agents: localAgents
    };
  },

  // 4. Urban Control Room Specifics
  getUrbanControlData: async () => {
    return mockUrbanControlData;
  },

  // 5. Rural Intelligence Specifics
  getRuralIntelligenceData: async () => {
    return mockRuralIntelligenceData;
  },

  // 6. Simulation & Digital Twin
  getCurrentPlans: async () => {
    const remote = await fetchJson('/simulation/current');
    if (remote) return remote;
    return localSimulation;
  },

  runSimulation: async (params) => {
    const remote = await fetchJson('/simulation/run', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    if (remote) {
      localSimulation = remote;
      return remote;
    }

    const rain = params.rainfallMmHr || 65.0;
    const depth = params.underpassDepthFeet || 3.8;

    // Dynamically adjust risk score based on rain and depth
    const riskA = Math.min(Math.round(20 + (rain * 0.12) + (depth * 2.2)), 45);
    const riskB = Math.min(Math.round(42 + (rain * 0.25) + (depth * 4.5)), 90);

    localSimulation = {
      incidentId: "INC-NGP-2026-089",
      incidentTitle: "Narendra Nagar Subway Flash Submergence",
      location: "Narendra Nagar Railway Underpass (Wardha Rd)",
      timestamp: new Date().toISOString(),
      recommendedPlan: "PLAN-A",
      aiExplanation: `Simulated for ${rain} mm/hr rain and ${depth} ft water depth. Plan A provides superior casualty suppression.`,
      planA: {
        ...localSimulation.planA,
        simulatedRiskScore: riskA,
        trafficImpactDelayMins: Math.round(15 + (rain * 0.05)),
      },
      planB: {
        ...localSimulation.planB,
        simulatedRiskScore: riskB,
        trafficImpactDelayMins: 6,
      }
    };

    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "SIMULATION",
      actor: "SimulationEngine",
      action: "EVALUATE_SCENARIO",
      details: `Ran digital twin simulation: ${rain} mm/hr rainfall against Narendra Nagar catchment.`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });

    return localSimulation;
  },

  selectPlan: async (payload) => {
    const remote = await fetchJson('/simulation/select-plan', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (remote) return remote;

    const planId = payload.selectedPlanId;
    localApprovalState.currentPlanId = planId;
    localApprovalState.status = "SELECTED";
    localApprovalState.selectedPlanTitle =
      planId === "PLAN-A" ? localSimulation.planA.title : localSimulation.planB.title;
    localApprovalState.planSummary =
      planId === "PLAN-A"
        ? {
            strategyType: localSimulation.planA.strategyType,
            simulatedRiskScore: localSimulation.planA.simulatedRiskScore,
            trafficDelayMins: localSimulation.planA.trafficImpactDelayMins,
            estimatedResponseMins: localSimulation.planA.estimatedResponseTimeMins,
            tradeOff: localSimulation.planA.tradeOff,
            resources: localSimulation.planA.departmentResources,
          }
        : {
            strategyType: localSimulation.planB.strategyType,
            simulatedRiskScore: localSimulation.planB.simulatedRiskScore,
            trafficDelayMins: localSimulation.planB.trafficImpactDelayMins,
            estimatedResponseMins: localSimulation.planB.estimatedResponseTimeMins,
            tradeOff: localSimulation.planB.tradeOff,
            resources: localSimulation.planB.departmentResources,
          };

    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "SIMULATION",
      actor: "PlannerAgent",
      action: "SELECT_RESPONSE_PLAN",
      details: `Forwarded ${planId} to Commissioner for authorization.`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      selectedPlanId: planId,
      message: `Successfully forwarded ${planId} to Municipal Commissioner for review.`
    };
  },

  // 7. Department Action Center
  getDepartmentTasks: async (dept) => {
    const remote = await fetchJson(dept ? `/departments/tasks?department=${encodeURIComponent(dept)}` : '/departments/tasks');
    if (remote) return remote;
    if (!dept || dept === 'All') return localTasks;
    return localTasks.filter(t => t.department.toLowerCase().includes(dept.toLowerCase()));
  },

  updateTaskStatus: async (taskId, status) => {
    const remote = await fetchJson(`/departments/tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (remote) {
      localTasks = localTasks.map(t => t.id === taskId ? { ...t, status } : t);
      return remote;
    }

    localTasks = localTasks.map(t => t.id === taskId ? { ...t, status } : t);
    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "SYSTEM",
      actor: "DepartmentOfficer",
      action: "UPDATE_TASK_STATUS",
      details: `Task ${taskId} updated to "${status}".`,
      severity: "INFO",
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      taskId,
      newStatus: status,
      message: `Task ${taskId} updated to ${status}`
    };
  },

  // 8. Commissioner Approvals & Citizen Alerts
  getApprovalState: async () => {
    const remote = await fetchJson('/approvals/current');
    if (remote) return remote;
    return localApprovalState;
  },

  executeApprovalAction: async (payload) => {
    const remote = await fetchJson('/approvals/action', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (remote) {
      localApprovalState.status = remote.newStatus;
      localApprovalState.canReleaseAlerts = remote.canReleaseAlerts;
      localAlerts.isApproved = remote.newStatus === 'APPROVED';
      return remote;
    }

    const action = payload.action?.toUpperCase();
    const now = new Date().toISOString();

    if (action === 'APPROVE') {
      localApprovalState.status = "APPROVED";
      localApprovalState.officerName = payload.officerName;
      localApprovalState.reviewedAt = now;
      localApprovalState.notes = payload.notes || "Approved by Municipal Commissioner for immediate execution.";
      localApprovalState.canReleaseAlerts = true;
      localAlerts.isApproved = true;

      // Advance tasks to Assigned
      localTasks = localTasks.map(t => t.status === "Pending Approval" ? { ...t, status: "Assigned" } : t);

      localAuditLogs.unshift({
        id: localAuditLogs.length + 1,
        category: "APPROVAL",
        actor: payload.officerName || "Municipal Commissioner",
        action: "COMMISSIONER_APPROVE",
        details: `APPROVED emergency plan ${payload.planId}. Notes: ${payload.notes || "Ready for deployment."}`,
        severity: "SUCCESS",
        timestamp: now
      });

      return {
        success: true,
        planId: payload.planId,
        newStatus: "APPROVED",
        canReleaseAlerts: true,
        message: `Plan ${payload.planId} successfully APPROVED by Commissioner. Alerts are now cleared for broadcast.`
      };
    } else if (action === 'REJECT') {
      localApprovalState.status = "REJECTED";
      localApprovalState.reviewedAt = now;
      localApprovalState.notes = payload.notes || "Rejected by Commissioner.";
      localApprovalState.canReleaseAlerts = false;
      localAlerts.isApproved = false;
      localAlerts.isReleased = false;

      localAuditLogs.unshift({
        id: localAuditLogs.length + 1,
        category: "APPROVAL",
        actor: payload.officerName || "Municipal Commissioner",
        action: "COMMISSIONER_REJECT",
        details: `REJECTED emergency plan ${payload.planId}. Reason: ${payload.notes}`,
        severity: "CRITICAL",
        timestamp: now
      });

      return {
        success: true,
        planId: payload.planId,
        newStatus: "REJECTED",
        canReleaseAlerts: false,
        message: `Plan ${payload.planId} REJECTED by Commissioner. No alerts can be broadcast.`
      };
    } else if (action === 'REVISE') {
      localApprovalState.status = "REVISION_REQUESTED";
      localApprovalState.reviewedAt = now;
      localApprovalState.notes = payload.notes || "Revision requested by Commissioner.";
      localApprovalState.canReleaseAlerts = false;
      localAlerts.isApproved = false;

      localAuditLogs.unshift({
        id: localAuditLogs.length + 1,
        category: "APPROVAL",
        actor: payload.officerName || "Municipal Commissioner",
        action: "COMMISSIONER_REVISE",
        details: `REVISION REQUESTED on plan ${payload.planId}. Directives: ${payload.notes}`,
        severity: "WARNING",
        timestamp: now
      });

      return {
        success: true,
        planId: payload.planId,
        newStatus: "REVISION_REQUESTED",
        canReleaseAlerts: false,
        message: `Revision directives submitted for Plan ${payload.planId}. Plan remains locked until re-approved.`
      };
    }

    return { success: false, message: "Unknown action" };
  },

  getAlertPreviews: async () => {
    const remote = await fetchJson('/alerts/previews');
    if (remote) return remote;
    return localAlerts;
  },

  releaseAlerts: async () => {
    const remote = await fetchJson('/alerts/release', { method: 'POST' });
    if (remote) {
      localAlerts.isReleased = true;
      return remote;
    }

    if (localApprovalState.status !== 'APPROVED') {
      throw new Error("ACTION FORBIDDEN: Alerts cannot be released before Commissioner approval. Current plan status is not APPROVED.");
    }

    localAlerts.isReleased = true;
    localAlerts.releasedAt = new Date().toISOString();

    localAuditLogs.unshift({
      id: localAuditLogs.length + 1,
      category: "ALERT",
      actor: "AlertDispatcherAgent",
      action: "RELEASE_CITIZEN_ALERT",
      details: "Released multilingual emergency alerts across SMS, WhatsApp, and VMDs for Narendra Nagar Subway.",
      severity: "SUCCESS",
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      isReleased: true,
      releasedAt: localAlerts.releasedAt,
      channelsActivated: localAlerts.broadcastChannels,
      message: "Emergency alerts successfully broadcast to citizen channels (Simulated Demonstration)."
    };
  },

  // 9. Farmer Protection & Intelligence
  getFarmerDistricts: async () => {
    const remote = await fetchJson('/farmer/districts');
    if (remote) return remote;
    return [
      { id: "nagpur", name: "Nagpur", region: "Vidarbha", talukas: ["Hingna", "Saoner", "Katol", "Kalmeshwar", "Umred", "Ramtek", "Narkhed", "Kamptee"], majorCrops: ["Nagpur Santra", "Cotton", "Soybean"] },
      { id: "amravati", name: "Amravati", region: "Vidarbha (Orange Belt)", talukas: ["Achalpur", "Morshi", "Warud", "Chandur Bazar", "Daryapur"], majorCrops: ["Mandarin Orange", "Cotton", "Soybean"] },
      { id: "yavatmal", name: "Yavatmal", region: "Vidarbha (Cotton Belt)", talukas: ["Yavatmal", "Pusad", "Umarkhed", "Wani", "Ghatanji"], majorCrops: ["Bt Cotton", "Soybean", "Tur"] },
      { id: "nashik", name: "Nashik", region: "North Maharashtra", talukas: ["Niphad", "Dindori", "Yeola", "Sinnar", "Malegaon"], majorCrops: ["Table Grapes", "Onion", "Tomatoes"] },
      { id: "solapur", name: "Solapur", region: "Western Maharashtra", talukas: ["Pandharpur", "Barshi", "Madha", "Karmala", "Sangola"], majorCrops: ["Pomegranate (Bhagwa)", "Sugarcane", "Jowar"] }
    ];
  },

  getFarmerIntelligence: async (district, taluka) => {
    let url = `/farmer/intelligence?district=${encodeURIComponent(district)}`;
    if (taluka) url += `&taluka=${encodeURIComponent(taluka)}`;
    const remote = await fetchJson(url);
    if (remote) return remote;

    return {
      district: district || "Nagpur",
      taluka: taluka || "Hingna",
      region: "Vidarbha",
      timestamp: new Date().toISOString(),
      isSimulated: true,
      droughtIndex: district === 'Solapur' ? "Moderate Moisture Deficit" : "Adequate Moisture (Flood/Inundation Risk)",
      soilMoisturePercent: district === 'Solapur' ? 38.0 : 84.5,
      reservoirStoragePercent: district === 'Solapur' ? 48.5 : 76.2,
      reservoirName: district === 'Solapur' ? "Ujani Dam (Bhima Project)" : "Totladoh Dam (Pench Reservoir)",
      weatherAlert: "Heavy Rainfall Warning: Low-lying orchards at risk of root submergence.",
      cropRisks: [
        {
          cropName: "Nagpur Santra (Orange)",
          riskLevel: "High",
          vulnerabilityReason: "Fruit dropping and phytophthora root rot risk from prolonged water stagnation (>48 hrs).",
          estimatedAcreageAtRiskPercent: 28.5,
          recommendedIntervention: "Apply Bordeaux mixture or Metalaxyl paste to tree trunks; drain orchard perimeter ditches."
        },
        {
          cropName: "Cotton (Kapus)",
          riskLevel: "High",
          vulnerabilityReason: "Square drop and seedling asphyxiation due to heavy clay black cotton soil saturation.",
          estimatedAcreageAtRiskPercent: 34.0,
          recommendedIntervention: "Excavate inter-row drainage furrows; postpone fertilizer top-dressing until topsoil dries."
        },
        {
          cropName: "Soybean",
          riskLevel: "Moderate",
          vulnerabilityReason: "Yellowing of leaves from chlorosis in waterlogged hollows.",
          estimatedAcreageAtRiskPercent: 18.0,
          recommendedIntervention: "Foliar spray of 19:19:19 water-soluble nutrients after field drains."
        }
      ],
      irrigationAdvisory: "Suspend all canal and borewell irrigation. Ensure surface drainage channels (furrows) are desilted to drain standing water.",
      heatwaveRisk: "Low (Monsoon Season)",
      cycloneRisk: "Low (Inland Depression Cloudburst Pattern)",
      earthquakeEmergencyAssessment: "Stable (Zone II - Minor Micro-tremor Baseline)",
      pmfbyClaimGuidance: {
        scheme: "Pradhan Mantri Fasal Bima Yojana (PMFBY Maharashtra)",
        portal: "pmfby.gov.in / Crop Insurance App",
        statutoryWindowHours: 72,
        intimationRule: "Farmers must intimate crop damage within 72 hours of localized inundation or cloudburst.",
        requiredDocuments: [
          "7/12 Extract (Satbara Utara)",
          "Aadhaar Card copy",
          "Bank Passbook IFSC page",
          "Geotagged photos of inundated farm field",
          "Crop Sowing Certificate / Talathi Panchnama"
        ],
        tollFreeHelpline: "1800-200-5142 / 14447"
      }
    };
  },

  getGovernmentSchemes: async () => {
    return mockGovernmentSchemes;
  },

  // 10. Activity & Audit Logs
  getAuditLogs: async (category) => {
    const remote = await fetchJson(category && category !== 'ALL' ? `/audit/logs?category=${encodeURIComponent(category)}` : '/audit/logs');
    if (remote) return remote;
    if (!category || category === 'ALL') return localAuditLogs;
    return localAuditLogs.filter(l => l.category === category);
  }
};
