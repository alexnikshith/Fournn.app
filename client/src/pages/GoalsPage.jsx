import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Plus, CheckSquare, Square, Calendar, Sparkles } from 'lucide-react';

export default function GoalsPage() {
  const { token } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Career');

  const fetchGoals = () => {
    setLoading(true);
    fetch('/api/goals', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGoals(data.goals || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchGoals();
  }, [token]);

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      await fetch('/api/goals/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle, category: newCategory })
      });
      setNewTitle('');
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Outcome Goals</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Long-term outcomes converted into actionable milestone plans by Fournn Planning Agent.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>New Goal</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-accent)' }} />
          <div>Structuring goal milestones...</div>
        </div>
      ) : goals.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Target color="var(--emerald-accent)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h3>No active goals defined</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Turn something you want to achieve into an actionable structured plan.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Define Goal
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {goals.map(goal => (
            <div key={goal._id} className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <span className="badge badge-resolved" style={{ marginBottom: '0.35rem' }}>{goal.category}</span>
                  <h3 style={{ fontSize: '1.2rem' }}>{goal.title}</h3>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--emerald-accent)' }}>
                  {goal.progress}%
                </div>
              </div>

              <div className="progress-bar-bg" style={{ marginBottom: '1.25rem' }}>
                <div className="progress-bar-fill" style={{ width: `${goal.progress}%` }}></div>
              </div>

              {/* Milestones */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
                  Milestone Progress
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(goal.milestones || []).map((m, mIdx) => (
                    <div key={mIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                      {m.completed ? (
                        <CheckSquare size={16} color="var(--emerald-accent)" />
                      ) : (
                        <Square size={16} color="var(--text-dim)" />
                      )}
                      <span style={{ color: m.completed ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: m.completed ? 'line-through' : 'none' }}>
                        {m.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Date */}
              {goal.targetDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                  <Calendar size={14} />
                  <span>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Create Outcome Goal</h2>
            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label className="form-label">Goal Outcome Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Land Senior AI Lead Role"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                >
                  <option value="Career">Career</option>
                  <option value="Finance">Finance</option>
                  <option value="Projects">Projects</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
