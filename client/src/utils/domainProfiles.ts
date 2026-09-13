export interface DomainTrack {
  id: string;
  title: string;
  shortTitle?: string;
  badge: string;
  icon: string;
  tagline: string;
  accentColor: string;
  accentGradient: string;
  defaultTitle: string;
  defaultSummary: string;
  coreSkills: string[];
  popularSkills: string[];
  targetRoles: string[];
  targetCompanies: string[];
  sampleCompanies: string[];
  roleTitleKeywords: string[];
  mismatchKeywords: string[];
  highFitSectors: string[];
  priorityCompanies: string[];
  competencyVectors: {
    distributedSystems: number;
    fintechProtocols: number;
    cloudK8s: number;
    reliabilityObservability: number;
    securityDDoS: number;
    aiAutomation: number;
    [key: string]: number;
  };
}

export const DOMAIN_TRACKS: DomainTrack[] = [
  {
    id: 'data-engineering',
    title: 'Data Engineering & Big Data',
    shortTitle: 'Data Engineering',
    badge: '📊 Data Platform',
    icon: '📊',
    tagline: 'Spark, Kafka, Lakehouse, Snowflake, Databricks, Distributed ETL & Analytics',
    accentColor: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    defaultTitle: 'Data Engineer / Big Data Platform Engineer',
    defaultSummary:
      'Data Engineer specializing in large-scale data pipelines, distributed stream processing with Apache Spark and Kafka, lakehouse architectures using Databricks and Snowflake, and automated ETL workflows with Airflow and dbt. Proficient in SQL, Python, distributed storage formats (Parquet, Delta Lake, Iceberg), and cloud data warehouses.',
    coreSkills: [
      'Apache Spark',
      'Python',
      'SQL',
      'Apache Kafka',
      'Snowflake',
      'Databricks',
      'Airflow',
      'dbt',
      'AWS Glue',
      'Data Warehousing',
      'Delta Lake',
      'PostgreSQL',
      'PySpark',
      'Presto / Trino',
      'BigQuery',
      'ClickHouse',
      'ETL / ELT Pipelines'
    ],
    popularSkills: [
      'Apache Spark',
      'Python',
      'SQL',
      'Kafka',
      'Snowflake',
      'Databricks',
      'Airflow',
      'dbt',
      'AWS Glue',
      'BigQuery',
      'Redshift',
      'ClickHouse',
      'Flink',
      'Hadoop',
      'Iceberg',
      'Delta Lake',
      'FastAPI',
      'Docker',
      'PostgreSQL'
    ],
    targetRoles: [
      'Data Engineer',
      'Senior Data Engineer',
      'Data Platform Engineer',
      'Big Data Engineer',
      'Analytics Engineer',
      'Data Pipeline Engineer',
      'Streaming Data Engineer',
      'ETL Developer'
    ],
    targetCompanies: [
      'Databricks',
      'Snowflake',
      'Confluent',
      'Fractal',
      'InMobi',
      'Cloudera',
      'AWS',
      'Google',
      'Uber',
      'Razorpay',
      'Stripe',
      'MongoDB',
      'Palantir',
      'CRED'
    ],
    sampleCompanies: ['Databricks', 'Snowflake', 'Confluent', 'Fractal', 'InMobi'],
    roleTitleKeywords: [
      'data engineer',
      'big data',
      'data platform',
      'analytics engineer',
      'etl',
      'spark',
      'kafka',
      'lakehouse',
      'data pipeline',
      'streaming',
      'warehouse',
      'ingestion',
      'databricks',
      'snowflake'
    ],
    mismatchKeywords: ['frontend', 'react', 'mobile', 'ios', 'android', 'ui designer', 'ux', 'qa tester'],
    highFitSectors: ['data', 'analytics', 'cloud', 'fintech', 'ai', 'tier-1 product'],
    priorityCompanies: [
      'databricks',
      'snowflake',
      'confluent',
      'fractal',
      'inmobi',
      'cloudera',
      'palantir',
      'mongodb',
      'elastic',
      'teradata',
      'mu sigma',
      'quantiphi',
      'tiger analytics',
      'aws',
      'uber'
    ],
    competencyVectors: {
      distributedSystems: 97,
      fintechProtocols: 88,
      cloudK8s: 92,
      reliabilityObservability: 93,
      securityDDoS: 88,
      aiAutomation: 95
    }
  },
  {
    id: 'devops-sre',
    title: 'DevOps, Cloud & SRE',
    shortTitle: 'DevOps & SRE',
    badge: '☁️ Cloud / SRE',
    icon: '☁️',
    tagline: 'Kubernetes, Terraform, AWS, Docker, Observability, CI/CD & Reliability',
    accentColor: '#3b82f6',
    accentGradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    defaultTitle: 'DevOps & Site Reliability / Platform Engineer',
    defaultSummary:
      'DevOps / Site Reliability Engineer with production experience managing Amazon EKS clusters, CI/CD automation, cloud infrastructure-as-code with Terraform, and security hardening. Proficient in Linux systems administration, Python, Bash, Docker, and AWS, with hands-on ownership of high-availability Kubernetes environments, observability pipelines (Datadog, Prometheus), and traffic failover.',
    coreSkills: [
      'Amazon EKS & Kubernetes',
      'Linux Systems Administration',
      'Python & TypeScript',
      'Bash / Shell Scripting',
      'Terraform (IaC)',
      'AWS (EKS, EC2, Route 53, IAM, VPC, S3)',
      'NGINX (Reverse Proxy, SSL/TLS, Rate Limiting)',
      'AWS WAF & Security Hardening',
      'CI/CD (Jenkins, GitHub Actions, ArgoCD)',
      'GitOps & Spinnaker',
      'Observability (Datadog, Prometheus, Grafana)',
      'Docker & Helm Chart Development',
      'Distributed Financial Systems'
    ],
    popularSkills: [
      'Kubernetes',
      'AWS',
      'Terraform',
      'Docker',
      'CI/CD',
      'Linux',
      'Python',
      'Datadog',
      'Prometheus',
      'Grafana',
      'ArgoCD',
      'Helm',
      'Bash',
      'GCP',
      'Azure',
      'GitOps',
      'Vault'
    ],
    targetRoles: [
      'Site Reliability Engineer',
      'Platform Engineer',
      'DevOps Engineer',
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
      'Uber'
    ],
    sampleCompanies: ['AWS', 'Ramp', 'Citadel', 'Datadog', 'Stripe'],
    roleTitleKeywords: [
      'devops',
      'sre',
      'site reliability',
      'platform',
      'infrastructure',
      'cloud',
      'systems',
      'production engineer'
    ],
    mismatchKeywords: ['frontend', 'react', 'mobile', 'ios', 'android', 'ui designer', 'product designer'],
    highFitSectors: ['infra', 'cloud', 'fintech', 'saas', 'tier-1 product'],
    priorityCompanies: ['aws', 'hashicorp', 'cloudflare', 'datadog', 'stripe', 'citadel', 'uber', 'ramp', 'robinhood'],
    competencyVectors: {
      distributedSystems: 96,
      fintechProtocols: 94,
      cloudK8s: 99,
      reliabilityObservability: 97,
      securityDDoS: 95,
      aiAutomation: 92
    }
  },
  {
    id: 'backend-systems',
    title: 'Backend & Distributed Systems',
    shortTitle: 'Backend Systems',
    badge: '⚡ Backend',
    icon: '⚡',
    tagline: 'Go, Java, Microservices, High Throughput, gRPC & Low Latency Architecture',
    accentColor: '#10b981',
    accentGradient: 'linear-gradient(135deg, #10b981, #059669)',
    defaultTitle: 'Senior Backend / Distributed Systems Engineer',
    defaultSummary:
      'Backend Engineer focused on high-throughput, low-latency distributed systems and microservices. Expert in Go, Java, Spring Boot, PostgreSQL, Redis, Kafka, and gRPC. Dedicated to architecting reliable, horizontally scalable transactional platforms handling tens of thousands of requests per second.',
    coreSkills: [
      'Go (Golang)',
      'Java & Spring Boot',
      'Distributed Systems',
      'PostgreSQL',
      'Redis',
      'Apache Kafka',
      'gRPC & REST APIs',
      'Microservices Architecture',
      'Docker & Kubernetes',
      'System Design',
      'SQL Optimization',
      'Concurrency & Multi-threading',
      'Event-Driven Architecture'
    ],
    popularSkills: [
      'Go',
      'Java',
      'Spring Boot',
      'Python',
      'PostgreSQL',
      'Redis',
      'Kafka',
      'gRPC',
      'Docker',
      'Kubernetes',
      'Microservices',
      'Distributed Systems',
      'MySQL',
      'DynamoDB',
      'C++',
      'Rust'
    ],
    targetRoles: [
      'Backend Engineer',
      'Senior Backend Engineer',
      'Distributed Systems Engineer',
      'Software Development Engineer (SDE-II/III)',
      'Core Systems Engineer',
      'API Platform Engineer'
    ],
    targetCompanies: [
      'Uber',
      'Stripe',
      'Netflix',
      'Razorpay',
      'Swiggy',
      'Zomato',
      'CRED',
      'PhonePe',
      'Zerodha',
      'Citadel',
      'Jane Street',
      'Grab'
    ],
    sampleCompanies: ['Uber', 'Stripe', 'Netflix', 'Razorpay', 'Swiggy'],
    roleTitleKeywords: [
      'backend',
      'software engineer',
      'sde',
      'distributed systems',
      'systems engineer',
      'api',
      'core software',
      'server',
      'platform engineer'
    ],
    mismatchKeywords: ['frontend', 'react native', 'mobile', 'ios', 'ui designer', 'product designer'],
    highFitSectors: ['fintech', 'tier-1 product', 'ecommerce', 'high scale', 'saas'],
    priorityCompanies: [
      'uber',
      'stripe',
      'netflix',
      'razorpay',
      'swiggy',
      'zomato',
      'cred',
      'phonepe',
      'zerodha',
      'grab',
      'tower research'
    ],
    competencyVectors: {
      distributedSystems: 98,
      fintechProtocols: 93,
      cloudK8s: 90,
      reliabilityObservability: 92,
      securityDDoS: 89,
      aiAutomation: 88
    }
  },
  {
    id: 'frontend-fullstack',
    title: 'Frontend & Fullstack Engineering',
    shortTitle: 'Frontend & UI',
    badge: '🎨 Frontend',
    icon: '🎨',
    tagline: 'React, Next.js, TypeScript, Node.js, Web Vitals, Design Systems & High Performance UI',
    accentColor: '#ec4899',
    accentGradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    defaultTitle: 'Senior Frontend / Fullstack Engineer',
    defaultSummary:
      'Product-minded Frontend and Fullstack Engineer specializing in React, Next.js, TypeScript, and modern web architectures. Passionate about building world-class user interfaces, micro-interactions, responsive design systems, Web Vitals optimization, and robust Node.js backend integrations.',
    coreSkills: [
      'React.js',
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Node.js',
      'GraphQL & REST APIs',
      'State Management (Redux/Zustand)',
      'Web Performance & Core Vitals',
      'UI/UX Design Systems',
      'HTML5 & Modern CSS',
      'Vite & Webpack',
      'Jest & Cypress'
    ],
    popularSkills: [
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'Node.js',
      'Tailwind CSS',
      'GraphQL',
      'HTML5/CSS3',
      'Vue.js',
      'Vite',
      'Redux',
      'Zustand',
      'PostgreSQL',
      'Figma',
      'Jest'
    ],
    targetRoles: [
      'Frontend Engineer',
      'Senior Frontend Engineer',
      'Fullstack Engineer',
      'UI Engineer',
      'Staff Web Engineer',
      'Product Engineer'
    ],
    targetCompanies: [
      'Vercel',
      'Figma',
      'Notion',
      'Postman',
      'Atlassian',
      'BrowserStack',
      'Canva',
      'Linear',
      'Miro',
      'Airbnb',
      'Stripe'
    ],
    sampleCompanies: ['Vercel', 'Figma', 'Notion', 'Postman', 'Atlassian'],
    roleTitleKeywords: [
      'frontend',
      'fullstack',
      'full stack',
      'ui',
      'web',
      'react',
      'client',
      'product engineer',
      'javascript engineer'
    ],
    mismatchKeywords: ['embedded', 'firmware', 'kernel', 'hardware', 'devops only'],
    highFitSectors: ['developer tools', 'saas', 'design tech', 'product tech', 'tier-1 product'],
    priorityCompanies: [
      'vercel',
      'figma',
      'postman',
      'atlassian',
      'browserstack',
      'canva',
      'linear',
      'notion',
      'miro',
      'airbnb'
    ],
    competencyVectors: {
      distributedSystems: 86,
      fintechProtocols: 84,
      cloudK8s: 82,
      reliabilityObservability: 89,
      securityDDoS: 85,
      aiAutomation: 90
    }
  },
  {
    id: 'ai-ml',
    title: 'AI, ML & LLM Engineering',
    shortTitle: 'AI / ML Platform',
    badge: '🤖 AI / ML',
    icon: '🤖',
    tagline: 'PyTorch, LLMs, RAG Pipelines, Vector DBs, Fine-Tuning & High-Throughput MLOps',
    accentColor: '#8b5cf6',
    accentGradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
    defaultTitle: 'Machine Learning / AI Systems Engineer',
    defaultSummary:
      'AI & Machine Learning Engineer specializing in Foundation Models, LLM fine-tuning, retrieval-augmented generation (RAG) architectures, and production MLOps pipelines. Proficient in Python, PyTorch, Hugging Face, vector databases (Pinecone, Milvus, Qdrant), and deploying high-throughput inference endpoints on Kubernetes and GPUs.',
    coreSkills: [
      'Python',
      'PyTorch',
      'Large Language Models (LLMs)',
      'RAG Pipelines & LangChain',
      'Vector Databases (Pinecone, Milvus)',
      'Hugging Face & Transformers',
      'MLOps & Model Deployment',
      'FastAPI',
      'Docker & GPU Acceleration (CUDA)',
      'Model Fine-Tuning & LoRA',
      'Deep Learning Architectures',
      'Scikit-Learn & Pandas'
    ],
    popularSkills: [
      'Python',
      'PyTorch',
      'LLMs',
      'LangChain',
      'TensorFlow',
      'Vector DBs',
      'RAG',
      'MLOps',
      'Transformers',
      'Hugging Face',
      'FastAPI',
      'Docker',
      'Kubernetes',
      'Fine-Tuning',
      'Deep Learning'
    ],
    targetRoles: [
      'Machine Learning Engineer',
      'AI Engineer',
      'LLM Engineer',
      'Applied AI Scientist',
      'MLOps Engineer',
      'Deep Learning Specialist',
      'AI Platform Engineer'
    ],
    targetCompanies: [
      'OpenAI',
      'Anthropic',
      'Cohere',
      'Scale AI',
      'Databricks',
      'Nvidia',
      'Google DeepMind',
      'Sarvam AI',
      'Krutrim',
      'Microsoft',
      'Meta',
      'Fractal'
    ],
    sampleCompanies: ['OpenAI', 'Anthropic', 'Scale AI', 'Databricks', 'Nvidia'],
    roleTitleKeywords: [
      'machine learning',
      'ml',
      'ai engineer',
      'applied ai',
      'artificial intelligence',
      'foundation models',
      'deep learning',
      'llm',
      'genai',
      'generative ai',
      'nlp',
      'computer vision',
      'data scientist',
      'applied scientist',
      'mlops'
    ],
    mismatchKeywords: ['frontend', 'ui designer', 'manual qa', 'sysadmin'],
    highFitSectors: ['ai', 'deeptech', 'research', 'cloud', 'tier-1 product'],
    priorityCompanies: [
      'openai',
      'anthropic',
      'cohere',
      'scale ai',
      'databricks',
      'nvidia',
      'google',
      'sarvam ai',
      'krutrim',
      'microsoft',
      'fractal'
    ],
    competencyVectors: {
      distributedSystems: 93,
      fintechProtocols: 85,
      cloudK8s: 91,
      reliabilityObservability: 90,
      securityDDoS: 87,
      aiAutomation: 99
    }
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity & Cloud Security',
    shortTitle: 'Cybersecurity',
    badge: '🛡️ Security',
    icon: '🛡️',
    tagline: 'Cloud Security, IAM, WAF, Zero Trust, DevSecOps & Enterprise Hardening',
    accentColor: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    defaultTitle: 'Security Engineer / Cloud Security Specialist',
    defaultSummary:
      'Cybersecurity & DevSecOps Engineer with expertise in cloud infrastructure security (AWS/GCP), container hardening, identity and access management (IAM), AWS WAF, DDoS mitigation, and vulnerability remediation. Skilled in implementing Zero Trust architecture and automated security scanning in CI/CD.',
    coreSkills: [
      'Cloud Security (AWS/Azure/GCP)',
      'DevSecOps & CI/CD Security',
      'AWS WAF & DDoS Mitigation',
      'IAM & Zero Trust Architecture',
      'Vulnerability Assessment & Pen Testing',
      'SIEM & SOC Operations',
      'Linux Hardening',
      'Python & Bash Automation',
      'Container Security (Trivy, Falco)',
      'OWASP Top 10 Remediation',
      'Network Security & Firewalls'
    ],
    popularSkills: [
      'Cloud Security',
      'IAM',
      'WAF',
      'DDoS',
      'Zero Trust',
      'DevSecOps',
      'SIEM',
      'Penetration Testing',
      'Kubernetes Security',
      'Linux Hardening',
      'Python',
      'SOC',
      'Cryptography',
      'OWASP'
    ],
    targetRoles: [
      'Security Engineer',
      'Cloud Security Engineer',
      'DevSecOps Engineer',
      'AppSec Engineer',
      'Infosec Specialist',
      'Security Operations Engineer'
    ],
    targetCompanies: [
      'CrowdStrike',
      'Palo Alto Networks',
      'Zscaler',
      'Cloudflare',
      'SentinelOne',
      'Qualys',
      'Fortinet',
      'Okta',
      'Wiz',
      'Citadel',
      'Stripe'
    ],
    sampleCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Zscaler', 'Cloudflare', 'Wiz'],
    roleTitleKeywords: [
      'security',
      'cybersecurity',
      'infosec',
      'cloud security',
      'devsecops',
      'appsec',
      'secops',
      'soc',
      'penetration',
      'vulnerability'
    ],
    mismatchKeywords: ['frontend', 'ui designer', 'marketing', 'sales engineer'],
    highFitSectors: ['security', 'enterprise', 'fintech', 'cloud', 'infra'],
    priorityCompanies: [
      'crowdstrike',
      'palo alto networks',
      'zscaler',
      'cloudflare',
      'sentinelone',
      'qualys',
      'fortinet',
      'okta',
      'wiz',
      'stripe'
    ],
    competencyVectors: {
      distributedSystems: 94,
      fintechProtocols: 95,
      cloudK8s: 94,
      reliabilityObservability: 93,
      securityDDoS: 99,
      aiAutomation: 89
    }
  }
];

export interface SeniorityLevel {
  id: string;
  label: string;
  badge: string;
  experienceYears: string;
  description: string;
}

export const SENIORITY_LEVELS: SeniorityLevel[] = [
  {
    id: 'entry',
    label: 'New Grad / Junior',
    badge: '🎓 0–2 Years',
    experienceYears: '0–2 Years',
    description: 'Foundation skills, quick learner, recent graduate or transitioning'
  },
  {
    id: 'mid',
    label: 'Mid-Level Engineer',
    badge: '🚀 2–5 Years',
    experienceYears: '2–5 Years',
    description: 'Autonomous execution, production ownership, feature delivery'
  },
  {
    id: 'senior',
    label: 'Senior Engineer',
    badge: '⚡ 5–8 Years',
    experienceYears: '5–8 Years',
    description: 'System design, architectural depth, cross-team reliability'
  },
  {
    id: 'staff',
    label: 'Staff / Principal / Lead',
    badge: '👑 8+ Years',
    experienceYears: '8+ Years',
    description: 'Strategic technical leadership, org-wide impact, platform scaling'
  }
];

export function getDomainById(id?: string): DomainTrack {
  if (!id) return DOMAIN_TRACKS[1];
  const found = DOMAIN_TRACKS.find((d) => d.id === id);
  return found || DOMAIN_TRACKS[1];
}

export function detectDomainFromProfile(profile: {
  domain?: string;
  title?: string;
  preferences?: { targetRoles?: string[] };
}): DomainTrack {
  if (profile.domain) {
    const d = DOMAIN_TRACKS.find((t) => t.id === profile.domain);
    if (d) return d;
  }

  const titleText = ((profile.title || '') + ' ' + (profile.preferences?.targetRoles || []).join(' ')).toLowerCase();

  if (
    titleText.includes('data engineer') ||
    titleText.includes('big data') ||
    titleText.includes('data platform') ||
    titleText.includes('analytics engineer') ||
    titleText.includes('etl') ||
    titleText.includes('spark')
  ) {
    return getDomainById('data-engineering');
  }

  if (
    titleText.includes('machine learning') ||
    titleText.includes('ai engineer') ||
    titleText.includes('deep learning') ||
    titleText.includes('llm') ||
    titleText.includes('data scientist')
  ) {
    return getDomainById('ai-ml');
  }

  if (
    titleText.includes('security') ||
    titleText.includes('cyber') ||
    titleText.includes('devsecops') ||
    titleText.includes('appsec') ||
    titleText.includes('infosec')
  ) {
    return getDomainById('cybersecurity');
  }

  if (
    titleText.includes('frontend') ||
    titleText.includes('fullstack') ||
    titleText.includes('full stack') ||
    titleText.includes('ui engineer') ||
    titleText.includes('react')
  ) {
    return getDomainById('frontend-fullstack');
  }

  if (
    titleText.includes('backend') ||
    titleText.includes('distributed systems') ||
    titleText.includes('microservices') ||
    titleText.includes('golang') ||
    titleText.includes('java')
  ) {
    return getDomainById('backend-systems');
  }

  return getDomainById('devops-sre');
}
