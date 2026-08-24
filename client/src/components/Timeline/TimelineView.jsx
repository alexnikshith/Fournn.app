import React from 'react';
import { Clock, Mail, Calendar, CheckCircle, AlertCircle, FileText, Bot } from 'lucide-react';

export default function TimelineView({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <Clock size={32} color="var(--gold-main)" style={{ marginBottom: '0.5rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>No timeline events logged yet.</p>
      </div>
    );
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'EMAIL_RECEIVED': return <Mail size={16} color="var(--gold-main)" />;
      case 'INTERVIEW_SCHEDULED': return <Calendar size={16} color="var(--emerald-accent)" />;
      case 'ACTION_EXECUTED': return <CheckCircle size={16} color="var(--emerald-accent)" />;
      case 'ACTION_APPROVED': return <CheckCircle size={16} color="var(--gold-main)" />;
      case 'OUTCOME_UPDATED': return <FileText size={16} color="var(--crimson-accent)" />;
      default: return <Bot size={16} color="var(--text-main)" />;
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <Clock size={20} color="var(--gold-main)" />
        <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Longitudinal Journey Timeline</h2>
      </div>

      <div style={{ position: 'relative', paddingLeft: '1.75rem', borderLeft: '2px solid var(--border-color)' }}>
        {events.map((evt, idx) => (
          <div key={evt._id || idx} style={{ marginBottom: '1.5rem', position: 'relative' }}>
            {/* Timeline Dot */}
            <div style={{
              position: 'absolute',
              left: '-2.35rem',
              top: '0.15rem',
              background: 'var(--bg-card)',
              border: '2px solid var(--gold-main)',
              borderRadius: '50%',
              padding: '0.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getEventIcon(evt.eventType)}
            </div>

            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, marginBottom: '0.2rem' }}>
                {new Date(evt.timestamp).toLocaleString()}
              </div>
              <h4 style={{ fontSize: '1.02rem', margin: '0 0 0.3rem 0', color: 'var(--text-main)', fontWeight: 700 }}>
                {evt.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                {evt.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
