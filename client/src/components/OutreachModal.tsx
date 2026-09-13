import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Send,
  Users,
  MessageSquare,
  Clock,
  Mail,
} from 'lucide-react';
import type { JobOpportunity } from '../types';
import { CompanyLogo } from './CompanyLogo';

export type OutreachTargetJob =
  | JobOpportunity
  | { company: string; title: string; companyLogo?: string; domain?: string; id?: string; location?: string };

interface OutreachModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: OutreachTargetJob | null;
}

import { API_BASE } from '../config';

export const OutreachModal: React.FC<OutreachModalProps> = ({ isOpen, onClose, job }) => {
  const [activeTab, setActiveTab] = useState<'linkedin' | 'referral' | 'followup'>('linkedin');
  const [tone, setTone] = useState<'professional' | 'startup' | 'punchy'>('professional');
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !job) return;

    const fetchTemplates = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/outreach/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: job.company,
            title: job.title,
            jobId: job.id,
            tone,
          }),
        });
        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch outreach templates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [isOpen, job, tone]);

  if (!isOpen || !job) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const linkedInText = data?.linkedInNote?.text || '';
  const charCount = linkedInText.length;
  const maxChars = 300;
  const charPercentage = Math.min(100, Math.round((charCount / maxChars) * 100));
  const charStatusColor =
    charCount <= 280 ? 'var(--accent-green)' : charCount <= maxChars ? '#FF9F0A' : '#FF453A';

  const recruiterSearchUrl =
    data?.searchLinks?.recruitersUrl ||
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.company + ' recruiter')}`;
  const managerSearchUrl =
    data?.searchLinks?.managersUrl ||
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.company + ' engineering manager')}`;
  const peerSearchUrl =
    data?.searchLinks?.peersUrl ||
    `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(job.company + ' software engineer')}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--modal-bg)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid var(--modal-border)',
          borderRadius: '24px',
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          boxShadow: 'var(--modal-shadow), 0 0 50px rgba(10, 132, 255, 0.08)',
          animation: 'slideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* ===================================================================
            1. BRAND HERO HEADER
            =================================================================== */}
        <div
          style={{
            padding: '28px 32px 22px 32px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.035) 0%, transparent 100%)',
            position: 'relative',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-glass hover-lift"
            style={{
              position: 'absolute',
              top: '24px',
              right: '28px',
              padding: '8px',
              borderRadius: '50%',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
            }}
            title="Close modal (Esc)"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', paddingRight: '48px' }}>
            {/* Logo with verified badge */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div
                style={{
                  padding: '3px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                }}
              >
                <CompanyLogo
                  company={job.company}
                  logoUrl={job.companyLogo}
                  domain={job.domain}
                  size={52}
                  iconSize={32}
                />
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  border: '2.5px solid var(--modal-bg)',
                  boxShadow: '0 0 8px rgba(48, 209, 88, 0.6)',
                }}
                title="Verified Recruiter Portal"
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '21px',
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {job.company} Outreach Engine
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 10px',
                    borderRadius: '980px',
                    background: 'rgba(10, 132, 255, 0.15)',
                    color: 'var(--accent-blue)',
                    fontWeight: 700,
                    border: '1px solid rgba(10, 132, 255, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Sparkles style={{ width: '12px', height: '12px' }} />
                  ⚡ 40%+ Response Rate
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Target Role: <strong style={{ color: 'var(--text-primary)' }}>{job.title}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. SCROLLABLE BODY CONTENT
            =================================================================== */}
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Step 1: Decision Makers Hub */}
          <div
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '18px',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Users style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />
                Step 1: Find Decision Makers on LinkedIn
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Opens pre-filtered search
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px' }}>
              <a
                href={recruiterSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass hover-lift"
                style={{
                  fontSize: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  fontWeight: 650,
                  background: 'rgba(10, 132, 255, 0.08)',
                  borderColor: 'rgba(10, 132, 255, 0.25)',
                }}
              >
                <span>🔍 Tech Recruiters</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </a>

              <a
                href={managerSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass hover-lift"
                style={{
                  fontSize: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  fontWeight: 650,
                  background: 'rgba(191, 90, 242, 0.08)',
                  borderColor: 'rgba(191, 90, 242, 0.25)',
                }}
              >
                <span>💼 Engineering Leads</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </a>

              <a
                href={peerSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass hover-lift"
                style={{
                  fontSize: '12px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  color: 'var(--accent-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textDecoration: 'none',
                  fontWeight: 650,
                  background: 'rgba(48, 209, 88, 0.08)',
                  borderColor: 'rgba(48, 209, 88, 0.25)',
                }}
              >
                <span>🤝 Warm Referral Peers</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </a>
            </div>
          </div>

          {/* Step 2: Message Channel Switcher & Tone Selector */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            {/* Channel Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'var(--nav-track-bg)',
                padding: '3px',
                borderRadius: '980px',
                border: '1px solid var(--border-subtle)',
                gap: '4px',
              }}
            >
              <button
                onClick={() => setActiveTab('linkedin')}
                style={{
                  fontSize: '12px',
                  padding: '7px 16px',
                  borderRadius: '980px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'linkedin' ? 'var(--accent-blue)' : 'transparent',
                  color: activeTab === 'linkedin' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 650,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                }}
              >
                <MessageSquare style={{ width: '13px', height: '13px' }} />
                <span>LinkedIn Note</span>
              </button>

              <button
                onClick={() => setActiveTab('referral')}
                style={{
                  fontSize: '12px',
                  padding: '7px 16px',
                  borderRadius: '980px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'referral' ? 'var(--accent-purple)' : 'transparent',
                  color: activeTab === 'referral' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 650,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                }}
              >
                <Send style={{ width: '13px', height: '13px' }} />
                <span>InMail / Referral Pitch</span>
              </button>

              <button
                onClick={() => setActiveTab('followup')}
                style={{
                  fontSize: '12px',
                  padding: '7px 16px',
                  borderRadius: '980px',
                  border: 'none',
                  cursor: 'pointer',
                  background: activeTab === 'followup' ? 'var(--accent-orange)' : 'transparent',
                  color: activeTab === 'followup' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 650,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                }}
              >
                <Clock style={{ width: '13px', height: '13px' }} />
                <span>Day 4 Follow-Up</span>
              </button>
            </div>

            {/* Tone Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Tone:</span>
              {(['professional', 'startup', 'punchy'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className="btn-glass"
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 12px',
                    borderRadius: '980px',
                    textTransform: 'capitalize',
                    borderColor: tone === t ? 'var(--accent-blue)' : 'var(--border-subtle)',
                    background: tone === t ? 'rgba(10, 132, 255, 0.15)' : 'transparent',
                    color: tone === t ? 'var(--accent-blue)' : 'var(--text-secondary)',
                    fontWeight: tone === t ? 700 : 500,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Message Content Area */}
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <Sparkles
                style={{
                  width: '26px',
                  height: '26px',
                  color: 'var(--accent-blue)',
                  animation: 'spin 1.5s linear infinite',
                  margin: '0 auto 12px auto',
                }}
              />
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Generating custom outreach tailored to {job.company}...
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                Analyzing role requirements and candidate strengths
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. LinkedIn Connection Note View */}
              {activeTab === 'linkedin' && (
                <div
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      LinkedIn Connection Request Note
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: charStatusColor,
                        background: `${charStatusColor}18`,
                        padding: '3px 10px',
                        borderRadius: '980px',
                        border: `1px solid ${charStatusColor}40`,
                      }}
                    >
                      {charCount} / {maxChars} characters ({charPercentage}%)
                    </span>
                  </div>

                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      background: 'var(--nav-track-bg)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13.5px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-body)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {linkedInText}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      Attach this note when clicking "Add a note" upon connecting on LinkedIn.
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={recruiterSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glass"
                        style={{
                          fontSize: '12px',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontWeight: 650,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>Find Recruiter</span>
                        <ExternalLink style={{ width: '13px', height: '13px' }} />
                      </a>

                      <button
                        onClick={() => handleCopy(linkedInText, 'linkedin')}
                        className="btn-glass btn-blue hover-lift"
                        style={{
                          fontSize: '12.5px',
                          padding: '8px 18px',
                          borderRadius: '10px',
                          fontWeight: 650,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {copiedKey === 'linkedin' ? (
                          <Check style={{ width: '14px', height: '14px' }} />
                        ) : (
                          <Copy style={{ width: '14px', height: '14px' }} />
                        )}
                        <span>{copiedKey === 'linkedin' ? 'Copied Note!' : 'Copy LinkedIn Note'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Referral Email View */}
              {activeTab === 'referral' && data?.referralEmail && (
                <div
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {/* Subject Line Strip */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--nav-track-bg)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: 'var(--accent-purple)' }}>Subject: </strong>
                      <span style={{ color: 'var(--text-primary)' }}>{data.referralEmail.subject}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(data.referralEmail.subject, 'subject')}
                      className="btn-glass"
                      style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '8px', flexShrink: 0, fontWeight: 600 }}
                    >
                      {copiedKey === 'subject' ? '✓ Copied' : 'Copy Subject'}
                    </button>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      background: 'var(--nav-track-bg)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      maxHeight: '260px',
                      overflowY: 'auto',
                    }}
                  >
                    {data.referralEmail.body}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      Paste into LinkedIn InMail or send as a direct email to an engineering leader.
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(data.referralEmail.subject)}&body=${encodeURIComponent(data.referralEmail.body)}`}
                        className="btn-glass hover-lift"
                        style={{
                          fontSize: '12px',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontWeight: 650,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                          color: 'var(--accent-purple)',
                          borderColor: 'rgba(191, 90, 242, 0.35)',
                        }}
                      >
                        <Mail style={{ width: '13px', height: '13px' }} />
                        <span>Draft in Mail App ↗</span>
                      </a>

                      <button
                        onClick={() => handleCopy(`${data.referralEmail.subject}\n\n${data.referralEmail.body}`, 'email')}
                        className="btn-glass hover-lift"
                        style={{
                          fontSize: '12.5px',
                          padding: '8px 18px',
                          borderRadius: '10px',
                          fontWeight: 650,
                          background: 'var(--accent-purple)',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                        }}
                      >
                        {copiedKey === 'email' ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                        <span>{copiedKey === 'email' ? 'Copied Full Email!' : 'Copy Full Email'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Follow-Up Note View */}
              {activeTab === 'followup' && data?.followUpNote && (
                <div
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  {/* Subject Line Strip */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--nav-track-bg)',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      gap: '12px',
                    }}
                  >
                    <div style={{ fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: 'var(--accent-orange)' }}>Subject: </strong>
                      <span style={{ color: 'var(--text-primary)' }}>{data.followUpNote.subject}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(data.followUpNote.subject, 'followup-sub')}
                      className="btn-glass"
                      style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '8px', flexShrink: 0, fontWeight: 600 }}
                    >
                      {copiedKey === 'followup-sub' ? '✓ Copied' : 'Copy Subject'}
                    </button>
                  </div>

                  {/* Body */}
                  <div
                    style={{
                      padding: '16px 18px',
                      borderRadius: '14px',
                      background: 'var(--nav-track-bg)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap',
                      maxHeight: '260px',
                      overflowY: 'auto',
                    }}
                  >
                    {data.followUpNote.body}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      Send on Day 4 after submitting your application if no response yet.
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={`mailto:?subject=${encodeURIComponent(data.followUpNote.subject)}&body=${encodeURIComponent(data.followUpNote.body)}`}
                        className="btn-glass hover-lift"
                        style={{
                          fontSize: '12px',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontWeight: 650,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          textDecoration: 'none',
                          color: 'var(--accent-orange)',
                          borderColor: 'rgba(255, 159, 10, 0.35)',
                        }}
                      >
                        <Mail style={{ width: '13px', height: '13px' }} />
                        <span>Draft in Mail App ↗</span>
                      </a>

                      <button
                        onClick={() => handleCopy(`${data.followUpNote.subject}\n\n${data.followUpNote.body}`, 'followup-full')}
                        className="btn-glass hover-lift"
                        style={{
                          fontSize: '12.5px',
                          padding: '8px 18px',
                          borderRadius: '10px',
                          fontWeight: 650,
                          background: 'var(--accent-orange)',
                          color: '#ffffff',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: 'none',
                        }}
                      >
                        {copiedKey === 'followup-full' ? <Check style={{ width: '14px', height: '14px' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                        <span>{copiedKey === 'followup-full' ? 'Copied Follow-up!' : 'Copy Follow-up'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===================================================================
            3. FOOTER ACTION DOCK
            =================================================================== */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '16px 32px',
            background: 'var(--modal-footer-bg, rgba(0, 0, 0, 0.2))',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>💡</span>
            <span>
              <strong>Strategy:</strong> Reach out to an engineer at {job.company} first for a warm referral, then follow up with the recruiter.
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn-glass hover-lift"
            style={{ fontSize: '12.5px', padding: '8px 20px', borderRadius: '980px', fontWeight: 650 }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
