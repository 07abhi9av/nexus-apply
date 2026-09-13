import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CandidateProfile, JobOpportunity, TelemetryEvent } from '../types.js';
import { delhiNcrCompanies } from './delhiNcrData.js';
import { enrichJobsWithHubs } from './bengaluruRemoteData.js';
import { detectDomainFromProfile, getDomainById } from './domainProfiles.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');
const SEEDED_FILE = path.join(DATA_DIR, 'jobs_seeded.json');

export const defaultProfile: CandidateProfile = {
  name: 'Abhinav Aryan',
  title: 'DevOps & Site Reliability / Platform Engineer',
  currentCompany: 'London Stock Exchange Group (LSEG)',
  email: 'abhinav.aryan0802@gmail.com',
  phone: '+91 77668 34875',
  location: 'Bengaluru, Karnataka, India',
  linkedin: 'https://linkedin.com/in/abhinavaryan07',
  github: 'https://github.com/07abhi9av',
  summary:
    'DevOps / Site Reliability Engineer with production experience managing Amazon EKS clusters, CI/CD automation, cloud infrastructure-as-code, and security hardening at London Stock Exchange Group. Proficient in Linux systems administration, Python, Bash, Terraform, and AWS, with hands-on ownership of high-availability Kubernetes environments, traffic failover, DDoS mitigation, and observability pipelines. Building toward integrating LLM-driven automation into incident triage, log analysis, and runbook generation to reduce operational toil at scale.',
  skills: [
    'Amazon EKS & Kubernetes',
    'Linux Systems Administration',
    'Python & TypeScript',
    'Bash / Shell Scripting',
    'Terraform (IaC)',
    'AWS (EKS, EC2, Route 53, IAM, VPC, S3)',
    'Route 53 GSLB & Multi-Region Recovery',
    'NGINX (Reverse Proxy, SSL/TLS, Rate Limiting)',
    'DDoS & Zip Bomb Mitigation',
    'AWS WAF & Security Hardening',
    'CI/CD (Jenkins, GitHub Actions, ArgoCD)',
    'GitOps & Spinnaker',
    'Observability (Datadog, Prometheus, Grafana)',
    'Elasticsearch / Splunk / JMeter',
    'Distributed Financial Systems',
    'Docker & Helm Chart Development',
    'PostgreSQL, MongoDB, Snowflake',
    'AI/LLM Automation (Anthropic Claude API)',
    'Agentic Workflows & AI Incident Triage'
  ],
  experience: [
    {
      role: 'Software Engineer – DevOps & Platform Engineering',
      company: 'London Stock Exchange Group (LSEG)',
      period: 'Aug 2025 – Present',
      highlights: [
        'Owned the full lifecycle of 3 production Amazon EKS clusters on Linux nodes — performing version upgrades, live rolling patches with zero downtime, node cordon/drain cycles, and cluster optimization — sustaining 99.9%+ availability across financial services workloads.',
        'Engineered production traffic failover using AWS Route 53 health checks and GSLB routing policies, enabling automatic rerouting and controlled multi-region recovery across distributed services.',
        'Hardened production security posture by identifying and remediating Zip Bomb and DDoS attack vectors; implemented WAF-level rate limiting and request filtering, reducing attack surface and improving platform resilience.',
        'Built and maintained 20+ Jenkins CI/CD pipelines across 6–7 services on Linux build agents, automating build, test, security scan, and release workflows; reduced release cycle time and eliminated manual handoffs.',
        'Authored reusable Terraform modules for infrastructure provisioning across 4 environments (dev, staging, UAT, prod) with remote state, state locking, and IAM least-privilege controls, cutting deployment time by 40%.',
        'Instrumented Datadog and Prometheus monitoring with custom dashboards and alert policies for production Kubernetes workloads; led root-cause analysis for availability incidents and authored post-mortems.',
        'Designed JMeter performance testing infrastructure on Linux simulating 500+ concurrent users; uncovered and resolved 3 critical scalability bottlenecks before production releases.',
        'Raised SonarQube code coverage from 68% to 90% across microservices by authoring 100+ unit and integration tests, reducing regression risk across automated release gates.'
      ]
    }
  ],
  projects: [
    {
      name: 'LLM-Powered Incident Triage & Runbook Engine',
      techStack: 'Python, Claude API, Elasticsearch, Kubernetes, Datadog, Prometheus',
      highlights: [
        'Built a Python backend service using the Anthropic Claude API that ingests Datadog alerts and Elasticsearch log streams, performs structured root-cause analysis, and auto-generates step-by-step runbooks with remediation actions.',
        'Implemented agentic classification workflows that parse incident metadata, identify impacted service dependencies, and route severity-ranked summaries to the correct on-call channel via REST webhooks.',
        'Reduced simulated mean time to diagnose (MTTD) by 60% in testing by eliminating manual log correlation; deployed on Kubernetes with Helm for repeatable execution across environments.'
      ]
    },
    {
      name: 'Cloud-Native Microservices Platform',
      techStack: 'AWS, Terraform, Kubernetes, ArgoCD, GitHub Actions, Docker, NGINX',
      highlights: [
        'Provisioned AWS VPC and Amazon EKS infrastructure on Linux using Terraform with remote state, state locking, and IAM-scoped access controls; configured NGINX as reverse proxy with SSL/TLS termination, load balancing, and rate limiting for ingress traffic.',
        'Containerized a microservices application with Docker and deployed Kubernetes Deployments, Services, Ingress, Persistent Volumes, and HPA autoscaling; validated cluster behaviour under load with Prometheus metrics.',
        'Implemented GitOps CD with ArgoCD and GitHub Actions, automating build-test-deploy with automated rollback on health-check failure.'
      ]
    },
    {
      name: 'Platform Readiness Validation Service',
      techStack: 'Python, Node.js, REST APIs, Docker, Kubernetes',
      highlights: [
        'Built a rule-based backend service for pre-deployment validation of Kubernetes manifests and application configuration — catching misconfigured resource limits, missing health probes, and policy violations before rollout.',
        'Exposed REST APIs for service registration, config checks, and remediation feedback; containerized with Docker and deployed on Kubernetes for repeatable use across development teams.'
      ]
    }
  ],
  education: [
    {
      institution: 'Vellore Institute of Technology (VIT)',
      degree: 'Bachelor of Technology, Information Technology',
      cgpa: '8.9 / 10.0',
      period: '2021 – 2025',
      location: 'Vellore, India'
    }
  ],
  certifications: [
    { name: 'AWS Certified Cloud Practitioner', date: 'Nov 2024' },
    { name: 'Microsoft Azure Fundamentals (AZ-900)', date: 'Oct 2024' },
    { name: 'Microsoft Azure AI Fundamentals (AI-900)', date: 'Oct 2024' },
    { name: 'Certified Kubernetes Administrator (CKA)', date: 'In Progress' },
    { name: 'AWS Solutions Architect – Associate', date: 'In Progress' }
  ],
  competencyVectors: {
    distributedSystems: 96,
    fintechProtocols: 94,
    cloudK8s: 99,
    reliabilityObservability: 97,
    securityDDoS: 95,
    aiAutomation: 92
  },
  preferences: {
    targetRoles: [
      'Site Reliability Engineer',
      'Platform Engineer',
      'Infrastructure Engineer',
      'Production Systems Engineer',
      'Cloud Architect'
    ],
    targetCompanies: [
      'Stripe',
      'Databricks',
      'Jane Street',
      'Citadel',
      'Ramp',
      'Robinhood',
      'Revolut',
      'Bloomberg',
      'Snowflake',
      'Brex',
      'Two Sigma',
      'Uber'
    ],
    locations: ['Bengaluru, India', 'Remote', 'London, UK', 'New York, NY', 'Singapore'],
    minMatchScore: 82,
    autoPilotEnabled: false
  }
};

let loadedJobs: JobOpportunity[] = [];
try {
  if (fs.existsSync(SEEDED_FILE)) {
    loadedJobs = JSON.parse(fs.readFileSync(SEEDED_FILE, 'utf-8'));
  }
} catch (e) {
  console.warn('Could not read jobs_seeded.json', e);
}

export const defaultJobs: JobOpportunity[] = loadedJobs.length > 0 ? loadedJobs : [
  {
    id: 'job-stripe-infra',
    title: 'Staff Infrastructure Engineer, Production Platform',
    company: 'Stripe',
    companyLogo: '💳',
    ats: 'greenhouse',
    category: 'Fintech',
    location: 'Remote / Global (Bengaluru/London/US)',
    type: 'Remote',
    compensation: '$210k - $285k + Equity',
    url: 'https://stripe.com/jobs/search?q=Infrastructure',
    description:
      'Stripe powers payments for millions of businesses. We are looking for an exceptional Infrastructure Engineer to scale our global compute platform, managing thousands of Kubernetes clusters, high-availability multi-region routing, zero-downtime rollouts, and multi-tenant security.',
    requiredSkills: [
      'Kubernetes & EKS',
      'Multi-Region Traffic Failover',
      'Infrastructure as Code (Terraform)',
      'High-Availability Financial Systems',
      'Observability at Scale',
      'Linux Kernel & Networking'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 96,
      strengths: [
        'Direct experience managing Amazon EKS clusters at 99.9%+ availability in LSEG financial production environments',
        'Proven expertise with Route 53 GSLB multi-region failover mirrors Stripe global ingress needs',
        'Deep security hardening background against DDoS and edge traffic vulnerabilities'
      ],
      gaps: ['Stripe relies heavily on Go & Ruby microservices in addition to Python'],
      lsegAdvantage:
        'LSEG financial exchange grade reliability and regulatory discipline provides high-confidence pedigree for Stripe mission-critical money movement.'
    },
    status: 'in_review',
    applicationPayload: {
      tailoredPitch:
        'At London Stock Exchange Group, I architected and maintained production EKS clusters sustaining 99.9%+ availability for Tier-1 financial workloads and designed automated multi-region GSLB failover. I am eager to bring this mission-critical financial systems reliability to Stripe’s global production compute platform.',
      customAnswers: {
        'Why Stripe?':
          'Stripe is the economic backbone of the internet. Having maintained high-stakes financial infrastructure at LSEG where downtime is unacceptable, scaling Stripe’s global payment compute mesh is the ultimate engineering challenge.',
        'High-Scale Experience':
          'Led rolling zero-downtime upgrades across production Kubernetes clusters, engineered AWS Route 53 GSLB automated failover, and mitigated critical DDoS/Zip Bomb vectors with WAF rate limiting.'
      },
      resumePath: 'Resume_abhinav.pdf'
    }
  },
  {
    id: 'job-ramp-infra',
    title: 'Senior Infrastructure & Cloud Platform Engineer',
    company: 'Ramp',
    companyLogo: '⚡',
    ats: 'ashby',
    category: 'Fintech',
    location: 'Remote / Hybrid',
    type: 'Remote',
    compensation: '$190k - $250k + Top Tier Equity',
    url: 'https://ramp.com/careers',
    description:
      'Ramp is the ultimate corporate card and finance automation platform. We are seeking a Senior Infrastructure Engineer to own our AWS cloud footprint, Kubernetes microservice fleets, automated CI/CD deployment pipelines, and Datadog monitoring fabrics.',
    requiredSkills: [
      'AWS & EKS',
      'Terraform Modules',
      'CI/CD Pipeline Automation',
      'Datadog / Prometheus Monitoring',
      'Python / TypeScript Automation',
      'Zero Downtime Deployments'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 97,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Exact match: Authored reusable Terraform modules across 4 environments with remote state locking',
        'Built 20+ CI/CD pipelines across microservices and automated release workflows',
        'Extensive Datadog custom dashboarding and alerting for live Kubernetes workloads'
      ],
      gaps: ['Ramp uses Elixir and Python in backend; experience with Elixir is bonus'],
      lsegAdvantage:
        'Proven fintech security posture (PCI/SOC2 readiness) aligns directly with Ramp corporate finance compliance requirements.'
    },
    status: 'matched'
  },
  {
    id: 'job-citadel-prod',
    title: 'Production Engineer - Low Latency Systems & Platform',
    company: 'Citadel Securities',
    companyLogo: '🏛️',
    ats: 'direct',
    category: 'Fintech',
    location: 'London, UK / Bengaluru / NYC',
    type: 'Hybrid',
    compensation: '$250k - $380k + Performance Bonus',
    url: 'https://www.citadelsecurities.com/careers/',
    description:
      'Citadel Securities is a premier global market maker. As a Production Systems Engineer, you will drive operational excellence for high-frequency trading platforms, kernel-level Linux tuning, network diagnostics (TCP/IP, iptables), and ultra-reliable automated deployment fabrics.',
    requiredSkills: [
      'Linux Kernel & Systems Administration',
      'TCP/IP, DNS, Networking Diagnostics',
      'Python & Bash Automation',
      'Mission-Critical SRE & Root-Cause Analysis',
      'High-Throughput Financial Systems'
    ],
    vectorScore: 92,
    matchBreakdown: {
      overall: 92,
      skillsMatch: 93,
      experienceMatch: 91,
      domainMatch: 94,
      strengths: [
        'Direct financial market operations pedigree from London Stock Exchange Group',
        'Demonstrated Linux systems troubleshooting, process/CPU diagnostics, and systemd mastery',
        'Led root-cause analysis for availability incidents and authored blameless post-mortems'
      ],
      gaps: ['Citadel often requires deep C++ profiling alongside Python scripting'],
      lsegAdvantage:
        'Familiarity with financial exchange data flows and high-availability operational requirements accelerates onboarding.'
    },
    status: 'discovered'
  },
  {
    id: 'job-databricks-cloud',
    title: 'Senior Systems & Cloud Infrastructure Engineer',
    company: 'Databricks',
    companyLogo: '🧱',
    ats: 'greenhouse',
    category: 'Tier-1 Product',
    location: 'Bengaluru / Remote',
    type: 'Hybrid',
    compensation: '$180k - $260k + RSU',
    url: 'https://www.databricks.com/company/careers',
    description:
      'Databricks lakehouse platform processes exabytes of data daily. We need a Senior Cloud Infrastructure Engineer to scale our multi-cloud Kubernetes fleets, optimize node maintenance and cordon/drain cycles, and engineer resilient cloud networking.',
    requiredSkills: [
      'Kubernetes Lifecycle Management',
      'Terraform Multi-Cloud',
      'HPA & Cluster Optimization',
      'Distributed Systems Reliability',
      'Observability & Incident Response'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 96,
      experienceMatch: 92,
      domainMatch: 93,
      strengths: [
        'Owned lifecycle of EKS clusters, node maintenance, version upgrades, HPA, and Helm charts',
        'Designed JMeter performance testing infrastructure uncovering critical scalability bottlenecks',
        'Building toward LLM-driven automation into incident triage and log analysis'
      ],
      gaps: ['Opportunity to expand from AWS specialization into Databricks multi-cloud (Azure/GCP)'],
      lsegAdvantage:
        'Experience operating heavy-throughput financial data pipelines translates directly to lakehouse data engine reliability.'
    },
    status: 'matched'
  },
  {
    id: 'job-robinhood-platform',
    title: 'Staff Platform Engineer, Core Infrastructure',
    company: 'Robinhood',
    companyLogo: '🏹',
    ats: 'greenhouse',
    category: 'Fintech',
    location: 'Remote / Bengaluru / Menlo Park',
    type: 'Remote',
    compensation: '$200k - $270k + Equity',
    url: 'https://robinhood.com/careers',
    description:
      'Robinhood is democratizing finance. The Core Infrastructure team builds the platform upon which all trade execution, clearing, and brokerage services run. You will design fault-tolerant service mesh architectures, automated failovers, and Kubernetes clusters.',
    requiredSkills: [
      'Kubernetes & Service Mesh',
      'Route 53 & GSLB Failover',
      'Security Hardening & WAF',
      'Python / Go Backend Platforms',
      'Financial Regulatory Compliance'
    ],
    vectorScore: 93,
    matchBreakdown: {
      overall: 93,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Production failover using Route 53 GSLB directly matches Robinhood brokerage high-availability criteria',
        'Mitigated WAF-level attack vectors and implemented DDoS rate limiting in a regulated financial environment',
        'Active advocate for reducing operational toil via automated runbooks'
      ],
      gaps: ['Robinhood uses Kafka extensively; can showcase messaging throughput metrics'],
      lsegAdvantage:
        'LSEG market infrastructure background makes Abhinav an immediate domain fit for brokerage and clearing platforms.'
    },
    status: 'applied',
    appliedAt: '2026-09-08T14:32:00.000Z',
    applicationPayload: {
      tailoredPitch:
        'Having owned production Amazon EKS clusters and automated GSLB failover for London Stock Exchange Group, I specialize in engineering resilient, high-availability platforms for financial institutions. I am eager to scale Robinhood’s core brokerage infrastructure.',
      customAnswers: {
        'Relevant Projects':
          'Implemented AWS Route 53 health-checked GSLB automatic failover across regions and reduced release cycles by maintaining 20+ Jenkins CI/CD pipelines with SonarQube quality gates.'
      },
      resumePath: 'Resume_abhinav.pdf'
    }
  },
  {
    id: 'job-revolut-sre',
    title: 'Lead Site Reliability Engineer - Core Banking Engine',
    company: 'Revolut',
    companyLogo: '🚀',
    ats: 'lever',
    category: 'Fintech',
    location: 'Bengaluru / Remote (Global)',
    type: 'Remote',
    compensation: '$170k - $240k + Equity',
    url: 'https://www.revolut.com/careers/',
    description:
      'Revolut serves 40M+ customers worldwide. Our Core Banking SRE team ensures that global payment gateways, ledger operations, and microservices remain online 24/7/365 with zero downtime.',
    requiredSkills: [
      'Site Reliability Engineering',
      'Kubernetes & Docker',
      'Prometheus, Grafana, Alerting',
      'Root-Cause Analysis & SRE Post-mortems',
      'Fintech Resiliency'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 96,
      experienceMatch: 94,
      domainMatch: 93,
      strengths: [
        'Sustained 99.9%+ uptime on live financial workloads with zero-downtime rolling upgrades',
        'Instrumented Datadog and Prometheus with custom SLO/SLA dashboards',
        'Production incident commander with disciplined blameless post-mortem practices'
      ],
      gaps: ['Revolut emphasizes Java/Kotlin backend services alongside platform tooling'],
      lsegAdvantage:
        'Direct alignment between LSEG exchange operations and Revolut core banking resilience standards.'
    },
    status: 'interviewing',
    appliedAt: '2026-09-04T10:15:00.000Z'
  },
  {
    id: 'job-janestreet-sys',
    title: 'Systems Infrastructure Engineer, Linux Platform',
    company: 'Jane Street',
    companyLogo: '📈',
    ats: 'direct',
    category: 'Fintech',
    location: 'London, UK / NYC',
    type: 'On-site',
    compensation: '$280k - $450k Base + Discretionary Bonus',
    url: 'https://www.janestreet.com/join-jane-street/',
    description:
      'Jane Street is a quantitative trading firm that trades hundreds of billions of dollars daily. We are looking for Systems Engineers passionate about Linux internals, low-latency networking, automated configuration management, and robust developer tooling.',
    requiredSkills: [
      'Linux Internals & Performance Tuning',
      'TCP/IP & Network Layer Troubleshooting',
      'Python / Bash Scripting',
      'Zero-Fail Operating Discipline',
      'High Volume Telemetry'
    ],
    vectorScore: 89,
    matchBreakdown: {
      overall: 89,
      skillsMatch: 91,
      experienceMatch: 88,
      domainMatch: 92,
      strengths: [
        'Kernel diagnostics, systemd, and iptables troubleshooting background',
        'Experience at Tier-1 exchange infrastructure (LSEG)',
        'Strong scripting in Python, Bash, and TypeScript'
      ],
      gaps: ['Jane Street core tech is OCaml; open-mindedness toward functional programming required'],
      lsegAdvantage:
        'LSEG pedigree guarantees respect for execution correctness and high-stakes operational hygiene.'
    },
    status: 'discovered'
  },
  {
    id: 'job-snowflake-infra',
    title: 'Staff Cloud Infrastructure & Kubernetes Architect',
    company: 'Snowflake',
    companyLogo: '❄️',
    ats: 'greenhouse',
    category: 'Tier-1 Product',
    location: 'Remote / Bengaluru',
    type: 'Hybrid',
    compensation: '$195k - $275k + RSU',
    url: 'https://careers.snowflake.com/',
    description:
      'Snowflake Data Cloud powers thousands of global enterprises. The Infrastructure Engineering organization designs, provisions, and safeguards our global cloud fleet across millions of vCPUs.',
    requiredSkills: [
      'Amazon EKS & Cloud Infrastructure',
      'Terraform Enterprise Modules',
      'Security & DDoS Hardening',
      'CI/CD Orchestration',
      'High-Scale Linux Systems'
    ],
    vectorScore: 91,
    matchBreakdown: {
      overall: 91,
      skillsMatch: 93,
      experienceMatch: 90,
      domainMatch: 90,
      strengths: [
        'Authored modular Terraform infrastructure cutting deployment times by 40%',
        'Hardened cloud security posture with WAF and PCI/SOC2 readiness',
        'Automated CI/CD workflows across multiple environments'
      ],
      gaps: ['Snowflake proprietary virtual warehouse architecture concepts'],
      lsegAdvantage:
        'LSEG already leverages Snowflake as part of its data stack, providing immediate product familiarity.'
    },
    status: 'matched'
  }
];

export const defaultTelemetry: TelemetryEvent[] = [
  {
    id: 'tel-01',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'INGESTION',
    company: 'Stripe',
    jobTitle: 'Staff Infrastructure Engineer, Production Platform',
    message: 'Ingested 1 new role via Greenhouse API (boards-api.greenhouse.io/v1/boards/stripe)'
  },
  {
    id: 'tel-02',
    timestamp: new Date(Date.now() - 3540000).toISOString(),
    type: 'VECTOR_MATCH',
    company: 'Stripe',
    jobTitle: 'Staff Infrastructure Engineer, Production Platform',
    message: 'Calculated Cosine Match: 96% fit with Abhinav Aryan (EKS + GSLB + LSEG Financial Systems)'
  },
  {
    id: 'tel-03',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'APPLICATION_SUCCESS',
    company: 'Robinhood',
    jobTitle: 'Staff Platform Engineer, Core Infrastructure',
    message: 'Application submitted & logged. Confirmation Ref: #APP-ROBINHOOD-9382'
  }
];

export const SERVICE_BASED_COMPANIES = new Set([
  'accenture',
  'capgemini',
  'cognizant',
  'epam systems',
  'epam',
  'hcl technologies',
  'hcl',
  'infosys',
  'ltimindtree',
  'mindtree',
  'mphasis',
  'tcs',
  'tata consultancy services',
  'tech mahindra',
  'wipro',
]);

export function isServiceBasedCompany(company: string): boolean {
  if (!company) return false;
  return SERVICE_BASED_COMPANIES.has(company.trim().toLowerCase());
}

export const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function checkAndResetExpiredApplications(jobs: JobOpportunity[]): { updatedJobs: JobOpportunity[]; hasChanges: boolean } {
  const now = Date.now();
  let hasChanges = false;

  const updatedJobs = jobs.map((job) => {
    if (job.status === 'applied' && job.appliedAt) {
      const appliedTime = new Date(job.appliedAt).getTime();
      if (!isNaN(appliedTime) && now - appliedTime >= ONE_WEEK_MS) {
        hasChanges = true;
        return {
          ...job,
          status: 'discovered' as const,
          appliedAt: undefined,
        };
      }
    }
    return job;
  });

  return { updatedJobs, hasChanges };
}

export function calculateRealMatchScore(
  job: {
    id?: string;
    company: string;
    title: string;
    description?: string;
    requiredSkills?: string[];
    sector?: string;
    category?: string;
  },
  profile: CandidateProfile
): {
  overall: number;
  skillsMatch: number;
  experienceMatch: number;
  domainMatch: number;
} {
  if (!profile) {
    return { overall: 85, skillsMatch: 85, experienceMatch: 85, domainMatch: 85 };
  }

  // 0. Detect active career domain track
  const domainTrack = detectDomainFromProfile(profile);

  const candidateSkills = (profile.skills || []).map((s) => s.toLowerCase().trim());
  const candidateProjects = (profile.projects || []).flatMap((p) => [
    p.name.toLowerCase(),
    p.techStack.toLowerCase(),
    ...(p.highlights || []).map((h) => h.toLowerCase()),
  ]);
  const candidateExp = (profile.experience || []).flatMap((e) => [
    e.role.toLowerCase(),
    e.company.toLowerCase(),
    ...(e.highlights || []).map((h) => h.toLowerCase()),
  ]);

  const candidateAllText = [...candidateSkills, ...candidateProjects, ...candidateExp].join(' ');
  const titleLower = (job.title || '').toLowerCase().trim();
  const descLower = (job.description || '').toLowerCase();
  const companyLower = (job.company || '').toLowerCase().trim();
  const sectorLower = (job.sector || job.category || '').toLowerCase();

  // 1. Skill Overlap Calculation (Weight: 45%)
  const jobSkills = (job.requiredSkills || []).map((s) => s.toLowerCase().trim());
  let skillMatchRatio = 0;

  if (jobSkills.length > 0) {
    let matchedCount = 0;
    for (const jSkill of jobSkills) {
      if (candidateSkills.some((cs) => cs === jSkill || cs.includes(jSkill) || jSkill.includes(cs))) {
        matchedCount += 1.0;
      } else if (candidateAllText.includes(jSkill)) {
        matchedCount += 0.8;
      } else if (domainTrack.coreSkills.some((ds) => ds.toLowerCase() === jSkill || jSkill.includes(ds.toLowerCase()))) {
        matchedCount += 0.7;
      }
    }
    skillMatchRatio = matchedCount / jobSkills.length;
  } else {
    // Check match against candidate's skills and domain track core skills in title & description
    const domainCoreSkillsLower = domainTrack.coreSkills.map((s) => s.toLowerCase());
    const matchedCore = domainCoreSkillsLower.filter((s) => descLower.includes(s) || titleLower.includes(s));
    const matchedCandidate = candidateSkills.filter((s) => descLower.includes(s) || titleLower.includes(s));
    const combinedMatches = Math.max(matchedCore.length, matchedCandidate.length);
    skillMatchRatio = Math.min(1.0, combinedMatches / 4);
  }

  // If candidate is looking for this domain and company is in the domain's priority list, boost skill ratio
  const isPriorityCompany = domainTrack.priorityCompanies.some(
    (pc) => companyLower === pc || companyLower.includes(pc) || pc.includes(companyLower)
  );
  if (isPriorityCompany) {
    skillMatchRatio = Math.max(skillMatchRatio, 0.94);
  }

  const skillsMatch = Math.min(98, Math.max(42, Math.round(skillMatchRatio * 100)));

  // 2. Role Title & Seniority Relevance (Weight: 30%)
  let experienceMatch = 72;

  // Direct keyword match with domain track
  const matchesDomainTitle = domainTrack.roleTitleKeywords.some((kw) => titleLower.includes(kw));
  const isTargetRole = (profile.preferences?.targetRoles || []).some(
    (tr) => titleLower.includes(tr.toLowerCase()) || tr.toLowerCase().includes(titleLower)
  );
  const isMismatch = domainTrack.mismatchKeywords.some((mw) => titleLower.includes(mw));

  if (isMismatch) {
    experienceMatch = 42;
  } else if (matchesDomainTitle || isTargetRole) {
    experienceMatch = 96;
    // Check seniority fit if seniority specified
    const seniority = (profile.seniority || '').toLowerCase();
    const isLeadershipRole =
      titleLower.includes('lead') ||
      titleLower.includes('staff') ||
      titleLower.includes('principal') ||
      titleLower.includes('director') ||
      titleLower.includes('head');

    if (isLeadershipRole) {
      if (seniority.includes('staff') || seniority.includes('lead') || seniority.includes('senior')) {
        experienceMatch = 96;
      } else if (seniority.includes('entry') || seniority.includes('junior')) {
        experienceMatch = 76;
      } else {
        experienceMatch = 86;
      }
    }
  } else if (isPriorityCompany) {
    if (
      titleLower.includes('engineer') ||
      titleLower.includes('developer') ||
      titleLower.includes('architect') ||
      titleLower.includes('platform')
    ) {
      experienceMatch = 95;
    } else {
      experienceMatch = 86;
    }
  } else if (
    titleLower.includes('software engineer') ||
    titleLower.includes('sde') ||
    titleLower.includes('systems') ||
    titleLower.includes('platform')
  ) {
    experienceMatch = 84;
  } else {
    experienceMatch = 68;
  }

  // 3. Domain & Sector Relevance (Weight: 25%)
  let domainMatch = 80;
  const targetCompanies = (profile.preferences?.targetCompanies || []).map((c) => c.toLowerCase());

  if (targetCompanies.some((tc) => companyLower.includes(tc) || tc.includes(companyLower))) {
    domainMatch = 98;
  } else if (isPriorityCompany) {
    domainMatch = 96;
  } else if (
    domainTrack.highFitSectors.some((hfs) => sectorLower.includes(hfs)) ||
    (domainTrack.id === 'data-engineering' && (descLower.includes('data') || descLower.includes('analytics'))) ||
    (domainTrack.id === 'devops-sre' && (descLower.includes('cloud') || descLower.includes('kubernetes'))) ||
    (domainTrack.id === 'ai-ml' && (descLower.includes('ai') || descLower.includes('machine learning')))
  ) {
    domainMatch = 94;
  } else if (sectorLower.includes('fintech') || sectorLower.includes('infra') || sectorLower.includes('saas')) {
    domainMatch = 88;
  } else if (sectorLower.includes('tier-1 product') || sectorLower.includes('faang')) {
    domainMatch = 86;
  }

  // 4. Stable Deterministic Variance (+/- 2%) based on company, job id and domain
  let hash = 0;
  const str = (job.id || '') + job.company + (job.title || '') + domainTrack.id;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  const variance = (Math.abs(hash) % 5) - 2; // -2 to +2

  // Overall Weighted Aggregate
  const overall = Math.min(
    98,
    Math.max(45, Math.round(skillsMatch * 0.45 + experienceMatch * 0.30 + domainMatch * 0.25) + variance)
  );

  return {
    overall,
    skillsMatch,
    experienceMatch,
    domainMatch,
  };
}

interface DatabaseStore {
  profile: CandidateProfile;
  jobs: JobOpportunity[];
  telemetry: TelemetryEvent[];
}

class StoreService {
  private store: DatabaseStore;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): DatabaseStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.jobs && Array.isArray(parsed.jobs)) {
          // Exclude service-based companies
          const filteredJobs = parsed.jobs.filter((j: JobOpportunity) => !isServiceBasedCompany(j.company));
          // Reset any expired applied jobs (> 7 days)
          const { updatedJobs, hasChanges } = checkAndResetExpiredApplications(filteredJobs);

          let mergedJobs = [...updatedJobs];
          let hasNcrAdditions = false;
          for (const ncr of delhiNcrCompanies) {
            const idx = mergedJobs.findIndex((j) => j.company.toLowerCase().trim() === ncr.company.toLowerCase().trim());
            if (idx === -1) {
              mergedJobs.unshift(ncr);
              hasNcrAdditions = true;
            } else if (mergedJobs[idx].hub !== 'Delhi NCR') {
              mergedJobs[idx] = {
                ...mergedJobs[idx],
                hub: 'Delhi NCR',
                subRegion: ncr.subRegion,
                sector: ncr.sector,
                location: ncr.location,
              };
              hasNcrAdditions = true;
            }
          }

          // Enrich all jobs with first-class Bengaluru, Remote, and Delhi NCR hubs & sub-regions
          const enrichedJobs = enrichJobsWithHubs(mergedJobs);

          const storeData: DatabaseStore = {
            ...parsed,
            jobs: enrichedJobs,
            profile: {
              ...defaultProfile,
              ...parsed.profile,
              projects: defaultProfile.projects,
              education: defaultProfile.education,
              certifications: defaultProfile.certifications,
            },
          };

          this.persist(storeData);
          return storeData;
        }
      }
    } catch (e) {
      console.warn('Could not read existing store, using defaults', e);
    }
    const cleanDefaultJobs = enrichJobsWithHubs(defaultJobs.filter((j) => !isServiceBasedCompany(j.company)));
    const initial: DatabaseStore = {
      profile: defaultProfile,
      jobs: cleanDefaultJobs,
      telemetry: defaultTelemetry,
    };
    this.persist(initial);
    return initial;
  }

  private persist(data: DatabaseStore) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist store', err);
    }
  }

  getProfile(): CandidateProfile {
    return this.store.profile;
  }

  updateProfile(profile: Partial<CandidateProfile>): CandidateProfile {
    this.store.profile = { ...this.store.profile, ...profile };
    // Immediately re-score all jobs against the new profile and career domain
    this.getJobs();
    this.persist(this.store);
    return this.store.profile;
  }

  getJobs(): JobOpportunity[] {
    // Dynamically filter out service companies and check 7-day auto-reset
    const nonServiceJobs = this.store.jobs.filter((j) => !isServiceBasedCompany(j.company));
    const { updatedJobs, hasChanges } = checkAndResetExpiredApplications(nonServiceJobs);
    const enriched = enrichJobsWithHubs(updatedJobs);

    // Compute genuine, realistic ATS match scores dynamically based on candidate profile
    const profile = this.store.profile;
    for (const job of enriched) {
      const match = calculateRealMatchScore(job, profile);
      job.vectorScore = match.overall;
      job.matchBreakdown = {
        ...job.matchBreakdown,
        overall: match.overall,
        skillsMatch: match.skillsMatch,
        experienceMatch: match.experienceMatch,
        domainMatch: match.domainMatch,
      };
      if (job.liveJobs && job.liveJobs.length > 0) {
        job.liveJobs = job.liveJobs.map((lj) => {
          const roleMatch = calculateRealMatchScore({ ...job, title: lj.title }, profile);
          return { ...lj, vectorScore: roleMatch.overall };
        });
      }
    }

    this.store.jobs = enriched;
    if (hasChanges || nonServiceJobs.length !== this.store.jobs.length) {
      this.persist(this.store);
    }

    return this.store.jobs;
  }

  getJobById(id: string): JobOpportunity | undefined {
    return this.store.jobs.find((j) => j.id === id);
  }

  addJobs(newJobs: JobOpportunity[]) {
    const existingIds = new Set(this.store.jobs.map((j) => j.id));
    for (const job of newJobs) {
      if (!existingIds.has(job.id) && !isServiceBasedCompany(job.company)) {
        this.store.jobs.unshift(job);
        existingIds.add(job.id);
      }
    }
    this.persist(this.store);
    return this.store.jobs;
  }

  updateJob(id: string, updates: Partial<JobOpportunity>): JobOpportunity | undefined {
    const idx = this.store.jobs.findIndex((j) => j.id === id);
    if (idx === -1) return undefined;
    this.store.jobs[idx] = { ...this.store.jobs[idx], ...updates };
    this.persist(this.store);
    return this.store.jobs[idx];
  }

  applyJobPortal(id: string): JobOpportunity | undefined {
    return this.updateJob(id, {
      status: 'applied',
      appliedAt: new Date().toISOString(),
    });
  }

  unapplyJob(id: string): JobOpportunity | undefined {
    return this.updateJob(id, {
      status: 'discovered',
      appliedAt: undefined,
    });
  }

  updateAllJobs(jobs: JobOpportunity[]): JobOpportunity[] {
    this.store.jobs = jobs.filter((j) => !isServiceBasedCompany(j.company));
    this.persist(this.store);
    return this.store.jobs;
  }

  resetAllJobs(): { count: number } {
    let count = 0;
    this.store.jobs = this.store.jobs.map((j) => {
      count++;
      return {
        ...j,
        status: 'discovered',
        appliedAt: undefined,
        applicationPayload: undefined,
      };
    });
    this.persist(this.store);
    return { count };
  }

  getTelemetry(): TelemetryEvent[] {
    return this.store.telemetry;
  }

  addTelemetry(event: Omit<TelemetryEvent, 'id' | 'timestamp'>): TelemetryEvent {
    const entry: TelemetryEvent = {
      id: `tel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      ...event
    };
    this.store.telemetry.unshift(entry);
    if (this.store.telemetry.length > 200) {
      this.store.telemetry = this.store.telemetry.slice(0, 200);
    }
    this.persist(this.store);
    return entry;
  }
}

export const db = new StoreService();
