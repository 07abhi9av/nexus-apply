-- ================================================================
-- INGRESS v0.5 - PRODUCTION SUPABASE DATABASE SCHEMA
-- PostgreSQL schema for Supabase (Auth + Data Storage + RLS)
-- ================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------
-- 1. CANDIDATE PROFILES (Linked to auth.users)
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  avatar_url text,
  title text,
  current_company text,
  location text,
  linkedin text,
  github text,
  summary text,
  skills text[] default array[]::text[],
  experience jsonb default '[]'::jsonb,
  projects jsonb default '[]'::jsonb,
  education jsonb default '[]'::jsonb,
  certifications jsonb default '[]'::jsonb,
  competency_vectors jsonb default '{"distributedSystems": 0, "cloudK8s": 0, "reliabilityObservability": 0}'::jsonb,
  preferences jsonb default '{"minMatchScore": 70, "targetRoles": []}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- ----------------------------------------------------------------
-- 2. VERIFIED CAREER PORTALS & TECH CORRIDOR JOBS
-- ----------------------------------------------------------------
create table if not exists public.jobs (
  id text primary key,
  title text not null,
  company text not null,
  company_logo text,
  domain text,
  hub text not null, -- 'Delhi NCR', 'Bengaluru', 'Remote'
  sub_region text,
  corridor_nodes text,
  sector text not null,
  category text not null,
  location text not null,
  type text default 'Full-time',
  compensation text,
  url text not null,
  description text,
  required_skills text[] default array[]::text[],
  vector_score integer default 85,
  match_breakdown jsonb default '{}'::jsonb,
  live_jobs jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null
);

-- ----------------------------------------------------------------
-- 3. USER JOB APPLICATIONS & 7-DAY COOLDOWN TRACKER
-- ----------------------------------------------------------------
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  job_id text references public.jobs(id) on delete cascade not null,
  status text not null check (status in ('applied', 'in_review', 'interview', 'offer', 'rejected', 'archived')),
  applied_at timestamptz default now() not null,
  cooldown_until timestamptz default (now() + interval '7 days') not null,
  notes text,
  tailored_resume_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique (user_id, job_id)
);

-- ----------------------------------------------------------------
-- 4. ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;

-- Profiles: Users can view & update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Jobs: Publicly viewable by all authenticated and anonymous users
create policy "Jobs are publicly viewable"
  on public.jobs for select
  using (true);

-- Applications: Users can strictly access only their own applications
create policy "Users can view own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- 5. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ----------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  _name text;
begin
  _name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, full_name, email, phone, avatar_url)
  values (
    new.id,
    _name,
    new.email,
    new.raw_user_meta_data->>'phone',
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      'https://ui-avatars.com/api/?name=' || replace(_name, ' ', '+') || '&background=0A84FF&color=fff'
    )
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger whenever a user registers or logs in via Google/Email/Phone
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------
-- 6. CORE SEED DATA (Top Verified Employers Across Corridors)
-- ----------------------------------------------------------------
insert into public.jobs (id, title, company, company_logo, domain, hub, sub_region, corridor_nodes, sector, category, location, compensation, url, description, vector_score, required_skills)
values
  -- Delhi NCR Hub
  ('ncr-zomato-sre', 'Senior Site Reliability Engineer - Core Platform', 'Zomato', 'https://cdn.brandfetch.io/id_Zomato/w/400/h/400/theme/dark/icon.png', 'zomato.com', 'Delhi NCR', 'Gurugram', 'Cyber City / Phase 2', 'Consumer Tech', 'Consumer Tech', 'Gurugram, Haryana', '₹38L - ₹54L + ESOPs', 'https://www.zomato.com/careers', 'Own high-scale Kubernetes clusters powering real-time order matching for 2.5M concurrent daily orders.', 96, array['Kubernetes', 'AWS', 'Prometheus', 'Datadog', 'Go', 'Python']),
  ('ncr-paytm-infra', 'Staff Infrastructure Engineer - Payments Gateway', 'Paytm', 'https://cdn.brandfetch.io/id_Paytm/w/400/h/400/theme/dark/icon.png', 'paytm.com', 'Delhi NCR', 'Noida', 'Sector 62 Tech Zone', 'Fintech', 'Fintech', 'Noida, Uttar Pradesh', '₹40L - ₹58L', 'https://paytm.com/careers', 'High-throughput payment gateway infrastructure engineering handling 100M+ daily financial transactions.', 94, array['Terraform', 'EKS', 'Route 53', 'Linux', 'PCI-DSS']),
  ('ncr-blinkit-plat', 'Platform Engineer - 10-Min Dispatch Mesh', 'Blinkit', 'https://cdn.brandfetch.io/id_Blinkit/w/400/h/400/theme/dark/icon.png', 'blinkit.com', 'Delhi NCR', 'Gurugram', 'Golf Course Road', 'Quick Commerce', 'Quick Commerce', 'Gurugram, Haryana', '₹35L - ₹48L', 'https://blinkit.com/careers', 'Low-latency routing, inventory indexing, and fleet dispatch cloud microservices with sub-50ms p99 latency.', 95, array['Docker', 'Kubernetes', 'AWS', 'Kafka', 'Redis']),

  -- Bengaluru Hub
  ('blr-swiggy-sre', 'Principal Site Reliability Engineer', 'Swiggy', 'https://cdn.brandfetch.io/id_Swiggy/w/400/h/400/theme/dark/icon.png', 'swiggy.com', 'Bengaluru', 'Outer Ring Road', 'Outer Ring Road / Bellandur', 'Consumer Tech', 'Consumer Tech', 'Bengaluru, Karnataka', '₹45L - ₹65L + Stocks', 'https://careers.swiggy.com', 'Hyper-scale logistics routing, zero-downtime cluster rollouts, and multi-region failover across 200+ Kubernetes nodes.', 97, array['Kubernetes', 'AWS', 'Multi-Region', 'Terraform', 'Observability']),
  ('blr-cred-infra', 'Security & Infrastructure Engineer', 'CRED', 'https://cdn.brandfetch.io/id_CRED/w/400/h/400/theme/dark/icon.png', 'cred.club', 'Bengaluru', 'Indiranagar & CBD', 'Indiranagar / 100ft Rd', 'Fintech', 'Fintech', 'Bengaluru, Karnataka', '₹42L - ₹60L', 'https://cred.club/careers', 'Zero-trust infrastructure security, microservice mesh isolation, and AWS security hardening for high-value financial credit pipelines.', 96, array['AWS WAF', 'Kubernetes', 'Terraform', 'DDoS Mitigation', 'Linux Hardening']),
  ('blr-razorpay-plat', 'Senior Platform Engineer - Banking Suite', 'Razorpay', 'https://cdn.brandfetch.io/id_Razorpay/w/400/h/400/theme/dark/icon.png', 'razorpay.com', 'Bengaluru', 'Koramangala & HSR', 'Koramangala 4th Block', 'Fintech', 'Fintech', 'Bengaluru, Karnataka', '₹36L - ₹52L', 'https://razorpay.com/jobs', 'Banking neobank infrastructure, automated CI/CD deployment pipelines, and high-frequency webhook delivery engine.', 95, array['Kubernetes', 'Go', 'Docker', 'Jenkins', 'PostgreSQL']),

  -- Remote & Distributed Hub
  ('rem-stripe-staff', 'Staff Production Infrastructure Engineer', 'Stripe', 'https://cdn.brandfetch.io/id_Stripe/w/400/h/400/theme/dark/icon.png', 'stripe.com', 'Remote', 'Global Remote', 'Global Async-First', 'Fintech', 'Fintech', 'Remote (India / Global)', '$190k - $260k + Equity', 'https://stripe.com/jobs', 'Global financial compute grid scaling thousands of Kubernetes clusters, high-availability multi-region routing, and zero-downtime rollouts.', 96, array['Kubernetes', 'Terraform', 'Multi-Region', 'Linux Kernel', 'Observability']),
  ('rem-gitlab-dist', 'Senior Production Engineer - Cloud Native', 'GitLab', 'https://cdn.brandfetch.io/id_GitLab/w/400/h/400/theme/dark/icon.png', 'gitlab.com', 'Remote', 'Global Remote', '100% Remote / Async', 'Developer Tools', 'Developer Tools', 'Remote (Worldwide)', '$150k - $210k', 'https://about.gitlab.com/jobs', '100% remote asynchronous engineering team operating large-scale distributed GitLab.com infrastructure on Kubernetes.', 94, array['Kubernetes', 'Terraform', 'Linux', 'CI/CD', 'GitOps'])
on conflict (id) do nothing;

-- ----------------------------------------------------------------
-- 7. HIGH-PERFORMANCE INDEXES (Sub-Millisecond Query Response)
-- ----------------------------------------------------------------
create index if not exists idx_jobs_hub on public.jobs(hub);
create index if not exists idx_jobs_sector on public.jobs(sector);
create index if not exists idx_jobs_vector_score on public.jobs(vector_score desc);
create index if not exists idx_applications_user on public.applications(user_id);
create index if not exists idx_applications_cooldown on public.applications(cooldown_until);
create index if not exists idx_profiles_email on public.profiles(email);