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

export default function DashboardPage() {
  const { token, user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reseedLoading, setReseedLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDashboard = () => {
    setLoading(true);

    // Timeout safety fallback after 2.5s
    const timer = setTimeout(() => {
      setLoading(false);
      setData(prev => prev || {
        metrics: { needAttention: 2, pendingDecisions: 1, activeGoals: 1, urgentAlerts: 1 },
        topAttentionItems: [
          {
            _id: 'att_fallback_1',
            title: '₹2,400 E-Commerce Refund Overdue',
            priority: 'Urgent',
            summary: 'Order return received 5 days ago, but ₹2,400 refund has not credited your bank account.',
            draftResponse: 'Hi Support Team, order #88491 was returned 5 days ago. Please confirm status of refund.'
          }
        ],
        recentAgentRuns: [
          { agentName: 'FollowUpAgent', action: 'Flagged ₹2,400 overdue refund', status: 'Requires Approval', createdAt: new Date() }
        ]
      });
    }, 2500);

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
        clearTimeout(timer);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) fetchDashboard();
  }, [token]);

  const handleReseed = async () => {
    setReseedLoading(true);
    try {
      await fetch('/api/demo/seed', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboard();
    } catch (err) {
      console.error(err);
    } finally {
      setReseedLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Sparkles className="animate-spin" size={28} style={{ marginBottom: '1rem', color: 'var(--primary-accent)' }} />
        <div>Fournn is building your personal context layer...</div>
      </div>
    );
  }

  const { metrics, topAttentionItems, recentAgentActivity } = data;

  return (
    <div>
      {/* Header Greeting & World At A Glance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            Good evening, {user ? user.name : 'User'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Your world at a glance across goals, commitments, decisions, and agents.
          </p>
        </div>

        <button 
          onClick={handleReseed} 
          className="btn btn-secondary btn-sm" 
          disabled={reseedLoading}
          title="Reset to fresh demo scenario data"
        >
          <RefreshCw size={14} className={reseedLoading ? 'animate-spin' : ''} />
          <span>Reset Demo Context</span>
        </button>
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
            <div className="metric-number" style={{ color: 'var(--amber-accent)' }}>
              {metrics.decisions}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber-accent)' }}>
            <GitPullRequest size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/attention')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>URGENT ALERTS</div>
            <div className="metric-number" style={{ color: 'var(--crimson-accent)' }}>
              {metrics.urgent}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(239, 68, 68, 0.12)', color: 'var(--crimson-accent)' }}>
            <ShieldAlert size={22} />
          </div>
        </div>

        <div className="metric-card" onClick={() => navigate('/agents')} style={{ cursor: 'pointer' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE GOALS</div>
            <div className="metric-number" style={{ color: 'var(--emerald-accent)' }}>
              {metrics.activeGoals}
            </div>
          </div>
          <div className="metric-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald-accent)' }}>
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.75rem' }}>
        {/* Left Column: Needs Attention Cards */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Items Needing Your Attention</h2>
            <Link to="/attention" style={{ fontSize: '0.85rem', color: 'var(--primary-accent)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {topAttentionItems.map(item => (
              <div key={item._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className={`badge badge-${item.category}`}>{item.category}</span>
                    <h3 style={{ fontSize: '1.1rem', marginTop: '0.4rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.subtitle}</p>
                  </div>

                  <Link to="/attention" className="btn btn-primary btn-sm">
                    Review
                  </Link>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)' }}>
                  <strong>Fournn Context:</strong> {item.reason}
                </p>

                {item.progress > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
                      <span>Preparation Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: AI Agents & Quick Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Active Agents Status Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bot color="var(--primary-accent)" size={18} />
              <span>Your Active AI Agents</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { name: 'Research Agent', status: 'Active', desc: 'Monitoring discount feeds & hardware specs' },
                { name: 'Planning Agent', status: 'Active', desc: 'Tracking Google interview timeline' },
                { name: 'Follow-Up Agent', status: 'Active', desc: 'Detected overdue refund of ₹2,400' },
                { name: 'Decision Agent', status: 'Idle', desc: 'Awaiting user input for ThinkPad choice' }
              ].map(ag => (
                <div 
                  key={ag.name} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0.65rem 0.85rem', 
                    background: 'var(--bg-surface)', 
                    borderRadius: 'var(--radius-sm)' 
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{ag.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{ag.desc}</div>
                  </div>
                  <span className={`badge ${ag.status === 'Active' ? 'badge-resolved' : 'badge-waiting'}`}>
                    {ag.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Log Preview */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock color="var(--amber-accent)" size={18} />
              <span>Recent Activity</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              {recentAgentActivity.slice(0, 3).map(log => (
                <div key={log._id} style={{ borderLeft: '2px solid var(--primary-accent)', paddingLeft: '0.75rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{log.agentName}</div>
                  <div style={{ color: 'var(--text-muted)' }}>{log.action}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
