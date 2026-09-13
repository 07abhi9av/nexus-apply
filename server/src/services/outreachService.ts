import { db } from './db.js';

export interface OutreachTemplateRequest {
  company: string;
  title: string;
  jobId?: string;
  tone?: 'professional' | 'startup' | 'punchy';
  recipientRole?: 'recruiter' | 'manager' | 'peer';
}

export interface OutreachMessageSet {
  company: string;
  title: string;
  searchLinks: {
    recruitersUrl: string;
    managersUrl: string;
    peersUrl: string;
  };
  linkedInNote: {
    text: string;
    charCount: number;
    maxChars: number;
  };
  referralEmail: {
    subject: string;
    body: string;
  };
  followUpNote: {
    subject: string;
    body: string;
  };
}

export function generateOutreachTemplates(params: OutreachTemplateRequest): OutreachMessageSet {
  const profile = db.getProfile();
  const company = params.company || 'the team';
  const roleTitle = params.title || 'Senior DevOps / SRE';
  const tone = params.tone || 'professional';
  const candidateName = profile.name || 'Abhinav Aryan';
  const currentCompany = profile.currentCompany || 'London Stock Exchange Group (LSEG)';
  const candidateTitle = profile.title || 'Senior DevOps / Infrastructure Engineer';
  const topSkills = (profile.skills && profile.skills.length > 0)
    ? profile.skills.slice(0, 3).join(', ')
    : 'Kubernetes, AWS & Terraform';

  // 1. Search URLs for LinkedIn
  const recruitersQuery = encodeURIComponent(`${company} technical recruiter India`);
  const managersQuery = encodeURIComponent(`${company} engineering manager SRE DevOps India`);
  const peersQuery = encodeURIComponent(`${company} senior SRE DevOps engineer India`);

  const searchLinks = {
    recruitersUrl: `https://www.linkedin.com/search/results/people/?keywords=${recruitersQuery}`,
    managersUrl: `https://www.linkedin.com/search/results/people/?keywords=${managersQuery}`,
    peersUrl: `https://www.linkedin.com/search/results/people/?keywords=${peersQuery}`,
  };

  // 2. LinkedIn Connection Note (Max 300 characters strictly)
  let linkedInNoteText = '';
  if (tone === 'punchy') {
    linkedInNoteText = `Hi! Saw ${company}'s ${roleTitle} opening. I'm ${candidateName}, ${candidateTitle} at ${currentCompany} specializing in ${topSkills}. Owned 99.95%+ uptime & zero-downtime EKS clusters. Would love to connect and chat about joining your engineering team!`;
  } else if (tone === 'startup') {
    linkedInNoteText = `Hi! Huge fan of what ${company} is building. I'm ${candidateName}, ${candidateTitle} at ${currentCompany}. I scale high-throughput infrastructure with ${topSkills} & automated CI/CD. Would love to connect regarding your ${roleTitle} opening!`;
  } else {
    // Professional
    linkedInNoteText = `Hi! I noticed ${company} is hiring for ${roleTitle}. I'm ${candidateName}, ${candidateTitle} at ${currentCompany} with deep expertise in ${topSkills} & high-availability systems. I would appreciate the opportunity to connect and discuss how I can contribute to ${company}.`;
  }

  // Ensure strict <= 300 chars limit
  if (linkedInNoteText.length > 300) {
    linkedInNoteText = linkedInNoteText.slice(0, 297) + '...';
  }

  // 3. Referral Email / InMail Template
  const emailSubject = `Referral Request / Application: ${candidateName} for ${roleTitle} at ${company}`;
  const emailBody = `Hi [Name],

I hope you are having a productive week.

I came across the ${roleTitle} opening at ${company} and was immediately drawn to the engineering challenges your team is solving. Given my background scaling mission-critical platforms at ${currentCompany}, I believe I can make an immediate impact on your infrastructure.

Here is a quick snapshot of what I bring:
• Architecture & Scale: Owned the full lifecycle of Amazon EKS production clusters with zero downtime, sustaining 99.95%+ availability.
• Cloud & IaC: Standardized Terraform IaC and GitOps pipelines, cutting developer deployment cycle time by 45%.
• Observability & Reliability: Instrumented distributed telemetry and automated SLO alerting across multi-region workloads.

Would you be open to a quick 5-minute chat, or willing to refer my profile internally for this role?

Resume: Attached
LinkedIn: ${profile.linkedin || 'https://linkedin.com/in/abhinav-aryan'}
GitHub: ${profile.github || 'https://github.com/abhinav-aryan'}

Thank you for your time and consideration!

Best regards,
${candidateName}
${profile.email || 'abhinav.aryan0802@gmail.com'}
${profile.phone || '+91 98765 43210'}`;

  // 4. Day 4/5 Post-Application Follow-up Note
  const followUpSubject = `Following Up: Application for ${roleTitle} - ${candidateName}`;
  const followUpBody = `Hi [Name / Hiring Team],

I hope you're doing well.

I submitted my application for the ${roleTitle} position at ${company} earlier this week through your direct career portal. 

Given my hands-on background in ${topSkills} and architecting high-reliability systems at ${currentCompany}, I remain very excited about this opportunity and the technical roadmap at ${company}.

I wanted to briefly check in regarding the status of the hiring timeline or if you need any additional portfolio artifacts, references, or code samples from my side.

Looking forward to hearing from you.

Warm regards,
${candidateName}
${profile.email || 'abhinav.aryan0802@gmail.com'}
${profile.linkedin || 'https://linkedin.com/in/abhinav-aryan'}`;

  return {
    company,
    title: roleTitle,
    searchLinks,
    linkedInNote: {
      text: linkedInNoteText,
      charCount: linkedInNoteText.length,
      maxChars: 300,
    },
    referralEmail: {
      subject: emailSubject,
      body: emailBody,
    },
    followUpNote: {
      subject: followUpSubject,
      body: followUpBody,
    },
  };
}
