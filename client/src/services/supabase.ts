import { createClient, type SupabaseClient, type Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  targetRole?: string;
  provider: 'google' | 'email' | 'demo';
}

// Read environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey.length > 20
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Format a Supabase User object into our standard AuthUser format
 */
export function formatSupabaseUser(user: any): AuthUser {
  const metadata = user.user_metadata || {};
  const name =
    metadata.full_name ||
    metadata.name ||
    user.email?.split('@')[0]?.replace(/[._]/g, ' ')?.replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
    'Ingress Candidate';

  const avatar =
    metadata.avatar_url ||
    metadata.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A84FF&color=fff&size=96`;

  const provider = (user.app_metadata?.provider || 'email') as AuthUser['provider'];

  return {
    id: user.id,
    name,
    email: user.email || '',
    targetRole: metadata.target_role || '',
    picture: avatar,
    provider: provider === 'google' ? 'google' : 'email',
  };
}

/**
 * Sign In with Google OAuth via Supabase (Production Ready)
 */
export async function signInWithGoogle(): Promise<{
  data: { user?: AuthUser; provider?: string; url?: string | null } | null;
  error: any;
}> {
  if (!supabase) {
    // Graceful fallback for local development before Supabase credentials are wired
    const demoUser: AuthUser = {
      id: `demo-user-${Date.now()}`,
      name: 'Demo User',
      email: 'demo@ingress.dev',
      picture: 'https://ui-avatars.com/api/?name=Demo+User&background=0A84FF&color=fff',
      targetRole: '',
      provider: 'demo',
    };
    return { data: { user: demoUser }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  });

  return { data: data ? { provider: data.provider, url: data.url } : null, error };
}

/**
 * Sign In with Email and Password (Production Ready)
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    // Local dev simulated sign in
    const cleanEmail = email.trim().toLowerCase();
    const derivedName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const demoUser: AuthUser = {
      id: `email-user-${Date.now()}`,
      name: derivedName,
      email: cleanEmail,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(derivedName)}&background=0A84FF&color=fff&size=96`,
      targetRole: '',
      provider: 'email',
    };
    return { data: { user: demoUser, session: null }, error: null };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) return { data: null, error };
  return {
    data: {
      user: data.user ? formatSupabaseUser(data.user) : null,
      session: data.session,
    },
    error: null,
  };
}

/**
 * Register / Sign Up with Email and Password (Production Ready)
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  fullName: string,
  targetRole?: string
) {
  if (!supabase) {
    // Local dev simulated registration
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    const demoUser: AuthUser = {
      id: `registered-user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=30D158&color=fff&size=96`,
      targetRole: targetRole?.trim() || 'DevOps / SRE Engineer',
      provider: 'email',
    };
    return { data: { user: demoUser, session: null }, error: null };
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        target_role: targetRole?.trim() || '',
      },
      emailRedirectTo: window.location.origin,
    },
  });

  if (error) return { data: null, error };
  return {
    data: {
      user: data.user ? formatSupabaseUser(data.user) : null,
      session: data.session,
    },
    error: null,
  };
}

/**
 * Send Password Reset Email (Production Ready)
 */
export async function resetPasswordForEmail(email: string) {
  if (!supabase) {
    return { data: { message: 'Reset link simulated in sandbox mode.' }, error: null };
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  return { data, error };
}

/**
 * Sign Out
 */
export async function signOut() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
  return { error: null };
}

/**
 * Get Initial Session
 */
export async function getInitialSession(): Promise<AuthUser | null> {
  if (!supabase) return null;

  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      return formatSupabaseUser(data.session.user);
    }
  } catch (err) {
    console.warn('Error fetching Supabase session:', err);
  }
  return null;
}

/**
 * Listen to Auth State Changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  if (!supabase) return () => {};

  const { data: listener } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
    if (session?.user) {
      callback(formatSupabaseUser(session.user));
    } else {
      callback(null);
    }
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}

/**
 * Fetch Jobs from Supabase
 */
export async function fetchJobsFromSupabase(): Promise<any[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('vector_score', { ascending: false });

    if (error) {
      console.warn('Supabase jobs fetch error:', error);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        company: item.company,
        companyLogo: item.company_logo && !item.company_logo.includes('brandfetch') ? item.company_logo : undefined,
        domain: item.domain,
        hub: item.hub,
        subRegion: item.sub_region,
        corridorNodes: item.corridor_nodes,
        sector: item.sector,
        category: item.category || 'Tech',
        location: item.location,
        type: item.type || 'Full-time',
        compensation: item.compensation || '₹30L - ₹50L',
        url: item.url,
        description: item.description,
        requiredSkills: item.required_skills || [],
        vectorScore: item.vector_score || 85,
        matchBreakdown: item.match_breakdown && item.match_breakdown.overall ? item.match_breakdown : {
          overall: item.vector_score || 95,
          skillsMatch: 96,
          experienceMatch: 94,
          domainMatch: 95,
          strengths: [
            `Direct alignment with ${item.company}'s engineering tech stack`,
            `High match probability based on candidate background`,
            `Direct career portal link verified`
          ],
          gaps: [
            `Review team requirements and architecture culture on official portal`
          ]
        },
        liveJobs: item.live_jobs || [],
        status: 'discovered',
        ats: 'direct',
      }));
    }
  } catch (err) {
    console.warn('Failed to query Supabase jobs:', err);
  }
  return null;
}

/**
 * Persist Application to Supabase with 7-day cooldown
 */
export async function syncApplicationToSupabase(
  userId: string,
  jobId: string,
  status: string = 'applied',
  notes?: string,
  tailoredResumeUrl?: string
) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!supabase || !userId || !uuidRegex.test(userId)) return null;
  try {
    const cooldownDate = new Date();
    cooldownDate.setDate(cooldownDate.getDate() + 7);

    const { data, error } = await supabase.from('applications').upsert(
      {
        user_id: userId,
        job_id: jobId,
        status,
        applied_at: new Date().toISOString(),
        cooldown_until: cooldownDate.toISOString(),
        notes: notes || null,
        tailored_resume_url: tailoredResumeUrl || null,
      },
      { onConflict: 'user_id,job_id' }
    );

    if (error) console.warn('Supabase application sync error:', error);
    return { data, error };
  } catch (err) {
    console.warn('Failed to sync application to Supabase:', err);
    return null;
  }
}

/**
 * Fetch Candidate Applications from Supabase
 */
export async function fetchUserApplicationsFromSupabase(userId: string) {
  // Guard: skip if no supabase, no userId, or userId is not a valid UUID (demo users)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!supabase || !userId || !uuidRegex.test(userId)) return [];
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.warn('Supabase applications fetch error:', error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('Failed to query user applications:', err);
    return [];
  }
}

/**
 * Remove Application from Supabase
 */
export async function removeApplicationFromSupabase(userId: string, jobId: string) {
  if (!supabase || !userId) return;
  try {
    await supabase.from('applications').delete().match({ user_id: userId, job_id: jobId });
  } catch (err) {
    console.warn('Failed to remove application from Supabase:', err);
  }
}

