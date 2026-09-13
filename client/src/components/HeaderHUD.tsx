import React, { useState, useRef, useEffect } from 'react';
import {
  Sliders,
  Upload,
  Sun,
  Moon,
  LogOut,
  RefreshCw,
  ChevronDown,
  Search,
  Sparkles,
  MessageSquare,
  BrainCircuit,
  Database,
  Cpu,
  Zap,
  Layout,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { CandidateProfile } from '../types';
import type { AuthUser } from '../services/supabase';
import { IngressLogo } from './IngressLogo';
import { detectDomainFromProfile, DOMAIN_TRACKS } from '../utils/domainProfiles';

interface HeaderHUDProps {
  profile: CandidateProfile | null;
  googleUser?: AuthUser | null;
  authUser?: AuthUser | null;
  onOpenProfile: () => void;
  onOpenUploadModal?: () => void;
  onOpenOnboarding?: () => void;
  onSelectTrack?: (trackId: string) => void;
  isLoggedIn: boolean;
  onGoogleLogin: () => void;
  onLogout: () => void;
  onSwitchGoogleAccount?: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onGoHome?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenDevContact?: () => void;
}

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const HeaderHUD: React.FC<HeaderHUDProps> = ({
  profile,
  googleUser,
  onOpenProfile,
  onOpenUploadModal,
  onOpenOnboarding,
  onSelectTrack,
  isLoggedIn,
  onGoogleLogin,
  onLogout,
  onSwitchGoogleAccount,
  theme = 'dark',
  onToggleTheme,
  onGoHome,
  onOpenCommandPalette,
  onOpenDevContact,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTrackDropdownOpen, setIsTrackDropdownOpen] = useState(false);
  const [isLogoAnimating, setIsLogoAnimating] = useState(false);
  const trackDropdownRef = useRef<HTMLDivElement>(null);
  const activeDomain = detectDomainFromProfile(profile || {});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (trackDropdownRef.current && !trackDropdownRef.current.contains(e.target as Node)) {
        setIsTrackDropdownOpen(false);
      }
    };
    if (isTrackDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTrackDropdownOpen]);

  const getDomainVectorIcon = (domainId: string, color = 'currentColor', size = 13) => {
    switch (domainId) {
      case 'ai-ml':
        return <BrainCircuit style={{ width: `${size}px`, height: `${size}px`, color }} />;
      case 'data-engineering':
        return <Database style={{ width: `${size}px`, height: `${size}px`, color }} />;
      case 'devops-sre':
        return <Cpu style={{ width: `${size}px`, height: `${size}px`, color }} />;
      case 'backend-systems':
        return <Zap style={{ width: `${size}px`, height: `${size}px`, color }} />;
      case 'frontend-fullstack':
        return <Layout style={{ width: `${size}px`, height: `${size}px`, color }} />;
      case 'cybersecurity':
        return <ShieldCheck style={{ width: `${size}px`, height: `${size}px`, color }} />;
      default:
        return <Sparkles style={{ width: `${size}px`, height: `${size}px`, color }} />;
    }
  };

  const handleLogoClick = () => {
    setIsLogoAnimating(true);
    setTimeout(() => setIsLogoAnimating(false), 650);
    if (onGoHome) {
      onGoHome();
    }
  };
  const displayEmail = googleUser?.email || profile?.email || '';
  const displayName = googleUser?.name || profile?.name || 'Guest';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: theme === 'dark' ? 'rgba(10, 10, 14, 0.75)' : 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(40px) saturate(200%) brightness(105%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%) brightness(105%)',
        borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.09)' : '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
          gap: '24px',
        }}
      >
        {/* Left: Brand Identity with Click Animation & Home Redirect */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleLogoClick}
            className={`btn-ghost ${isLogoAnimating ? 'logo-click-active' : ''}`}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '4px 6px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), filter 0.2s ease',
            }}
            title="Return to Home Dashboard"
          >
            <IngressLogo size="md" />
          </button>
        </div>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {/* Active Career Track Capsule & Instant Dropdown Popover */}
          {isLoggedIn && onOpenOnboarding && (
            <div style={{ position: 'relative' }} ref={trackDropdownRef}>
              <button
                onClick={() => setIsTrackDropdownOpen(!isTrackDropdownOpen)}
                className="btn-glass"
                style={{
                  height: '34px',
                  padding: '0 12px 0 8px',
                  borderRadius: '980px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: `1px solid ${isTrackDropdownOpen ? activeDomain.accentColor : 'rgba(255, 255, 255, 0.1)'}`,
                  background: isTrackDropdownOpen
                    ? `linear-gradient(135deg, ${activeDomain.accentColor}25, rgba(255, 255, 255, 0.05))`
                    : `linear-gradient(135deg, ${activeDomain.accentColor}12, rgba(255, 255, 255, 0.03))`,
                  boxShadow: isTrackDropdownOpen ? `0 0 16px ${activeDomain.accentColor}35` : 'none',
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                title={`Active Specialization: ${activeDomain.title} · Click to switch`}
              >
                {/* Glowing Vector Icon Disc */}
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `${activeDomain.accentColor}20`,
                    border: `1px solid ${activeDomain.accentColor}50`,
                    boxShadow: `0 0 10px ${activeDomain.accentColor}30`,
                    flexShrink: 0,
                  }}
                >
                  {getDomainVectorIcon(activeDomain.id, activeDomain.accentColor, 12)}
                </div>

                {/* Clean Label */}
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {activeDomain.shortTitle || activeDomain.title.split('&')[0].trim()}
                </span>

                {/* Subtle Inline Fit Dot & Score */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: '#30D158',
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#30D158',
                      boxShadow: '0 0 6px rgba(48, 209, 88, 0.8)',
                    }}
                  />
                  <span>98%</span>
                </span>

                {/* Dropdown Chevron */}
                <ChevronDown
                  style={{
                    width: '12px',
                    height: '12px',
                    color: 'var(--text-secondary)',
                    transform: isTrackDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                    opacity: 0.7,
                  }}
                />
              </button>

              {/* Floating Quick-Switch Popover Menu */}
              {isTrackDropdownOpen && (
                <div
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '320px',
                    borderRadius: '16px',
                    background: 'rgba(16, 17, 24, 0.96)',
                    backdropFilter: 'blur(28px)',
                    WebkitBackdropFilter: 'blur(28px)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.65), 0 0 24px rgba(0, 0, 0, 0.4)',
                    padding: '8px',
                    zIndex: 1000,
                    animation: 'fadeIn 0.16s ease',
                  }}
                >
                  {/* Dropdown Header */}
                  <div
                    style={{
                      padding: '8px 10px 6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        color: 'var(--text-tertiary)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Career Track Specialization
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--accent-blue)',
                        fontWeight: 600,
                      }}
                    >
                      6 Tracks
                    </span>
                  </div>

                  {/* Track List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {DOMAIN_TRACKS.map((track) => {
                      const isActive = track.id === activeDomain.id;
                      return (
                        <button
                          key={track.id}
                          onClick={() => {
                            if (onSelectTrack) {
                              onSelectTrack(track.id);
                            } else if (onOpenOnboarding) {
                              onOpenOnboarding();
                            }
                            setIsTrackDropdownOpen(false);
                          }}
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            borderRadius: '10px',
                            border: isActive ? `1px solid ${track.accentColor}40` : '1px solid transparent',
                            background: isActive ? `${track.accentColor}18` : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease',
                          }}
                          className="hover-bg"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div
                              style={{
                                width: '26px',
                                height: '26px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `${track.accentColor}20`,
                                border: `1px solid ${track.accentColor}45`,
                                flexShrink: 0,
                              }}
                            >
                              {getDomainVectorIcon(track.id, track.accentColor, 13)}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '12px',
                                  fontWeight: isActive ? 750 : 600,
                                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {track.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--text-tertiary)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '180px',
                                }}
                              >
                                {track.coreSkills.slice(0, 3).join(' · ')}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 700,
                                color: isActive ? '#30D158' : 'var(--text-tertiary)',
                              }}
                            >
                              {isActive ? '98%' : '94%'}
                            </span>
                            {isActive && (
                              <Check style={{ width: '13px', height: '13px', color: track.accentColor }} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Action */}
                  {onOpenOnboarding && (
                    <div
                      style={{
                        borderTop: '1px solid var(--border-subtle)',
                        marginTop: '4px',
                        paddingTop: '6px',
                      }}
                    >
                      <button
                        onClick={() => {
                          setIsTrackDropdownOpen(false);
                          onOpenOnboarding();
                        }}
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'transparent',
                          fontSize: '11px',
                          color: 'var(--accent-blue)',
                          fontWeight: 650,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <Sliders style={{ width: '11px', height: '11px' }} />
                        <span>Customize Track, Skills & Seniority...</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Symmetrical Command Palette Launcher */}
          {isLoggedIn && onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="btn-glass"
              style={{
                height: '34px',
                padding: '0 12px 0 10px',
                borderRadius: '980px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.03)',
                transition: 'all 0.18s ease',
              }}
              title="Quick Search & Command Palette (Cmd + K)"
            >
              <Search style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>Search</span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  background: 'rgba(255, 255, 255, 0.06)',
                  color: 'var(--text-secondary)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                ⌘K
              </span>
            </button>
          )}

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="btn-glass"
              style={{
                padding: '6px 12px',
                borderRadius: '980px',
                color: theme === 'dark' ? '#FFD60A' : '#0071E3',
                background: theme === 'dark' ? 'rgba(255, 214, 10, 0.1)' : 'rgba(0, 113, 227, 0.08)',
                borderColor: theme === 'dark' ? 'rgba(255, 214, 10, 0.28)' : 'rgba(0, 113, 227, 0.22)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title={theme === 'dark' ? 'Switch to Apple Light Theme' : 'Switch to Dark Theme'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun style={{ width: '13px', height: '13px' }} />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon style={{ width: '13px', height: '13px' }} />
                  <span>Dark</span>
                </>
              )}
            </button>
          )}

          {isLoggedIn ? (
            <>
              {onOpenUploadModal && (
                <button
                  onClick={onOpenUploadModal}
                  className="btn-glass"
                  style={{
                    fontSize: '12px',
                    padding: '7px 16px',
                    color: 'var(--accent-blue)',
                    borderColor: 'rgba(10, 132, 255, 0.4)',
                    background: 'rgba(10, 132, 255, 0.12)',
                    fontWeight: 600,
                  }}
                  title="Upload & scan resume to match career portals"
                >
                  <Upload style={{ width: '13px', height: '13px' }} />
                  <span>Upload Resume</span>
                </button>
              )}

              <button
                onClick={onOpenProfile}
                className="btn-glass"
                style={{ padding: '7px 12px' }}
                title="Profile & Settings"
              >
                <Sliders style={{ width: '14px', height: '14px' }} />
              </button>

              {/* Verified Google Account Chip & Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="btn-glass"
                  style={{
                    fontSize: '12px',
                    padding: '5px 12px 5px 6px',
                    borderRadius: '980px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    borderColor: isMenuOpen ? 'var(--accent-blue)' : 'var(--border-subtle)',
                  }}
                  title="Google Account Menu"
                >
                  {googleUser?.picture ? (
                    <img
                      src={googleUser.picture}
                      alt={displayName}
                      style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <GoogleLogo />
                  )}
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {displayName.split(' ')[0]}
                  </span>
                  <ChevronDown style={{ width: '12px', height: '12px', opacity: 0.7 }} />
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <>
                    <div
                      onClick={() => setIsMenuOpen(false)}
                      style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                    />
                    <div className="dropdown-panel">
                      {/* User Identity Card */}
                      <div
                        style={{
                          padding: '8px 10px 12px 10px',
                          borderBottom: '1px solid var(--border-subtle)',
                          marginBottom: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        {googleUser?.picture ? (
                          <img
                            src={googleUser.picture}
                            alt={displayName}
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '2px solid rgba(255, 255, 255, 0.15)',
                              flexShrink: 0,
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                            }}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #0A84FF 0%, #0056B3 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              color: '#ffffff',
                              fontSize: '14px',
                              flexShrink: 0,
                              boxShadow: '0 2px 8px rgba(10, 132, 255, 0.35)',
                            }}
                          >
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: '13.5px',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {displayName}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              marginTop: '1px',
                            }}
                            title={displayEmail}
                          >
                            {displayEmail}
                          </div>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '2px 8px',
                              borderRadius: '980px',
                              background: 'rgba(48, 209, 88, 0.12)',
                              border: '1px solid rgba(48, 209, 88, 0.25)',
                              marginTop: '5px',
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#30D158' }} />
                            <span style={{ fontSize: '10px', color: '#30D158', fontWeight: 650 }}>
                              {googleUser?.provider === 'google'
                                ? 'Google SSO Verified'
                                : googleUser?.provider === 'email'
                                ? 'Verified Email · Supabase'
                                : 'Verified Candidate'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation & Action Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onOpenProfile();
                          }}
                          className="dropdown-action-item"
                        >
                          <Sliders style={{ width: '15px', height: '15px', color: 'var(--accent-blue)', flexShrink: 0 }} />
                          <span>Candidate Profile & ATS</span>
                        </button>

                        {onSwitchGoogleAccount && (
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              onSwitchGoogleAccount();
                            }}
                            className="dropdown-action-item"
                          >
                            <RefreshCw style={{ width: '15px', height: '15px', color: 'var(--text-secondary)', flexShrink: 0 }} />
                            <span>Switch Account</span>
                          </button>
                        )}

                        {onOpenDevContact && (
                          <button
                            onClick={() => {
                              setIsMenuOpen(false);
                              onOpenDevContact();
                            }}
                            className="dropdown-action-item"
                          >
                            <MessageSquare style={{ width: '15px', height: '15px', color: 'var(--accent-purple)', flexShrink: 0 }} />
                            <span>Contact Us & Feedback</span>
                          </button>
                        )}

                        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 6px' }} />

                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            onLogout();
                          }}
                          className="dropdown-action-item danger"
                        >
                          <LogOut style={{ width: '15px', height: '15px', flexShrink: 0 }} />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onOpenDevContact && (
                <button
                  onClick={onOpenDevContact}
                  className="btn-glass"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '980px',
                  }}
                  title="Dev Feedback, Contact & About"
                >
                  <MessageSquare style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
                  <span>Contact & Feedback</span>
                </button>
              )}
              <button
                onClick={onGoogleLogin}
                className="btn-google"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Sparkles style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
                <span>Sign In / Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
