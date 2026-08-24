import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  AlertCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Send, 
  Layers, 
  ShieldAlert, 
  Target, 
  HelpCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import TimelineView from '../components/Timeline/TimelineView';

export default function SituationDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [situation, setSituation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    fetch(`/api/situations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.situation) setSituation(data.situation);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [token, id]);

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Clock size={32} className="animate-spin" color="var(--gold-main)" style={{ marginBottom: '1rem' }} />
        <div>Loading Situation Context...</div>
      </div>
    );
  }

  if (!situation) {
    return (
      <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="var(--crimson-accent)" style={{ marginBottom: '1rem' }} />
        <h2>Situation Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>The requested situation context could not be located.</p>
        <Link to="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-main)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        <span>Back to World Overview</span>
      </Link>

      {/* Situation Header */}
      <div className="glass-card highlight" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="badge badge-urgent">{situation.attentionCategory || situation.status}</span>
              <span className="badge badge-info">{situation.category || 'Career'}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID: {situation._id}</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {situation.title}
            </h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attention Score</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-main)' }}>
              {situation.attentionScore || 85}/100
            </div>
            <button onClick={() => setShowWhy(!showWhy)} className="btn btn-secondary btn-sm" style={{ marginTop: '0.3rem' }}>
              <HelpCircle size={14} />
              <span>Explain Why</span>
            </button>
          </div>
        </div>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {situation.description || situation.currentState}
        </p>

        {showWhy && (
          <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, color: 'var(--gold-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertCircle size={16} />
              <span>Why This Situation Demands Priority (Explainable Factor Breakdown)</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {situation.attentionFactors?.map((f, idx) => (
                <li key={idx}><strong>{f.factor}:</strong> {f.reason} (+{f.weight} pts)</li>
              )) || <li>Deadline proximity and career goal alignment require active resolution.</li>}
            </ul>
          </div>
        )}

        {/* Progress & State Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.3rem' }}>CURRENT STATE</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>{situation.currentState}</div>
          </div>

          <div style={{ background: 'var(--bg-surface)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--emerald-accent)', fontWeight: 600, marginBottom: '0.3rem' }}>DESIRED REAL-WORLD OUTCOME</div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>{situation.desiredState}</div>
          </div>
        </div>
      </div>

      {/* Recommended Action Card */}
      {situation.nextAction && (
        <div className="glass-card" style={{ marginBottom: '2rem', borderColor: 'var(--gold-main)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gold-main)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                <Sparkles size={16} />
                <span>RECOMMENDED NEXT BEST ACTION</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {situation.nextAction}
              </div>
            </div>

            <Link to={`/attention?reviewId=${situation._id}`} className="btn btn-primary">
              <Send size={16} />
              <span>Review Action & Dispatch</span>
            </Link>
          </div>
        </div>
      )}

      {/* Risks & Dependencies Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <ShieldAlert size={18} color="var(--crimson-accent)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Identified Risks</h3>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {situation.risks?.map((r, i) => <li key={i}>{r}</li>) || <li>No immediate risks detected.</li>}
          </ul>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Layers size={18} color="var(--amber-accent)" />
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Dependencies & Context</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {situation.dependencies?.map((d, i) => (
              <span key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '0.3rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                {d}
              </span>
            )) || <span style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>No external dependencies.</span>}
          </div>
        </div>
      </div>

      {/* Longitudinal Timeline */}
      <TimelineView events={situation.timeline} />
    </div>
  );
}
