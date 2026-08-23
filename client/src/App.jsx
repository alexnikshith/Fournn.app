import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navigation/Navbar';
import Sidebar from './components/Navigation/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import InteractiveGraph from './components/Graph/InteractiveGraph';
import AttentionPage from './pages/AttentionPage';
import DecisionPage from './pages/DecisionPage';
import GoalsPage from './pages/GoalsPage';
import AgentsPage from './pages/AgentsPage';
import ActivityPage from './pages/ActivityPage';
import MemoryPage from './pages/MemoryPage';
import IntegrationsSettingsPage from './pages/IntegrationsSettingsPage';

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-icon" style={{ margin: '0 auto 1rem', width: 44, height: 44 }}>✨</div>
          <div>Loading Fournn...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth?mode=login" replace />;
  }

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`main-content ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="page-body">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

// Wrapper for graph page
function GraphPageWrapper() {
  const { token } = useAuth();
  const [graphData, setGraphData] = React.useState({ nodes: [], edges: [] });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (token) {
      fetch('/api/graph', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data && data.nodes) setGraphData(data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Personal Context Graph Explorer
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Interactive visualization of relationships between people, companies, events, goals, and decisions.
        </p>
      </div>
      <InteractiveGraph graphData={graphData} />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected App Routes */}
        <Route path="/onboarding" element={<ProtectedLayout><OnboardingPage /></ProtectedLayout>} />
        <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/graph" element={<ProtectedLayout><GraphPageWrapper /></ProtectedLayout>} />
        <Route path="/attention" element={<ProtectedLayout><AttentionPage /></ProtectedLayout>} />
        <Route path="/decisions" element={<ProtectedLayout><DecisionPage /></ProtectedLayout>} />
        <Route path="/goals" element={<ProtectedLayout><GoalsPage /></ProtectedLayout>} />
        <Route path="/agents" element={<ProtectedLayout><AgentsPage /></ProtectedLayout>} />
        <Route path="/activity" element={<ProtectedLayout><ActivityPage /></ProtectedLayout>} />
        <Route path="/memory" element={<ProtectedLayout><MemoryPage /></ProtectedLayout>} />
        <Route path="/integrations" element={<ProtectedLayout><IntegrationsSettingsPage /></ProtectedLayout>} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
