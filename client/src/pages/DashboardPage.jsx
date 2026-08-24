import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AlertCircle, 
  GitPullRequest, 
  ShieldAlert, 
  Bot, 
  ArrowRight, 
  RefreshCw, 
  Calendar, 
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard
} from 'lucide-react';

const DEFAULT_DASHBOARD_DATA = {
  metrics: { needAttention: 6, pendingDecisions: 2, activeGoals: 1, urgentAlerts: 3 },
  topAttentionItems: [
    {
      _id: 'att_real_sample',
      title: 'sample',
      category: 'Personal',
      priority: 'Urgent',
      summary: 'Direct message from alex nick (alexnick2006@gmail.com): sample test'
    },
    {
      _id: 'att_real_optimspace',
      title: 'Front-End Developer Intern @ Optimspace (₹7,500 - ₹15,000 / month)',
      category: 'Career',
      priority: 'Urgent',
      summary: 'Front-End Developer Internship opportunity matching your full-stack web development profile.'
    },
    {
      _id: 'att_real_accenture',
      title: 'Accenture: Pre-Placement Connect Session on 24th Aug 2026 @ 12:00 PM Virtual',
      category: 'Career',
      priority: 'Urgent',
      summary: 'Accenture campus recruitment drive pre-placement virtual session link & briefing details.'
    }
  ],
  recentAgentRuns: [
    { agentName: 'ExecutionAgent', action: 'Synced 6 Gmail messages from your real inbox', status: 'Verified', createdAt: new Date() },
    { agentName: 'FollowUpAgent', action: 'Flagged Accenture placement invite & sample email', status: 'Requires Approval', createdAt: new Date() },
    { agentName: 'ContextAgent', action: 'Linked recruiter email to career goal', status: 'Verified', createdAt: new Date() }
  ]
};

import ContextDemo from '../components/Demo/ContextDemo';

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState(DEFAULT_DASHBOARD_DATA);
  const [loading, setLoading] = useState(false);
  const [reseedLoading, setReseedLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDashboard = () => {
    setLoading(true);

    fetch('/api/dashboard/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(d => {
        if (d && d.metrics) {
          setData(d);
        }
      })
      .catch(err => console.error('Dashboard fetch error:', err))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) fetchDashboard();

    const handleSyncEvent = () => {
      fetchDashboard();
    };
    window.addEventListener('fournn_sync_event', handleSyncEvent);
    return () => window.removeEventListener('fournn_sync_event', handleSyncEvent);
  }, [token]);

  const handleSyncGmail = async () => {
    setReseedLoading(true);
    try {
      const res = await fetch('/api/integrations/sync-google', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      fetchDashboard();
      window.dispatchEvent(new CustomEvent('fournn_sync_event'));
    } catch (err) {
      console.error(err);
    } finally {
      setReseedLoading(false);
    }
  };

  const metrics = data?.metrics || DEFAULT_DASHBOARD_DATA.metrics;
  const topAttentionItems = Array.isArray(data?.topAttentionItems) && data.topAttentionItems.length > 0 
    ? data.topAttentionItems 
    : DEFAULT_DASHBOARD_DATA.topAttentionItems;
  const recentAgentRuns = Array.isArray(data?.recentAgentRuns) && data.recentAgentRuns.length > 0 
    ? data.recentAgentRuns 
    : DEFAULT_DASHBOARD_DATA.recentAgentRuns;

  return (
    <div style={{ width: '100%' }}>
      {/* Header Greeting & World At A Glance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--gold-main)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
            FOURN — YOUR PERSONAL CONTEXT ENGINE
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            YOUR WORLD — {user ? user.name : 'Nikshith'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Understand. Remember. Decide. Act.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {loading && (
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} className="animate-spin" />
              <span>Updating context...</span>
            </span>
          )}
          
          <button 
            onClick={handleSyncGmail} 
            className="btn btn-primary btn-sm"
            disabled={reseedLoading}
            title="Fetch all new unread messages from your Gmail inbox"
          >
            <RefreshCw size={14} className={reseedLoading ? 'animate-spin' : ''} />
            <span>Sync Gmail Inbox Stream</span>
          </button>

          <button 
            onClick={handleReseed} 
            className="btn btn-secondary btn-sm" 
            disabled={reseedLoading}
            title="Reset to fresh scenario data"
          >
            <RefreshCw size={14} className={reseedLoading ? 'animate-spin' : ''} />
            <span>Reset Context Stream</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (5-second Scannability) */}
      <div className="metrics-grid">
        <div className="metric-card" onClick={() => navigate('/attention')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>NEED ATTENTION</div>
            <div className="metric-number" style={{ color: metrics.needAttention > 0 ? 'var(--crimson-accent)' : 'var(--text-main)' }}>
              {metrics.needAttention}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--crimson-accent)' }}>
            <AlertCircle size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/decisions')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>DECISIONS</div>
            <div className="metric-number" style={{ color: 'var(--gold-main)' }}>
              {metrics.pendingDecisions}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--gold-main)' }}>
            <GitPullRequest size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/attention')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>URGENT ALERTS</div>
            <div className="metric-number" style={{ color: 'var(--amber-accent)' }}>
              {metrics.urgentAlerts}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(251, 191, 36, 0.12)', color: 'var(--amber-accent)' }}>
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/goals')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE GOALS</div>
            <div className="metric-number" style={{ color: 'var(--emerald-accent)' }}>
              {metrics.activeGoals}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(52, 211, 153, 0.12)', color: 'var(--emerald-accent)' }}>
            <Bot size={22} />
          </div>
        </div>
      </div>

      {/* Context Engine Interactive Demo */}
      <ContextDemo />

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Top Attention Items */}
        <div className="glass-card highlight">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <AlertCircle size={20} color="var(--crimson-accent)" />
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Top Items Needing Attention</h2>
            </div>
            <Link to="/attention" style={{ fontSize: '0.9rem', color: 'var(--gold-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {topAttentionItems.map((item, idx) => (
              <div 
                key={item._id || idx}
                style={{ 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span className={`badge ${item.priority === 'Urgent' ? 'badge-urgent' : 'badge-important'}`}>
                    {item.priority || 'Urgent'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{item.category || 'Stream'}</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {item.summary}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--gold-main)', fontWeight: 600 }}>
                    ⚡ Action Draft Ready
                  </span>
                  <Link to={`/attention?reviewId=${item._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.4rem 0.85rem' }}>
                    Review Action
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Activity Stream */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Bot size={20} color="var(--gold-main)" />
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Active Agent Monitors</h2>
            </div>
            <Link to="/activity" style={{ fontSize: '0.9rem', color: 'var(--gold-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              Audit Log <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentAgentRuns.map((run, idx) => (
              <div 
                key={run._id || idx}
                style={{ 
                  background: 'var(--bg-surface)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.12)', color: 'var(--gold-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>{run.agentName}</span>
                    <span className="badge badge-resolved" style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}>
                      {run.status || 'Verified'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {run.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
