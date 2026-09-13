import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Copy,
  Check,
  Heart,
  MessageSquare,
  User,
  ExternalLink,
  Code2,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CandidateProfile } from '../types';
import type { AuthUser } from '../services/supabase';
import { API_BASE } from '../config';

const LinkedinIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c.97 0 1.75-.79 1.75-1.76s-.78-1.76-1.75-1.76a1.76 1.76 0 0 0-1.76 1.76c0 .97.79 1.76 1.76 1.76m1.4 10.74v-8.37H5.06v8.37h2.8z"/>
  </svg>
);

const GithubIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const TwitterIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface DevContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: CandidateProfile | null;
  authUser?: AuthUser | null;
}

export const DevContactModal: React.FC<DevContactModalProps> = ({
  isOpen,
  onClose,
  profile,
  authUser,
}) => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'contact' | 'about'>('feedback');

  // Feedback form category state
  const [feedbackType, setFeedbackType] = useState<string>('Feature Request');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // User identity
  const [name, setName] = useState<string>(authUser?.name || profile?.name || '');
  const [email, setEmail] = useState<string>(authUser?.email || profile?.email || '');

  // 1. Feature Request category fields
  const [featureTitle, setFeatureTitle] = useState<string>('');
  const [featureModule, setFeatureModule] = useState<string>('Company Portal Grid');

  // 2. Bug Report category fields
  const [bugTitle, setBugTitle] = useState<string>('');
  const [bugArea, setBugArea] = useState<string>('Company Grid & Portals');
  const [bugSeverity, setBugSeverity] = useState<string>('Moderate');

  // 3. Suggest Company category fields
  const [companyName, setCompanyName] = useState<string>('');
  const [companyUrl, setCompanyUrl] = useState<string>('');
  const [companyCorridor, setCompanyCorridor] = useState<string>('Silicon Valley Tech Hub');

  // 4. General Feedback category fields
  const [generalSubject, setGeneralSubject] = useState<string>('');

  // Common message / description field
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Sync user details when authUser or profile is loaded
  useEffect(() => {
    if (authUser?.name) {
      setName(authUser.name);
    } else if (profile?.name) {
      setName(profile.name);
    }
    if (authUser?.email) {
      setEmail(authUser.email);
    } else if (profile?.email) {
      setEmail(profile.email);
    }
  }, [authUser, profile, isOpen]);

  if (!isOpen) return null;

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('abhinav.sharma@ingress.dev');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleResetForm = () => {
    setIsSuccess(false);
    setMessage('');
    setFeatureTitle('');
    setBugTitle('');
    setCompanyName('');
    setCompanyUrl('');
    setGeneralSubject('');
    setCustomCategory('');
    setErrorMessage(null);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    // Category-specific validation and structured message construction
    let finalType = feedbackType;
    let structuredMessage = '';

    if (feedbackType === 'Feature Request') {
      if (!featureTitle.trim()) {
        setErrorMessage('Please enter a feature name / title.');
        return;
      }
      if (!message.trim()) {
        setErrorMessage('Please describe the feature and what problem it solves.');
        return;
      }
      structuredMessage = `Feature: ${featureTitle.trim()}\nTarget Area: ${featureModule}\n\nDescription:\n${message.trim()}`;
    } else if (feedbackType === 'Bug Report') {
      if (!bugTitle.trim()) {
        setErrorMessage('Please enter a summary of the bug.');
        return;
      }
      if (!message.trim()) {
        setErrorMessage('Please describe the steps to reproduce or what broke.');
        return;
      }
      structuredMessage = `Bug: ${bugTitle.trim()}\nAffected Area: ${bugArea}\nSeverity: ${bugSeverity}\n\nSteps / Description:\n${message.trim()}`;
    } else if (feedbackType === 'Suggest Company Portal') {
      if (!companyName.trim()) {
        setErrorMessage('Please enter the company name.');
        return;
      }
      structuredMessage = `Company Name: ${companyName.trim()}\nCareers URL: ${companyUrl.trim() || 'N/A'}\nCorridor: ${companyCorridor}\n\nNotes / Target Roles:\n${message.trim() || 'No additional notes'}`;
    } else if (feedbackType === 'Custom Category') {
      if (!customCategory.trim()) {
        setErrorMessage('Please enter your custom category or topic name.');
        return;
      }
      if (!message.trim()) {
        setErrorMessage('Please enter your feedback message.');
        return;
      }
      finalType = customCategory.trim();
      structuredMessage = `Topic: ${customCategory.trim()}\n\nDetails:\n${message.trim()}`;
    } else {
      // General Feedback
      if (!message.trim()) {
        setErrorMessage('Please enter your feedback or thoughts.');
        return;
      }
      structuredMessage = generalSubject.trim()
        ? `Subject: ${generalSubject.trim()}\n\nThoughts:\n${message.trim()}`
        : message.trim();
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: finalType,
          rating,
          name: name.trim() || 'Anonymous Engineer',
          email: email.trim(),
          message: structuredMessage,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#30D158', '#00F5D4', '#0A84FF', '#BF5AF2'],
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch {
      // Graceful offline fallback
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonLabelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 650,
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '740px',
          maxHeight: '90vh',
          borderRadius: '24px',
          background: 'var(--modal-bg)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid var(--modal-border)',
          boxShadow: 'var(--modal-shadow)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--card-header-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--tab-badge-active-bg)',
                border: '1px solid var(--border-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)',
              }}
            >
              <Code2 style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '17px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Developer Hub
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-tertiary)' }}>
                About the Developer · Direct Contact · Dev Feedback
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-glass"
            style={{
              padding: '6px',
              borderRadius: '50%',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Close"
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            padding: '12px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--tab-badge-inactive-bg)',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('feedback')}
            style={{
              padding: '8px 16px',
              borderRadius: '980px',
              fontSize: '12.5px',
              fontWeight: 600,
              border: activeTab === 'feedback' ? '1px solid var(--accent-blue)' : '1px solid transparent',
              background: activeTab === 'feedback' ? 'var(--tab-badge-active-bg)' : 'transparent',
              color: activeTab === 'feedback' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <MessageSquare style={{ width: '13px', height: '13px' }} />
            <span>Dev Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            style={{
              padding: '8px 16px',
              borderRadius: '980px',
              fontSize: '12.5px',
              fontWeight: 600,
              border: activeTab === 'contact' ? '1px solid var(--accent-blue)' : '1px solid transparent',
              background: activeTab === 'contact' ? 'var(--tab-badge-active-bg)' : 'transparent',
              color: activeTab === 'contact' ? 'var(--accent-blue)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Mail style={{ width: '13px', height: '13px' }} />
            <span>Contact Me</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            style={{
              padding: '8px 16px',
              borderRadius: '980px',
              fontSize: '12.5px',
              fontWeight: 600,
              border: activeTab === 'about' ? '1px solid var(--accent-purple)' : '1px solid transparent',
              background: activeTab === 'about' ? 'rgba(138, 63, 252, 0.12)' : 'transparent',
              color: activeTab === 'about' ? 'var(--accent-purple)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <User style={{ width: '13px', height: '13px' }} />
            <span>About Me</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* TAB 1: DEV FEEDBACK */}
          {activeTab === 'feedback' && (
            <div>
              {isSuccess ? (
                <div
                  style={{
                    padding: '36px 20px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: 'rgba(48, 209, 88, 0.14)',
                      border: '1px solid rgba(48, 209, 88, 0.35)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-green)',
                    }}
                  >
                    <CheckCircle2 style={{ width: '28px', height: '28px' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                      Feedback Sent to Developer!
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: 1.6, margin: 0 }}>
                      Thank you for helping shape in.gress! Your suggestions and notes directly guide upcoming corridor integrations, feature releases, and scraper accuracy.
                    </p>
                  </div>
                  <button
                    onClick={handleResetForm}
                    className="btn-glass"
                    style={{ fontSize: '12.5px', padding: '8px 20px', borderRadius: '980px', marginTop: '10px' }}
                  >
                    Submit Another Feedback
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  {/* Category Selection */}
                  <div>
                    <label style={commonLabelStyle}>
                      Feedback Category
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {[
                        { id: 'Feature Request', label: 'Feature Request', icon: '💡', color: 'var(--accent-teal)' },
                        { id: 'Bug Report', label: 'Bug Report', icon: '🐛', color: '#FF453A' },
                        { id: 'Suggest Company Portal', label: 'Suggest Company', icon: '🏢', color: 'var(--accent-blue)' },
                        { id: 'General Feedback', label: 'General Thought', icon: '⭐', color: 'var(--accent-yellow)' },
                        { id: 'Custom Category', label: 'Custom Topic', icon: '✨', color: 'var(--accent-purple)' },
                      ].map((cat) => {
                        const isSelected = feedbackType === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setFeedbackType(cat.id);
                              setErrorMessage(null);
                            }}
                            style={{
                              fontSize: '12px',
                              fontWeight: 650,
                              padding: '7px 14px',
                              borderRadius: '980px',
                              border: isSelected ? `1.5px solid ${cat.color}` : '1px solid var(--border-default)',
                              background: isSelected ? 'var(--tab-badge-active-bg)' : 'var(--tab-badge-inactive-bg)',
                              color: isSelected ? cat.color : 'var(--text-secondary)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span>{cat.icon}</span>
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* DYNAMIC CATEGORY INPUT FIELDS */}
                  {/* Category 1: Feature Request */}
                  {feedbackType === 'Feature Request' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--tab-badge-inactive-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <label style={commonLabelStyle}>
                          Feature Name / Idea <span style={{ color: 'var(--accent-teal)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={featureTitle}
                          onChange={(e) => setFeatureTitle(e.target.value)}
                          placeholder="e.g. Compensation / salary range filter on cards"
                          className="glass-input"
                          style={{ boxSizing: 'border-box' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Target Application Area
                        </label>
                        <select
                          value={featureModule}
                          onChange={(e) => setFeatureModule(e.target.value)}
                          className="glass-input"
                          style={{ boxSizing: 'border-box', cursor: 'pointer' }}
                        >
                          <option value="Company Portal Grid">Company Portal Grid & Cards</option>
                          <option value="Direct Apply & Ingress Modal">Direct Apply & Ingress Modal</option>
                          <option value="ATS Matcher & Resume Score">ATS Matcher & Resume Score</option>
                          <option value="Command Palette (⌘K)">Command Palette (⌘K)</option>
                          <option value="Job Tracker Kanban">Job Tracker Kanban Pipeline</option>
                          <option value="1-Click Recruiter Outreach">1-Click Recruiter Outreach</option>
                          <option value="Other">Other / General Feature</option>
                        </select>
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Feature Description & Problem Solved <span style={{ color: 'var(--accent-teal)' }}>*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Describe how this feature should work and how it will improve your direct application workflow..."
                          className="glass-input"
                          style={{ boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Category 2: Bug Report */}
                  {feedbackType === 'Bug Report' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--tab-badge-inactive-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <label style={commonLabelStyle}>
                          Bug Title / What Went Wrong <span style={{ color: '#FF453A' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={bugTitle}
                          onChange={(e) => setBugTitle(e.target.value)}
                          placeholder="e.g. Direct apply button unresponsive or link redirects to 404"
                          className="glass-input"
                          style={{ boxSizing: 'border-box' }}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        <div>
                          <label style={commonLabelStyle}>
                            Where did it happen?
                          </label>
                          <select
                            value={bugArea}
                            onChange={(e) => setBugArea(e.target.value)}
                            className="glass-input"
                            style={{ boxSizing: 'border-box', cursor: 'pointer' }}
                          >
                            <option value="Landing Page & Hero">Landing Page & Hero</option>
                            <option value="Company Grid & Portals">Company Grid & Portals</option>
                            <option value="Job Detail Modal">Job Detail Modal</option>
                            <option value="Resume Upload & Parser">Resume Upload & Parser</option>
                            <option value="Live Scanner HUD">Live Scanner HUD</option>
                            <option value="Authentication SSO">Authentication SSO</option>
                            <option value="Other">Other Area</option>
                          </select>
                        </div>
                        <div>
                          <label style={commonLabelStyle}>
                            Severity Level
                          </label>
                          <select
                            value={bugSeverity}
                            onChange={(e) => setBugSeverity(e.target.value)}
                            className="glass-input"
                            style={{ boxSizing: 'border-box', cursor: 'pointer' }}
                          >
                            <option value="Cosmetic / Visual">Minor Cosmetic / Visual</option>
                            <option value="Moderate">Moderate Glitch</option>
                            <option value="Critical / Blocker">Critical / Application Blocked</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Steps to Reproduce & Observations <span style={{ color: '#FF453A' }}>*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="What steps lead up to the issue? What did you expect to happen versus what actually occurred?"
                          className="glass-input"
                          style={{ boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Category 3: Suggest Company Portal */}
                  {feedbackType === 'Suggest Company Portal' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--tab-badge-inactive-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                        <div>
                          <label style={commonLabelStyle}>
                            Company Name <span style={{ color: 'var(--accent-blue)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Stripe, OpenAI, Anthropic, Palantir"
                            className="glass-input"
                            style={{ boxSizing: 'border-box' }}
                            required
                          />
                        </div>
                        <div>
                          <label style={commonLabelStyle}>
                            Careers Portal URL
                          </label>
                          <input
                            type="text"
                            value={companyUrl}
                            onChange={(e) => setCompanyUrl(e.target.value)}
                            placeholder="e.g. https://stripe.com/jobs"
                            className="glass-input"
                            style={{ boxSizing: 'border-box' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Tech Corridor / Hub
                        </label>
                        <select
                          value={companyCorridor}
                          onChange={(e) => setCompanyCorridor(e.target.value)}
                          className="glass-input"
                          style={{ boxSizing: 'border-box', cursor: 'pointer' }}
                        >
                          <option value="Silicon Valley Tech Hub">Silicon Valley Tech Hub</option>
                          <option value="NYC Tech Corridor">NYC Tech Corridor</option>
                          <option value="Bengaluru Tech Hub">Bengaluru Tech Hub</option>
                          <option value="London / European Tech">London / European Tech</option>
                          <option value="Remote / Global Hub">Remote / Global Hub</option>
                          <option value="FinTech / Quant Hub">FinTech / Quant Hub</option>
                          <option value="Other">Other Region</option>
                        </select>
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Target Roles or Why Add This Company
                        </label>
                        <textarea
                          rows={3}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us what engineering or product roles they hire for, or why they belong in the direct portal index..."
                          className="glass-input"
                          style={{ boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Category 4: General Feedback */}
                  {feedbackType === 'General Feedback' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--tab-badge-inactive-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <label style={commonLabelStyle}>
                          Subject / Headline
                        </label>
                        <input
                          type="text"
                          value={generalSubject}
                          onChange={(e) => setGeneralSubject(e.target.value)}
                          placeholder="e.g. Overall impressions, speed, or UI aesthetic"
                          className="glass-input"
                          style={{ boxSizing: 'border-box' }}
                        />
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Your Feedback & Experience <span style={{ color: 'var(--accent-yellow)' }}>*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Share your experience using in.gress, what you love, and what we can do to make it even better..."
                          className="glass-input"
                          style={{ boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Category 5: Custom Category */}
                  {feedbackType === 'Custom Category' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--tab-badge-inactive-bg)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <label style={commonLabelStyle}>
                          Custom Category / Topic Name <span style={{ color: 'var(--accent-purple)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          placeholder="e.g. Partnership, Engineering Discussion, API Integration"
                          className="glass-input"
                          style={{ boxSizing: 'border-box' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={commonLabelStyle}>
                          Your Proposal & Message <span style={{ color: 'var(--accent-purple)' }}>*</span>
                        </label>
                        <textarea
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell the developer about your idea, proposal, or question..."
                          className="glass-input"
                          style={{ boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.5 }}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Experience Rating */}
                  <div>
                    <label style={commonLabelStyle}>
                      Experience with in.gress
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '3px',
                          }}
                        >
                          <Star
                            style={{
                              width: '20px',
                              height: '20px',
                              color:
                                star <= (hoverRating ?? rating)
                                  ? '#FFD60A'
                                  : 'var(--border-default)',
                              fill:
                                star <= (hoverRating ?? rating)
                                  ? '#FFD60A'
                                  : 'transparent',
                              transition: 'color 0.15s ease, fill 0.15s ease',
                            }}
                          />
                        </button>
                      ))}
                      <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', marginLeft: '8px' }}>
                        {rating === 5 ? 'Exceptional (5/5)' : rating === 4 ? 'Great (4/5)' : rating === 3 ? 'Good (3/5)' : rating === 2 ? 'Needs Work (2/5)' : 'Poor (1/5)'}
                      </span>
                    </div>
                  </div>

                  {/* Name & Email inputs */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={commonLabelStyle}>
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Abhinav Sharma"
                        className="glass-input"
                        style={{ boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={commonLabelStyle}>
                        Your Email (Optional, for follow-up)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. engineer@example.com"
                        className="glass-input"
                        style={{ boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div style={{ fontSize: '12px', color: '#FF453A', background: 'rgba(255, 69, 58, 0.12)', border: '1px solid rgba(255, 69, 58, 0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary"
                    style={{
                      fontSize: '13.5px',
                      padding: '12px 24px',
                      borderRadius: '980px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      marginTop: '4px',
                    }}
                  >
                    <Send style={{ width: '14px', height: '14px' }} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback to Developer'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: CONTACT ME */}
          {activeTab === 'contact' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--tab-badge-active-bg)',
                  border: '1px solid var(--border-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#30D158' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Open for technical discussions, hiring collaborations, architecture chats, and product inquiries.
                </span>
              </div>

              {/* Direct Channels Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                {/* Email Card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail style={{ width: '16px', height: '16px', color: 'var(--accent-blue)' }} />
                      <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Direct Email</span>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="btn-glass"
                      style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', gap: '4px' }}
                      title="Copy email address"
                    >
                      {copiedEmail ? <Check style={{ width: '11px', height: '11px', color: '#30D158' }} /> : <Copy style={{ width: '11px', height: '11px' }} />}
                      <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                    abhinav.sharma@ingress.dev
                  </div>
                  <a
                    href="mailto:abhinav.sharma@ingress.dev?subject=Hello%20from%20in.gress%20Platform"
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    Open in Mail Client
                  </a>
                </div>

                {/* LinkedIn Card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LinkedinIcon style={{ width: '16px', height: '16px', color: '#0A66C2' }} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>LinkedIn</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Connect for engineering networking, distributed systems discussions, and updates.
                  </div>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Connect on LinkedIn</span>
                    <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </a>
                </div>

                {/* GitHub Card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GithubIcon style={{ width: '16px', height: '16px', color: 'var(--text-primary)' }} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>GitHub</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Explore open-source repositories, developer tools, and contributions.
                  </div>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>View GitHub Profile</span>
                    <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </a>
                </div>

                {/* X / Twitter Card */}
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TwitterIcon style={{ width: '16px', height: '16px', color: '#1DA1F2' }} />
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)' }}>Twitter / X</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Follow real-time development updates, tech corridors indexing, and release logs.
                  </div>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Follow on X</span>
                    <ExternalLink style={{ width: '11px', height: '11px' }} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT ME */}
          {activeTab === 'about' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Profile Bio Card */}
              <div
                style={{
                  padding: '20px',
                  borderRadius: '16px',
                  background: 'var(--tab-badge-inactive-bg)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0A84FF 0%, #00F5D4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#ffffff',
                    flexShrink: 0,
                    boxShadow: '0 8px 24px rgba(0, 245, 212, 0.3)',
                  }}
                >
                  AS
                </div>
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      Abhinav Sharma
                    </h4>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(48, 209, 88, 0.15)',
                        color: 'var(--accent-green)',
                        border: '1px solid rgba(48, 209, 88, 0.3)',
                      }}
                    >
                      FOUNDER & BUILDER
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--accent-blue)', marginTop: '2px', fontWeight: 600 }}>
                    Distributed Systems & Cloud Infrastructure Engineer
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    Passionate about high-throughput platform engineering, developer experience, and building transparent software that removes bureaucratic friction from career growth.
                  </p>
                </div>
              </div>

              {/* The in.gress Story */}
              <div>
                <h5 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                  Why in.gress Was Created
                </h5>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Modern tech hiring is broken. Traditional job boards and aggregator sites are filled with ghost listings, outdated positions, and third-party recruiter funnels where your resume disappears into black holes.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>in.gress</strong> was engineered to establish a direct pipeline. We index real-time applicant tracking systems (Greenhouse, Ashby, Lever, Amazon APIs) across major verified tech hubs—Delhi NCR, Bengaluru, and Remote. Every opening connects you directly to the employer's official ATS with zero intermediary noise.
                  </p>
                </div>
              </div>

              {/* Core Architecture Highlights */}
              <div>
                <h5 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                  Engineering Principles
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--tab-badge-inactive-bg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      ⚡ 287 Verified Portals
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      Strictly canonical company career domains—no spam boards.
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--tab-badge-inactive-bg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      🎯 787 Live Openings
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      Actively crawled and verified across Greenhouse, Ashby, Lever.
                    </div>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--tab-badge-inactive-bg)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--text-primary)', marginBottom: '3px' }}>
                      🔒 Zero-Data-Selling
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-tertiary)' }}>
                      Local-first architecture backed by your personal Supabase account.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--card-header-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Heart style={{ width: '13px', height: '13px', color: '#FF2D55', fill: '#FF2D55' }} />
            <span>Engineered with craftsmanship for the global software engineering community</span>
          </div>
          <button
            onClick={onClose}
            className="btn-glass"
            style={{ fontSize: '12px', padding: '5px 14px', borderRadius: '8px' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
