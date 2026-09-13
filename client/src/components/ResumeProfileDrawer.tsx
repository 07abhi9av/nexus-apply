import React, { useState, useEffect, useMemo } from 'react';
import type { CandidateProfile } from '../types';
import {
  X,
  FileText,
  Check,
  RefreshCw,
  Upload,
  RotateCcw,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building,
  ExternalLink,
  Sparkles,
  Cpu,
  Award,
  GraduationCap,
  Layers,
  Terminal,
  Zap,
  Plus,
  CheckCheck,
  Compass,
} from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';

const LinkedinIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.6a1.64 1.64 0 0 0-1.64 1.63 1.64 1.64 0 0 0 1.64 1.63 1.64 1.64 0 0 0 1.63-1.63A1.64 1.64 0 0 0 7.83 6.6z"/>
  </svg>
);

const GithubIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

interface ResumeProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile | null;
  onSaveProfile: (profile: CandidateProfile) => void;
  onReindexResume: () => void;
  isReindexing: boolean;
  onOpenUploadModal?: () => void;
  onResetTracker?: () => void;
  onOpenOnboarding?: () => void;
}

type TabType = 'profile' | 'resume' | 'vectors' | 'preferences';

export const ResumeProfileDrawer: React.FC<ResumeProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onReindexResume,
  isReindexing,
  onOpenUploadModal,
  onResetTracker,
  onOpenOnboarding,
}) => {
  if (!isOpen || !profile) return null;

  const [formData, setFormData] = useState<CandidateProfile>(profile);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newRoleInput, setNewRoleInput] = useState('');
  const [activeSkillCategory, setActiveSkillCategory] = useState<string>('all');

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleVectorChange = (key: keyof CandidateProfile['competencyVectors'], val: number) => {
    setFormData((prev) => ({
      ...prev,
      competencyVectors: { ...prev.competencyVectors, [key]: val },
    }));
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2400);
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleAddRole = () => {
    const trimmed = newRoleInput.trim();
    if (trimmed && !formData.preferences.targetRoles.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          targetRoles: [...prev.preferences.targetRoles, trimmed],
        },
      }));
      setNewRoleInput('');
    }
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        targetRoles: prev.preferences.targetRoles.filter((r) => r !== roleToRemove),
      },
    }));
  };

  // Skill categorization
  const categorizedSkills = useMemo(() => {
    const cloud = [
      'Amazon EKS & Kubernetes',
      'Linux Systems Administration',
      'Terraform (IaC)',
      'AWS (EKS, EC2, Route 53, IAM, VPC, S3)',
      'Docker & Helm Chart Development',
    ];
    const cicd = [
      'CI/CD (Jenkins, GitHub Actions, ArgoCD)',
      'GitOps & Spinnaker',
      'Observability (Datadog, Prometheus, Grafana)',
      'Elasticsearch / Splunk / JMeter',
    ];
    const security = [
      'Route 53 GSLB & Multi-Region Recovery',
      'NGINX (Reverse Proxy, SSL/TLS, Rate Limiting)',
      'DDoS & Zip Bomb Mitigation',
      'AWS WAF & Security Hardening',
      'Distributed Financial Systems',
    ];
    const ai = [
      'Python & TypeScript',
      'Bash / Shell Scripting',
      'PostgreSQL, MongoDB, Snowflake',
      'AI/LLM Automation (Anthropic Claude API)',
      'Agentic Workflows & AI Incident Triage',
    ];

    if (activeSkillCategory === 'cloud') return formData.skills.filter((s) => cloud.includes(s));
    if (activeSkillCategory === 'cicd') return formData.skills.filter((s) => cicd.includes(s));
    if (activeSkillCategory === 'security') return formData.skills.filter((s) => security.includes(s));
    if (activeSkillCategory === 'ai') return formData.skills.filter((s) => ai.includes(s));
    return formData.skills;
  }, [formData.skills, activeSkillCategory]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Identity & Bio', icon: <User style={{ width: '13px', height: '13px' }} /> },
    { id: 'resume', label: 'Experience & Projects', icon: <Briefcase style={{ width: '13px', height: '13px' }} /> },
    { id: 'vectors', label: 'AI Matching Weights', icon: <Cpu style={{ width: '13px', height: '13px' }} /> },
    { id: 'preferences', label: 'Target Portals', icon: <Compass style={{ width: '13px', height: '13px' }} /> },
  ];

  return (
    <div
      className="drawer-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          height: '100%',
          background: 'var(--drawer-bg)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          borderLeft: '1px solid var(--drawer-border)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Hero Banner */}
        <div
          style={{
            padding: '26px 30px 22px',
            background: 'var(--drawer-header-bg)',
            borderBottom: '1px solid var(--border-subtle)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="btn-glass hover-lift"
            style={{
              position: 'absolute',
              top: '22px',
              right: '22px',
              padding: '8px',
              borderRadius: '50%',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
            }}
            title="Close Drawer (Esc)"
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>

          {/* User Identity Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #0077ED 0%, #00C7BE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '20px',
                color: '#ffffff',
                boxShadow: '0 0 30px rgba(0, 119, 237, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              AA
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '13px',
                  height: '13px',
                  borderRadius: '50%',
                  background: 'var(--accent-green)',
                  border: '2.5px solid var(--drawer-bg)',
                  boxShadow: '0 0 8px rgba(48, 209, 88, 0.6)',
                }}
                title="Active & Ready"
              />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '20px',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  {formData.name}
                </h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '980px',
                    fontSize: '11px',
                    fontWeight: 600,
                    background: 'rgba(48, 209, 88, 0.12)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(48, 209, 88, 0.3)',
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#30D158' }} />
                  Ready to Deploy
                </span>
              </div>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginTop: '3px',
                  lineHeight: 1.3,
                }}
              >
                {formData.title} · <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{formData.currentCompany}</span>
              </p>
            </div>
          </div>

          {/* Quick Contact & Profile Action Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => copyToClipboard(formData.email, 'email')}
              className="btn-glass"
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                borderRadius: '980px',
                background: 'var(--drawer-pill-bg)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Click to copy email"
            >
              {copiedField === 'email' ? (
                <CheckCheck style={{ width: '12px', height: '12px', color: 'var(--accent-green)' }} />
              ) : (
                <Mail style={{ width: '12px', height: '12px', color: 'var(--accent-blue)' }} />
              )}
              <span>{copiedField === 'email' ? 'Copied Email' : formData.email}</span>
            </button>

            <button
              onClick={() => copyToClipboard(formData.phone, 'phone')}
              className="btn-glass"
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                borderRadius: '980px',
                background: 'var(--drawer-pill-bg)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Click to copy phone"
            >
              {copiedField === 'phone' ? (
                <CheckCheck style={{ width: '12px', height: '12px', color: 'var(--accent-green)' }} />
              ) : (
                <Phone style={{ width: '12px', height: '12px', color: 'var(--accent-green)' }} />
              )}
              <span>{copiedField === 'phone' ? 'Copied Phone' : formData.phone}</span>
            </button>

            <span
              style={{
                fontSize: '11.5px',
                padding: '5px 12px',
                borderRadius: '980px',
                background: 'var(--drawer-pill-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MapPin style={{ width: '12px', height: '12px', color: 'var(--accent-yellow)' }} />
              <span>{formData.location}</span>
            </span>

            {formData.linkedin && (
              <a
                href={formData.linkedin.startsWith('http') ? formData.linkedin : `https://${formData.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass"
                style={{
                  fontSize: '11.5px',
                  padding: '5px 12px',
                  borderRadius: '980px',
                  background: 'var(--drawer-pill-bg)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  textDecoration: 'none',
                }}
              >
                <span>LinkedIn</span>
                <ExternalLink style={{ width: '11px', height: '11px' }} />
              </a>
            )}

            {formData.github && (
              <a
                href={formData.github.startsWith('http') ? formData.github : `https://${formData.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass"
                style={{
                  fontSize: '11.5px',
                  padding: '5px 12px',
                  borderRadius: '980px',
                  background: 'var(--drawer-pill-bg)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  textDecoration: 'none',
                }}
              >
                <span>GitHub</span>
                <ExternalLink style={{ width: '11px', height: '11px' }} />
              </a>
            )}
          </div>
        </div>

        {/* Liquid Glass Resume Status HUD */}
        <div
          style={{
            padding: '12px 28px',
            background: 'var(--nav-track-bg)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'rgba(10, 132, 255, 0.14)',
                border: '1px solid rgba(10, 132, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)',
              }}
            >
              <FileText style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 650, color: 'var(--text-primary)' }}>
                Resume.pdf
              </div>
              <div style={{ fontSize: '11px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 650 }}>98% ATS Alignment</span> · <span>{formData.skills.length} skills indexed</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onOpenUploadModal && (
              <button
                onClick={onOpenUploadModal}
                className="btn-glass"
                style={{
                  fontSize: '11.5px',
                  padding: '6px 13px',
                  borderRadius: '980px',
                  color: 'var(--accent-blue)',
                  borderColor: 'rgba(10, 132, 255, 0.35)',
                  background: 'rgba(10, 132, 255, 0.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600,
                }}
                title="Upload updated resume PDF"
              >
                <Upload style={{ width: '12px', height: '12px' }} />
                <span>Upload PDF</span>
              </button>
            )}

            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="btn-glass"
                style={{
                  fontSize: '11.5px',
                  padding: '6px 13px',
                  borderRadius: '980px',
                  color: 'var(--accent-purple)',
                  borderColor: 'rgba(191, 90, 242, 0.35)',
                  background: 'rgba(191, 90, 242, 0.08)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontWeight: 600,
                }}
                title="Switch Career Specialization (Data Engineering, DevOps, Backend, etc.)"
              >
                <Sparkles style={{ width: '12px', height: '12px' }} />
                <span>Switch Track</span>
              </button>
            )}

            <button
              onClick={onReindexResume}
              disabled={isReindexing}
              className="btn-glass btn-blue"
              style={{
                fontSize: '11.5px',
                padding: '6px 14px',
                borderRadius: '980px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600,
              }}
              title="Rescan and re-vectorize resume against all verified companies"
            >
              <RefreshCw
                style={{
                  width: '12px',
                  height: '12px',
                  animation: isReindexing ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isReindexing ? 'Scanning...' : 'Rescan Match'}</span>
            </button>
          </div>
        </div>

        {/* Liquid Frosted Segmented Tab Switcher */}
        <div style={{ padding: '14px 28px 0' }}>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '3px',
              background: 'var(--nav-track-bg)',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '12px',
                    fontWeight: 650,
                    fontFamily: 'var(--font-display)',
                    border: 'none',
                    borderRadius: '9px',
                    cursor: 'pointer',
                    transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                    background: isActive ? 'var(--tab-active-bg)' : 'transparent',
                    color: isActive ? 'var(--tab-active-text)' : 'var(--text-secondary)',
                    boxShadow: isActive ? 'var(--tab-active-shadow)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Body (Scrollable) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 28px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* TAB 1: IDENTITY & BIO */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <GlassFieldGroup label="Full Name" icon={<User style={{ width: '12px', height: '12px' }} />}>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass-input"
                  />
                </GlassFieldGroup>

                <GlassFieldGroup label="Target Headline" icon={<Briefcase style={{ width: '12px', height: '12px' }} />}>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="glass-input"
                  />
                </GlassFieldGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <GlassFieldGroup label="Current Organization" icon={<Building style={{ width: '12px', height: '12px' }} />}>
                  <input
                    type="text"
                    value={formData.currentCompany}
                    onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                    className="glass-input"
                  />
                </GlassFieldGroup>

                <GlassFieldGroup label="Primary Base Location" icon={<MapPin style={{ width: '12px', height: '12px' }} />}>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="glass-input"
                  />
                </GlassFieldGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <GlassFieldGroup label="Direct Email Address" icon={<Mail style={{ width: '12px', height: '12px' }} />}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input"
                  />
                </GlassFieldGroup>

                <GlassFieldGroup label="Contact Phone" icon={<Phone style={{ width: '12px', height: '12px' }} />}>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="glass-input"
                  />
                </GlassFieldGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <GlassFieldGroup label="LinkedIn Profile URL" icon={<LinkedinIcon style={{ width: '12px', height: '12px', color: '#0A66C2' }} />}>
                  <input
                    type="text"
                    value={formData.linkedin || ''}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/abhinavaryan07"
                    className="glass-input"
                  />
                </GlassFieldGroup>

                <GlassFieldGroup label="GitHub Profile URL" icon={<GithubIcon style={{ width: '12px', height: '12px', color: 'var(--text-primary)' }} />}>
                  <input
                    type="text"
                    value={formData.github || ''}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/07abhi9av"
                    className="glass-input"
                  />
                </GlassFieldGroup>
              </div>

              <GlassFieldGroup
                label="Executive Engineering Summary"
                icon={<Sparkles style={{ width: '12px', height: '12px', color: 'var(--accent-yellow)' }} />}
              >
                <textarea
                  rows={4}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="glass-input"
                  style={{ resize: 'vertical', lineHeight: 1.5, fontSize: '12.5px' }}
                />
              </GlassFieldGroup>

              {/* Interactive Skills Cloud */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'var(--drawer-card-bg)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Layers style={{ width: '14px', height: '14px', color: 'var(--accent-blue)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                      Skills & Technologies ({formData.skills.length})
                    </span>
                  </div>

                  {/* Category Filter Pills */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'cloud', label: 'Cloud' },
                      { id: 'cicd', label: 'CI/CD' },
                      { id: 'security', label: 'Sec' },
                      { id: 'ai', label: 'AI' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveSkillCategory(cat.id)}
                        style={{
                          background: activeSkillCategory === cat.id ? 'var(--accent-blue)' : 'var(--drawer-pill-bg)',
                          color: activeSkillCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add new skill input */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Add technology (e.g. Istio, Kafka)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    className="glass-input"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  />
                  <button
                    onClick={handleAddSkill}
                    className="btn-glass btn-blue"
                    style={{ fontSize: '12px', padding: '6px 14px', flexShrink: 0 }}
                  >
                    <Plus style={{ width: '13px', height: '13px' }} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Skill Chips Cloud */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {categorizedSkills.map((skill, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11.5px',
                        padding: '4px 10px',
                        borderRadius: '980px',
                        background: 'rgba(10, 132, 255, 0.12)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(10, 132, 255, 0.28)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                      }}
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-tertiary)',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="Remove skill"
                      >
                        <X style={{ width: '11px', height: '11px' }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE & PROJECTS */}
          {activeTab === 'resume' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Production Experience Card */}
              {formData.experience.map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    borderRadius: '16px',
                    background: 'var(--drawer-card-bg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {exp.role}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--accent-blue)', marginTop: '2px', fontWeight: 600 }}>
                        {exp.company}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 10px',
                        borderRadius: '8px',
                        background: 'var(--drawer-pill-bg)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  {/* Impact Highlights Bar */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '8px',
                      margin: '16px 0',
                      padding: '10px 12px',
                      background: 'var(--drawer-pill-bg)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>99.9%+</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Uptime</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>40%</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Faster Deploys</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)' }}>60%</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>MTTD Cut</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-teal)', fontFamily: 'var(--font-mono)' }}>90%</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>SonarQube</div>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, display: 'flex', gap: '8px' }}>
                        <span style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }}>•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Engineering Projects */}
              {formData.projects && formData.projects.length > 0 && (
                <div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Terminal style={{ width: '13px', height: '13px', color: 'var(--accent-green)' }} />
                    <span>Featured Production Projects ({formData.projects.length})</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {formData.projects.map((proj, pIdx) => (
                      <div
                        key={pIdx}
                        style={{
                          padding: '16px',
                          borderRadius: '14px',
                          background: 'var(--drawer-card-bg)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                          {proj.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--accent-green)',
                            fontFamily: 'var(--font-mono)',
                            marginTop: '3px',
                            marginBottom: '10px',
                            background: 'rgba(48, 209, 88, 0.12)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            display: 'inline-block',
                          }}
                        >
                          {proj.techStack}
                        </div>

                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {proj.highlights.map((ph, phIdx) => (
                            <li key={phIdx} style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, display: 'flex', gap: '7px' }}>
                              <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}>•</span>
                              <span>{ph}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education & Certifications */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--drawer-card-bg)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    <GraduationCap style={{ width: '13px', height: '13px', color: 'var(--accent-yellow)' }} />
                    <span>Education</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {formData.education?.[0]?.institution || 'Vellore Institute of Technology (VIT)'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {formData.education?.[0]?.degree || 'B.Tech, Information Technology'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--accent-yellow)', fontFamily: 'var(--font-mono)', marginTop: '6px', fontWeight: 600 }}>
                    CGPA: {formData.education?.[0]?.cgpa || '8.9'} / 10.0
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '14px', background: 'var(--drawer-card-bg)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    <Award style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
                    <span>Verified Certifications</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    <div>• AWS Certified Cloud Practitioner</div>
                    <div>• Azure AZ-900 & AI-900</div>
                    <div>• CKA (In Progress)</div>
                    <div>• AWS Solutions Architect (In Progress)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI VECTOR WEIGHTS */}
          {activeTab === 'vectors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(10, 132, 255, 0.08)',
                  border: '1px solid rgba(10, 132, 255, 0.25)',
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Zap style={{ width: '13px', height: '13px' }} />
                  Real-time Matching Vectors
                </div>
                Tuning these 6 dimensions dynamically shifts match scoring across all portals. Top candidates maintain 90%+ in core engineering.
              </div>

              {[
                { key: 'distributedSystems', label: 'Distributed Systems & Scale', color: '#0A84FF' },
                { key: 'fintechProtocols', label: 'Fintech Protocols & Resiliency', color: '#BF5AF2' },
                { key: 'cloudK8s', label: 'Cloud Infrastructure & Kubernetes (EKS)', color: '#30D158' },
                { key: 'reliabilityObservability', label: 'Reliability & Observability (SRE)', color: '#64D2FF' },
                { key: 'securityDDoS', label: 'Security & DDoS Hardening', color: '#FF9F0A' },
                { key: 'aiAutomation', label: 'AI, LLMs & Agentic Automation', color: '#FF375F' },
              ].map(({ key, label, color }) => {
                const val = formData.competencyVectors[key as keyof CandidateProfile['competencyVectors']];
                return (
                  <div
                    key={key}
                    style={{
                      padding: '16px 20px',
                      borderRadius: '14px',
                      background: 'var(--drawer-card-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: `${color}20`,
                          color: color,
                          border: `1px solid ${color}40`,
                        }}
                      >
                        {val}%
                      </span>
                    </div>

                    <input
                      type="range"
                      min="60"
                      max="100"
                      value={val}
                      onChange={(e) =>
                        handleVectorChange(key as keyof CandidateProfile['competencyVectors'], Number(e.target.value))
                      }
                      style={{
                        width: '100%',
                        accentColor: color,
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: TARGET PORTALS & PREFERENCES */}
          {activeTab === 'preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Target Roles */}
              <div style={{ padding: '18px', borderRadius: '14px', background: 'var(--drawer-card-bg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Target Engineering Roles
                  </label>
                  <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{formData.preferences.targetRoles.length} selected</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        const r = e.target.value;
                        if (!formData.preferences.targetRoles.includes(r)) {
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              targetRoles: [...prev.preferences.targetRoles, r],
                            },
                          }));
                        }
                      }
                    }}
                    className="glass-input"
                    style={{ fontSize: '12px', padding: '6px 12px', cursor: 'pointer', flex: '1 1 200px' }}
                  >
                    <option value="" disabled style={{ background: '#1c1c1e', color: '#8e8e93' }}>
                      Select role from dropdown...
                    </option>
                    <option value="DevOps / SRE" style={{ background: '#1c1c1e', color: '#fff' }}>DevOps / SRE</option>
                    <option value="Platform & Infrastructure Engineer" style={{ background: '#1c1c1e', color: '#fff' }}>Platform & Infrastructure Engineer</option>
                    <option value="Cloud Systems Architect" style={{ background: '#1c1c1e', color: '#fff' }}>Cloud Systems Architect</option>
                    <option value="Backend / Distributed Systems" style={{ background: '#1c1c1e', color: '#fff' }}>Backend / Distributed Systems</option>
                    <option value="Full-Stack Software Engineer" style={{ background: '#1c1c1e', color: '#fff' }}>Full-Stack Software Engineer</option>
                    <option value="Data Engineer / Big Data Platform" style={{ background: '#1c1c1e', color: '#fff' }}>Data Engineer / Big Data Platform</option>
                    <option value="AI / Machine Learning / LLM Engineer" style={{ background: '#1c1c1e', color: '#fff' }}>AI / Machine Learning / LLM Engineer</option>
                    <option value="Security & DevSecOps Engineer" style={{ background: '#1c1c1e', color: '#fff' }}>Security & DevSecOps Engineer</option>
                    <option value="Production / Linux Systems Engineer" style={{ background: '#1c1c1e', color: '#fff' }}>Production / Linux Systems Engineer</option>
                    <option value="Frontend / UI Systems Engineer" style={{ background: '#1c1c1e', color: '#fff' }}>Frontend / UI Systems Engineer</option>
                  </select>

                  <div style={{ display: 'flex', gap: '8px', flex: '1 1 240px' }}>
                    <input
                      type="text"
                      placeholder="Or type custom role..."
                      value={newRoleInput}
                      onChange={(e) => setNewRoleInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRole();
                        }
                      }}
                      className="glass-input"
                      style={{ fontSize: '12px', padding: '6px 12px', flex: 1 }}
                    />
                    <button onClick={handleAddRole} className="btn-glass btn-blue" style={{ fontSize: '12px', padding: '6px 14px' }}>
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.preferences.targetRoles.map((role, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '12px',
                        padding: '4px 10px',
                        borderRadius: '980px',
                        background: 'rgba(255, 214, 10, 0.12)',
                        color: 'var(--accent-yellow)',
                        border: '1px solid rgba(255, 214, 10, 0.35)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{role}</span>
                      <button
                        onClick={() => handleRemoveRole(role)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0 }}
                      >
                        <X style={{ width: '11px', height: '11px' }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Priority Companies */}
              <div style={{ padding: '18px', borderRadius: '14px', background: 'var(--drawer-card-bg)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
                  Top Priority Companies ({formData.preferences.targetCompanies.length})
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {formData.preferences.targetCompanies.map((comp, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'var(--drawer-pill-bg)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <CompanyLogo company={comp} size={22} />
                      <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Locations */}
              <div style={{ padding: '18px', borderRadius: '14px', background: 'var(--drawer-card-bg)', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
                  Preferred Geographies
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {formData.preferences.locations.map((loc, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderRadius: '980px',
                        background: 'rgba(100, 210, 255, 0.12)',
                        color: 'var(--accent-teal)',
                        border: '1px solid rgba(100, 210, 255, 0.3)',
                      }}
                    >
                      {loc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Minimum Match Score Threshold */}
              <div style={{ padding: '18px', borderRadius: '14px', background: 'var(--drawer-card-bg)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Minimum Match Score Cutoff
                  </label>
                  <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                    {formData.preferences.minMatchScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={formData.preferences.minMatchScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferences: { ...formData.preferences, minMatchScore: Number(e.target.value) },
                    })
                  }
                  style={{ width: '100%', accentColor: 'var(--accent-blue)', cursor: 'pointer' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--drawer-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            {savedNotice ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--accent-green)', fontWeight: 600 }}>
                <Check style={{ width: '15px', height: '15px' }} /> Profile Saved
              </span>
            ) : onResetTracker ? (
              <button
                onClick={() => {
                  if (window.confirm('Reset all applied company applications back to Discovered status?')) {
                    onResetTracker();
                  }
                }}
                className="btn-glass"
                style={{ fontSize: '11.5px', padding: '5px 12px', color: 'var(--text-tertiary)' }}
                title="Reset application counts and statuses"
              >
                <RotateCcw style={{ width: '12px', height: '12px' }} />
                <span>Reset Tracker</span>
              </button>
            ) : (
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Auto-saved
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              className="btn-glass"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="btn btn-blue"
              style={{
                fontSize: '13px',
                padding: '8px 22px',
                fontWeight: 600,
                borderRadius: '10px',
                boxShadow: '0 4px 16px rgba(0, 113, 227, 0.35)',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Glass Field Group
const GlassFieldGroup: React.FC<{ label: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  label,
  icon,
  children,
}) => (
  <div>
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '6px',
        fontFamily: 'var(--font-display)',
      }}
    >
      {icon}
      <span>{label}</span>
    </label>
    {children}
  </div>
);
