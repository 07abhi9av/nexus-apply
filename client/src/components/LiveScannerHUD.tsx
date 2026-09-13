import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  Layers,
  X,
} from 'lucide-react';

export interface SyncStats {
  totalRoles: number;
  totalCompanies: number;
  sourcesScraped: number;
  timestamp: string;
}

interface LiveScannerHUDProps {
  isScanning: boolean;
  lastSyncStats: SyncStats | null;
  onFilterLiveOnly?: () => void;
  onExpandAllLive?: () => void;
  isLiveOnlyActive?: boolean;
  onClose?: () => void;
}

const ATS_CHANNELS = [
  {
    name: 'Greenhouse ATS',
    companies: ['Stripe', 'Databricks', 'Figma', 'Brex', 'Coinbase', 'Reddit'],
    color: '#30D158',
    bg: 'rgba(48, 209, 88, 0.12)',
    border: 'rgba(48, 209, 88, 0.3)',
  },
  {
    name: 'Ashby HQ',
    companies: ['Linear', 'Retool', 'Ramp', 'Vercel', 'Notion', 'Loom'],
    color: '#BF5AF2',
    bg: 'rgba(191, 90, 242, 0.12)',
    border: 'rgba(191, 90, 242, 0.3)',
  },
  {
    name: 'Lever Direct',
    companies: ['Netflix', 'Postman', 'Atlassian', 'Miro', 'Hotstar'],
    color: '#0A84FF',
    bg: 'rgba(10, 132, 255, 0.12)',
    border: 'rgba(10, 132, 255, 0.3)',
  },
  {
    name: 'Amazon & Big Tech',
    companies: ['Amazon India', 'AWS Infrastructure', 'Google', 'Microsoft'],
    color: '#FF9F0A',
    bg: 'rgba(255, 159, 10, 0.12)',
    border: 'rgba(255, 159, 10, 0.3)',
  },
];

export const LiveScannerHUD: React.FC<LiveScannerHUDProps> = ({
  isScanning,
  lastSyncStats,
  onFilterLiveOnly,
  onExpandAllLive,
  isLiveOnlyActive,
  onClose,
}) => {
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);
  const [scanProgress, setScanProgress] = useState(15);
  const [detectedCount, setDetectedCount] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  // Animate multi-channel crawling simulation during isScanning
  useEffect(() => {
    if (!isScanning) {
      setScanProgress(100);
      if (lastSyncStats) {
        setDetectedCount(lastSyncStats.totalRoles);
      }
      return;
    }

    setIsDismissed(false);
    setScanProgress(10);
    setDetectedCount(42);

    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 15) + 5;
      });
      setDetectedCount((prev) => {
        const target = lastSyncStats?.totalRoles || 787;
        if (prev >= target) return target;
        return Math.min(target, prev + Math.floor(Math.random() * 80) + 30);
      });
    }, 280);

    const channelInterval = setInterval(() => {
      setActiveChannelIndex((prev) => (prev + 1) % ATS_CHANNELS.length);
    }, 450);

    return () => {
      clearInterval(progressInterval);
      clearInterval(channelInterval);
    };
  }, [isScanning, lastSyncStats]);

  if (isDismissed) return null;

  const currentChannel = ATS_CHANNELS[activeChannelIndex];
  const displayRolesCount = isScanning ? detectedCount : (lastSyncStats?.totalRoles || 787);
  const displayCompaniesCount = lastSyncStats?.totalCompanies || 287;

  return (
    <div
      style={{
        margin: '0 0 16px 0',
        borderRadius: '16px',
        background: isScanning
          ? 'linear-gradient(135deg, rgba(8, 28, 20, 0.85) 0%, rgba(13, 20, 36, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(16, 36, 26, 0.7) 0%, rgba(14, 22, 38, 0.75) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isScanning
          ? '1px solid rgba(48, 209, 88, 0.5)'
          : '1px solid rgba(48, 209, 88, 0.25)',
        boxShadow: isScanning
          ? '0 8px 32px rgba(48, 209, 88, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          : '0 6px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        padding: '16px 20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Laser Scanning Line (Active when scanning) */}
      {isScanning && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #30D158, #00C7BE, #0A84FF, transparent)',
            animation: 'laserScan 2s linear infinite',
          }}
        />
      )}

      {/* Main HUD Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Left Side: Status & Channel Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 340px' }}>
          {/* Radar / Status Icon */}
          <div
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: isScanning ? 'rgba(48, 209, 88, 0.18)' : 'rgba(48, 209, 88, 0.12)',
              border: `1px solid ${isScanning ? 'rgba(48, 209, 88, 0.4)' : 'rgba(48, 209, 88, 0.25)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {isScanning ? (
              <>
                <span
                  style={{
                    position: 'absolute',
                    inset: '-4px',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(48, 209, 88, 0.4)',
                    animation: 'ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
                <Zap
                  style={{
                    width: '20px',
                    height: '20px',
                    color: '#30D158',
                    animation: 'pulse 1s ease-in-out infinite',
                  }}
                />
              </>
            ) : (
              <CheckCircle2 style={{ width: '22px', height: '22px', color: '#30D158' }} />
            )}
          </div>

          {/* Info Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                }}
              >
                {isScanning ? 'Active Live Role Radar' : 'Live Roles Synchronized'}
              </span>

              {isScanning ? (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '980px',
                    background: currentChannel.bg,
                    color: currentChannel.color,
                    border: `1px solid ${currentChannel.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: currentChannel.color,
                    }}
                  />
                  Indexing {currentChannel.name}
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    padding: '2px 8px',
                    borderRadius: '980px',
                    background: 'rgba(48, 209, 88, 0.15)',
                    color: 'var(--accent-green)',
                    border: '1px solid rgba(48, 209, 88, 0.35)',
                  }}
                >
                  {displayRolesCount} Live Roles Active
                </span>
              )}
            </div>

            <div
              style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              {isScanning ? (
                <span>
                  Crawling verified career APIs for {currentChannel.companies.slice(0, 3).join(', ')}...
                </span>
              ) : (
                <span>
                  Direct ATS career feeds crawled across {displayCompaniesCount} tech portals · Zero third-party recruiter noise
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Quick Action Pills & Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onFilterLiveOnly && (
            <button
              onClick={onFilterLiveOnly}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '8px',
                background: isLiveOnlyActive
                  ? 'linear-gradient(135deg, #30D158 0%, #00C7BE 100%)'
                  : 'rgba(48, 209, 88, 0.12)',
                color: isLiveOnlyActive ? '#000000' : 'var(--accent-green)',
                border: isLiveOnlyActive
                  ? '1px solid transparent'
                  : '1px solid rgba(48, 209, 88, 0.35)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isLiveOnlyActive
                  ? '0 2px 10px rgba(48, 209, 88, 0.3)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
              title="Toggle to view only companies with verified live openings"
            >
              <Zap style={{ width: '13px', height: '13px' }} />
              <span>{isLiveOnlyActive ? 'Showing Live Only' : `Filter Live (${displayRolesCount})`}</span>
            </button>
          )}

          {onExpandAllLive && (
            <button
              onClick={onExpandAllLive}
              className="btn-glass"
              style={{
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                borderColor: 'var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Expand or collapse all live role accordions"
            >
              <Layers style={{ width: '13px', height: '13px' }} />
              <span>Expand All Openings</span>
            </button>
          )}

          {onClose && !isScanning && (
            <button
              onClick={() => {
                setIsDismissed(true);
                onClose();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
              }}
              title="Dismiss HUD"
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          )}
        </div>
      </div>

      {/* Progress Track (Only shown when scanning) */}
      {isScanning && (
        <div style={{ marginTop: '12px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              marginBottom: '5px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span>Scanning 287 Verified Portals ({scanProgress}%)</span>
            <span style={{ color: '#30D158' }}>{detectedCount} Roles Detected</span>
          </div>
          <div
            style={{
              height: '4px',
              width: '100%',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${scanProgress}%`,
                background: 'linear-gradient(90deg, #30D158 0%, #00C7BE 50%, #0A84FF 100%)',
                boxShadow: '0 0 12px rgba(48, 209, 88, 0.8)',
                transition: 'width 0.25s ease-out',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
