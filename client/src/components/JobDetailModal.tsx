import React from 'react';
import type { JobOpportunity } from '../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Clock,
  RotateCcw,
  Send,
  FileText,
  Globe,
  MapPin,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Award,
  Layers,
  Building2,
} from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

interface JobDetailModalProps {
  job: JobOpportunity | null;
  onClose: () => void;
  onApply?: (jobId: string) => void;
  onUnapply?: (jobId: string) => void;
  onOpenOutreach?: (job: JobOpportunity) => void;
  onOpenTailoredResume?: (job: JobOpportunity) => void;
  isApplying?: boolean;
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getCooldownInfo(appliedAt?: string) {
  if (!appliedAt) return { daysRemaining: 0, text: 'Active' };
  const elapsed = Date.now() - new Date(appliedAt).getTime();
  const remainingMs = Math.max(0, ONE_WEEK_MS - elapsed);
  const days = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.ceil(remainingMs / (60 * 60 * 1000));
  return {
    daysRemaining: days,
    text: days > 1 ? `${days}d left` : `${hours}h left`,
  };
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  onUnapply,
  onOpenOutreach,
  onOpenTailoredResume,
  isApplying = false,
}) => {
  if (!job) return null;

  const isApplied = Boolean(
    job.status === 'applied' &&
    job.appliedAt &&
    Date.now() - new Date(job.appliedAt).getTime() < ONE_WEEK_MS
  );
  const cooldown = getCooldownInfo(job.appliedAt);

  const handleApply = () => {
    if (!isApplied && onApply) {
      onApply(job.id);
    }
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  const primaryRoleTitle =
    job.liveJobs && job.liveJobs.length > 0 && job.liveJobs[0]?.title
      ? job.liveJobs[0].title
      : job.title;

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
            padding: '28px 32px 24px 32px',
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

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', paddingRight: '46px' }}>
            {/* Logo with verified indicator */}
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
                  size={58}
                  iconSize={36}
                />
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#30D158',
                    boxShadow: '0 0 8px rgba(48, 209, 88, 0.9)',
                  }}
                />
              </span>
            </div>

            {/* Company Info & Live Role Subline */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '26px',
                    letterSpacing: '-0.025em',
                    color: 'var(--text-primary)',
                    margin: 0,
                    lineHeight: 1.15,
                  }}
                >
                  {job.company}
                </h2>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 9px',
                    borderRadius: '980px',
                    background: 'rgba(48, 209, 88, 0.12)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(48, 209, 88, 0.32)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <ShieldCheck style={{ width: '12px', height: '12px' }} />
                  <span>Verified Direct Portal</span>
                </span>
              </div>

              {/* Live Role Subline */}
              <div
                style={{
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  marginBottom: '12px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ color: 'var(--text-primary)', fontWeight: 650 }}>{primaryRoleTitle}</span>
              </div>

              {/* Badges Bar: Hub, Sector, Work Model, Compensation, Portal Link */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {/* Location / Hub */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11.5px',
                    fontWeight: 650,
                    padding: '3px 10px',
                    borderRadius: '6px',
                    background:
                      job.hub === 'Bengaluru'
                        ? 'rgba(48, 209, 88, 0.12)'
                        : job.hub === 'Delhi NCR'
                        ? 'rgba(255, 159, 10, 0.12)'
                        : 'rgba(10, 132, 255, 0.12)',
                    color:
                      job.hub === 'Bengaluru'
                        ? 'var(--accent-green)'
                        : job.hub === 'Delhi NCR'
                        ? '#FF9F0A'
                        : 'var(--accent-blue)',
                    border: `1px solid ${
                      job.hub === 'Bengaluru'
                        ? 'rgba(48, 209, 88, 0.28)'
                        : job.hub === 'Delhi NCR'
                        ? 'rgba(255, 159, 10, 0.28)'
                        : 'rgba(10, 132, 255, 0.28)'
                    }`,
                  }}
                >
                  {job.isRemote || job.hub === 'Remote' ? (
                    <Globe style={{ width: '11px', height: '11px' }} />
                  ) : (
                    <MapPin style={{ width: '11px', height: '11px' }} />
                  )}
                  <span>{job.subRegion || job.location || job.hub}</span>
                </span>

                {/* Sector */}
                {job.sector && (
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'var(--tab-badge-inactive-bg)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {job.sector}
                  </span>
                )}

                {/* Work Model */}
                {(job.workModel || job.type) && (
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'var(--tab-badge-inactive-bg)',
                      color: 'var(--text-tertiary)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {job.workModel || job.type}
                  </span>
                )}

                {/* Compensation */}
                {job.compensation && (
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255, 214, 10, 0.1)',
                      color: 'var(--accent-yellow)',
                      border: '1px solid rgba(255, 214, 10, 0.22)',
                    }}
                  >
                    {job.compensation}
                  </span>
                )}

                {/* Direct Link to Careers */}
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11.5px',
                      color: 'var(--accent-blue)',
                      textDecoration: 'none',
                      fontWeight: 650,
                      marginLeft: 'auto',
                    }}
                    className="hover-lift"
                  >
                    <span>{job.domain || 'Official Careers'}</span>
                    <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. BODY CONTENT
            =================================================================== */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Match Telemetry & Mini Gauges */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(220px, 1.1fr) minmax(280px, 1.9fr)',
              gap: '14px',
            }}
          >
            {/* Overall Score Gauge Card */}
            <div
              className="glass-surface"
              style={{
                padding: '18px 20px',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background:
                    job.vectorScore >= 90
                      ? 'linear-gradient(135deg, rgba(48, 209, 88, 0.22) 0%, rgba(48, 209, 88, 0.06) 100%)'
                      : 'linear-gradient(135deg, rgba(10, 132, 255, 0.22) 0%, rgba(10, 132, 255, 0.06) 100%)',
                  border: `1.5px solid ${
                    job.vectorScore >= 90 ? 'rgba(48, 209, 88, 0.4)' : 'rgba(10, 132, 255, 0.4)'
                  }`,
                  boxShadow:
                    job.vectorScore >= 90
                      ? '0 4px 16px rgba(48, 209, 88, 0.2)'
                      : '0 4px 16px rgba(10, 132, 255, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '20px',
                    color: job.vectorScore >= 90 ? 'var(--accent-green)' : 'var(--accent-blue)',
                    lineHeight: 1,
                  }}
                >
                  {job.vectorScore}%
                </span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: 'var(--text-tertiary)',
                    marginTop: '2px',
                  }}
                >
                  Match
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3px' }}>
                  Candidate Alignment
                </div>
                <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                  Vector-scored across required stack, production experience & seniority.
                </div>
              </div>
            </div>

            {/* 3 Progress Bars */}
            <div
              className="glass-surface"
              style={{
                padding: '16px 20px',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {[
                { label: 'Skills Alignment', val: job.matchBreakdown?.skillsMatch ?? 95, color: '#30D158' },
                { label: 'Experience Depth', val: job.matchBreakdown?.experienceMatch ?? 92, color: '#0A84FF' },
                { label: 'Domain & Sector Fit', val: job.matchBreakdown?.domainMatch ?? 94, color: '#BF5AF2' },
              ].map((metric) => (
                <div key={metric.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{metric.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {metric.val}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '980px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${metric.val}%`,
                        height: '100%',
                        background: metric.color,
                        borderRadius: '980px',
                        transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick AI Action Launchers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              onClick={() => onOpenOutreach && onOpenOutreach(job)}
              className="btn-glass hover-lift"
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.12) 0%, rgba(10, 132, 255, 0.04) 100%)',
                border: '1px solid rgba(10, 132, 255, 0.3)',
                color: 'var(--accent-blue)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(10, 132, 255, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Send style={{ width: '15px', height: '15px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    Recruiter Outreach
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Draft referral & hiring manager pitch
                  </div>
                </div>
              </div>
              <ChevronRight style={{ width: '15px', height: '15px', opacity: 0.7 }} />
            </button>

            <button
              onClick={() => onOpenTailoredResume && onOpenTailoredResume(job)}
              className="btn-glass hover-lift"
              style={{
                padding: '12px 18px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.12) 0%, rgba(48, 209, 88, 0.04) 100%)',
                border: '1px solid rgba(48, 209, 88, 0.3)',
                color: 'var(--accent-green)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    background: 'rgba(48, 209, 88, 0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText style={{ width: '15px', height: '15px' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    Tailor ATS Resume
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                    Calibrate resume bullets to 95%+ fit
                  </div>
                </div>
              </div>
              <ChevronRight style={{ width: '15px', height: '15px', opacity: 0.7 }} />
            </button>
          </div>

          {/* ===================================================================
              3. LIVE OPENINGS AT COMPANY
              =================================================================== */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                  <span
                    style={{
                      position: 'absolute',
                      display: 'inline-flex',
                      height: '100%',
                      width: '100%',
                      borderRadius: '50%',
                      background: '#30D158',
                      opacity: 0.75,
                      animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      borderRadius: '50%',
                      height: '8px',
                      width: '8px',
                      background: '#30D158',
                    }}
                  />
                </span>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 750,
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                    letterSpacing: '0.02em',
                    textTransform: 'uppercase',
                    margin: 0,
                  }}
                >
                  Active Roles at {job.company}
                </h4>
                {job.liveJobs && job.liveJobs.length > 0 && (
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      background: 'rgba(48, 209, 88, 0.15)',
                      color: 'var(--accent-green)',
                      border: '1px solid rgba(48, 209, 88, 0.35)',
                      padding: '1px 8px',
                      borderRadius: '980px',
                    }}
                  >
                    {job.liveJobs.length} live
                  </span>
                )}
              </div>

              <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                100% direct portal routing
              </span>
            </div>

            {/* List of Live Roles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {job.liveJobs && job.liveJobs.length > 0 ? (
                job.liveJobs.map((role) => (
                  <div
                    key={role.id}
                    className="glass-surface hover-lift"
                    style={{
                      padding: '16px 20px',
                      borderRadius: '14px',
                      border: '1px solid var(--border-subtle)',
                      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.01) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)' }}>
                          {role.title}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 7px',
                            borderRadius: '4px',
                            background: 'rgba(48, 209, 88, 0.12)',
                            color: 'var(--accent-green)',
                            border: '1px solid rgba(48, 209, 88, 0.28)',
                          }}
                        >
                          Live
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontSize: '11.5px',
                            color: 'var(--text-tertiary)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <MapPin style={{ width: '11px', height: '11px' }} />
                          {role.location}
                        </span>

                        {role.type && (
                          <span
                            style={{
                              fontSize: '10.5px',
                              padding: '1px 7px',
                              borderRadius: '4px',
                              background:
                                role.type === 'Remote' ? 'rgba(10, 132, 255, 0.15)' : 'var(--tab-badge-inactive-bg)',
                              color: role.type === 'Remote' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {role.type}
                          </span>
                        )}

                        {role.department && (
                          <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                            • {role.department}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Action Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {role.vectorScore && (
                        <span
                          style={{
                            fontSize: '11.5px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: role.vectorScore >= 90 ? 'var(--accent-green)' : 'var(--accent-blue)',
                            background: role.vectorScore >= 90 ? 'rgba(48, 209, 88, 0.1)' : 'rgba(10, 132, 255, 0.1)',
                            padding: '4px 9px',
                            borderRadius: '6px',
                            border: `1px solid ${
                              role.vectorScore >= 90 ? 'rgba(48,209,88,0.25)' : 'rgba(10,132,255,0.25)'
                            }`,
                          }}
                        >
                          {role.vectorScore}% Fit
                        </span>
                      )}

                      {onOpenTailoredResume && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenTailoredResume({ ...job, title: role.title });
                          }}
                          className="btn-glass"
                          style={{
                            fontSize: '11.5px',
                            padding: '6px 11px',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-subtle)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 600,
                          }}
                          title="Tailor ATS resume for this role"
                        >
                          <Sparkles style={{ width: '12px', height: '12px', color: '#BF5AF2' }} />
                          <span>Tailor</span>
                        </button>
                      )}

                      {onOpenOutreach && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                            onOpenOutreach({ ...job, title: role.title });
                          }}
                          className="btn-glass"
                          style={{
                            fontSize: '11.5px',
                            padding: '6px 11px',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-subtle)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontWeight: 600,
                          }}
                          title="Draft recruiter message for this role"
                        >
                          <Send style={{ width: '12px', height: '12px', color: '#0A84FF' }} />
                          <span>Outreach</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(role.url, '_blank', 'noopener,noreferrer');
                        }}
                        className="btn-primary"
                        style={{
                          fontSize: '12px',
                          padding: '6px 14px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontWeight: 650,
                          borderRadius: '8px',
                        }}
                      >
                        <span>Apply</span>
                        <ArrowUpRight style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  className="glass-surface"
                  style={{
                    padding: '24px 20px',
                    textAlign: 'center',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <Building2 style={{ width: '28px', height: '28px', color: 'var(--text-tertiary)', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Official Career Portal Ready
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', maxWidth: '440px', margin: '0 auto 14px' }}>
                    This verified company portal is active. You can browse live openings directly on their official careers page.
                  </div>
                  <button
                    onClick={handleApply}
                    className="btn-glass btn-blue"
                    style={{ fontSize: '12px', padding: '6px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span>Open {job.company} Careers</span>
                    <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ===================================================================
              4. REQUIRED SKILLS & TECH STACK
              =================================================================== */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div>
              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Layers style={{ width: '13px', height: '13px' }} />
                Target Technical Stack & Competencies
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {job.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontSize: '12px',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ===================================================================
              5. STRATEGIC MATCH BREAKDOWN & TALKING POINTS
              =================================================================== */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Key Strengths */}
            <div
              className="glass-surface"
              style={{
                padding: '18px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(48, 209, 88, 0.18)',
                background: 'linear-gradient(180deg, rgba(48, 209, 88, 0.04) 0%, transparent 100%)',
              }}
            >
              <h5
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  color: 'var(--accent-green)',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                Candidate Strengths
              </h5>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {(job.matchBreakdown?.strengths && job.matchBreakdown.strengths.length > 0
                  ? job.matchBreakdown.strengths
                  : [
                      `Direct architectural fit for ${job.company}'s engineering tier`,
                      `High vector score (${job.vectorScore ?? 95}%) calibrated against production background`,
                      `Verified direct career portal routing with zero third-party intermediaries`,
                    ]
                ).map((str, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '7px',
                    }}
                  >
                    <span style={{ color: 'var(--accent-green)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Talking Points & Interview Positioning */}
            <div
              className="glass-surface"
              style={{
                padding: '18px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 159, 10, 0.18)',
                background: 'linear-gradient(180deg, rgba(255, 159, 10, 0.04) 0%, transparent 100%)',
              }}
            >
              <h5
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  color: '#FF9F0A',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <AlertCircle style={{ width: '14px', height: '14px' }} />
                Strategic Talking Points
              </h5>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                {(job.matchBreakdown?.gaps && job.matchBreakdown.gaps.length > 0
                  ? job.matchBreakdown.gaps
                  : [
                      `Highlight hands-on production ownership, cluster scaling & incident response`,
                      `Emphasize resilience against edge failures, traffic spikes & failover automation`,
                    ]
                ).map((gap, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '7px',
                    }}
                  >
                    <span style={{ color: '#FF9F0A', flexShrink: 0, marginTop: '2px' }}>•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* LSEG Mission-Critical Advantage Callout (If Available) */}
          {job.matchBreakdown?.lsegAdvantage && (
            <div
              className="glass-surface"
              style={{
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(191, 90, 242, 0.25)',
                background: 'linear-gradient(135deg, rgba(191, 90, 242, 0.08) 0%, rgba(191, 90, 242, 0.02) 100%)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(191, 90, 242, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent-purple)',
                }}
              >
                <Award style={{ width: '16px', height: '16px' }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--accent-purple)',
                    marginBottom: '3px',
                  }}
                >
                  Mission-Critical Systems Advantage
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  {job.matchBreakdown.lsegAdvantage}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
            6. FOOTER ACTION DOCK
            =================================================================== */}
        <div
          style={{
            padding: '20px 32px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--table-header-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
            marginTop: 'auto',
          }}
        >
          {/* Left: Cooldown / Status */}
          <div>
            {isApplied ? (
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  padding: '6px 14px',
                  borderRadius: '980px',
                  background: 'rgba(255, 159, 10, 0.12)',
                  color: '#FF9F0A',
                  border: '1px solid rgba(255, 159, 10, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 650,
                }}
              >
                <Clock style={{ width: '13px', height: '13px' }} />
                <span>Applied • Resets in {cooldown.text}</span>
              </span>
            ) : (
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                <span>1-Click verified career portal route</span>
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn-glass"
              style={{ fontSize: '13px', padding: '9px 18px', borderRadius: '10px' }}
            >
              Close
            </button>

            {isApplied && onUnapply && (
              <button
                onClick={() => {
                  onUnapply(job.id);
                  onClose();
                }}
                className="btn-glass hover-lift"
                style={{
                  fontSize: '13px',
                  padding: '9px 16px',
                  color: 'var(--accent-blue)',
                  borderColor: 'rgba(10, 132, 255, 0.3)',
                  background: 'rgba(10, 132, 255, 0.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '10px',
                  fontWeight: 600,
                }}
                title="Restore company back to Available pipeline immediately"
              >
                <RotateCcw style={{ width: '13px', height: '13px' }} />
                <span>Restore to Available</span>
              </button>
            )}

            <button
              onClick={handleApply}
              disabled={isApplying}
              className="btn-glass btn-blue hover-lift"
              style={{
                fontSize: '13px',
                padding: '9px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 18px rgba(10, 132, 255, 0.35)',
              }}
            >
              <span>{isApplying ? 'Opening Portal...' : isApplied ? 'Re-open Official Portal' : 'Apply via Career Portal'}</span>
              <ArrowUpRight style={{ width: '15px', height: '15px' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
