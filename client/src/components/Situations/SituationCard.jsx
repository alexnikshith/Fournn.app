import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2, ShieldAlert, ArrowRight, Target, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SituationCard({ situation }) {
  const [showWhy, setShowWhy] = useState(false);

  if (!situation) return null;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'URGENT':
      case 'AT_RISK': return 'badge-urgent';
      case 'IMPORTANT': return 'badge-important';
      case 'WAITING': return 'badge-warning';
      default: return 'badge-info';
    }
  };

  return (
    <div className="glass-card" style={{ marginBottom: '1.25rem', borderLeft: situation.attentionScore > 80 ? '4px solid var(--crimson-accent)' : '4px solid var(--gold-main)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span className={`badge ${getStatusBadgeClass(situation.attentionCategory || situation.status)}`}>
              {situation.attentionCategory || situation.status}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
              {situation.category || 'Stream'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
            {situation.title}
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attention Score</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: situation.attentionScore > 80 ? 'var(--crimson-accent)' : 'var(--gold-main)' }}>
              {situation.attentionScore || 75}/100
            </div>
          </div>
          <button 
            onClick={() => setShowWhy(!showWhy)}
            className="btn btn-secondary btn-sm"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            title="Explain why this item received its priority score"
          >
            <HelpCircle size={14} />
            <span>Why?</span>
          </button>
        </div>
      </div>

      <p style={{ fontSize: '0.93rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.85rem' }}>
        {situation.description || situation.currentState}
      </p>

      {/* Progress Bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.3rem' }}>
          <span>Outcome Progress</span>
          <span>{situation.progress || 50}%</span>
        </div>
        <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${situation.progress || 50}%`, background: 'linear-gradient(90deg, var(--gold-main), var(--emerald-accent))', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Next Best Action */}
      {situation.nextAction && (
        <div style={{ background: 'var(--bg-surface)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
            <Sparkles size={14} />
            <span>RECOMMENDED NEXT ACTION</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 600 }}>
            {situation.nextAction}
          </div>
        </div>
      )}

      {/* Explainable Score Breakdown Accordion */}
      {showWhy && (
        <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--gold-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={15} />
            <span>Why High Priority? (Explainable Score Breakdown)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.83rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            {situation.attentionFactors && situation.attentionFactors.length > 0 ? (
              situation.attentionFactors.map((f, idx) => (
                <li key={idx}>
                  <strong>{f.factor}:</strong> {f.reason} (+{f.weight} pts)
                </li>
              ))
            ) : (
              <>
                <li><strong>Deadline Proximity:</strong> Active engagement requirement in effect.</li>
                <li><strong>Goal Relevance:</strong> Directly impacts primary career/financial target.</li>
                <li><strong>Action Required:</strong> Unresolved prompt awaiting user authorization.</li>
              </>
            )}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: '0.5rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          State: <strong>{situation.status}</strong>
        </span>

        <Link to={`/attention?reviewId=${situation._id}`} className="btn btn-primary btn-sm">
          <span>Review Action & Dispatch</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
