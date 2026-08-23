import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  Bot, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Brain,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function LandingPage() {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleTryDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-main)' }}>
      {/* Hero Header Section */}
      <section className="landing-hero">
        <div 
          className="badge" 
          style={{ 
            background: 'rgba(99, 102, 241, 0.12)', 
            color: 'var(--primary-accent)', 
            borderColor: 'rgba(99, 102, 241, 0.3)',
            marginBottom: '1.5rem'
          }}
        >
          <Sparkles size={14} />
          <span>AI Personal Operating System</span>
        </div>

        <h1 className="hero-title">
          Your AI that understands<br />what matters.
        </h1>

        <p className="hero-subtitle">
          Fournn connects your goals, commitments, decisions, and digital activity into one unified context layer — helping you know what needs attention and move important outcomes forward.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleTryDemo} className="btn btn-primary" style={{ padding: '0.85rem 1.85rem', fontSize: '1.05rem' }}>
            <span>Explore Interactive Demo</span>
            <ArrowRight size={18} />
          </button>
          <Link to="/auth?mode=register" className="btn btn-secondary" style={{ padding: '0.85rem 1.85rem', fontSize: '1.05rem' }}>
            <span>Get Started</span>
          </Link>
        </div>

        {/* Product Philosophy Highlight Banner */}
        <div className="glass-card highlight" style={{ marginTop: '4rem', padding: '2rem', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <Brain color="var(--primary-accent)" size={22} />
            <h3 style={{ fontSize: '1.1rem' }}>The Fournn Architecture</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Instead of fragmented apps and endless chatbots, Fournn operates as your digital chief of staff:
          </p>

          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
              gap: '0.75rem', 
              marginTop: '1.25rem',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {['DATA', 'CONTEXT', 'GRAPH', 'AGENTS', 'APPROVAL', 'ACTION', 'VERIFICATION'].map((step, idx) => (
              <div 
                key={step} 
                style={{ 
                  background: 'var(--bg-surface)', 
                  padding: '0.65rem 0.5rem', 
                  borderRadius: 'var(--radius-sm)', 
                  textAlign: 'center',
                  border: '1px solid var(--border-color)',
                  color: idx === 4 ? 'var(--emerald-accent)' : 'var(--text-main)'
                }}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="page-body" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Never lose track of the important things again.</h2>
          <p style={{ color: 'var(--text-muted)' }}>Designed for digitally active professionals, founders, and knowledge workers.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card">
            <div className="metric-icon" style={{ marginBottom: '1rem', color: 'var(--emerald-accent)' }}>
              <CheckCircle2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Attention Management</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Automatically detects unanswered job invitations, missing refunds, and impending project deadlines across your accounts.
            </p>
          </div>

          <div className="glass-card">
            <div className="metric-icon" style={{ marginBottom: '1rem', color: 'var(--primary-accent)' }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Personal Context Graph</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Maps relationships between people, emails, calendar events, active decisions, and long-term career goals.
            </p>
          </div>

          <div className="glass-card">
            <div className="metric-icon" style={{ marginBottom: '1rem', color: 'var(--amber-accent)' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Modular AI Agents</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Specialized Context, Research, Planning, Follow-Up, and Execution agents work together with explicit user permission.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Emergency Control Section */}
      <section style={{ background: 'var(--bg-card)', borderVertical: '1px solid var(--border-color)', padding: '4rem 1.5rem' }}>
        <div className="page-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="badge badge-resolved" style={{ marginBottom: '1rem' }}>
              <Lock size={14} />
              <span>Trust & Privacy First</span>
            </div>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>You stay in full control. Always.</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Fournn follows a strict protocol: <strong>PLAN → EXPLAIN → ASK PERMISSION → EXECUTE → VERIFY → LOG</strong>. No email is sent or calendar event changed without your explicit approval.
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="var(--emerald-accent)" size={18} />
                <span>Instant Emergency "Pause All Agents" global switch</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="var(--emerald-accent)" size={18} />
                <span>Granular permission toggles (Read vs Execute access)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 color="var(--emerald-accent)" size={18} />
                <span>Complete transparent audit logging & memory controls</span>
              </li>
            </ul>
          </div>

          <div className="glass-card highlight" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem' }}>Agent Safety Status</h4>
              <span className="badge badge-resolved">Active & Guarded</span>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Follow-Up Agent</div>
              <div style={{ fontWeight: 600 }}>Detected refund overdue (₹2,400)</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--amber-accent)', marginTop: '0.5rem' }}>⚠️ Waiting for User Approval to send ticket draft</div>
            </div>

            <button onClick={handleTryDemo} className="btn btn-primary" style={{ width: '100%' }}>
              Test Emergency Switch in Demo
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="page-body" style={{ padding: '4rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Simple, Transparent Pricing</h2>
          <p style={{ color: 'var(--text-muted)' }}>Invest in your personal clarity and focus.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Free</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>₹0 <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ month</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Basic context graph & limited agent runs.</p>
            <button onClick={handleTryDemo} className="btn btn-secondary" style={{ width: '100%' }}>Start Free Demo</button>
          </div>

          <div className="glass-card highlight">
            <div className="badge badge-urgent" style={{ marginBottom: '0.5rem' }}>Most Popular</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Pro</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-accent)', marginBottom: '1rem' }}>₹799 <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ month</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Continuous Gmail/Calendar monitoring, decision analysis & automated follow-ups.</p>
            <button onClick={handleTryDemo} className="btn btn-primary" style={{ width: '100%' }}>Get Pro Access</button>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Power</h3>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>₹1,999 <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>/ month</span></div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Advanced autonomous workflows, unlimited long-term memory & priority execution.</p>
            <button onClick={handleTryDemo} className="btn btn-secondary" style={{ width: '100%' }}>Contact Team</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
        Fournn AI Personal Operating System © 2026. Built with modern MERN architecture.
      </footer>
    </div>
  );
}
