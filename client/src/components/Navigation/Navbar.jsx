import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, ShieldCheck, Menu, User as UserIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

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
  const { user, toggleEmergencyPause } = useAuth();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Fournn OS';

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', padding: '0.45rem 0.65rem' }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-body)' }}>
          {pageTitle}
        </h2>
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem' }}>
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
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
          </div>
        </div>
      )}
    </header>
  );
}
