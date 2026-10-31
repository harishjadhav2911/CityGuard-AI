import React, { useState, useEffect } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import SignalsPage from './pages/SignalsPage';
import AgentsPage from './pages/AgentsPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import DepartmentsPage from './pages/DepartmentsPage';
import FarmerPage from './pages/FarmerPage';
import ApprovalsPage from './pages/ApprovalsPage';
import AuditPage from './pages/AuditPage';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [overviewData, setOverviewData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExecutingCycle, setIsExecutingCycle] = useState(false);
  const [toast, setToast] = useState(null);
  const [counts, setCounts] = useState({ tasks: 4, pendingApproval: true });

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
        tasks: data.totalDepartmentTasks || 4,
        pendingApproval: appState?.status !== 'APPROVED',
      });
    } catch (err) {
      console.warn('Overview load warning:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

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
    } catch (e) {
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
    >
      {activeTab === 'overview' && (
        <OverviewPage
          data={overviewData}
          onNavigate={setActiveTab}
          onTriggerCycle={handleTriggerCycle}
          isExecutingCycle={isExecutingCycle}
        />
      )}
      {activeTab === 'signals' && <SignalsPage showToast={showToast} />}
      {activeTab === 'agents' && (
        <AgentsPage
          onTriggerCycle={handleTriggerCycle}
          isExecutingCycle={isExecutingCycle}
          showToast={showToast}
        />
      )}
      {activeTab === 'digital-twin' && (
        <DigitalTwinPage onNavigate={setActiveTab} showToast={showToast} />
      )}
      {activeTab === 'departments' && <DepartmentsPage showToast={showToast} />}
      {activeTab === 'farmer' && <FarmerPage showToast={showToast} />}
      {activeTab === 'approvals' && (
        <ApprovalsPage showToast={showToast} onRefreshHeader={loadOverview} />
      )}
      {activeTab === 'audit' && <AuditPage showToast={showToast} />}
    </DashboardLayout>
  );
}
