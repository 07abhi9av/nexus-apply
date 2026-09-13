export interface CompetencyVectors {
  distributedSystems: number; // 0-100
  fintechProtocols: number;
  cloudK8s: number;
  reliabilityObservability: number;
  securityDDoS: number;
  aiAutomation: number;
}

export interface CandidateProfile {
  name: string;
  title: string;
  currentCompany: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  domain?: string;
  seniority?: string;
  experience: {
    role: string;
    company: string;
    period: string;
    highlights: string[];
  }[];
  projects?: {
    name: string;
    techStack: string;
    highlights: string[];
  }[];
  education?: {
    institution: string;
    degree: string;
    cgpa: string;
    period: string;
    location: string;
  }[];
  certifications?: {
    name: string;
    date: string;
  }[];
  competencyVectors: CompetencyVectors;
  preferences: {
    targetRoles: string[];
    targetCompanies: string[];
    locations: string[];
    minMatchScore: number;
    autoPilotEnabled: boolean;
  };
}

export type JobStatus =
  | 'discovered'
  | 'matched'
  | 'in_review'
  | 'applied'
  | 'interviewing'
  | 'offer'
  | 'rejected';

export interface MatchBreakdown {
  overall: number;
  skillsMatch: number;
  experienceMatch: number;
  domainMatch: number;
  strengths: string[];
  gaps: string[];
  lsegAdvantage: string;
}

export interface LiveJobOpening {
  id: string;
  title: string;
  location: string;
  type?: 'Remote' | 'Hybrid' | 'On-site';
  compensation?: string;
  url: string;
  description?: string;
  department?: string;
  postedAt?: string;
  vectorScore?: number;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  domain?: string;
  ats: 'greenhouse' | 'lever' | 'ashby' | 'workday' | 'direct';
  category: 'Fintech' | 'Tier-1 Product';
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  compensation: string;
  url: string;
  description: string;
  requiredSkills: string[];
  vectorScore: number;
  matchBreakdown: MatchBreakdown;
  status: JobStatus;
  appliedAt?: string;
  hub?: string;
  subRegion?: string;
  sector?: string;
  isRemote?: boolean;
  workModel?: string;
  source?: string;
  liveJobs?: LiveJobOpening[];
  applicationPayload?: {
    tailoredPitch: string;
    customAnswers: Record<string, string>;
    resumePath: string;
  };
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type:
    | 'INGESTION'
    | 'VECTOR_MATCH'
    | 'FORM_MAPPING'
    | 'AUTOPILOT_DISPATCH'
    | 'APPLICATION_SUCCESS'
    | 'ERROR';
  company: string;
  jobTitle: string;
  message: string;
  meta?: any;
}
