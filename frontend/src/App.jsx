import React, { useState, useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import SignalsPage from './pages/SignalsPage';
import AgentsPage from './pages/AgentsPage';
import UrbanControlPage from './pages/UrbanControlPage';
import RuralIntelligencePage from './pages/RuralIntelligencePage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import DepartmentsPage from './pages/DepartmentsPage';
import FarmerPage from './pages/FarmerPage';
import ApprovalsPage from './pages/ApprovalsPage';
import AuditPage from './pages/AuditPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeDivision, setActiveDivision] = useState('ALL'); // 'ALL', 'URBAN', 'RURAL'
  const [overviewData, setOverviewData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExecutingCycle, setIsExecutingCycle] = useState(false);
  const [toast, setToast] = useState(null);
  const [counts, setCounts] = useState({ tasks: 5, pendingApproval: true });

  const showToast = (message, type = 'info', title = null) => {
    setToast({ message, type, title });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const loadOverview = async () => {
    try {
      setIsRefreshing(true);
      const data = await api.getOverview();
      setOverviewData(data);
      const appState = await api.getApprovalState().catch(() => null);
      setCounts({
        tasks: data.totalDepartmentTasks || 5,
        pendingApproval: appState?.status !== 'APPROVED',
      });
    } catch {
      // Fallback handled in api.js
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleSelectDivision = (division) => {
    setActiveDivision(division);
    if (division === 'URBAN' && (activeTab === 'rural' || activeTab === 'farmer')) {
      setActiveTab('urban');
    } else if (division === 'RURAL' && (activeTab === 'urban' || activeTab === 'digital-twin')) {
      setActiveTab('rural');
    }
  };

  const handleTriggerCycle = async () => {
    setIsExecutingCycle(true);
    try {
      const res = await api.triggerAgentCycle();
      showToast(
        `Swarm completed in ${res.durationMs}ms. Composite Risk: ${res.compositeRiskScore}/100 (${res.riskLevel})`,
        'success',
        'Multi-Agent Cycle Complete'
      );
      await loadOverview();
    } catch {
      showToast('Agent coordination cycle failed to complete', 'error', 'Execution Error');
    } finally {
      setIsExecutingCycle(false);
    }
  };

  return (
    <DashboardLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      onGlobalRefresh={loadOverview}
      isRefreshing={isRefreshing}
      toast={toast}
      onCloseToast={() => setToast(null)}
      counts={counts}
      activeDivision={activeDivision}
      onSelectDivision={handleSelectDivision}
    >
      {/* 1. City Overview */}
      {activeTab === 'overview' && (
        <OverviewPage
          data={overviewData}
          onNavigate={setActiveTab}
          onTriggerCycle={handleTriggerCycle}
          isExecutingCycle={isExecutingCycle}
        />
      )}

      {/* 2. Live Civic & Sensor Signals */}
      {activeTab === 'signals' && <SignalsPage showToast={showToast} />}

      {/* 3. AI Agent Control Center */}
      {activeTab === 'agents' && (
        <AgentsPage
          onTriggerCycle={handleTriggerCycle}
          isExecutingCycle={isExecutingCycle}
          showToast={showToast}
        />
      )}

      {/* 4. Urban Control Room (Nagpur City Protection) */}
      {activeTab === 'urban' && (
        <UrbanControlPage onNavigate={setActiveTab} showToast={showToast} />
      )}

      {/* 5. Rural Intelligence (Maharashtra Rural Protection) */}
      {activeTab === 'rural' && (
        <RuralIntelligencePage onNavigate={setActiveTab} showToast={showToast} />
      )}

      {/* 6. AI Planner and Digital Twin */}
      {activeTab === 'digital-twin' && (
        <DigitalTwinPage onNavigate={setActiveTab} showToast={showToast} />
      )}

      {/* 7. Department Action Center */}
      {activeTab === 'departments' && <DepartmentsPage showToast={showToast} />}

      {/* 8. Commissioner Approval and Citizen Alerts */}
      {activeTab === 'approvals' && (
        <ApprovalsPage showToast={showToast} onRefreshHeader={loadOverview} />
      )}

      {/* 9. Farmer Protection & Grievance Portal */}
      {activeTab === 'farmer' && <FarmerPage showToast={showToast} />}

      {/* 10. Activity & Audit Logs */}
      {activeTab === 'audit' && <AuditPage showToast={showToast} />}
    </DashboardLayout>
  );
}
