import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle2, XCircle, Send, FileText, Check, Sparkles } from 'lucide-react';

export default function AttentionPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedDraft, setEditedDraft] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/attention', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const handleAction = async (itemId, action) => {
    setActionLoading(true);
    try {
      await fetch(`/api/attention/${itemId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action, editedDraft })
      });
      setSelectedItem(null);
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return item.status !== 'resolved';
    return item.category === activeTab || item.status === activeTab;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Attention Center</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Items identified across your digital life that require decision, response, or follow-up.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-group">
        {['all', 'urgent', 'important', 'waiting', 'upcoming', 'resolved'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-accent)' }} />
          <div>Scanning attention stream...</div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <CheckCircle2 color="var(--emerald-accent)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h3>All clear in this view!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Fournn is continuously monitoring your context for items needing attention.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map(item => (
            <div key={item._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyBetween: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span className={`badge badge-${item.category}`}>{item.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Confidence: {Math.round((item.confidence || 0.85) * 100)}%
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{item.subtitle}</p>

                <div style={{ background: 'var(--bg-surface)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--amber-accent)' }}>Why it matters:</strong>
                  <p style={{ marginTop: '0.25rem', color: 'var(--text-main)' }}>{item.reason}</p>
                </div>

                <div style={{ fontSize: '0.88rem', marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--emerald-accent)' }}>Recommendation:</strong>
                  <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>{item.recommendedAction}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                {item.draftResponse ? (
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setEditedDraft(item.draftResponse);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <FileText size={14} />
                    <span>Review Draft</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAction(item._id, 'approve')}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Check size={14} />
                    <span>Approve & Execute</span>
                  </button>
                )}

                <button
                  onClick={() => handleAction(item._id, 'dismiss')}
                  className="btn btn-secondary btn-sm"
                >
                  <XCircle size={14} />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Draft Review Modal */}
      {selectedItem && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Review Proposed Action Draft</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Fournn will dispatch this response only after your explicit approval.
            </p>

            <div className="form-group">
              <label className="form-label">Proposed Response Content</label>
              <textarea
                rows={6}
                className="form-textarea"
                value={editedDraft}
                onChange={e => setEditedDraft(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedItem(null)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedItem._id, 'approve')}
                className="btn btn-primary"
                disabled={actionLoading}
              >
                <Send size={16} />
                <span>{actionLoading ? 'Executing...' : 'Approve & Dispatch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
