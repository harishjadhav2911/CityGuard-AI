import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

export default function DashboardLayout({
  children,
  activeTab,
  onSelectTab,
  onGlobalRefresh,
  isRefreshing,
  toast,
  onCloseToast,
  counts,
  activeDivision,
  onSelectDivision
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-gray-800 font-sans">
      {/* Top Header */}
      <Header
        onGlobalRefresh={onGlobalRefresh}
        isRefreshing={isRefreshing}
        activeDivision={activeDivision}
        onSelectDivision={onSelectDivision}
      />

      {/* Main body area: Sidebar + Page content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          counts={counts}
          activeDivision={activeDivision}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-h-[calc(100vh-65px)]">
          {children}
        </main>
      </div>

      {/* Floating User Feedback Toast */}
      <Toast toast={toast} onClose={onCloseToast} />
    </div>
  );
}
