import type { CandidateProfile, MatchBreakdown } from '../types.js';
import { detectDomainFromProfile } from './domainProfiles.js';

interface KeywordVector {
  term: string;
  weight: number;
  category: 'cloud' | 'linux' | 'fintech' | 'security' | 'cicd' | 'data' | 'ai' | 'backend' | 'frontend' | 'mobile';
}

const KNOWLEDGE_VECTORS: KeywordVector[] = [
  // Cloud & Infra
  { term: 'kubernetes', weight: 1.6, category: 'cloud' },
  { term: 'eks', weight: 1.6, category: 'cloud' },
  { term: 'aws', weight: 1.4, category: 'cloud' },
  { term: 'terraform', weight: 1.5, category: 'cloud' },
  { term: 'cloud', weight: 1.2, category: 'cloud' },
  { term: 'gcp', weight: 1.2, category: 'cloud' },
  { term: 'azure', weight: 1.2, category: 'cloud' },
  { term: 'docker', weight: 1.3, category: 'cloud' },
  { term: 'helm', weight: 1.3, category: 'cloud' },

  // Linux & Systems
  { term: 'linux', weight: 1.5, category: 'linux' },
  { term: 'kernel', weight: 1.2, category: 'linux' },
  { term: 'networking', weight: 1.3, category: 'linux' },
  { term: 'tcp/ip', weight: 1.2, category: 'linux' },
  { term: 'bash', weight: 1.3, category: 'linux' },
  { term: 'shell', weight: 1.2, category: 'linux' },

  // Reliability & SRE
  { term: 'sre', weight: 1.6, category: 'cloud' },
  { term: 'site reliability', weight: 1.6, category: 'cloud' },
  { term: 'reliability', weight: 1.4, category: 'cloud' },
  { term: 'failover', weight: 1.5, category: 'cloud' },
  { term: 'gslb', weight: 1.5, category: 'cloud' },
  { term: 'route 53', weight: 1.4, category: 'cloud' },
  { term: 'high availability', weight: 1.4, category: 'cloud' },
  { term: '99.9%', weight: 1.3, category: 'cloud' },
  { term: 'incident', weight: 1.2, category: 'cloud' },
  { term: 'mttd', weight: 1.3, category: 'cloud' },

  // CI/CD
  { term: 'jenkins', weight: 1.3, category: 'cicd' },
  { term: 'argocd', weight: 1.4, category: 'cicd' },
  { term: 'ci/cd', weight: 1.4, category: 'cicd' },
  { term: 'gitops', weight: 1.4, category: 'cicd' },
  { term: 'github actions', weight: 1.3, category: 'cicd' },

  // Observability
  { term: 'datadog', weight: 1.4, category: 'cloud' },
  { term: 'prometheus', weight: 1.4, category: 'cloud' },
  { term: 'grafana', weight: 1.3, category: 'cloud' },
  { term: 'elasticsearch', weight: 1.3, category: 'data' },
  { term: 'splunk', weight: 1.3, category: 'data' },

  // Security
  { term: 'ddos', weight: 1.4, category: 'security' },
  { term: 'waf', weight: 1.3, category: 'security' },
  { term: 'security', weight: 1.3, category: 'security' },
  { term: 'ssl/tls', weight: 1.2, category: 'security' },
  { term: 'nginx', weight: 1.3, category: 'security' },

  // Programming & Automation
  { term: 'python', weight: 1.4, category: 'linux' },
  { term: 'typescript', weight: 1.3, category: 'backend' },
  { term: 'javascript', weight: 1.2, category: 'frontend' },
  { term: 'react', weight: 1.4, category: 'frontend' },
  { term: 'next.js', weight: 1.3, category: 'frontend' },
  { term: 'vue', weight: 1.3, category: 'frontend' },
  { term: 'golang', weight: 1.3, category: 'backend' },
  { term: 'go', weight: 1.2, category: 'backend' },
  { term: 'java', weight: 1.3, category: 'backend' },
  { term: 'spring boot', weight: 1.3, category: 'backend' },
  { term: 'c++', weight: 1.2, category: 'backend' },
  { term: 'node.js', weight: 1.3, category: 'backend' },
  { term: 'distributed systems', weight: 1.5, category: 'backend' },
  { term: 'microservices', weight: 1.4, category: 'backend' },
  { term: 'postgresql', weight: 1.3, category: 'backend' },
  { term: 'sql', weight: 1.2, category: 'backend' },
  { term: 'redis', weight: 1.3, category: 'backend' },

  // Domain - Fintech
  { term: 'fintech', weight: 1.4, category: 'fintech' },
  { term: 'financial', weight: 1.3, category: 'fintech' },
  { term: 'trading', weight: 1.4, category: 'fintech' },
  { term: 'exchange', weight: 1.5, category: 'fintech' },

  // Data & AI
  { term: 'machine learning', weight: 1.5, category: 'ai' },
  { term: 'ai', weight: 1.4, category: 'ai' },
  { term: 'llm', weight: 1.5, category: 'ai' },
  { term: 'pytorch', weight: 1.5, category: 'ai' },
  { term: 'deep learning', weight: 1.5, category: 'ai' },
  { term: 'rag', weight: 1.4, category: 'ai' },
  { term: 'vector', weight: 1.3, category: 'ai' },
  { term: 'transformers', weight: 1.4, category: 'ai' },
  { term: 'hugging face', weight: 1.4, category: 'ai' },
  { term: 'langchain', weight: 1.4, category: 'ai' },
  { term: 'mlops', weight: 1.5, category: 'ai' },
  { term: 'nlp', weight: 1.4, category: 'ai' },
  { term: 'vision', weight: 1.3, category: 'ai' },
  { term: 'spark', weight: 1.4, category: 'data' },
  { term: 'kafka', weight: 1.4, category: 'data' },
  { term: 'snowflake', weight: 1.4, category: 'data' },
  { term: 'databricks', weight: 1.5, category: 'data' },
  { term: 'lakehouse', weight: 1.4, category: 'data' },
  { term: 'airflow', weight: 1.3, category: 'data' },
  { term: 'dbt', weight: 1.3, category: 'data' },
  { term: 'bigquery', weight: 1.3, category: 'data' },

  // Mobile
  { term: 'android', weight: 1.5, category: 'mobile' },
  { term: 'ios', weight: 1.5, category: 'mobile' },
  { term: 'swift', weight: 1.4, category: 'mobile' },
  { term: 'kotlin', weight: 1.4, category: 'mobile' },
  { term: 'mobile', weight: 1.4, category: 'mobile' },
];

export function computeVectorMatch(
  profile: CandidateProfile,
  jobTitle: string,
  jobDescription: string,
  requiredSkills: string[] = [],
  resumeText?: string
): { score: number; breakdown: MatchBreakdown } {
  const jdText = `${jobTitle} ${jobDescription} ${requiredSkills.join(' ')}`.toLowerCase();
  const titleLower = jobTitle.toLowerCase();
  
  // Combine all candidate text
  const candidateCorpus = [
    profile.summary || '',
    ...(profile.skills || []),
    resumeText || '',
    ...(profile.experience || []).map((e) => `${e.role} ${e.company} ${(e.highlights || []).join(' ')}`),
    ...(profile.projects || []).map((p) => `${p.name} ${p.techStack} ${(p.highlights || []).join(' ')}`)
  ].join(' ').toLowerCase();

  // 1. Skill & Keyword Vector Matching
  let matchedWeight = 0;
  let totalJdWeight = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const kv of KNOWLEDGE_VECTORS) {
    const inJd = new RegExp(`\\b${kv.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(jdText);
    if (inJd) {
      totalJdWeight += kv.weight;
      const inCandidate = new RegExp(`\\b${kv.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(candidateCorpus);
      if (inCandidate) {
        matchedWeight += kv.weight;
        matchedSkills.push(kv.term);
      } else {
        missingSkills.push(kv.term);
      }
    }
  }

  // Check required skills specifically with token subterm matching
  let reqMatchedCount = 0;
  for (const skill of requiredSkills) {
    const sLower = skill.toLowerCase();
    const isDirectMatch = candidateCorpus.includes(sLower) || (profile.skills || []).some((ps) => ps.toLowerCase().includes(sLower) || sLower.includes(ps.toLowerCase()));
    if (isDirectMatch) {
      reqMatchedCount++;
    } else {
      const words = sLower.split(/[\s,&/()\-]+/).filter((w) => w.length >= 3 && !['and', 'the', 'for', 'with', 'cloud', 'systems'].includes(w));
      const subMatch = words.some((w) => candidateCorpus.includes(w) || (profile.skills || []).some((ps) => ps.toLowerCase().includes(w)));
      if (subMatch) {
        reqMatchedCount += 0.85;
      }
    }
  }

  const reqRatio = requiredSkills.length > 0 ? (reqMatchedCount / requiredSkills.length) : 0.75;
  const vectorRatio = totalJdWeight > 0 ? (matchedWeight / totalJdWeight) : 0.70;
  let skillsScore = Math.round((reqRatio * 60) + (vectorRatio * 40));

  // 2. Dynamic Domain & Role Fit
  const activeDomain = detectDomainFromProfile(profile);
  const isTrackRoleMatch = (activeDomain.roleTitleKeywords || []).some((kw) => titleLower.includes(kw.toLowerCase()));
  const isTrackRoleMismatch = (activeDomain.mismatchKeywords || []).some((kw) => titleLower.includes(kw.toLowerCase()));
  const isPriorityComp = (activeDomain.priorityCompanies || []).some((c) => jdText.includes(c.toLowerCase()));
  const isTargetComp = (activeDomain.targetCompanies || []).some((c) => jdText.includes(c.toLowerCase()));

  // Check candidate's background domains vs job requirements
  const candHasCloud = /kubernetes|eks|aws|cloud|terraform|devops|sre|docker/i.test(candidateCorpus);
  const candHasBackend = /backend|software engineer|swe|distributed|api|java|node|python|golang|microservices/i.test(candidateCorpus);
  const candHasFrontend = /frontend|react|vue|angular|typescript|javascript|next\.js|ui/i.test(candidateCorpus);
  const candHasFintech = /fintech|trading|exchange|market|lseg|financial/i.test(candidateCorpus);
  const candHasMobile = /ios|android|swift|kotlin|flutter|react native/i.test(candidateCorpus);
  const candHasData = /data|spark|kafka|etl|machine learning|ai|llm/i.test(candidateCorpus);

  const isJobCloud = /sre|site reliability|devops|platform|infrastructure|cloud|kubernetes|production engineer/i.test(titleLower);
  const isJobBackend = /software engineer|backend|distributed|systems|swe|full stack|platform engineer/i.test(titleLower);
  const isJobFrontend = /frontend|front-end|ui|web|react/i.test(titleLower);
  const isJobMobile = /android|ios|mobile|flutter|react native|swift|kotlin/i.test(titleLower);
  const isJobData = /data engineer|machine learning|mle|ai engineer|data scientist/i.test(titleLower);
  const isJobFintech = /fintech|trading|exchange|market|financial|payments?/i.test(jdText);

  let domainScore = 78;

  if (isTrackRoleMatch) {
    skillsScore = Math.max(skillsScore, isPriorityComp ? 96 : isTargetComp ? 94 : 92);
    domainScore = isPriorityComp ? 98 : isTargetComp ? 96 : 94;
  } else if (isJobCloud && candHasCloud) {
    domainScore = 93;
  } else if (isJobBackend && (candHasBackend || candHasCloud)) {
    domainScore = 88;
  } else if (isJobFrontend && candHasFrontend) {
    domainScore = 90;
  } else if (isJobData && candHasData) {
    domainScore = 91;
  } else if (isJobMobile) {
    domainScore = candHasMobile ? 94 : 50;
  } else {
    // General engineering alignment based on skills overlap
    domainScore = Math.min(92, Math.max(55, Math.round(skillsScore * 0.95)));
  }

  if (isTrackRoleMismatch) {
    domainScore = Math.max(45, domainScore - 25);
  }

  if (isJobFintech && candHasFintech) {
    domainScore = Math.min(99, domainScore + 4);
  }

  // 3. Experience & Seniority Fit
  let expScore = 86;
  if (/principal|director|vp|head of/i.test(titleLower)) {
    expScore = 58;
  } else if (/staff|lead|architect/i.test(titleLower)) {
    expScore = 78;
  } else if (/senior/i.test(titleLower)) {
    expScore = 86;
  } else if (/intern|junior|entry|associate|swe i\b|swe ii\b|sre i\b|sre ii\b/i.test(titleLower)) {
    expScore = 96;
  }

  // Calculate composite match score
  let calculatedOverall = Math.round((skillsScore * 0.45) + (domainScore * 0.40) + (expScore * 0.15));
  calculatedOverall = Math.max(48, Math.min(98, calculatedOverall));

  const skillsMatch = Math.max(45, Math.min(98, Math.round(skillsScore)));
  const experienceMatch = Math.max(50, Math.min(98, Math.round(expScore)));
  const domainMatch = Math.max(45, Math.min(99, Math.round(domainScore)));

  // Strengths based on actual matched skills and candidate highlights
  const strengths: string[] = [];
  const primaryEmployer = profile.experience?.[0]?.company || 'enterprise production';

  if (matchedSkills.includes('kubernetes') || matchedSkills.includes('eks')) {
    strengths.push(`Production Kubernetes/EKS cluster operational ownership with zero downtime at ${primaryEmployer}`);
  }
  if (matchedSkills.includes('route 53') || matchedSkills.includes('failover') || isJobFintech) {
    strengths.push('Architected Route 53 GSLB multi-region failover sustaining 99.9%+ availability');
  }
  if (matchedSkills.includes('terraform') || matchedSkills.includes('aws') || matchedSkills.includes('cloud')) {
    strengths.push('Authored modular cloud infrastructure IaC reducing deployment provisioning times');
  }
  if (matchedSkills.includes('datadog') || matchedSkills.includes('prometheus')) {
    strengths.push('Implemented real-time telemetry fabrics, incident response, and SLO-based alerting');
  }
  if (matchedSkills.includes('react') || matchedSkills.includes('typescript')) {
    strengths.push('Engineered modular component architectures with responsive, type-safe frontend stores');
  }
  if (matchedSkills.includes('node.js') || matchedSkills.includes('python') || matchedSkills.includes('go')) {
    strengths.push('Developed scalable microservice endpoints and automated deployment pipelines');
  }

  if (strengths.length < 2) {
    strengths.push('Core engineering foundations across automated testing and deployment lifecycles');
    strengths.push(`High-availability systems background from ${primaryEmployer}`);
  }

  // Actionable gaps based on missing skills
  const gaps: string[] = [];
  if (missingSkills.length > 0) {
    gaps.push(`Familiarity with role-specific stack: ${missingSkills.slice(0, 3).join(', ')}`);
  }
  if (isJobMobile && !candHasMobile) {
    gaps.push('Role expects native mobile SDK experience (iOS/Android/React Native)');
  }
  if (gaps.length === 0) {
    gaps.push('Highlight company-specific developer platform tools and workflows');
  }

  const lsegAdvantage = `Operating mission-critical infrastructure at ${primaryEmployer} (sustaining high uptime, audit rigor, and disaster recovery) guarantees high reliability standards for tier-1 engineering organizations.`;

  return {
    score: calculatedOverall,
    breakdown: {
      overall: calculatedOverall,
      skillsMatch,
      experienceMatch,
      domainMatch,
      strengths: strengths.slice(0, 3),
      gaps: gaps.slice(0, 2),
      lsegAdvantage
    }
  };
}
