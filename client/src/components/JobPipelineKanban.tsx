import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import type { JobOpportunity, CandidateProfile } from '../types';
import {
  Search,
  ArrowUpRight,
  ArrowUpDown,
  RotateCcw,
  X,
  Zap,
  ChevronDown,
  Clock,
  Building2,
  Send,
  FileText,
  MapPin,
  Sparkles,
  Layers,
  Compass,
  Globe,
  Filter,
  Bell,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CompanyLogo } from './CompanyLogo';
import { GlitchText } from './GlitchText';
import { LiveScannerHUD, type SyncStats } from './LiveScannerHUD';
import { detectDomainFromProfile } from '../utils/domainProfiles';

export type CorridorHub =
  | 'all'
  | 'delhi-ncr'
  | 'bengaluru'
  | 'remote'
  | 'hyderabad'
  | 'pune'
  | 'mumbai'
  | 'gift-city'
  | 'chennai';

interface JobPipelineKanbanProps {
  jobs: JobOpportunity[];
  profile?: CandidateProfile | null;
  onOpenOnboarding?: () => void;
  onSelectJob: (job: JobOpportunity) => void;
  onApplyJob?: (jobId: string) => void;
  onUnapplyJob?: (jobId: string) => void;
  onOpenOutreach?: (job: JobOpportunity) => void;
  onOpenTailoredResume?: (job: JobOpportunity) => void;
  applyingJobId?: string | null;
  onResetTracker?: () => void;
  onSyncLiveJobs?: () => Promise<void> | void;
  isSyncingLive?: boolean;
  lastSyncStats?: SyncStats | null;
  selectedHub?: CorridorHub;
  onSelectHub?: (hub: CorridorHub) => void;
}

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function isJobActiveApplied(job: JobOpportunity): boolean {
  if (job.status !== 'applied' || !job.appliedAt) return false;
  const elapsed = Date.now() - new Date(job.appliedAt).getTime();
  return elapsed < ONE_WEEK_MS;
}

function getCooldownInfo(appliedAt?: string) {
  if (!appliedAt) return { daysRemaining: 0, hoursRemaining: 0, text: 'Active' };
  const elapsed = Date.now() - new Date(appliedAt).getTime();
  const remainingMs = Math.max(0, ONE_WEEK_MS - elapsed);
  const days = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
  const hours = Math.ceil(remainingMs / (60 * 60 * 1000));
  return {
    daysRemaining: days,
    hoursRemaining: hours,
    text: days > 1 ? `${days}d` : `${hours}h`,
  };
}

export function getSectorBadgeStyle(sector?: string) {
  switch (sector) {
    case 'FAANG/MNC':
      return {
        bg: 'rgba(191, 90, 242, 0.14)',
        color: '#BF5AF2',
        border: '1px solid rgba(191, 90, 242, 0.35)',
        dot: '#BF5AF2',
      };
    case 'Fintech':
      return {
        bg: 'rgba(48, 209, 88, 0.14)',
        color: '#30D158',
        border: '1px solid rgba(48, 209, 88, 0.35)',
        dot: '#30D158',
      };
    case 'Consumer':
      return {
        bg: 'rgba(255, 159, 10, 0.14)',
        color: '#FF9F0A',
        border: '1px solid rgba(255, 159, 10, 0.35)',
        dot: '#FF9F0A',
      };
    case 'SaaS':
      return {
        bg: 'rgba(10, 132, 255, 0.14)',
        color: '#0A84FF',
        border: '1px solid rgba(10, 132, 255, 0.35)',
        dot: '#0A84FF',
      };
    case 'Infra/AI':
      return {
        bg: 'rgba(0, 199, 190, 0.14)',
        color: '#00C7BE',
        border: '1px solid rgba(0, 199, 190, 0.35)',
        dot: '#00C7BE',
      };
    default:
      return {
        bg: 'var(--tab-badge-inactive-bg)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)',
        dot: 'var(--text-tertiary)',
      };
  }
}

export function renderLocationBadge(job: JobOpportunity) {
  const isRemote = job.isRemote || job.hub === 'Remote' || (job.location && job.location.toLowerCase().includes('remote'));
  const isBlr = job.hub === 'Bengaluru' || (job.location && (job.location.toLowerCase().includes('bengaluru') || job.location.toLowerCase().includes('bangalore')));
  const isNcr = job.hub === 'Delhi NCR' || (job.location && (job.location.toLowerCase().includes('gurugram') || job.location.toLowerCase().includes('noida') || job.location.toLowerCase().includes('delhi')));

  if (isRemote) {
    const label = job.subRegion || (job.location?.toLowerCase().includes('india') ? 'India Remote' : 'Global Remote');
    return (
      <span
        style={{
          fontSize: '10.5px',
          color: '#c084fc',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.28)',
          padding: '1.5px 7px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 500,
        }}
        title={`Remote Workforce: ${job.location || 'Distributed'}`}
      >
        <Globe style={{ width: '10px', height: '10px', color: '#a855f7', flexShrink: 0 }} />
        <span>Remote · {label}</span>
      </span>
    );
  }

  if (isBlr) {
    const label = job.subRegion || 'Bengaluru';
    return (
      <span
        style={{
          fontSize: '10.5px',
          color: '#34d399',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.28)',
          padding: '1.5px 7px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 500,
        }}
        title={`Bengaluru Corridor: ${job.location}`}
      >
        <MapPin style={{ width: '10px', height: '10px', color: '#10b981', flexShrink: 0 }} />
        <span>BLR · {label}</span>
      </span>
    );
  }

  if (isNcr) {
    const ncrSub = job.subRegion || (job.location?.includes('Gurugram') ? 'Gurugram' : job.location?.includes('Noida') ? 'Noida' : 'Delhi');
    return (
      <span
        style={{
          fontSize: '10.5px',
          color: '#fb923c',
          background: 'rgba(249, 115, 22, 0.12)',
          border: '1px solid rgba(249, 115, 22, 0.28)',
          padding: '1.5px 7px',
          borderRadius: '4px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 500,
        }}
        title={`Delhi NCR Hub: ${job.location}`}
      >
        <MapPin style={{ width: '10px', height: '10px', color: '#f97316', flexShrink: 0 }} />
        <span>NCR · {ncrSub}</span>
      </span>
    );
  }

  return (
    <span
      style={{
        fontSize: '10.5px',
        color: 'var(--text-tertiary)',
        background: 'var(--tab-badge-inactive-bg)',
        border: '1px solid var(--border-subtle)',
        padding: '1.5px 7px',
        borderRadius: '4px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <MapPin style={{ width: '10px', height: '10px', opacity: 0.7, flexShrink: 0 }} />
      <span>{job.subRegion || job.location?.split(',')[0] || 'Office'}</span>
    </span>
  );
}

import { evaluateCompanySearch, searchAndRankJobs, type SearchMatchDetails } from '../utils/companySearch';

// Intelligent search relevance scoring algorithm (delegates to multi-pillar companySearch engine)
export function computeSearchRelevance(job: JobOpportunity, query: string): number {
  return evaluateCompanySearch(job, query).relevance;
}

export interface QueuedCompany {
  name: string;
  subRegion: string;
  sector: string;
  tags: string[];
  specialty: string;
}

export interface UpcomingCorridorData {
  id: 'hyderabad' | 'pune' | 'mumbai' | 'gift-city' | 'chennai';
  name: string;
  badgeLabel: string;
  tagline: string;
  corridorNodes: string;
  color: string;
  gradient: string;
  targetCount: number;
  expectedLaunch: string;
  sectors: string[];
  description: string;
  queuedCompanies: QueuedCompany[];
}

const UPCOMING_CORRIDORS: UpcomingCorridorData[] = [
  {
    id: 'hyderabad',
    name: 'Hyderabad Cyberabad Corridor',
    badgeLabel: 'Cyber Corridor',
    tagline: 'Global R&D Hub & Silicon Capital of Telangana',
    corridorNodes: 'HITEC City · Financial District · Madhapur · Gachibowli · Knowledge City',
    color: '#FF9F0A',
    gradient: 'linear-gradient(135deg, rgba(255, 159, 10, 0.18) 0%, rgba(255, 69, 58, 0.14) 50%, rgba(191, 90, 242, 0.10) 100%)',
    targetCount: 42,
    expectedLaunch: 'Ingress v0.6 · Indexing Live Portals',
    sectors: ['FAANG/MNC', 'Enterprise SaaS', 'Deep Tech & Silicon', 'Fintech Quant'],
    description: 'Connecting candidates directly to Microsoft\'s largest engineering campus outside Redmond, Google Hyderabad, Qualcomm DSP teams, ServiceNow, Apple Maps & Silicon R&D, and premier quant funds.',
    queuedCompanies: [
      {
        name: 'Microsoft IDC',
        subRegion: 'HITEC City Phase 2',
        sector: 'FAANG/MNC',
        tags: ['Azure Cloud', 'Distributed Systems', 'Copilot AI'],
        specialty: 'Microsoft\'s flagship engineering campus outside Redmond',
      },
      {
        name: 'Google Hyderabad',
        subRegion: 'Financial District',
        sector: 'FAANG/MNC',
        tags: ['Google Cloud', 'Search Infra', 'AdTech Core'],
        specialty: 'Core distributed systems and cloud infrastructure',
      },
      {
        name: 'Qualcomm',
        subRegion: 'Mindspace Madhapur',
        sector: 'Deep Tech & Silicon',
        tags: ['Snapdragon DSP', '5G Modem', 'Embedded Linux'],
        specialty: 'Flagship mobile silicon architecture and firmware',
      },
      {
        name: 'ServiceNow',
        subRegion: 'Knowledge City',
        sector: 'Enterprise SaaS',
        tags: ['Now Platform', 'PaaS Engine', 'Real-time Analytics'],
        specialty: 'High-scale enterprise workflow automation cloud',
      },
      {
        name: 'Salesforce',
        subRegion: 'HITEC City',
        sector: 'Enterprise SaaS',
        tags: ['Multi-Tenant Core', 'Apex Compiler', 'Data Cloud'],
        specialty: 'Core database engines and enterprise cloud apps',
      },
      {
        name: 'Apple',
        subRegion: 'Knowledge City',
        sector: 'FAANG/MNC',
        tags: ['Apple Maps', 'GIS Algorithms', 'iOS Spatial Cloud'],
        specialty: 'Worldwide mapping intelligence and platform services',
      },
      {
        name: 'D.E. Shaw & Co',
        subRegion: 'HITEC City',
        sector: 'Fintech Quant',
        tags: ['Low-Latency C++', 'Algorithmic Execution', 'High-Speed Grid'],
        specialty: 'World-renowned quantitative hedge fund technology',
      },
      {
        name: 'Arcesium',
        subRegion: 'Financial District',
        sector: 'Fintech Quant',
        tags: ['Post-Trade Cloud', 'Event-Driven', 'Kafka/Scala'],
        specialty: 'Institutional asset management software infrastructure',
      },
      {
        name: 'Goldman Sachs',
        subRegion: 'Financial District',
        sector: 'Fintech Quant',
        tags: ['Global Markets', 'Quant Risk Engine', 'Low Latency'],
        specialty: 'Investment banking technology and algorithmic risk',
      },
      {
        name: 'Uber',
        subRegion: 'Knowledge City',
        sector: 'Consumer Tech',
        tags: ['Dispatch Core', 'Geospatial Routing', 'Microservices'],
        specialty: 'Global driver, rider, and marketplace technology',
      },
      {
        name: 'Amazon Development Centre',
        subRegion: 'Financial District',
        sector: 'FAANG/MNC',
        tags: ['AWS DynamoDB', 'AWS S3', 'Fulfillment Platform'],
        specialty: 'AWS storage infrastructure and consumer systems',
      },
      {
        name: 'AMD',
        subRegion: 'HITEC City',
        sector: 'Deep Tech & Silicon',
        tags: ['ROCm Software', 'GPU Compute', 'Zen Architecture'],
        specialty: 'Next-gen heterogeneous computing and GPU compilers',
      },
    ],
  },
  {
    id: 'pune',
    name: 'Pune Tech & BFSI Corridor',
    badgeLabel: 'Automotive & BFSI Hub',
    tagline: 'The Engineering Powerhouse & Financial Technology Heartland',
    corridorNodes: 'Hinjawadi IT Park · Magarpatta Cybercity · Kharadi EON · Viman Nagar · Baner',
    color: '#30D158',
    gradient: 'linear-gradient(135deg, rgba(48, 209, 88, 0.18) 0%, rgba(0, 199, 190, 0.14) 50%, rgba(10, 132, 255, 0.10) 100%)',
    targetCount: 38,
    expectedLaunch: 'Ingress v0.6 · Indexing Live Portals',
    sectors: ['Fintech & Banking', 'Enterprise Infra', 'Automotive & GPU', 'Telecom Cloud'],
    description: 'From Hinjawadi Phase 1-3 to Magarpatta and Kharadi, Pune hosts global technology centers for tier-1 investment banks, Nvidia GPU computing, and enterprise cloud data resilience.',
    queuedCompanies: [
      {
        name: 'Barclays',
        subRegion: 'EON IT Park Kharadi',
        sector: 'Fintech & Banking',
        tags: ['Open Banking', 'Real-Time Clearing', 'AWS Cloud'],
        specialty: 'Global service center for tier-1 British investment bank',
      },
      {
        name: 'BNY Mellon',
        subRegion: 'Magarpatta Cybercity',
        sector: 'Fintech & Banking',
        tags: ['Asset Servicing', 'Custody Engine', 'High-Throughput'],
        specialty: 'World\'s largest custodian bank global technology nerve center',
      },
      {
        name: 'Nvidia',
        subRegion: 'Pune Tech Park Yerwada',
        sector: 'Automotive & GPU',
        tags: ['CUDA Architecture', 'DLSS 3', 'Autonomous Drive'],
        specialty: 'CUDA platform kernel engineering and automotive deep learning',
      },
      {
        name: 'Veritas Technologies',
        subRegion: 'Baner',
        sector: 'Enterprise Infra',
        tags: ['NetBackup Cloud', 'Kubernetes Storage', 'Disaster Recovery'],
        specialty: 'Enterprise multi-cloud storage and backup resilience',
      },
      {
        name: 'BMC Software',
        subRegion: 'Hinjawadi Phase 2',
        sector: 'Enterprise Infra',
        tags: ['Control-M', 'AIOps Automation', 'Mainframe Cloud'],
        specialty: 'Mission-critical enterprise IT orchestration software',
      },
      {
        name: 'Amdocs',
        subRegion: 'Magarpatta Cybercity',
        sector: 'Telecom Cloud',
        tags: ['5G Billing Engine', 'Cloud Native BSS', 'Microservices'],
        specialty: 'Carrier billing software powering 350+ global telcos',
      },
      {
        name: 'Mastercard',
        subRegion: 'Tech Hub Pune',
        sector: 'Fintech & Banking',
        tags: ['Payment Switch', 'Fraud Detection AI', 'Tokenization'],
        specialty: 'Global transaction routing and real-time security systems',
      },
      {
        name: 'UBS',
        subRegion: 'EON IT Park Kharadi',
        sector: 'Fintech & Banking',
        tags: ['Wealth Management', 'Risk Analytics', 'Kotlin/Java'],
        specialty: 'Swiss investment bank global technical infrastructure',
      },
      {
        name: 'Deutsche Bank',
        subRegion: 'Yerwada Pune',
        sector: 'Fintech & Banking',
        tags: ['Global Transaction Banking', 'FX Trading', 'Cloud Core'],
        specialty: 'European investment banking and treasury execution platform',
      },
      {
        name: 'Bajaj Finserv',
        subRegion: 'Kharadi',
        sector: 'Fintech & Banking',
        tags: ['Lending Engine', 'Event-Driven', 'Spring Boot/Go'],
        specialty: 'India\'s fastest-growing digital lending and fintech platform',
      },
    ],
  },
  {
    id: 'mumbai',
    name: 'Mumbai Financial Capital Corridor',
    badgeLabel: 'Financial Capital',
    tagline: 'Wall Street of India, High-Frequency Trading & High-Scale Consumer',
    corridorNodes: 'Bandra Kurla Complex (BKC) · Lower Parel · Powai Tech Valley · Nesco Goregaon',
    color: '#BF5AF2',
    gradient: 'linear-gradient(135deg, rgba(191, 90, 242, 0.18) 0%, rgba(255, 45, 85, 0.14) 50%, rgba(10, 132, 255, 0.10) 100%)',
    targetCount: 35,
    expectedLaunch: 'Ingress v0.6 · Indexing Live Portals',
    sectors: ['Investment Banking', 'Consumer Tech', 'High-Concurrency Gaming', 'Cloud Infrastructure'],
    description: 'Direct pipeline to BKC institutional trading desks, tier-1 global investment banks, and Mumbai\'s hyper-growth unicorns serving 100M+ concurrent users.',
    queuedCompanies: [
      {
        name: 'Morgan Stanley',
        subRegion: 'BKC & Nirlon Park',
        sector: 'Investment Banking',
        tags: ['Electronic Trading', 'Quant Execution', 'Ultra-Low Latency'],
        specialty: 'Global institutional securities technology headquarters',
      },
      {
        name: 'JP Morgan Chase',
        subRegion: 'BKC & Nesco Goregaon',
        sector: 'Investment Banking',
        tags: ['Onyx Blockchain', 'Asset Management', 'Global Clearing'],
        specialty: 'Enterprise banking technology and international payment networks',
      },
      {
        name: 'Nomura',
        subRegion: 'Powai Hiranandani',
        sector: 'Investment Banking',
        tags: ['Derivatives Analytics', 'Risk Models', 'Distributed Compute'],
        specialty: 'Global quantitative analytics and fixed income engines',
      },
      {
        name: 'Bank of America',
        subRegion: 'BKC Mumbai',
        sector: 'Investment Banking',
        tags: ['Global Markets', 'Treasury Systems', 'Cybersecurity'],
        specialty: 'Institutional wholesale banking and foreign exchange platforms',
      },
      {
        name: 'Reliance Jio',
        subRegion: 'Reliance Corporate Park',
        sector: 'Cloud Infrastructure',
        tags: ['5G Core Cloud', 'Telecom Infra', 'Kubernetes Mesh'],
        specialty: 'India\'s largest telecom network and digital ecosystem cloud',
      },
      {
        name: 'Dream11',
        subRegion: 'BKC Mumbai',
        sector: 'High-Concurrency Gaming',
        tags: ['10M+ Concurrent', 'Cassandra DB', 'Real-Time Rankers'],
        specialty: 'Extreme high-concurrency sports gaming and auction engines',
      },
      {
        name: 'Zepto',
        subRegion: 'Zepto HQ Powai',
        sector: 'Consumer Tech',
        tags: ['10-Min Logistics', 'Dispatch Optimization', 'Inventory Graph'],
        specialty: 'Micro-warehouse fulfillment and delivery routing algorithms',
      },
      {
        name: 'Tata Digital',
        subRegion: 'BKC Mumbai',
        sector: 'Consumer Tech',
        tags: ['Tata Neu Super App', 'Loyalty Platform', 'High-Throughput APIs'],
        specialty: 'Unified multi-brand digital commerce and financial services',
      },
      {
        name: 'BrowserStack',
        subRegion: 'Andheri East',
        sector: 'Cloud Infrastructure',
        tags: ['Device Cloud', 'Selenium Grid', 'WebRTC Video'],
        specialty: 'World-leading real device cross-browser testing cloud',
      },
      {
        name: 'BookMyShow',
        subRegion: 'Lower Parel Peninsula',
        sector: 'Consumer Tech',
        tags: ['Ticket Queue Lock', 'High-Traffic Spike', 'Payment Gateway'],
        specialty: 'Ultra-high-traffic live entertainment ticketing infrastructure',
      },
    ],
  },
  {
    id: 'gift-city',
    name: 'GIFT City IFSC Corridor',
    badgeLabel: 'IFSC Global Gateway',
    tagline: 'Gujarat International Finance Tec-City · India\'s First Smart Financial Tech City',
    corridorNodes: 'GIFT SEZ · International Financial Services Centre (IFSC) · Gandhinagar FinTech Zone',
    color: '#FFD60A',
    gradient: 'linear-gradient(135deg, rgba(255, 214, 10, 0.20) 0%, rgba(255, 159, 10, 0.15) 50%, rgba(48, 209, 88, 0.10) 100%)',
    targetCount: 24,
    expectedLaunch: 'Ingress v0.6 · Indexing Live Portals',
    sectors: ['International Stock Exchanges', 'Offshore Banking', 'FinTech Sandbox', 'Global Custody'],
    description: 'India\'s premier offshore international financial tech gateway. Home to dollar-denominated multi-asset exchanges, zero-tax fintech sandboxes, and tier-1 global treasury hubs.',
    queuedCompanies: [
      {
        name: 'NSE IFSC',
        subRegion: 'GIFT SEZ',
        sector: 'International Stock Exchanges',
        tags: ['GIFT Nifty', 'Multi-Asset Matching', 'Sub-Millisecond FIX'],
        specialty: 'Dollar-denominated international stock exchange matching engine',
      },
      {
        name: 'India INX',
        subRegion: 'GIFT IFSC',
        sector: 'International Stock Exchanges',
        tags: ['BSE International', '4-Microsecond Latency', 'Cross-Currency Derivatives'],
        specialty: 'Asia\'s fastest financial exchange platform colocation engine',
      },
      {
        name: 'Standard Chartered GBS',
        subRegion: 'GIFT IFSC',
        sector: 'Offshore Banking',
        tags: ['Cross-Border Treasury', 'Offshore FX', 'ISO 20022'],
        specialty: 'Global banking offshore transaction clearing and treasury operations',
      },
      {
        name: 'Bank of America IFSC',
        subRegion: 'GIFT City Gandhinagar',
        sector: 'Offshore Banking',
        tags: ['Foreign Currency Lending', 'Global Liquidity', 'Syndicated Loans'],
        specialty: 'International offshore corporate finance and trade facilities',
      },
      {
        name: 'Oracle Financial Services',
        subRegion: 'GIFT City',
        sector: 'FinTech Sandbox',
        tags: ['FLEXCUBE Core', 'IFSC Tax Engine', 'Cloud BFSI'],
        specialty: 'Global multi-currency banking software and regulatory reporting',
      },
      {
        name: 'IBM FinTech Innovation Centre',
        subRegion: 'GIFT SEZ',
        sector: 'FinTech Sandbox',
        tags: ['Hybrid Financial Cloud', 'Quantum Safe Crypto', 'Watsonx Banking'],
        specialty: 'FinTech incubation and quantum cryptography for banking',
      },
      {
        name: 'State Bank of India Global Markets',
        subRegion: 'GIFT IFSC',
        sector: 'Offshore Banking',
        tags: ['International Trade', 'FX Hedging Desks', 'Dollar Clearing'],
        specialty: 'India\'s largest commercial bank international treasury nerve centre',
      },
    ],
  },
  {
    id: 'chennai',
    name: 'Chennai SaaS & Deep Tech Corridor',
    badgeLabel: 'SaaS & Enterprise Hub',
    tagline: 'SaaS Capital of India & Global Automotive R&D Powerhouse',
    corridorNodes: 'OMR (Old Mahabalipuram Rd) · Taramani · Guindy · Ambattur · Perungudi · DLF Cybercity',
    color: '#32D74B',
    gradient: 'linear-gradient(135deg, rgba(50, 215, 75, 0.18) 0%, rgba(10, 132, 255, 0.14) 50%, rgba(191, 90, 242, 0.10) 100%)',
    targetCount: 36,
    expectedLaunch: 'Ingress v0.6 · Indexing Live Portals',
    sectors: ['Enterprise SaaS', 'Global FinTech & GCCs', 'Deep Tech & Cloud', 'Automotive R&D'],
    description: "Direct career portals to Chennai's premier enterprise SaaS giants, global capability centres (GCCs), and deep tech infrastructure across OMR and Guindy.",
    queuedCompanies: [
      {
        name: 'Zoho Corporation',
        subRegion: 'Estancia IT Park, Guduvanchery / OMR',
        sector: 'Enterprise SaaS',
        tags: ['Zoho One PaaS', 'Distributed Datacenters', 'Bare-metal Cloud'],
        specialty: 'Bootstrapped global SaaS leader with 100M+ users worldwide',
      },
      {
        name: 'Freshworks',
        subRegion: 'Global Infocity Park, Perungudi, OMR',
        sector: 'Enterprise SaaS',
        tags: ['Freshdesk Cloud', 'Multi-tenant Microservices', 'AWS EKS'],
        specialty: 'NASDAQ-listed customer service and ITSM SaaS powerhouse',
      },
      {
        name: 'PayPal Chennai',
        subRegion: 'Futura Tech Park, Sholinganallur, OMR',
        sector: 'Global FinTech & GCCs',
        tags: ['Global Payments Core', 'Fraud Detection', 'High-throughput Kafka'],
        specialty: "PayPal's premier global engineering & risk management nerve centre",
      },
      {
        name: 'Amazon Development Centre',
        subRegion: 'SP Infocity, Perungudi, OMR',
        sector: 'Deep Tech & Cloud',
        tags: ['AWS Systems', 'Payment Gateways', 'Kindle & Device Software'],
        specialty: 'Core distributed systems, retail backend, and device firmware',
      },
      {
        name: 'Standard Chartered GBS',
        subRegion: 'DLF IT Park, Manapakkam / Guindy',
        sector: 'Global FinTech & GCCs',
        tags: ['Core Banking APIs', 'FX Clearing', 'Global Treasury Platforms'],
        specialty: "Standard Chartered's primary global technology and innovation GCC",
      },
      {
        name: 'Ford Technology Services',
        subRegion: 'Ramanujan IT City, Taramani',
        sector: 'Automotive R&D',
        tags: ['Connected Vehicle Cloud', 'Telematics', 'OTA Infra'],
        specialty: 'Next-generation connected mobility and vehicle telemetry systems',
      },
      {
        name: 'Chargebee',
        subRegion: 'SP Infocity, Perungudi, OMR',
        sector: 'Enterprise SaaS',
        tags: ['Subscription Billing', 'Tax Automation', 'Fintech Invoicing'],
        specialty: 'Global recurring billing and subscription revenue management platform',
      },
    ],
  },
];

export const UPCOMING_CORRIDOR_MAP: Record<'hyderabad' | 'pune' | 'mumbai' | 'gift-city' | 'chennai', UpcomingCorridorData> = {
  hyderabad: UPCOMING_CORRIDORS[0],
  pune: UPCOMING_CORRIDORS[1],
  mumbai: UPCOMING_CORRIDORS[2],
  'gift-city': UPCOMING_CORRIDORS[3],
  chennai: UPCOMING_CORRIDORS[4],
};

function isUpcomingCorridor(hub: CorridorHub): hub is 'hyderabad' | 'pune' | 'mumbai' | 'gift-city' | 'chennai' {
  return hub === 'hyderabad' || hub === 'pune' || hub === 'mumbai' || hub === 'gift-city' || hub === 'chennai';
}

const ComingSoonCorridorView: React.FC<{
  corridor: UpcomingCorridorData;
  onSelectHub: (hub: CorridorHub) => void;
}> = ({ corridor, onSelectHub }) => {
  const [isNotified, setIsNotified] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('ingress_notified_corridors');
      if (stored) {
        const set = new Set(JSON.parse(stored));
        return set.has(corridor.id);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [filterSector, setFilterSector] = useState<string>('all');

  const handleNotifyToggle = () => {
    try {
      const stored = localStorage.getItem('ingress_notified_corridors');
      const set = stored ? new Set(JSON.parse(stored)) : new Set();
      if (isNotified) {
        set.delete(corridor.id);
        setIsNotified(false);
      } else {
        set.add(corridor.id);
        setIsNotified(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: [corridor.color, '#0A84FF', '#30D158'],
        });
      }
      localStorage.setItem('ingress_notified_corridors', JSON.stringify(Array.from(set)));
    } catch {
      setIsNotified(!isNotified);
    }
  };

  const filteredCompanies = filterSector === 'all'
    ? corridor.queuedCompanies
    : corridor.queuedCompanies.filter((c) => c.sector === filterSector);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 28px 40px' }}>
      {/* Hero Corridor Banner */}
      <div
        style={{
          borderRadius: '20px',
          background: corridor.gradient,
          border: `1px solid ${corridor.color}40`,
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: `0 8px 32px ${corridor.color}15`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '720px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: corridor.color,
                  background: `${corridor.color}22`,
                  border: `1px solid ${corridor.color}50`,
                  padding: '3px 10px',
                  borderRadius: '980px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: corridor.color }} />
                <GlitchText text={corridor.badgeLabel} trigger={corridor.id} />
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                <GlitchText text={corridor.corridorNodes} trigger={corridor.id} />
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: '28px',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: 'var(--text-primary)',
              }}
            >
              <GlitchText text={corridor.name} trigger={corridor.id} />
            </h2>

            <p
              style={{ margin: '6px 0 0', fontSize: '15px', color: corridor.color, fontWeight: 650 }}
            >
              <GlitchText text={corridor.tagline} trigger={corridor.id} />
            </p>

            <p style={{ margin: '10px 0 0', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {corridor.description}
            </p>
          </div>

          {/* Interactive Notify CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
            <button
              onClick={handleNotifyToggle}
              style={{
                fontSize: '13.5px',
                fontWeight: 700,
                padding: '12px 24px',
                borderRadius: '980px',
                cursor: 'pointer',
                border: isNotified ? '1px solid rgba(48, 209, 88, 0.5)' : `1px solid ${corridor.color}`,
                background: isNotified ? 'rgba(48, 209, 88, 0.16)' : corridor.color,
                color: isNotified ? '#30D158' : '#000000',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isNotified ? '0 4px 16px rgba(48, 209, 88, 0.25)' : `0 4px 20px ${corridor.color}50`,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {isNotified ? (
                <>
                  <Check style={{ width: '16px', height: '16px' }} />
                  <span>Subscribed to Launch Alert</span>
                </>
              ) : (
                <>
                  <Bell style={{ width: '16px', height: '16px' }} />
                  <span>Notify Me When Live</span>
                </>
              )}
            </button>
            {isNotified && (
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                You will be alerted the moment this corridor unlocks
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sector Filter Strip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Filter style={{ width: '12px', height: '12px' }} />
            Filter Sector:
          </span>

          <button
            onClick={() => setFilterSector('all')}
            style={{
              fontSize: '12px',
              padding: '5px 12px',
              borderRadius: '980px',
              fontWeight: 650,
              cursor: 'pointer',
              border: filterSector === 'all' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
              background: filterSector === 'all' ? 'var(--text-primary)' : 'var(--tab-badge-inactive-bg)',
              color: filterSector === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.15s ease',
            }}
          >
            All Queued ({corridor.queuedCompanies.length})
          </button>

          {corridor.sectors.map((sec) => {
            const active = filterSector === sec;
            const count = corridor.queuedCompanies.filter((c) => c.sector === sec).length;
            return (
              <button
                key={sec}
                onClick={() => setFilterSector(sec)}
                style={{
                  fontSize: '12px',
                  padding: '5px 12px',
                  borderRadius: '980px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  border: active ? `1px solid ${corridor.color}` : '1px solid var(--border-subtle)',
                  background: active ? `${corridor.color}22` : 'var(--tab-badge-inactive-bg)',
                  color: active ? corridor.color : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                }}
              >
                {sec} ({count})
              </button>
            );
          })}
        </div>

        <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
          Showing {filteredCompanies.length} indexed endpoints
        </span>
      </div>

      {/* Queued Companies Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}
      >
        {filteredCompanies.map((comp, idx) => (
          <div
            key={idx}
            className="tilt-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CompanyLogo company={comp.name} size={32} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      <GlitchText text={comp.name} trigger={corridor.id} />
                    </h4>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin style={{ width: '11px', height: '11px', color: corridor.color }} />
                      {comp.subRegion}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: `${corridor.color}15`,
                    color: corridor.color,
                    border: `1px solid ${corridor.color}35`,
                  }}
                >
                  {comp.sector}
                </span>
              </div>

              <p style={{ margin: '12px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {comp.specialty}
              </p>

              {/* Engineering Focus Chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '12px' }}>
                {comp.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '10.5px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--nav-track-bg)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '11px',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#30D158', fontWeight: 650 }}>
                <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                Endpoint Verified
              </span>
              <span style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                Ingress v0.6
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Switcher to Other Upcoming Corridors */}
      <div
        style={{
          marginTop: '12px',
          padding: '20px 24px',
          background: 'var(--drawer-card-bg)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Explore other upcoming engineering corridors:
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {UPCOMING_CORRIDORS.filter((c) => c.id !== corridor.id).map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectHub(c.id)}
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                borderRadius: '980px',
                cursor: 'pointer',
                fontWeight: 650,
                border: `1px solid ${c.color}40`,
                background: 'var(--nav-track-bg)',
                color: c.color,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span className="radar-beacon" style={{ width: '5px', height: '5px', borderRadius: '50%', background: c.color }} />
              <span>{c.id === 'gift-city' ? 'GIFT City' : c.id.charAt(0).toUpperCase() + c.id.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const JobPipelineKanban: React.FC<JobPipelineKanbanProps> = ({
  jobs,
  profile,
  onOpenOnboarding,
  onSelectJob,
  onApplyJob,
  onUnapplyJob,
  onOpenOutreach,
  onOpenTailoredResume,
  applyingJobId,
  onResetTracker,
  onSyncLiveJobs,
  isSyncingLive,
  lastSyncStats,
  selectedHub: propSelectedHub,
  onSelectHub,
}) => {
  const activeDomain = useMemo(() => detectDomainFromProfile(profile || {}), [profile]);
  const [pipelineView, setPipelineView] = useState<'available' | 'live' | 'applied'>('available');
  const [showScannerHUD, setShowScannerHUD] = useState<boolean>(false);

  useEffect(() => {
    if (isSyncingLive) {
      setShowScannerHUD(true);
    }
  }, [isSyncingLive]);
  const [internalHub, setInternalHub] = useState<CorridorHub>('all');
  const selectedHub = propSelectedHub !== undefined ? propSelectedHub : internalHub;
  const setSelectedHub = (hub: CorridorHub) => {
    if (onSelectHub) onSelectHub(hub);
    setInternalHub(hub);
  };
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedJobIds, setExpandedJobIds] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [domainOnlyFilter, setDomainOnlyFilter] = useState<boolean>(false);
  const [showUpcomingDropdown, setShowUpcomingDropdown] = useState<boolean>(false);
  const upcomingDropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (upcomingDropdownRef.current && !upcomingDropdownRef.current.contains(e.target as Node)) {
        setShowUpcomingDropdown(false);
      }
    };
    if (showUpcomingDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUpcomingDropdown]);

  // Filter helper: test if a company or its roles match the active domain track
  const isJobDomainMatch = useCallback((job: JobOpportunity) => {
    if (!activeDomain) return true;
    const cLower = job.company.toLowerCase();
    const isPriorityComp = (activeDomain.priorityCompanies || []).some(
      (c) => cLower.includes(c.toLowerCase()) || c.toLowerCase().includes(cLower)
    );
    const isTargetComp = (activeDomain.targetCompanies || []).some(
      (c) => cLower.includes(c.toLowerCase()) || c.toLowerCase().includes(cLower)
    );
    const hasMatchingLiveRole = (job.liveJobs || []).some((lj) =>
      (activeDomain.roleTitleKeywords || []).some((kw) => lj.title.toLowerCase().includes(kw.toLowerCase()))
    );
    const hasMatchingTitle = (activeDomain.roleTitleKeywords || []).some((kw) =>
      job.title.toLowerCase().includes(kw.toLowerCase())
    );
    const isHighFit = (job.vectorScore || 0) >= 70;
    const matchesSector = (activeDomain.highFitSectors || []).some((s) =>
      (job.sector || '').toLowerCase().includes(s.toLowerCase()) || (job.category || '').toLowerCase().includes(s.toLowerCase())
    );
    return isPriorityComp || isTargetComp || hasMatchingLiveRole || hasMatchingTitle || (isHighFit && matchesSector);
  }, [activeDomain]);

  const domainMatchingCount = useMemo(() => {
    return jobs.filter(isJobDomainMatch).length;
  }, [jobs, isJobDomainMatch]);


  // Helper: test if job belongs to Delhi NCR
  const isDelhiNcrJob = (job: JobOpportunity) => {
    if (job.hub === 'Delhi NCR') return true;
    const loc = (job.location || '').toLowerCase();
    return loc.includes('delhi') || loc.includes('gurugram') || loc.includes('gurgaon') || loc.includes('noida');
  };

  // Helper: test if job belongs to Bengaluru Tech Hub
  const isBengaluruJob = (job: JobOpportunity) => {
    if (isDelhiNcrJob(job)) return false;
    if (job.hub === 'Bengaluru') return true;
    const loc = (job.location || '').toLowerCase();
    return loc.includes('bengaluru') || loc.includes('bangalore');
  };

  // Helper: test if job belongs to Remote / Distributed
  const isRemoteJob = (job: JobOpportunity) => {
    if (isDelhiNcrJob(job)) return false;
    if (isBengaluruJob(job)) return false;
    if (job.hub === 'Remote' || job.isRemote === true) return true;
    const loc = (job.location || '').toLowerCase();
    return loc.includes('remote');
  };

  // Pre-calculated counts per hub, sector, and sub-region
  const {
    ncrTotalCount, ncrSectorCounts, ncrSubRegionCounts,
    blrTotalCount, blrSectorCounts, blrSubRegionCounts,
    remoteTotalCount, remoteSectorCounts, remoteSubRegionCounts,
    allSectorCounts,
  } = useMemo(() => {
    const ncrJobs = jobs.filter(isDelhiNcrJob);
    const blrJobs = jobs.filter(isBengaluruJob);
    const remJobs = jobs.filter(isRemoteJob);

    const initSectors = (): Record<string, number> => ({
      'FAANG/MNC': 0,
      'Fintech': 0,
      'Consumer': 0,
      'SaaS': 0,
      'Infra/AI': 0,
    });

    const allSectors = initSectors();
    for (const j of jobs) {
      if (j.sector && allSectors[j.sector] !== undefined) allSectors[j.sector]++;
    }

    // 1. Delhi NCR Breakdown
    const ncrSectors = initSectors();
    const ncrSubRegions: Record<string, number> = { 'Gurugram': 0, 'Noida': 0, 'New Delhi': 0 };
    for (const j of ncrJobs) {
      if (j.sector && ncrSectors[j.sector] !== undefined) ncrSectors[j.sector]++;
      const loc = (j.subRegion || j.location || '').toLowerCase();
      if (loc.includes('gurugram') || loc.includes('gurgaon')) ncrSubRegions['Gurugram']++;
      else if (loc.includes('noida')) ncrSubRegions['Noida']++;
      else if (loc.includes('delhi') || loc.includes('aerocity')) ncrSubRegions['New Delhi']++;
    }

    // 2. Bengaluru Breakdown
    const blrSectors = initSectors();
    const blrSubRegions: Record<string, number> = {
      'Outer Ring Road': 0,
      'Indiranagar & CBD': 0,
      'Koramangala & HSR': 0,
      'Whitefield': 0,
    };
    for (const j of blrJobs) {
      if (j.sector && blrSectors[j.sector] !== undefined) blrSectors[j.sector]++;
      const sr = j.subRegion || '';
      if (sr.includes('Outer Ring')) blrSubRegions['Outer Ring Road']++;
      else if (sr.includes('Indiranagar') || sr.includes('CBD')) blrSubRegions['Indiranagar & CBD']++;
      else if (sr.includes('Koramangala') || sr.includes('HSR')) blrSubRegions['Koramangala & HSR']++;
      else if (sr.includes('Whitefield')) blrSubRegions['Whitefield']++;
      else blrSubRegions['Outer Ring Road']++;
    }

    // 3. Remote Breakdown
    const remSectors = initSectors();
    const remSubRegions: Record<string, number> = {
      'Global Remote': 0,
      'US & EU Async': 0,
      'India Remote': 0,
    };
    for (const j of remJobs) {
      if (j.sector && remSectors[j.sector] !== undefined) remSectors[j.sector]++;
      const sr = j.subRegion || '';
      if (sr.includes('India')) remSubRegions['India Remote']++;
      else if (sr.includes('US') || sr.includes('EU')) remSubRegions['US & EU Async']++;
      else remSubRegions['Global Remote']++;
    }

    return {
      ncrTotalCount: ncrJobs.length,
      ncrSectorCounts: ncrSectors,
      ncrSubRegionCounts: ncrSubRegions,
      blrTotalCount: blrJobs.length,
      blrSectorCounts: blrSectors,
      blrSubRegionCounts: blrSubRegions,
      remoteTotalCount: remJobs.length,
      remoteSectorCounts: remSectors,
      remoteSubRegionCounts: remSubRegions,
      allSectorCounts: allSectors,
    };
  }, [jobs]);

  // Partition jobs into active Available, Live Openings, and 7-day Applied Cooldown
  const { availableJobs, appliedJobs, liveOnlyJobs, totalLiveRolesCount } = useMemo(() => {
    const available: JobOpportunity[] = [];
    const applied: JobOpportunity[] = [];
    const live: JobOpportunity[] = [];
    let liveRolesSum = 0;

    for (const job of jobs) {
      const liveCount = job.liveJobs?.length || 0;
      liveRolesSum += liveCount;

      if (isJobActiveApplied(job)) {
        applied.push(job);
      } else {
        available.push(job);
        if (liveCount > 0) {
          live.push(job);
        }
      }
    }
    return {
      availableJobs: available,
      appliedJobs: applied,
      liveOnlyJobs: live,
      totalLiveRolesCount: liveRolesSum,
    };
  }, [jobs]);

  const targetJobs =
    pipelineView === 'available'
      ? availableJobs
      : pipelineView === 'live'
      ? liveOnlyJobs
      : appliedJobs;

  const handleToggleExpandAll = () => {
    if (expandedJobIds.size > 0) {
      setExpandedJobIds(new Set());
    } else {
      const liveIds = new Set(
        targetJobs
          .filter((j) => Boolean(j.liveJobs && j.liveJobs.length > 0))
          .map((j) => j.id)
      );
      setExpandedJobIds(liveIds);
    }
  };

  // Filter targetJobs by Hub, Sector, and Sub-region
  const hubAndSectorFilteredJobs = useMemo(() => {
    return targetJobs.filter((job) => {
      // 1. Hub Filter
      if (selectedHub === 'delhi-ncr' && !isDelhiNcrJob(job)) return false;
      if (selectedHub === 'bengaluru' && !isBengaluruJob(job)) return false;
      if (selectedHub === 'remote' && !isRemoteJob(job)) return false;

      // 2. Sector Filter (only when a specific sector is selected)
      if (selectedSector !== 'all' && job.sector !== selectedSector) {
        return false;
      }

      // 3. Sub-region Filter
      if (selectedSubRegion !== 'all') {
        const sr = (job.subRegion || job.location || '').toLowerCase();
        const target = selectedSubRegion.toLowerCase();
        if (!sr.includes(target.split(' ')[0])) return false;
      }

      // 4. Domain Track Isolation Filter
      if (domainOnlyFilter && !isJobDomainMatch(job)) {
        return false;
      }

      return true;
    });
  }, [targetJobs, selectedHub, selectedSector, selectedSubRegion, domainOnlyFilter, isJobDomainMatch]);

  const toggleExpand = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    setExpandedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  // Global keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { filteredAndSortedJobs, searchMatchMap, searchScopeInfo } = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!q) {
      const sorted = [...hubAndSectorFilteredJobs].sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.vectorScore - a.vectorScore;
        } else {
          return a.vectorScore - b.vectorScore;
        }
      });
      return {
        filteredAndSortedJobs: sorted,
        searchMatchMap: {} as Record<string, SearchMatchDetails>,
        searchScopeInfo: {
          isExpandedGlobally: false,
          totalGlobalMatches: 0,
          corridorMatchesCount: 0,
          otherCorridorsCount: 0,
        },
      };
    }

    // 1. Score all target jobs in current view (available, applied, or live)
    // searchAndRankJobs enforces word-boundary precision and company-priority disambiguation
    const allScored = searchAndRankJobs(targetJobs, q);
    const matchMap: Record<string, SearchMatchDetails> = {};
    for (const item of allScored) {
      matchMap[item.job.id] = item.match;
    }

    const sortFn = (
      a: { job: JobOpportunity; match: SearchMatchDetails },
      b: { job: JobOpportunity; match: SearchMatchDetails }
    ) => {
      if (b.match.relevance !== a.match.relevance) {
        return b.match.relevance - a.match.relevance;
      }
      return sortOrder === 'desc'
        ? b.job.vectorScore - a.job.vectorScore
        : a.job.vectorScore - b.job.vectorScore;
    };

    const hasActiveFilter =
      selectedHub !== 'all' || selectedSector !== 'all' || selectedSubRegion !== 'all';

    if (!hasActiveFilter) {
      allScored.sort(sortFn);
      return {
        filteredAndSortedJobs: allScored.map((item) => item.job),
        searchMatchMap: matchMap,
        searchScopeInfo: {
          isExpandedGlobally: false,
          totalGlobalMatches: allScored.length,
          corridorMatchesCount: allScored.length,
          otherCorridorsCount: 0,
        },
      };
    }

    const corridorIds = new Set(hubAndSectorFilteredJobs.map((j) => j.id));
    const corridorMatches = allScored.filter((item) => corridorIds.has(item.job.id));
    const otherCorridorsCount = allScored.length - corridorMatches.length;

    // If matches exist within active filter, show them first
    if (corridorMatches.length > 0) {
      corridorMatches.sort(sortFn);
      return {
        filteredAndSortedJobs: corridorMatches.map((item) => item.job),
        searchMatchMap: matchMap,
        searchScopeInfo: {
          isExpandedGlobally: false,
          totalGlobalMatches: allScored.length,
          corridorMatchesCount: corridorMatches.length,
          otherCorridorsCount,
        },
      };
    }

    // If ZERO matches in active filter but matches exist across other corridors,
    // seamlessly fall back to displaying all matches across all portals!
    allScored.sort(sortFn);
    return {
      filteredAndSortedJobs: allScored.map((item) => item.job),
      searchMatchMap: matchMap,
      searchScopeInfo: {
        isExpandedGlobally: true,
        totalGlobalMatches: allScored.length,
        corridorMatchesCount: 0,
        otherCorridorsCount: allScored.length,
      },
    };
  }, [
    targetJobs,
    hubAndSectorFilteredJobs,
    searchQuery,
    sortOrder,
    selectedHub,
    selectedSector,
    selectedSubRegion,
  ]);

  const handleApplyClick = (e: React.MouseEvent, job: JobOpportunity) => {
    e.stopPropagation();
    // Record application timestamp and initiate 7-day cooldown
    if (onApplyJob) {
      onApplyJob(job.id);
    }
    // Directly open verified career portal in new tab
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleSort = () => {
    setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      {/* ── Tier 1: Hub Corridors & Career Track Header Bar ── */}
      <div
        style={{
          padding: '10px 24px',
          background: 'var(--card-header-bg, rgba(255, 255, 255, 0.02))',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Left: Primary Hub Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 750,
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              marginRight: '4px',
            }}
          >
            Corridor:
          </span>

          {/* 1. All Companies */}
          <button
            onClick={() => {
              setSelectedHub('all');
              setSelectedSector('all');
              setSelectedSubRegion('all');
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '980px',
              fontSize: '12px',
              fontWeight: 650,
              border: selectedHub === 'all' ? '1px solid rgba(10, 132, 255, 0.5)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background:
                selectedHub === 'all'
                  ? 'linear-gradient(135deg, rgba(10, 132, 255, 0.22), rgba(0, 199, 190, 0.18))'
                  : 'var(--tab-badge-inactive-bg)',
              color: selectedHub === 'all' ? '#64D2FF' : 'var(--text-secondary)',
              boxShadow: selectedHub === 'all' ? '0 2px 10px rgba(10, 132, 255, 0.28)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.18s ease',
            }}
          >
            <Layers style={{ width: '12px', height: '12px', color: selectedHub === 'all' ? '#64D2FF' : 'inherit' }} />
            <span>All Companies</span>
            <span
              style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                padding: '1px 6px',
                borderRadius: '980px',
                background: selectedHub === 'all' ? '#0A84FF' : 'rgba(255, 255, 255, 0.08)',
                color: selectedHub === 'all' ? '#ffffff' : 'var(--text-tertiary)',
                fontWeight: 700,
              }}
            >
              {jobs.length}
            </span>
          </button>

          {/* 2. Delhi NCR */}
          <button
            onClick={() => {
              setSelectedHub('delhi-ncr');
              setSelectedSector('all');
              setSelectedSubRegion('all');
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '980px',
              fontSize: '12px',
              fontWeight: 650,
              border: selectedHub === 'delhi-ncr' ? '1px solid rgba(255, 45, 85, 0.45)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background:
                selectedHub === 'delhi-ncr'
                  ? 'linear-gradient(135deg, rgba(255, 45, 85, 0.20), rgba(191, 90, 242, 0.18))'
                  : 'var(--tab-badge-inactive-bg)',
              color: selectedHub === 'delhi-ncr' ? '#FF375F' : 'var(--text-secondary)',
              boxShadow: selectedHub === 'delhi-ncr' ? '0 2px 10px rgba(255, 45, 85, 0.28)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.18s ease',
            }}
          >
            <MapPin style={{ width: '12px', height: '12px', color: selectedHub === 'delhi-ncr' ? '#FF375F' : 'inherit' }} />
            <span>Delhi NCR</span>
            <span
              style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                padding: '1px 6px',
                borderRadius: '980px',
                background: selectedHub === 'delhi-ncr' ? '#FF375F' : 'rgba(255, 255, 255, 0.08)',
                color: selectedHub === 'delhi-ncr' ? '#ffffff' : 'var(--text-tertiary)',
                fontWeight: 700,
              }}
            >
              {ncrTotalCount}
            </span>
          </button>

          {/* 3. Bengaluru */}
          <button
            onClick={() => {
              setSelectedHub('bengaluru');
              setSelectedSector('all');
              setSelectedSubRegion('all');
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '980px',
              fontSize: '12px',
              fontWeight: 650,
              border: selectedHub === 'bengaluru' ? '1px solid rgba(48, 209, 88, 0.45)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background:
                selectedHub === 'bengaluru'
                  ? 'linear-gradient(135deg, rgba(48, 209, 88, 0.20), rgba(0, 199, 190, 0.18))'
                  : 'var(--tab-badge-inactive-bg)',
              color: selectedHub === 'bengaluru' ? '#30D158' : 'var(--text-secondary)',
              boxShadow: selectedHub === 'bengaluru' ? '0 2px 10px rgba(48, 209, 88, 0.25)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.18s ease',
            }}
          >
            <Compass style={{ width: '12px', height: '12px', color: selectedHub === 'bengaluru' ? '#30D158' : 'inherit' }} />
            <span>Bengaluru</span>
            <span
              style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                padding: '1px 6px',
                borderRadius: '980px',
                background: selectedHub === 'bengaluru' ? '#30D158' : 'rgba(255, 255, 255, 0.08)',
                color: selectedHub === 'bengaluru' ? '#000000' : 'var(--text-tertiary)',
                fontWeight: 700,
              }}
            >
              {blrTotalCount}
            </span>
          </button>

          {/* 4. Remote */}
          <button
            onClick={() => {
              setSelectedHub('remote');
              setSelectedSector('all');
              setSelectedSubRegion('all');
            }}
            style={{
              padding: '5px 12px',
              borderRadius: '980px',
              fontSize: '12px',
              fontWeight: 650,
              border: selectedHub === 'remote' ? '1px solid rgba(191, 90, 242, 0.45)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              background:
                selectedHub === 'remote'
                  ? 'linear-gradient(135deg, rgba(191, 90, 242, 0.20), rgba(10, 132, 255, 0.18))'
                  : 'var(--tab-badge-inactive-bg)',
              color: selectedHub === 'remote' ? '#BF5AF2' : 'var(--text-secondary)',
              boxShadow: selectedHub === 'remote' ? '0 2px 10px rgba(191, 90, 242, 0.25)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.18s ease',
            }}
          >
            <Globe style={{ width: '12px', height: '12px', color: selectedHub === 'remote' ? '#BF5AF2' : 'inherit' }} />
            <span>Remote</span>
            <span
              style={{
                fontSize: '10.5px',
                fontFamily: 'var(--font-mono)',
                padding: '1px 6px',
                borderRadius: '980px',
                background: selectedHub === 'remote' ? '#BF5AF2' : 'rgba(255, 255, 255, 0.08)',
                color: selectedHub === 'remote' ? '#ffffff' : 'var(--text-tertiary)',
                fontWeight: 700,
              }}
            >
              {remoteTotalCount}
            </span>
          </button>

          {/* Active Upcoming Hub Pill if currently selected */}
          {isUpcomingCorridor(selectedHub) && (() => {
            const currentUpcoming = UPCOMING_CORRIDORS.find((c) => c.id === selectedHub);
            if (!currentUpcoming) return null;
            return (
              <button
                onClick={() => {
                  setSelectedHub(currentUpcoming.id);
                  setSelectedSector('all');
                  setSelectedSubRegion('all');
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: `1px solid ${currentUpcoming.color}`,
                  cursor: 'pointer',
                  background: currentUpcoming.gradient,
                  color: currentUpcoming.color,
                  boxShadow: `0 2px 12px ${currentUpcoming.color}40`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.18s ease',
                }}
              >
                <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentUpcoming.color }} />
                <span>{currentUpcoming.id === 'gift-city' ? 'GIFT City' : currentUpcoming.id.charAt(0).toUpperCase() + currentUpcoming.id.slice(1)}</span>
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    background: currentUpcoming.color,
                    color: '#000000',
                  }}
                >
                  SOON
                </span>
              </button>
            );
          })()}

          {/* Clean Dropdown for upcoming expansion corridors */}
          <div ref={upcomingDropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowUpcomingDropdown((prev) => !prev)}
              style={{
                padding: '5px 11px',
                borderRadius: '980px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: '1px dashed var(--border-subtle)',
                cursor: 'pointer',
                background: showUpcomingDropdown ? 'rgba(255, 255, 255, 0.08)' : 'var(--tab-badge-inactive-bg)',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.18s ease',
              }}
              title="Explore 5 upcoming Indian tech corridor expansions"
            >
              <span className="radar-beacon" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#FF9F0A' }} />
              <span>More Hubs (5)</span>
              <ChevronDown
                style={{
                  width: '11px',
                  height: '11px',
                  transform: showUpcomingDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.18s ease',
                  color: 'var(--text-tertiary)',
                }}
              />
            </button>

            {/* Dropdown Floating Menu */}
            {showUpcomingDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  left: 0,
                  zIndex: 100,
                  width: '240px',
                  borderRadius: '14px',
                  background: 'var(--card-bg, #121218)',
                  backdropFilter: 'blur(30px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(180%)',
                  border: '1px solid var(--border-subtle, rgba(255, 255, 255, 0.12))',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                }}
              >
                <div style={{ padding: '6px 10px 4px', fontSize: '10px', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Upcoming Expansions
                </div>
                {UPCOMING_CORRIDORS.map((corridor) => {
                  const isSelected = selectedHub === corridor.id;
                  return (
                    <button
                      key={corridor.id}
                      onClick={() => {
                        setSelectedHub(corridor.id);
                        setSelectedSector('all');
                        setSelectedSubRegion('all');
                        setShowUpcomingDropdown(false);
                      }}
                      className="hover-lift"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '7px 10px',
                        borderRadius: '8px',
                        border: isSelected ? `1px solid ${corridor.color}60` : '1px solid transparent',
                        background: isSelected ? `${corridor.color}15` : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: corridor.color }} />
                        <span style={{ fontSize: '12px', fontWeight: isSelected ? 700 : 550, color: isSelected ? corridor.color : 'var(--text-primary)' }}>
                          {corridor.id === 'gift-city' ? 'GIFT City' : corridor.id.charAt(0).toUpperCase() + corridor.id.slice(1)}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: `${corridor.color}20`,
                          color: corridor.color,
                        }}
                      >
                        SOON
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Unified Career Track & Domain Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Domain Track Isolation Segmented Toggle */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'var(--tab-badge-inactive-bg)',
              padding: '3px',
              borderRadius: '980px',
              border: '1px solid var(--border-subtle)',
              gap: '3px',
            }}
          >
            <button
              onClick={() => setDomainOnlyFilter(true)}
              style={{
                padding: '4px 11px',
                borderRadius: '980px',
                fontSize: '11.5px',
                fontWeight: domainOnlyFilter ? 700 : 500,
                border: domainOnlyFilter ? `1px solid ${activeDomain.accentColor}60` : '1px solid transparent',
                cursor: 'pointer',
                background: domainOnlyFilter ? activeDomain.accentGradient : 'transparent',
                color: domainOnlyFilter ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: domainOnlyFilter ? `0 2px 8px ${activeDomain.accentColor}40` : 'none',
                transition: 'all 0.18s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title={`Filter board strictly to verified ${activeDomain.title} companies & roles`}
            >
              <span style={{ fontSize: '12px' }}>{activeDomain.icon}</span>
              <span>{activeDomain.title.split('&')[0].trim()} Only</span>
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 5px',
                  borderRadius: '980px',
                  background: domainOnlyFilter ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  color: domainOnlyFilter ? '#ffffff' : 'var(--text-tertiary)',
                  fontWeight: 700,
                }}
              >
                {domainMatchingCount}
              </span>
            </button>

            <button
              onClick={() => setDomainOnlyFilter(false)}
              style={{
                padding: '4px 11px',
                borderRadius: '980px',
                fontSize: '11.5px',
                fontWeight: !domainOnlyFilter ? 700 : 500,
                border: !domainOnlyFilter ? '1px solid rgba(10, 132, 255, 0.4)' : '1px solid transparent',
                cursor: 'pointer',
                background: !domainOnlyFilter ? 'var(--accent-blue)' : 'transparent',
                color: !domainOnlyFilter ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: !domainOnlyFilter ? '0 2px 8px rgba(10, 132, 255, 0.35)' : 'none',
                transition: 'all 0.18s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Show all companies across all tech disciplines"
            >
              <Globe style={{ width: '11px', height: '11px' }} />
              <span>All ({jobs.length})</span>
            </button>
          </div>

          {/* Quick Switch Career Track */}
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="btn-glass hover-lift"
              style={{
                padding: '4px 10px',
                borderRadius: '980px',
                fontSize: '11.5px',
                fontWeight: 650,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--tab-badge-inactive-bg)',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              title={`Switch Career Track (Active: ${activeDomain.title})`}
            >
              <Compass style={{ width: '12px', height: '12px', color: activeDomain.accentColor }} />
              <span>Track</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Corridor Stream View */}
      <div
        key={`corridor-stream-${selectedHub}`}
        style={{ position: 'relative', width: '100%' }}
      >
        {/* ── Tier 2: Pipeline States & Search Actions Toolbar ── */}
        {!isUpcomingCorridor(selectedHub) && (
          <div
            style={{
              padding: '12px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left: Segmented Pipeline Status (Available / Applied / Live) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--tab-badge-inactive-bg)',
                padding: '3px',
                borderRadius: '980px',
                border: '1px solid var(--border-subtle)',
                gap: '3px',
              }}
            >
              {/* 1. Available Portals */}
              <button
                onClick={() => setPipelineView('available')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  background: pipelineView === 'available' ? 'var(--accent-blue)' : 'transparent',
                  color: pipelineView === 'available' ? '#ffffff' : 'var(--text-secondary)',
                  boxShadow: pipelineView === 'available' ? '0 2px 8px rgba(10, 132, 255, 0.35)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Building2 style={{ width: '12px', height: '12px' }} />
                <span>Available Portals</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    padding: '1px 6px',
                    borderRadius: '980px',
                    background: pipelineView === 'available' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: pipelineView === 'available' ? '#ffffff' : 'var(--text-tertiary)',
                    fontWeight: 700,
                  }}
                >
                  {availableJobs.length}
                </span>
              </button>

              {/* 2. Applied & Cooldown (7d) */}
              <button
                onClick={() => setPipelineView('applied')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: pipelineView === 'applied' ? '1px solid rgba(255, 159, 10, 0.4)' : '1px solid transparent',
                  cursor: 'pointer',
                  background: pipelineView === 'applied' ? 'rgba(255, 159, 10, 0.16)' : 'transparent',
                  color: pipelineView === 'applied' ? '#FF9F0A' : 'var(--text-secondary)',
                  boxShadow: pipelineView === 'applied' ? '0 2px 10px rgba(255, 159, 10, 0.2)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Companies you applied to. Auto-resets back to Available after 7 days."
              >
                <Clock style={{ width: '12px', height: '12px', color: pipelineView === 'applied' ? '#FF9F0A' : 'inherit' }} />
                <span>Applied & Cooldown (7d)</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    padding: '1px 6px',
                    borderRadius: '980px',
                    background: pipelineView === 'applied' ? '#FF9F0A' : 'rgba(255, 255, 255, 0.08)',
                    color: pipelineView === 'applied' ? '#000000' : 'var(--text-tertiary)',
                    fontWeight: 700,
                  }}
                >
                  {appliedJobs.length}
                </span>
              </button>

              {/* 3. Live Openings */}
              <button
                onClick={() => setPipelineView('live')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '980px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: pipelineView === 'live' ? '1px solid rgba(48, 209, 88, 0.45)' : '1px solid transparent',
                  cursor: 'pointer',
                  background: pipelineView === 'live' ? 'rgba(48, 209, 88, 0.18)' : 'transparent',
                  color: pipelineView === 'live' ? 'var(--accent-green)' : 'var(--text-secondary)',
                  boxShadow: pipelineView === 'live' ? '0 2px 10px rgba(48, 209, 88, 0.25)' : 'none',
                  transition: 'all 0.18s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                title="Filter directly to companies with verified live job openings"
              >
                <span className="live-pulse-indicator" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                <span>Live Openings</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontFamily: 'var(--font-mono)',
                    padding: '1px 6px',
                    borderRadius: '980px',
                    background: pipelineView === 'live' ? '#30D158' : 'rgba(255, 255, 255, 0.08)',
                    color: pipelineView === 'live' ? '#000000' : 'var(--text-tertiary)',
                    fontWeight: 700,
                  }}
                >
                  {totalLiveRolesCount}
                </span>
              </button>
            </div>

            {/* Right: Search + Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Search Box */}
              <div style={{ position: 'relative', width: '270px' }}>
                <Search
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '13px',
                    height: '13px',
                    color: searchQuery ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                    transition: 'color 0.15s ease',
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={
                    pipelineView === 'live'
                      ? `Search ${totalLiveRolesCount} live openings... (/)`
                      : `Search ${targetJobs.length} companies... (/)`
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                      searchInputRef.current?.blur();
                    }
                  }}
                  style={{
                    width: '100%',
                    paddingLeft: '32px',
                    paddingRight: searchQuery ? '75px' : '12px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    fontSize: '12px',
                    borderRadius: '980px',
                    borderColor: searchQuery ? 'rgba(10, 132, 255, 0.4)' : undefined,
                    boxShadow: searchQuery ? '0 0 12px rgba(10, 132, 255, 0.15)' : undefined,
                    transition: 'all 0.15s ease',
                  }}
                />
                {searchQuery && (
                  <div
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        color: filteredAndSortedJobs.length > 0 ? 'var(--accent-blue)' : '#FF453A',
                        background: filteredAndSortedJobs.length > 0 ? 'rgba(10, 132, 255, 0.12)' : 'rgba(255, 69, 58, 0.12)',
                        padding: '1px 5px',
                        borderRadius: '980px',
                        fontWeight: 700,
                      }}
                      title={`${filteredAndSortedJobs.length} matching companies found`}
                    >
                      {filteredAndSortedJobs.length}
                    </span>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '50%',
                      }}
                      title="Clear search (Esc)"
                    >
                      <X style={{ width: '12px', height: '12px' }} />
                    </button>
                  </div>
                )}
              </div>

              {/* Expand/Collapse All Openings */}
              {totalLiveRolesCount > 0 && (
                <button
                  onClick={handleToggleExpandAll}
                  className="btn-glass"
                  style={{
                    fontSize: '11.5px',
                    padding: '6px 11px',
                    color: expandedJobIds.size > 0 ? 'var(--accent-green)' : 'var(--text-secondary)',
                    borderColor: expandedJobIds.size > 0 ? 'rgba(48, 209, 88, 0.4)' : 'var(--border-subtle)',
                    background: expandedJobIds.size > 0 ? 'rgba(48, 209, 88, 0.1)' : undefined,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 500,
                    borderRadius: '980px',
                  }}
                  title="Expand or collapse all live role cards across companies"
                >
                  <Layers style={{ width: '12px', height: '12px' }} />
                  <span>{expandedJobIds.size > 0 ? 'Collapse' : 'Expand All'}</span>
                </button>
              )}

              {onSyncLiveJobs && (
                <button
                  onClick={() => {
                    setShowScannerHUD(true);
                    onSyncLiveJobs();
                  }}
                  disabled={isSyncingLive}
                  className="btn-glass"
                  style={{
                    fontSize: '11.5px',
                    padding: '6px 13px',
                    color: 'var(--accent-green)',
                    borderColor: 'rgba(48, 209, 88, 0.4)',
                    background: 'rgba(48, 209, 88, 0.1)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 600,
                    borderRadius: '980px',
                    boxShadow: isSyncingLive ? '0 0 14px rgba(48, 209, 88, 0.4)' : 'none',
                  }}
                  title="Scrape & fetch live open roles across Greenhouse, Ashby, Lever, Amazon"
                >
                  <Zap
                    style={{
                      width: '12px',
                      height: '12px',
                      animation: isSyncingLive ? 'spin 1s linear infinite' : 'none',
                    }}
                  />
                  <span>{isSyncingLive ? 'Scanning...' : 'Fetch Live Roles'}</span>
                </button>
              )}

              {onResetTracker && appliedJobs.length > 0 && (
                <button
                  onClick={onResetTracker}
                  className="btn-glass"
                  style={{ fontSize: '11px', padding: '5px 10px', color: 'var(--text-tertiary)', borderRadius: '980px' }}
                  title="Reset all applied statuses back to Available"
                >
                  <RotateCcw style={{ width: '11px', height: '11px' }} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>
        )}

      {/* All Verified Tech Hubs Corridor Hero Banner & Sector Pills */}
      {selectedHub === 'all' && (
        <div
          style={{
            padding: '20px 28px',
            background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.08) 0%, rgba(0, 199, 190, 0.06) 45%, rgba(191, 90, 242, 0.05) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Header Row: Title & Corridor Quick Filter */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#64D2FF',
                    background: 'rgba(10, 132, 255, 0.15)',
                    border: '1px solid rgba(10, 132, 255, 0.35)',
                    padding: '2px 9px',
                    borderRadius: '980px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Layers style={{ width: '10px', height: '10px' }} />
                  <GlitchText text="Pan-India & Global Tech Corridors" trigger={selectedHub} />
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  <GlitchText text="Delhi NCR · Bengaluru · Remote & Distributed · 100% Direct Verification" trigger={selectedHub} />
                </span>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '21px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                <GlitchText text="All Tech Corridors" trigger={selectedHub} />
              </h3>
              <p
                style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}
              >
                <GlitchText
                  text="Unified directory of direct verified career portals across Delhi NCR, Bengaluru Silicon Hub, and global remote engineering organizations."
                  trigger={selectedHub}
                />
              </p>
            </div>

            {/* Hub Quick Jump */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Filter by Hub:</span>
              {[
                { id: 'all', label: 'All Hubs', count: jobs.length },
                { id: 'delhi-ncr', label: 'Delhi NCR', count: ncrTotalCount },
                { id: 'bengaluru', label: 'Bengaluru', count: blrTotalCount },
                { id: 'remote', label: 'Remote', count: remoteTotalCount },
              ].map((h) => {
                const active = selectedHub === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => {
                      setSelectedHub(h.id as CorridorHub);
                      setSelectedSector('all');
                      setSelectedSubRegion('all');
                    }}
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: '980px',
                      fontWeight: active ? 700 : 500,
                      background: active ? 'rgba(10, 132, 255, 0.18)' : 'transparent',
                      color: active ? '#64D2FF' : 'var(--text-tertiary)',
                      borderColor: active ? 'rgba(10, 132, 255, 0.4)' : 'transparent',
                    }}
                  >
                    <span>{h.label}</span>
                    <span style={{ opacity: 0.7, fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}>({h.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sector Filter Strip for All Hubs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Filter style={{ width: '12px', height: '12px' }} />
              Sector:
            </span>

            {/* All Sectors Pill */}
            <button
              onClick={() => setSelectedSector('all')}
              style={{
                fontSize: '12px',
                padding: '5px 13px',
                borderRadius: '980px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedSector === 'all' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                background: selectedSector === 'all' ? 'var(--text-primary)' : 'var(--tab-badge-inactive-bg)',
                color: selectedSector === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                boxShadow: selectedSector === 'all' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              All Sectors ({jobs.length})
            </button>

            {/* The 5 Sectors */}
            {[
              { id: 'FAANG/MNC', label: 'FAANG / MNC', color: '#BF5AF2' },
              { id: 'Fintech', label: 'Fintech', color: '#30D158' },
              { id: 'Consumer', label: 'Consumer', color: '#FF9F0A' },
              { id: 'SaaS', label: 'SaaS', color: '#0A84FF' },
              { id: 'Infra/AI', label: 'Infra / AI', color: '#00C7BE' },
            ].map((sec) => {
              const count = allSectorCounts[sec.id] || 0;
              const active = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    fontSize: '12px',
                    padding: '5px 13px',
                    borderRadius: '980px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? `1px solid ${sec.color}` : '1px solid var(--border-subtle)',
                    background: active ? `rgba(${sec.id === 'Fintech' ? '48, 209, 88' : sec.id === 'Consumer' ? '255, 159, 10' : sec.id === 'SaaS' ? '10, 132, 255' : sec.id === 'Infra/AI' ? '0, 199, 190' : '191, 90, 242'}, 0.16)` : 'var(--tab-badge-inactive-bg)',
                    color: active ? sec.color : 'var(--text-secondary)',
                    boxShadow: active ? `0 2px 10px ${sec.color}33` : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sec.color }} />
                  <span>{sec.label}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 6px',
                      borderRadius: '980px',
                      background: active ? sec.color : 'rgba(255, 255, 255, 0.08)',
                      color: active ? (sec.id === 'Fintech' || sec.id === 'Infra/AI' ? '#000000' : '#ffffff') : 'var(--text-tertiary)',
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Delhi NCR Corridor Hero Banner & Sector Pills */}
      {selectedHub === 'delhi-ncr' && (
        <div
          style={{
            padding: '20px 28px',
            background: 'linear-gradient(135deg, rgba(255, 45, 85, 0.05) 0%, rgba(191, 90, 242, 0.05) 45%, rgba(10, 132, 255, 0.04) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Header Row: Title & Subregion Switcher */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#FF375F',
                    background: 'rgba(255, 45, 85, 0.14)',
                    border: '1px solid rgba(255, 45, 85, 0.35)',
                    padding: '2px 9px',
                    borderRadius: '980px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <MapPin style={{ width: '10px', height: '10px' }} />
                  <GlitchText text="North India Tech Capital" trigger={selectedHub} />
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  <GlitchText text="Cyber City · Golf Course Rd · Noida Expressway · Aerocity" trigger={selectedHub} />
                </span>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '21px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                <GlitchText text="Delhi NCR Tech Corridor" trigger={selectedHub} />
              </h3>
              <p
                style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}
              >
                <GlitchText
                  text="Direct verified career portals for Tier-1 Product, Fintech, Consumer, SaaS, and Infra/AI powerhouses across Gurugram, Noida, and New Delhi."
                  trigger={selectedHub}
                />
              </p>
            </div>

            {/* Sub-region Quick Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Location:</span>
              {(['all', 'Gurugram', 'Noida', 'New Delhi'] as const).map((region) => {
                const count = region === 'all' ? ncrTotalCount : ncrSubRegionCounts[region] || 0;
                const active = selectedSubRegion === region;
                return (
                  <button
                    key={region}
                    onClick={() => setSelectedSubRegion(region)}
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: '980px',
                      fontWeight: active ? 700 : 500,
                      background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      borderColor: active ? 'var(--border-subtle)' : 'transparent',
                    }}
                  >
                    <span>{region === 'all' ? 'All NCR' : region}</span>
                    <span style={{ opacity: 0.7, fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sector Filter Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Filter style={{ width: '12px', height: '12px' }} />
              Sector:
            </span>

            {/* All Sectors Pill */}
            <button
              onClick={() => setSelectedSector('all')}
              style={{
                fontSize: '12px',
                padding: '5px 13px',
                borderRadius: '980px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedSector === 'all' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                background: selectedSector === 'all' ? 'var(--text-primary)' : 'var(--tab-badge-inactive-bg)',
                color: selectedSector === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                boxShadow: selectedSector === 'all' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              All Sectors ({ncrTotalCount})
            </button>

            {/* The 5 User Sectors */}
            {[
              { id: 'FAANG/MNC', label: 'FAANG / MNC', color: '#BF5AF2' },
              { id: 'Fintech', label: 'Fintech', color: '#30D158' },
              { id: 'Consumer', label: 'Consumer', color: '#FF9F0A' },
              { id: 'SaaS', label: 'SaaS', color: '#0A84FF' },
              { id: 'Infra/AI', label: 'Infra / AI', color: '#00C7BE' },
            ].map((sec) => {
              const count = ncrSectorCounts[sec.id] || 0;
              const active = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    fontSize: '12px',
                    padding: '5px 13px',
                    borderRadius: '980px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? `1px solid ${sec.color}` : '1px solid var(--border-subtle)',
                    background: active ? `rgba(${sec.id === 'Fintech' ? '48, 209, 88' : sec.id === 'Consumer' ? '255, 159, 10' : sec.id === 'SaaS' ? '10, 132, 255' : sec.id === 'Infra/AI' ? '0, 199, 190' : '191, 90, 242'}, 0.16)` : 'var(--tab-badge-inactive-bg)',
                    color: active ? sec.color : 'var(--text-secondary)',
                    boxShadow: active ? `0 2px 10px ${sec.color}33` : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sec.color }} />
                  <span>{sec.label}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 6px',
                      borderRadius: '980px',
                      background: active ? sec.color : 'rgba(255, 255, 255, 0.08)',
                      color: active ? (sec.id === 'Fintech' || sec.id === 'Infra/AI' ? '#000000' : '#ffffff') : 'var(--text-tertiary)',
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bengaluru Silicon Hub Corridor Banner & Sector Pills */}
      {selectedHub === 'bengaluru' && (
        <div
          style={{
            padding: '20px 28px',
            background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.07) 0%, rgba(0, 199, 190, 0.05) 45%, rgba(10, 132, 255, 0.04) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Header Row: Title & Subregion Switcher */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#30D158',
                    background: 'rgba(48, 209, 88, 0.14)',
                    border: '1px solid rgba(48, 209, 88, 0.35)',
                    padding: '2px 9px',
                    borderRadius: '980px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Compass style={{ width: '10px', height: '10px' }} />
                  <GlitchText text="India's Silicon Capital" trigger={selectedHub} />
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  <GlitchText text="Outer Ring Rd · Bellandur · Koramangala · Indiranagar · Whitefield" trigger={selectedHub} />
                </span>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '21px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                <GlitchText text="Bengaluru Silicon Corridor" trigger={selectedHub} />
              </h3>
              <p
                style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}
              >
                <GlitchText
                  text="Direct verified career portals for tech powerhouses across Outer Ring Road, Bellandur, Koramangala, Indiranagar, and Whitefield."
                  trigger={selectedHub}
                />
              </p>
            </div>

            {/* Sub-region Quick Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Tech Hub:</span>
              {[
                { id: 'all', label: 'All Bengaluru', count: blrTotalCount },
                { id: 'Outer Ring Road', label: 'Outer Ring Rd / Bellandur', count: blrSubRegionCounts['Outer Ring Road'] || 0 },
                { id: 'Indiranagar & CBD', label: 'Indiranagar & CBD', count: blrSubRegionCounts['Indiranagar & CBD'] || 0 },
                { id: 'Koramangala & HSR', label: 'Koramangala & HSR', count: blrSubRegionCounts['Koramangala & HSR'] || 0 },
                { id: 'Whitefield', label: 'Whitefield', count: blrSubRegionCounts['Whitefield'] || 0 },
              ].map((item) => {
                const active = selectedSubRegion === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSubRegion(item.id)}
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: '980px',
                      fontWeight: active ? 700 : 500,
                      background: active ? 'rgba(48, 209, 88, 0.16)' : 'transparent',
                      color: active ? 'var(--accent-green)' : 'var(--text-tertiary)',
                      borderColor: active ? 'rgba(48, 209, 88, 0.4)' : 'transparent',
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ opacity: 0.7, fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}>({item.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sector Filter Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Filter style={{ width: '12px', height: '12px' }} />
              Sector:
            </span>

            {/* All Sectors Pill */}
            <button
              onClick={() => setSelectedSector('all')}
              style={{
                fontSize: '12px',
                padding: '5px 13px',
                borderRadius: '980px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedSector === 'all' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                background: selectedSector === 'all' ? 'var(--text-primary)' : 'var(--tab-badge-inactive-bg)',
                color: selectedSector === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                boxShadow: selectedSector === 'all' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              All Sectors ({blrTotalCount})
            </button>

            {/* The 5 Sectors */}
            {[
              { id: 'FAANG/MNC', label: 'FAANG / MNC', color: '#BF5AF2' },
              { id: 'Fintech', label: 'Fintech', color: '#30D158' },
              { id: 'Consumer', label: 'Consumer', color: '#FF9F0A' },
              { id: 'SaaS', label: 'SaaS', color: '#0A84FF' },
              { id: 'Infra/AI', label: 'Infra / AI', color: '#00C7BE' },
            ].map((sec) => {
              const count = blrSectorCounts[sec.id] || 0;
              const active = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    fontSize: '12px',
                    padding: '5px 13px',
                    borderRadius: '980px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? `1px solid ${sec.color}` : '1px solid var(--border-subtle)',
                    background: active ? `rgba(${sec.id === 'Fintech' ? '48, 209, 88' : sec.id === 'Consumer' ? '255, 159, 10' : sec.id === 'SaaS' ? '10, 132, 255' : sec.id === 'Infra/AI' ? '0, 199, 190' : '191, 90, 242'}, 0.16)` : 'var(--tab-badge-inactive-bg)',
                    color: active ? sec.color : 'var(--text-secondary)',
                    boxShadow: active ? `0 2px 10px ${sec.color}33` : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sec.color }} />
                  <span>{sec.label}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 6px',
                      borderRadius: '980px',
                      background: active ? sec.color : 'rgba(255, 255, 255, 0.08)',
                      color: active ? (sec.id === 'Fintech' || sec.id === 'Infra/AI' ? '#000000' : '#ffffff') : 'var(--text-tertiary)',
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Remote Worldwide Corridor Banner & Sector Pills */}
      {selectedHub === 'remote' && (
        <div
          style={{
            padding: '20px 28px',
            background: 'linear-gradient(135deg, rgba(191, 90, 242, 0.06) 0%, rgba(10, 132, 255, 0.05) 45%, rgba(0, 199, 190, 0.04) 100%)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Header Row: Title & Subregion Switcher */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#BF5AF2',
                    background: 'rgba(191, 90, 242, 0.14)',
                    border: '1px solid rgba(191, 90, 242, 0.35)',
                    padding: '2px 9px',
                    borderRadius: '980px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Globe style={{ width: '10px', height: '10px' }} />
                  <GlitchText text="Global Distributed Workforce" trigger={selectedHub} />
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>•</span>
                <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  <GlitchText text="100% Remote · Global Compensation · Async Engineering Culture · Zero Commute" trigger={selectedHub} />
                </span>
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '21px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                <GlitchText text="Remote & Distributed Tech Corridor" trigger={selectedHub} />
              </h3>
              <p
                style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '820px', lineHeight: 1.5 }}
              >
                <GlitchText
                  text="Direct verified career portals for remote-first innovators, US/EU distributed unicorns, and borderless engineering teams. Work from anywhere in India or worldwide."
                  trigger={selectedHub}
                />
              </p>
            </div>

            {/* Timezone / Model Quick Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Timezone / Scope:</span>
              {[
                { id: 'all', label: 'All Remote', count: remoteTotalCount },
                { id: 'Global Remote', label: 'Global / Worldwide', count: remoteSubRegionCounts['Global Remote'] || 0 },
                { id: 'US & EU Async', label: 'US & EU Async', count: remoteSubRegionCounts['US & EU Async'] || 0 },
                { id: 'India Remote', label: 'India Remote', count: remoteSubRegionCounts['India Remote'] || 0 },
              ].map((item) => {
                const active = selectedSubRegion === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSubRegion(item.id)}
                    className="btn-glass"
                    style={{
                      fontSize: '11.5px',
                      padding: '4px 10px',
                      borderRadius: '980px',
                      fontWeight: active ? 700 : 500,
                      background: active ? 'rgba(191, 90, 242, 0.16)' : 'transparent',
                      color: active ? 'var(--accent-purple)' : 'var(--text-tertiary)',
                      borderColor: active ? 'rgba(191, 90, 242, 0.4)' : 'transparent',
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ opacity: 0.7, fontSize: '10.5px', fontFamily: 'var(--font-mono)' }}>({item.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sector Filter Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Filter style={{ width: '12px', height: '12px' }} />
              Sector:
            </span>

            {/* All Sectors Pill */}
            <button
              onClick={() => setSelectedSector('all')}
              style={{
                fontSize: '12px',
                padding: '5px 13px',
                borderRadius: '980px',
                fontWeight: 600,
                cursor: 'pointer',
                border: selectedSector === 'all' ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                background: selectedSector === 'all' ? 'var(--text-primary)' : 'var(--tab-badge-inactive-bg)',
                color: selectedSector === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                boxShadow: selectedSector === 'all' ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              All Sectors ({remoteTotalCount})
            </button>

            {/* The 5 Sectors */}
            {[
              { id: 'Infra/AI', label: 'Infra / AI', color: '#00C7BE' },
              { id: 'SaaS', label: 'SaaS', color: '#0A84FF' },
              { id: 'Fintech', label: 'Fintech', color: '#30D158' },
              { id: 'Consumer', label: 'Consumer', color: '#FF9F0A' },
              { id: 'FAANG/MNC', label: 'FAANG / MNC', color: '#BF5AF2' },
            ].map((sec) => {
              const count = remoteSectorCounts[sec.id] || 0;
              const active = selectedSector === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    fontSize: '12px',
                    padding: '5px 13px',
                    borderRadius: '980px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? `1px solid ${sec.color}` : '1px solid var(--border-subtle)',
                    background: active ? `rgba(${sec.id === 'Fintech' ? '48, 209, 88' : sec.id === 'Consumer' ? '255, 159, 10' : sec.id === 'SaaS' ? '10, 132, 255' : sec.id === 'Infra/AI' ? '0, 199, 190' : '191, 90, 242'}, 0.16)` : 'var(--tab-badge-inactive-bg)',
                    color: active ? sec.color : 'var(--text-secondary)',
                    boxShadow: active ? `0 2px 10px ${sec.color}33` : 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: sec.color }} />
                  <span>{sec.label}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontFamily: 'var(--font-mono)',
                      padding: '1px 6px',
                      borderRadius: '980px',
                      background: active ? sec.color : 'rgba(255, 255, 255, 0.08)',
                      color: active ? (sec.id === 'Fintech' || sec.id === 'Infra/AI' ? '#000000' : '#ffffff') : 'var(--text-tertiary)',
                      fontWeight: 700,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Corridor View: Either Upcoming Corridor Showcase or Live Endpoints Table */}
      {isUpcomingCorridor(selectedHub) ? (
        <ComingSoonCorridorView
          corridor={UPCOMING_CORRIDOR_MAP[selectedHub]}
          onSelectHub={setSelectedHub}
        />
      ) : (
        <>
        {/* Live Scanner HUD banner */}
        {(showScannerHUD || isSyncingLive) && (
          <div style={{ padding: '16px 28px 4px 28px' }}>
            <LiveScannerHUD
              isScanning={Boolean(isSyncingLive)}
              lastSyncStats={lastSyncStats || null}
              onFilterLiveOnly={() => setPipelineView(pipelineView === 'live' ? 'available' : 'live')}
              onExpandAllLive={handleToggleExpandAll}
              isLiveOnlyActive={pipelineView === 'live'}
              onClose={() => setShowScannerHUD(false)}
            />
          </div>
        )}

        {/* Intelligent Search Scope Notice Banner */}
        {searchQuery && searchScopeInfo.isExpandedGlobally && (
          <div
            style={{
              margin: '8px 28px 12px 28px',
              padding: '10px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(90deg, rgba(10, 132, 255, 0.12) 0%, rgba(94, 92, 230, 0.08) 100%)',
              border: '1px solid rgba(10, 132, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles style={{ width: '16px', height: '16px', color: 'var(--accent-blue)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                No matches in active corridor/sector filter. Seamlessly showing <strong>{filteredAndSortedJobs.length}</strong> matching {filteredAndSortedJobs.length === 1 ? 'company' : 'companies'} found across <strong>all portals</strong>.
              </span>
            </div>
            <button
              onClick={() => {
                setSelectedHub('all');
                setSelectedSector('all');
                setSelectedSubRegion('all');
              }}
              className="btn-glass"
              style={{
                fontSize: '11.5px',
                padding: '5px 14px',
                borderRadius: '980px',
                color: 'var(--accent-blue)',
                borderColor: 'rgba(10, 132, 255, 0.35)',
                fontWeight: 600,
              }}
            >
              Reset Filters to All Corridors
            </button>
          </div>
        )}

        {searchQuery && !searchScopeInfo.isExpandedGlobally && searchScopeInfo.otherCorridorsCount > 0 && (
          <div
            style={{
              margin: '8px 28px 12px 28px',
              padding: '8px 16px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Showing {filteredAndSortedJobs.length} in current view · <strong style={{ color: 'var(--accent-blue)' }}>+{searchScopeInfo.otherCorridorsCount}</strong> more matching {searchScopeInfo.otherCorridorsCount === 1 ? 'company' : 'companies'} found across other corridors
            </span>
            <button
              onClick={() => {
                setSelectedHub('all');
                setSelectedSector('all');
                setSelectedSubRegion('all');
              }}
              className="btn-glass"
              style={{
                fontSize: '11.5px',
                padding: '4px 12px',
                borderRadius: '980px',
                color: 'var(--accent-blue)',
                borderColor: 'rgba(10, 132, 255, 0.3)',
              }}
            >
              View All ({filteredAndSortedJobs.length + searchScopeInfo.otherCorridorsCount})
            </button>
          </div>
        )}

        {/* Table: Company | Sector | Match | Action */}
        <div style={{ overflowX: 'auto' }}>
          <table className="glass-table" style={{ width: '100%', tableLayout: 'fixed', minWidth: '920px' }}>
          <colgroup>
            <col style={{ width: '44%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '22%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ paddingLeft: '28px', paddingRight: '16px', width: '44%' }}>Company</th>
              <th style={{ paddingLeft: '16px', paddingRight: '16px', width: '18%' }}>Industry Sector</th>
              <th
                onClick={toggleSort}
                style={{ cursor: 'pointer', userSelect: 'none', paddingLeft: '16px', paddingRight: '16px', width: '16%' }}
                title="Click to toggle sort order"
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span>Match</span>
                  <ArrowUpDown style={{ width: '12px', height: '12px', opacity: 0.7 }} />
                  <span style={{ fontSize: '10px', color: 'var(--accent-blue)' }}>
                    ({sortOrder === 'desc' ? 'Top first' : 'Lowest first'})
                  </span>
                </div>
              </th>
              <th style={{ textAlign: 'right', paddingRight: '28px', paddingLeft: '16px', width: '22%' }}>
                {pipelineView === 'applied' ? 'Status & Action' : 'Action'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedJobs.map((job) => {
              const hasLiveJobs = Boolean(job.liveJobs && job.liveJobs.length > 0);
              const liveCount = job.liveJobs?.length || 0;
              const isExpanded = expandedJobIds.has(job.id);
              const cooldownInfo = getCooldownInfo(job.appliedAt);

              return (
                <React.Fragment key={job.id}>
                  <tr
                    onClick={() => onSelectJob(job)}
                    style={{
                      cursor: 'pointer',
                      background: isExpanded ? 'rgba(255, 255, 255, 0.02)' : undefined,
                    }}
                  >
                    <td style={{ paddingLeft: '28px', paddingRight: '16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                        <div style={{ flexShrink: 0 }}>
                          <CompanyLogo
                            company={job.company}
                            logoUrl={job.companyLogo}
                            domain={job.domain}
                            size={38}
                          />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: '15px',
                                color: 'var(--text-primary)',
                                letterSpacing: '-0.01em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <GlitchText text={job.company} trigger={selectedHub} duration={240} />
                            </span>

                            {/* Intelligent Search Match Badge */}
                            {searchQuery && searchMatchMap[job.id]?.badgeLabel && (
                              <span
                                style={{
                                  fontSize: '10.5px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono)',
                                  padding: '1px 8px',
                                  borderRadius: '980px',
                                  flexShrink: 0,
                                  whiteSpace: 'nowrap',
                                  background: searchMatchMap[job.id].matchType === 'alias'
                                    ? 'rgba(191, 90, 242, 0.15)'
                                    : searchMatchMap[job.id].matchType === 'fuzzy_typo'
                                    ? 'rgba(255, 159, 10, 0.15)'
                                    : searchMatchMap[job.id].matchType === 'required_skill' || searchMatchMap[job.id].matchType === 'tech_synonym'
                                    ? 'rgba(10, 132, 255, 0.15)'
                                    : 'rgba(48, 209, 88, 0.15)',
                                  color: searchMatchMap[job.id].matchType === 'alias'
                                    ? 'var(--accent-purple)'
                                    : searchMatchMap[job.id].matchType === 'fuzzy_typo'
                                    ? '#FF9F0A'
                                    : searchMatchMap[job.id].matchType === 'required_skill' || searchMatchMap[job.id].matchType === 'tech_synonym'
                                    ? 'var(--accent-blue)'
                                    : 'var(--accent-green)',
                                  border: `1px solid ${
                                    searchMatchMap[job.id].matchType === 'alias'
                                      ? 'rgba(191, 90, 242, 0.35)'
                                      : searchMatchMap[job.id].matchType === 'fuzzy_typo'
                                      ? 'rgba(255, 159, 10, 0.35)'
                                      : searchMatchMap[job.id].matchType === 'required_skill' || searchMatchMap[job.id].matchType === 'tech_synonym'
                                      ? 'rgba(10, 132, 255, 0.35)'
                                      : 'rgba(48, 209, 88, 0.35)'
                                  }`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {searchMatchMap[job.id].badgeLabel}
                              </span>
                            )}

                            {hasLiveJobs && (
                              <button
                                onClick={(e) => toggleExpand(e, job.id)}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-mono)',
                                  background: 'rgba(48, 209, 88, 0.12)',
                                  color: 'var(--accent-green)',
                                  border: '1px solid rgba(48, 209, 88, 0.35)',
                                  padding: '2px 8px',
                                  borderRadius: '980px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  flexShrink: 0,
                                  whiteSpace: 'nowrap',
                                }}
                                title="Click to view live positions for this company"
                              >
                                <span className="live-pulse-indicator" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                                <span>{liveCount} Live {liveCount === 1 ? 'Role' : 'Roles'}</span>
                                <ChevronDown
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                  }}
                                />
                              </button>
                            )}
                          </div>

                          {hasLiveJobs && job.liveJobs && job.liveJobs.length > 0 && job.liveJobs[0]?.title && (
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                                marginTop: '3px',
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: 0,
                              }}
                            >
                              <span
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '380px',
                                  display: 'inline-block',
                                }}
                                title={job.liveJobs[0].title}
                              >
                                <GlitchText
                                  text={job.liveJobs[0].title}
                                  trigger={selectedHub}
                                  duration={250}
                                />
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ paddingLeft: '16px', paddingRight: '16px', verticalAlign: 'middle' }}>
                      {(() => {
                        const badgeStyle = getSectorBadgeStyle(job.sector || job.category);
                        return (
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                padding: '4px 12px',
                                borderRadius: '980px',
                                background: badgeStyle.bg,
                                color: badgeStyle.color,
                                fontFamily: 'var(--font-body)',
                                fontWeight: 600,
                                border: badgeStyle.border,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badgeStyle.dot, flexShrink: 0 }} />
                              <span>
                                <GlitchText text={job.sector || job.category} trigger={selectedHub} duration={240} />
                              </span>
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td style={{ paddingLeft: '16px', paddingRight: '16px', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '52px',
                            height: '5px',
                            borderRadius: '3px',
                            background: 'var(--border-subtle)',
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: `${job.vectorScore}%`,
                              height: '100%',
                              background:
                                job.vectorScore >= 90
                                  ? 'linear-gradient(90deg, #30D158, #00C7BE)'
                                  : job.vectorScore >= 80
                                  ? 'linear-gradient(90deg, #0077ED, #64D2FF)'
                                  : 'var(--text-tertiary)',
                            }}
                          />
                        </div>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color:
                              job.vectorScore >= 90
                                ? 'var(--accent-green)'
                                : job.vectorScore >= 80
                                ? 'var(--accent-blue)'
                                : 'var(--text-tertiary)',
                            flexShrink: 0,
                          }}
                        >
                          <GlitchText text={`${job.vectorScore}%`} trigger={selectedHub} duration={220} />
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '28px', paddingLeft: '16px', verticalAlign: 'middle' }}>
                      {pipelineView === 'applied' ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          {/* 7-Day Cooldown Countdown Badge */}
                          <span
                            style={{
                              fontSize: '11px',
                              fontFamily: 'var(--font-mono)',
                              padding: '4px 10px',
                              borderRadius: '980px',
                              background: 'rgba(255, 159, 10, 0.12)',
                              color: '#FF9F0A',
                              border: '1px solid rgba(255, 159, 10, 0.35)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontWeight: 600,
                            }}
                            title={`Applied ${job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : 'recently'}. Auto-returns to Available in ${cooldownInfo.text}.`}
                          >
                            <Clock style={{ width: '11px', height: '11px' }} />
                            <span>Resets in {cooldownInfo.text}</span>
                          </span>

                          {/* Re-visit Career Portal */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (job.url) window.open(job.url, '_blank', 'noopener,noreferrer');
                            }}
                            className="btn-glass"
                            style={{
                              fontSize: '11px',
                              padding: '5px 12px',
                              borderRadius: '980px',
                              color: 'var(--text-secondary)',
                            }}
                            title={`Open ${job.company} career portal again`}
                          >
                            <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                            <span>Portal</span>
                          </button>

                          {/* Restore Immediately to Available */}
                          {onUnapplyJob && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUnapplyJob(job.id);
                              }}
                              className="btn-glass"
                              style={{
                                fontSize: '11px',
                                padding: '5px 10px',
                                borderRadius: '980px',
                                color: 'var(--accent-blue)',
                                borderColor: 'rgba(10, 132, 255, 0.25)',
                                background: 'rgba(10, 132, 255, 0.06)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                              title="Cancel cooldown and return this company to Available immediately"
                            >
                              <RotateCcw style={{ width: '11px', height: '11px' }} />
                              <span>Restore</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {onOpenOutreach && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenOutreach(job);
                              }}
                              className="btn-glass"
                              style={{
                                padding: '7px 10px',
                                borderRadius: '8px',
                                color: 'var(--accent-blue)',
                                borderColor: 'rgba(10, 132, 255, 0.25)',
                              }}
                              title={`Generate Recruiter Outreach for ${job.company}`}
                            >
                              <Send style={{ width: '13px', height: '13px' }} />
                            </button>
                          )}

                          {onOpenTailoredResume && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenTailoredResume(job);
                              }}
                              className="btn-glass"
                              style={{
                                padding: '7px 10px',
                                borderRadius: '8px',
                                color: 'var(--accent-green)',
                                borderColor: 'rgba(48, 209, 88, 0.25)',
                              }}
                              title={`Export Tailored ATS Resume for ${job.company}`}
                            >
                              <FileText style={{ width: '13px', height: '13px' }} />
                            </button>
                          )}

                          <button
                            onClick={(e) => handleApplyClick(e, job)}
                            disabled={applyingJobId === job.id}
                            className="btn-glass btn-blue"
                            style={{
                              fontSize: '12px',
                              padding: '7px 16px',
                              minWidth: '112px',
                              justifyContent: 'center',
                            }}
                            title={job.url ? `Open ${job.company} career portal` : 'Direct Portal'}
                          >
                            <ArrowUpRight style={{ width: '13px', height: '13px' }} />
                            <span>{applyingJobId === job.id ? 'Applying...' : 'Apply Portal'}</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {/* Expandable Live Openings Sub-Row */}
                  {isExpanded && hasLiveJobs && (
                    <tr key={`${job.id}-expanded`}>
                      <td colSpan={4} style={{ padding: '0 28px 18px 68px', background: 'var(--table-header-bg)' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            paddingTop: '10px',
                            borderTop: '1px dashed rgba(48, 209, 88, 0.25)',
                          }}
                        >
                          {/* Sub-row Header Banner */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '8px',
                              marginBottom: '2px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span className="live-pulse-indicator" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                              <span style={{ fontSize: '11.5px', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '0.02em' }}>
                                Verified Live Openings at {job.company} ({liveCount})
                              </span>
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-mono)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(10, 132, 255, 0.12)',
                                  color: 'var(--accent-blue)',
                                  border: '1px solid rgba(10, 132, 255, 0.25)',
                                }}
                              >
                                {job.ats ? job.ats.toUpperCase() : 'DIRECT'} ATS
                              </span>
                            </div>

                            {job.url && (
                              <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--accent-blue)',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontWeight: 500,
                                }}
                              >
                                <span>Official Careers Portal</span>
                                <ArrowUpRight style={{ width: '11px', height: '11px' }} />
                              </a>
                            )}
                          </div>

                          {/* Role Cards List */}
                          {job.liveJobs!.map((role) => (
                            <div
                              key={role.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '14px',
                                padding: '12px 16px',
                                background: 'var(--card-bg)',
                                borderRadius: '10px',
                                border: '1px solid rgba(48, 209, 88, 0.2)',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
                                flexWrap: 'wrap',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 300px', minWidth: 0 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                                      {role.title}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        padding: '1px 6px',
                                        borderRadius: '4px',
                                        background: 'rgba(48, 209, 88, 0.12)',
                                        color: 'var(--accent-green)',
                                        border: '1px solid rgba(48, 209, 88, 0.28)',
                                      }}
                                    >
                                      Active Role
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                      <MapPin style={{ width: '11px', height: '11px' }} />
                                      {role.location}
                                    </span>
                                    {role.type && (
                                      <span
                                        style={{
                                          fontSize: '10px',
                                          padding: '1px 7px',
                                          borderRadius: '4px',
                                          background: role.type === 'Remote' ? 'rgba(10, 132, 255, 0.15)' : 'var(--tab-badge-inactive-bg)',
                                          color: role.type === 'Remote' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                          border: '1px solid var(--border-subtle)',
                                        }}
                                      >
                                        {role.type}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Actions on the Role */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                {role.vectorScore && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      fontFamily: 'var(--font-mono)',
                                      color: 'var(--accent-green)',
                                      background: 'rgba(48, 209, 88, 0.12)',
                                      border: '1px solid rgba(48, 209, 88, 0.3)',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                    }}
                                    title="Vector match compatibility with your profile"
                                  >
                                    <Zap style={{ width: '11px', height: '11px' }} />
                                    {role.vectorScore}% Fit
                                  </span>
                                )}

                                {onOpenTailoredResume && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenTailoredResume({ ...job, title: role.title });
                                    }}
                                    className="btn-glass"
                                    style={{
                                      fontSize: '11px',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      color: 'var(--text-secondary)',
                                      borderColor: 'var(--border-subtle)',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontWeight: 500,
                                    }}
                                    title="Generate tailored ATS resume targeting this specific opening"
                                  >
                                    <Sparkles style={{ width: '11px', height: '11px', color: '#BF5AF2' }} />
                                    <span>Tailor Resume</span>
                                  </button>
                                )}

                                {onOpenOutreach && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onOpenOutreach({ ...job, title: role.title });
                                    }}
                                    className="btn-glass"
                                    style={{
                                      fontSize: '11px',
                                      padding: '5px 10px',
                                      borderRadius: '6px',
                                      color: 'var(--text-secondary)',
                                      borderColor: 'var(--border-subtle)',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontWeight: 500,
                                    }}
                                    title="Draft referral pitch targeting this role"
                                  >
                                    <Send style={{ width: '11px', height: '11px', color: '#0A84FF' }} />
                                    <span>Draft Outreach</span>
                                  </button>
                                )}

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(role.url, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="btn-primary"
                                  style={{
                                    fontSize: '11px',
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontWeight: 600,
                                  }}
                                  title="Open direct career portal application page"
                                >
                                  <span>Apply Role</span>
                                  <ArrowUpRight style={{ width: '12px', height: '12px' }} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}

            {/* Empty State */}
            {filteredAndSortedJobs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '64px 24px', textAlign: 'center' }}>
                  {pipelineView === 'applied' ? (
                    <div style={{ maxWidth: '460px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'rgba(255, 159, 10, 0.1)',
                          border: '1px solid rgba(255, 159, 10, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FF9F0A',
                        }}
                      >
                        <Clock style={{ width: '26px', height: '26px' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                          No Companies in 7-Day Cooldown
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                          Applied companies stay here for 7 days before automatically resetting back to Available Portals.
                        </p>
                      </div>
                      <button
                        onClick={() => setPipelineView('available')}
                        className="btn-glass btn-blue"
                        style={{ fontSize: '12px', padding: '8px 20px', borderRadius: '980px', marginTop: '4px' }}
                      >
                        View Available Companies ({availableJobs.length})
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', padding: '16px 0' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        <Search style={{ width: '22px', height: '22px' }} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                          {searchQuery ? `No companies found for "${searchQuery}"` : 'No companies match the selected filters'}
                        </h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
                          {searchQuery
                            ? 'Nexus Apply checks company names, brand aliases (AWS, FB, JPMC), tech stacks, live job roles, and corridor locations.'
                            : 'Try switching to All Corridors or resetting your industry sector filter.'}
                        </p>
                      </div>

                      {searchQuery ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '520px' }}>
                            <span style={{ fontSize: '11.5px', color: 'var(--text-tertiary)', fontWeight: 600 }}>Suggested searches:</span>
                            {['Google', 'Stripe', 'AWS', 'SDE', 'Golang', 'Kubernetes', 'Bengaluru', 'Delhi NCR', 'Fintech'].map((sug) => (
                              <button
                                key={sug}
                                onClick={() => setSearchQuery(sug)}
                                className="btn-glass"
                                style={{
                                  fontSize: '11px',
                                  padding: '3px 10px',
                                  borderRadius: '980px',
                                  color: 'var(--accent-blue)',
                                  borderColor: 'rgba(10, 132, 255, 0.3)',
                                }}
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedSector('all');
                              setSelectedSubRegion('all');
                            }}
                            className="btn-glass btn-blue"
                            style={{
                              fontSize: '12px',
                              padding: '6px 18px',
                              borderRadius: '980px',
                              marginTop: '4px',
                            }}
                          >
                            Clear Search & Reset Filters
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedHub('all');
                            setSelectedSector('all');
                            setSelectedSubRegion('all');
                          }}
                          className="btn-glass btn-blue"
                          style={{
                            fontSize: '12px',
                            padding: '6px 18px',
                            borderRadius: '980px',
                          }}
                        >
                          Reset All Filters
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </>
      )}
      </div>
    </div>
  );
};
