import React, { useState } from 'react';
import { Sparkles, XCircle, CheckCircle2, ArrowRight, Layers, Target, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ContextDemo() {
  const [activeMode, setActiveMode] = useState('fourn');

  return (
    <div className="glass-card highlight" style={{ marginBottom: '2.5rem', border: '1px solid var(--gold-main)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--gold-main)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ THE FOURN DIFFERENCE — CONTEXT ENGINE COMPARISON
          </div>
          <h2 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0 0', fontWeight: 800 }}>
            Generic AI Assistant vs. FOURN Context Engine
          </h2>
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-dark)', padding: '0.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => setActiveMode('generic')} 
            className={`btn btn-sm ${activeMode === 'generic' ? 'btn-secondary' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
          >
            Generic AI Assistant
          </button>
          <button 
            onClick={() => setActiveMode('fourn')} 
            className={`btn btn-sm ${activeMode === 'fourn' ? 'btn-primary' : ''}`}
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
          >
            ✨ FOURN Context Engine
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1rem', background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '0.25rem' }}>TRIGGER INPUT</div>
        <div style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 600 }}>
          "Interview scheduled September 4th @ 2:00 PM."
        </div>
      </div>

      {activeMode === 'generic' ? (
        <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--crimson-accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <XCircle size={18} />
            <span>GENERIC AI ASSISTANT RESPONSE (ISOLATED APP ASSISTANT)</span>
          </div>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
            "I have noted your interview for September 4th at 2:00 PM. Would you like me to draft a thank-you email or set a reminder?"
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem', borderTop: '1px solid rgba(244, 63, 94, 0.2)', paddingTop: '0.5rem' }}>
            ❌ No awareness of past job applications, required technical skills, preparation context, or real-world career goals.
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--emerald-accent)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={18} />
            <span>FOURN PERSONAL CONTEXT & OUTCOME ENGINE</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-main)', fontWeight: 700 }}>1. CONNECTED SITUATION</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                Accenture Placement Drive (Applied 19 days ago)
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>2. REQUIRED SKILLS & GAP</div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
                React, Node.js, AWS. <strong>AWS identified as weak area.</strong>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--gold-main)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
              <Sparkles size={14} />
              <span>RECOMMENDED NEXT ACTION</span>
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 700 }}>
              Spend 2 hours on AWS System Design preparation on Aug 26th block.
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              <strong>Why:</strong> The interview is approaching, AWS is a required skill, and preparation time is available in your schedule.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/situations/sit_accenture_interview" className="btn btn-primary btn-sm">
              <span>View Full Situation</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
