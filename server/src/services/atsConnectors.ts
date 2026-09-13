import type { JobOpportunity } from '../types.js';
import { computeVectorMatch } from './vectorMatcher.js';
import { db } from './db.js';

interface ATSBoardConfig {
  company: string;
  ats: 'greenhouse' | 'ashby' | 'lever';
  slug: string;
  category: 'Fintech' | 'Tier-1 Product';
  logo: string;
  targetKeywords: string[];
}

const ATS_TARGETS: ATSBoardConfig[] = [
  {
    company: 'Stripe',
    ats: 'greenhouse',
    slug: 'stripe',
    category: 'Fintech',
    logo: '💳',
    targetKeywords: ['infrastructure', 'platform', 'reliability', 'sre', 'systems']
  },
  {
    company: 'Brex',
    ats: 'greenhouse',
    slug: 'brex',
    category: 'Fintech',
    logo: '💼',
    targetKeywords: ['infrastructure', 'platform', 'cloud', 'sre']
  },
  {
    company: 'Ramp',
    ats: 'ashby',
    slug: 'ramp',
    category: 'Fintech',
    logo: '⚡',
    targetKeywords: ['infrastructure', 'platform', 'reliability', 'backend']
  },
  {
    company: 'Figma',
    ats: 'greenhouse',
    slug: 'figma',
    category: 'Tier-1 Product',
    logo: '🎨',
    targetKeywords: ['infrastructure', 'systems', 'production', 'cloud']
  },
  {
    company: 'Databricks',
    ats: 'greenhouse',
    slug: 'databricks',
    category: 'Tier-1 Product',
    logo: '🧱',
    targetKeywords: ['cloud', 'infrastructure', 'platform', 'kubernetes']
  }
];

export async function fetchLiveAtsJobs(): Promise<JobOpportunity[]> {
  const profile = db.getProfile();
  const ingested: JobOpportunity[] = [];

  for (const target of ATS_TARGETS) {
    try {
      if (target.ats === 'greenhouse') {
        const url = `https://boards-api.greenhouse.io/v1/boards/${target.slug}/jobs?content=false`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = (await res.json()) as {
            jobs: Array<{
              id: number;
              title: string;
              absolute_url: string;
              location: { name: string };
            }>;
          };

          const matchedJobs = data.jobs.filter((j) =>
            target.targetKeywords.some((kw) => j.title.toLowerCase().includes(kw))
          );

          for (const rawJob of matchedJobs.slice(0, 3)) {
            const reqSkills = [
              'Kubernetes & EKS',
              'Cloud Infrastructure',
              'Linux Systems',
              'High Availability & Disaster Recovery',
              'Observability'
            ];
            const jdMock = `${rawJob.title} at ${target.company}. Scaling multi-region compute infrastructure, Amazon EKS clusters, and automated Terraform workflows. Location: ${rawJob.location?.name || 'Remote'}.`;
            const { score, breakdown } = computeVectorMatch(
              profile,
              rawJob.title,
              jdMock,
              reqSkills
            );

            ingested.push({
              id: `gh-${target.slug}-${rawJob.id}`,
              title: rawJob.title,
              company: target.company,
              companyLogo: target.logo,
              ats: 'greenhouse',
              category: target.category,
              location: rawJob.location?.name || 'Remote / Hybrid',
              type: rawJob.location?.name?.toLowerCase().includes('remote') ? 'Remote' : 'Hybrid',
              compensation: '$190k - $270k + Equity',
              url: rawJob.absolute_url,
              description: jdMock,
              requiredSkills: reqSkills,
              vectorScore: score,
              matchBreakdown: breakdown,
              status: score >= 88 ? 'matched' : 'discovered'
            });
          }
        }
      } else if (target.ats === 'ashby') {
        const url = `https://api.ashbyhq.com/posting-api/job-board/${target.slug}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const data = (await res.json()) as {
            jobs: Array<{
              id: string;
              title: string;
              jobUrl: string;
              location: string;
            }>;
          };

          const matchedJobs = data.jobs.filter((j) =>
            target.targetKeywords.some((kw) => j.title.toLowerCase().includes(kw))
          );

          for (const rawJob of matchedJobs.slice(0, 3)) {
            const reqSkills = [
              'AWS / Cloud Infra',
              'Terraform',
              'CI/CD Automation',
              'Datadog / Prometheus',
              'Python / Go'
            ];
            const jdMock = `${rawJob.title} at ${target.company}. Designing resilient cloud architectures, CI/CD pipelines, and high availability systems.`;
            const { score, breakdown } = computeVectorMatch(
              profile,
              rawJob.title,
              jdMock,
              reqSkills
            );

            ingested.push({
              id: `ashby-${target.slug}-${rawJob.id}`,
              title: rawJob.title,
              company: target.company,
              companyLogo: target.logo,
              ats: 'ashby',
              category: target.category,
              location: rawJob.location || 'Remote / Hybrid',
              type: 'Remote',
              compensation: '$195k - $260k + Equity',
              url: rawJob.jobUrl,
              description: jdMock,
              requiredSkills: reqSkills,
              vectorScore: score,
              matchBreakdown: breakdown,
              status: score >= 88 ? 'matched' : 'discovered'
            });
          }
        }
      }
    } catch {
      // Network timeout or blocked, gracefully continue to next target
    }
  }

  if (ingested.length > 0) {
    db.addJobs(ingested);
    db.addTelemetry({
      type: 'INGESTION',
      company: 'ATS Hub',
      jobTitle: `${ingested.length} Live Openings`,
      message: `Ingested ${ingested.length} live openings across Greenhouse and Ashby endpoints.`
    });
  }

  return db.getJobs();
}
