import React, { useState } from 'react';
import {
  Lock,
  Bell,
  Check,
  Sparkles,
  ArrowRight,
  Building2,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GlitchText } from './GlitchText';

interface DeliverableItem {
  title: string;
  desc: string;
  tag: string;
}

interface LockedFeatureSectionProps {
  featureId: 'roadmap' | 'resources';
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  deliverables: DeliverableItem[];
  onSwitchTab: (tab: 'companies' | 'ats-scanner') => void;
  children?: React.ReactNode;
}

export const LockedFeatureSection: React.FC<LockedFeatureSectionProps> = ({
  featureId,
  title,
  tagline,
  description,
  accentColor,
  deliverables,
  onSwitchTab,
  children,
}) => {
  const storageKey = `nexus_v1_notify_${featureId}`;
  const [isNotified, setIsNotified] = useState<boolean>(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  const handleNotifyToggle = () => {
    const nextState = !isNotified;
    setIsNotified(nextState);
    localStorage.setItem(storageKey, String(nextState));

    if (nextState) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: [accentColor, '#30D158', '#00F0FF', '#ffffff'],
      });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '620px', overflow: 'hidden' }}>
      {/* Blurred Non-interactive Background Preview */}
      {children && (
        <div
          aria-hidden="true"
          style={{
            filter: 'blur(12px) saturate(0.65) brightness(0.7)',
            opacity: 0.22,
            pointerEvents: 'none',
            userSelect: 'none',
            maxHeight: '720px',
            overflow: 'hidden',
            transform: 'scale(0.98)',
            transformOrigin: 'top center',
            transition: 'all 0.3s ease',
          }}
        >
          {children}
        </div>
      )}

      {/* Floating Center Lock Modal Container */}
      <div
        style={{
          position: children ? 'absolute' : 'relative',
          inset: children ? 0 : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          zIndex: 10,
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: '660px',
            width: '100%',
            padding: '36px 36px',
            borderRadius: '24px',
            background: 'linear-gradient(145deg, rgba(16, 17, 24, 0.94), rgba(9, 10, 15, 0.98))',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: `0 24px 70px rgba(0, 0, 0, 0.75), 0 0 40px ${accentColor}18, inset 0 1px 0 rgba(255, 255, 255, 0.12)`,
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            animation: 'fadeIn 0.25s ease-out',
          }}
        >
          {/* Neon Icon Hexagon with Pulse */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)`,
              border: `1.5px solid ${accentColor}50`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '18px',
              boxShadow: `0 8px 24px ${accentColor}30`,
              position: 'relative',
            }}
          >
            <Lock style={{ width: '28px', height: '28px', color: accentColor }} />
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
          </div>

          {/* Capsule Badge */}
          <div style={{ marginBottom: '12px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: accentColor,
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}40`,
                padding: '4px 14px',
                borderRadius: '980px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 2px 10px ${accentColor}15`,
              }}
            >
              <Lock style={{ width: '11px', height: '11px' }} />
              <span>COMING SOON V1</span>
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              margin: '0 0 6px 0',
              fontSize: '26px',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
            }}
          >
            <GlitchText text={title} trigger={featureId} duration={260} />
          </h2>

          {/* Tagline */}
          <p
            style={{
              margin: '0 0 14px 0',
              fontSize: '14.5px',
              fontWeight: 650,
              color: accentColor,
            }}
          >
            <GlitchText text={tagline} trigger={featureId} duration={260} />
          </p>

          {/* Description */}
          <p
            style={{
              margin: '0 0 24px 0',
              fontSize: '13px',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '540px',
            }}
          >
            {description}
          </p>

          {/* 3 Deliverables Teaser Grid */}
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px',
              marginBottom: '26px',
              textAlign: 'left',
            }}
          >
            {deliverables.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: accentColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.tag}
                  </span>
                  <Zap style={{ width: '10px', height: '10px', color: accentColor, opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', lineHeight: 1.45 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {/* Notify Me Toggle */}
            <button
              onClick={handleNotifyToggle}
              style={{
                fontSize: '13px',
                fontWeight: 700,
                padding: '10px 22px',
                borderRadius: '980px',
                cursor: 'pointer',
                border: isNotified ? '1px solid rgba(48, 209, 88, 0.5)' : `1px solid ${accentColor}`,
                background: isNotified ? 'rgba(48, 209, 88, 0.16)' : accentColor,
                color: isNotified ? '#30D158' : '#000000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isNotified ? '0 4px 16px rgba(48, 209, 88, 0.25)' : `0 4px 20px ${accentColor}40`,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {isNotified ? (
                <>
                  <Check style={{ width: '15px', height: '15px' }} />
                  <span>Subscribed to v1 Unlock Alert</span>
                </>
              ) : (
                <>
                  <Bell style={{ width: '15px', height: '15px' }} />
                  <span>Notify Me for v1 Launch</span>
                </>
              )}
            </button>

            {/* Quick Switch Button */}
            <button
              onClick={() => onSwitchTab('companies')}
              className="btn-glass"
              style={{
                fontSize: '13px',
                fontWeight: 650,
                padding: '10px 18px',
                borderRadius: '980px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Building2 style={{ width: '14px', height: '14px', color: 'var(--accent-blue)' }} />
              <span>Browse Active Portals</span>
              <ArrowRight style={{ width: '12px', height: '12px', opacity: 0.7 }} />
            </button>
          </div>

          {/* Bottom Security / Status Footer */}
          <div
            style={{
              marginTop: '18px',
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <Sparkles style={{ width: '11px', height: '11px', color: accentColor }} />
            <span>Target Release: Nexus v1.0 Ingress · Zero filler content guarantee</span>
          </div>
        </div>
      </div>
    </div>
  );
};
