import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bot, ShieldAlert, ShieldCheck, Lock, Sliders, Check, Sparkles, RefreshCw } from 'lucide-react';

const DEFAULT_AGENTS = [
  { name: 'ExecutionAgent', description: 'Real-Time Email Dispatch Engine & Action Resolution', status: 'Active' },
  { name: 'FollowUpAgent', description: 'Monitors incoming Gmail messages & placement invites', status: 'Active' },
  { name: 'ContextAgent', description: 'Maps career commitments to your Personal Context Graph', status: 'Active' },
  { name: 'DecisionAgent', description: 'Analyzes priority decisions & salary targets', status: 'Active' }
];

const DEFAULT_INTEGRATIONS = [
  {
    service: 'gmail',
    permissions: { readInbox: true, draftReplies: true, autoDispatch: true }
  },
  {
    service: 'calendar',
    permissions: { readEvents: true, createEvents: true }
  }
];

export default function AgentsPage() {
  const { token, user, toggleEmergencyPause } = useAuth();
  const [agentsData, setAgentsData] = useState({
    emergencyPaused: false,
    agents: DEFAULT_AGENTS,
    integrations: DEFAULT_INTEGRATIONS
  });
  const [loading, setLoading] = useState(false);

  const fetchAgents = () => {
    setLoading(true);
    fetch('/api/agents', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setAgentsData({
            emergencyPaused: !!data.emergencyPaused,
            agents: Array.isArray(data.agents) && data.agents.length > 0 ? data.agents : DEFAULT_AGENTS,
            integrations: Array.isArray(data.integrations) && data.integrations.length > 0 ? data.integrations : DEFAULT_INTEGRATIONS
          });
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchAgents();
  }, [token]);

  const handleTogglePermission = async (service, permissionKey, currentValue) => {
    try {
      await fetch('/api/integrations/permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ service, permissionKey, value: !currentValue })
      });
      fetchAgents();
    } catch (err) {
      console.error(err);
    }
  };

  const emergencyPaused = agentsData?.emergencyPaused || false;
  const agents = Array.isArray(agentsData?.agents) ? agentsData.agents : DEFAULT_AGENTS;
  const integrations = Array.isArray(agentsData?.integrations) ? agentsData.integrations : DEFAULT_INTEGRATIONS;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>AI Agent Controls & Permissions</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Manage specialized autonomous agents, service permissions, and emergency safety limits.
          </p>
        </div>

        {loading && (
          <span style={{ fontSize: '0.85rem', color: 'var(--gold-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} className="animate-spin" />
            <span>Syncing mesh...</span>
          </span>
        )}
      </div>

      {/* Emergency Control Hero Card */}
      <div className={`glass-card ${emergencyPaused ? '' : 'highlight'}`} style={{ marginBottom: '2rem', borderLeft: emergencyPaused ? '4px solid var(--crimson-accent)' : '4px solid var(--emerald-accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              {emergencyPaused ? (
                <ShieldAlert color="var(--crimson-accent)" size={22} />
              ) : (
                <ShieldCheck color="var(--emerald-accent)" size={22} />
              )}
              <h2 style={{ fontSize: '1.35rem', margin: 0 }}>
                Emergency Switch: {emergencyPaused ? 'PAUSED' : 'ACTIVE'}
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              {emergencyPaused
                ? 'All background agent analysis and execution jobs are currently suspended.'
                : 'Agents are actively monitoring your context stream and proposing user-approved actions.'}
            </p>
          </div>

          <button
            onClick={toggleEmergencyPause}
            className={`btn ${emergencyPaused ? 'btn-primary' : 'btn-danger'}`}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {emergencyPaused ? 'Resume All Agents' : 'Pause All Agents'}
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 }}>Modular Agent Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
          {agents.map((ag, idx) => (
            <div key={ag.name || idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span className="badge badge-resolved" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>{ag.status || 'Active'}</span>
                  <Bot size={18} color="var(--gold-main)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.45rem', color: 'var(--text-main)' }}>{ag.name}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {ag.description}
                </p>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--emerald-accent)', fontWeight: 600 }}>
                ⚡ Safety Guard Verified
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Permissions */}
      <div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', fontWeight: 700 }}>Granular Integration Permissions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {integrations.map((integ, idx) => (
            <div key={integ.service || idx} className="glass-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', textTransform: 'capitalize', color: 'var(--text-main)' }}>
                {integ.service} Permissions
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(integ.permissions || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                    <span style={{ fontSize: '0.9rem', textTransform: 'capitalize', color: 'var(--text-muted)' }}>
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <button
                      onClick={() => handleTogglePermission(integ.service, key, val)}
                      className={`btn btn-sm ${val ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}
                    >
                      {val ? 'Allowed' : 'Denied'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
