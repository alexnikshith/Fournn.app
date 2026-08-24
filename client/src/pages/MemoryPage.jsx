import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Trash2, Plus, Lock, Sparkles, RefreshCw } from 'lucide-react';

const DEFAULT_MEMORIES = [
  {
    _id: 'mem_default_1',
    key: 'placement_target_career_goal',
    value: 'Accenture Placement Connect & Full-Stack Lead position (Target $120k-$150k or ₹15L+)',
    category: 'goal',
    sensitivity: 'Medium',
    source: 'Gmail Stream'
  },
  {
    _id: 'mem_default_2',
    key: 'preferred_work_location',
    value: 'Hyderabad District / Remote hybrid preference',
    category: 'preference',
    sensitivity: 'Low',
    source: 'User Onboarding Profile'
  }
];

export default function MemoryPage() {
  const { token } = useAuth();
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [loading, setLoading] = useState(false);
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
        if (data && Array.isArray(data.memories) && data.memories.length > 0) {
          setMemories(data.memories);
        }
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
      setMemories(prev => prev.filter(m => m._id !== id));
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
      setMemories([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!key || !val) return;
    const newMem = {
      _id: 'mem_user_' + Date.now(),
      key,
      value: val,
      category,
      sensitivity: 'Medium',
      source: 'User Defined'
    };
    setMemories(prev => [newMem, ...prev]);
    setKey('');
    setVal('');
    setShowModal(false);

    try {
      await fetch('/api/memory/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key, value: val, category })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const safeMemories = Array.isArray(memories) ? memories : DEFAULT_MEMORIES;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Long-Term Memory Control</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Relevant contextual memories stored to assist decision-making. Controllable, explainable, and deletable.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {loading && (
            <span style={{ fontSize: '0.85rem', color: 'var(--gold-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RefreshCw size={14} className="animate-spin" />
              <span>Syncing vault...</span>
            </span>
          )}
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

      {safeMemories.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <Brain color="var(--gold-main)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Memory store is empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 460, margin: '0 auto 1.5rem' }}>
            Fournn stores only relevant long-term context that improves recommendations. Click below to add a memory item.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Memory Item</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {safeMemories.map(mem => (
            <div key={mem._id} className="glass-card highlight" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span className="badge badge-resolved" style={{ textTransform: 'uppercase', fontSize: '0.72rem' }}>{mem.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Sensitivity: {mem.sensitivity || 'Medium'}</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.45rem', color: 'var(--text-main)' }}>{mem.key}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', lineHeight: 1.5, border: '1px solid var(--border-color)' }}>
                  {mem.value}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                <span>Source: {mem.source || 'Context Agent'}</span>
                <button onClick={() => handleDelete(mem._id)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.55rem' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Add Personal Memory Entry</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Add custom long-term rules, salary goals, or career context to guide Fournn AI agents.
            </p>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Memory Key / Identifier</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. accenture_placement_preference"
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
                  placeholder="e.g. High priority target: Accenture full-stack role at ₹12L-15L+"
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
