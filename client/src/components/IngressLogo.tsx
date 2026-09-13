import React from 'react';

interface IngressLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const IngressIcon: React.FC<{ size?: number; glow?: boolean }> = ({
  size = 30,
  glow = true,
}) => {
  const id = React.useId().replace(/:/g, '');
  const gradLeft = `ing-left-${id}`;
  const gradRight = `ing-right-${id}`;
  const gradConduit = `ing-conduit-${id}`;
  const gradBg = `ing-bg-${id}`;
  const gradGlow = `ing-glow-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        flexShrink: 0,
        filter: glow ? 'drop-shadow(0 2px 10px rgba(0, 199, 190, 0.28))' : 'none',
        transition: 'transform 0.2s ease, filter 0.2s ease',
      }}
    >
      <defs>
        {/* Rich obsidian glass app tile base */}
        <linearGradient id={gradBg} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#131722" />
          <stop offset="100%" stopColor="#080A10" />
        </linearGradient>

        {/* Ambient cyan illumination */}
        <radialGradient id={gradGlow} cx="16" cy="16" r="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00C7BE" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#00C7BE" stopOpacity="0" />
        </radialGradient>

        {/* Left Gateway Pillar: Vibrant Mint to Cyan-Blue */}
        <linearGradient id={gradLeft} x1="7" y1="7" x2="11.5" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F5D4" />
          <stop offset="100%" stopColor="#0077ED" />
        </linearGradient>

        {/* Right Gateway Pillar: Precision Blue to Indigo */}
        <linearGradient id={gradRight} x1="20.5" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0A84FF" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        {/* Center Ingress Vector Conduit */}
        <linearGradient id={gradConduit} x1="13.5" y1="11.5" x2="18" y2="20.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#00F5D4" />
        </linearGradient>
      </defs>

      {/* Apple-grade glass app tile */}
      <rect
        width="32"
        height="32"
        rx="8.5"
        fill={`url(#${gradBg})`}
        stroke="rgba(255, 255, 255, 0.12)"
        strokeWidth="1"
      />
      <rect width="32" height="32" rx="8.5" fill={`url(#${gradGlow})`} />

      {/* Ingress Gateway Pillars: An open architectural portal with direct throughway */}
      <rect x="7" y="7.5" width="4.5" height="17" rx="2.25" fill={`url(#${gradLeft})`} />
      <rect x="20.5" y="7.5" width="4.5" height="17" rx="2.25" fill={`url(#${gradRight})`} />

      {/* Ingress Throughput Conduit */}
      <path
        d="M13.5 11.5L18 16L13.5 20.5"
        stroke={`url(#${gradConduit})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const IngressLogo: React.FC<IngressLogoProps> = ({
  size = 'md',
  className = '',
  onClick,
}) => {
  const iconSize = size === 'hero' ? 56 : size === 'lg' ? 36 : size === 'md' ? 30 : 22;
  const titleSize = size === 'hero' ? '32px' : size === 'lg' ? '21px' : size === 'md' ? '18px' : '15px';

  return (
    <div
      onClick={onClick}
      className={`ingress-brand-lockup ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size === 'hero' ? '14px' : '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <IngressIcon size={iconSize} glow={true} />

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif)',
            fontWeight: 750,
            fontSize: titleSize,
            letterSpacing: '-0.035em',
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            paddingBottom: '3px',
            display: 'inline-block',
          }}
        >
          in<span style={{ color: '#00F5D4', textShadow: '0 0 10px rgba(0, 245, 212, 0.6)', margin: '0 0.5px' }}>.</span>gress
        </span>
      </div>
    </div>
  );
};
