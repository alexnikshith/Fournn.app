import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const isRegisterInitial = searchParams.get('mode') === 'register';
  const [isRegister, setIsRegister] = useState(isRegisterInitial);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError('');
    setLoading(true);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-card highlight" style={{ maxWidth: 440, width: '100%', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="brand-icon" style={{ width: 44, height: 44, margin: '0 auto 1rem' }}>
            <Sparkles size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>
            {isRegister ? 'Create Fournn Account' : 'Welcome to Fournn'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isRegister ? 'Your AI Personal Operating System' : 'Sign in to access your Personal Context Graph'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--crimson-accent)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: '1.25rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                required={isRegister}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
            <span>{loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '1.5rem 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
          OR
        </div>

        <button onClick={handleDemo} className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
          <Sparkles size={16} color="var(--primary-accent)" />
          <span>Launch Instant Synthetic Demo</span>
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>Already have an account? <button onClick={() => setIsRegister(false)} style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', fontWeight: 600, cursor: 'pointer' }}>Sign In</button></span>
          ) : (
            <span>Need an account? <button onClick={() => setIsRegister(true)} style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', fontWeight: 600, cursor: 'pointer' }}>Register</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
