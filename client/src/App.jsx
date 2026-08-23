import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navigation/Navbar';
import Sidebar from './components/Navigation/Sidebar';

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
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading Fournn...</div>;
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
          {children}
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
        .then(data => setGraphData(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Personal Context Graph</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Interactive map of entities, relationships, commitments, and goals across your digital life.
        </p>
      </div>
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Rendering context graph...</div>
      ) : (
        <InteractiveGraph nodes={graphData.nodes} edges={graphData.edges} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
      <Route path="/graph" element={<ProtectedLayout><GraphPageWrapper /></ProtectedLayout>} />
      <Route path="/attention" element={<ProtectedLayout><AttentionPage /></ProtectedLayout>} />
      <Route path="/decisions" element={<ProtectedLayout><DecisionPage /></ProtectedLayout>} />
      <Route path="/goals" element={<ProtectedLayout><GoalsPage /></ProtectedLayout>} />
      <Route path="/agents" element={<ProtectedLayout><AgentsPage /></ProtectedLayout>} />
      <Route path="/activity" element={<ProtectedLayout><ActivityPage /></ProtectedLayout>} />
      <Route path="/memory" element={<ProtectedLayout><MemoryPage /></ProtectedLayout>} />
      <Route path="/integrations" element={<ProtectedLayout><IntegrationsSettingsPage /></ProtectedLayout>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
