import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [focusAreas, setFocusAreas] = useState(['Career', 'Finance', 'Projects']);
  const [helpGoals, setHelpGoals] = useState(['Remember important things', 'Track commitments']);
  const navigate = useNavigate();

  const toggleFocus = (area) => {
    setFocusAreas(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]);
  };

  const toggleGoal = (goal) => {
    setHelpGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card highlight" style={{ maxWidth: 640, width: '100%', padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-accent)', fontWeight: 700 }}>
          <Sparkles size={20} />
          <span>FOURNN ONBOARDING — STEP {step} OF 3</span>
        </div>

        {step === 1 && (
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>What matters most to you?</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select your primary life focus areas for context extraction.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
              {['Career', 'Work', 'Education', 'Finance', 'Projects', 'Personal Goals'].map(area => (
                <button
                  key={area}
                  onClick={() => toggleFocus(area)}
                  className={`btn ${focusAreas.includes(area) ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'space-between', padding: '0.85rem 1rem' }}
                >
                  <span>{area}</span>
                  {focusAreas.includes(area) && <Check size={16} />}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%' }}>
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>What would you like Fournn to help with?</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Select key capabilities to enable.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {[
                'Remember important things',
                'Track commitments & pending responses',
                'Manage follow-ups and overdue refunds',
                'Analyze complex choices & decisions',
                'Organize life outcomes into actionable milestone plans'
              ].map(goal => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`btn ${helpGoals.includes(goal) ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'space-between', padding: '0.85rem 1rem' }}
                >
                  <span>{goal}</span>
                  {helpGoals.includes(goal) && <Check size={16} />}
                </button>
              ))}
            </div>

            <button onClick={() => setStep(3)} className="btn btn-primary" style={{ width: '100%' }}>
              <span>Continue to Integration</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Connect Available Services</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Connect your tools or launch in Synthetic Demo mode with realistic sample data.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Gmail Integration</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Read inbox for commitments (Read-Only by default)</div>
                </div>
                <span className="badge badge-resolved">Ready</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>Google Calendar</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Sync events & preparation timelines</div>
                </div>
                <span className="badge badge-resolved">Ready</span>
              </div>
            </div>

            <button onClick={handleFinish} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
              <span>Launch Fournn OS</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
