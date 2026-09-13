import React, { useState } from 'react';
import { X, UserPlus, Shield, ArrowLeft } from 'lucide-react';

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
  given_name?: string;
  family_name?: string;
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (user: GoogleUser) => void;
}

const DEFAULT_ACCOUNTS: GoogleUser[] = [];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setError('Please enter a valid Google email address');
      return;
    }
    const derivedName = customName.trim() || customEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newUser: GoogleUser = {
      id: `google-user-${Date.now()}`,
      name: derivedName,
      email: customEmail.trim().toLowerCase(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=0A84FF&color=fff&size=96`,
      given_name: derivedName.split(' ')[0],
    };
    onSelectAccount(newUser);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--modal-bg)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid var(--modal-border)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '440px',
          padding: '32px 28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-tertiary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Cancel"
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'var(--card-bg)', border: '1px solid var(--border-subtle)', marginBottom: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isCustomMode ? 'Sign in with any Google Account' : 'Choose an account'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            to continue to <strong style={{ color: 'var(--text-primary)' }}>Direct Career Portals</strong>
          </p>
        </div>

        {!isCustomMode ? (
          <>
            {/* Account List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {DEFAULT_ACCOUNTS.map((account) => (
                <div
                  key={account.id}
                  onClick={() => {
                    onSelectAccount(account);
                    onClose();
                  }}
                  className="btn-glass"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.18s ease',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #0A84FF, #0077ED)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '16px',
                        fontFamily: 'var(--font-display)',
                        boxShadow: '0 2px 8px rgba(10, 132, 255, 0.3)',
                      }}
                    >
                      {account.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {account.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {account.email}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(48, 209, 88, 0.12)',
                      color: 'var(--accent-green)',
                      padding: '2px 8px',
                      borderRadius: '980px',
                      fontWeight: 600,
                    }}
                  >
                    Active
                  </span>
                </div>
              ))}

              {/* Use another account button */}
              <button
                onClick={() => setIsCustomMode(true)}
                className="btn-glass"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--nav-track-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <UserPlus style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Use another Google account
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Sign in with your personal or corporate email
                  </div>
                </div>
              </button>
            </div>
          </>
        ) : (
          /* Custom Google Account Form */
          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Google Email Address
              </label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={customEmail}
                onChange={(e) => {
                  setCustomEmail(e.target.value);
                  setError(null);
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Display Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '14px',
                  borderRadius: '10px',
                }}
              />
            </div>

            {error && (
              <div style={{ fontSize: '12px', color: '#FF453A' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="btn-glass"
                style={{ fontSize: '13px', padding: '9px 16px', flex: 1 }}
              >
                <ArrowLeft style={{ width: '14px', height: '14px', marginRight: '6px' }} />
                Back
              </button>

              <button
                type="submit"
                className="btn-glass btn-blue"
                style={{ fontSize: '13px', padding: '9px 20px', flex: 1.5, justifyContent: 'center' }}
              >
                Continue
              </button>
            </div>
          </form>
        )}

        {/* Security & OAuth disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '14px',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          <Shield style={{ width: '14px', height: '14px', color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
          <span>
            To continue, Google will share your name, email address, language preference, and profile picture with Direct Career Portals.
          </span>
        </div>
      </div>
    </div>
  );
};
