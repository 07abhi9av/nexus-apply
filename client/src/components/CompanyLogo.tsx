import React, { useState, useEffect } from 'react';

interface CompanyLogoProps {
  company: string;
  logoUrl?: string;
  domain?: string;
  size?: number;
  iconSize?: number;
}

const GRADIENTS = [
  'linear-gradient(135deg, #0A84FF 0%, #0055FF 100%)',
  'linear-gradient(135deg, #30D158 0%, #109E38 100%)',
  'linear-gradient(135deg, #BF5AF2 0%, #8E2DE2 100%)',
  'linear-gradient(135deg, #FF9F0A 0%, #FF453A 100%)',
  'linear-gradient(135deg, #64D2FF 0%, #0A84FF 100%)',
  'linear-gradient(135deg, #FF375F 0%, #FF2D55 100%)',
  'linear-gradient(135deg, #5E5CE6 0%, #3634A3 100%)',
  'linear-gradient(135deg, #FFD60A 0%, #FF9F0A 100%)',
  'linear-gradient(135deg, #2ED8A3 0%, #11998E 100%)',
  'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
];

function getCompanyGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function getCompanyInitials(name: string): string {
  const clean = name.replace(/\([^)]*\)/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  logoUrl,
  domain,
  size = 38,
}) => {
  const [sourceIdx, setSourceIdx] = useState(0);

  // Clean domain resolution to fetch the authentic company logo
  const baseName = company
    .replace(/\s*\((broadcom|india|kos media)\)/gi, '')
    .replace(/\s+(india|idc|development centre|development center|technologies|technology|tech|labs|inc|corporation|group|llc|ltd|co|hyderabad|bangalore|bengaluru|gurugram|noida|delhi|mumbai|pune)\b/gi, '')
    .trim();

  const cleanDomain = domain
    ? domain.replace(/^https?:\/\//, '').split('/')[0].toLowerCase()
    : `${baseName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  // Reset fallback index when inputs change
  useEffect(() => {
    setSourceIdx(0);
  }, [company, logoUrl, domain]);

  // Real official brand logo sources fetched from live authoritative brand registries
  const sources: string[] = [];

  // 1. Direct URL passed if valid and not brandfetch (which blocks direct hotlinking)
  if (logoUrl && logoUrl.startsWith('http') && !logoUrl.includes('brandfetch')) {
    sources.push(logoUrl);
  }

  // 2. Google S2 Favicon API (128px high-density asset — authentic official brand icon)
  const s2Url = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
  if (!sources.includes(s2Url)) {
    sources.push(s2Url);
  }

  // 3. Google gstatic high-res social favicon endpoint
  const gstaticUrl = `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${cleanDomain}&size=128`;
  if (!sources.includes(gstaticUrl)) {
    sources.push(gstaticUrl);
  }

  // 4. DuckDuckGo Icon
  sources.push(`https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`);

  // 5. IconHorse brand crawler
  sources.push(`https://icon.horse/icon/${cleanDomain}`);

  const currentSrc = sourceIdx < sources.length ? sources[sourceIdx] : null;

  const handleImgError = () => {
    setSourceIdx((prev) => prev + 1);
  };

  const initials = getCompanyInitials(company);
  const gradient = getCompanyGradient(company);
  const borderRadius = Math.round(size * 0.22);

  if (!currentSrc) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: `${borderRadius}px`,
          background: gradient,
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: `${Math.round(size * 0.38)}px`,
          color: '#ffffff',
          letterSpacing: '-0.02em',
          boxShadow: 'var(--logo-shadow)',
        }}
        title={company}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${borderRadius}px`,
        background: 'var(--logo-container-bg)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative',
        padding: '3px',
        overflow: 'hidden',
        boxShadow: 'var(--logo-shadow)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
      }}
      title={`${company} (${cleanDomain})`}
    >
      <img
        key={currentSrc}
        src={currentSrc}
        alt={`${company} logo`}
        onError={handleImgError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          borderRadius: `${Math.max(2, borderRadius - 3)}px`,
          display: 'block',
        }}
        loading="lazy"
      />
    </div>
  );
};
