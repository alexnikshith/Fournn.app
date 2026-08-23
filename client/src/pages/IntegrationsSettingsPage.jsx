import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Calendar, User, Shield, CheckCircle2 } from 'lucide-react';

export default function IntegrationsSettingsPage() {
  const { token, user } = useAuth();
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/integrations', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setIntegrations(data.integrations || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Integrations & Account Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
          Manage connected services, API security parameters, and subscription plan options.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem', width: '100%' }}>
        {/* Connected Data Adapters */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div className="metric-icon" style={{ width: 42, height: 42 }}>
              <Mail size={20} color="var(--gold-main)" />
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Connected Data Adapters</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  Gmail API Adapter
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Status: Active Synced</div>
              </div>
              <span className="badge badge-resolved" style={{ padding: '0.45rem 0.95rem' }}>Connected</span>
            </div>

            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                padding: '1.25rem 1.5rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  Google Calendar Adapter
                </div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Status: Active Synced</div>
              </div>
              <span className="badge badge-resolved" style={{ padding: '0.45rem 0.95rem' }}>Connected</span>
            </div>
          </div>
        </div>

        {/* Account Profile & Security */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div className="metric-icon" style={{ width: 42, height: 42 }}>
              <User size={20} color="var(--emerald-accent)" />
            </div>
            <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Account Profile & Security</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '1.02rem' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Account Name
              </span>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user ? user.name : 'Demo User'}</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Account Email
              </span>
              <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user ? user.email : 'demo@fournn.app'}</div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', fontWeight: 600 }}>
                  Subscription Tier
                </span>
                <div style={{ fontWeight: 700, color: 'var(--gold-main)' }}>
                  {user ? (user.subscriptionTier || 'Free Demo Plan').toUpperCase() : 'FREE DEMO PLAN'}
                </div>
              </div>
              <span className="badge badge-waiting">FREE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
