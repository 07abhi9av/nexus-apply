import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import confetti from 'canvas-confetti';
import { HeaderHUD } from './components/HeaderHUD';
import { JobPipelineKanban, type CorridorHub } from './components/JobPipelineKanban';
import type { SyncStats } from './components/LiveScannerHUD';
import { ResourcesSection } from './components/ResourcesSection';
import { PrepRoadmapSection } from './components/PrepRoadmapSection';
import { AtsScannerSection } from './components/AtsScannerSection';
import { JobDetailModal } from './components/JobDetailModal';
import { ResumeProfileDrawer } from './components/ResumeProfileDrawer';
import { ResumeUploadModal } from './components/ResumeUploadModal';
import { AuthModal } from './components/AuthModal';
import { DomainOnboardingModal } from './components/DomainOnboardingModal';
import {
  type AuthUser,
  signOut as supabaseSignOut,
  getInitialSession,
  onAuthStateChange,
  syncApplicationToSupabase,
  removeApplicationFromSupabase,
  fetchJobsFromSupabase,
  fetchUserApplicationsFromSupabase,
} from './services/supabase';
import { OutreachModal } from './components/OutreachModal';
import { TailoredResumeModal } from './components/TailoredResumeModal';
import { DevContactModal } from './components/DevContactModal';
import { IngressIcon } from './components/IngressLogo';
import { CursorGlow } from './components/CursorGlow';
import { CommandPalette } from './components/CommandPalette';
import { LockedFeatureSection } from './components/LockedFeatureSection';
import { Building2, Compass, ShieldCheck, BookOpen, ArrowRight, Lock } from 'lucide-react';
import { DOMAIN_TRACKS } from './utils/domainProfiles';
import type {
  JobOpportunity,
  CandidateProfile,
  AppStats,
  TelemetryEvent,
  JobStatus,
  ResourceItem,
} from './types';

import { API_BASE } from './config';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'companies' | 'roadmap' | 'ats-scanner' | 'resources'>('companies');
  const [selectedHub, setSelectedHub] = useState<CorridorHub>('all');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('nexus_theme') as 'dark' | 'light') || 'dark';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for Command Palette (Cmd + K or Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);



  // Animated sliding pill indicator state
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const updateIndicator = () => {
      const currentBtn = tabRefs.current[activeTab];
      if (currentBtn) {
        setIndicatorStyle({
          left: currentBtn.offsetLeft,
          width: currentBtn.offsetWidth,
          opacity: 1,
        });
      }
    };

    updateIndicator();
    const timer = setTimeout(updateIndicator, 50);
    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab, jobs.length, resources.length]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('nexus_theme', theme);
  }, [theme]);

  const isThemeSwitchingRef = useRef(false);

  const handleToggleTheme = (event?: React.MouseEvent | MouseEvent) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    if (typeof document === 'undefined' || !('startViewTransition' in document)) {
      setTheme(nextTheme);
      return;
    }

    if (isThemeSwitchingRef.current) return;
    isThemeSwitchingRef.current = true;

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    try {
      const transition = (document as any).startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
        document.documentElement.setAttribute('data-theme', nextTheme);
      });

      transition.ready.then(() => {
        const anim = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 380,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
        return anim.finished;
      }).catch(() => {
        setTheme(nextTheme);
      }).finally(() => {
        isThemeSwitchingRef.current = false;
      });

      transition.finished.finally(() => {
        isThemeSwitchingRef.current = false;
      });
    } catch {
      isThemeSwitchingRef.current = false;
      setTheme(nextTheme);
    }
  };

  const [_stats, setStats] = useState<AppStats | null>(null);
  const [_telemetry, setTelemetry] = useState<TelemetryEvent[]>([]);

  // UI state
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDevContactOpen, setIsDevContactOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [lastSyncStats, setLastSyncStats] = useState<SyncStats | null>({
    totalRoles: 787,
    totalCompanies: 287,
    sourcesScraped: 4,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // USP Modal States: 1-Click Outreach & Role-Tailored Resume
  const [outreachJob, setOutreachJob] = useState<any | null>(null);
  const [tailoredResumeJob, setTailoredResumeJob] = useState<JobOpportunity | null>(null);
  const [tailoredCustomJd, setTailoredCustomJd] = useState<any | null>(null);

  const handleOpenOutreach = (job: any) => {
    setOutreachJob(job);
  };

  const handleOpenTailoredResume = (jobOrJd: any) => {
    if (jobOrJd?.id) {
      setTailoredResumeJob(jobOrJd);
      setTailoredCustomJd(null);
    } else {
      setTailoredCustomJd(jobOrJd);
      setTailoredResumeJob(null);
    }
  };

  // User Auth State: Supabase Session + Local Persistent Profile
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const explicitLoggedOut = localStorage.getItem('nexus_logged_out') === 'true';
      if (explicitLoggedOut) return null;
      const saved = localStorage.getItem('nexus_google_user');
      if (saved) return JSON.parse(saved);
      return null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'sign-in' | 'register'>('sign-in');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const isLoggedIn = Boolean(authUser);

  // Synchronize live Supabase session on mount & state change
  useEffect(() => {
    getInitialSession().then((user) => {
      if (user) {
        setAuthUser(user);
        localStorage.setItem('nexus_google_user', JSON.stringify(user));
        localStorage.setItem('nexus_auth', 'true');
        localStorage.removeItem('nexus_logged_out');
      }
    });

    const unsubscribe = onAuthStateChange((user) => {
      if (user) {
        setAuthUser(user);
        localStorage.setItem('nexus_google_user', JSON.stringify(user));
        localStorage.setItem('nexus_auth', 'true');
        localStorage.removeItem('nexus_logged_out');
      } else {
        const explicitLoggedOut = localStorage.getItem('nexus_logged_out') === 'true';
        if (explicitLoggedOut) {
          setAuthUser(null);
          localStorage.removeItem('nexus_google_user');
          localStorage.removeItem('nexus_auth');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAuthModal = (mode: 'sign-in' | 'register' = 'sign-in') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleEnterPortal = (hub: CorridorHub = 'all') => {
    if (!authUser) {
      // User must sign in before entering the portal
      handleOpenAuthModal('sign-in');
      return;
    }
    localStorage.removeItem('nexus_logged_out');
    setSelectedHub(hub);
    setActiveTab('companies');
    if (!localStorage.getItem('nexus_domain_onboarded')) {
      setIsOnboardingOpen(true);
    }
  };

  const handleAuthSuccess = async (user: AuthUser) => {
    setAuthUser(user);
    localStorage.setItem('nexus_google_user', JSON.stringify(user));
    localStorage.setItem('nexus_auth', 'true');
    localStorage.removeItem('nexus_logged_out');
    setIsAuthModalOpen(false);

    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (err) {
      // local dev backend sync optional
    }

    // Check if user has configured career domain; if not, show card onboarding modal
    const hasOnboarded = localStorage.getItem('nexus_domain_onboarded');
    if (!hasOnboarded) {
      setIsOnboardingOpen(true);
    }
  };

  const handleLogout = async () => {
    await supabaseSignOut();
    setAuthUser(null);
    localStorage.setItem('nexus_logged_out', 'true');
    localStorage.removeItem('nexus_google_user');
    localStorage.removeItem('nexus_auth');
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Load initial data (Supabase + Local Backend Dual Fallback)
  const loadData = async () => {
    try {
      // 1. Check Supabase for live corridor jobs first
      const supabaseJobs = await fetchJobsFromSupabase();

      const results = await Promise.allSettled([
        fetch(`${API_BASE}/api/profile`),
        fetch(`${API_BASE}/api/jobs`),
        fetch(`${API_BASE}/api/stats`),
        fetch(`${API_BASE}/api/telemetry`),
        fetch(`${API_BASE}/api/resources`),
      ]);

      const [pResult, jResult, sResult, tResult, rResult] = results;

      if (pResult.status === 'fulfilled' && pResult.value.ok) {
        const p = await pResult.value.json();
        setProfile(p);
      }
      let loadedJobs: JobOpportunity[] = [];
      if (jResult.status === 'fulfilled' && jResult.value.ok) {
        loadedJobs = await jResult.value.json();
        // Merge any Supabase jobs not in the local catalog
        if (supabaseJobs && supabaseJobs.length > 0) {
          const existingIds = new Set(loadedJobs.map((j) => j.id));
          for (const sJob of supabaseJobs) {
            if (!existingIds.has(sJob.id)) {
              loadedJobs.push(sJob);
            }
          }
        }
      } else if (supabaseJobs && supabaseJobs.length > 0) {
        loadedJobs = supabaseJobs;
      }

      if (loadedJobs.length > 0) {
        // If user is authenticated with Supabase, sync their application cooldowns & statuses
        if (authUser?.id) {
          try {
            const userApps = await fetchUserApplicationsFromSupabase(authUser.id);
            if (userApps && userApps.length > 0) {
              const appMap = new Map(userApps.map((a: any) => [a.job_id, a]));
              loadedJobs = loadedJobs.map((j) => {
                const app = appMap.get(j.id);
                if (app) {
                  return { ...j, status: (app.status || 'applied') as JobStatus, appliedAt: app.applied_at };
                }
                return j;
              });
            }
          } catch (appErr) {
            console.warn('Failed to load user applications from Supabase:', appErr);
          }
        }

        setJobs(loadedJobs);
      }
      if (sResult.status === 'fulfilled' && sResult.value.ok) setStats(await sResult.value.json());
      if (tResult.status === 'fulfilled' && tResult.value.ok) setTelemetry(await tResult.value.json());
      if (rResult.status === 'fulfilled' && rResult.value.ok) setResources(await rResult.value.json());
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [authUser?.id]);

  // SSE Stream
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${API_BASE}/api/telemetry/stream`);

      eventSource.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.type === 'CONNECTED') return;

          setTelemetry((prev) => [data, ...prev.slice(0, 199)]);

          if (data.type === 'APPLICATION_SUCCESS') {
            confetti({
              particleCount: 60,
              spread: 50,
              origin: { y: 0.6 },
              colors: ['#0A84FF', '#30D158', '#BF5AF2'],
            });
            loadData();
          } else if (data.type === 'INGESTION') {
            loadData();
          }
        } catch (err) {
          console.error('SSE Error:', err);
        }
      };

      eventSource.onerror = () => {
        // Soft fallback if backend is spinning up or offline
      };
    } catch {
      // EventSource initialization fallback
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  // Apply (marks job as applied with timestamp + initiates 7-day cooldown)
  const handleApplyJob = async (jobId: string) => {
    setApplyingJobId(jobId);
    const now = new Date().toISOString();

    // Optimistically update local UI
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'applied' as JobStatus, appliedAt: now } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, status: 'applied', appliedAt: now });
    }

    try {
      // Sync to Supabase if logged in
      if (authUser?.id) {
        await syncApplicationToSupabase(authUser.id, jobId, 'applied');
      }

      // Also notify local backend
      await fetch(`${API_BASE}/api/jobs/${jobId}/apply-portal`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error applying to job:', err);
    } finally {
      setApplyingJobId(null);
    }
  };

  // Restore company back to Available Portals pipeline immediately
  const handleUnapplyJob = async (jobId: string) => {
    // Optimistically update local UI
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'discovered' as JobStatus, appliedAt: undefined } : j))
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob({ ...selectedJob, status: 'discovered', appliedAt: undefined });
    }

    try {
      // Remove from Supabase if logged in
      if (authUser?.id) {
        await removeApplicationFromSupabase(authUser.id, jobId);
      }

      // Also notify local backend
      await fetch(`${API_BASE}/api/jobs/${jobId}/unapply`, {
        method: 'POST',
      });
    } catch (err) {
      console.error('Error restoring job to available:', err);
    }
  };

  // Global Escape key listener to dismiss open overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (outreachJob) setOutreachJob(null);
        else if (tailoredResumeJob || tailoredCustomJd) {
          setTailoredResumeJob(null);
          setTailoredCustomJd(null);
        } else if (isAuthModalOpen) setIsAuthModalOpen(false);
        else if (isOnboardingOpen) setIsOnboardingOpen(false);
        else if (selectedJob) setSelectedJob(null);
        else if (isUploadModalOpen) setIsUploadModalOpen(false);
        else if (isProfileOpen) setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedJob, isUploadModalOpen, isProfileOpen, isAuthModalOpen, isOnboardingOpen, outreachJob, tailoredResumeJob, tailoredCustomJd]);

  const handleUploadSuccess = (data: any) => {
    if (data.profile) setProfile(data.profile);
    if (data.jobs) setJobs(data.jobs);
    loadData();
  };

  const handleResetTracker = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/jobs/reset`, { method: 'POST' });
      if (res.ok) {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.5 },
          colors: ['#0A84FF', '#30D158'],
        });
        loadData();
      }
    } catch (err) {
      console.error('Error resetting tracker:', err);
    }
  };

  const handleReindexResume = async () => {
    setIsReindexing(true);
    try {
      const res = await fetch(`${API_BASE}/api/profile/scan-existing`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setProfile(data.profile);
        if (data.jobs) setJobs(data.jobs);
        confetti({
          particleCount: 70,
          spread: 55,
          origin: { y: 0.4 },
          colors: ['#30D158', '#0A84FF', '#BF5AF2'],
        });
        loadData();
      }
    } catch (err) {
      console.error('Error re-indexing resume:', err);
    } finally {
      setIsReindexing(false);
    }
  };

  const handleSyncLiveJobs = async () => {
    setIsSyncingLive(true);
    try {
      const res = await fetch(`${API_BASE}/api/jobs/sync`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.jobs) {
          setJobs(data.jobs);
        }
        setLastSyncStats({
          totalRoles: data.totalJobs || (data.jobs ? data.jobs.reduce((acc: number, j: any) => acc + (j.liveJobs?.length || 0), 0) : 787),
          totalCompanies: data.jobs ? data.jobs.length : 287,
          sourcesScraped: data.sourcesScraped || 4,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.4 },
          colors: ['#30D158', '#00C7BE', '#0A84FF'],
        });
        await loadData();
      }
    } catch (err) {
      console.error('Error syncing live jobs:', err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  const handleSaveProfile = async (updated: CandidateProfile) => {
    try {
      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        const newProf = data.profile || data;
        setProfile(newProf);
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          loadData();
        }
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleCompleteOnboarding = async (updated: CandidateProfile) => {
    try {
      setProfile(updated);
      setIsOnboardingOpen(false);

      const res = await fetch(`${API_BASE}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        const newProf = data.profile || data;
        setProfile(newProf);
        if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          await loadData();
        }
      } else {
        await loadData();
      }
    } catch (err) {
      console.error('Error completing domain onboarding:', err);
      await loadData();
    }
  };

  const handleQuickTrackSwitch = async (trackId: string) => {
    const track = DOMAIN_TRACKS.find((t) => t.id === trackId);
    if (!track) return;
    const updated: CandidateProfile = {
      name: profile?.name || 'Engineer',
      email: profile?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || 'India',
      linkedin: profile?.linkedin || '',
      github: profile?.github || '',
      currentCompany: profile?.currentCompany || '',
      title: track.defaultTitle,
      summary: track.defaultSummary,
      skills: track.coreSkills.slice(0, 8),
      domain: track.id,
      seniority: profile?.seniority || 'mid',
      experience: profile?.experience || [],
      projects: profile?.projects || [],
      education: profile?.education || [],
      certifications: profile?.certifications || [],
      competencyVectors: {
        distributedSystems: track.competencyVectors.distributedSystems ?? profile?.competencyVectors?.distributedSystems ?? 80,
        fintechProtocols: track.competencyVectors.fintechProtocols ?? profile?.competencyVectors?.fintechProtocols ?? 75,
        cloudK8s: track.competencyVectors.cloudK8s ?? profile?.competencyVectors?.cloudK8s ?? 80,
        reliabilityObservability: track.competencyVectors.reliabilityObservability ?? profile?.competencyVectors?.reliabilityObservability ?? 75,
        securityDDoS: track.competencyVectors.securityDDoS ?? profile?.competencyVectors?.securityDDoS ?? 70,
        aiAutomation: track.competencyVectors.aiAutomation ?? profile?.competencyVectors?.aiAutomation ?? 75,
      },
      preferences: {
        targetRoles: track.targetRoles,
        targetCompanies: track.targetCompanies,
        locations: profile?.preferences?.locations || ['all'],
        minMatchScore: profile?.preferences?.minMatchScore || 80,
        autoPilotEnabled: profile?.preferences?.autoPilotEnabled || false,
      },
    };
    await handleCompleteOnboarding(updated);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.25s ease, color 0.25s ease',
      }}
    >
      {/* Ambient gradient orbs */}
      <div className="ambient-orb ambient-orb-blue" />
      <div className="ambient-orb ambient-orb-purple" />
      <div className="ambient-orb ambient-orb-cyan" />

      {/* Header */}
      <HeaderHUD
        profile={profile}
        googleUser={authUser}
        authUser={authUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onSelectTrack={handleQuickTrackSwitch}
        isLoggedIn={isLoggedIn}
        onGoogleLogin={() => handleOpenAuthModal('sign-in')}
        onLogout={handleLogout}
        onSwitchGoogleAccount={() => handleOpenAuthModal('sign-in')}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onGoHome={() => {
          setActiveTab('companies');
          setSelectedHub('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCommandPalette={isLoggedIn ? () => setIsCommandPaletteOpen(true) : undefined}
        onOpenDevContact={() => setIsDevContactOpen(true)}
      />

      {/* Main Content */}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
          padding: '32px 24px',
          flex: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {!isLoggedIn ? (
          /* Not logged in — High Impact Ingress Landing Presentation (v0.5) */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '72vh',
              textAlign: 'center',
              gap: '28px',
              padding: '48px 20px 64px',
              position: 'relative',
            }}
          >
            {/* Interactive Cursor Spotlight Glow Effect */}
            <CursorGlow />

            {/* Ambient Aurora Glow Layers */}
            <div
              className="animate-aurora-1"
              style={{
                position: 'absolute',
                top: '5%',
                left: '20%',
                width: '420px',
                height: '420px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0, 199, 190, 0.22) 0%, rgba(10, 132, 255, 0.12) 40%, transparent 70%)',
                filter: 'blur(70px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />
            <div
              className="animate-aurora-2"
              style={{
                position: 'absolute',
                top: '15%',
                right: '18%',
                width: '480px',
                height: '480px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(191, 90, 242, 0.20) 0%, rgba(255, 45, 85, 0.10) 45%, transparent 70%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Glowing Central Ingress Emblem with Hover Flare */}
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '18px',
                borderRadius: '26px',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--border-default)',
                boxShadow: '0 24px 64px rgba(0, 199, 190, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                zIndex: 1,
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
              }}
              className="hover-lift"
            >
              <IngressIcon size={68} glow={true} />
              <div
                style={{
                  position: 'absolute',
                  inset: '-14px',
                  background: 'radial-gradient(circle, rgba(0, 199, 190, 0.35) 0%, transparent 70%)',
                  filter: 'blur(18px)',
                  zIndex: -1,
                }}
              />
            </div>

            {/* Title, v0.5 Badge & Subtitle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1
                  className="text-shimmer-brand"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '52px',
                    letterSpacing: '-0.035em',
                    margin: 0,
                    lineHeight: 1.25,
                    paddingBottom: '10px',
                    display: 'inline-block',
                    overflow: 'visible',
                  }}
                >
                  in<span style={{ color: '#00F5D4', textShadow: '0 0 16px rgba(0, 245, 212, 0.65)', margin: '0 1px' }}>.</span>gress
                </h1>
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    padding: '3px 10px',
                    borderRadius: '980px',
                    background: 'rgba(10, 132, 255, 0.14)',
                    color: 'var(--accent-blue)',
                    border: '1px solid rgba(10, 132, 255, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                  v0.5
                </span>
              </div>

              <p
                style={{
                  fontSize: '19px',
                  fontWeight: 650,
                  color: 'var(--accent-blue)',
                  letterSpacing: '-0.01em',
                  margin: 0,
                }}
              >
                Direct Access to Top Tech Careers
              </p>
            </div>

            {/* Non-Technical Clear Headline */}
            <p
              style={{
                fontSize: '15.5px',
                color: 'var(--text-secondary)',
                maxWidth: '580px',
                lineHeight: 1.6,
                margin: 0,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Skip recruiter black holes and third-party boards. Apply directly to verified career portals across India and remote tech teams with 1-click verified applications and instant ATS resume tailoring.
            </p>

            {/* Feature Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '8px',
                maxWidth: '680px',
                margin: '2px 0',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {[
                { label: '📍 Delhi NCR (53)', color: '#FF375F' },
                { label: '🏙️ Bengaluru (67)', color: '#30D158' },
                { label: '🌐 Remote & Global (167)', color: '#BF5AF2' },
                { label: '⚡ 1-Click Outreach', color: '#0A84FF' },
                { label: '📄 ATS Resume Tailoring', color: '#FFD60A' },
              ].map((pill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    padding: '6px 13px',
                    borderRadius: '980px',
                    background: 'var(--nav-track-bg)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontWeight: 550,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: pill.color }} />
                  {pill.label}
                </span>
              ))}
            </div>

            {/* Primary Action: Google / Email Sign In */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, marginTop: '8px' }}>
              <button
                onClick={() => handleOpenAuthModal('sign-in')}
                className="btn-google hover-lift"
                style={{
                  fontSize: '15px',
                  padding: '13px 30px',
                  fontWeight: 600,
                  borderRadius: '980px',
                  boxShadow: '0 6px 24px rgba(0, 0, 0, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign In / Register</span>
              </button>
            </div>

            {/* Interactive Tech Corridor Showcase Preview Grid */}
            <div
              style={{
                width: '100%',
                maxWidth: '960px',
                marginTop: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Explore Career Corridors
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>
                  3 Live Hubs · 4 Emerging Corridors
                </span>
              </div>

              {/* Grid of Corridors */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                {/* Active Hub 1: Delhi NCR */}
                <div
                  onClick={() => handleEnterPortal('delhi-ncr')}
                  className="tilt-card"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#FF375F', fontWeight: 700 }}>
                        ACTIVE HUB
                      </span>
                      <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', background: 'var(--nav-track-bg)', padding: '1px 6px', borderRadius: '4px' }}>
                        53 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Delhi NCR
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Gurugram, Noida & New Delhi
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <span>Browse Portals</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Active Hub 2: Bengaluru */}
                <div
                  onClick={() => handleEnterPortal('bengaluru')}
                  className="tilt-card"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#30D158', fontWeight: 700 }}>
                        ACTIVE HUB
                      </span>
                      <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', background: 'var(--nav-track-bg)', padding: '1px 6px', borderRadius: '4px' }}>
                        67 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Bengaluru
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Bellandur, ORR & Koramangala
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <span>Browse Portals</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Active Hub 3: Remote */}
                <div
                  onClick={() => handleEnterPortal('remote')}
                  className="tilt-card"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#BF5AF2', fontWeight: 700 }}>
                        ACTIVE HUB
                      </span>
                      <span style={{ fontSize: '11.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', background: 'var(--nav-track-bg)', padding: '1px 6px', borderRadius: '4px' }}>
                        167 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Remote & Global
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Worldwide Distributed Teams
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <span>Browse Portals</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Upcoming Hub 1: Hyderabad */}
                <div
                  onClick={() => handleEnterPortal('hyderabad')}
                  className="tilt-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.08) 0%, rgba(255, 69, 58, 0.06) 100%)',
                    border: '1px dashed rgba(255, 159, 10, 0.4)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#FF9F0A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF9F0A' }} />
                        COMING SOON
                      </span>
                      <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#FF9F0A', background: 'rgba(255, 159, 10, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        42 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Hyderabad
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      HITEC City & Gachibowli
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      Microsoft, Google, Qualcomm, Apple
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#FF9F0A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 650 }}>
                    <span>Launch Alerts Active</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Upcoming Hub 2: Pune */}
                <div
                  onClick={() => handleEnterPortal('pune')}
                  className="tilt-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.08) 0%, rgba(0, 199, 190, 0.06) 100%)',
                    border: '1px dashed rgba(48, 209, 88, 0.4)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#30D158', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#30D158' }} />
                        COMING SOON
                      </span>
                      <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#30D158', background: 'rgba(48, 209, 88, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        38 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Pune
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Hinjawadi & Magarpatta
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      Barclays, Nvidia, Veritas, BMC
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#30D158', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 650 }}>
                    <span>Launch Alerts Active</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Upcoming Hub 3: Mumbai */}
                <div
                  onClick={() => handleEnterPortal('mumbai')}
                  className="tilt-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(191, 90, 242, 0.08) 0%, rgba(255, 45, 85, 0.06) 100%)',
                    border: '1px dashed rgba(191, 90, 242, 0.4)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#BF5AF2', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BF5AF2' }} />
                        COMING SOON
                      </span>
                      <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#BF5AF2', background: 'rgba(191, 90, 242, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        35 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Mumbai
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      BKC & Lower Parel
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      Morgan Stanley, JP Morgan, Jio
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#BF5AF2', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 650 }}>
                    <span>Launch Alerts Active</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Upcoming Hub 4: GIFT City */}
                <div
                  onClick={() => handleEnterPortal('gift-city')}
                  className="tilt-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.10) 0%, rgba(255, 159, 10, 0.06) 100%)',
                    border: '1px dashed rgba(255, 214, 10, 0.45)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFD60A' }} />
                        COMING SOON
                      </span>
                      <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)', background: 'rgba(255, 214, 10, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        24 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      GIFT City
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      IFSC & Gandhinagar SEZ
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      NSE IFSC, India INX, Standard Chartered
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 650 }}>
                    <span>Launch Alerts Active</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>

                {/* Upcoming Hub 5: Chennai */}
                <div
                  onClick={() => handleEnterPortal('chennai')}
                  className="tilt-card"
                  style={{
                    background: 'linear-gradient(135deg, rgba(50, 215, 75, 0.08) 0%, rgba(10, 132, 255, 0.06) 100%)',
                    border: '1px dashed rgba(50, 215, 75, 0.4)',
                    borderRadius: '16px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#32D74B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <span className="radar-beacon" style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#32D74B' }} />
                        COMING SOON
                      </span>
                      <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#32D74B', background: 'rgba(50, 215, 75, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                        36 Co.
                      </span>
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                      Chennai
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      OMR, Taramani & Guindy
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                      Zoho, Freshworks, PayPal, Amazon
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#32D74B', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 650 }}>
                    <span>Launch Alerts Active</span>
                    <ArrowRight style={{ width: '11px', height: '11px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Logged in — 4-Way Liquid Glass Navigation */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Liquid Glass Segmented View Switcher */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <nav className="segmented-nav-track" aria-label="Main Navigation" style={{ position: 'relative' }}>
                {/* Smooth Sliding Pill Indicator */}
                <div
                  className="segmented-sliding-pill"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    bottom: '5px',
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity,
                    transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: 'none',
                    zIndex: 1,
                    borderRadius: '980px',
                  }}
                />

                {/* 1. Companies & Portals */}
                <button
                  ref={(el) => { tabRefs.current['companies'] = el; }}
                  onClick={() => setActiveTab('companies')}
                  className={`segmented-nav-btn ${activeTab === 'companies' ? 'active' : ''}`}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <Building2 className="tab-icon" style={{ width: '15px', height: '15px', color: 'var(--accent-blue)' }} />
                  <span>Companies & Portals</span>
                  <span className={`segmented-nav-badge ${activeTab === 'companies' ? 'active tab-badge-bounce' : 'inactive'}`}>
                    {jobs.length}
                  </span>
                </button>

                {/* 2. DevOps & DSA Roadmap (Locked Coming Soon v1) */}
                <button
                  ref={(el) => { tabRefs.current['roadmap'] = el; }}
                  onClick={() => setActiveTab('roadmap')}
                  className={`segmented-nav-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <Compass className="tab-icon" style={{ width: '15px', height: '15px', color: 'var(--accent-purple)' }} />
                  <span>DevOps & DSA Roadmap</span>
                  <span
                    className={`segmented-nav-badge ${activeTab === 'roadmap' ? 'active tab-badge-bounce' : 'inactive'}`}
                    style={
                      activeTab === 'roadmap'
                        ? {
                            background: 'rgba(191, 90, 242, 0.2)',
                            color: 'var(--accent-purple)',
                            border: '1px solid rgba(191, 90, 242, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px 7px',
                          }
                        : {
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px 7px',
                          }
                    }
                    title="Locked (Coming Soon v1)"
                  >
                    <Lock style={{ width: '10px', height: '10px' }} />
                  </span>
                </button>

                {/* 3. AI ATS Resume Scanner */}
                <button
                  ref={(el) => { tabRefs.current['ats-scanner'] = el; }}
                  onClick={() => setActiveTab('ats-scanner')}
                  className={`segmented-nav-btn ${activeTab === 'ats-scanner' ? 'active' : ''}`}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <ShieldCheck className="tab-icon" style={{ width: '15px', height: '15px', color: 'var(--accent-green)' }} />
                  <span>AI ATS Scanner</span>
                  <span
                    className={`segmented-nav-badge ${activeTab === 'ats-scanner' ? 'active tab-badge-bounce' : 'inactive'}`}
                    style={
                      activeTab === 'ats-scanner'
                        ? { background: 'rgba(48, 209, 88, 0.18)', color: 'var(--accent-green)' }
                        : {}
                    }
                  >
                    AUDIT
                  </span>
                </button>

                {/* 4. Career & Prep Resources (Locked Coming Soon v1) */}
                <button
                  ref={(el) => { tabRefs.current['resources'] = el; }}
                  onClick={() => setActiveTab('resources')}
                  className={`segmented-nav-btn ${activeTab === 'resources' ? 'active' : ''}`}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <BookOpen className="tab-icon" style={{ width: '15px', height: '15px', color: 'var(--accent-amber)' }} />
                  <span>Sheets & Resources</span>
                  <span
                    className={`segmented-nav-badge ${activeTab === 'resources' ? 'active tab-badge-bounce' : 'inactive'}`}
                    style={
                      activeTab === 'resources'
                        ? {
                            background: 'rgba(255, 159, 10, 0.2)',
                            color: '#FF9F0A',
                            border: '1px solid rgba(255, 159, 10, 0.4)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px 7px',
                          }
                        : {
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '3px 7px',
                          }
                    }
                    title="Locked (Coming Soon v1)"
                  >
                    <Lock style={{ width: '10px', height: '10px' }} />
                  </span>
                </button>
              </nav>
            </div>

            {/* Animated Tab View Container */}
            <div key={activeTab} className="tab-pane-transition">
              {activeTab === 'companies' && (
                <JobPipelineKanban
                  jobs={jobs}
                  profile={profile}
                  onOpenOnboarding={() => setIsOnboardingOpen(true)}
                  onSelectJob={(job) => setSelectedJob(job)}
                  onApplyJob={handleApplyJob}
                  onUnapplyJob={handleUnapplyJob}
                  onOpenOutreach={handleOpenOutreach}
                  onOpenTailoredResume={handleOpenTailoredResume}
                  applyingJobId={applyingJobId}
                  onResetTracker={handleResetTracker}
                  onSyncLiveJobs={handleSyncLiveJobs}
                  isSyncingLive={isSyncingLive}
                  lastSyncStats={lastSyncStats}
                  selectedHub={selectedHub}
                  onSelectHub={setSelectedHub}
                />
              )}

              {activeTab === 'roadmap' && (
                <LockedFeatureSection
                  featureId="roadmap"
                  title="DevOps, SRE & DSA Prep Roadmap"
                  tagline="Tier-1 Engineering Milestones & Interactive Curriculum"
                  description="This module is locked and scheduled for launch in Nexus v1.0. We are currently finalizing the interactive visual curriculum, DSA patterns, and production DevOps pathways."
                  accentColor="#BF5AF2"
                  deliverables={[
                    {
                      tag: 'DUAL TRACK',
                      title: 'DevOps & DSA Paths',
                      desc: 'Visual mastery trees covering Docker, K8s, Linux, CI/CD, and LeetCode core patterns.',
                    },
                    {
                      tag: 'PORTAL ALIGNED',
                      title: 'Company Loops',
                      desc: 'Topics directly mapped to interview loops at Google, Databricks, NVIDIA, and Uber.',
                    },
                    {
                      tag: 'TRACKING',
                      title: 'Progress & Readiness',
                      desc: 'Topic completion tracking, syllabus coverage score, and custom revision bookmarks.',
                    },
                  ]}
                  onSwitchTab={(tab) => setActiveTab(tab)}
                >
                  <PrepRoadmapSection />
                </LockedFeatureSection>
              )}

              {activeTab === 'ats-scanner' && (
                <AtsScannerSection
                  profile={profile}
                  onOpenTailoredResume={handleOpenTailoredResume}
                  onOpenOutreach={handleOpenOutreach}
                />
              )}

              {activeTab === 'resources' && (
                <LockedFeatureSection
                  featureId="resources"
                  title="Sheets & Curated Resources"
                  tagline="Recruiter Directories, Architecture Blueprints & Interview Guides"
                  description="This module is locked and scheduled for launch in Nexus v1.0. We are curating direct recruiter contacts, system design RFCs, and high-yield interview cheat sheets."
                  accentColor="#FF9F0A"
                  deliverables={[
                    {
                      tag: 'DIRECT ACCESS',
                      title: 'Recruiter Directories',
                      desc: 'Verified talent acquisition contacts, HR emails, and referral networks across tech hubs.',
                    },
                    {
                      tag: 'PRODUCTION RFCs',
                      title: 'Architecture Blueprints',
                      desc: 'Real-world system design cheat sheets, Kubernetes manifests, and microservices RFCs.',
                    },
                    {
                      tag: 'INTERVIEW PACKS',
                      title: 'Playbooks & Cheatsheets',
                      desc: 'High-yield behavioral STAR templates, resume bullet banks, and offer negotiation sheets.',
                    },
                  ]}
                  onSwitchTab={(tab) => setActiveTab(tab)}
                >
                  <ResourcesSection resources={resources} />
                </LockedFeatureSection>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '16px 28px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>Direct Career Portals</span>
          <button
            onClick={() => setIsDevContactOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-blue)',
              cursor: 'pointer',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Contact Developer & Feedback
          </button>
          <span>{jobs.length} verified companies</span>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={handleApplyJob}
        onUnapply={handleUnapplyJob}
        onOpenOutreach={handleOpenOutreach}
        onOpenTailoredResume={handleOpenTailoredResume}
        isApplying={applyingJobId === selectedJob?.id}
      />

      <ResumeProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onReindexResume={handleReindexResume}
        isReindexing={isReindexing}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetTracker={handleResetTracker}
        onOpenOnboarding={() => {
          setIsProfileOpen(false);
          setIsOnboardingOpen(true);
        }}
      />

      <DomainOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        currentProfile={profile}
        onComplete={handleCompleteOnboarding}
      />

      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* USP Modals */}
      <OutreachModal
        isOpen={Boolean(outreachJob)}
        onClose={() => setOutreachJob(null)}
        job={outreachJob}
      />

      <TailoredResumeModal
        isOpen={Boolean(tailoredResumeJob || tailoredCustomJd)}
        onClose={() => {
          setTailoredResumeJob(null);
          setTailoredCustomJd(null);
        }}
        job={tailoredResumeJob}
        customJd={tailoredCustomJd}
        profile={profile}
      />

      {/* Dev Feedback, Contact & About Me Modal */}
      <DevContactModal
        isOpen={isDevContactOpen}
        onClose={() => setIsDevContactOpen(false)}
        profile={profile}
        authUser={authUser}
      />

      {/* Global Spotlight Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        jobs={jobs}
        onSelectJob={(job) => {
          setSelectedJob(job);
          setIsCommandPaletteOpen(false);
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onOpenProfile={() => {
          setIsProfileOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onOpenUploadModal={() => {
          setIsUploadModalOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSelectHub={(hub) => {
          setSelectedHub(hub as CorridorHub);
          setActiveTab('companies');
        }}
      />
    </div>
  );
};

export default App;
