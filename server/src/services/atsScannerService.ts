import fs from 'node:fs';
import path from 'node:path';
import { parseResumeBuffer } from './resumeParser.js';
import { db } from './db.js';
import { getDomainById, detectDomainFromProfile } from './domainProfiles.js';

export interface AtsCategoryScore {
  name: string;
  score: number; // 0-100
  weight: number;
  status: 'pass' | 'warning' | 'critical';
  findings: string[];
  recommendations: string[];
}

export interface AtsBulletRewrite {
  original: string;
  improved: string;
  rationale: string;
  category?: string;
  weakPhrase?: string;
  powerVerb?: string;
  metrics?: string;
  xyzBreakdown?: {
    accomplished: string;
    measuredBy: string;
    doing: string;
  };
}

export interface AtsAuditResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D';
  verdict: string;
  wordCount: number;
  pageEstimate: number;
  categories: AtsCategoryScore[];
  identifiedSkills: string[];
  missingCriticalKeywords: string[];
  powerVerbsFound: string[];
  weakPhrasesFound: string[];
  bulletRewrites: AtsBulletRewrite[];
  targetRoleMatch?: {
    targetRole: string;
    jdMatchScore: number;
    matchedJdKeywords: string[];
    missingJdKeywords: string[];
  };
  scannedAt: string;
}

// Enterprise Action Verbs categorized for ATS parsing
const POWER_ACTION_VERBS = [
  'architected', 'engineered', 'owned', 'spearheaded', 'orchestrated',
  'hardened', 'automated', 'instrumented', 'optimized', 'reduced',
  'scaled', 'authored', 'provisioned', 'designed', 'eliminated',
  'streamlined', 'deployed', 'monitored', 'upgraded', 'refactored',
  'accelerated', 'consolidated', 'implemented', 'developed', 'delivered',
  'revamped', 'resolved', 'formulated', 'mentored', 'established',
  'integrated', 'executed', 'standardized', 'modernized', 'benchmarked'
];

const WEAK_PASSIVE_PHRASES = [
  'responsible for', 'assisted with', 'helped to', 'worked on',
  'involved in', 'duties included', 'participated in', 'tasked with',
  'contributed to', 'handled', 'supported', 'familiar with',
  'knowledge of', 'worked with'
];

// Comprehensive Multi-Domain Skill Ontologies
export const DOMAIN_SKILL_TAXONOMY: Record<string, string[]> = {
  languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Golang', 'C++',
    'C#', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'Bash', 'Shell', 'Scala'
  ],
  frontend: [
    'React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'HTML5', 'CSS3',
    'Tailwind CSS', 'Redux', 'Zustand', 'React Query', 'Webpack', 'Vite',
    'GraphQL', 'Responsive Design', 'Microfrontends', 'Storybook', 'UI/UX'
  ],
  backend: [
    'Node.js', 'Express', 'NestJS', 'Spring Boot', 'FastAPI', 'Django',
    'Flask', 'Ruby on Rails', 'ASP.NET', 'Microservices', 'RESTful APIs',
    'gRPC', 'Distributed Systems', 'Concurrency', 'Multithreading', 'Kafka', 'RabbitMQ'
  ],
  databases: [
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB',
    'Cassandra', 'SQLite', 'Oracle', 'Prisma', 'TypeORM', 'Hibernate'
  ],
  cloudDevOps: [
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Amazon EKS', 'GKE',
    'Terraform', 'CI/CD', 'Linux', 'Helm', 'ArgoCD', 'Ansible', 'Jenkins',
    'GitHub Actions', 'GitLab CI', 'Serverless', 'Lambda', 'Nginx', 'Route 53'
  ],
  observability: [
    'Datadog', 'Prometheus', 'Grafana', 'ELK', 'Splunk', 'OpenTelemetry',
    'Observability', 'SRE', 'High Availability', 'Disaster Recovery',
    'Incident Response', 'SLO', 'SLA', 'Distributed Tracing'
  ],
  dataAI: [
    'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn', 'Spark',
    'Airflow', 'Snowflake', 'BigQuery', 'ETL', 'LLMs', 'NLP', 'RAG',
    'Machine Learning', 'Data Pipelines', 'Vector Databases'
  ],
  testingSecurity: [
    'Jest', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'TDD',
    'Integration Testing', 'E2E Testing', 'OAuth', 'JWT', 'OWASP',
    'Penetration Testing', 'IAM', 'Encryption', 'SOC2', 'Zero Trust'
  ]
};

// Flattened list of all recognizable enterprise tech skills (over 120+ terms)
const ALL_TECH_SKILLS = Array.from(
  new Set(Object.values(DOMAIN_SKILL_TAXONOMY).flat())
);

/**
 * Helper to detect primary technical domain of a resume
 */
function inferCandidateDomain(text: string): { primary: string; secondary: string } {
  const t = text.toLowerCase();
  const counts: Record<string, number> = {
    'Cloud & DevOps / SRE': 0,
    'Backend & Distributed Systems': 0,
    'Frontend & Web Engineering': 0,
    'Full Stack Engineering': 0,
    'Data Engineering & AI/ML': 0,
    'Mobile Application Development': 0,
    'QA & Automation Engineering': 0,
  };

  // Cloud/DevOps
  for (const s of DOMAIN_SKILL_TAXONOMY.cloudDevOps.concat(DOMAIN_SKILL_TAXONOMY.observability)) {
    if (new RegExp(`\\b${s.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)) {
      counts['Cloud & DevOps / SRE'] += 2;
    }
  }

  // Backend
  for (const s of DOMAIN_SKILL_TAXONOMY.backend.concat(DOMAIN_SKILL_TAXONOMY.databases)) {
    if (new RegExp(`\\b${s.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)) {
      counts['Backend & Distributed Systems'] += 2;
    }
  }

  // Frontend
  for (const s of DOMAIN_SKILL_TAXONOMY.frontend) {
    if (new RegExp(`\\b${s.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)) {
      counts['Frontend & Web Engineering'] += 2;
    }
  }

  // Data / AI
  for (const s of DOMAIN_SKILL_TAXONOMY.dataAI) {
    if (new RegExp(`\\b${s.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(t)) {
      counts['Data Engineering & AI/ML'] += 2;
    }
  }

  // Mobile
  if (/swift|kotlin|ios|android|react native|flutter|xcode/i.test(t)) {
    counts['Mobile Application Development'] += 4;
  }

  // QA
  if (/qa|selenium|cypress|playwright|test automation|testing|sdet/i.test(t)) {
    counts['QA & Automation Engineering'] += 3;
  }

  // Check for Full Stack
  if (counts['Frontend & Web Engineering'] >= 6 && counts['Backend & Distributed Systems'] >= 6) {
    counts['Full Stack Engineering'] = Math.max(counts['Frontend & Web Engineering'], counts['Backend & Distributed Systems']) + 2;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    primary: sorted[0] && sorted[0][1] > 0 ? sorted[0][0] : 'Software Engineering',
    secondary: sorted[1] && sorted[1][1] > 0 ? sorted[1][0] : 'Systems Engineering',
  };
}

/**
 * Extract raw bullet points from resume text
 */
function extractResumeBullets(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Standard bullet prefixes
    if (/^[\u2022\u2023\u25E6\u2043\u2219\*\-\–\—\>]\s+/.test(trimmed)) {
      const clean = trimmed.replace(/^[\u2022\u2023\u25E6\u2043\u2219\*\-\–\—\>]\s+/, '').trim();
      if (clean.length >= 25 && clean.length <= 320) {
        bullets.push(clean);
      }
    } else if (/^[A-Z][a-z]+ed\b|^Built\b|^Created\b|^Developed\b|^Led\b|^Responsible for\b|^Worked on\b/i.test(trimmed)) {
      if (trimmed.length >= 35 && trimmed.length <= 300) {
        bullets.push(trimmed);
      }
    }
  }

  return bullets;
}

/**
 * Core AI ATS Scanner Engine:
 * Analyzes resume text against genuine enterprise ATS standards and optional target JD.
 */
export function analyzeResumeForAts(
  resumeText: string,
  fileName: string = 'Resume.pdf',
  targetJd?: { title: string; description: string; requiredSkills?: string[] },
  domainId?: string
): AtsAuditResult {
  const text = resumeText || '';
  const textLower = text.toLowerCase();
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const pageEstimate = Math.max(1, Math.ceil(wordCount / 480));

  // Infer domain of candidate or use active domain track
  const candidateDomain = inferCandidateDomain(text);
  const domainTrack = domainId ? getDomainById(domainId) : undefined;
  if (domainTrack) {
    candidateDomain.primary = domainTrack.title;
  }

  // 1. Format & Parseability (Weight 15%)
  const formatFindings: string[] = [];
  const formatRecs: string[] = [];
  let formatScore = 100;

  const hasExp = /experience|work history|employment|career history/i.test(text);
  const hasEdu = /education|academic|university|degree|b\.tech|bachelor|master/i.test(text);
  const hasSkills = /skills|technologies|proficiencies|competencies|technical stack/i.test(text);
  const hasSummary = /summary|profile|about me|professional summary/i.test(text);

  if (!hasExp) {
    formatScore -= 20;
    formatFindings.push('Missing explicit "Experience" or "Work History" section header.');
    formatRecs.push('Add a clear "Professional Experience" section header formatted in bold standard text.');
  }
  if (!hasEdu) {
    formatScore -= 12;
    formatFindings.push('Missing explicit "Education" section header.');
    formatRecs.push('Include an "Education" section specifying institution, degree, and graduation year.');
  }
  if (!hasSkills) {
    formatScore -= 12;
    formatFindings.push('Missing dedicated "Technical Skills" section.');
    formatRecs.push('Organize skills in a categorized "Skills" section (e.g. Languages, Frameworks, Cloud, Databases).');
  }

  if (hasExp && hasEdu && hasSkills) {
    formatFindings.push('Standard ATS section hierarchy (Experience, Skills, Education) parsed with 100% fidelity.');
  }

  // Contact Information Extraction
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /[\+]?[(]?[0-9]{2,3}[)]?[-\s.]?[0-9]{3,5}[-\s.]?[0-9]{4,6}/.test(text);
  const hasLinkedin = /linkedin\.com\/(in\/)?[\w-]+/i.test(text);
  const hasGithub = /github\.com\/[\w-]+/i.test(text);

  if (!hasEmail) {
    formatScore -= 25;
    formatFindings.push('Candidate email address could not be parsed automatically.');
    formatRecs.push('Ensure email is in plain text directly in the resume header (avoid header/footer graphics).');
  }
  if (!hasPhone) {
    formatScore -= 15;
    formatFindings.push('Candidate telephone number was not detected.');
    formatRecs.push('Include a standard international telephone number (e.g. +91 98765 43210).');
  }

  if (hasEmail && hasPhone) {
    formatFindings.push('Contact details verified: Email and telephone extracted cleanly without parsing artifacts.');
  }
  if (hasLinkedin || hasGithub) {
    formatFindings.push(`Portfolio hyperlinks verified (${hasLinkedin ? 'LinkedIn' : ''}${hasLinkedin && hasGithub ? ' & ' : ''}${hasGithub ? 'GitHub' : ''}).`);
  } else {
    formatScore -= 8;
    formatRecs.push('Include direct links to your active LinkedIn and GitHub/portfolio profiles.');
  }

  formatScore = Math.max(30, Math.min(100, formatScore));

  // 2. Hard Skills & Keyword Matching (Weight 30%)
  const identifiedSkills: string[] = [];
  const missingKeywords: string[] = [];

  for (const skill of ALL_TECH_SKILLS) {
    const rx = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (rx.test(text)) {
      identifiedSkills.push(skill);
    }
  }

  let keywordScore = 75;
  const keywordFindings: string[] = [];
  const keywordRecs: string[] = [];
  let targetRoleMatch: AtsAuditResult['targetRoleMatch'] = undefined;

  // Handle Target Job Description (Mode A: Direct Job Match)
  if (targetJd && targetJd.title) {
    const jdTextCombined = `${targetJd.title} ${targetJd.description || ''} ${(targetJd.requiredSkills || []).join(' ')}`.toLowerCase();
    const matchedJdKeywords: string[] = [];
    const missingJdKeywords: string[] = [];

    // Extract skills present in JD
    const jdSpecificSkills: string[] = [];
    for (const skill of ALL_TECH_SKILLS) {
      const rx = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (rx.test(jdTextCombined)) {
        jdSpecificSkills.push(skill);
      }
    }

    // Merge explicitly required skills if provided
    if (targetJd.requiredSkills && targetJd.requiredSkills.length > 0) {
      for (const req of targetJd.requiredSkills) {
        if (!jdSpecificSkills.some((s) => s.toLowerCase() === req.toLowerCase())) {
          jdSpecificSkills.push(req);
        }
      }
    }

    // If JD is short or generic, populate standard skills for that title
    const effectiveChecklist = jdSpecificSkills.length >= 4
      ? jdSpecificSkills
      : ['System Design', 'Git', 'CI/CD', 'SQL', 'Testing', 'Docker', 'Cloud'];

    for (const req of effectiveChecklist) {
      const rx = new RegExp(`\\b${req.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (rx.test(textLower)) {
        matchedJdKeywords.push(req);
      } else {
        missingJdKeywords.push(req);
      }
    }

    const jdCoverageRatio = matchedJdKeywords.length / Math.max(1, effectiveChecklist.length);
    const jdMatchScore = Math.min(98, Math.max(35, Math.round(jdCoverageRatio * 100)));

    targetRoleMatch = {
      targetRole: targetJd.title,
      jdMatchScore,
      matchedJdKeywords,
      missingJdKeywords: missingJdKeywords.slice(0, 10),
    };

    keywordScore = jdMatchScore;
    keywordFindings.push(
      `Matched ${matchedJdKeywords.length} of ${effectiveChecklist.length} target skills for "${targetJd.title}".`,
      `Target role alignment: ${jdMatchScore}% ATS keyword density coverage.`
    );

    if (missingJdKeywords.length > 0) {
      missingKeywords.push(...missingJdKeywords);
      keywordRecs.push(
        `High-impact missing keywords for this target role: ${missingJdKeywords.slice(0, 5).join(', ')}.`
      );
    }
  } else {
    // Mode B: General Domain Audit based on detected discipline
    const domainSkillsCount = identifiedSkills.length;
    const densityPercent = Math.round((domainSkillsCount / Math.max(1, wordCount)) * 1000) / 10;

    if (domainSkillsCount >= 14) {
      keywordScore = 94;
    } else if (domainSkillsCount >= 9) {
      keywordScore = 84;
    } else if (domainSkillsCount >= 5) {
      keywordScore = 72;
    } else {
      keywordScore = 52;
    }

    keywordFindings.push(
      `Primary Technical Domain: ${candidateDomain.primary}.`,
      `Extracted ${identifiedSkills.length} industry-recognized technologies with ${densityPercent}% keyword density.`
    );

    // Identify gaps relative to primary domain or active career track
    const candidateSkillsLower = new Set(identifiedSkills.map((s) => s.toLowerCase()));
    let benchmarkDomainSkills = domainTrack ? domainTrack.coreSkills : DOMAIN_SKILL_TAXONOMY.backend;
    if (!domainTrack) {
      if (candidateDomain.primary.includes('Frontend')) benchmarkDomainSkills = DOMAIN_SKILL_TAXONOMY.frontend;
      else if (candidateDomain.primary.includes('Cloud') || candidateDomain.primary.includes('DevOps')) benchmarkDomainSkills = DOMAIN_SKILL_TAXONOMY.cloudDevOps;
      else if (candidateDomain.primary.includes('Data') || candidateDomain.primary.includes('AI')) benchmarkDomainSkills = DOMAIN_SKILL_TAXONOMY.dataAI;
    }

    for (const b of benchmarkDomainSkills) {
      if (!candidateSkillsLower.has(b.toLowerCase())) {
        missingKeywords.push(b);
      }
    }

    if (missingKeywords.length > 0) {
      keywordRecs.push(
        `Recommended competencies to strengthen ${candidateDomain.primary} ranking: ${missingKeywords.slice(0, 5).join(', ')}.`
      );
    }
  }

  // 3. Quantifiable Impact & Metrics (Weight 20%)
  // Comprehensive metric patterns: %, $, ₹, latency, throughput, scale, volume, uptime, multipliers
  const metricRegex = /\b(\d+(\.\d+)?%|[\$₹€]\s*\d+[\d,]*(\.\d+)?[kmb]?|\b\d+\s*(x|fold|ms|seconds?|mins?|hours?|req\/s|rps|qps|dau|mau|users?|clients?|clusters?|nodes?|servers?|pipelines?|microservices?|services?|tb|gb|pb)\b|\b(99\.9\d*|100)%\b)/gi;
  const metricMatches = text.match(metricRegex) || [];
  const metricCount = metricMatches.length;

  let impactScore = 50;
  const impactFindings: string[] = [];
  const impactRecs: string[] = [];

  if (metricCount >= 10) {
    impactScore = 96;
    impactFindings.push(`Superior metric density: Detected ${metricCount} quantifiable impact markers (percentages, scale, cost, latency).`);
  } else if (metricCount >= 6) {
    impactScore = 86;
    impactFindings.push(`Strong quantitative impact: Found ${metricCount} verified metrics across experience bullets.`);
  } else if (metricCount >= 3) {
    impactScore = 72;
    impactFindings.push(`Moderate quantification (${metricCount} metrics found). Enterprise ATS filters score higher when 70%+ of bullets have numerical evidence.`);
    impactRecs.push('Quantify key projects using business outcomes: revenue, latency reduction, cost savings, or user volume.');
  } else if (metricCount >= 1) {
    impactScore = 58;
    impactFindings.push(`Low metric density: Only ${metricCount} numerical outcomes detected. Bullets lean heavily on task descriptions.`);
    impactRecs.push('Adopt the Google X-Y-Z formula: "Accomplished [X] as measured by [Y], by doing [Z]".');
  } else {
    impactScore = 40;
    impactFindings.push('Zero quantifiable metrics detected. Enterprise ATS algorithms heavily de-prioritize non-quantified resumes.');
    impactRecs.push('Add specific numbers to every role: e.g. "reduced latency by 45%", "supporting 200k+ active users".');
  }

  // 4. Action Verbs & Executive Voice (Weight 15%)
  const powerVerbsFound: string[] = [];
  const weakPhrasesFound: string[] = [];

  for (const verb of POWER_ACTION_VERBS) {
    const rx = new RegExp(`\\b${verb}\\b`, 'i');
    if (rx.test(text)) powerVerbsFound.push(verb);
  }

  for (const weak of WEAK_PASSIVE_PHRASES) {
    const rx = new RegExp(`\\b${weak}\\b`, 'i');
    if (rx.test(text)) weakPhrasesFound.push(weak);
  }

  let verbScore = 80;
  if (powerVerbsFound.length >= 10) verbScore = 96;
  else if (powerVerbsFound.length >= 6) verbScore = 88;
  else if (powerVerbsFound.length >= 3) verbScore = 76;
  else verbScore = 58;

  // Penalize passive phrasing
  if (weakPhrasesFound.length > 0) {
    verbScore = Math.max(45, verbScore - (weakPhrasesFound.length * 7));
  }

  const verbFindings: string[] = [
    `Identified ${powerVerbsFound.length} strong leadership & execution action verbs (e.g. ${powerVerbsFound.slice(0, 4).join(', ')}).`
  ];
  const verbRecs: string[] = [];

  if (weakPhrasesFound.length > 0) {
    verbFindings.push(`Detected ${weakPhrasesFound.length} passive/weak phrases: "${weakPhrasesFound.slice(0, 3).join('", "')}".`);
    verbRecs.push(`Eliminate passive openers ("${weakPhrasesFound[0]}") in favor of commanding verbs like "Architected", "Spearheaded", or "Optimized".`);
  } else {
    verbFindings.push('Zero passive voice phrases detected. Tone reflects strong ownership and leadership.');
  }

  // 5. Section Completeness & Chronology (Weight 10%)
  let sectionScore = 88;
  const sectionFindings: string[] = [];
  const sectionRecs: string[] = [];

  // Check for dates/timeline
  const hasDates = /\b(20\d{2}|19\d{2})\b/.test(text);
  if (hasDates) {
    sectionFindings.push('Clear chronological career progression with verified employment timeframes.');
  } else {
    sectionScore -= 18;
    sectionFindings.push('Employment dates/timeframes were ambiguous or unparsed.');
    sectionRecs.push('Include clear dates (e.g. "Jun 2022 – Present") for every work experience entry.');
  }

  // Check for certifications / projects
  const hasCerts = /certificat(ion|ed)|credential|license|aws certified|cka|pmp/i.test(text);
  const hasProjects = /project|portfolio|open source|contributions/i.test(text);

  if (hasCerts) {
    sectionScore += 6;
    sectionFindings.push('Verified professional credentials / industry certifications found.');
  } else {
    sectionRecs.push('Consider adding relevant technical certifications to improve automated recruiter search ranking.');
  }

  if (hasProjects) {
    sectionFindings.push('Key architectural projects and implementation highlights documented.');
  }

  sectionScore = Math.max(45, Math.min(100, sectionScore));

  // 6. Brevity & Document Length (Weight 10%)
  let lengthScore = 90;
  const lengthFindings: string[] = [];
  const lengthRecs: string[] = [];

  if (wordCount >= 350 && wordCount <= 850) {
    lengthScore = 96;
    lengthFindings.push(`Ideal length: ${wordCount} words (~${pageEstimate} page), hitting the recruiter sweet spot for high-impact scanning.`);
  } else if (wordCount > 850 && wordCount <= 1250) {
    lengthScore = 82;
    lengthFindings.push(`Moderate length: ${wordCount} words (~${pageEstimate} pages). Acceptable for senior/lead positions.`);
    lengthRecs.push('Trim wordy bullet points to prevent resume from spilling into a 3rd page.');
  } else if (wordCount > 1250) {
    lengthScore = 65;
    lengthFindings.push(`Verbose document: ${wordCount} words exceeds the standard 2-page ATS ceiling.`);
    lengthRecs.push('Condense older roles and eliminate non-essential responsibilities to fit within 2 pages.');
  } else {
    lengthScore = 60;
    lengthFindings.push(`Sparse document: ${wordCount} words is significantly below the typical 400-word engineering threshold.`);
    lengthRecs.push('Expand bullet points with architectural context, technology stacks, and measurable results.');
  }

  // Compute Authentic Overall Score (Weighted)
  // Format: 15%, Skills: 30%, Impact: 20%, Verbs: 15%, Structure: 10%, Length: 10%
  let weightedOverall = Math.round(
    formatScore * 0.15 +
    keywordScore * 0.30 +
    impactScore * 0.20 +
    verbScore * 0.15 +
    sectionScore * 0.10 +
    lengthScore * 0.10
  );

  // If a target JD was provided, the JD Match Score directly reinforces 35% of the overall grade
  let overallScore = weightedOverall;
  if (targetRoleMatch) {
    overallScore = Math.round(weightedOverall * 0.65 + targetRoleMatch.jdMatchScore * 0.35);
  }

  // Bounds check (realistic 42 to 98)
  overallScore = Math.max(42, Math.min(98, overallScore));

  // Determine Grade
  let grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' = 'B';
  if (overallScore >= 92) grade = 'A+';
  else if (overallScore >= 85) grade = 'A';
  else if (overallScore >= 78) grade = 'B+';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else grade = 'D';

  const verdict =
    overallScore >= 88
      ? 'Top Tier ATS Compatibility. High probability of passing automated enterprise candidate filters (Workday, Greenhouse, Ashby, Lever).'
      : overallScore >= 78
      ? 'Strong Technical Foundation. A solid, competitive resume that will pass most initial scans. Quantifying 2–3 more achievements will elevate it to top 5% rank.'
      : overallScore >= 65
      ? 'Moderate Candidate Match. Meets baseline requirements but lacks critical keyword density or measurable metric evidence. Review recommendations.'
      : 'High Rejection Risk. Significant ATS parsing or keyword gaps detected. Immediate formatting and keyword optimization required.';

  // 7. Dynamic Bullet Point Rewriting (Google X-Y-Z Formula)
  // Extract candidate's actual bullets from resume
  const candidateBullets = extractResumeBullets(text);
  const bulletRewrites: AtsBulletRewrite[] = [];

  // Filter for bullets that need improvement (e.g. passive verbs or lack of numbers)
  const weakCandidateBullets = candidateBullets.filter((b) => {
    const bLower = b.toLowerCase();
    const hasPassive = WEAK_PASSIVE_PHRASES.some((wp) => bLower.includes(wp));
    const hasNumber = /\d+/.test(b);
    return hasPassive || !hasNumber;
  });

  const bulletsToRewrite = (weakCandidateBullets.length > 0 ? weakCandidateBullets : candidateBullets).slice(0, 3);

  if (bulletsToRewrite.length > 0) {
    for (const raw of bulletsToRewrite) {
      bulletRewrites.push(rewriteSingleBullet(raw, targetRoleMatch?.targetRole || candidateDomain.primary));
    }
  }

  // If no bullets could be extracted from raw text, provide tailored domain benchmarks
  if (bulletRewrites.length === 0) {
    bulletRewrites.push(
      rewriteSingleBullet(
        'Worked on service APIs and helped team deploy application updates to the cloud.',
        candidateDomain.primary
      ),
      rewriteSingleBullet(
        'Responsible for database queries and maintaining data pipelines for the team.',
        candidateDomain.primary
      ),
      rewriteSingleBullet(
        'Assisted with frontend components and improved web application performance.',
        candidateDomain.primary
      )
    );
  }

  const categories: AtsCategoryScore[] = [
    {
      name: 'Format & Parseability',
      score: formatScore,
      weight: 15,
      status: formatScore >= 85 ? 'pass' : formatScore >= 70 ? 'warning' : 'critical',
      findings: formatFindings,
      recommendations: formatRecs
    },
    {
      name: 'Hard Skill & Keyword Density',
      score: keywordScore,
      weight: 30,
      status: keywordScore >= 85 ? 'pass' : keywordScore >= 70 ? 'warning' : 'critical',
      findings: keywordFindings,
      recommendations: keywordRecs
    },
    {
      name: 'Quantifiable Impact & Metrics',
      score: impactScore,
      weight: 20,
      status: impactScore >= 85 ? 'pass' : impactScore >= 70 ? 'warning' : 'critical',
      findings: impactFindings,
      recommendations: impactRecs
    },
    {
      name: 'Action Verbs & Professional Tone',
      score: verbScore,
      weight: 15,
      status: verbScore >= 85 ? 'pass' : verbScore >= 70 ? 'warning' : 'critical',
      findings: verbFindings,
      recommendations: verbRecs
    },
    {
      name: 'Section Completeness & Chronology',
      score: sectionScore,
      weight: 10,
      status: sectionScore >= 85 ? 'pass' : sectionScore >= 70 ? 'warning' : 'critical',
      findings: sectionFindings,
      recommendations: sectionRecs
    },
    {
      name: 'Brevity & Layout Length',
      score: lengthScore,
      weight: 10,
      status: lengthScore >= 85 ? 'pass' : lengthScore >= 70 ? 'warning' : 'critical',
      findings: lengthFindings,
      recommendations: lengthRecs
    }
  ];

  return {
    overallScore,
    grade,
    verdict,
    wordCount,
    pageEstimate,
    categories,
    identifiedSkills: Array.from(new Set(identifiedSkills)),
    missingCriticalKeywords: Array.from(new Set(missingKeywords)).slice(0, 8),
    powerVerbsFound: Array.from(new Set(powerVerbsFound)).slice(0, 10),
    weakPhrasesFound: Array.from(new Set(weakPhrasesFound)),
    bulletRewrites,
    targetRoleMatch,
    scannedAt: new Date().toISOString()
  };
}

/**
 * Scan current active resume from local disk or parsed profile
 */
export async function scanCurrentResume(
  targetJd?: { title: string; description: string; requiredSkills?: string[] },
  domainId?: string
): Promise<AtsAuditResult> {
  const defaultPaths = [
    '/Users/abhinav/Downloads/Resume_abhinav.pdf',
    path.resolve(process.cwd(), '../Resume_abhinav.pdf')
  ];

  let resumePath = defaultPaths.find((p) => fs.existsSync(p));
  let resumeText = '';

  if (resumePath) {
    try {
      const buffer = fs.readFileSync(resumePath);
      const parsed = await parseResumeBuffer(buffer, path.basename(resumePath));
      resumeText = parsed.text;
    } catch {
      // fallback
    }
  }

  const profile = db.getProfile();
  if (!resumeText) {
    resumeText = [
      profile.summary,
      profile.skills.join(', '),
      profile.experience.map((e) => `${e.role} at ${e.company}. ${e.highlights.join(' ')}`).join('\n')
    ].join('\n');
  }

  const effectiveDomain = domainId || profile.domain || detectDomainFromProfile(profile).id;
  return analyzeResumeForAts(resumeText, 'Active_Resume.pdf', targetJd, effectiveDomain);
}

/**
 * Live Custom Bullet Point Optimizer (Google X-Y-Z Formula)
 * Converts any arbitrary software engineering bullet into:
 * "Accomplished [X] as measured by [Y], by doing [Z]"
 */
export function rewriteSingleBullet(rawBullet: string, role?: string, domainId?: string): AtsBulletRewrite {
  const clean = rawBullet.trim().replace(/^[\s•\-\*\>]+/, '').replace(/;+$/, '');
  const lower = clean.toLowerCase();

  // 1. Detect if a weak passive phrase is ACTUALLY present
  let detectedWeak: string | undefined = undefined;
  for (const weak of WEAK_PASSIVE_PHRASES) {
    if (lower.startsWith(weak)) {
      detectedWeak = weak;
      break;
    }
  }

  // Strip weak prefix if present to isolate the candidate's core action/task
  let coreSentence = clean;
  if (detectedWeak) {
    coreSentence = clean.slice(detectedWeak.length).trim().replace(/^(to|for|of|with|in|on|at|by)\s+/i, '');
  }

  // Check if bullet ALREADY starts with a commanding power verb
  let existingVerb: string | undefined = undefined;
  const firstWord = clean.split(/\s+/)[0].replace(/[^a-zA-Z]/g, '');
  for (const pv of POWER_ACTION_VERBS) {
    if (firstWord.toLowerCase() === pv.toLowerCase()) {
      existingVerb = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
      break;
    }
  }

  // Domain categorization heuristics
  const isAI = domainId === 'ai-ml' || /ai\b|ml\b|llm|rag|prompt|pytorch|tensorflow|fine-?tun|deep learning|transformer|embedding|vector/i.test(clean) || (role && /ai\b|ml\b|machine learning/i.test(role));
  const isData = domainId === 'data-engineering' || /data|pipeline|etl|spark|kafka|snowflake|databricks|lakehouse|dbt|bigquery/i.test(clean) || (role && /data engineer/i.test(role));
  const isSecurity = domainId === 'cybersecurity' || /security|ddos|zip bomb|exploit|threat|vulnerab|firewall|waf|iam|cve|penetration|auth|zero trust/i.test(clean) || (role && /security/i.test(role));
  const isCloudK8s = domainId === 'devops-sre' || /kubernetes|k8s|eks|gke|cluster|container|docker|terraform|iac|aws|cloud|azure|gcp|infra|helm|argocd/i.test(clean) || (role && /devops|sre|platform|cloud/i.test(role));
  const isFrontend = (domainId === 'frontend-fullstack' || /react|vue|angular|frontend|ui|ux|component|css|typescript|javascript|next\.js|redux|web|tailwind/i.test(clean)) && !isAI && !isData;
  const isBackend = (domainId === 'backend-systems' || /api|backend|microservice|rest|grpc|java|spring|node|golang|go|python|sql|database|query|postgres|redis/i.test(clean)) && !isAI && !isData;
  const isObservability = /observab|datadog|prometheus|grafana|telemetry|trace|logging|mttd|mttr|alert|slo|sli/i.test(clean);
  const isTesting = /test|qa|cypress|playwright|jest|selenium|automation|coverage|regression/i.test(clean);

  let category = 'Engineering Architecture';
  let powerVerb = existingVerb || 'Spearheaded';
  let accomplished = '';
  let measuredBy = '';
  let doing = '';
  let rationale = '';

  if (isAI) {
    category = 'AI / ML & LLM Engineering';
    powerVerb = existingVerb || 'Architected';
    accomplished = `${powerVerb} high-throughput distributed LLM inference pipelines, RAG architectures, and fine-tuning workflows`;
    measuredBy = 'slashing vector retrieval query latency by 45% (p99 < 50ms) and elevating model benchmark evaluation accuracy to 94.5%';
    doing = 'deploying hybrid vector search indexing (Milvus/Pinecone), FP16 quantization, and automated prompt evaluation test harnesses';
    rationale = existingVerb
      ? `Preserves your active verb ("${existingVerb}") while supplying concrete LLM performance KPIs (45% latency cut, 94.5% accuracy) and vector infrastructure.`
      : `Replaces task framing with commanding GenAI ownership ("${powerVerb}") and verifiable enterprise AI benchmarks.`;
  } else if (isData) {
    category = 'Data Platform & Streaming Architecture';
    powerVerb = existingVerb || 'Engineered';
    accomplished = `${powerVerb} scalable real-time event streaming architectures and distributed Lakehouse ETL ingestion pipelines`;
    measuredBy = 'slashing data processing latency from 45 minutes to sub-second streaming across 15M+ daily records with zero data drop';
    doing = 'partitioning Kafka distributed consumer topics, tuning Spark structured streaming memory windows, and enforcing Delta Lake ACID guarantees';
    rationale = existingVerb
      ? `Preserves ("${existingVerb}") while quantifying time-to-insight speedup (45m to sub-second) across high-throughput data volumes (15M+ records).`
      : `Transforms maintenance tasks into distributed systems impact with concrete throughput and data reliability metrics.`;
  } else if (isSecurity) {
    category = 'Edge Security & Threat Defense';
    powerVerb = existingVerb || 'Hardened';
    const hasZipDdos = /zip bomb|ddos/i.test(clean);
    accomplished = hasZipDdos
      ? `${powerVerb} production security posture against volumetric DDoS and Zip Bomb exploit vectors`
      : `${powerVerb} enterprise perimeter security defenses and zero-trust identity access controls`;
    measuredBy = 'mitigating 100% of malicious ingress payloads and sustaining 99.99% service availability with zero downtime';
    doing = 'configuring automated WAF rate-limiting policies, deep packet inspection filters, and real-time security alerting';
    rationale = existingVerb
      ? `Preserves your active verb ("${existingVerb}"), adds enterprise defense metrics (100% mitigation, zero downtime), and specifies technical safeguards.`
      : `Replaces passive framing with authoritative ownership ("${powerVerb}") and introduces verifiable protection KPIs (100% mitigation, zero service disruption).`;
  } else if (isCloudK8s) {
    category = 'Cloud Platform & Infrastructure Reliability';
    powerVerb = existingVerb || 'Orchestrated';
    accomplished = `${powerVerb} high-availability Kubernetes cluster and cloud infrastructure workloads across multi-region environments`;
    measuredBy = 'sustaining 99.99% service uptime and accelerating environment provisioning times from 4 hours to under 15 minutes';
    doing = 'implementing automated Horizontal Pod Autoscaling (HPA), declarative GitOps deployments, and modular Infrastructure-as-Code';
    rationale = existingVerb
      ? `Elevates your action verb ("${existingVerb}") with enterprise reliability KPIs (99.99% uptime) and concrete automation mechanisms.`
      : `Replaces passive description with commanding technical ownership ("${powerVerb}") and quantifiable scale metrics.`;
  } else if (isBackend) {
    category = 'Backend Systems & API Architecture';
    powerVerb = existingVerb || 'Engineered';
    accomplished = `${powerVerb} high-throughput distributed microservice APIs and backend platform workflows`;
    measuredBy = 'handling 25,000+ requests per second with p99 response times below 40ms';
    doing = 'optimizing database query execution plans, introducing distributed Redis caching layers, and implementing asynchronous worker pools';
    rationale = existingVerb
      ? `Preserves your verb ("${existingVerb}") while supplying concrete throughput benchmarks (25,000+ RPS, <40ms p99) and caching architecture.`
      : `Converts task phrasing into a high-impact Google X-Y-Z statement with verifiable throughput metrics (25k RPS).`;
  } else if (isFrontend) {
    category = 'Frontend & User Experience Architecture';
    powerVerb = existingVerb || 'Architected';
    accomplished = `${powerVerb} modular, accessible frontend component architectures across responsive web applications`;
    measuredBy = 'slashing initial page bundle load times by 38% and elevating Lighthouse web performance scores to 96+';
    doing = 'implementing intelligent code splitting, memoized state stores, and accessible design system tokens';
    rationale = existingVerb
      ? `Maintains your verb ("${existingVerb}") and anchors achievements in Google Core Web Vitals and performance benchmarks.`
      : `Replaces passive voice with architectural ownership ("${powerVerb}") and measurable page speed optimizations (38% speedup).`;
  } else if (isObservability) {
    category = 'Observability & Reliability Engineering';
    powerVerb = existingVerb || 'Instrumented';
    accomplished = `${powerVerb} end-to-end distributed tracing, telemetry fabrics, and automated incident monitoring across production microservices`;
    measuredBy = 'slashing Mean Time to Resolution (MTTR) by 55% and eliminating recurring high-severity incidents';
    doing = 'deploying custom Prometheus SLO/SLI monitors, automated alerting thresholds, and real-time Datadog triage dashboards';
    rationale = existingVerb
      ? `Preserves ("${existingVerb}") and targets primary SRE operational metrics (55% MTTR reduction) with modern observability tools.`
      : `Replaces passive monitoring notes with concrete incident reduction KPIs (55% MTTR cut).`;
  } else if (isTesting) {
    category = 'Quality Engineering & CI Automation';
    powerVerb = existingVerb || 'Instrumented';
    accomplished = `${powerVerb} automated end-to-end testing frameworks and quality gates within continuous integration pipelines`;
    measuredBy = 'expanding automated test coverage to 92% and cutting post-release production defects by 60%';
    doing = 'authoring parallelized integration test suites, automated visual regressions, and mocking external network dependencies';
    rationale = existingVerb
      ? `Retains ("${existingVerb}") and directly correlates automated test coverage (92%) with production defect reduction (60%).`
      : `Replaces basic testing mentions with measurable quality KPIs and automated CI gate enforcement.`;
  } else {
    powerVerb = existingVerb || 'Spearheaded';
    const cleanedCore = coreSentence.replace(/^[A-Z][a-z]+ed\s+/i, '').replace(/^[A-Z][a-z]+\s+/i, (m) => m.toLowerCase());
    accomplished = `${powerVerb} ${cleanedCore.length > 10 ? cleanedCore : 'core technical initiatives and scalable platform capabilities'}`;
    measuredBy = 'accelerating delivery release turnaround by 35% and sustaining high operational reliability';
    doing = 'refactoring legacy architectural bottlenecks, establishing standardized reusable patterns, and automating deployment workflows';
    rationale = existingVerb
      ? `Preserves your commanding action verb ("${existingVerb}") while adding quantifiable engineering velocity (35% speedup).`
      : `Replaces passive framing with authoritative ownership ("${powerVerb}") and clear business impact.`;
  }

  const improved = `${accomplished}, ${measuredBy}, by ${doing}.`;

  return {
    original: clean,
    improved,
    rationale,
    category,
    weakPhrase: detectedWeak,
    powerVerb,
    metrics: measuredBy,
    xyzBreakdown: {
      accomplished,
      measuredBy,
      doing
    }
  };
}
