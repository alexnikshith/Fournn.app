import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Trash2, Plus, Lock, Sparkles } from 'lucide-react';

export default function MemoryPage() {
  const { token } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [key, setKey] = useState('');
  const [val, setVal] = useState('');
  const [category, setCategory] = useState('context');

  const fetchMemories = () => {
    setLoading(true);
    fetch('/api/memory', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchMemories();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/memory/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to purge all long-term personal memory?')) return;
    try {
      await fetch('/api/memory/clear-all', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!key || !val) return;
    try {
      await fetch('/api/memory/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key, value: val, category })
      });
      setKey('');
      setVal('');
      setShowModal(false);
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Long-Term Memory Control</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Relevant contextual memories stored to assist decision-making. Controllable, explainable, and deletable.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleClearAll} className="btn btn-danger btn-sm">
            <Trash2 size={14} />
            <span>Clear All Memory</span>
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            <Plus size={14} />
            <span>Add Memory Item</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-accent)' }} />
          <div>Accessing long-term memory vault...</div>
        </div>
      ) : memories.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Brain color="var(--primary-accent)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h3>Memory store is empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Fournn stores only relevant long-term context that improves recommendations.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {memories.map(mem => (
            <div key={mem._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-waiting">{mem.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sensitivity: {mem.sensitivity}</span>
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '0.35rem' }}>{mem.key}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  {mem.value}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span>Source: {mem.source}</span>
                <button onClick={() => handleDelete(mem._id)} className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.5rem' }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Add Memory Entry</h2>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Memory Key / Identifier</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. target_salary_range"
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Memory Value</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="e.g. Target range $200k-$220k for senior staff roles"
                  value={val}
                  onChange={e => setVal(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="preference">Preference</option>
                  <option value="goal">Goal</option>
                  <option value="project">Project</option>
                  <option value="commitment">Commitment</option>
                  <option value="context">Context</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Memory</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
