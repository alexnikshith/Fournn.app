import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Activity, Clock, CheckCircle2, ShieldAlert, Sparkles, FileText } from 'lucide-react';

export default function ActivityPage() {
  const { token } = useAuth();
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch('/api/agents', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setRuns(data.recentRuns || []);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [token]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Agent Activity & Audit Log</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Transparent audit history of agent runs, reasoning, permission gates, execution, and verification.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-accent)' }} />
          <div>Retrieving audit timeline...</div>
        </div>
      ) : runs.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Activity color="var(--primary-accent)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h3>No activity logged yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Agent executions and permission checks will appear here in real time.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {runs.map(run => (
            <div key={run._id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-waiting">{run.agentName}</span>
                  <h3 style={{ fontSize: '1.05rem' }}>{run.action}</h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${run.userApproved ? 'badge-resolved' : 'badge-important'}`}>
                    {run.userApproved ? 'User Approved' : 'Pending Approval'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {new Date(run.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Reason:</strong>
                  <p style={{ color: 'var(--text-main)', marginTop: '0.15rem' }}>{run.reason}</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-muted)' }}>Input Context:</strong>
                  <p style={{ color: 'var(--text-main)', marginTop: '0.15rem' }}>{run.inputContext || 'N/A'}</p>
                </div>
              </div>

              <div style={{ fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--emerald-accent)' }}>Verification Details:</strong>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>{run.verificationDetails}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
