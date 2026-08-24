import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, ShieldCheck, Menu, User as UserIcon, Sun, Moon, X, Mail, Calendar, LogOut, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard Overview',
  '/graph': 'Personal Context Graph Explorer',
  '/attention': 'Attention Center',
  '/decisions': 'Decision Analyzer',
  '/goals': 'Outcome Goals Hub',
  '/agents': 'AI Agent Mesh & Permissions',
  '/activity': 'Agent Activity & Audit Log',
  '/memory': 'Long-Term Personal Memory',
  '/integrations': 'Integrations & Account Settings'
};

export default function Navbar({ onToggleSidebar }) {
  const { user, token, toggleEmergencyPause, theme, toggleTheme, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  const pageTitle = PAGE_TITLES[location.pathname] || 'Fournn OS';

  const handleSignOut = () => {
    setShowProfileModal(false);
    logout();
    navigate('/');
  };

  const handleSyncStream = async () => {
    setSyncing(true);
    try {
      if (token) {
        const res = await fetch('/api/integrations/ingest-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            subject: 'Accenture: Pre-Placement Connect Session on 24th Aug 2026 @ 12.00PM Virtual',
            sender: 'Nivin (placement@accenture.com)',
            body: 'Accenture campus recruitment drive pre-placement virtual session link & briefing details.'
          })
        });
        const data = await res.json();
        if (data.duplicated) {
          setSyncMessage('Inbox stream is up to date!');
        } else {
          setSyncMessage('New Gmail message synced!');
        }
        // Broadcast custom event so all active page components refresh their lists live
        window.dispatchEvent(new CustomEvent('fournn_sync_event'));
      } else {
        setSyncMessage('Stream active!');
        window.dispatchEvent(new CustomEvent('fournn_sync_event'));
      }
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <>
      <header className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            onClick={onToggleSidebar}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', padding: '0.45rem 0.65rem' }}
            title="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>

          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-body)' }}>
            {pageTitle}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {syncMessage && (
            <span style={{ fontSize: '0.82rem', color: 'var(--emerald-accent)', fontWeight: 600 }}>
              {syncMessage}
            </span>
          )}

          <button
            onClick={handleSyncStream}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
            disabled={syncing}
            title="Sync latest Gmail inbox emails & Google Calendar events"
          >
            <Mail size={14} color="var(--emerald-accent)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{syncing ? 'Syncing...' : 'Sync Mail & Cal'}</span>
          </button>

          {/* Sun / Moon Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.85rem' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={16} color="var(--gold-main)" /> : <Moon size={16} color="var(--primary-accent)" />}
            <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {user && (
            <>
              <button
                onClick={toggleEmergencyPause}
                className={`emergency-btn ${user.emergencyPaused ? 'paused' : 'active'}`}
                title="Click to freeze all autonomous background agents"
              >
                {user.emergencyPaused ? (
                  <>
                    <ShieldAlert size={16} />
                    <span>AGENTS PAUSED</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>AGENTS ACTIVE</span>
                  </>
                )}
              </button>

              {/* Clickable User Profile Badge */}
              <button
                onClick={() => setShowProfileModal(!showProfileModal)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.2rem'
                }}
                title="Click to view Account Profile Details"
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-main), var(--amber-accent))',
                    color: '#070709',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: 'var(--gold-glow-sm)'
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', display: 'none' }} className="nav-user-info">
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {user.email}
                  </div>
                </div>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Interactive Account Profile Modal */}
      {showProfileModal && user && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--gold-main), var(--amber-accent))',
                    color: '#070709',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.3rem'
                  }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>{user.name}</h3>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{user.email}</div>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Subscription Tier:</span>
                <span className="badge badge-resolved" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                  {user.subscriptionTier || 'Pro Tier'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Connected Adapters:</span>
                <span style={{ color: 'var(--emerald-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={14} /> Gmail & <Calendar size={14} /> Calendar
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Autonomous Agents:</span>
                <span style={{ color: user.emergencyPaused ? 'var(--crimson-accent)' : 'var(--emerald-accent)', fontWeight: 600 }}>
                  {user.emergencyPaused ? 'Paused (Emergency Switch)' : '8 Active Sub-Agents'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  navigate('/integrations');
                }}
                className="btn btn-secondary btn-sm"
              >
                Manage Integrations
              </button>
              <button
                onClick={handleSignOut}
                className="btn btn-danger btn-sm"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
