import WeeklyReport from '../components/Intelligence/WeeklyReport';

export default function DecisionPage() {
  const { token } = useAuth();
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  const fetchDecisions = () => {
    setLoading(true);
    fetch('/api/decisions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setDecisions(data.decisions || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchDecisions();
  }, [token]);

  const handleCreateDecision = async (e) => {
    e.preventDefault();
    if (!title || !opt1 || !opt2) return;
    setCreateLoading(true);
    try {
      await fetch('/api/decisions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          options: [{ title: opt1 }, { title: opt2 }]
        })
      });
      setTitle('');
      setOpt1('');
      setOpt2('');
      setShowModal(false);
      fetchDecisions();
    } catch (err) {
      console.error(err);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSelectOption = async (id, optionTitle) => {
    try {
      await fetch(`/api/decisions/${id}/select`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ selectedOption: optionTitle })
      });
      fetchDecisions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <WeeklyReport decisions={decisions} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Decision Intelligence Center</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Structured trade-off evaluation explicitly separating Fact, Inference, Recommendation, and Unknowns.
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>New Decision Analysis</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Sparkles className="animate-spin" size={24} style={{ marginBottom: '0.5rem', color: 'var(--primary-accent)' }} />
          <div>Evaluating decision matrices...</div>
        </div>
      ) : decisions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <GitPullRequest color="var(--primary-accent)" size={48} style={{ margin: '0 auto 1rem' }} />
          <h3>No decisions under review</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem', maxWidth: 460, margin: '0.5rem auto 1.5rem' }}>
            When you face a complex hardware, career, or financial decision, Fournn helps analyze trade-offs, risks, and evidence.
          </p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Create First Decision
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {decisions.map(dec => (
            <div key={dec._id} className="glass-card highlight" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span className="badge badge-waiting" style={{ marginBottom: '0.5rem' }}>{dec.category || 'Hardware'}</span>
                  <h2 style={{ fontSize: '1.4rem' }}>{dec.title}</h2>
                  {dec.description && <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{dec.description}</p>}
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'right', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase' }}>Fournn Recommendation</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.15rem' }}>{dec.recommendation}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--emerald-accent)', marginTop: '0.15rem' }}>
                    Confidence: {Math.round((dec.confidence || 0.8) * 100)}%
                  </div>
                </div>
              </div>

              {/* FACT / INFERENCE / RECOMMENDATION / UNKNOWN Classification Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'rgba(52, 211, 153, 0.08)', border: '1px solid rgba(52, 211, 153, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-accent)', marginBottom: '0.3rem' }}>✓ FACT (VERIFIED DATA)</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{dec.biggestAdvantage || 'Verified price and hardware specs from store.'}</div>
                </div>

                <div style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-main)', marginBottom: '0.3rem' }}>⚡ INFERENCE (CONTEXT)</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{dec.triggerCondition || 'Inferred high performance fit for AI model training.'}</div>
                </div>

                <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-accent)', marginBottom: '0.3rem' }}>🎯 RECOMMENDATION</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{dec.recommendation}</div>
                </div>

                <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--crimson-accent)', marginBottom: '0.3rem' }}>❓ UNKNOWN (MISSING DATA)</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Long-term battery degradation under sustained ML load.</div>
                </div>
              </div>

              {/* Options Comparison Table Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {dec.options.map((opt, idx) => {
                  const isRecommended = opt.title === dec.recommendation;
                  const isSelected = dec.selectedOption === opt.title;

                  return (
                    <div
                      key={idx}
                      style={{
                        background: isRecommended ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-surface)',
                        border: isRecommended ? '1px solid var(--primary-accent)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem' }}>{opt.title}</h3>
                        {isRecommended && <span className="badge badge-resolved">Recommended</span>}
                      </div>

                      {opt.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{opt.description}</p>}

                      <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--emerald-accent)' }}>Pros:</strong>
                        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', color: 'var(--text-main)' }}>
                          {(opt.pros || []).map((p, pIdx) => <li key={pIdx}>{p}</li>)}
                        </ul>
                      </div>

                      <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <strong style={{ color: 'var(--crimson-accent)' }}>Cons:</strong>
                        <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                          {(opt.cons || []).map((c, cIdx) => <li key={cIdx}>{c}</li>)}
                        </ul>
                      </div>

                      <button
                        onClick={() => handleSelectOption(dec._id, opt.title)}
                        className={`btn ${isSelected ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                        style={{ width: '100%' }}
                      >
                        {isSelected ? '✓ Selected Choice' : `Select ${opt.title}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Decision Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Analyze New Decision</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Input your options and Fournn Decision Agent will evaluate trade-offs and evidence.
            </p>

            <form onSubmit={handleCreateDecision}>
              <div className="form-group">
                <label className="form-label">Decision Question / Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Which laptop should I buy for AI dev?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Option A</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., MacBook Pro M3 Max"
                  value={opt1}
                  onChange={e => setOpt1(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Option B</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., ThinkPad Z16 Gen 2"
                  value={opt2}
                  onChange={e => setOpt2(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={createLoading}>
                  <span>{createLoading ? 'Analyzing...' : 'Generate Analysis'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
