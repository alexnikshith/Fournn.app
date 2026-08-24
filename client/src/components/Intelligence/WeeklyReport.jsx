import React from 'react';
import { Calendar, CheckCircle2, AlertTriangle, HelpCircle, ArrowRight, Sparkles, ShieldAlert, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WeeklyReport({ situations = [], outcomes = [], decisions = [] }) {
  const atRisk = situations.filter(s => s.status === 'AT_RISK' || s.attentionScore > 80);
  const unresolvedDecisions = decisions.filter(d => d.status !== 'Resolved');

  return (
    <div className="glass-card highlight" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={22} color="var(--gold-main)" />
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 800 }}>YOUR WEEK — SITUATIONAL INTELLIGENCE REPORT</h2>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--gold-main)', background: 'rgba(251, 191, 36, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontWeight: 700 }}>
          Continuous Context Summary
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>COMPLETED OUTCOMES</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>2</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>₹25k milestone & placement connect</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--crimson-accent)', fontWeight: 700 }}>AT-RISK SITUATIONS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--crimson-accent)' }}>{atRisk.length || 1}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>AWS skill gap prior to interview</div>
        </div>

        <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--amber-accent)', fontWeight: 700 }}>UNRESOLVED DECISIONS</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>{unresolvedDecisions.length || 1}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Accept Accenture offer vs Freelance</div>
        </div>
      </div>

      {/* Recommended Weekly Focus */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-main)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Target size={16} />
          <span>RECOMMENDED FOCUS FOR THE WEEK</span>
        </div>
        <ol style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
          <li>Complete 2-hour AWS system design preparation block before September 4th interview.</li>
          <li>Verify ₹25,000 freelance deposit credit in bank account.</li>
          <li>Finalize decision trade-off between full-time corporate role vs remote consulting.</li>
        </ol>
      </div>
    </div>
  );
}
