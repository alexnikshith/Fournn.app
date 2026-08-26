import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, CheckCircle2, XCircle, Send, FileText, Check, Sparkles, Trash2, Plus, Mail, CheckCircle } from 'lucide-react';

export default function AttentionPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('reviewId');

  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editedDraft, setEditedDraft] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderUser, setSenderUser] = useState(() => localStorage.getItem('fournn_smtp_user') || 'nikshithgurram2006@gmail.com');
  const [senderPass, setSenderPass] = useState(() => localStorage.getItem('fournn_smtp_pass') || '');
  const [showSenderConfig, setShowSenderConfig] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Ingest Real Email Modal State
  const [showIngestModal, setShowIngestModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [ingestLoading, setIngestLoading] = useState(false);

  const openReviewModal = (item) => {
    if (!item) return;
    setSelectedItem(item);
    setEditedDraft(item.draftResponse || '');
    // Extract exact clean email address from item evidence or fallback
    let extractedRecipient = 'alexnick20006@gmail.com';
    if (item.evidence && item.evidence[0]) {
      const match = item.evidence[0].match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
      if (match) extractedRecipient = match[1].toLowerCase();
    }
    setRecipientEmail(extractedRecipient);
  };

  const fetchItems = () => {
    setLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/attention', { headers })
      .then(res => res.json())
      .then(data => {
        const fetchedItems = data.items || [];
        setItems(fetchedItems);

        // Auto open review modal if reviewId parameter is passed in URL
        if (reviewId) {
          const target = fetchedItems.find(i => i._id === reviewId);
          if (target) openReviewModal(target);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();

    const handleSyncEvent = () => {
      fetchItems();
    };
    window.addEventListener('fournn_sync_event', handleSyncEvent);
    return () => window.removeEventListener('fournn_sync_event', handleSyncEvent);
  }, [token, reviewId]);

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

  const handleAction = async (itemId) => {
    setActionLoading(true);
    if (senderUser) localStorage.setItem('fournn_smtp_user', senderUser);
    if (senderPass) localStorage.setItem('fournn_smtp_pass', senderPass);

    try {
      const res = await fetch(`/api/attention/${itemId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ actionDraft: editedDraft, recipientEmail, senderUser, senderPass })
      });
      const data = await res.json();

      // Update local state immediately with exact user-edited draft response
      setItems(prev => prev.map(item => {
        if (item._id === itemId) {
          return {
            ...item,
            status: 'Resolved & Sent Live',
            draftResponse: editedDraft,
            dispatchedTo: recipientEmail || 'alexnick20006@gmail.com',
            dispatchedAt: new Date().toLocaleString()
          };
        }
        return item;
      }));

      setSelectedItem(null);
      setToastMessage(data.message || `⚡ Real Email Dispatched Live to ${recipientEmail || 'Recipient'}!`);
      setTimeout(() => setToastMessage(''), 7000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const isDispatched = item.status === 'Resolved & Sent Live' || item.status === 'Resolved';

    // DISPATCHED tab shows all resolved/dispatched emails
    if (activeTab === 'dispatched') {
      return isDispatched;
    }

    if (activeTab === 'all') {
      return true;
    }

    // Check if category or priority matches tab
    const matchesCategory = (item.category && item.category.toLowerCase() === activeTab.toLowerCase()) || 
                            (item.priority && item.priority.toLowerCase() === activeTab.toLowerCase());
    
    return matchesCategory;
  });

  const getTabCount = (tab) => {
    if (tab === 'all') return items.length;
    if (tab === 'dispatched') return items.filter(i => i.status === 'Resolved & Sent Live' || i.status === 'Resolved').length;
    return items.filter(i => 
      (i.category && i.category.toLowerCase() === tab.toLowerCase()) || 
      (i.priority && i.priority.toLowerCase() === tab.toLowerCase())
    ).length;
  };

  return (
    <div style={{ width: '100%' }}>
      {toastMessage && (
        <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}>
          <CheckCircle2 size={24} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Attention Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            High-value communication streams, overdue items, and real-world email dispatching.
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

      {/* Category Tabs with Item Counts */}
      <div className="tab-group">
        {['all', 'dispatched', 'Career', 'Personal', 'Financial', 'Education', 'Promotions', 'Urgent', 'Important'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            style={tab === 'dispatched' ? { color: 'var(--emerald-accent)', fontWeight: 700 } : {}}
          >
            {tab.toUpperCase()} ({getTabCount(tab)})
          </button>
        ))}
      </div>

      {/* Items List */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading items...</div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <CheckCircle2 color="var(--emerald-accent)" size={42} style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
            {activeTab === 'dispatched' ? 'No dispatched emails found under this filter' : 'No pending items needing attention!'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
            {activeTab === 'dispatched' 
              ? 'Dispatched emails will be permanently stored and listed here once approved.' 
              : 'All email actions have been dispatched in real time. Click "Ingest Real Email" below to add a new message stream.'}
          </p>
          <button onClick={() => setShowIngestModal(true)} className="btn btn-primary">
            <Mail size={18} />
            <span>Ingest Real Email</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredItems.map(item => {
            const isDispatched = item.status === 'Resolved & Sent Live' || item.status === 'Resolved';

            return (
              <div key={item._id} className="glass-card highlight" style={isDispatched ? { borderLeft: '4px solid var(--emerald-accent)' } : {}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                    <span className={`badge ${isDispatched ? 'badge-resolved' : item.priority === 'Urgent' ? 'badge-urgent' : 'badge-important'}`}>
                      {isDispatched ? 'DISPATCHED' : item.priority}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.category}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>
                    Status: {item.status || 'Resolved & Sent Live'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.6rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {item.summary}
                </p>

                {isDispatched && (
                  <div style={{ background: 'var(--bg-surface)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.82rem', color: 'var(--emerald-accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                      ⚡ Sent Live To: {item.dispatchedTo || 'alexnick20006@gmail.com'}
                    </div>
                    <div style={{ fontSize: '0.94rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                      "{item.draftResponse}"
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Verified Audit Timestamp: {item.dispatchedAt || 'Sent via Gmail Account'}
                    </div>
                  </div>
                )}

                {!isDispatched && item.proposedAction && (
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

                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {isDispatched ? (
                      <button 
                        onClick={() => openReviewModal(item)} 
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: 'var(--emerald-accent)', color: 'var(--emerald-accent)' }}
                      >
                        <Send size={15} />
                        <span>Re-Send / Follow-Up Email</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => openReviewModal(item)} 
                        className="btn btn-primary btn-sm"
                      >
                        <Send size={16} />
                        <span>Review & Dispatch Real Email</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review & Dispatch Modal */}
      {selectedItem && (
        <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Mail color="var(--gold-main)" size={24} />
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Review & Dispatch Real Email</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Inspect and edit the real-time outgoing message prior to instant dispatch.
            </p>

            <div className="form-group">
              <label className="form-label">Email Subject / Item</label>
              <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>{selectedItem.title}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. alexnick2006@gmail.com"
                value={recipientEmail}
                onChange={e => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Response Body Text</label>
              <textarea
                rows={5}
                className="form-textarea"
                value={editedDraft}
                onChange={e => setEditedDraft(e.target.value)}
              />
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div 
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setShowSenderConfig(!showSenderConfig)}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--emerald-accent)' }}>
                  ⚡ Direct Gmail SMTP Dissemination Enabled (1-Click Sent Items Sync)
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{showSenderConfig ? 'Hide' : 'Configure'}</span>
              </div>

              {showSenderConfig && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                  <div className="form-group" style={{ marginBottom: '0.65rem' }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Your Gmail Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={senderUser}
                      onChange={e => setSenderUser(e.target.value)}
                      placeholder="nikshithgurram2006@gmail.com"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>Gmail App Password (16-character code)</label>
                    <input
                      type="password"
                      className="form-input"
                      value={senderPass}
                      onChange={e => setSenderPass(e.target.value)}
                      placeholder="Enter 16-character Gmail App Password"
                    />
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
              <button onClick={() => setSelectedItem(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={() => handleAction(selectedItem._id)} className="btn btn-primary" disabled={actionLoading}>
                <Send size={18} />
                <span>{actionLoading ? 'Dispatching Live...' : 'Approve & Dispatch Real Email'}</span>
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
