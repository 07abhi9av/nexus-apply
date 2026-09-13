import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[in.gress ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('nexus_logged_out');
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#080A10',
            color: '#F5F5F7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Ambient Glow */}
          <div
            style={{
              position: 'absolute',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255, 69, 58, 0.12) 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: 'rgba(18, 22, 34, 0.85)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 69, 58, 0.3)',
              borderRadius: '24px',
              padding: '36px',
              textAlign: 'center',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 69, 58, 0.15)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                background: 'rgba(255, 69, 58, 0.15)',
                border: '1px solid rgba(255, 69, 58, 0.35)',
                marginBottom: '20px',
                color: '#ff453a',
              }}
            >
              <AlertTriangle style={{ width: '32px', height: '32px' }} />
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '980px',
                background: 'rgba(255, 69, 58, 0.12)',
                border: '1px solid rgba(255, 69, 58, 0.28)',
                color: '#ff453a',
                fontSize: '11px',
                fontFamily: 'monospace',
                fontWeight: 650,
                marginBottom: '14px',
              }}
            >
              <ShieldAlert style={{ width: '12px', height: '12px' }} />
              RUNTIME ISOLATION ENGAGED
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
              Interface Interruption
            </h1>

            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.65)', lineHeight: 1.5, margin: '0 0 24px 0' }}>
              An unexpected component exception was isolated. Your active candidate credentials, resume telemetry, and corridor bookmarks remain preserved.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  maxHeight: '90px',
                  overflowY: 'auto',
                }}
              >
                <code style={{ fontSize: '11.5px', color: '#ff7b72', fontFamily: 'monospace', wordBreak: 'break-word' }}>
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0A84FF 0%, #0077ED 100%)',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '13.5px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(10, 132, 255, 0.35)',
                }}
              >
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                <span>Recover Session</span>
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Home style={{ width: '14px', height: '14px' }} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
