import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, ShieldCheck, Menu, User as UserIcon, Sun, Moon, X, Mail, Calendar, LogOut } from 'lucide-react';
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
  const { user, toggleEmergencyPause, theme, toggleTheme, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const pageTitle = PAGE_TITLES[location.pathname] || 'Fournn OS';

  const handleSignOut = () => {
    setShowProfileModal(false);
    logout();
    navigate('/');
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
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gold-main)',
                    fontWeight: 700
                  }}
                >
                  {user.name ? user.name[0].toUpperCase() : <UserIcon size={18} />}
                </div>
                <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.92rem' }}>{user.name}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Account Profile Modal */}
      {showProfileModal && user && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)',
                    color: '#070709',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem'
                  }}
                >
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', margin: 0 }}>{user.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user.email}</span>
                </div>
              </div>
              <button 
                onClick={() => setShowProfileModal(false)} 
                className="btn btn-secondary btn-sm" 
                style={{ padding: '0.4rem', borderRadius: '50%' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                  Subscription Tier
                </span>
                <span style={{ fontWeight: 700, color: 'var(--gold-main)' }}>
                  {(user.subscriptionTier || 'Free Demo Plan').toUpperCase()}
                </span>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Connected Data Adapters
                </span>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-resolved" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
                    <Mail size={12} />
                    <span>Gmail API (Active)</span>
                  </span>
                  <span className="badge badge-resolved" style={{ padding: '0.3rem 0.75rem', fontSize: '0.78rem' }}>
                    <Calendar size={12} />
                    <span>Google Calendar (Active)</span>
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
                    Autonomous Agent Mesh
                  </span>
                  <span style={{ fontWeight: 600, color: user.emergencyPaused ? 'var(--crimson-accent)' : 'var(--emerald-accent)' }}>
                    {user.emergencyPaused ? 'PAUSED' : 'ACTIVE & RUNNING'}
                  </span>
                </div>
                <button
                  onClick={toggleEmergencyPause}
                  className={`emergency-btn ${user.emergencyPaused ? 'paused' : 'active'}`}
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                >
                  {user.emergencyPaused ? 'Resume' : 'Pause All'}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '1.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSignOut} className="btn btn-danger btn-sm">
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
