import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle2, XCircle, Send, FileText, Check, Sparkles, Trash2, Plus, Mail } from 'lucide-react';

export default function AttentionPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedDraft, setEditedDraft] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Ingest Real Email Modal State
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [ingestLoading, setIngestLoading] = useState(false);

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

  const handleClearDemoData = async () => {
    if (!confirm('Are you sure you want to clear sample demo items and keep only real emails?')) return;
    try {
      await fetch('/api/demo/clear', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleIngestRealEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject) return;
    setIngestLoading(true);
    try {
      await fetch('/api/integrations/ingest-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: emailSubject,
          sender: emailSender,
          body: emailBody,
          category: 'Career'
        })
      });
      setShowIngestModal(false);
      setEmailSubject('');
      setEmailSender('');
      setEmailBody('');
      fetchItems();
    } catch (err) {
      console.error(err);
    } finally {
      setIngestLoading(false);
    }
  };

  const handleAction = async (itemId, action) => {
    setActionLoading(true);
    try {
      await fetch(`/api/attention/${itemId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ actionDraft: editedDraft })
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
    if (activeTab === 'all') return item.status !== 'Resolved';
    return item.category.toLowerCase() === activeTab.toLowerCase() || item.priority.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Attention Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            High-value communication streams, overdue items, and real-world outcomes requiring your review.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowIngestModal(true)} 
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} />
            <span>Ingest Real Email</span>
          </button>

          <button 
            onClick={handleClearDemoData} 
            className="btn btn-danger btn-sm"
            title="Wipe sample demo items and keep only real data"
          >
            <Trash2 size={16} />
            <span>Clear Demo Items</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="tab-group">
        {['all', 'Urgent', 'Important', 'Career', 'Financial'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Items List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CheckCircle2 color="var(--emerald-accent)" size={42} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No items needing attention!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            Click "Ingest Real Email" above to process your real Gmail messages into actionable items.
          </p>
          <button onClick={() => setShowIngestModal(true)} className="btn btn-primary">
            <Mail size={18} />
            <span>Ingest Real Email</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredItems.map(item => (
            <div key={item._id} className="glass-card highlight">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  <span className={`badge ${item.priority === 'Urgent' ? 'badge-urgent' : 'badge-important'}`}>
                    {item.priority}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.category}</span>
                </div>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Status: {item.status}</span>
              </div>

              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {item.summary}
              </p>

              {item.proposedAction && (
                <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gold-main)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                    Proposed Action
                  </div>
                  <div style={{ fontSize: '0.98rem', color: 'var(--text-main)' }}>{item.proposedAction}</div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {item.evidence?.map((ev, i) => (
                    <span key={i} style={{ fontSize: '0.8rem', background: 'rgba(255, 255, 255, 0.05)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', color: 'var(--text-dim)' }}>
                      {ev}
                    </span>
                  ))}
                </div>

                {item.draftResponse && (
                  <button 
                    onClick={() => {
                      setSelectedItem(item);
                      setEditedDraft(item.draftResponse);
                    }} 
                    className="btn btn-primary btn-sm"
                  >
                    <FileText size={16} />
                    <span>Review Draft & Action</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Action Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Review Action & Draft Response</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Inspect and customize the generated response prior to user-approved execution.
            </p>

            <div className="form-group">
              <label className="form-label">Item Title</label>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedItem.title}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Response Draft</label>
              <textarea
                rows={5}
                className="form-textarea"
                value={editedDraft}
                onChange={e => setEditedDraft(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button onClick={() => setSelectedItem(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleAction(selectedItem._id, 'approve')} className="btn btn-primary" disabled={actionLoading}>
                <Send size={18} />
                <span>Approve & Dispatch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Real Email Modal */}
      {showIngestModal && (
        <div className="modal-backdrop" onClick={() => setShowIngestModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Ingest Real Email Stream</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Paste details from your Gmail inbox (such as Accenture Pre-Placement Connect Session or Job Updates) to process into Fournn.
            </p>

            <form onSubmit={handleIngestRealEmail}>
              <div className="form-group">
                <label className="form-label">Email Subject *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Accenture: Pre-Placement Connect Session on 24th Aug 2026 @ 12.00PM Virtual"
                  value={emailSubject}
                  onChange={e => setEmailSubject(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sender Email / Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Nivin / placement@accenture.com"
                  value={emailSender}
                  onChange={e => setEmailSender(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Summary / Body Text</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  placeholder="Paste email text or details..."
                  value={emailBody}
                  onChange={e => setEmailBody(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" onClick={() => setShowIngestModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={ingestLoading}>
                  <Sparkles size={18} />
                  <span>Process Into Fournn</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
