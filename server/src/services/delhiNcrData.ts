import type { JobOpportunity } from '../types.js';

export const delhiNcrCompanies: JobOpportunity[] = [
  // ==========================================
  // FAANG / MNC (10 Companies)
  // ==========================================
  {
    id: 'ncr-google',
    company: 'Google',
    title: 'Site Reliability Engineer, Cloud & Production Infrastructure',
    domain: 'google.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'DLF Cyber City, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹45L - ₹75L + GSUs',
    url: 'https://careers.google.com/',
    description:
      'Google Gurugram engineering team builds and maintains planet-scale infrastructure powering Google Cloud (GCP), Workspace, and YouTube. Looking for SREs with deep expertise in Linux systems administration, Kubernetes container orchestration, automated multi-region recovery, and distributed system reliability.',
    requiredSkills: [
      'Linux Kernel & Systems Administration',
      'Kubernetes & Large-Scale Container Orchestration',
      'Python & Go Distributed Programming',
      'Multi-Region Disaster Recovery & GSLB',
      'Production Incident Management & Post-Mortems',
      'Terraform & Infrastructure-as-Code'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 99,
      experienceMatch: 95,
      domainMatch: 98,
      strengths: [
        'Production lifecycle ownership of 3 Amazon EKS clusters with zero-downtime rolling upgrades at LSEG',
        'Engineered Route 53 GSLB automated multi-region failover sustaining 99.9%+ availability',
        'Reusable Terraform modules across 4 environments cutting deploy times by 40%'
      ],
      gaps: ['Opportunity to showcase Borg/GCP specific tooling alongside deep AWS EKS foundation'],
      lsegAdvantage:
        'Managing tier-1 financial infrastructure at London Stock Exchange Group with 99.9%+ availability and zero-downtime upgrades directly maps to Google SRE production rigor.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-google-live-1',
        title: 'Senior Site Reliability Engineer - Google Cloud Platform (GCP)',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.google.com/jobs/results/?q=site+reliability+engineer+gurugram',
        vectorScore: 98
      },
      {
        id: 'ncr-google-live-2',
        title: 'Software Engineer III, Infrastructure & Distributed Systems',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.google.com/jobs/results/?q=software+engineer+infrastructure+gurugram',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-microsoft',
    company: 'Microsoft',
    title: 'Software Engineer II - Azure Core Platform & SRE',
    domain: 'microsoft.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Sector 16, Noida & DLF Cyber City, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹40L - ₹65L + Stock',
    url: 'https://careers.microsoft.com/',
    description:
      'Microsoft India Development Center (IDC) across Noida and Gurugram powers Azure Core compute, Kubernetes services, and enterprise cloud reliability. Seeking engineers experienced in Linux internals, infrastructure scaling, CI/CD automation, and high-availability platform services.',
    requiredSkills: [
      'Azure & AWS Cloud Architecture',
      'Kubernetes Cluster Lifecycle Management',
      'Linux Networking & Security Hardening',
      'CI/CD Pipelines (GitHub Actions / Jenkins)',
      'Terraform IaC & State Management',
      'Observability (Prometheus, Grafana)'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 94,
      domainMatch: 97,
      strengths: [
        'AZ-900 Microsoft Azure Fundamentals certified with hands-on multi-cloud migration experience',
        '20+ automated Jenkins & GitHub Actions CI/CD pipelines across microservices at LSEG',
        'DDoS & Zip Bomb attack mitigation with WAF-level rate limiting'
      ],
      gaps: ['Further Azure-native telemetry tooling experience (Azure Monitor)'],
      lsegAdvantage:
        'Experience adhering to strict capital markets compliance and audit rigor matches Microsoft enterprise grade cloud operations.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-msft-live-1',
        title: 'Site Reliability Engineer - Azure SRE & Kubernetes',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.microsoft.com/v2/global/en/home.html',
        vectorScore: 97
      },
      {
        id: 'ncr-msft-live-2',
        title: 'Software Engineer - Cloud Infrastructure & Core Networking',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.microsoft.com/v2/global/en/home.html',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-amazon',
    company: 'Amazon',
    title: 'System Development Engineer II, AWS Core Reliability',
    domain: 'amazon.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Ambience Island, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Ambience Cyber Hub)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹38L - ₹60L + RSUs',
    url: 'https://www.amazon.jobs/',
    description:
      'Amazon Gurugram engineering teams drive AWS infrastructure reliability, payment operations, and retail logistics platforms. Role focuses on Amazon EKS operations, Route 53 global traffic routing, AWS WAF security posture, and high-scale operational automation.',
    requiredSkills: [
      'Amazon EKS & AWS Cloud Services',
      'AWS Route 53 GSLB & Multi-Region Recovery',
      'Linux Operating Systems & Bash Scripting',
      'Docker & Helm Packaging',
      'Terraform Remote State Provisioning',
      'AWS Security Hardening (WAF, IAM Least-Privilege)'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 99,
      experienceMatch: 96,
      domainMatch: 98,
      strengths: [
        'Direct AWS Certified Cloud Practitioner with extensive Amazon EKS production cluster ownership',
        'Route 53 GSLB traffic failover architecture directly matches AWS internal reliability principles',
        'Engineered JMeter load testing simulating 500+ users to eliminate platform bottlenecks'
      ],
      gaps: ['Internal Amazon toolchain (Brazil, Apollo) knowledge'],
      lsegAdvantage:
        'Proven track record of operating mission-critical AWS financial workloads under strict 99.9% uptime SLAs.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-amazon-live-1',
        title: 'Systems Engineer II - AWS Cloud Infrastructure',
        location: 'Gurugram, Delhi NCR',
        type: 'On-site',
        url: 'https://www.amazon.jobs/en/search?base_query=systems+engineer&loc_query=Gurugram',
        vectorScore: 98
      },
      {
        id: 'ncr-amazon-live-2',
        title: 'DevOps Engineer - Prime & E-Commerce Platform',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.amazon.jobs/en/search?base_query=devops&loc_query=Gurugram',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-meta',
    company: 'Meta',
    title: 'Production Engineer - Core Systems & Infrastructure',
    domain: 'meta.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=meta.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Horizon One, Golf Course Road, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Golf Course Road)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹50L - ₹85L + RSUs',
    url: 'https://www.metacareers.com/',
    description:
      'Meta Gurugram operations focus on platform engineering, distributed systems resilience, and enterprise partnerships. Production Engineers operate at the intersection of software engineering and systems administration to keep billions of users connected across Instagram, WhatsApp, and Facebook.',
    requiredSkills: [
      'Linux Systems Architecture & Performance Tuning',
      'Python, C++ or Go Scripting & Automation',
      'Distributed Systems & Consensus Protocols',
      'High-Throughput Ingress & Traffic Routing',
      'Disaster Recovery & Failure Domain Isolation',
      'Observability & Automated Remediation'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Built LLM-Powered Incident Triage engine using Claude API reducing MTTD by 60%',
        'Linux node cordon/drain and live zero-downtime rolling upgrades on 3 production EKS clusters',
        'Remediated Zip Bomb and DDoS vectors with NGINX rate-limiting'
      ],
      gaps: ['Kernel eBPF and custom hardware fleet telemetry experience'],
      lsegAdvantage:
        'LSEG financial system resilience mindset aligns with Meta production engineering zero-downtime philosophy.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-meta-live-1',
        title: 'Production Engineer, Infrastructure Resilience',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.metacareers.com/jobs?q=production%20engineer',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-adobe',
    company: 'Adobe',
    title: 'Senior Site Reliability Engineer, Adobe Experience Cloud',
    domain: 'adobe.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Sector 132 & Sector 25A, Noida, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida Expressway Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹36L - ₹55L + RSUs',
    url: 'https://careers.adobe.com/',
    description:
      'Adobe Noida Campus is one of Adobes largest engineering hubs outside San Jose, driving Adobe Experience Cloud, Creative Cloud infrastructure, and Firefly GenAI platform engineering.',
    requiredSkills: [
      'Kubernetes & Helm Chart Architecture',
      'AWS & Azure Multi-Cloud Provisioning',
      'Terraform Module Design with Remote Locking',
      'Datadog & Prometheus Full-Stack Observability',
      'CI/CD Pipeline Security & Zero-Downtime Rollouts',
      'Python & Shell Scripting'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Architected Terraform modules across 4 environments cutting deployment time by 40%',
        'Datadog & Prometheus custom dashboards with proactive alert threshold modeling',
        'ArgoCD GitOps pipeline automation with automated rollback triggers'
      ],
      gaps: ['Adobe Experience Platform proprietary telemetry familiarity'],
      lsegAdvantage:
        'High-scale multi-environment governance experience ensures compliance across enterprise software deployments.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-adobe-live-1',
        title: 'Computer Scientist - SRE & Cloud Orchestration',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.adobe.com/us/en/search-results?keywords=site%20reliability%20engineer',
        vectorScore: 97
      },
      {
        id: 'ncr-adobe-live-2',
        title: 'DevOps Engineer - Creative Cloud Platform',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.adobe.com/us/en/search-results?keywords=devops',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-oracle',
    company: 'Oracle',
    title: 'Principal DevOps / SRE Engineer - Oracle Cloud Infrastructure (OCI)',
    domain: 'oracle.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=oracle.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Sector 62 / Sector 127, Noida & DLF Cyber City, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹52L',
    url: 'https://www.oracle.com/corporate/careers/',
    description:
      'Oracle Cloud Infrastructure (OCI) engineering teams in Noida and Gurugram build next-generation enterprise database infrastructure, bare-metal compute, and container orchestration.',
    requiredSkills: [
      'OCI / AWS Cloud Infrastructure',
      'Kubernetes & Linux Systems Engineering',
      'Terraform IaC & Cloud Automation',
      'Database Cluster Reliability & Replication',
      'High-Availability Architecture & Disaster Recovery',
      'Network Ingress & WAF Security'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 95,
      strengths: [
        'PostgreSQL, MongoDB, and Snowflake database infrastructure familiarity',
        'Enterprise Linux systems administration and cluster capacity planning',
        'Route 53 GSLB automated multi-region failover architecture'
      ],
      gaps: ['Deep Oracle Autonomous Database administration'],
      lsegAdvantage:
        'Experience operating transactional financial services platforms translates directly to mission-critical enterprise database clouds.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-oracle-live-1',
        title: 'Cloud Infrastructure SRE Lead - OCI Operations',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://oracle.taleo.net/careersection/2/jobsearch.ftl',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-sap',
    company: 'SAP',
    title: 'DevOps Engineer - SAP Business Technology Platform (BTP)',
    domain: 'sap.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=sap.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Vatika Towers, Golf Course Road, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Golf Course Road)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹46L',
    url: 'https://jobs.sap.com/',
    description:
      'SAP Labs Gurugram delivers core components of the SAP Business Technology Platform, enabling enterprise multi-cloud orchestration across AWS, Azure, and GCP for Fortune 500 organizations.',
    requiredSkills: [
      'Multi-Cloud Kubernetes (EKS, AKS, GKE)',
      'Enterprise CI/CD & Spinnaker/ArgoCD',
      'Terraform Infrastructure-as-Code',
      'Observability & Alert Telemetry',
      'Linux Networking & Container Security',
      'Python & Bash Automation'
    ],
    vectorScore: 93,
    matchBreakdown: {
      overall: 93,
      skillsMatch: 94,
      experienceMatch: 91,
      domainMatch: 93,
      strengths: [
        'ArgoCD GitOps & Spinnaker pipeline integration expertise',
        'Multi-environment Terraform management with remote state locking',
        'SonarQube code quality enforcement and automated test gates'
      ],
      gaps: ['SAP proprietary HANA cloud runtime stack'],
      lsegAdvantage:
        'Enterprise security and governance experience aligns with European and global ERP regulatory frameworks.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-sap-live-1',
        title: 'Cloud Reliability Engineer - Multi-Cloud K8s',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://jobs.sap.com/search/?q=devops+gurugram',
        vectorScore: 93
      }
    ]
  },
  {
    id: 'ncr-ibm',
    company: 'IBM',
    title: 'Site Reliability Engineer - IBM Cloud & Red Hat OpenShift',
    domain: 'ibm.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=ibm.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Sector 62, Noida & DLF Cyber City, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹26L - ₹42L',
    url: 'https://www.ibm.com/careers/',
    description:
      'IBMs India Software Labs in Noida and Gurugram focus on hybrid cloud computing, Red Hat OpenShift platform infrastructure, AI operations with watsonx, and enterprise resilience.',
    requiredSkills: [
      'Red Hat OpenShift & Kubernetes Cluster Admin',
      'Linux Enterprise Server Administration',
      'Ansible & Terraform Infrastructure Automation',
      'CI/CD Jenkins & Tekton Pipelines',
      'Site Reliability & Incident Response',
      'Prometheus, Grafana & ELK Stack'
    ],
    vectorScore: 93,
    matchBreakdown: {
      overall: 93,
      skillsMatch: 94,
      experienceMatch: 91,
      domainMatch: 94,
      strengths: [
        'Certified Kubernetes Administrator (CKA) preparation and deep EKS cluster operational mastery',
        'Linux build agents automation across 20+ Jenkins pipelines',
        'Datadog and Prometheus alert policies for production Kubernetes workloads'
      ],
      gaps: ['IBM Cloud Power Systems specific hardware telemetry'],
      lsegAdvantage:
        'Deep institutional understanding of financial industry infrastructure requirements.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-ibm-live-1',
        title: 'Site Reliability Engineer - Hybrid Cloud Platform',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.ibm.com/careers/search?q=site%20reliability%20engineer',
        vectorScore: 93
      }
    ]
  },
  {
    id: 'ncr-salesforce',
    company: 'Salesforce',
    title: 'Lead Site Reliability Engineer - Salesforce Core Infrastructure',
    domain: 'salesforce.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=salesforce.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Two Horizon Center, Golf Course Road, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Horizon Center)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹38L - ₹62L + RSUs',
    url: 'https://careers.salesforce.com/',
    description:
      'Salesforces flagship engineering hub at Two Horizon Center in Gurugram spearheads Hyperforce architecture on public cloud providers (AWS/Azure), multi-tenant Kubernetes scaling, and Agentforce AI platform resilience.',
    requiredSkills: [
      'AWS Hyperforce & EKS Cluster Lifecycle',
      'Terraform & Infrastructure-as-Code Orchestration',
      'High-Availability Multi-Region Failover Architecture',
      'DDoS, WAF & Zero-Trust Cloud Security',
      'Spinnaker / ArgoCD GitOps Deployment Gates',
      'Python & Bash Scripting Automation'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 98,
      strengths: [
        'Proven Amazon EKS zero-downtime rolling upgrades aligns with Hyperforce architecture',
        'Engineered AWS Route 53 GSLB multi-region failover sustaining 99.9%+ availability',
        'Remediated Zip Bomb and DDoS vectors with WAF rate limiting'
      ],
      gaps: ['Spinnaker pipeline depth compared to primary Jenkins / ArgoCD focus'],
      lsegAdvantage:
        'LSEG financial compliance and high-availability operations mirror Salesforces mission-critical trust commitments.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-salesforce-live-1',
        title: 'Lead Infrastructure Engineer - Hyperforce & AWS',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.salesforce.com/en/search-jobs/?k=reliability',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-mongodb',
    company: 'MongoDB',
    title: 'Senior Cloud Platform Engineer - Atlas Kubernetes Orchestration',
    domain: 'mongodb.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=mongodb.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'DLF Cyber City, Gurugram, Delhi NCR',
    sector: 'FAANG/MNC',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹36L - ₹58L + Stock',
    url: 'https://www.mongodb.com/careers',
    description:
      'MongoDB Gurugram platform engineering team powers MongoDB Atlas, managing hundreds of thousands of database clusters spanning AWS, GCP, and Azure with Kubernetes operators and automated telemetry.',
    requiredSkills: [
      'Kubernetes Custom Resource Definitions (CRDs) & Operators',
      'AWS / Multi-Cloud Cloud Networking & VPC Peering',
      'Terraform & Infrastructure Automation',
      'Linux Kernel Tuning & Disk I/O Performance',
      'Distributed Consensus & High Availability',
      'Go & Python Platform Development'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 93,
      domainMatch: 97,
      strengths: [
        'Hands-on MongoDB, PostgreSQL, and Snowflake database platform administration',
        'Architected Kubernetes manifests validation service pre-deployment',
        'Linux kernel tuning for high I/O throughput and low-latency network packet handling'
      ],
      gaps: ['Writing custom Golang Kubernetes operators from scratch'],
      lsegAdvantage:
        'Experience with high-frequency financial telemetry databases provides immediate domain relevance.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-mongodb-live-1',
        title: 'Cloud Infrastructure Engineer - Atlas Reliability',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.mongodb.com/careers/jobs?q=cloud',
        vectorScore: 96
      }
    ]
  },

  // ==========================================
  // FINTECH (12 Companies)
  // ==========================================
  {
    id: 'ncr-paytm',
    company: 'Paytm',
    title: 'Principal Site Reliability Engineer - High-Throughput UPI & Core Payments',
    domain: 'paytm.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=paytm.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'One97 Communications, Sector 5 / Sector 98, Noida, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida HQ)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹35L - ₹55L + ESOPs',
    url: 'https://paytm.com/careers',
    description:
      'Paytms Noida headquarters drives Indias premier digital payments ecosystem processing billions of transactions per month. SRE team focuses on sub-100ms payment gateway latency, high-concurrency UPI switch reliability, and zero-downtime AWS EKS deployments.',
    requiredSkills: [
      'High-Throughput UPI & Payment Switch Reliability',
      'Amazon EKS & Kubernetes Multi-Cluster Scaling',
      'Linux Networking, NGINX SSL/TLS Offloading & Rate Limiting',
      'DDoS Mitigation & Security Hardening (AWS WAF)',
      'Automated Disaster Recovery & Traffic Failover',
      'Datadog, Prometheus & Kafka Stream Monitoring'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 99,
      experienceMatch: 97,
      domainMatch: 99,
      strengths: [
        'Direct financial markets infrastructure experience at London Stock Exchange Group (LSEG)',
        'Hardened production security against DDoS & Zip Bomb attack vectors with WAF rate limiting',
        'Engineered Route 53 GSLB multi-region failover sustaining 99.9%+ uptime across banking hours'
      ],
      gaps: ['NPCI UPI switch direct API integration nuances'],
      lsegAdvantage:
        'Direct LSEG distributed financial systems experience provides unmatched domain expertise for transaction reliability, regulatory audits, and zero-downtime settlement.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-paytm-live-1',
        title: 'Lead SRE - Payments Gateway & Settlement Engine',
        location: 'Noida, Delhi NCR',
        type: 'On-site',
        url: 'https://paytm.com/careers',
        vectorScore: 98
      },
      {
        id: 'ncr-paytm-live-2',
        title: 'Senior DevOps Engineer - Microservices & AWS EKS',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://paytm.com/careers',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-pinelabs',
    company: 'Pine Labs',
    title: 'Staff Platform Engineer - Merchant Checkout & POS Cloud Infra',
    domain: 'pinelabs.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=pinelabs.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Candor TechSpace, Sector 62, Noida, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Candor TechSpace)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹50L',
    url: 'https://www.pinelabs.com/careers',
    description:
      'Pine Labs powers in-store merchant checkout, POS terminals, and online payment APIs (Plural) across India and Southeast Asia. Platforms team builds scalable cloud infrastructure with Kubernetes, microservices routing, and PCI-DSS compliance.',
    requiredSkills: [
      'PCI-DSS Compliant Cloud Infrastructure',
      'Amazon EKS & Kubernetes Operations',
      'Terraform IaC & Vault Secrets Management',
      'NGINX Reverse Proxy & API Gateway Routing',
      'Prometheus, Grafana & Distributed Tracing',
      'High-Availability Database Replication'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 97,
      strengths: [
        'Production ownership of 3 EKS clusters at LSEG with strict security compliance',
        'Terraform modules with IAM least-privilege controls saving 40% deployment time',
        'Configured NGINX reverse proxy with SSL termination and rate limiting'
      ],
      gaps: ['Hardware POS IoT telemetry integration'],
      lsegAdvantage:
        'Financial compliance experience at LSEG directly fulfills Pine Labs PCI-DSS and RBI data localization requirements.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-pinelabs-live-1',
        title: 'Senior Site Reliability Engineer - Plural Payments',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.pinelabs.com/careers',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-policybazaar',
    company: 'Policybazaar',
    title: 'Lead DevOps Engineer - InsurTech Cloud & CI/CD Pipelines',
    domain: 'policybazaar.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=policybazaar.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Sector 44 / Golf Course Ext Road, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 44 Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://www.policybazaar.com/careers/',
    description:
      'Policybazaar is Indias largest insurance marketplace. SRE and Cloud team handles insurance quotation engines, high-concurrency customer lead pipelines, and partner insurer API integrations.',
    requiredSkills: [
      'AWS Cloud Infrastructure & EKS',
      'Jenkins & GitHub Actions CI/CD Automation',
      'Terraform Multi-Environment Provisioning',
      'Linux Networking & Load Balancing',
      'JMeter Load Testing & Performance Optimization',
      'ELK & Datadog Log Telemetry'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Built 20+ Jenkins CI/CD pipelines across 7 microservices reducing release cycles',
        'Simulated 500+ concurrent users with JMeter to resolve scalability bottlenecks',
        'Production AWS VPC, EKS, Route 53 and IAM hardening'
      ],
      gaps: ['Insurance carrier legacy SOAP/XML protocol translation experience'],
      lsegAdvantage:
        'Financial services platform background ensures rapid onboarding into regulated InsurTech workflows.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-pb-live-1',
        title: 'DevOps & Cloud Security Architect',
        location: 'Gurugram, Delhi NCR',
        type: 'On-site',
        url: 'https://www.policybazaar.com/careers/',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-pbfintech',
    company: 'PB Fintech',
    title: 'Senior Infrastructure Engineer - Paisabazaar & Enterprise Core',
    domain: 'pbfintech.in',
    companyLogo: 'https://www.google.com/s2/favicons?domain=pbfintech.in&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Plot 119, Sector 44, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 44)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹48L',
    url: 'https://www.pbfintech.in/careers/',
    description:
      'PB Fintech is the parent group of Policybazaar and Paisabazaar, managing credit score platforms, digital lending APIs, and enterprise cloud data security across millions of Indian consumers.',
    requiredSkills: [
      'Kubernetes & Cloud Infrastructure Reliability',
      'Financial Data Security & IAM Least Privilege',
      'Multi-Region Traffic Failover',
      'Observability Dashboards & APM',
      'Python & Bash Runbook Automation',
      'Docker & Container Orchestration'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 92,
      domainMatch: 96,
      strengths: [
        'Proven Route 53 GSLB multi-region failover and DNS failover policies',
        'Built Python runbook automation engine using Claude API for incident classification',
        'Kubernetes pod auto-scaling (HPA) and resource limit enforcement'
      ],
      gaps: ['Direct Bureau API (CIBIL/Experian) webhook infrastructure'],
      lsegAdvantage:
        'LSEG financial integrity and audit standards directly align with PB Fintech lending regulations.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-pbfintech-live-1',
        title: 'Platform Reliability Lead - Fintech Services',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.pbfintech.in/careers/',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-arcesium',
    company: 'Arcesium',
    title: 'Staff Site Reliability Engineer - Post-Trade Financial Infrastructure',
    domain: 'arcesium.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=arcesium.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Cyber Park, Sector 20, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber Park)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹38L - ₹60L + Bonus',
    url: 'https://www.arcesium.com/careers/',
    description:
      'Arcesium (spinoff of D. E. Shaw Group) delivers post-trade accounting, treasury management, and portfolio data platforms for leading global hedge funds and asset managers with $675B+ in assets.',
    requiredSkills: [
      'Post-Trade Financial Data Infrastructure',
      'Amazon EKS & Kubernetes Production Scaling',
      'Route 53 GSLB & Multi-Region High Availability',
      'Terraform IaC with Remote State & IAM Policies',
      'PostgreSQL, Snowflake & High-Performance Storage',
      'Linux Networking & Incident Post-Mortems'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 99,
      experienceMatch: 97,
      domainMatch: 99,
      strengths: [
        'Direct employment and production SRE ownership at London Stock Exchange Group (LSEG)',
        'Managed financial microservices sustaining 99.9%+ availability under trading hours',
        'Deep alignment with institutional post-trade, reconciliation and settlement workflows'
      ],
      gaps: ['Hedge fund specific FIX protocol messaging optimization'],
      lsegAdvantage:
        'Operating capital markets infrastructure at LSEG gives Abhinav an immediate, unmatched advantage at Arcesium.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-arcesium-live-1',
        title: 'Site Reliability Engineer - Data Platform & AWS K8s',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.arcesium.com/careers/',
        vectorScore: 98
      }
    ]
  },
  {
    id: 'ncr-indifi',
    company: 'Indifi',
    title: 'Senior DevOps Engineer - MSME Lending & Cloud Infrastructure',
    domain: 'indifi.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=indifi.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Phase IV, Udyog Vihar, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Udyog Vihar)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹24L - ₹38L',
    url: 'https://www.indifi.com/careers',
    description:
      'Indifi enables debt financing for small businesses in India via data-driven credit underwriting. Cloud platform team handles automated loan approval microservices and cloud cost optimization.',
    requiredSkills: [
      'AWS Cloud Services & Kubernetes',
      'CI/CD Pipeline Automation',
      'Terraform Infrastructure-as-Code',
      'Docker Containerization & Microservices',
      'Prometheus, Grafana & CloudWatch',
      'Linux Server Security'
    ],
    vectorScore: 93,
    matchBreakdown: {
      overall: 93,
      skillsMatch: 94,
      experienceMatch: 91,
      domainMatch: 93,
      strengths: [
        'AWS Certified Cloud Practitioner with extensive Amazon EKS and EC2 operations',
        'Built automated CI/CD pipelines eliminating manual handoffs',
        'SonarQube code quality enforcement and security scanning'
      ],
      gaps: ['Fintech NBFC co-lending API protocols'],
      lsegAdvantage:
        'Fintech discipline ensures safe infrastructure deployments with zero data leakage.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-indifi-live-1',
        title: 'DevOps Specialist - AWS & Kubernetes',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.indifi.com/careers',
        vectorScore: 93
      }
    ]
  },
  {
    id: 'ncr-finbox',
    company: 'FinBox',
    title: 'Cloud & DevOps Architect - Embedded Credit Intelligence',
    domain: 'finbox.in',
    companyLogo: 'https://www.google.com/s2/favicons?domain=finbox.in&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Sector 32, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Remote',
    workModel: 'Remote / Hybrid (Sector 32)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹26L - ₹42L',
    url: 'https://finbox.in/careers',
    description:
      'FinBox builds embedded credit infrastructure and risk intelligence SDKs powering top tier banks and NBFCs across India. Seeks platform engineers to scale low-latency credit decisioning APIs.',
    requiredSkills: [
      'Low-Latency API Gateway & Kubernetes Scaling',
      'AWS VPC & High-Throughput Networking',
      'Terraform & Automated Infrastructure',
      'Observability & Distributed Tracing',
      'Python Backend Scripting & Automation',
      'Data Protection & Encryption at Rest'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 95,
      strengths: [
        'Built pre-deployment validation platform for Kubernetes manifests',
        'Configured NGINX reverse proxy with SSL termination and DDoS rate-limiting',
        'Python automation with REST APIs for infrastructure self-healing'
      ],
      gaps: ['On-device mobile SDK telemetry aggregation'],
      lsegAdvantage:
        'Proven reliability record in financial markets translates directly to high-stakes lending APIs.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-finbox-live-1',
        title: 'Infrastructure Engineer - SDK & Big Data Systems',
        location: 'Gurugram, Delhi NCR',
        type: 'Remote',
        url: 'https://finbox.in/careers',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-mobikwik',
    company: 'MobiKwik',
    title: 'Lead Site Reliability Engineer - Wallet, UPI & Merchant Gateway',
    domain: 'mobikwik.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=mobikwik.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'One MobiKwik, Sector 54, Golf Course Road, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Golf Course Road)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹46L',
    url: 'https://www.mobikwik.com/careers',
    description:
      'MobiKwik operates digital wallets, buy-now-pay-later (ZIP), wealth management, and merchant acceptance infrastructure for 140M+ users. SRE lead ensures 99.99% gateway availability during flash sale spikes.',
    requiredSkills: [
      'High-Load Core Banking & Wallet Switches',
      'Kubernetes Cluster Auto-Scaling & Tuning',
      'AWS Multi-Region Traffic Failover (Route 53)',
      'Security Hardening & DDoS Mitigation',
      'Datadog & Kafka Real-Time Alerting',
      'Terraform Cloud Automation'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 97,
      strengths: [
        'LSEG financial systems operations background matches MobiKwik wallet switch requirements',
        'Route 53 GSLB multi-region failover and DNS failover policies',
        'Remediated Zip Bomb and DDoS vectors with WAF rate limiting'
      ],
      gaps: ['Direct integration with NPCI BBPS biller networks'],
      lsegAdvantage:
        'Financial market infrastructure uptime standards directly elevate MobiKwik payment gateway resilience.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-mobikwik-live-1',
        title: 'Lead SRE - High-Load Core Banking Systems',
        location: 'Gurugram, Delhi NCR',
        type: 'On-site',
        url: 'https://www.mobikwik.com/careers',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-razorpay',
    company: 'Razorpay',
    title: 'Senior DevOps Engineer - Enterprise Payments Platform',
    domain: 'razorpay.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=razorpay.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'New Delhi',
    location: 'Aerocity & Gurugram Cyber Hub, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Aerocity / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹35L - ₹55L + ESOPs',
    url: 'https://razorpay.com/jobs/',
    description:
      'Razorpay is Indias leading payments and neobanking platform for businesses. Engineering teams across NCR and Bengaluru build robust payment routing algorithms, automated merchant settlements, and banking APIs.',
    requiredSkills: [
      'Kubernetes Multi-Cluster Orchestration',
      'High-Availability Financial Transaction Switches',
      'Terraform & Infrastructure-as-Code',
      'AWS EKS, Route 53 & VPC Peering',
      'Observability at Scale (Datadog/Prometheus)',
      'Zero-Downtime Blue-Green Deployments'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 98,
      strengths: [
        'Hands-on ownership of 3 production Amazon EKS clusters at London Stock Exchange Group',
        'Engineered Route 53 GSLB automated multi-region failover sustaining 99.9%+ availability',
        'Reusable Terraform modules across 4 environments cutting deploy times by 40%'
      ],
      gaps: ['Razorpay proprietary Go-based proxy routing internals'],
      lsegAdvantage:
        'Direct experience operating financial market systems under continuous regulatory scrutiny.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-razorpay-live-1',
        title: 'Senior Platform Engineer - Cloud Orchestration & Terraform',
        location: 'Delhi NCR / Hybrid',
        type: 'Hybrid',
        url: 'https://razorpay.com/jobs/',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-amex',
    company: 'American Express',
    title: 'Senior Site Reliability Engineer - Global Payment Network & Mainframe Cloud',
    domain: 'americanexpress.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=americanexpress.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Amex Campus, Golf Course Ext Road / Cyber City, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Golf Course Ext Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹52L',
    url: 'https://www.americanexpress.com/en-us/careers/',
    description:
      'American Express Gurugram campus is one of Amexs largest global technology centers, handling authorization engines, card fraud detection models, and hybrid cloud payment settlement infrastructure.',
    requiredSkills: [
      'Hybrid Cloud & Container Reliability (EKS/OpenShift)',
      'High-Throughput Card Authorization Switches',
      'Linux Networking & Network Packet Analysis',
      'Disaster Recovery Orchestration & Chaos Engineering',
      'Splunk, Datadog & Prometheus Observability',
      'Strict Financial Compliance & Audit Controls'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 98,
      experienceMatch: 96,
      domainMatch: 99,
      strengths: [
        'London Stock Exchange Group capital markets production reliability engineering',
        'Route 53 GSLB multi-region automated failover architecture',
        'DDoS & Zip Bomb attack mitigation with WAF-level rate limiting'
      ],
      gaps: ['Legacy ISO 8583 card network protocol message parsers'],
      lsegAdvantage:
        'LSEGs financial institutional background is the exact profile Amex looks for to support global payment settlement reliability.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-amex-live-1',
        title: 'Engineer - Cloud Infrastructure & SRE Operations',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.americanexpress.com/en-us/careers/',
        vectorScore: 98
      }
    ]
  },
  {
    id: 'ncr-fiserv',
    company: 'Fiserv',
    title: 'Site Reliability Engineer - Core Banking & Transaction Switch',
    domain: 'fiserv.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=fiserv.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Sector 62, Noida & Sector 34, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida Sector 62)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹26L - ₹42L',
    url: 'https://www.fiserv.com/en/about-us/careers.html',
    description:
      'Fiserv provides payment processing and core banking technology for thousands of financial institutions globally. SRE teams in Noida and Gurugram ensure high availability of electronic funds transfers and merchant acquiring.',
    requiredSkills: [
      'Core Banking Switch Infrastructure',
      'Linux Server Administration & Clustering',
      'Kubernetes & Docker Deployment',
      'CI/CD Pipelines (Jenkins / GitOps)',
      'Disaster Recovery Planning & Execution',
      'High-Availability Database Management'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 95,
      strengths: [
        'LSEG financial production experience managing high-availability EKS clusters',
        '20+ Jenkins CI/CD pipelines across microservices with SonarQube quality gates',
        'Infrastructure as code provisioning with Terraform remote state locking'
      ],
      gaps: ['Fiserv DNA / Premier core banking software specifics'],
      lsegAdvantage:
        'Financial audit rigor and disaster recovery experience directly meet banking client requirements.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-fiserv-live-1',
        title: 'DevOps Engineer II - Financial Processing Platform',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.fiserv.com/en/about-us/careers.html',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-fis',
    company: 'FIS',
    title: 'Senior Cloud Operations & SRE Specialist - Capital Markets Tech',
    domain: 'fisglobal.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=fisglobal.com&sz=128',
    ats: 'direct',
    category: 'Fintech',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Udyog Vihar Phase IV, Gurugram, Delhi NCR',
    sector: 'Fintech',
    type: 'Hybrid',
    workModel: 'Hybrid (Udyog Vihar)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹25L - ₹40L',
    url: 'https://careers.fisglobal.com/',
    description:
      'FIS (Fidelity National Information Services) advances the way the world pays, banks and invests. Gurugram center powers capital markets trading technology, clearing and risk operations for tier-1 investment banks.',
    requiredSkills: [
      'Capital Markets Cloud Infrastructure (AWS/Azure)',
      'Kubernetes & Container Reliability',
      'Linux Kernel Tuning & Low-Latency Networking',
      'Automated Testing & Release Engineering',
      'Prometheus, Grafana & Datadog Monitoring',
      'Disaster Recovery Drills'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 96,
      strengths: [
        'Direct background in capital markets infrastructure from London Stock Exchange Group',
        'Route 53 GSLB automated failover across multi-region deployments',
        'JMeter performance testing simulating 500+ users to identify trade latency bottlenecks'
      ],
      gaps: ['FIS Cleared Derivatives proprietary software stack'],
      lsegAdvantage:
        'LSEG and FIS operate in identical capital markets domains, ensuring seamless engineering transition.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-fis-live-1',
        title: 'Cloud Infrastructure Systems Engineer',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.fisglobal.com/',
        vectorScore: 95
      }
    ]
  },

  // ==========================================
  // CONSUMER (12 Companies)
  // ==========================================
  {
    id: 'ncr-zomato',
    company: 'Zomato',
    title: 'Senior Site Reliability Engineer - Peak Order Surge & Food Delivery Core',
    domain: 'zomato.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=zomato.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Ground Floor, Tower C, Pioneer Urban Square, Golf Course Ext Rd, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid / On-site (Gurugram HQ)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹35L - ₹60L + ESOPs',
    url: 'https://www.zomato.com/careers',
    description:
      'Zomato Gurugram headquarters engineers food ordering and delivery systems handling millions of concurrent orders during New Years Eve and IPL match spikes. SRE role owns Kubernetes cluster autoscaling, microservices resilience, and multi-AZ latency management.',
    requiredSkills: [
      'High-Scale Consumer E-Commerce Traffic Surge Management',
      'Kubernetes (EKS) Horizontal Pod Autoscaler & Node Scaling',
      'AWS Route 53 GSLB & Ingress Controller Tuning',
      'NGINX Reverse Proxy, SSL Offload & Rate Limiting',
      'Distributed Caching (Redis) & Kafka Telemetry',
      'Chaos Engineering & Chaos Mesh Disaster Testing'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 99,
      experienceMatch: 96,
      domainMatch: 98,
      strengths: [
        'Production lifecycle ownership of 3 EKS clusters sustaining 99.9%+ availability at LSEG',
        'Configured NGINX reverse proxy with SSL termination and DDoS rate-limiting',
        'Built JMeter load testing framework simulating 500+ concurrent user surges'
      ],
      gaps: ['Dynamic rider dispatch geospatial database indexing optimizations'],
      lsegAdvantage:
        'Operating zero-downtime financial platforms under peak market hours translates directly to handling high-concurrency food delivery spikes.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-zomato-live-1',
        title: 'Site Reliability Engineer II - High-Scale Microservices & AWS EKS',
        location: 'Gurugram, Delhi NCR',
        type: 'On-site',
        url: 'https://www.zomato.com/careers',
        vectorScore: 98
      },
      {
        id: 'ncr-zomato-live-2',
        title: 'DevOps Engineer - Observability & Real-Time Logistics Routing',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.zomato.com/careers',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-blinkit',
    company: 'Blinkit',
    title: 'Staff Infrastructure Engineer - Quick Commerce & Dark Store Dispatch Cloud',
    domain: 'blinkit.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=blinkit.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Pioneer Urban Square, Sector 62, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Pioneer Square)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹36L - ₹58L + ESOPs',
    url: 'https://blinkit.com/careers',
    description:
      'Blinkit (Zomato Group) operates Indias largest instant commerce platform delivering groceries in 10 minutes. Infrastructure team powers thousands of dark stores, picking apps, and real-time inventory synchronization.',
    requiredSkills: [
      'Sub-Second Inventory Synchronization Infrastructure',
      'Kubernetes Multi-Cluster Orchestration',
      'High-Availability Event Streaming with Kafka',
      'Terraform Cloud Automation',
      'Observability & Datadog APM Dashboards',
      'Zero-Downtime Microservices Deployments'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Amazon EKS cluster operations with node cordon/drain cycles and zero downtime rollouts',
        'Built automated LLM triage pipeline resolving incident classification in seconds',
        'Terraform modules for rapid provisioning across dev, staging and prod environments'
      ],
      gaps: ['Dark store local edge network failover setups'],
      lsegAdvantage:
        'Financial market high-speed matching mindset mirrors quick-commerce sub-10-minute dispatch urgency.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-blinkit-live-1',
        title: 'Lead SRE - 10-Minute Fulfillment High-Availability Platform',
        location: 'Gurugram, Delhi NCR',
        type: 'On-site',
        url: 'https://blinkit.com/careers',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-makemytrip',
    company: 'MakeMyTrip',
    title: 'Lead DevOps & Cloud Engineer - Travel Search & Booking Engines',
    domain: 'makemytrip.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=makemytrip.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'MakeMyTrip Tower, DLF Cyber City, Sector 25A, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City Tower)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹48L',
    url: 'https://careers.makemytrip.com/',
    description:
      'MakeMyTrip is Indias leading online travel company. Engineering teams in DLF Cyber City operate flight search caches, hotel booking engines, and holiday package microservices with millions of daily queries.',
    requiredSkills: [
      'High-Concurrency Search & Caching Platforms',
      'AWS Cloud Architecture & Kubernetes (EKS)',
      'CI/CD Pipelines (Jenkins / GitHub Actions)',
      'Terraform Infrastructure-as-Code',
      'Prometheus, Grafana & ELK Observability',
      'DDoS & Bot Mitigation'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Hardened production security against DDoS and scraper bot traffic at LSEG',
        'Route 53 GSLB multi-region routing and zero-downtime rolling upgrades',
        'JMeter performance testing simulating 500+ concurrent search queries'
      ],
      gaps: ['Global Distribution System (Amadeus/Sabre) API caching strategies'],
      lsegAdvantage:
        'Financial market high-concurrency order book experience translates seamlessly to real-time travel search inventory.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-mmt-live-1',
        title: 'Senior SRE - High-Concurrency Flight & Hotel Search Cache',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.makemytrip.com/',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-goibibo',
    company: 'Goibibo',
    title: 'Senior DevOps Engineer - Bus, Train & Flight Booking Infrastructure',
    domain: 'goibibo.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=goibibo.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'DLF Cyber City, Phase II, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://www.goibibo.com/careers/',
    description:
      'Goibibo (part of MakeMyTrip Group) powers mobile-first booking for trains, buses, and flights across Tier-2/3 India. Cloud platform focuses on high availability during holiday rush seasons.',
    requiredSkills: [
      'AWS Cloud Infrastructure & EKS Scaling',
      'Automated CI/CD Delivery Pipelines',
      'Terraform Multi-Environment Provisioning',
      'NGINX API Ingress & Traffic Management',
      'Linux Server Hardening & Kernel Tuning',
      'Datadog / NewRelic APM'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Maintained 20+ Jenkins CI/CD pipelines across 6-7 services with zero-regression gates',
        'Configured NGINX as reverse proxy with SSL termination and rate limiting',
        'Hands-on AWS certified with deep VPC, Route 53, and IAM expertise'
      ],
      gaps: ['IRCTC train booking synchronization APIs'],
      lsegAdvantage:
        'Proven uptime track record in mission-critical environments.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-goibibo-live-1',
        title: 'Cloud Infrastructure Engineer - Microservices Resilience',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.goibibo.com/careers/',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-ixigo',
    company: 'Ixigo',
    title: 'Senior DevOps / Platform Engineer - Train Running Status & Mass Concurrency',
    domain: 'ixigo.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=ixigo.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Sector 44, Institutional Area, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 44)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹26L - ₹42L',
    url: 'https://www.ixigo.com/careers',
    description:
      'Ixigo (Le Travenues Technology) is Indias leading AI-based travel app powering train status tracking, PNR prediction, and flight booking for 100M+ active users. SRE team handles massive peak loads during Tatkal hours.',
    requiredSkills: [
      'Mass Concurrency Peak Traffic Management (Tatkal Rush)',
      'Kubernetes (EKS) Auto-Scaling & Spot Instance Optimization',
      'Terraform Infrastructure-as-Code',
      'Redis Distributed Caching Architecture',
      'Observability (Prometheus, Grafana, Loki)',
      'Python & Shell Scripting'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Amazon EKS cluster version upgrades and rolling patches with zero downtime at LSEG',
        'JMeter performance simulation of 500+ concurrent sessions',
        'Automated Python tooling for incident analysis and triage'
      ],
      gaps: ['Crowdsourced train GPS data ingestion pipelines'],
      lsegAdvantage:
        'Experience handling extreme traffic spikes during financial market opening/closing bells mirrors Tatkal booking surges.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-ixigo-live-1',
        title: 'Site Reliability Engineer - Real-Time Travel Intelligence',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.ixigo.com/careers',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-delhivery',
    company: 'Delhivery',
    title: 'Principal Platform Engineer - Supply Chain Logistics & Fleet Telematics',
    domain: 'delhivery.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=delhivery.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Plot 5, Sector 44, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 44 HQ)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹34L - ₹54L + ESOPs',
    url: 'https://www.delhivery.com/careers',
    description:
      'Delhivery is Indias largest fully-integrated logistics provider. Gurugram engineering team builds real-time package sortation software, automated routing algorithms, and IoT telematics pipelines processing tens of millions of packages.',
    requiredSkills: [
      'Large-Scale Distributed Systems & IoT Telematics',
      'Kubernetes Multi-Cluster Management',
      'Kafka Event Streaming & High-Throughput Ingestion',
      'Terraform Cloud Automation (AWS)',
      'High-Availability Database Engineering (Postgres/Cassandra)',
      'Linux Networking & Infrastructure Security'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Production lifecycle management of 3 EKS clusters across financial workloads',
        'Route 53 GSLB multi-region failover and DNS routing policies',
        'Authored reusable Terraform modules cutting provisioning times by 40%'
      ],
      gaps: ['Computer vision package dimensioning system integration'],
      lsegAdvantage:
        'LSEG financial tracking accuracy translates directly to zero-loss parcel tracking requirements.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-delhivery-live-1',
        title: 'Senior DevOps Engineer - Automated Sortation Cloud Services',
        location: 'Gurugram, Delhi NCR',
        type: 'On-site',
        url: 'https://www.delhivery.com/careers',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-urbancompany',
    company: 'Urban Company',
    title: 'Senior Site Reliability Engineer - On-Demand Services Dispatch Platform',
    domain: 'urbancompany.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=urbancompany.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Plot 19, Udyog Vihar Phase IV, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Udyog Vihar HQ)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹52L + ESOPs',
    url: 'https://www.urbancompany.com/careers',
    description:
      'Urban Company is Asias largest home services marketplace operating across India, UAE, Singapore, and Australia. SRE team operates real-time partner matching, dynamic pricing microservices, and multi-region AWS cloud infrastructure.',
    requiredSkills: [
      'Kubernetes Multi-Cluster Operations (EKS)',
      'AWS Infrastructure-as-Code with Terraform',
      'Zero-Downtime CI/CD Rollouts (ArgoCD / GitOps)',
      'Datadog APM, Prometheus & Grafana Monitoring',
      'API Gateway Routing, Rate Limiting & NGINX',
      'Python Automation & Incident Remediation'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Built GitOps CD workflows with ArgoCD and GitHub Actions with automated rollback',
        'Remediated Zip Bomb and DDoS vectors with NGINX rate-limiting',
        'Instrumented Datadog and Prometheus custom dashboards with proactive alerting'
      ],
      gaps: ['Geofencing geospatial query optimizations'],
      lsegAdvantage:
        'Zero-downtime operational discipline ensures smooth real-time service booking experiences.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-uc-live-1',
        title: 'Staff DevOps Engineer - Core Platform & Multi-Region AWS',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.urbancompany.com/careers',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-cars24',
    company: 'Cars24',
    title: 'Lead DevOps Engineer - Auto E-Commerce & Real-Time Auction Engine',
    domain: 'cars24.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=cars24.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Cars24 Tower, Sector 32, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 32 Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹48L',
    url: 'https://www.cars24.com/careers/',
    description:
      'Cars24 operates Indias leading auto-tech platform with live online dealer auctions, consumer vehicle sales, and financing. Platform team maintains high-concurrency websocket auction infrastructure.',
    requiredSkills: [
      'Real-Time WebSocket & Auction Engine Reliability',
      'Kubernetes Cluster Architecture & Autoscaling',
      'Kafka Event Streams & Data Pipelines',
      'Terraform Multi-Cloud Automation',
      'Observability & Incident Management',
      'Linux Performance Optimization'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Experience with high-frequency financial telemetry and matching engines at LSEG',
        'Route 53 GSLB multi-region failover and health checking',
        'Terraform modules across dev, staging and prod environments'
      ],
      gaps: ['Car inspection video streaming cloud transcoder architecture'],
      lsegAdvantage:
        'Real-time financial exchange background maps directly to live vehicle auction order matching.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-cars24-live-1',
        title: 'Senior Infrastructure Engineer - Kubernetes & Kafka Streaming',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.cars24.com/careers/',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-oyo',
    company: 'OYO',
    title: 'Senior Site Reliability Engineer - Global Hospitality Inventory Cloud',
    domain: 'oyorooms.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=oyorooms.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Spaze Palazo, Sector 69, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 69)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹46L',
    url: 'https://www.oyorooms.com/careers',
    description:
      'OYO operates a global hospitality network with millions of rooms across 35+ countries. Gurugram engineering team builds automated room pricing engines, channel manager synchronization, and hotelier mobile platforms.',
    requiredSkills: [
      'Global Multi-Region Cloud Infrastructure (AWS)',
      'Kubernetes Cluster Operations & EKS',
      'Dynamic Pricing Caching & Microservices Ingress',
      'Terraform Infrastructure-as-Code',
      'Prometheus, Grafana & Datadog Monitoring',
      'Cost Optimization (FinOps) on Cloud'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Amazon EKS cluster version upgrades with zero downtime',
        'AWS VPC, IAM least privilege, and Route 53 multi-region routing',
        'Automated CI/CD pipelines reducing deployment friction'
      ],
      gaps: ['OTA (Online Travel Agent) OTA protocol synchronizers'],
      lsegAdvantage:
        'LSEG production uptime culture aligns with global 24/7 hotel guest booking demands.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-oyo-live-1',
        title: 'DevOps Specialist - Dynamic Pricing & Microservices Infrastructure',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.oyorooms.com/careers',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-lenskart',
    company: 'Lenskart',
    title: 'Lead Cloud Infrastructure Engineer - Omnichannel Retail & Computer Vision Platform',
    domain: 'lenskart.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=lenskart.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'DLF Cyber City / Vatika Mindscapes, Gurugram & New Delhi, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹50L + ESOPs',
    url: 'https://lenskart.com/careers',
    description:
      'Lenskart operates 2,000+ omnichannel eyewear stores and automated mega-factories in Delhi NCR. Cloud platform team handles 3D virtual try-on, supply chain automation, and store POS synchronization.',
    requiredSkills: [
      'Omnichannel Retail Cloud Infrastructure',
      'Kubernetes (EKS) & Microservices Scalability',
      'Computer Vision Model Serving Infrastructure',
      'CI/CD Pipeline Automation & GitOps',
      'Terraform Cloud Provisioning',
      'Observability & Datadog APM'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Full lifecycle ownership of 3 EKS clusters sustaining 99.9%+ uptime',
        'Configured NGINX reverse proxy with SSL termination and rate limiting',
        'Authored Terraform modules with remote state and locking'
      ],
      gaps: ['Robotic factory PLC edge networking protocols'],
      lsegAdvantage:
        'High-availability platform engineering ensures continuous store and online checkout availability.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-lenskart-live-1',
        title: 'DevOps Lead - Automated Factory & Retail Fulfillment Systems',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://lenskart.com/careers',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-shiprocket',
    company: 'Shiprocket',
    title: 'Senior Site Reliability Engineer - Multi-Courier API Aggregator & Tracking Engine',
    domain: 'shiprocket.in',
    companyLogo: 'https://www.google.com/s2/favicons?domain=shiprocket.in&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Plot 416, Udyog Vihar Phase III, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (Udyog Vihar)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://www.shiprocket.in/careers/',
    description:
      'Shiprocket is Indias largest e-commerce logistics aggregator shipping for 300,000+ D2C brands. Platform handles courier rate calculators, automated label generation, and order tracking APIs with massive throughput.',
    requiredSkills: [
      'High-Throughput API Gateway Architecture',
      'Kubernetes Scaling & Microservices Resiliency',
      'AWS EKS, Route 53 & Elasticache Redis',
      'Terraform Infrastructure-as-Code',
      'Incident Triage Automation & Runbooks',
      'Observability with Datadog & Prometheus'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Built Claude-API incident triage service reducing MTTD by 60%',
        'Maintained 20+ Jenkins CI/CD pipelines across 7 microservices',
        'Engineered Route 53 GSLB multi-region failover sustaining 99.9%+ uptime'
      ],
      gaps: ['Carrier webhooks jitter smoothing protocols'],
      lsegAdvantage:
        'Operating financial services platforms ensures rock-solid order dispatch accuracy.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-shiprocket-live-1',
        title: 'Lead DevOps Engineer - High-Concurrency Shipping Labels Pipeline',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.shiprocket.in/careers/',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-snapdeal',
    company: 'Snapdeal',
    title: 'Senior Infrastructure Engineer - E-Commerce Catalog & Checkout Platforms',
    domain: 'snapdeal.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=snapdeal.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'ASF Centre, Udyog Vihar Phase IV, Gurugram, Delhi NCR',
    sector: 'Consumer',
    type: 'Hybrid',
    workModel: 'Hybrid (ASF Centre)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹24L - ₹38L',
    url: 'https://www.snapdeal.com/info/careers',
    description:
      'Snapdeal operates value e-commerce for Bharat across Tier-2/3/4 towns in India. Infrastructure engineering focuses on catalog search scaling, checkout reliability, and cloud cost efficiency.',
    requiredSkills: [
      'Kubernetes & Linux Systems Administration',
      'AWS Cloud Optimization (FinOps)',
      'CI/CD Automation with Jenkins / GitOps',
      'Elasticsearch & Database Cluster Health',
      'Prometheus, Grafana & Datadog Monitoring',
      'DDoS Mitigation & Security'
    ],
    vectorScore: 93,
    matchBreakdown: {
      overall: 93,
      skillsMatch: 94,
      experienceMatch: 91,
      domainMatch: 93,
      strengths: [
        'AWS Certified with hands-on Amazon EKS production lifecycle management',
        'Remediated Zip Bomb and DDoS attack vectors with WAF rate limiting',
        'Elasticsearch log streams correlation and monitoring experience'
      ],
      gaps: ['Large-scale Cassandra ring rebalancing'],
      lsegAdvantage:
        'LSEG financial compliance mindset prevents data leakage and ensures safe release gates.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-snapdeal-live-1',
        title: 'DevOps Engineer - Kubernetes & Distributed Storage',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.snapdeal.com/info/careers',
        vectorScore: 93
      }
    ]
  },

  // ==========================================
  // SAAS (9 Companies)
  // ==========================================
  {
    id: 'ncr-innovaccer',
    company: 'Innovaccer',
    title: 'Senior DevOps / SRE Engineer - Healthcare Data Activation Platform',
    domain: 'innovaccer.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=innovaccer.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Candor TechSpace, Sector 62, Noida, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 62 Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹52L + Stock',
    url: 'https://innovaccer.com/careers',
    description:
      'Innovaccer builds the leading healthcare Data Activation Platform (DAP) connecting 50M+ patient records across US health systems. Noida team leads HIPAA-compliant Kubernetes orchestration, FHIR data pipelines, and AWS/Azure cloud security.',
    requiredSkills: [
      'HIPAA / SOC-2 Compliant Cloud Architecture',
      'Kubernetes Multi-Cluster Orchestration (EKS/AKS)',
      'Terraform Module Design with IAM Least Privilege',
      'CI/CD Pipeline Security & Container Vulnerability Scans',
      'Datadog, Prometheus & Audit Trail Telemetry',
      'Python & Bash Automation'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Operated under strict financial compliance and regulatory audit rigor at LSEG',
        'Terraform modules with IAM least-privilege controls saving 40% deployment time',
        'Hardened production security against DDoS & Zip Bomb attack vectors'
      ],
      gaps: ['US Healthcare FHIR / HL7 data format specifics'],
      lsegAdvantage:
        'LSEG financial compliance rigor directly satisfies US healthcare HIPAA and HITRUST requirements.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-innovaccer-live-1',
        title: 'Site Reliability Engineer - HIPAA-Compliant Multi-Cloud Kubernetes',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://innovaccer.com/careers',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-moglix',
    company: 'Moglix',
    title: 'Lead Platform Engineer - B2B Industrial E-Procurement Cloud',
    domain: 'moglix.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=moglix.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Sector 63 / Sector 62, Noida, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida Sector 63)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://www.moglix.com/careers',
    description:
      'Moglix is an industrial B2B commerce and supply chain SaaS unicorn backed by Tiger Global and Accel. Engineering team operates enterprise procurement microservices, catalog APIs, and vendor financing systems.',
    requiredSkills: [
      'Enterprise SaaS Microservices Architecture',
      'Kubernetes (EKS) Production Operations',
      'AWS Cloud Networking & Security Hardening',
      'Terraform Multi-Environment Provisioning',
      'Jenkins & GitHub Actions CI/CD',
      'Observability with Datadog & ELK'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Amazon EKS cluster version upgrades and rolling patches with zero downtime at LSEG',
        'Maintained 20+ automated CI/CD pipelines across microservices',
        'SonarQube test coverage enforcement raising coverage to 90%'
      ],
      gaps: ['SAP/Oracle ERP punchout catalog integration protocols'],
      lsegAdvantage:
        'Corporate transactional integrity translates directly into enterprise B2B procurement workflows.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-moglix-live-1',
        title: 'Senior DevOps Engineer - Supply Chain SaaS Microservices',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.moglix.com/careers',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-nagarro',
    company: 'Nagarro',
    title: 'Principal Cloud & DevOps Architect - Digital Product Engineering',
    domain: 'nagarro.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=nagarro.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Nagarro Campus, Udyog Vihar Phase IV, Gurugram, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid / Remote (Gurugram Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹48L',
    url: 'https://www.nagarro.com/en/careers',
    description:
      'Nagarro (Frankfurt Stock Exchange listed) delivers digital product engineering and cloud modernization for global leaders across banking, automotive, and aviation. Gurugram center is Nagarros global R&D flagship.',
    requiredSkills: [
      'Enterprise Cloud Modernization (AWS/Azure/GCP)',
      'Kubernetes Cluster Architecture & Migration',
      'GitOps (ArgoCD) & Infrastructure-as-Code (Terraform)',
      'Site Reliability Engineering & SLA Management',
      'Security Compliance & Zero-Trust Architecture',
      'Observability & Incident Response'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Hands-on dual certification preparation (AWS + Azure AZ-900 & AI-900)',
        'ArgoCD GitOps pipeline automation with automated rollback triggers',
        'Terraform modules for infrastructure provisioning across 4 environments'
      ],
      gaps: ['Legacy mainframe-to-cloud rehosting methodologies'],
      lsegAdvantage:
        'LSEG financial platform delivery experience provides the high credibility needed for international enterprise clients.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-nagarro-live-1',
        title: 'Staff SRE - Kubernetes & Cloud Modernization',
        location: 'Gurugram, Delhi NCR',
        type: 'Remote',
        url: 'https://www.nagarro.com/en/careers',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-ciena',
    company: 'Ciena',
    title: 'Senior Software Engineer - Blue Planet SDN Orchestration & Cloud Native SRE',
    domain: 'ciena.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=ciena.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Cyber City / Sector 25, Gurugram, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹48L',
    url: 'https://www.ciena.com/about/careers',
    description:
      'Ciena Gurugram R&D center is central to Blue Planet intelligent network automation and software-defined networking (SDN) orchestrating cloud infrastructure for global telecom carriers.',
    requiredSkills: [
      'Cloud-Native Networking & Kubernetes Clustering',
      'Software-Defined Networking (SDN) & Linux Networking',
      'Docker, Helm & Microservices Packaging',
      'CI/CD Pipeline Automation & Automated Testing',
      'Python & Shell Systems Programming',
      'Telemetry & High-Availability Operations'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Linux systems administration, networking protocols and packet routing',
        'Route 53 GSLB multi-region failover and DNS routing policies',
        'Built rule-based platform readiness validation service for Kubernetes'
      ],
      gaps: ['Optical transport and DWDM telecom protocols'],
      lsegAdvantage:
        'High-reliability network failover experience at LSEG directly supports telecom 99.999% availability standards.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-ciena-live-1',
        title: 'DevOps Specialist - Telecommunications Cloud Automation',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.ciena.com/about/careers',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-publicissapient',
    company: 'Publicis Sapient',
    title: 'Senior Cloud & Platform Engineer - Enterprise Digital Transformation',
    domain: 'publicissapient.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=publicissapient.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Sapient Campus, Sector 21, Gurugram & Sector 62, Noida, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid (Gurugram / Noida)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://careers.publicissapient.com/',
    description:
      'Publicis Sapient engineers digital transformation and platform modernizations for global banking, retail and energy conglomerates. Gurugram and Noida campuses lead enterprise cloud engineering.',
    requiredSkills: [
      'Multi-Cloud Architecture (AWS / Azure)',
      'Kubernetes Multi-Cluster Orchestration',
      'Terraform Infrastructure-as-Code',
      'GitOps CI/CD Pipelines (GitHub Actions / Jenkins)',
      'Observability & Distributed Tracing',
      'Site Reliability Best Practices'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'AWS Certified with Azure Fundamentals (AZ-900) and Azure AI (AI-900)',
        'Authored reusable Terraform modules across 4 environments',
        'Instrumented Datadog and Prometheus custom dashboards with proactive alerts'
      ],
      gaps: ['Broad multi-client consulting lifecycle transitions'],
      lsegAdvantage:
        'Tier-1 financial services background matches Publicis Sapients largest financial client accounts.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-ps-live-1',
        title: 'Lead SRE - Multi-Tenant Kubernetes & FinOps',
        location: 'Gurugram / Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.publicissapient.com/',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-confluent',
    company: 'Confluent',
    title: 'Staff Systems Reliability Engineer - Confluent Cloud Apache Kafka SaaS',
    domain: 'confluent.io',
    companyLogo: 'https://www.google.com/s2/favicons?domain=confluent.io&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'DLF Cyber City, Gurugram, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid / Remote (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹45L - ₹75L + RSUs',
    url: 'https://www.confluent.io/careers/',
    description:
      'Confluent (founded by the creators of Apache Kafka) sets data in motion. Gurugram SRE team operates Confluent Cloud, managing tens of thousands of Kafka brokers and stream processors across AWS, Azure and GCP.',
    requiredSkills: [
      'Apache Kafka & Distributed Event Streaming',
      'Kubernetes Custom Resource Definitions (CRDs) & Operators',
      'Multi-Cloud Cloud Networking & VPC Peering',
      'Linux Kernel Disk I/O & Network Buffer Tuning',
      'Disaster Recovery & Cluster Replication (Cluster Linking)',
      'Go & Python Platform Automation'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Financial market high-throughput real-time data streaming experience at LSEG',
        'Amazon EKS cluster version upgrades with zero downtime',
        'Linux kernel tuning for high packet throughput and low latency'
      ],
      gaps: ['Low-level Java Kafka broker source-level memory profiler internals'],
      lsegAdvantage:
        'High-frequency financial telemetry experience provides immediate domain synergy with Confluents event-driven data streaming.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-confluent-live-1',
        title: 'Senior SRE - Event Streaming & Multi-Cloud Infrastructure',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.confluent.io/careers/',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-elastic',
    company: 'Elastic',
    title: 'Senior Site Reliability Engineer - Elasticsearch Service (ESS) & Cloud Ops',
    domain: 'elastic.co',
    companyLogo: 'https://www.google.com/s2/favicons?domain=elastic.co&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Gurugram & Delhi NCR (Distributed / Remote)',
    sector: 'SaaS',
    type: 'Remote',
    workModel: 'Remote / Hybrid (Delhi NCR)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹42L - ₹70L + RSUs',
    url: 'https://www.elastic.co/careers/',
    description:
      'Elastic is the search analytics and observability company behind Elasticsearch, Kibana, Beats, and Logstash. SRE team operates Elastic Cloud (ESS) running tens of petabytes of distributed search data on public clouds.',
    requiredSkills: [
      'Elasticsearch Distributed Cluster Architecture & Shard Allocation',
      'Kubernetes Operators & Cloud Native Automation',
      'Linux Kernel Memory Management & Garbage Collection Tuning',
      'Multi-Cloud Networking & Zero-Trust Security',
      'Site Reliability Engineering & SLO/SLA Governance',
      'Go & Python Automation'
    ],
    vectorScore: 98,
    matchBreakdown: {
      overall: 98,
      skillsMatch: 99,
      experienceMatch: 96,
      domainMatch: 98,
      strengths: [
        'Built LLM incident triage engine ingesting Elasticsearch log streams and Datadog alerts',
        'Production lifecycle management of 3 Amazon EKS clusters with zero-downtime upgrades',
        'Deep expertise with Datadog, Prometheus, Grafana, and Elasticsearch observability stacks'
      ],
      gaps: ['Lucene index segment merge low-level internal debugging'],
      lsegAdvantage:
        'Direct experience building production LLM triage pipelines directly against Elasticsearch clusters at LSEG.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-elastic-live-1',
        title: 'Cloud Systems Engineer - Elastic Observability Platform',
        location: 'Delhi NCR / Remote',
        type: 'Remote',
        url: 'https://www.elastic.co/careers/',
        vectorScore: 98
      }
    ]
  },
  {
    id: 'ncr-servicenow',
    company: 'ServiceNow',
    title: 'Senior Cloud Infrastructure Engineer - Now Platform SRE',
    domain: 'servicenow.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=servicenow.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Candor TechSpace, Sector 48, Gurugram, Delhi NCR',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 48)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹36L - ₹58L + RSUs',
    url: 'https://careers.servicenow.com/',
    description:
      'ServiceNows Gurugram development center powers core workflows of the Now Platform, managing thousands of dedicated enterprise cloud instances, database automation, and AI incident triage systems.',
    requiredSkills: [
      'Enterprise Cloud Infrastructure Reliability',
      'Kubernetes & Linux Systems Operations',
      'Database Scaling & Replication (MySQL/MariaDB)',
      'CI/CD Pipeline Security & Zero-Downtime Rollouts',
      'Automated Incident Management & Telemetry',
      'Python & Bash Scripting'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Built LLM-Powered incident triage engine directly matching ServiceNow ITSM AIOps vision',
        'Root-cause analysis leadership and author of incident post-mortems at LSEG',
        'Automated CI/CD pipelines across microservices with automated quality gates'
      ],
      gaps: ['Now Platform proprietary Glide record JavaScript runtime'],
      lsegAdvantage:
        'Enterprise ITIL incident response and financial post-mortem rigor matches ServiceNows enterprise customer expectations.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-snow-live-1',
        title: 'Site Reliability Engineer - Global Cloud Datacenters',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://careers.servicenow.com/',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-freshworks',
    company: 'Freshworks',
    title: 'Lead DevOps Engineer - Freshdesk & Neo Platform Infrastructure',
    domain: 'freshworks.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=freshworks.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Golf Course Ext Rd, Gurugram & Delhi NCR (Hybrid)',
    sector: 'SaaS',
    type: 'Hybrid',
    workModel: 'Hybrid (Golf Course Ext Rd)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹50L + RSUs',
    url: 'https://www.freshworks.com/company/careers/',
    description:
      'Freshworks (NASDAQ: FRSH) makes business software for customer support, IT service management and sales. Platforms team maintains multi-region AWS EKS clusters powering 60,000+ businesses.',
    requiredSkills: [
      'Multi-Tenant SaaS Infrastructure on AWS',
      'Kubernetes (EKS) Production Operations',
      'Terraform Infrastructure-as-Code',
      'CI/CD GitHub Actions & Spinnaker',
      'Datadog Full-Stack Observability',
      'DDoS Mitigation & Cloud Security'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Production lifecycle ownership of 3 Amazon EKS clusters with zero downtime rollouts',
        'Route 53 GSLB multi-region failover ensuring 99.9%+ availability',
        'Terraform modules for infrastructure provisioning across 4 environments'
      ],
      gaps: ['Ruby on Rails unicorn backend process telemetry specifics'],
      lsegAdvantage:
        'High-availability cloud operations directly translate to Freshworks 99.9% uptime SLA commitments.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-freshworks-live-1',
        title: 'Senior SRE - Multi-Tenant SaaS Scalability & AWS EKS',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.freshworks.com/company/careers/',
        vectorScore: 96
      }
    ]
  },

  // ==========================================
  // INFRA / AI (10 Companies)
  // ==========================================
  {
    id: 'ncr-samsung',
    company: 'Samsung R&D',
    title: 'Lead Engineer - 5G Core, Edge AI Cloud & Systems Engineering',
    domain: 'samsung.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=samsung.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Samsung R&D Institute India - Noida (SRI-N), Sector 126, Noida, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 126 Campus)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹30L - ₹50L',
    url: 'https://research.samsung.com/sri-n',
    description:
      'Samsung R&D Institute India Noida (SRI-N) is a premier global software R&D hub for Samsung Electronics, driving 5G telecom network orchestration, edge cloud computing, on-device AI pipelines, and SmartThings IoT infrastructure.',
    requiredSkills: [
      'Linux Kernel Systems Programming & Embedded Linux',
      'Edge Kubernetes & Cloud-Native Container Orchestration',
      'Distributed Systems & 5G Core Infrastructure',
      'Python, C++ & Shell Scripting',
      'CI/CD Pipeline Automation & Automated Validation',
      'Observability & High-Reliability Systems'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Linux systems administration, kernel tuning, and network socket programming',
        'Built rule-based pre-deployment validation platform for Kubernetes',
        'Simulated 500+ concurrent user traffic with JMeter uncovering bottleneck latencies'
      ],
      gaps: ['Embedded ARM / Tizen RTOS device firmware debugging'],
      lsegAdvantage:
        'Proven record maintaining 99.9%+ availability on Linux clusters directly supports Samsons telco-grade carrier reliability.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-samsung-live-1',
        title: 'Senior Platform Engineer - Embedded Linux & On-Device AI Pipelines',
        location: 'Noida, Delhi NCR',
        type: 'On-site',
        url: 'https://research.samsung.com/sri-n',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-ericsson',
    company: 'Ericsson',
    title: 'Principal Cloud Infrastructure Engineer - Cloud RAN & Telecom NFV Infrastructure',
    domain: 'ericsson.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=ericsson.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Ericsson India R&D, Sector 62, Noida & Sector 44, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹46L',
    url: 'https://www.ericsson.com/en/careers',
    description:
      'Ericssons R&D centers in Noida and Gurugram develop Cloud RAN, 5G Core network functions virtualization (NFV), and bare-metal Kubernetes container platforms powering mobile operators across 180 countries.',
    requiredSkills: [
      'Cloud RAN & Telecom Cloud Native Infrastructure',
      'Kubernetes Bare-Metal Cluster Management',
      'Linux Networking (SR-IOV, DPDK, OVS) & Packet Processing',
      'CI/CD Automation with Jenkins & Gerrit',
      'Terraform & Infrastructure-as-Code',
      'High-Availability 99.999% Telecom SRE Operations'
    ],
    vectorScore: 95,
    matchBreakdown: {
      overall: 95,
      skillsMatch: 96,
      experienceMatch: 93,
      domainMatch: 95,
      strengths: [
        'Amazon EKS cluster version upgrades and rolling patches with zero downtime at LSEG',
        '20+ Jenkins CI/CD pipelines across microservices with automated release gates',
        'Route 53 GSLB automated failover architecture'
      ],
      gaps: ['Telecom 3GPP standards (gNodeB / AMF / UPF protocols)'],
      lsegAdvantage:
        'LSEG financial SLA precision aligns with Ericssons five-nines (99.999%) telecom availability targets.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-ericsson-live-1',
        title: 'DevOps & SRE Specialist - Kubernetes on OpenStack & 5G Core',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.ericsson.com/en/careers',
        vectorScore: 95
      }
    ]
  },
  {
    id: 'ncr-nokia',
    company: 'Nokia',
    title: 'Senior DevOps / Cloud Automation Engineer - Cloud Packet Core & 5G',
    domain: 'nokia.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=nokia.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Nokia Bell Labs & R&D Center, Sector 62, Noida & Cyber City, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida Sector 62)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://www.nokia.com/about-us/careers/',
    description:
      'Nokia Bell Labs and R&D Centers in Noida and Gurugram build Cloud Packet Core, optical routing, and private 5G enterprise networks with cloud-native microservices.',
    requiredSkills: [
      'Cloud Native Infrastructure (Kubernetes/OpenStack)',
      'Linux Networking & Network Function Virtualization',
      'CI/CD Pipelines (GitLab CI / Jenkins)',
      'Terraform & Ansible Configuration Automation',
      'Prometheus, Grafana & ELK Telemetry',
      'Automated Disaster Recovery'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Production lifecycle management of 3 EKS clusters across financial workloads',
        'Hardened production security against DDoS vectors with WAF rate limiting',
        'Reusable Terraform modules across 4 environments'
      ],
      gaps: ['Nokia proprietary CBIS cloud band infrastructure software'],
      lsegAdvantage:
        'Financial exchange low-latency network tuning applies directly to packet core routing performance.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-nokia-live-1',
        title: 'Site Reliability Engineer - Telco Cloud & Kubernetes Bare-Metal',
        location: 'Noida, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.nokia.com/about-us/careers/',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-cisco',
    company: 'Cisco',
    title: 'Senior Site Reliability Engineer - Cisco ThousandEyes & AppDynamics Observability',
    domain: 'cisco.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=cisco.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Cisco Systems, DLF Cyber City, Phase II, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹36L - ₹58L + Stock',
    url: 'https://jobs.cisco.com/',
    description:
      'Cisco Gurugram development center powers enterprise networking platforms, Cisco ThousandEyes digital experience monitoring, AppDynamics cloud observability, and Webex cloud infrastructure.',
    requiredSkills: [
      'Enterprise Networking Protocols (BGP, DNS, Routing)',
      'Kubernetes Multi-Cluster Lifecycle & Helm',
      'Cloud Observability (ThousandEyes, AppDynamics, Prometheus)',
      'AWS / Multi-Cloud Cloud Automation (Terraform)',
      'Linux Systems Internals & Performance Tuning',
      'Python & Go Scripting'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Route 53 GSLB automated multi-region failover and DNS routing policies',
        'Production monitoring with Datadog and Prometheus custom dashboards and alerts',
        'Configured NGINX reverse proxy with SSL termination and rate limiting'
      ],
      gaps: ['Cisco IOS XE and Catalyst hardware switch CLI scripting'],
      lsegAdvantage:
        'Network telemetry and multi-region disaster recovery at LSEG mirror Ciscos global observability mission.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-cisco-live-1',
        title: 'Cloud Infrastructure Engineer - Networking & Hybrid Cloud Platforms',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://jobs.cisco.com/',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-juniper',
    company: 'Juniper',
    title: 'Senior DevOps Engineer - AI-Driven Enterprise & Mist Cloud Platform',
    domain: 'juniper.net',
    companyLogo: 'https://www.google.com/s2/favicons?domain=juniper.net&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Juniper Networks, Sector 44, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 44)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹34L - ₹54L',
    url: 'https://www.juniper.net/us/en/company/careers.html',
    description:
      'Juniper Networks Gurugram engineering team builds AI-Native networking with Mist AI, Junos OS automation, and multi-tenant cloud microservices serving Fortune 100 enterprise wireless/wired campus networks.',
    requiredSkills: [
      'Cloud-Native Networking & Kubernetes',
      'AI/ML Operations & Telemetry Ingestion',
      'AWS / GCP Cloud Infrastructure & Terraform',
      'CI/CD Pipelines & Test Automation',
      'Linux Kernel & Network Troubleshooting',
      'Python Automation Scripting'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'AWS Certified Cloud Practitioner with extensive Amazon EKS and VPC experience',
        'Built Python backend with Claude API for incident classification and runbooks',
        'Route 53 GSLB multi-region failover and health check policies'
      ],
      gaps: ['Junos OS Junoscript and NETCONF/YANG modeling specifics'],
      lsegAdvantage:
        'High-availability network routing operations at LSEG translate directly to Junipers AI-driven campus network reliability.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-juniper-live-1',
        title: 'SRE - Cloud Orchestration & Junos OS Automation',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.juniper.net/us/en/company/careers.html',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-colt',
    company: 'Colt',
    title: 'Senior Systems Reliability & Cloud Network Engineer - Global IQ Network',
    domain: 'colt.net',
    companyLogo: 'https://www.google.com/s2/favicons?domain=colt.net&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Colt Technology Services, Sector 29, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Sector 29)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹26L - ₹42L',
    url: 'https://www.colt.net/careers/',
    description:
      'Colt Technology Services operates the Colt IQ Network, connecting 1,000+ data centers and 32,000+ on-net buildings across Europe, Asia and North America. Gurugram center drives cloud SDN orchestration.',
    requiredSkills: [
      'Global WAN & Datacenter Interconnect Cloud',
      'Linux Systems Engineering & Server Virtualization',
      'Kubernetes & Docker Deployment',
      'Terraform & Ansible Automated Provisioning',
      'Network Observability & Performance Monitoring',
      'Incident Response & Post-Mortems'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Direct experience operating London Stock Exchange Group distributed platform',
        'Route 53 GSLB automated multi-region failover architecture',
        'Linux node cordon/drain and live rolling upgrades with zero downtime'
      ],
      gaps: ['European telecom dark fiber DWDM provisioning software'],
      lsegAdvantage:
        'London financial ecosystem familiarity matches Colts core European and London financial exchange interconnect clients.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-colt-live-1',
        title: 'DevOps Engineer - Software Defined Networking & Core Peering',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.colt.net/careers/',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-amdocs',
    company: 'Amdocs',
    title: 'Lead SRE / DevOps Architect - Cloud-Native Billing & Telco Microservices',
    domain: 'amdocs.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=amdocs.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Tower B, Cyber City, Sector 25, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Cyber City)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹28L - ₹45L',
    url: 'https://www.amdocs.com/careers',
    description:
      'Amdocs provides billing, customer care, and OSS/BSS software for premier communications and media providers worldwide. Gurugram center is one of Amdocs largest cloud development centers.',
    requiredSkills: [
      'Telecom Cloud-Native Architecture (AWS/Azure)',
      'Kubernetes Multi-Cluster Scaling & Management',
      'Jenkins & Spinnaker CI/CD Pipeline Automation',
      'Terraform Infrastructure-as-Code',
      'High-Availability Database Clusters',
      'Observability with Datadog & Prometheus'
    ],
    vectorScore: 94,
    matchBreakdown: {
      overall: 94,
      skillsMatch: 95,
      experienceMatch: 92,
      domainMatch: 94,
      strengths: [
        'Maintained 20+ Jenkins pipelines across 7 microservices with SonarQube gates',
        'Production lifecycle management of 3 EKS clusters across financial workloads',
        'Authored reusable Terraform modules cutting provisioning time by 40%'
      ],
      gaps: ['Amdocs CES (Customer Experience Suite) proprietary schema'],
      lsegAdvantage:
        'Financial settlement reliability experience translates seamlessly into telecommunications billing and charging accuracy.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-amdocs-live-1',
        title: 'Cloud Infrastructure Engineer - AWS & Kubernetes Migration',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://www.amdocs.com/careers',
        vectorScore: 94
      }
    ]
  },
  {
    id: 'ncr-inmobi',
    company: 'InMobi',
    title: 'Senior Platform Engineer - Real-Time Bidding (RTB) Low-Latency Infrastructure',
    domain: 'inmobi.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=inmobi.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'New Delhi',
    location: 'Aerocity & Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Aerocity / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹35L - ₹56L + ESOPs',
    url: 'https://www.inmobi.com/company/careers/',
    description:
      'InMobi is Indias first unicorn and a global leader in mobile advertising and consumer technology. Platform teams build real-time bidding (RTB) engines processing 50B+ ad requests daily with sub-50ms latency.',
    requiredSkills: [
      'Sub-50ms Real-Time Bidding (RTB) Cloud Infrastructure',
      'Kubernetes Autoscaling & Edge Cluster Optimization',
      'Distributed Caching (Aerospike / Redis) & Kafka',
      'Linux Kernel Network Tuning & Zero-Copy Packet Flow',
      'AWS / GCP Cloud Multi-Region Routing',
      'High-Scale Datadog / Prometheus Telemetry'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Financial matching engine low-latency experience at London Stock Exchange Group',
        'Route 53 GSLB automated multi-region failover architecture',
        'JMeter performance testing simulating 500+ concurrent user surges'
      ],
      gaps: ['OpenRTB 3.0 ad exchange specification nuances'],
      lsegAdvantage:
        'LSEG financial auction latency tuning translates directly to real-time ad bidding matching speed.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-inmobi-live-1',
        title: 'Staff SRE - Billions-Scale Ad Serving & Distributed Caching',
        location: 'Delhi NCR / Hybrid',
        type: 'Hybrid',
        url: 'https://www.inmobi.com/company/careers/',
        vectorScore: 97
      }
    ]
  },
  {
    id: 'ncr-glance',
    company: 'Glance',
    title: 'Senior SRE - Lock-Screen Content Delivery & Generative AI Platform',
    domain: 'glance.com',
    companyLogo: 'https://www.google.com/s2/favicons?domain=glance.com&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Noida',
    location: 'Noida & Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Noida / Gurugram)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹34L - ₹55L + ESOPs',
    url: 'https://glance.com/careers',
    description:
      'Glance (InMobi Group unicorn) delivers AI-curated live content and gaming directly on the lock-screens of 250M+ smartphones across India, Southeast Asia and the US.',
    requiredSkills: [
      'Lock-Screen Edge Delivery & Multi-CDN Routing',
      'Kubernetes Multi-Cluster Orchestration',
      'Generative AI / ML Inference Model Serving Infrastructure',
      'Terraform Infrastructure-as-Code',
      'Datadog Full-Stack Observability & Incident Response',
      'High-Throughput Distributed Systems'
    ],
    vectorScore: 96,
    matchBreakdown: {
      overall: 96,
      skillsMatch: 97,
      experienceMatch: 94,
      domainMatch: 96,
      strengths: [
        'Built LLM-Powered incident triage engine using Anthropic Claude API',
        'Production lifecycle management of 3 EKS clusters across financial workloads',
        'NGINX reverse proxy with SSL termination and DDoS rate-limiting'
      ],
      gaps: ['Direct smartphone OEM pre-load push notification gateway systems'],
      lsegAdvantage:
        'Zero-downtime operational discipline ensures seamless consumer content delivery.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-glance-live-1',
        title: 'DevOps Lead - High-Throughput Edge Streaming & ML Inference',
        location: 'Noida / Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://glance.com/careers',
        vectorScore: 96
      }
    ]
  },
  {
    id: 'ncr-fractal',
    company: 'Fractal',
    title: 'Lead MLOps & Cloud Infrastructure Engineer - Enterprise AI & LLM Systems',
    domain: 'fractal.ai',
    companyLogo: 'https://www.google.com/s2/favicons?domain=fractal.ai&sz=128',
    ats: 'direct',
    category: 'Tier-1 Product',
    hub: 'Delhi NCR',
    subRegion: 'Gurugram',
    location: 'Two Horizon Center, Golf Course Road, Gurugram, Delhi NCR',
    sector: 'Infra/AI',
    type: 'Hybrid',
    workModel: 'Hybrid (Two Horizon Center)',
    source: 'Delhi NCR Shortlist',
    compensation: '₹32L - ₹52L',
    url: 'https://fractal.ai/careers/',
    description:
      'Fractal is a global AI unicorn powering decision-making for Fortune 500 enterprises with generative AI (Flyfish), agentic AI frameworks, and big data platform engineering.',
    requiredSkills: [
      'MLOps & LLM Serving Infrastructure (vLLM, Ray, Triton)',
      'Kubernetes (EKS/AKS) GPU Cluster Management',
      'AWS / Azure Multi-Cloud Architecture',
      'Terraform Infrastructure Automation',
      'Python Agentic Workflows & Model Triage',
      'Observability & Distributed Tracing'
    ],
    vectorScore: 97,
    matchBreakdown: {
      overall: 97,
      skillsMatch: 98,
      experienceMatch: 95,
      domainMatch: 97,
      strengths: [
        'Built LLM-Powered Incident Triage & Runbook Engine using Claude API and Python',
        'Certified in Azure AI Fundamentals (AI-900) & Microsoft Azure Fundamentals (AZ-900)',
        'Amazon EKS cluster version upgrades and rolling patches with zero downtime at LSEG'
      ],
      gaps: ['Multi-node GPU NCCL distributed training cluster fabrics'],
      lsegAdvantage:
        'Practical experience building production agentic AI automation pipelines directly mirrors Fractals core AI delivery focus.'
    },
    status: 'discovered',
    liveJobs: [
      {
        id: 'ncr-fractal-live-1',
        title: 'Senior SRE - AI Agents & Distributed Model Training Clusters',
        location: 'Gurugram, Delhi NCR',
        type: 'Hybrid',
        url: 'https://fractal.ai/careers/',
        vectorScore: 97
      }
    ]
  }
];
