import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Briefcase,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  resetPasswordForEmail,
  type AuthUser,
  isSupabaseConfigured,
} from '../services/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  initialMode?: 'sign-in' | 'register';
}

type AuthTab = 'sign-in' | 'register';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'sign-in',
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode if changed from parent
  useEffect(() => {
    setActiveTab(initialMode);
    setIsForgotPassword(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setTargetRole('');
    setIsForgotPassword(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  const handleTabSwitch = (tab: AuthTab) => {
    setActiveTab(tab);
    setIsForgotPassword(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const triggerSuccessCelebration = (user: AuthUser) => {
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.65 },
      colors: ['#0A84FF', '#30D158', '#5E5CE6', '#00FFFF'],
    });
    onSuccess(user);
    handleClose();
  };

  // 1. Google 1-Click SSO
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await signInWithGoogle();
      if (error) {
        setErrorMessage(error.message || 'Google sign-in could not be completed.');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        triggerSuccessCelebration(data.user);
      }
      // If live Supabase OAuth redirect is triggered, browser will navigate to Google accounts
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate with Google.');
      setIsLoading(false);
    }
  };

  // 2. Email Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await signInWithEmail(email.trim(), password);
      if (error) {
        setErrorMessage(error.message || 'Invalid email or password. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        triggerSuccessCelebration(data.user);
      } else {
        setErrorMessage('Unable to log in. Please try again or sign up.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during sign in.');
      setIsLoading(false);
    }
  };

  // 3. Email Register / Sign Up
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and re-type.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { data, error } = await signUpWithEmail(
        email.trim(),
        password,
        fullName.trim(),
        targetRole.trim() || 'DevOps / SRE Engineer'
      );

      if (error) {
        setErrorMessage(error.message || 'Registration failed. Please try a different email.');
        setIsLoading(false);
        return;
      }

      if (data?.session && data.user) {
        // Auto-confirmed or sandbox dev session
        triggerSuccessCelebration(data.user);
      } else if (data?.user) {
        // Supabase requires email verification
        setIsLoading(false);
        setSuccessMessage(
          `Confirmation email sent to ${email}! Please check your inbox and click the verification link to activate your account.`
        );
      } else {
        setIsLoading(false);
        setSuccessMessage('Account registered successfully! You may now sign in.');
        setActiveTab('sign-in');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create account.');
      setIsLoading(false);
    }
  };

  // 4. Forgot Password Flow
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your registered email address to receive reset instructions.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await resetPasswordForEmail(email.trim());
      if (error) {
        setErrorMessage(error.message || 'Unable to send password reset email.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSuccessMessage(
        `Password reset link sent to ${email}. Check your inbox (and spam folder) to reset your password.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send password reset request.');
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={handleClose}
      style={{
        zIndex: 9999,
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'rgba(18, 20, 29, 0.95)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 50px rgba(10, 132, 255, 0.12)',
          position: 'relative',
          color: 'var(--text-primary)',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Glowing Top Ambient Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #0A84FF, #30D158, transparent)',
            borderRadius: '999px',
          }}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Close modal"
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '980px',
              background: 'rgba(10, 132, 255, 0.12)',
              border: '1px solid rgba(10, 132, 255, 0.3)',
              marginBottom: '10px',
            }}
          >
            <ShieldCheck style={{ width: '13px', height: '13px', color: '#0A84FF' }} />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0A84FF', fontWeight: 650 }}>
              IN.GRESS AUTH · {isSupabaseConfigured() ? 'SUPABASE SECURED' : 'LOCAL DEV SANDBOX'}
            </span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            {isForgotPassword
              ? 'Reset Your Password'
              : activeTab === 'sign-in'
              ? 'Sign in to in.gress'
              : 'Create Candidate Account'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {isForgotPassword
              ? 'Enter your registered email to receive a recovery link'
              : activeTab === 'sign-in'
              ? 'Access 100+ verified tech career portals and ATS tools'
              : '100% free forever · Auto-matched to top tech corridors'}
          </p>
        </div>

        {/* Mode Switcher Tabs (Sign In vs Create Account) */}
        {!isForgotPassword && (
          <div
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '20px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <button
              type="button"
              onClick={() => handleTabSwitch('sign-in')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'sign-in' ? 'var(--accent-blue)' : 'transparent',
                color: activeTab === 'sign-in' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <KeyRound style={{ width: '14px', height: '14px' }} />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'register' ? 'var(--accent-green)' : 'transparent',
                color: activeTab === 'register' ? '#000000' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <Sparkles style={{ width: '14px', height: '14px' }} />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Inline Alerts */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(255, 69, 58, 0.12)',
              border: '1px solid rgba(255, 69, 58, 0.35)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ff453a',
              fontSize: '12.5px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              background: 'rgba(48, 209, 88, 0.12)',
              border: '1px solid rgba(48, 209, 88, 0.35)',
              borderRadius: '12px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#30d158',
              fontSize: '12.5px',
              lineHeight: 1.4,
            }}
          >
            <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{successMessage}</span>
          </div>
        )}

        {/* 1. GOOGLE ONE-CLICK SSO BUTTON (Always Top-Priority) */}
        {!isForgotPassword && (
          <>
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#1f1f1f',
                fontSize: '13.5px',
                fontWeight: 650,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoading) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google (1-Click SSO)'}</span>
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '18px 0',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 650,
                  letterSpacing: '0.05em',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                }}
              >
                or continue with email
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.12)' }} />
            </div>
          </>
        )}

        {/* 2. SIGN IN FORM */}
        {!isForgotPassword && activeTab === 'sign-in' && (
          <form onSubmit={handleEmailSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '15px',
                    height: '15px',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@company.com"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 36px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                <label style={{ fontSize: '11.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '15px',
                    height: '15px',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 36px 11px 36px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '15px', height: '15px' }} /> : <Eye style={{ width: '15px', height: '15px' }} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '4px',
                padding: '12px',
                borderRadius: '11px',
                background: 'var(--accent-blue)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(10, 132, 255, 0.35)',
              }}
            >
              <span>{isLoading ? 'Signing in...' : 'Sign In to Ingress'}</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>
          </form>
        )}

        {/* 3. CREATE ACCOUNT (REGISTER) FORM */}
        {!isForgotPassword && activeTab === 'register' && (
          <form onSubmit={handleEmailRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      color: 'var(--text-tertiary)',
                    }}
                  />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 32px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                  Target Engineering Role
                </label>
                <div style={{ position: 'relative' }}>
                  <Briefcase
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      color: 'var(--text-tertiary)',
                    }}
                  />
                  <input
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="DevOps / SRE"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 32px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '15px',
                    height: '15px',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@company.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 36px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                  Password (min 6)
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      color: 'var(--text-tertiary)',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '10px 28px 10px 30px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff style={{ width: '13px', height: '13px' }} /> : <Eye style={{ width: '13px', height: '13px' }} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '14px',
                      height: '14px',
                      color: 'var(--text-tertiary)',
                    }}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    style={{
                      width: '100%',
                      padding: '10px 28px 10px 30px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border:
                        confirmPassword && confirmPassword !== password
                          ? '1px solid #ff453a'
                          : '1px solid rgba(255, 255, 255, 0.12)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {showConfirmPassword ? <EyeOff style={{ width: '13px', height: '13px' }} /> : <Eye style={{ width: '13px', height: '13px' }} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '6px',
                padding: '12px',
                borderRadius: '11px',
                background: 'var(--accent-green)',
                border: 'none',
                color: '#000000',
                fontSize: '13.5px',
                fontWeight: 750,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(48, 209, 88, 0.35)',
              }}
            >
              <span>{isLoading ? 'Creating Account...' : 'Create Free Account & Access Portals'}</span>
              <Sparkles style={{ width: '15px', height: '15px' }} />
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD FORM */}
        {isForgotPassword && (
          <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '5px', fontWeight: 600 }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '15px',
                    height: '15px',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@company.com"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 36px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: 'var(--text-primary)',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px',
                borderRadius: '11px',
                background: 'var(--accent-blue)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>{isLoading ? 'Sending Link...' : 'Send Password Reset Link'}</span>
              <ArrowRight style={{ width: '15px', height: '15px' }} />
            </button>

            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                padding: '6px',
              }}
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Footer info & Account Toggle */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          {!isForgotPassword ? (
            activeTab === 'sign-in' ? (
              <div style={{ color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-green)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Create one for free
                </button>
              </div>
            ) : (
              <div style={{ color: 'var(--text-secondary)' }}>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => handleTabSwitch('sign-in')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-blue)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Sign in here
                </button>
              </div>
            )
          ) : (
            <span style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>
              Direct Supabase Auth · Zero trackers
            </span>
          )}

          <span
            style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ShieldCheck style={{ width: '12px', height: '12px' }} />
            100% Free Tier
          </span>
        </div>
      </div>
    </div>
  );
};
