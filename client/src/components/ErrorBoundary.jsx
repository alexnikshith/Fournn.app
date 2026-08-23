import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Fournn UI ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            maxWidth: 600, 
            margin: '4rem auto',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div className="metric-icon" style={{ width: 56, height: 56, margin: '0 auto 1.5rem', color: 'var(--crimson-accent)' }}>
            <AlertCircle size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Something unexpected happened</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Fournn encountered a temporary display issue. Click below to reload your context view.
          </p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }} 
            className="btn btn-primary"
          >
            <RefreshCw size={18} />
            <span>Reload View</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
