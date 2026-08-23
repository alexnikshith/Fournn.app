import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert, ShieldCheck, Menu, Sparkles, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleSidebar }) {
  const { user, toggleEmergencyPause } = useAuth();

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', padding: '0.4rem 0.6rem' }}
          title="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <Link to={user ? "/dashboard" : "/"} className="nav-brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span>Fournn</span>
        </Link>
      </div>

      {user ? (
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-accent)',
                fontWeight: 700
              }}
            >
              {user.name ? user.name[0].toUpperCase() : <UserIcon size={18} />}
            </div>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/auth?mode=login" className="btn btn-secondary btn-sm">Sign In</Link>
          <Link to="/auth?mode=register" className="btn btn-primary btn-sm">Get Started</Link>
        </div>
      )}
    </header>
  );
}
