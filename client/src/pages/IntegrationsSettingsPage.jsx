import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sliders, Shield, Mail, Calendar, Key, User, CheckCircle2 } from 'lucide-react';

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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Integrations & Account Settings</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Manage connected services, API security parameters, and subscription plan options.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Connected Services */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mail size={18} color="var(--primary-accent)" />
            <span>Connected Data Adapters</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Gmail API Adapter</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: Active Synced</div>
              </div>
              <span className="badge badge-resolved">Connected</span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>Google Calendar Adapter</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status: Active Synced</div>
              </div>
              <span className="badge badge-resolved">Connected</span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--emerald-accent)" />
            <span>Account Profile & Security</span>
          </h2>

          <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Account Name:</span>
              <div style={{ fontWeight: 600 }}>{user ? user.name : 'User'}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Account Email:</span>
              <div style={{ fontWeight: 600 }}>{user ? user.email : ''}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Current Subscription Tier:</span>
              <div>
                <span className="badge badge-resolved" style={{ marginTop: '0.25rem' }}>
                  {user ? (user.subscriptionTier || 'Free Demo Plan').toUpperCase() : 'FREE'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
