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
import SituationDetailPage from './pages/SituationDetailPage';
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
  const [graphData, setGraphData] = React.useState({
    nodes: [
      { id: 'usr_1', entityId: 'user_self', label: 'Nikshith (You)', category: 'Person', details: 'Personal OS User Context' },
      { id: 'n1', entityId: 'evt_interview', label: 'Accenture Placement Session', category: 'Event', details: 'Virtual orientation session today @ 12:00 PM' },
      { id: 'n2', entityId: 'email_invite', label: 'Full-Stack Roles Hyderabad', category: 'Email', details: '₹9.5L - ₹15L+ Senior Developer Opportunity' },
      { id: 'n3', entityId: 'goal_career', label: 'Land Senior AI Role', category: 'Goal', details: 'Target Date: Oct 2026' },
      { id: 'n4', entityId: 'comp_google', label: 'Accenture Placement Cell', category: 'Company', details: 'Campus Recruitment Stream' }
    ],
    edges: [
      { id: 'e1', source: 'usr_1', target: 'n1', label: 'attending' },
      { id: 'e2', source: 'usr_1', target: 'n2', label: 'received' },
      { id: 'e3', source: 'n1', target: 'n3', label: 'advances' },
      { id: 'e4', source: 'n4', target: 'n1', label: 'hosts' }
    ]
  });

  React.useEffect(() => {
    if (token) {
      fetch('/api/graph', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.json())
        .then(data => {
          if (data && data.nodes && data.nodes.length > 0) setGraphData(data);
        })
        .catch(err => console.error(err));
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
      <InteractiveGraph nodes={graphData.nodes} edges={graphData.edges} />
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
        <Route path="/situations/:id" element={<ProtectedLayout><SituationDetailPage /></ProtectedLayout>} />
        <Route path="/integrations" element={<ProtectedLayout><IntegrationsSettingsPage /></ProtectedLayout>} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
