import { PDFParse } from 'pdf-parse';

export interface ParsedResume {
  text: string;
  skills: string[];
  categorizedSkills: Record<string, string[]>;
  experienceHighlights: string[];
  detectedTitle?: string;
  detectedCompany?: string;
  fileName: string;
  parsedAt: string;
}

const SKILL_TAXONOMY: { category: string; terms: { name: string; regex: RegExp }[] }[] = [
  {
    category: 'Cloud & Infrastructure',
    terms: [
      { name: 'AWS', regex: /\b(aws|amazon web services)\b/i },
      { name: 'Amazon EKS', regex: /\b(eks|amazon eks|elastic kubernetes)\b/i },
      { name: 'EC2', regex: /\b(ec2|elastic compute)\b/i },
      { name: 'Terraform', regex: /\b(terraform|iac|infrastructure as code)\b/i },
      { name: 'Ansible', regex: /\b(ansible)\b/i },
      { name: 'Route 53', regex: /\b(route 53|route53)\b/i },
      { name: 'IAM', regex: /\b(iam|identity and access management)\b/i },
      { name: 'VPC', regex: /\b(vpc|virtual private cloud)\b/i },
      { name: 'AWS S3', regex: /\b(s3|simple storage service)\b/i },
      { name: 'HashiCorp Vault', regex: /\b(vault|hashicorp vault)\b/i },
      { name: 'GCP / Google Cloud', regex: /\b(gcp|google cloud)\b/i },
      { name: 'Microsoft Azure', regex: /\b(azure|az-900)\b/i }
    ]
  },
  {
    category: 'Kubernetes & Containers',
    terms: [
      { name: 'Kubernetes', regex: /\b(kubernetes|k8s)\b/i },
      { name: 'Docker', regex: /\b(docker|containerization)\b/i },
      { name: 'Helm', regex: /\b(helm|helm chart)\b/i },
      { name: 'HPA / Autoscaling', regex: /\b(hpa|horizontal pod autoscaler|autoscaling)\b/i },
      { name: 'CKA (Certified Kubernetes Admin)', regex: /\b(cka|certified kubernetes administrator)\b/i },
      { name: 'Rolling Patches / Zero Downtime', regex: /\b(zero-downtime|rolling upgrades?|rolling patch)\b/i }
    ]
  },
  {
    category: 'Linux & Systems Internals',
    terms: [
      { name: 'Linux Systems Administration', regex: /\b(linux administration|linux systems?)\b/i },
      { name: 'systemd', regex: /\b(systemd)\b/i },
      { name: 'Kernel Diagnostics & CPU/Memory', regex: /\b(kernel|memory diagnostics|cpu diagnostics)\b/i },
      { name: 'Networking (TCP/IP, DNS, iptables)', regex: /\b(tcp\/ip|dns|iptables|networking)\b/i }
    ]
  },
  {
    category: 'High Availability & SRE',
    terms: [
      { name: 'Site Reliability Engineering (SRE)', regex: /\b(sre|site reliability)\b/i },
      { name: 'Multi-Region Traffic Failover', regex: /\b(failover|traffic failover|multi-region)\b/i },
      { name: 'Route 53 GSLB', regex: /\b(gslb|global server load balancing)\b/i },
      { name: 'High Availability (99.9%+)', regex: /\b(high availability|99\.9%|sla|uptime)\b/i },
      { name: 'Root Cause Analysis / On-Call', regex: /\b(root-cause|rca|post-mortems?|on-call)\b/i }
    ]
  },
  {
    category: 'CI/CD & GitOps',
    terms: [
      { name: 'Jenkins', regex: /\b(jenkins)\b/i },
      { name: 'GitHub Actions', regex: /\b(github actions)\b/i },
      { name: 'ArgoCD / GitOps', regex: /\b(argocd|argo cd|gitops)\b/i },
      { name: 'Spinnaker', regex: /\b(spinnaker)\b/i },
      { name: 'Git', regex: /\b(git|github|gitlab)\b/i },
      { name: 'Release Automation', regex: /\b(release automation|pipeline automation)\b/i }
    ]
  },
  {
    category: 'Observability & Monitoring',
    terms: [
      { name: 'Datadog', regex: /\b(datadog)\b/i },
      { name: 'Prometheus', regex: /\b(prometheus)\b/i },
      { name: 'Grafana', regex: /\b(grafana)\b/i },
      { name: 'Elasticsearch / ELK', regex: /\b(elasticsearch|elk|kibana)\b/i },
      { name: 'Splunk', regex: /\b(splunk)\b/i },
      { name: 'JMeter Load Testing', regex: /\b(jmeter|performance testing)\b/i }
    ]
  },
  {
    category: 'Security & Networking',
    terms: [
      { name: 'NGINX Reverse Proxy', regex: /\b(nginx|reverse proxy)\b/i },
      { name: 'DDoS Mitigation', regex: /\b(ddos|ddos mitigation|rate limiting)\b/i },
      { name: 'AWS WAF', regex: /\b(waf|web application firewall)\b/i },
      { name: 'SSL/TLS Termination', regex: /\b(ssl\/tls|tls|certificates)\b/i },
      { name: 'SonarQube Security & Code Quality', regex: /\b(sonarqube|code coverage)\b/i },
      { name: 'PCI / SOC2 Compliance', regex: /\b(pci|soc2|compliance)\b/i }
    ]
  },
  {
    category: 'Languages & Backend',
    terms: [
      { name: 'Python', regex: /\b(python)\b/i },
      { name: 'TypeScript', regex: /\b(typescript)\b/i },
      { name: 'JavaScript', regex: /\b(javascript|node\.js|nodejs)\b/i },
      { name: 'Bash / Shell Scripting', regex: /\b(bash|shell scripting|sh)\b/i },
      { name: 'Go / Golang', regex: /\b(go|golang)\b/i },
      { name: 'PostgreSQL', regex: /\b(postgresql|postgres)\b/i },
      { name: 'Snowflake', regex: /\b(snowflake)\b/i },
      { name: 'MongoDB', regex: /\b(mongodb|mongo)\b/i },
      { name: 'REST APIs', regex: /\b(rest|rest apis?|restful)\b/i }
    ]
  },
  {
    category: 'AI / LLM Engineering',
    terms: [
      { name: 'Claude API / Anthropic', regex: /\b(claude|anthropic)\b/i },
      { name: 'LLM Automation', regex: /\b(llm|large language model)\b/i },
      { name: 'Agentic Workflows', regex: /\b(agentic|agents|agentic workflows)\b/i },
      { name: 'GenAI & AI Incident Triage', regex: /\b(genai|ai incident|ai-driven)\b/i }
    ]
  },
  {
    category: 'Domain / FinTech',
    terms: [
      { name: 'London Stock Exchange Group (LSEG)', regex: /\b(lseg|london stock exchange)\b/i },
      { name: 'FinTech Systems & Trading Infrastructure', regex: /\b(fintech|financial services|trading platform)\b/i },
      { name: 'Distributed Financial Systems', regex: /\b(distributed systems|financial market infrastructure)\b/i }
    ]
  }
];

export async function parseResumeBuffer(
  buffer: Buffer,
  fileName: string = 'Resume.pdf'
): Promise<ParsedResume> {
  let text = '';

  const isPdf = fileName.toLowerCase().endsWith('.pdf') || buffer.slice(0, 5).toString() === '%PDF-';

  if (isPdf) {
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      text = textResult.text || '';
      await parser.destroy();
    } catch (e: any) {
      console.warn('PDFParse failed, falling back to raw buffer string extraction:', e.message);
      text = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
    }
  } else {
    text = buffer.toString('utf-8');
  }

  // Extract skills based on taxonomy
  const matchedSkills: string[] = [];
  const categorized: Record<string, string[]> = {};

  for (const group of SKILL_TAXONOMY) {
    const inCategory: string[] = [];
    for (const item of group.terms) {
      if (item.regex.test(text)) {
        inCategory.push(item.name);
        matchedSkills.push(item.name);
      }
    }
    if (inCategory.length > 0) {
      categorized[group.category] = inCategory;
    }
  }

  // Extract highlights/bullet points (lines starting with – or - or •)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const highlights: string[] = [];
  for (const line of lines) {
    if (/^[–\-•*]\s+/.test(line) && line.length > 30) {
      highlights.push(line.replace(/^[–\-•*]\s+/, '').trim());
    }
  }

  // Check detected current role / company
  let detectedTitle = 'Software Engineer – DevOps & Platform Engineering';
  let detectedCompany = 'London Stock Exchange Group (LSEG)';

  if (text.includes('London Stock Exchange Group') || text.includes('LSEG')) {
    detectedCompany = 'London Stock Exchange Group (LSEG)';
  }
  if (text.includes('Site Reliability') || text.includes('SRE')) {
    detectedTitle = 'DevOps / Site Reliability Engineer';
  }

  return {
    text,
    skills: Array.from(new Set(matchedSkills)),
    categorizedSkills: categorized,
    experienceHighlights: highlights.slice(0, 12),
    detectedTitle,
    detectedCompany,
    fileName,
    parsedAt: new Date().toISOString()
  };
}
