import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  Server,
  Layout,
  Cpu,
  Shield,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  X,
  Briefcase,
  MapPin,
  Building2,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CandidateProfile, JobOpportunity } from '../types';
import {
  DOMAIN_TRACKS,
  SENIORITY_LEVELS,
  type DomainTrack,
  getDomainById,
} from '../utils/domainProfiles';

interface DomainOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: CandidateProfile | null;
  onComplete: (profile: CandidateProfile, jobs?: JobOpportunity[]) => void;
  isInitialOnboarding?: boolean;
}

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  'data-engineering': <Database style={{ width: '18px', height: '18px' }} />,
  'devops-sre': <Cloud style={{ width: '18px', height: '18px' }} />,
  'backend-systems': <Server style={{ width: '18px', height: '18px' }} />,
  'frontend-fullstack': <Layout style={{ width: '18px', height: '18px' }} />,
  'ai-ml': <Cpu style={{ width: '18px', height: '18px' }} />,
  'cybersecurity': <Shield style={{ width: '18px', height: '18px' }} />,
};

const CORRIDOR_OPTIONS = [
  { id: 'bengaluru', label: 'Bengaluru Tech Corridor', hub: 'Bengaluru, India', icon: '🌆' },
  { id: 'delhi-ncr', label: 'Delhi NCR Hub (Gurgaon / Noida)', hub: 'Delhi NCR, India', icon: '🏛️' },
  { id: 'remote', label: 'Global & India Remote', hub: 'Remote', icon: '🌐' },
];

export const DomainOnboardingModal: React.FC<DomainOnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onComplete,
  isInitialOnboarding = false,
}) => {
  // Step state (1: Domain, 2: Experience & Skills, 3: Corridors & Target Roles)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Selected Domain
  const initialDomain = currentProfile?.domain
    ? getDomainById(currentProfile.domain)
    : DOMAIN_TRACKS[0]; // Default to Data Engineering as highlighted by user

  const [selectedDomain, setSelectedDomain] = useState<DomainTrack>(initialDomain);

  // Seniority
  const [selectedSeniority, setSelectedSeniority] = useState<string>(
    currentProfile?.seniority || 'senior'
  );

  // Editable Profile fields
  const [title, setTitle] = useState(
    currentProfile?.domain === selectedDomain.id && currentProfile?.title
      ? currentProfile.title
      : selectedDomain.defaultTitle
  );
  const [summary, setSummary] = useState(
    currentProfile?.domain === selectedDomain.id && currentProfile?.summary
      ? currentProfile.summary
      : selectedDomain.defaultSummary
  );

  // Selected Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentProfile?.domain === selectedDomain.id && currentProfile?.skills?.length
      ? currentProfile.skills
      : selectedDomain.coreSkills
  );
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Target Corridors
  const [selectedCorridors, setSelectedCorridors] = useState<string[]>([
    'Bengaluru, India',
    'Delhi NCR, India',
    'Remote',
  ]);

  // Target Companies
  const [targetCompanies, setTargetCompanies] = useState<string[]>(
    selectedDomain.targetCompanies
  );
  const [customCompanyInput, setCustomCompanyInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset/sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      const active = currentProfile?.domain
        ? getDomainById(currentProfile.domain)
        : DOMAIN_TRACKS[0];
      setSelectedDomain(active);
      setTitle(currentProfile?.title || active.defaultTitle);
      setSummary(currentProfile?.summary || active.defaultSummary);
      setSelectedSkills(currentProfile?.skills?.length ? currentProfile.skills : active.coreSkills);
      setTargetCompanies(active.targetCompanies);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  // Handle Domain Card Selection
  const handleSelectDomain = (track: DomainTrack) => {
    setSelectedDomain(track);
    setTitle(track.defaultTitle);
    setSummary(track.defaultSummary);
    setSelectedSkills(track.coreSkills);
    setTargetCompanies(track.targetCompanies);
  };

  // Toggle Skill
  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 3) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add Custom Skill
  const handleAddCustomSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
      setCustomSkillInput('');
    }
  };

  // Toggle Corridor
  const handleToggleCorridor = (hub: string) => {
    if (selectedCorridors.includes(hub)) {
      if (selectedCorridors.length > 1) {
        setSelectedCorridors(selectedCorridors.filter((c) => c !== hub));
      }
    } else {
      setSelectedCorridors([...selectedCorridors, hub]);
    }
  };

  // Add Custom Company
  const handleAddCustomCompany = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customCompanyInput.trim();
    if (trimmed && !targetCompanies.includes(trimmed)) {
      setTargetCompanies([...targetCompanies, trimmed]);
      setCustomCompanyInput('');
    }
  };

  // Remove Company
  const handleRemoveCompany = (company: string) => {
    if (targetCompanies.length > 2) {
      setTargetCompanies(targetCompanies.filter((c) => c !== company));
    }
  };

  // Launch pipeline
  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      const updatedProfile: CandidateProfile = {
        name: currentProfile?.name || 'Engineer',
        title: title.trim() || selectedDomain.defaultTitle,
        currentCompany: currentProfile?.currentCompany || 'Technology Platform',
        email: currentProfile?.email || 'engineer@nexus.apply',
        phone: currentProfile?.phone || '+91 98765 43210',
        location: selectedCorridors[0] || 'Bengaluru, Karnataka, India',
        linkedin: currentProfile?.linkedin || 'https://linkedin.com',
        github: currentProfile?.github || 'https://github.com',
        summary: summary.trim() || selectedDomain.defaultSummary,
        skills: selectedSkills,
        domain: selectedDomain.id,
        seniority: selectedSeniority,
        experience: currentProfile?.experience || [],
        projects: currentProfile?.projects || [],
        education: currentProfile?.education || [],
        certifications: currentProfile?.certifications || [],
        competencyVectors: {
          ...(currentProfile?.competencyVectors || {}),
          ...selectedDomain.competencyVectors,
        },
        preferences: {
          targetRoles: selectedDomain.targetRoles,
          targetCompanies: targetCompanies,
          locations: selectedCorridors,
          minMatchScore: 80,
          autoPilotEnabled: currentProfile?.preferences?.autoPilotEnabled || false,
        },
      };

      // Confetti celebration
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: [selectedDomain.accentColor, '#3b82f6', '#10b981', '#f59e0b'],
      });

      // Save to localStorage
      localStorage.setItem('nexus_domain_onboarded', selectedDomain.id);

      // Invoke parent callback
      onComplete(updatedProfile);
    } catch (err) {
      console.error('Failed to launch domain pipeline:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '88vh',
          background: 'var(--modal-bg, rgba(16, 16, 22, 0.96))',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid var(--modal-border, rgba(255, 255, 255, 0.12))',
          borderRadius: '24px',
          boxShadow: 'var(--modal-shadow, 0 32px 80px -16px rgba(0, 0, 0, 0.9))',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          color: 'var(--text-primary)',
          boxSizing: 'border-box',
        }}
      >
        {/* Glowing Top Accent Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '8%',
            right: '8%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, ${selectedDomain.accentColor}, #0A84FF, transparent)`,
            borderRadius: '999px',
            zIndex: 2,
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            padding: '20px 28px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--card-header-bg, rgba(255, 255, 255, 0.02))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexShrink: 0,
          }}
        >
          {/* Header Title with Domain Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: selectedDomain.accentGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: `0 4px 16px ${selectedDomain.accentColor}40`,
                fontSize: '19px',
                flexShrink: 0,
              }}
            >
              <span>{selectedDomain.icon}</span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '17px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Configure Career Domain
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '980px',
                    background: `${selectedDomain.accentColor}20`,
                    color: selectedDomain.accentColor,
                    border: `1px solid ${selectedDomain.accentColor}45`,
                  }}
                >
                  {selectedDomain.badge}
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                Target ATS scoring vectors, match keywords, and verified job rankings
              </p>
            </div>
          </div>

          {/* Stepper & Close Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* 3-Step Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--nav-track-bg, rgba(255, 255, 255, 0.06))',
                padding: '4px 12px',
                borderRadius: '980px',
                border: '1px solid var(--border-subtle)',
                gap: '8px',
              }}
            >
              {/* Step 1 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    background: step === 1 ? selectedDomain.accentColor : step > 1 ? '#30D158' : 'var(--drawer-pill-bg)',
                    color: '#ffffff',
                  }}
                >
                  {step > 1 ? <Check style={{ width: '10px', height: '10px' }} /> : '1'}
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: step === 1 ? 700 : 500,
                    color: step === 1 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  Domain
                </span>
              </div>

              <ChevronRight style={{ width: '10px', height: '10px', color: 'var(--text-tertiary)' }} />

              {/* Step 2 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    background: step === 2 ? selectedDomain.accentColor : step > 2 ? '#30D158' : 'var(--drawer-pill-bg)',
                    color: step === 2 || step > 2 ? '#ffffff' : 'var(--text-tertiary)',
                  }}
                >
                  {step > 2 ? <Check style={{ width: '10px', height: '10px' }} /> : '2'}
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: step === 2 ? 700 : 500,
                    color: step === 2 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  Skills & Level
                </span>
              </div>

              <ChevronRight style={{ width: '10px', height: '10px', color: 'var(--text-tertiary)' }} />

              {/* Step 3 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 800,
                    background: step === 3 ? selectedDomain.accentColor : 'var(--drawer-pill-bg)',
                    color: step === 3 ? '#ffffff' : 'var(--text-tertiary)',
                  }}
                >
                  3
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: step === 3 ? 700 : 500,
                    color: step === 3 ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  }}
                >
                  Launch
                </span>
              </div>
            </div>

            {!isInitialOnboarding && (
              <button
                type="button"
                onClick={onClose}
                className="btn-glass"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
                title="Close"
              >
                <X style={{ width: '15px', height: '15px' }} />
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            boxSizing: 'border-box',
          }}
        >
          {/* STEP 1: Select Career Domain Track */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  Choose your engineering specialization
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  All 287 company portals will instantly re-rank to prioritize high-fit roles in your domain with 95–98% fit scores.
                </p>
              </div>

              {/* 6 Grid Cards with Matched Baselines */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '14px',
                }}
              >
                {DOMAIN_TRACKS.map((track) => {
                  const isSelected = selectedDomain.id === track.id;
                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectDomain(track)}
                      className="tilt-card hover-lift"
                      style={{
                        padding: '16px 18px',
                        borderRadius: '16px',
                        border: isSelected
                          ? `1.5px solid ${track.accentColor}`
                          : '1px solid var(--border-subtle)',
                        background: isSelected
                          ? `linear-gradient(155deg, var(--card-bg) 60%, ${track.accentColor}18)`
                          : 'var(--card-bg, rgba(22, 24, 32, 0.75))',
                        boxShadow: isSelected
                          ? `0 8px 28px -4px ${track.accentColor}35`
                          : 'var(--shadow-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Top Icon & Selection Indicator */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `${track.accentColor}20`,
                            color: track.accentColor,
                            border: `1px solid ${track.accentColor}35`,
                          }}
                        >
                          {DOMAIN_ICONS[track.id] || track.icon}
                        </div>

                        {isSelected ? (
                          <div
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '980px',
                              background: `${track.accentColor}22`,
                              color: track.accentColor,
                              border: `1px solid ${track.accentColor}45`,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Check style={{ width: '11px', height: '11px' }} />
                            <span>Selected</span>
                          </div>
                        ) : (
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: '1.5px solid var(--border-default)',
                            }}
                          />
                        )}
                      </div>

                      {/* Title & Tagline with matched baselines */}
                      <div>
                        <div
                          style={{
                            fontSize: '14.5px',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            minHeight: '38px',
                            display: 'flex',
                            alignItems: 'center',
                            lineHeight: 1.25,
                          }}
                        >
                          {track.title}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-secondary)',
                            minHeight: '32px',
                            lineHeight: 1.4,
                            marginTop: '2px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {track.tagline}
                        </div>
                      </div>

                      {/* Sample high fit companies pinned to bottom */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--border-subtle)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            color: 'var(--text-tertiary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          Peak Fit Portals
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {track.sampleCompanies.slice(0, 4).map((c) => (
                            <span
                              key={c}
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 650,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: isSelected
                                  ? `${track.accentColor}22`
                                  : 'var(--nav-track-bg)',
                                color: isSelected ? track.accentColor : 'var(--text-secondary)',
                                border: isSelected
                                  ? `1px solid ${track.accentColor}40`
                                  : '1px solid var(--border-subtle)',
                              }}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Seniority & Interactive Skills */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Seniority Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Briefcase style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
                  Target Seniority Level
                </span>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {SENIORITY_LEVELS.map((lvl) => {
                    const isSelected = selectedSeniority === lvl.id;
                    return (
                      <div
                        key={lvl.id}
                        onClick={() => setSelectedSeniority(lvl.id)}
                        className="tilt-card"
                        style={{
                          padding: '14px',
                          borderRadius: '14px',
                          border: isSelected
                            ? '1.5px solid var(--accent-blue)'
                            : '1px solid var(--border-subtle)',
                          background: isSelected
                            ? 'rgba(10, 132, 255, 0.12)'
                            : 'var(--card-bg)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {lvl.label}
                          </div>
                          <div
                            style={{
                              width: '16px',
                              height: '16px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: isSelected ? 'var(--accent-blue)' : 'transparent',
                              border: isSelected
                                ? '1px solid var(--accent-blue)'
                                : '1px solid var(--border-default)',
                              color: '#ffffff',
                            }}
                          >
                            {isSelected && <Check style={{ width: '10px', height: '10px' }} />}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 650,
                            color: 'var(--accent-blue)',
                          }}
                        >
                          {lvl.badge}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.35, marginTop: '2px' }}>
                          {lvl.description}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Title & Corridor Location Inputs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Target Role Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '13px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-default)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    placeholder="e.g. Senior Data Engineer"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Primary Corridor Base
                  </label>
                  <select
                    value={selectedCorridors[0] || 'Bengaluru, India'}
                    onChange={(e) => {
                      const newHub = e.target.value;
                      setSelectedCorridors([newHub, ...selectedCorridors.filter(c => c !== newHub)]);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontSize: '13px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-default)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Bengaluru, India">Bengaluru Tech Corridor</option>
                    <option value="Delhi NCR, India">Delhi NCR Tech Corridor (Gurgaon / Noida)</option>
                    <option value="Remote">Global & India Remote</option>
                  </select>
                </div>
              </div>

              {/* Full Width Executive Summary */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Executive Profile Summary (ATS Match Keywords)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '12px',
                    lineHeight: 1.5,
                    borderRadius: '10px',
                    border: '1px solid var(--border-default)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Brief career highlight summary..."
                />
              </div>

              {/* Interactive Skills Pills */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles style={{ width: '13px', height: '13px', color: selectedDomain.accentColor }} />
                    Active Skills & ATS Match Keywords
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 650,
                      color: '#30D158',
                      background: 'rgba(48, 209, 88, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '980px',
                    }}
                  >
                    {selectedSkills.length} skills active · 98% match potential
                  </span>
                </div>

                {/* Skill Pills Container */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedDomain.popularSkills.map((skill) => {
                      const isActive = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleToggleSkill(skill)}
                          style={{
                            padding: '6px 13px',
                            borderRadius: '980px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: isActive
                              ? `1px solid ${selectedDomain.accentColor}`
                              : '1px solid var(--border-subtle)',
                            background: isActive
                              ? `${selectedDomain.accentColor}25`
                              : 'var(--nav-track-bg)',
                            color: isActive ? selectedDomain.accentColor : 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isActive && <Check style={{ width: '11px', height: '11px' }} />}
                          <span>{skill}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Skill Form */}
                  <form
                    onSubmit={handleAddCustomSkill}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      placeholder="Add custom skill (e.g. Iceberg, ClickHouse, Rust)..."
                      style={{
                        flex: 1,
                        padding: '9px 13px',
                        fontSize: '12.5px',
                        borderRadius: '980px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--nav-track-bg)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!customSkillInput.trim()}
                      className="btn-glass"
                      style={{
                        padding: '8px 18px',
                        borderRadius: '980px',
                        fontSize: '12px',
                        fontWeight: 650,
                        background: customSkillInput.trim() ? selectedDomain.accentGradient : 'var(--nav-track-bg)',
                        border: '1px solid var(--border-subtle)',
                        color: customSkillInput.trim() ? '#ffffff' : 'var(--text-tertiary)',
                        cursor: customSkillInput.trim() ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>Add Skill</span>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Target Corridors & Priority Hiring Companies */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Corridor Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 'var(--text-tertiary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <MapPin style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
                  Target Corridors & Geography
                </span>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {CORRIDOR_OPTIONS.map((c) => {
                    const isSelected = selectedCorridors.includes(c.hub);
                    return (
                      <div
                        key={c.id}
                        onClick={() => handleToggleCorridor(c.hub)}
                        className="tilt-card"
                        style={{
                          padding: '14px 16px',
                          borderRadius: '14px',
                          border: isSelected
                            ? '1.5px solid var(--accent-blue)'
                            : '1px solid var(--border-subtle)',
                          background: isSelected
                            ? 'rgba(10, 132, 255, 0.12)'
                            : 'var(--card-bg)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>{c.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {c.label}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            {c.hub}
                          </div>
                        </div>
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isSelected ? 'var(--accent-blue)' : 'transparent',
                            border: isSelected
                              ? '1px solid var(--accent-blue)'
                              : '1px solid var(--border-default)',
                            color: '#ffffff',
                          }}
                        >
                          {isSelected && <Check style={{ width: '11px', height: '11px' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Priority Hiring Companies */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Building2 style={{ width: '13px', height: '13px', color: selectedDomain.accentColor }} />
                    Priority Target Companies ({targetCompanies.length})
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#30D158',
                      fontWeight: 650,
                      background: 'rgba(48, 209, 88, 0.12)',
                      padding: '2px 8px',
                      borderRadius: '980px',
                    }}
                  >
                    96%–98% Match Target
                  </span>
                </div>

                <div
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    background: 'var(--card-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {targetCompanies.map((comp) => (
                      <span
                        key={comp}
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'var(--nav-track-bg)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{comp}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCompany(comp)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            color: 'var(--text-tertiary)',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title={`Remove ${comp}`}
                        >
                          <X style={{ width: '11px', height: '11px' }} />
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Custom Company */}
                  <form
                    onSubmit={handleAddCustomCompany}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      paddingTop: '10px',
                      borderTop: '1px solid var(--border-subtle)',
                    }}
                  >
                    <input
                      type="text"
                      value={customCompanyInput}
                      onChange={(e) => setCustomCompanyInput(e.target.value)}
                      placeholder="Add dream company to target (e.g. Cloudera, Palantir, Razorpay)..."
                      style={{
                        flex: 1,
                        padding: '9px 13px',
                        fontSize: '12.5px',
                        borderRadius: '980px',
                        border: '1px solid var(--border-default)',
                        background: 'var(--nav-track-bg)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!customCompanyInput.trim()}
                      className="btn-glass"
                      style={{
                        padding: '8px 18px',
                        borderRadius: '980px',
                        fontSize: '12px',
                        fontWeight: 650,
                        background: customCompanyInput.trim() ? selectedDomain.accentGradient : 'var(--nav-track-bg)',
                        border: '1px solid var(--border-subtle)',
                        color: customCompanyInput.trim() ? '#ffffff' : 'var(--text-tertiary)',
                        cursor: customCompanyInput.trim() ? 'pointer' : 'not-allowed',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Plus style={{ width: '13px', height: '13px' }} />
                      <span>Add</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Ready Summary Spotlight Card */}
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, rgba(255, 255, 255, 0.03), ${selectedDomain.accentColor}15)`,
                  border: `1px solid ${selectedDomain.accentColor}40`,
                  boxShadow: `0 4px 20px -4px ${selectedDomain.accentColor}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '11px',
                      background: selectedDomain.accentGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '18px',
                      boxShadow: `0 4px 14px ${selectedDomain.accentColor}40`,
                      flexShrink: 0,
                    }}
                  >
                    <span>{selectedDomain.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Ready to Launch {selectedDomain.title} Pipeline
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      All 287 company portals will rank roles by fit for {selectedSkills.slice(0, 4).join(', ')}.
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: '#30D158',
                    background: 'rgba(48, 209, 88, 0.15)',
                    padding: '3px 10px',
                    borderRadius: '980px',
                    border: '1px solid rgba(48, 209, 88, 0.3)',
                  }}
                >
                  98% Peak Fit Target
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div
          style={{
            padding: '16px 28px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--card-header-bg, rgba(255, 255, 255, 0.02))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            flexShrink: 0,
          }}
        >
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2)}
              className="btn-glass hover-lift"
              style={{
                padding: '8px 16px',
                borderRadius: '980px',
                fontSize: '12px',
                fontWeight: 650,
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <ArrowLeft style={{ width: '13px', height: '13px' }} />
              <span>Back</span>
            </button>
          ) : (
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Step 1 of 3: Select Specialization
            </span>
          )}

          <div>
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 2 | 3)}
                className="hover-lift"
                style={{
                  padding: '9px 24px',
                  borderRadius: '980px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  background: selectedDomain.accentGradient,
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: `0 4px 16px ${selectedDomain.accentColor}40`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <span>Continue</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunch}
                disabled={isSubmitting}
                className="hover-lift"
                style={{
                  padding: '10px 26px',
                  borderRadius: '980px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: selectedDomain.accentGradient,
                  border: 'none',
                  color: '#ffffff',
                  boxShadow: `0 4px 20px ${selectedDomain.accentColor}50`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                }}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw style={{ width: '14px', height: '14px', animation: 'spin 1s linear infinite' }} />
                    <span>Configuring Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: '14px', height: '14px' }} />
                    <span>Launch {selectedDomain.title.split('&')[0].trim()} Pipeline</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
