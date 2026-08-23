import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Network, 
  AlertCircle, 
  GitPullRequest, 
  Target, 
  Bot, 
  Activity, 
  Brain, 
  Sliders, 
  LogOut,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Fournn Graph', path: '/graph', icon: Network },
    { label: 'Attention Center', path: '/attention', icon: AlertCircle },
    { label: 'Decisions', path: '/decisions', icon: GitPullRequest },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'AI Agents', path: '/agents', icon: Bot },
    { label: 'Activity Log', path: '/activity', icon: Activity },
    { label: 'Memory', path: '/memory', icon: Brain },
    { label: 'Integrations & Settings', path: '/integrations', icon: Sliders }
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="nav-brand">
          <div className="brand-icon">
            <Sparkles size={18} />
          </div>
          <span>Fournn</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--crimson-accent)' }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
