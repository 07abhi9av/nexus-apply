import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Building2,
  Compass,
  ShieldCheck,
  BookOpen,
  User,
  Sun,
  Moon,
  Upload,
  ArrowRight,
  MapPin,
  Globe,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { JobOpportunity } from '../types';
import { searchAndRankJobs } from '../utils/companySearch';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: JobOpportunity[];
  onSelectJob: (job: JobOpportunity) => void;
  onSelectTab: (tab: 'companies' | 'roadmap' | 'ats-scanner' | 'resources') => void;
  onOpenProfile: () => void;
  onOpenUploadModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onSelectHub?: (hub: 'all' | 'delhi-ncr' | 'bengaluru' | 'remote' | 'hyderabad' | 'pune' | 'mumbai' | 'gift-city' | 'chennai') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  jobs,
  onSelectJob,
  onSelectTab,
  onOpenProfile,
  onOpenUploadModal,
  theme,
  onToggleTheme,
  onSelectHub,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable items list
  const navItems = [
    {
      id: 'tab-companies',
      type: 'Navigation',
      title: 'Companies & Direct Portals',
      desc: `${jobs.length} verified tier-1 career portals`,
      icon: <Building2 style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />,
      action: () => { onSelectTab('companies'); onClose(); },
    },
    {
      id: 'tab-ats',
      type: 'Navigation',
      title: 'AI ATS Resume Scanner & Optimizer',
      desc: '6-pillar algorithm & Google X-Y-Z bullet rewrites',
      icon: <ShieldCheck style={{ width: '15px', height: '15px', color: 'var(--accent-green)' }} />,
      action: () => { onSelectTab('ats-scanner'); onClose(); },
    },
    {
      id: 'tab-roadmap',
      type: 'Navigation',
      title: 'DevOps, SRE & DSA Roadmap (Coming Soon v1)',
      desc: 'Tier-1 tech prep milestones and interview guides (Locked for v1)',
      icon: <Compass style={{ width: '15px', height: '15px', color: 'var(--accent-purple)' }} />,
      action: () => { onSelectTab('roadmap'); onClose(); },
    },
    {
      id: 'tab-resources',
      type: 'Navigation',
      title: 'Career Sheets & Referral Resources (Coming Soon v1)',
      desc: 'Recruiter lists, system design notes, and cheatsheets (Locked for v1)',
      icon: <BookOpen style={{ width: '15px', height: '15px', color: 'var(--accent-amber)' }} />,
      action: () => { onSelectTab('resources'); onClose(); },
    },
  ];

  const hubItems = [
    {
      id: 'hub-all',
      type: 'Tech Corridor',
      title: 'All Tech Corridors',
      desc: `Unified pipeline of all ${jobs.length} verified companies across hubs`,
      icon: <Layers style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('all'); onClose(); },
    },
    {
      id: 'hub-ncr',
      type: 'Tech Corridor',
      title: 'Delhi NCR Tech Corridor',
      desc: 'Gurugram, Noida & New Delhi powerhouses (53 companies)',
      icon: <MapPin style={{ width: '15px', height: '15px', color: '#FF375F' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('delhi-ncr'); onClose(); },
    },
    {
      id: 'hub-blr',
      type: 'Tech Corridor',
      title: 'Bengaluru Silicon Corridor',
      desc: 'Outer Ring Rd, Bellandur, Koramangala & Whitefield (67 companies)',
      icon: <Compass style={{ width: '15px', height: '15px', color: '#30D158' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('bengaluru'); onClose(); },
    },
    {
      id: 'hub-remote',
      type: 'Tech Corridor',
      title: 'Remote & Distributed Pipeline',
      desc: 'Worldwide & India remote-first innovators (167 companies)',
      icon: <Globe style={{ width: '15px', height: '15px', color: '#BF5AF2' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('remote'); onClose(); },
    },
    {
      id: 'hub-hyd',
      type: 'Upcoming Corridor',
      title: 'Hyderabad Tech Corridor (HITEC City)',
      desc: 'Coming Soon · Microsoft IDC, Google, Qualcomm, Apple',
      icon: <Sparkles style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('hyderabad'); onClose(); },
    },
    {
      id: 'hub-pune',
      type: 'Upcoming Corridor',
      title: 'Pune Tech Corridor (Hinjawadi & Magarpatta)',
      desc: 'Coming Soon · Barclays, Veritas, Nvidia, BMC',
      icon: <Sparkles style={{ width: '15px', height: '15px', color: 'var(--accent-purple)' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('pune'); onClose(); },
    },
    {
      id: 'hub-mumbai',
      type: 'Upcoming Corridor',
      title: 'Mumbai Tech Corridor (BKC & Powai)',
      desc: 'Coming Soon · Morgan Stanley, JP Morgan, Reliance Jio',
      icon: <Sparkles style={{ width: '15px', height: '15px', color: 'var(--accent-green)' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('mumbai'); onClose(); },
    },
    {
      id: 'hub-gift',
      type: 'Upcoming Corridor',
      title: 'GIFT City Fintech Corridor (IFSC)',
      desc: 'Coming Soon · NSE IFSC, India INX, Standard Chartered',
      icon: <Sparkles style={{ width: '15px', height: '15px', color: 'var(--accent-yellow)' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('gift-city'); onClose(); },
    },
    {
      id: 'hub-chennai',
      type: 'Upcoming Corridor',
      title: 'Chennai Tech Corridor (OMR & Guindy)',
      desc: 'Coming Soon · Zoho, Freshworks, PayPal, Amazon, Chargebee',
      icon: <Sparkles style={{ width: '15px', height: '15px', color: '#0A84FF' }} />,
      action: () => { onSelectTab('companies'); onSelectHub?.('chennai'); onClose(); },
    },
  ];

  const actionItems = [
    {
      id: 'act-theme',
      type: 'Action',
      title: `Switch to ${theme === 'dark' ? 'Apple Light' : 'Dark'} Mode`,
      desc: 'Toggle application color scheme',
      icon: theme === 'dark' ? <Sun style={{ width: '15px', height: '15px', color: '#FFD60A' }} /> : <Moon style={{ width: '15px', height: '15px', color: '#0071E3' }} />,
      action: () => { onToggleTheme(); onClose(); },
    },
    {
      id: 'act-profile',
      type: 'Action',
      title: 'Open Candidate Profile Drawer',
      desc: 'Manage skills, experience, and matching vectors',
      icon: <User style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />,
      action: () => { onOpenProfile(); onClose(); },
    },
    {
      id: 'act-upload',
      type: 'Action',
      title: 'Upload Updated Resume PDF',
      desc: 'Re-index competencies against all portals',
      icon: <Upload style={{ width: '15px', height: '15px', color: 'var(--accent-green)' }} />,
      action: () => { onOpenUploadModal(); onClose(); },
    },
  ];

  // Filter companies matching query with typo tolerance, brand aliases, and intelligent scoring
  const matchingCompanies = useMemo(() => {
    if (!query.trim()) return [];
    return searchAndRankJobs(jobs, query)
      .slice(0, 10)
      .map(({ job: j, match }) => ({
        id: `job-${j.id}`,
        type: match.badgeLabel ? `Company · ${match.badgeLabel}` : 'Company Portal',
        title: j.company,
        desc: `${j.title} · ${j.location}`,
        icon: <Building2 style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />,
        action: () => { onSelectJob(j); onClose(); },
      }));
  }, [jobs, query, onClose, onSelectJob]);

  const allItems = [
    ...(query ? matchingCompanies : []),
    ...navItems.filter((i) => !query || i.title.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase())),
    ...hubItems.filter((i) => !query || i.title.toLowerCase().includes(query.toLowerCase()) || i.desc.toLowerCase().includes(query.toLowerCase())),
    ...actionItems.filter((i) => !query || i.title.toLowerCase().includes(query.toLowerCase())),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < allItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : allItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[selectedIndex]) {
        allItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 20px',
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '620px',
          background: 'var(--modal-bg)',
          borderRadius: '20px',
          border: '1px solid var(--modal-border)',
          boxShadow: 'var(--modal-shadow)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleUp 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--card-header-bg)',
          }}
        >
          <Search style={{ width: '18px', height: '18px', color: 'var(--accent-blue)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search companies, tech hubs, actions, or jump to view..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
              padding: 0,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-tertiary)',
              background: 'var(--nav-track-bg)',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            ESC
          </span>
        </div>

        {/* Results List */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {allItems.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '13px' }}>
              No results found for "{query}".
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isSelected ? 'var(--nav-track-bg)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                    transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--card-bg)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-tertiary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {item.type}
                    </span>
                    {isSelected && (
                      <ArrowRight style={{ width: '13px', height: '13px', color: 'var(--accent-blue)' }} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Hints */}
        <div
          style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--card-header-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span><kbd style={{ background: 'var(--nav-track-bg)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>↑↓</kbd> Navigate</span>
            <span><kbd style={{ background: 'var(--nav-track-bg)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>↵</kbd> Select</span>
            <span><kbd style={{ background: 'var(--nav-track-bg)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>ESC</kbd> Close</span>
          </div>
          <span style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>Spotlight Command Hub</span>
        </div>
      </div>
    </div>
  );
};
