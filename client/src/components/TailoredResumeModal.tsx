import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  Code2,
  Eye,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { JobOpportunity, CandidateProfile } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface TailoredResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobOpportunity | null;
  customJd?: {
    company: string;
    title: string;
    description: string;
    requiredSkills?: string[];
  };
  profile?: CandidateProfile | null;
}

export type ResumeTheme = 'latex' | 'modern' | 'executive';
export type ResumeDensity = 'compact' | 'standard';

import { API_BASE } from '../config';

// Isolated high-fidelity print helper that generates an isolated frame
function printResumeDocument(elementId: string, docTitle: string) {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    window.print();
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${docTitle}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/latin-modern-roman">
        <style>
          @page {
            size: letter;
            margin: 0.35in 0.4in 0.35in 0.4in;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff !important;
            color: #000000 !important;
            width: 100% !important;
          }
          /* Ensure no scrollbars, overflow clipping or shadows in print */
          #printable-ats-resume {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
        </style>
      </head>
      <body>
        ${sourceEl.outerHTML}
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 3000);
  }, 400);
}

export const TailoredResumeModal: React.FC<TailoredResumeModalProps> = ({
  isOpen,
  onClose,
  job,
  customJd,
  profile: propProfile,
}) => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'latex' | 'markdown'>('preview');
  const [resumeTheme, setResumeTheme] = useState<ResumeTheme>('latex');
  const [density, setDensity] = useState<ResumeDensity>('compact');
  const [isCopied, setIsCopied] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || (!job && !customJd)) return;

    const fetchTailoredResume = async () => {
      setIsLoading(true);
      try {
        const bodyPayload = job
          ? {
              jobId: job.id,
              company: job.company,
              title: job.title,
              description: job.description,
              requiredSkills: job.requiredSkills,
            }
          : customJd;

        const res = await fetch(`${API_BASE}/api/resume/tailor`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyPayload),
        });

        if (res.ok) {
          setData(await res.json());
        }
      } catch (err) {
        console.error('Failed to generate tailored resume:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTailoredResume();
  }, [isOpen, job, customJd]);

  if (!isOpen || (!job && !customJd)) return null;

  const targetCompany = job?.company || customJd?.company || 'Target Company';
  const targetRole = job?.title || customJd?.title || 'Target Role';
  const candidateName = propProfile?.name || data?.profile?.name || 'Your Name';
  const candidateEmail = propProfile?.email || data?.profile?.email || '';
  const candidatePhone = propProfile?.phone || data?.profile?.phone || '';
  const candidateLocation = propProfile?.location || data?.profile?.location || '';
  const candidateLinkedIn = propProfile?.linkedin || data?.profile?.linkedin || '';
  const candidateGitHub = propProfile?.github || data?.profile?.github || '';

  // Derived structured data
  const summary = data?.tailoredSummary || propProfile?.summary || '';
  const skills = data?.skills || [
    { category: 'Cloud & Kubernetes', list: ['Amazon EKS', 'Kubernetes (K8s)', 'Docker', 'AWS', 'Multi-Region HA'] },
    { category: 'IaC & CI/CD', list: ['Terraform', 'Terragrunt', 'Helm', 'ArgoCD', 'Jenkins', 'GitHub Actions'] },
    { category: 'Reliability & Security', list: ['AWS WAF', 'Route 53 GSLB', 'Prometheus', 'Grafana', 'Datadog', 'DDoS Mitigation'] },
    { category: 'Languages & Automation', list: ['Python', 'TypeScript', 'Bash', 'REST APIs', 'LLM Incident Triage'] },
  ];

  const experiences = data?.experience || (propProfile?.experience ? propProfile.experience.map(e => ({
    company: e.company,
    role: e.role,
    period: e.period,
    location: 'Bengaluru, India',
    highlights: e.highlights,
  })) : []);

  const projects = data?.projects || (propProfile?.projects || []);
  const education = data?.education || (propProfile?.education || []);
  const certifications = data?.certifications || (propProfile?.certifications ? propProfile.certifications.map(c => typeof c === 'string' ? c : c.name) : []);

  // Action handlers
  const handlePrintPdf = () => {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.3 },
      colors: ['#0A84FF', '#30D158', '#BF5AF2'],
    });
    printResumeDocument(
      'printable-ats-resume',
      `${candidateName.replace(/\s+/g, '_')}_${targetCompany.replace(/\s+/g, '_')}_Resume`
    );
  };

  const handleDownloadLatex = () => {
    if (!data?.tailoredLatex) return;
    const blob = new Blob([data.tailoredLatex], { type: 'text/x-tex;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${candidateName.replace(/\s+/g, '_')}_${targetCompany.replace(/\s+/g, '_')}_Resume.tex`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedFormat('tex');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownloadMarkdown = () => {
    if (!data?.tailoredMarkdown) return;
    const blob = new Blob([data.tailoredMarkdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${candidateName.replace(/\s+/g, '_')}_${targetCompany.replace(/\s+/g, '_')}_Resume.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCopiedFormat('md');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleCopyPlaintext = () => {
    // Generate clean text for ATS application forms
    const plainText = `${candidateName}
${targetRole}
${candidateLocation} | ${candidateEmail} | ${candidatePhone}
LinkedIn: ${candidateLinkedIn} | GitHub: ${candidateGitHub}

PROFESSIONAL SUMMARY
${summary}

TECHNICAL SKILLS
${skills.map((s: any) => `${s.category}: ${s.list.join(', ')}`).join('\n')}

PROFESSIONAL EXPERIENCE
${experiences.map((exp: any) => `${exp.company} - ${exp.role} (${exp.period})
${(exp.highlights || []).map((h: string) => `• ${h}`).join('\n')}`).join('\n\n')}

FEATURED PROJECTS
${projects.map((p: any) => `${p.name} (${p.techStack})
${(p.highlights || []).map((h: string) => `• ${h}`).join('\n')}`).join('\n\n')}

EDUCATION & CERTIFICATIONS
${education.map((e: any) => `${e.institution} - ${e.degree} (${e.period})${e.cgpa ? ` [CGPA: ${e.cgpa}]` : ''}`).join('\n')}
Certifications: ${certifications.join(', ')}
`;
    navigator.clipboard.writeText(plainText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  // Font and typography parameters based on selected theme & density
  const isCompact = density === 'compact';
  const isLatex = resumeTheme === 'latex';
  const isModern = resumeTheme === 'modern';
  const isExecutive = resumeTheme === 'executive';

  const docFontFamily = isLatex
    ? '"Computer Modern", "Latin Modern Roman", "Times New Roman", Times, Georgia, serif'
    : isExecutive
    ? '"Outfit", "Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    : '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--modal-bg)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid var(--modal-border)',
          borderRadius: '24px',
          maxWidth: '960px',
          width: '100%',
          maxHeight: '94vh',
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
            {job && (
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
                  title="Target Company"
                />
              </div>
            )}

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
                  Tailored Resume for {targetCompany}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 10px',
                    borderRadius: '980px',
                    background: 'rgba(48, 209, 88, 0.15)',
                    color: 'var(--accent-green)',
                    fontWeight: 700,
                    border: '1px solid rgba(48, 209, 88, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                  ATS Grade A+ (100% Parseable)
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                Target Role: <strong style={{ color: 'var(--text-primary)' }}>{targetRole}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================================
            2. ATS FIT & INJECTED KEYWORDS TELEMETRY STRIP
            =================================================================== */}
        {data && (
          <div
            style={{
              padding: '16px 32px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--card-bg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    color: 'var(--accent-green)',
                    lineHeight: 1,
                  }}
                >
                  {data.atsScore}%
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Target Role ATS Fit
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-green)', fontWeight: 600 }}>
                    +{data.scoreBoost}% vs. Generic Master Resume
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs: Document, LaTeX, Markdown */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--nav-track-bg)',
                  padding: '3px',
                  borderRadius: '980px',
                  border: '1px solid var(--border-subtle)',
                  gap: '3px',
                }}
              >
                <button
                  onClick={() => setViewMode('preview')}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 14px',
                    borderRadius: '980px',
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'preview' ? 'var(--accent-blue)' : 'transparent',
                    color: viewMode === 'preview' ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 650,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Eye style={{ width: '13px', height: '13px' }} />
                  <span>Document View</span>
                </button>

                <button
                  onClick={() => setViewMode('latex')}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 14px',
                    borderRadius: '980px',
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'latex' ? 'var(--accent-blue)' : 'transparent',
                    color: viewMode === 'latex' ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 650,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Code2 style={{ width: '13px', height: '13px' }} />
                  <span>LaTeX (.tex)</span>
                </button>

                <button
                  onClick={() => setViewMode('markdown')}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 14px',
                    borderRadius: '980px',
                    border: 'none',
                    cursor: 'pointer',
                    background: viewMode === 'markdown' ? 'var(--accent-blue)' : 'transparent',
                    color: viewMode === 'markdown' ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 650,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FileText style={{ width: '13px', height: '13px' }} />
                  <span>Markdown (.md)</span>
                </button>
              </div>
            </div>

            {/* Matched Keywords Strip with Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 650 }}>
                {(data.matchedKeywords || []).length} Keywords Injected:
              </span>
              {(data.matchedKeywords || []).map((kw: string) => (
                <span
                  key={kw}
                  style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(48, 209, 88, 0.12)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(48, 209, 88, 0.28)',
                    fontWeight: 600,
                  }}
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            3. TOOLBAR: THEME, DENSITY & EXPORT ACTIONS
            =================================================================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            padding: '12px 32px',
            background: 'var(--nav-track-bg)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {/* Left: Theme & Density Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {/* Theme Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Theme:</span>
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--card-bg)',
                  padding: '2px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  gap: '2px',
                }}
              >
                {[
                  { id: 'latex', label: "Jake's LaTeX" },
                  { id: 'modern', label: 'Modern Tech' },
                  { id: 'executive', label: 'Executive SRE' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setResumeTheme(t.id as ResumeTheme)}
                    style={{
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: 600,
                      background: resumeTheme === t.id ? 'var(--accent-blue)' : 'transparent',
                      color: resumeTheme === t.id ? '#ffffff' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Density Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Fit:</span>
              <div
                style={{
                  display: 'inline-flex',
                  background: 'var(--card-bg)',
                  padding: '2px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  gap: '2px',
                }}
              >
                <button
                  onClick={() => setDensity('compact')}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    background: density === 'compact' ? 'var(--accent-blue)' : 'transparent',
                    color: density === 'compact' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Tight line-height and margins to guarantee strict 1-page fit"
                >
                  1-Page Compact
                </button>
                <button
                  onClick={() => setDensity('standard')}
                  style={{
                    fontSize: '11px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    background: density === 'standard' ? 'var(--accent-blue)' : 'transparent',
                    color: density === 'standard' ? '#ffffff' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Standard
                </button>
              </div>
            </div>
          </div>

          {/* Right: Export Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Primary Action: Save as PDF */}
            <button
              onClick={handlePrintPdf}
              className="btn btn-blue hover-lift"
              style={{
                fontSize: '12px',
                padding: '7px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(0, 113, 227, 0.35)',
              }}
              title="Print or Save directly as font-embedded PDF (100% vector text for ATS)"
            >
              <Printer style={{ width: '13px', height: '13px' }} />
              <span>Save as PDF</span>
            </button>

            {/* LaTeX Overleaf (.tex) */}
            <button
              onClick={handleDownloadLatex}
              className="btn-glass hover-lift"
              style={{
                fontSize: '12px',
                padding: '7px 13px',
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Download clean Overleaf-ready LaTeX (.tex) source"
            >
              {copiedFormat === 'tex' ? <Check style={{ width: '13px', height: '13px', color: 'var(--accent-green)' }} /> : <Code2 style={{ width: '13px', height: '13px' }} />}
              <span>{copiedFormat === 'tex' ? 'Downloaded .tex!' : 'Download .tex'}</span>
            </button>

            {/* Markdown (.md) */}
            <button
              onClick={handleDownloadMarkdown}
              className="btn-glass hover-lift"
              style={{
                fontSize: '12px',
                padding: '7px 13px',
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Download GitHub/GitLab markdown (.md) file"
            >
              {copiedFormat === 'md' ? <Check style={{ width: '13px', height: '13px', color: 'var(--accent-green)' }} /> : <Download style={{ width: '13px', height: '13px' }} />}
              <span>{copiedFormat === 'md' ? 'Downloaded .md!' : 'Download .md'}</span>
            </button>

            {/* Copy Plaintext for ATS Web Forms */}
            <button
              onClick={handleCopyPlaintext}
              className="btn-glass hover-lift"
              style={{
                fontSize: '12px',
                padding: '7px 13px',
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Copy plain text for pasting directly into Greenhouse/Lever text boxes"
            >
              {isCopied ? <Check style={{ width: '13px', height: '13px', color: 'var(--accent-green)' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
              <span>{isCopied ? 'Copied Text!' : 'Copy Plaintext'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

        {/* View Mode 1: Loading State */}
        {isLoading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Sparkles style={{ width: '28px', height: '28px', color: 'var(--accent-blue)', animation: 'spin 1.5s linear infinite', margin: '0 auto 12px auto' }} />
            <div style={{ fontWeight: 600 }}>Tailoring resume & compiling Overleaf LaTeX template for {targetCompany}...</div>
          </div>
        ) : viewMode === 'latex' ? (
          /* View Mode 2: Raw LaTeX Source (.tex) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
              <span>Overleaf Jake's Resume Standard LaTeX Template • Compile with pdfLaTeX on Overleaf</span>
              <button
                onClick={() => {
                  if (data?.tailoredLatex) {
                    navigator.clipboard.writeText(data.tailoredLatex);
                    setCopiedFormat('tex-code');
                    setTimeout(() => setCopiedFormat(null), 2000);
                  }
                }}
                className="btn-glass"
                style={{ fontSize: '11px', padding: '3px 10px' }}
              >
                {copiedFormat === 'tex-code' ? 'Copied TeX Code!' : 'Copy TeX Source'}
              </button>
            </div>
            <pre
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                overflowX: 'auto',
                maxHeight: '480px',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {data?.tailoredLatex}
            </pre>
          </div>
        ) : viewMode === 'markdown' ? (
          /* View Mode 3: Raw Markdown Source (.md) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
              <span>Clean Markdown • Ready for GitHub README or Notion</span>
              <button
                onClick={() => {
                  if (data?.tailoredMarkdown) {
                    navigator.clipboard.writeText(data.tailoredMarkdown);
                    setCopiedFormat('md-code');
                    setTimeout(() => setCopiedFormat(null), 2000);
                  }
                }}
                className="btn-glass"
                style={{ fontSize: '11px', padding: '3px 10px' }}
              >
                {copiedFormat === 'md-code' ? 'Copied Markdown!' : 'Copy Markdown Source'}
              </button>
            </div>
            <pre
              style={{
                padding: '18px',
                borderRadius: '14px',
                background: 'var(--card-bg)',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11.5px',
                color: 'var(--text-primary)',
                lineHeight: 1.5,
                overflowX: 'auto',
                maxHeight: '480px',
                whiteSpace: 'pre-wrap',
                margin: 0,
              }}
            >
              {data?.tailoredMarkdown}
            </pre>
          </div>
        ) : (
          /* View Mode 4: Pristine ATS Rendered Document Preview */
          <div
            id="printable-ats-resume"
            style={{
              background: '#FFFFFF',
              color: '#000000',
              padding: isCompact ? '24px 30px' : '36px 42px',
              borderRadius: '14px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              fontFamily: docFontFamily,
              boxShadow: '0 10px 32px rgba(0, 0, 0, 0.18)',
              lineHeight: isCompact ? 1.32 : 1.45,
              fontSize: isCompact ? '11.5px' : '12.5px',
              maxHeight: '520px',
              overflowY: 'auto',
              transition: 'all 0.15s ease',
            }}
          >
            {/* Header / Contact Info */}
            <div
              style={{
                borderBottom: isLatex ? '1.5px solid #000000' : isModern ? '2px solid #0071E3' : '2px solid #0F172A',
                paddingBottom: isCompact ? '8px' : '12px',
                marginBottom: isCompact ? '10px' : '14px',
                textAlign: isModern ? 'left' : 'center',
              }}
            >
              <h1
                style={{
                  fontSize: isCompact ? '22px' : '25px',
                  fontWeight: 850,
                  margin: '0 0 3px 0',
                  letterSpacing: isLatex ? '0.04em' : '-0.02em',
                  fontVariant: isLatex ? 'small-caps' : 'normal',
                  color: '#000000',
                }}
              >
                {candidateName}
              </h1>

              <div
                style={{
                  fontSize: isCompact ? '12.5px' : '14px',
                  fontWeight: 700,
                  color: isModern ? '#0071E3' : isExecutive ? '#0F172A' : '#111111',
                  marginBottom: isCompact ? '4px' : '6px',
                }}
              >
                {targetRole}
              </div>

              <div
                style={{
                  fontSize: isCompact ? '10.5px' : '11px',
                  color: isLatex ? '#222222' : '#475569',
                  display: 'flex',
                  justifyContent: isModern ? 'flex-start' : 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span>{candidateLocation}</span>
                <span>•</span>
                <a href={`mailto:${candidateEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {candidateEmail}
                </a>
                <span>•</span>
                <span>{candidatePhone}</span>
                <span>•</span>
                <a href={candidateLinkedIn} target="_blank" rel="noreferrer" style={{ color: isModern ? '#0071E3' : 'inherit', textDecoration: 'underline' }}>
                  LinkedIn
                </a>
                <span>•</span>
                <a href={candidateGitHub} target="_blank" rel="noreferrer" style={{ color: isModern ? '#0071E3' : 'inherit', textDecoration: 'underline' }}>
                  GitHub
                </a>
              </div>
            </div>

            {/* Professional Summary */}
            <div style={{ marginBottom: isCompact ? '10px' : '14px' }}>
              <div
                style={{
                  fontSize: isCompact ? '11px' : '11.5px',
                  fontWeight: 800,
                  letterSpacing: isLatex ? '0.04em' : '0.06em',
                  color: isExecutive ? '#0F172A' : '#000000',
                  fontVariant: isLatex ? 'small-caps' : 'normal',
                  textTransform: 'uppercase',
                  borderBottom: isLatex ? '1px solid #222222' : '1px solid #E2E8F0',
                  paddingBottom: '2px',
                  marginBottom: isCompact ? '4px' : '6px',
                }}
              >
                Professional Summary
              </div>
              <p style={{ margin: 0, color: '#1E293B', textAlign: 'justify' }}>
                {summary}
              </p>
            </div>

            {/* Core Technical Skills */}
            <div style={{ marginBottom: isCompact ? '10px' : '14px' }}>
              <div
                style={{
                  fontSize: isCompact ? '11px' : '11.5px',
                  fontWeight: 800,
                  letterSpacing: isLatex ? '0.04em' : '0.06em',
                  color: isExecutive ? '#0F172A' : '#000000',
                  fontVariant: isLatex ? 'small-caps' : 'normal',
                  textTransform: 'uppercase',
                  borderBottom: isLatex ? '1px solid #222222' : '1px solid #E2E8F0',
                  paddingBottom: '2px',
                  marginBottom: isCompact ? '4px' : '6px',
                }}
              >
                Technical Skills
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {skills.map((s: any, idx: number) => (
                  <div key={idx} style={{ color: '#1E293B' }}>
                    <strong style={{ color: '#000000' }}>{s.category}: </strong>
                    <span>{s.list.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Experience */}
            <div style={{ marginBottom: isCompact ? '10px' : '14px' }}>
              <div
                style={{
                  fontSize: isCompact ? '11px' : '11.5px',
                  fontWeight: 800,
                  letterSpacing: isLatex ? '0.04em' : '0.06em',
                  color: isExecutive ? '#0F172A' : '#000000',
                  fontVariant: isLatex ? 'small-caps' : 'normal',
                  textTransform: 'uppercase',
                  borderBottom: isLatex ? '1px solid #222222' : '1px solid #E2E8F0',
                  paddingBottom: '2px',
                  marginBottom: isCompact ? '6px' : '8px',
                }}
              >
                Professional Experience
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? '8px' : '12px' }}>
                {experiences.map((exp: any, expIdx: number) => (
                  <div key={expIdx}>
                    {/* Role & Company Heading */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700 }}>
                      <span style={{ fontSize: isCompact ? '12px' : '13px', color: '#000000' }}>
                        {exp.company}
                      </span>
                      <span style={{ fontSize: isCompact ? '10.5px' : '11px', color: isLatex ? '#333333' : '#64748B', fontFamily: isLatex ? 'inherit' : 'var(--font-mono)' }}>
                        {exp.location}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <span style={{ fontStyle: 'italic', color: isModern ? '#0071E3' : '#334155', fontWeight: 600 }}>
                        {exp.role}
                      </span>
                      <span style={{ fontStyle: 'italic', fontSize: isCompact ? '10.5px' : '11px', color: '#475569' }}>
                        {exp.period}
                      </span>
                    </div>

                    {/* Highlights Bullets */}
                    <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: isCompact ? '2px' : '4px' }}>
                      {(exp.highlights || []).map((h: string, hIdx: number) => (
                        <li key={hIdx} style={{ color: '#1E293B', textAlign: 'justify' }}>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects */}
            {projects && projects.length > 0 && (
              <div style={{ marginBottom: isCompact ? '10px' : '14px' }}>
                <div
                  style={{
                    fontSize: isCompact ? '11px' : '11.5px',
                    fontWeight: 800,
                    letterSpacing: isLatex ? '0.04em' : '0.06em',
                    color: isExecutive ? '#0F172A' : '#000000',
                    fontVariant: isLatex ? 'small-caps' : 'normal',
                    textTransform: 'uppercase',
                    borderBottom: isLatex ? '1px solid #222222' : '1px solid #E2E8F0',
                    paddingBottom: '2px',
                    marginBottom: isCompact ? '6px' : '8px',
                  }}
                >
                  Featured Engineering Projects
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? '6px' : '10px' }}>
                  {projects.map((proj: any, pIdx: number) => (
                    <div key={pIdx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 700, color: '#000000' }}>
                          {proj.name}
                          <span style={{ fontWeight: 500, fontStyle: 'italic', color: isModern ? '#0071E3' : '#475569', marginLeft: '6px' }}>
                            | {proj.techStack}
                          </span>
                        </span>
                      </div>

                      <ul style={{ margin: '2px 0 0 0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {(proj.highlights || []).map((ph: string, phIdx: number) => (
                          <li key={phIdx} style={{ color: '#1E293B', textAlign: 'justify' }}>
                            {ph}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certifications */}
            <div>
              <div
                style={{
                  fontSize: isCompact ? '11px' : '11.5px',
                  fontWeight: 800,
                  letterSpacing: isLatex ? '0.04em' : '0.06em',
                  color: isExecutive ? '#0F172A' : '#000000',
                  fontVariant: isLatex ? 'small-caps' : 'normal',
                  textTransform: 'uppercase',
                  borderBottom: isLatex ? '1px solid #222222' : '1px solid #E2E8F0',
                  paddingBottom: '2px',
                  marginBottom: isCompact ? '4px' : '6px',
                }}
              >
                Education & Certifications
              </div>

              {education.map((edu: any, eduIdx: number) => (
                <div key={eduIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                  <div>
                    <strong style={{ color: '#000000' }}>{edu.institution}</strong> — {edu.degree}
                    {edu.cgpa && <span> (CGPA: {edu.cgpa})</span>}
                  </div>
                  <span style={{ fontSize: isCompact ? '10.5px' : '11px', color: '#475569' }}>
                    {edu.period}
                  </span>
                </div>
              ))}

              {certifications.length > 0 && (
                <div style={{ marginTop: '3px', color: '#1E293B' }}>
                  <strong style={{ color: '#000000' }}>Certifications: </strong>
                  <span>{certifications.join(' • ')}</span>
                </div>
              )}
            </div>

            {/* Ingress ATS Engine Verification Footer */}
            <div
              style={{
                marginTop: isCompact ? '14px' : '18px',
                paddingTop: '8px',
                borderTop: '1px dashed #CBD5E1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '9.5px',
                color: '#94A3B8',
                fontFamily: 'monospace',
              }}
            >
              <span>INGRESS CAREER CONTROLLER // {targetCompany.toUpperCase()}</span>
              <span>GOOGLE X-Y-Z FORMULA · 100% PARSEABLE</span>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
