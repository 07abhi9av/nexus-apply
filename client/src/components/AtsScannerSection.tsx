import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Award,
  Upload,
  Sparkles,
  Zap,
  Target,
  Copy,
  Check,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  FileText,
  Send,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { detectDomainFromProfile } from '../utils/domainProfiles';
import type { CandidateProfile } from '../types';

import { API_BASE } from '../config';

interface AtsCategoryScore {
  name: string;
  score: number;
  weight: number;
  status: 'pass' | 'warning' | 'critical';
  findings: string[];
  recommendations: string[];
}

interface AtsBulletRewrite {
  original: string;
  improved: string;
  rationale: string;
  category?: string;
  weakPhrase?: string;
  powerVerb?: string;
  metrics?: string;
  xyzBreakdown?: {
    accomplished: string;
    measuredBy: string;
    doing: string;
  };
}

interface AtsAuditResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  verdict: string;
  wordCount: number;
  pageEstimate: number;
  categories: AtsCategoryScore[];
  identifiedSkills: string[];
  missingCriticalKeywords: string[];
  powerVerbsFound: string[];
  weakPhrasesFound: string[];
  bulletRewrites: AtsBulletRewrite[];
  targetRoleMatch?: {
    targetRole: string;
    jdMatchScore: number;
    matchedJdKeywords: string[];
    missingJdKeywords: string[];
  };
  scannedAt: string;
}

const PRESET_TARGET_ROLES = [
  {
    id: 'openai-ai',
    domainId: 'ai-ml',
    company: 'OpenAI',
    roleTag: 'AI & LLM Platform',
    label: 'OpenAI · AI Platform Engineer',
    role: 'AI / ML Platform Infrastructure Engineer',
    description: 'Large language model infrastructure, distributed GPU training clusters, Python, PyTorch, Spark, real-time data pipelines, RAG architectures, and vector databases.',
    skills: ['Python', 'PyTorch', 'LLMs', 'RAG', 'Vector Databases', 'Spark', 'Docker', 'Kubernetes', 'Deep Learning'],
  },
  {
    id: 'anthropic-ai',
    domainId: 'ai-ml',
    company: 'Anthropic',
    roleTag: 'AI Safety & Research',
    label: 'Anthropic · Senior AI Engineer',
    role: 'Senior AI / Machine Learning Engineer',
    description: 'LLM evaluation, fine-tuning pipelines, transformer architectures, prompt engineering, RLHF, vector embeddings, and Python machine learning systems.',
    skills: ['Python', 'PyTorch', 'Fine-Tuning', 'LLMs', 'Machine Learning', 'CUDA', 'FastAPI', 'LangChain'],
  },
  {
    id: 'snowflake-data',
    domainId: 'data-engineering',
    company: 'Snowflake',
    roleTag: 'Data & Lakehouse Platform',
    label: 'Snowflake · Senior Data Platform Engineer',
    role: 'Senior Data Platform & Lakehouse Engineer',
    description: 'Petabyte-scale distributed data processing, Apache Spark, Kafka streaming, automated ETL/ELT pipelines, dbt, Snowflake, and Delta Lake storage formats.',
    skills: ['Apache Spark', 'Python', 'SQL', 'Snowflake', 'Apache Kafka', 'Airflow', 'dbt', 'Data Warehousing', 'Delta Lake'],
  },
  {
    id: 'databricks',
    domainId: 'data-engineering',
    company: 'Databricks',
    roleTag: 'Big Data & Cloud Compute',
    label: 'Databricks · Platform & Compute Engineer',
    role: 'Data Platform & Distributed Compute Engineer',
    description: 'Large-scale distributed systems, Spark clusters, Lakehouse architecture, multi-cloud AWS/GCP, data streaming, zero-downtime deployments, observability.',
    skills: ['Apache Spark', 'Databricks', 'Delta Lake', 'Python', 'Kafka', 'Kubernetes', 'AWS', 'SQL'],
  },
  {
    id: 'phonepe',
    domainId: 'devops-sre',
    company: 'PhonePe',
    roleTag: 'Fintech Infrastructure',
    label: 'PhonePe · Lead DevOps / SRE',
    role: 'Lead DevOps Engineer (Fintech Infrastructure)',
    description: 'High throughput fintech transactions, multi-region failover, Route 53 GSLB, Amazon EKS, Terraform, low latency, 99.999% uptime SLAs.',
    skills: ['Amazon EKS', 'AWS', 'Terraform', 'Route 53', 'Linux', 'Prometheus', 'High Availability', 'CI/CD'],
  },
  {
    id: 'google-systems',
    domainId: 'devops-sre',
    company: 'Google',
    roleTag: 'Systems Reliability',
    label: 'Google · Systems & Reliability',
    role: 'Cloud Systems & Reliability Engineer',
    description: 'Large-scale automated operations, Linux kernel tuning, production incident management, SLOs/SLIs, postmortems, network routing.',
    skills: ['Linux', 'Kubernetes', 'Distributed Systems', 'Observability', 'Python', 'Networking', 'SLO'],
  },
  {
    id: 'amazon-backend',
    domainId: 'backend-systems',
    company: 'Amazon AWS',
    roleTag: 'Backend & Systems',
    label: 'Amazon AWS · Senior Backend Engineer',
    role: 'Senior Backend Systems Engineer',
    description: 'High-throughput distributed systems, microservices, Java, Go, DynamoDB, Kafka, low-latency APIs, and 99.99% availability SLAs.',
    skills: ['Java', 'Go', 'Microservices', 'Distributed Systems', 'Kafka', 'DynamoDB', 'AWS', 'RESTful APIs'],
  },
  {
    id: 'meta-fullstack',
    domainId: 'frontend-fullstack',
    company: 'Meta',
    roleTag: 'Full Stack Product',
    label: 'Meta · Senior Full Stack Engineer',
    role: 'Senior Full Stack Software Engineer',
    description: 'High-scale web applications, React, Node.js, TypeScript, GraphQL, distributed backend services, microservices, and database performance optimization.',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL', 'System Design', 'CI/CD'],
  },
  {
    id: 'stripe-frontend',
    domainId: 'frontend-fullstack',
    company: 'Stripe',
    roleTag: 'Frontend Architecture',
    label: 'Stripe · Senior Frontend Engineer',
    role: 'Senior Frontend Architect',
    description: 'Modern component design systems, React, Next.js, TypeScript, Core Web Vitals, accessibility, state management, and web performance optimization.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'Jest', 'UI/UX', 'Responsive Design'],
  },
  {
    id: 'crowdstrike-sec',
    domainId: 'cybersecurity',
    company: 'CrowdStrike',
    roleTag: 'Cybersecurity & Threat Defense',
    label: 'CrowdStrike · Lead Security Engineer',
    role: 'Lead Cloud & AppSec Engineer',
    description: 'Perimeter security, zero-trust architecture, threat modeling, DDoS mitigation, WAF, OAuth/OIDC, vulnerability management, and SOC2 compliance.',
    skills: ['Zero Trust', 'Penetration Testing', 'OWASP', 'IAM', 'OAuth', 'WAF', 'Encryption', 'SOC2'],
  },
  {
    id: 'general',
    domainId: 'all',
    company: 'Industry Baseline',
    roleTag: 'Core SWE Benchmark',
    label: 'Industry Baseline · Senior SWE',
    role: 'Senior Software Engineer (Universal Benchmark)',
    description: 'Modern software engineering principles, system design, REST APIs, automated testing, continuous integration, cloud architecture, and clean code.',
    skills: ['System Design', 'Git', 'CI/CD', 'SQL', 'Unit Testing', 'Docker', 'Cloud', 'Microservices'],
  },
];

interface AtsScannerSectionProps {
  profile?: CandidateProfile | null;
  onOpenTailoredResume?: (customJd?: {
    company: string;
    title: string;
    description: string;
    requiredSkills?: string[];
  }) => void;
  onOpenOutreach?: (customJob?: { company: string; title: string }) => void;
}

export const AtsScannerSection: React.FC<AtsScannerSectionProps> = ({
  profile,
  onOpenTailoredResume,
  onOpenOutreach,
}) => {
  // Active Career Track from candidate profile
  const activeDomain = useMemo(() => detectDomainFromProfile(profile || {}), [profile]);

  // Sort presets so roles matching the candidate's active track appear first
  const sortedPresets = useMemo(() => {
    return [...PRESET_TARGET_ROLES].sort((a, b) => {
      const aMatch = a.domainId === activeDomain.id;
      const bMatch = b.domainId === activeDomain.id;
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }, [activeDomain.id]);

  const [auditResult, setAuditResult] = useState<AtsAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string>(() => {
    const match = PRESET_TARGET_ROLES.find((p) => p.domainId === activeDomain.id);
    return match ? match.id : PRESET_TARGET_ROLES[0].id;
  });
  const [customRoleTitle, setCustomRoleTitle] = useState<string>('');
  const [customJdText, setCustomJdText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Keep target selection in sync when domain track switches
  useEffect(() => {
    const current = PRESET_TARGET_ROLES.find((p) => p.id === selectedTargetId);
    if (!current || (current.domainId !== activeDomain.id && current.domainId !== 'all')) {
      const match = sortedPresets.find((p) => p.domainId === activeDomain.id);
      if (match) {
        setSelectedTargetId(match.id);
      }
    }
  }, [activeDomain.id, sortedPresets]);

  // Scan current resume against selected JD
  const runScan = async () => {
    setIsLoading(true);
    setUploadError(null);
    try {
      let targetJdPayload: any = undefined;

      if (isCustomMode && customRoleTitle.trim()) {
        targetJdPayload = {
          title: customRoleTitle,
          description: customJdText,
        };
      } else {
        const preset = PRESET_TARGET_ROLES.find((p) => p.id === selectedTargetId);
        if (preset) {
          targetJdPayload = {
            title: preset.role,
            description: preset.description,
            requiredSkills: preset.skills,
          };
        }
      }

      const res = await fetch(`${API_BASE}/api/ats/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetJd: targetJdPayload,
          domain: activeDomain.id,
        }),
      });

      if (!res.ok) {
        throw new Error(`Scan failed with status ${res.status}`);
      }

      const data = await res.json();
      const audit: AtsAuditResult = data.audit || data;
      setAuditResult(audit);
    } catch (err: any) {
      console.error('Failed to run ATS scan:', err);
      setUploadError(err.message || 'Scan failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload new file and scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('domain', activeDomain.id);

      const preset = PRESET_TARGET_ROLES.find((p) => p.id === selectedTargetId);
      if (preset) {
        formData.append(
          'targetJd',
          JSON.stringify({
            title: preset.role,
            description: preset.description,
            requiredSkills: preset.skills,
          })
        );
      }

      const res = await fetch(`${API_BASE}/api/ats/upload-scan`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload scan failed');
      }

      const data = await res.json();
      const audit: AtsAuditResult = data.audit || data;
      setAuditResult(audit);

      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0A84FF', '#30D158', '#FFD60A'],
      });
    } catch (err: any) {
      console.error('ATS scan error:', err);
      setUploadError(err.message || 'ATS Scan failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-scan whenever selectedTargetId or activeDomain.id changes
  useEffect(() => {
    runScan();
  }, [selectedTargetId, activeDomain.id]);

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2200);
  };

  const handleCopyAllBullets = () => {
    if (!auditResult?.bulletRewrites?.length) return;
    const formatted = auditResult.bulletRewrites
      .map((b) => `• ${b.improved}`)
      .join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    confetti({
      particleCount: 45,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#30D158', '#0A84FF', '#BF5AF2'],
    });
    setTimeout(() => setCopiedAll(false), 2400);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#30D158';
    if (score >= 70) return '#FF9F0A';
    return '#FF453A';
  };

  return (
    <div className="animate-entrance" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Hero Header HUD */}
      <div
        className="liquid-panel"
        style={{
          borderRadius: '24px',
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-green)',
                  background: 'rgba(48, 209, 88, 0.12)',
                  border: '1px solid rgba(48, 209, 88, 0.28)',
                  padding: '3px 10px',
                  borderRadius: '980px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                <ShieldCheck style={{ width: '13px', height: '13px' }} />
                Deterministic AI ATS Parser
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-tertiary)',
                  background: 'var(--nav-track-bg)',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Workday & Taleo Compliant
              </span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Resume ATS Scanner & Keyword Optimizer
            </h1>

            <p
              style={{
                fontSize: '13.5px',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Deterministic 6-pillar evaluation simulating Workday, Taleo, and Greenhouse algorithms. Authentic metrics with actionable fixes.
            </p>
          </div>

          {/* Action Buttons: Unified, sleek glass */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label
              className="btn-glass"
              style={{
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '980px',
                height: '38px',
              }}
            >
              <Upload style={{ width: '14px', height: '14px', color: 'var(--accent-blue)' }} />
              <span>Upload PDF</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>

            <button
              onClick={runScan}
              disabled={isLoading}
              className="btn-glass btn-blue"
              style={{
                padding: '8px 18px',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '980px',
                height: '38px',
              }}
            >
              <RefreshCw
                style={{
                  width: '14px',
                  height: '14px',
                  animation: isLoading ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isLoading ? 'Scanning Text...' : 'Re-scan Target JD'}</span>
            </button>
          </div>
        </div>

        {/* Sleek Target Benchmark Selector Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '280px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(10, 132, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Target style={{ width: '16px', height: '16px', color: 'var(--accent-blue)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Benchmark Target Role
              </span>
              {!isCustomMode ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <select
                    value={selectedTargetId}
                    onChange={(e) => setSelectedTargetId(e.target.value)}
                    style={{
                      width: '100%',
                      maxWidth: '460px',
                      height: '36px',
                      padding: '0 32px 0 12px',
                      borderRadius: '10px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontWeight: 650,
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {sortedPresets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.company} · {preset.roleTag}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span style={{ fontSize: '13px', fontWeight: 650, color: 'var(--accent-blue)' }}>
                  Custom Job Description
                </span>
              )}
            </div>
          </div>

          {/* Mode Switcher Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="btn-glass"
              style={{
                height: '34px',
                padding: '0 14px',
                borderRadius: '980px',
                fontSize: '12px',
                fontWeight: 650,
                color: isCustomMode ? 'var(--accent-blue)' : 'var(--text-secondary)',
                borderColor: isCustomMode ? 'rgba(10, 132, 255, 0.4)' : 'var(--border-subtle)',
                background: isCustomMode ? 'rgba(10, 132, 255, 0.12)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {isCustomMode ? '← Standard Presets' : '+ Paste Custom JD'}
            </button>
          </div>
        </div>

        {/* Custom JD Input Box (Only when Custom Mode is active) */}
        {isCustomMode && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: 'var(--nav-track-bg)',
              padding: '16px',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <input
              type="text"
              placeholder="Target Job Title (e.g., Senior DevOps Engineer - Stripe)"
              value={customRoleTitle}
              onChange={(e) => setCustomRoleTitle(e.target.value)}
              style={{
                width: '100%',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px',
              }}
            />
            <textarea
              placeholder="Paste the full Job Description text here..."
              rows={4}
              value={customJdText}
              onChange={(e) => setCustomJdText(e.target.value)}
              style={{
                width: '100%',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-mono)',
                resize: 'vertical',
              }}
            />
          </div>
        )}
      </div>

      {uploadError && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'rgba(255, 69, 58, 0.12)',
            border: '1px solid rgba(255, 69, 58, 0.3)',
            color: '#FF453A',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertTriangle style={{ width: '16px', height: '16px' }} />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Score & High Level Analytics */}
      {auditResult && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '24px' }}>
          {/* Left Radial Gauge Card */}
          <div
            className="liquid-panel p-6"
            style={{
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 650 }}>
              ATS Compatibility Score
            </div>

            {/* Circular Gauge with Ambient Glow */}
            <div style={{ position: 'relative', width: '176px', height: '176px', margin: '4px 0' }}>
              {/* Ambient radial glow behind gauge */}
              <div
                style={{
                  position: 'absolute',
                  inset: '12px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${getScoreColor(auditResult.overallScore)}26 0%, transparent 70%)`,
                  filter: 'blur(16px)',
                  pointerEvents: 'none',
                }}
              />

              <svg width="176" height="176" viewBox="0 0 176 176" style={{ transform: 'rotate(-90deg)' }}>
                {/* Background track */}
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  fill="none"
                  stroke="var(--border-default)"
                  strokeWidth="12"
                  opacity={0.6}
                />
                {/* Progress arc with drop shadow glow */}
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  fill="none"
                  stroke={getScoreColor(auditResult.overallScore)}
                  strokeWidth="12"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 * (1 - auditResult.overallScore / 100)}
                  strokeLinecap="round"
                  style={{
                    transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                    filter: `drop-shadow(0 0 12px ${getScoreColor(auditResult.overallScore)}70)`,
                  }}
                />
              </svg>

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '48px',
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                  }}
                >
                  {auditResult.overallScore}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '4px', letterSpacing: '0.08em', fontWeight: 600 }}>
                  / 100 POINTS
                </div>
              </div>
            </div>

            {/* Prominent Glowing Grade Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 16px',
                borderRadius: '980px',
                background: `${getScoreColor(auditResult.overallScore)}18`,
                border: `1px solid ${getScoreColor(auditResult.overallScore)}45`,
                color: getScoreColor(auditResult.overallScore),
                fontWeight: 700,
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                boxShadow: `0 0 16px ${getScoreColor(auditResult.overallScore)}25`,
              }}
            >
              <Award style={{ width: '14px', height: '14px' }} />
              <span>Grade {auditResult.grade} · {
                auditResult.overallScore >= 90 ? 'Top 5% Match' :
                auditResult.overallScore >= 80 ? 'Competitive Fit' :
                auditResult.overallScore >= 70 ? 'Baseline Pass' : 'Optimization Needed'
              }</span>
            </div>

            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {auditResult.verdict}
            </p>

            {/* Instrument Cluster Micro-Stats */}
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                marginTop: '4px',
              }}
            >
              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(10, 132, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-blue)',
                    flexShrink: 0,
                  }}
                >
                  <FileText style={{ width: '15px', height: '15px' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Length</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {auditResult.pageEstimate}p ({auditResult.wordCount}w)
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-subtle)',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(48, 209, 88, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-green)',
                    flexShrink: 0,
                  }}
                >
                  <Layers style={{ width: '15px', height: '15px' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Hard Skills</div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {(auditResult.identifiedSkills || []).length} Detected
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Target JD Match & Keyword Density Card */}
          <div
            className="liquid-panel p-6"
            style={{
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Header with target match */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Target Role Alignment
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  {auditResult.targetRoleMatch?.targetRole || 'Target Role Benchmark'}
                </h3>
              </div>

              {auditResult.targetRoleMatch && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: 'rgba(10, 132, 255, 0.1)',
                    border: '1px solid rgba(10, 132, 255, 0.3)',
                    padding: '8px 16px',
                    borderRadius: '14px',
                    boxShadow: '0 4px 16px rgba(10, 132, 255, 0.08)',
                  }}
                >
                  <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--accent-blue)' }} />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontWeight: 600, letterSpacing: '0.04em' }}>JD FIT SCORE</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>
                      {auditResult.targetRoleMatch.jdMatchScore}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Matched Keywords with Count Indicator */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <CheckCircle2 style={{ width: '15px', height: '15px', color: 'var(--accent-green)' }} />
                  Matched High-Impact Keywords
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '980px',
                    background: 'rgba(48, 209, 88, 0.15)',
                    color: 'var(--accent-green)',
                    fontWeight: 700,
                    border: '1px solid rgba(48, 209, 88, 0.3)',
                  }}
                >
                  {(auditResult.targetRoleMatch?.matchedJdKeywords || auditResult.identifiedSkills || []).length} Verified
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(auditResult.targetRoleMatch?.matchedJdKeywords || auditResult.identifiedSkills || []).map((kw) => (
                  <span
                    key={kw}
                    className="hover-lift"
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      background: 'rgba(48, 209, 88, 0.1)',
                      border: '1px solid rgba(48, 209, 88, 0.28)',
                      color: 'var(--accent-green)',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <span>✓</span> {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Keywords with Count Indicator */}
            {(auditResult.missingCriticalKeywords || []).length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <AlertTriangle style={{ width: '15px', height: '15px', color: '#FF9F0A' }} />
                    Missing Critical Keywords to Incorporate
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 8px',
                      borderRadius: '980px',
                      background: 'rgba(255, 159, 10, 0.15)',
                      color: '#FF9F0A',
                      fontWeight: 700,
                      border: '1px solid rgba(255, 159, 10, 0.3)',
                    }}
                  >
                    {(auditResult.missingCriticalKeywords || []).length} High Impact
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                  {(auditResult.missingCriticalKeywords || []).map((kw) => (
                    <span
                      key={kw}
                      className="hover-lift"
                      style={{
                        fontSize: '11.5px',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 159, 10, 0.1)',
                        border: '1px solid rgba(255, 159, 10, 0.3)',
                        color: '#FF9F0A',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span>+</span> {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Verbs Identified */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚡</span> Power Action Verbs detected in bullet points:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(auditResult.powerVerbsFound || []).map((verb) => (
                  <span
                    key={verb}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(10, 132, 255, 0.1)',
                      color: 'var(--accent-blue)',
                      fontFamily: 'var(--font-mono)',
                      border: '1px solid rgba(10, 132, 255, 0.22)',
                      fontWeight: 600,
                    }}
                  >
                    {verb}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6 Category Breakdown Grid */}
      {auditResult && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2
              style={{
                fontSize: '19px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--text-primary)',
              }}
            >
              <Zap style={{ width: '18px', height: '18px', color: 'var(--accent-blue)' }} />
              <span>6-Pillar ATS Compliance Audit</span>
            </h2>
            <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
              Deterministic scoring weightings
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {(auditResult.categories || []).map((cat, idx) => {
              const isPass = cat.status === 'pass';
              const color = isPass ? '#30D158' : cat.status === 'warning' ? '#FF9F0A' : '#FF453A';
              const StatusIcon = isPass ? CheckCircle2 : cat.status === 'warning' ? AlertTriangle : AlertCircle;

              return (
                <div
                  key={idx}
                  className="liquid-panel p-5 hover-lift"
                  style={{
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <StatusIcon style={{ width: '15px', height: '15px', color }} />
                        <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {cat.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px', marginLeft: '22px' }}>
                        Weight: {cat.weight}%
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          fontFamily: 'var(--font-display)',
                          color: color,
                        }}
                      >
                        {cat.score}
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>/100</span>
                    </div>
                  </div>

                  {/* Gradient progress bar */}
                  <div
                    style={{
                      height: '5px',
                      background: 'var(--border-subtle)',
                      borderRadius: '980px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${cat.score}%`,
                        background: isPass
                          ? 'linear-gradient(90deg, #30D158, #34C759)'
                          : cat.status === 'warning'
                          ? 'linear-gradient(90deg, #FF9F0A, #FFD60A)'
                          : 'linear-gradient(90deg, #FF453A, #FF3B30)',
                        borderRadius: '980px',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    />
                  </div>

                  {/* Findings list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {cat.findings.map((f, fIdx) => (
                      <div
                        key={fIdx}
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.45,
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: color, fontSize: '13px', lineHeight: 1.2 }}>•</span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recommendation Strip */}
                  {cat.recommendations.length > 0 && (
                    <div
                      style={{
                        marginTop: 'auto',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'var(--nav-track-bg)',
                        borderLeft: `3px solid ${color}`,
                        fontSize: '11.5px',
                        color: 'var(--text-primary)',
                        lineHeight: 1.45,
                      }}
                    >
                      <strong style={{ display: 'block', marginBottom: '2px', color, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Actionable Fix:
                      </strong>
                      {cat.recommendations[0]}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Bullet Point Rewriter Section (Google X-Y-Z formula) */}
      {auditResult && (auditResult.bulletRewrites || []).length > 0 && (
        <div className="liquid-panel p-8" style={{ borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section Header with Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '680px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(191, 90, 242, 0.22) 0%, rgba(191, 90, 242, 0.06) 100%)',
                  border: '1px solid rgba(191, 90, 242, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 16px rgba(191, 90, 242, 0.15)',
                }}
              >
                <Sparkles style={{ width: '20px', height: '20px', color: 'var(--accent-purple)' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    margin: 0,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                  }}
                >
                  Bullet Point Optimizer (Google X-Y-Z Formula)
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Converts passive bullet points into Google's structure:{' '}
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    "Accomplished <span style={{ color: 'var(--accent-blue)', background: 'rgba(10, 132, 255, 0.12)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(10, 132, 255, 0.25)' }}>[X]</span> as measured by <span style={{ color: 'var(--accent-green)', background: 'rgba(48, 209, 88, 0.12)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(48, 209, 88, 0.25)' }}>[Y]</span>, by doing <span style={{ color: 'var(--accent-purple)', background: 'rgba(191, 90, 242, 0.12)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(191, 90, 242, 0.25)' }}>[Z]</span>"
                  </span>
                </p>
              </div>
            </div>

            {/* High-Priority Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Copy All Bullets Button */}
              <button
                onClick={handleCopyAllBullets}
                className="btn-glass hover-lift"
                style={{
                  fontSize: '12.5px',
                  height: '38px',
                  padding: '0 16px',
                  borderRadius: '980px',
                  fontWeight: 650,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.15s ease',
                }}
                title="Copy all optimized bullets formatted as Markdown to clipboard"
              >
                {copiedAll ? <Check style={{ width: '14px', height: '14px', color: 'var(--accent-green)' }} /> : <Copy style={{ width: '14px', height: '14px' }} />}
                <span>{copiedAll ? 'All Copied!' : 'Copy Bullets'}</span>
              </button>

              {/* 1-Click Role-Tailored Resume Exporter */}
              {onOpenTailoredResume && (
                <button
                  onClick={() => {
                    const targetInfo = PRESET_TARGET_ROLES.find((r) => r.id === selectedTargetId);
                    onOpenTailoredResume({
                      company: targetInfo?.company || 'Target Tech Company',
                      title: isCustomMode
                        ? customRoleTitle || activeDomain.defaultTitle
                        : targetInfo?.role || activeDomain.defaultTitle,
                      description: isCustomMode ? customJdText : targetInfo?.description || '',
                      requiredSkills: targetInfo?.skills || activeDomain.coreSkills,
                    });
                  }}
                  className="btn-glass btn-blue hover-lift"
                  style={{
                    fontSize: '12.5px',
                    height: '38px',
                    padding: '0 18px',
                    borderRadius: '980px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    boxShadow: '0 4px 16px rgba(0, 113, 227, 0.35)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Export a 95%+ ATS tailored resume with Google X-Y-Z achievements for this target role"
                >
                  <FileText style={{ width: '14px', height: '14px' }} />
                  <span>Export Tailored Resume</span>
                </button>
              )}

              {/* 1-Click Recruiter Outreach */}
              {onOpenOutreach && (
                <button
                  onClick={() => {
                    const targetInfo = PRESET_TARGET_ROLES.find((r) => r.id === selectedTargetId);
                    onOpenOutreach({
                      company: targetInfo?.company || 'Target Tech Company',
                      title: isCustomMode
                        ? customRoleTitle || activeDomain.defaultTitle
                        : targetInfo?.role || activeDomain.defaultTitle,
                    });
                  }}
                  className="btn-glass hover-lift"
                  style={{
                    fontSize: '12.5px',
                    height: '38px',
                    padding: '0 16px',
                    borderRadius: '980px',
                    fontWeight: 650,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    color: 'var(--accent-purple)',
                    borderColor: 'rgba(191, 90, 242, 0.35)',
                    background: 'rgba(191, 90, 242, 0.1)',
                    transition: 'all 0.15s ease',
                  }}
                  title="Generate cold recruiter and referral messages for this target role"
                >
                  <Send style={{ width: '14px', height: '14px' }} />
                  <span>Recruiter Outreach</span>
                </button>
              )}
            </div>
          </div>

          {/* Structured Comparison Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {(auditResult.bulletRewrites || []).map((rewrite, idx) => {
              const isCopied = copiedIndex === idx;

              return (
                <div
                  key={idx}
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: 'var(--card-shadow)',
                  }}
                >
                  {/* Card Header Bar: Aligned Title, Category, and Action */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '14px',
                      flexWrap: 'wrap',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          padding: '3px 12px',
                          borderRadius: '980px',
                          background: 'rgba(10, 132, 255, 0.16)',
                          color: 'var(--accent-blue)',
                          fontWeight: 750,
                          border: '1px solid rgba(10, 132, 255, 0.35)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        UPGRADE #{idx + 1}
                      </span>
                      <span style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {rewrite.category || 'Production Engineering'}
                      </span>
                    </div>

                    {/* Integrated Copy Button */}
                    <button
                      onClick={() => handleCopyBullet(rewrite.improved, idx)}
                      className="btn-glass hover-lift"
                      style={{
                        fontSize: '12px',
                        padding: '6px 16px',
                        borderRadius: '980px',
                        color: isCopied ? 'var(--accent-green)' : 'var(--text-primary)',
                        borderColor: isCopied ? 'rgba(48, 209, 88, 0.4)' : 'var(--border-subtle)',
                        background: isCopied ? 'rgba(48, 209, 88, 0.12)' : 'var(--nav-track-bg)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 650,
                      }}
                      title="Copy high-impact bullet to clipboard"
                    >
                      {isCopied ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                      <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Bullet'}</span>
                    </button>
                  </div>

                  {/* 2-Column Split: Before vs. After Side-by-Side */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                      gap: '14px',
                      alignItems: 'stretch',
                    }}
                  >
                    {/* LEFT: Before Container */}
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '14px',
                        background: 'var(--ats-before-bg)',
                        border: '1px solid var(--ats-before-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--ats-before-heading)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>❌</span> ORIGINAL BULLET (UNQUANTIFIED)
                          </span>
                          {rewrite.weakPhrase ? (
                            <span
                              style={{
                                color: '#ef4444',
                                background: 'rgba(239, 68, 68, 0.12)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(239, 68, 68, 0.28)',
                                fontSize: '10.5px',
                                fontWeight: 650,
                              }}
                            >
                              Weak: "{rewrite.weakPhrase}"
                            </span>
                          ) : (
                            <span
                              style={{
                                color: 'var(--text-tertiary)',
                                background: 'var(--nav-track-bg)',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                                fontSize: '10.5px',
                                fontWeight: 500,
                              }}
                            >
                              Missing Quantified Impact
                            </span>
                          )}
                        </div>

                        <div style={{ fontSize: '13.5px', color: 'var(--ats-before-text)', lineHeight: 1.6 }}>
                          {rewrite.weakPhrase ? (
                            <span>
                              <span
                                style={{
                                  textDecoration: 'line-through',
                                  color: 'var(--ats-before-heading)',
                                  fontWeight: 700,
                                  background: 'rgba(239, 68, 68, 0.15)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                }}
                              >
                                {rewrite.weakPhrase}
                              </span>{' '}
                              {rewrite.original.replace(new RegExp(`^${rewrite.weakPhrase}\\s*`, 'i'), '')}
                            </span>
                          ) : (
                            rewrite.original
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          borderTop: '1px dashed var(--ats-before-border)',
                          paddingTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ color: 'var(--ats-before-heading)' }}>⚠️</span>
                        <span>Lacks quantified scale, baseline measurements & architectural ownership</span>
                      </div>
                    </div>

                    {/* RIGHT: After Container with explicit X-Y-Z Chips */}
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '14px',
                        background: 'var(--ats-after-bg)',
                        border: '1px solid var(--ats-after-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: '0 4px 20px rgba(48, 209, 88, 0.06)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          <span style={{ color: 'var(--ats-after-heading)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>✅</span> GOOGLE X-Y-Z FORMULA (ATS VERIFIED)
                          </span>
                          <span
                            style={{
                              color: 'var(--accent-green)',
                              fontWeight: 700,
                              background: 'rgba(34, 197, 94, 0.12)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '10.5px',
                              border: '1px solid rgba(34, 197, 94, 0.25)',
                            }}
                          >
                            Verified ATS Format
                          </span>
                        </div>

                        <div style={{ fontSize: '13.5px', color: 'var(--ats-after-text)', lineHeight: 1.6, fontWeight: 500 }}>
                          {rewrite.xyzBreakdown ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{ fontSize: '13.5px', lineHeight: 1.65 }}>
                                <span
                                  style={{
                                    color: 'var(--accent-blue)',
                                    background: 'rgba(10, 132, 255, 0.12)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 650,
                                    border: '1px solid rgba(10, 132, 255, 0.25)',
                                  }}
                                  title="[X] Accomplished"
                                >
                                  {rewrite.xyzBreakdown.accomplished}
                                </span>
                                {', '}
                                <span
                                  style={{
                                    color: 'var(--accent-green)',
                                    background: 'rgba(48, 209, 88, 0.12)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 650,
                                    border: '1px solid rgba(48, 209, 88, 0.25)',
                                  }}
                                  title="[Y] Measured by"
                                >
                                  {rewrite.xyzBreakdown.measuredBy}
                                </span>
                                {' by '}
                                <span
                                  style={{
                                    color: 'var(--accent-purple)',
                                    background: 'rgba(191, 90, 242, 0.12)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 650,
                                    border: '1px solid rgba(191, 90, 242, 0.25)',
                                  }}
                                  title="[Z] Doing"
                                >
                                  {rewrite.xyzBreakdown.doing}
                                </span>
                                .
                              </div>

                              {/* Google X-Y-Z Legend Badges */}
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                                <span style={{ color: 'var(--accent-blue)', background: 'rgba(10, 132, 255, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(10, 132, 255, 0.18)' }}>[X] Outcome</span>
                                <span style={{ color: 'var(--accent-green)', background: 'rgba(48, 209, 88, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(48, 209, 88, 0.18)' }}>[Y] Metric</span>
                                <span style={{ color: 'var(--accent-purple)', background: 'rgba(191, 90, 242, 0.08)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(191, 90, 242, 0.18)' }}>[Z] Method</span>
                              </div>
                            </div>
                          ) : (
                            rewrite.improved
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--accent-green)',
                          borderTop: '1px dashed var(--ats-after-border)',
                          paddingTop: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                        }}
                      >
                        <span>⚡</span>
                        <span>Direct replacement ready for your resume</span>
                      </div>
                    </div>
                  </div>

                  {/* Sleek Integrated Analysis Strip */}
                  <div
                    style={{
                      background: 'var(--nav-track-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '14px',
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <span>⚡</span> Action Verb
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 650 }}>
                        {rewrite.powerVerb || 'Direct Action Verb'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <span>📊</span> Added Metric & Scale
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-primary)', fontWeight: 650 }}>
                        {rewrite.metrics || 'Quantified outcome added'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', fontWeight: 750, display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <span>🎯</span> ATS Rationale
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {rewrite.rationale}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
