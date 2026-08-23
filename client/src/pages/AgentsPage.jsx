import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bot, ShieldAlert, ShieldCheck, Lock, Sliders, Check, Sparkles } from 'lucide-react';

export default function AgentsPage() {
  const { token, user, toggleEmergencyPause } = useAuth();
  const [agentsData, setAgentsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAgents = () => {
    setLoading(true);
    fetch('/api/agents', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setAgentsData(data);
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

  if (loading || !agentsData) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles className="animate-spin" size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-accent)' }} />
        <div>Connecting to AI Agent Mesh...</div>
      </div>
    );
  }

  const { emergencyPaused, agents, integrations } = agentsData;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>AI Agent Controls & Permissions</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage specialized autonomous agents, service permissions, and emergency safety limits.
        </p>
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
              <h2 style={{ fontSize: '1.3rem' }}>
                Emergency Switch: {emergencyPaused ? 'PAUSED' : 'ACTIVE'}
              </h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
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
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Modular Agent Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {agents.map(ag => (
            <div key={ag.name} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Bot size={16} color="var(--primary-accent)" />
                  <span>{ag.name}</span>
                </h3>
                <span className={`badge ${ag.status === 'Active' ? 'badge-resolved' : 'badge-waiting'}`}>
                  {ag.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ag.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Service Permissions Matrix */}
      <div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Granular Access Control Center</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {integrations.map(integ => (
            <div key={integ.service} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', textTransform: 'capitalize' }}>{integ.service} Service</h3>
                <span className="badge badge-resolved">{integ.connected ? 'Connected' : 'Disconnected'}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(integ.permissions || {}).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      background: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)' }}>{key}</span>
                    <button
                      onClick={() => handleTogglePermission(integ.service, key, val)}
                      className={`btn ${val ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                      style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      {val ? 'ALLOWED' : 'BLOCKED'}
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
