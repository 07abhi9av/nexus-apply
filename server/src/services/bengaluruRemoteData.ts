import type { JobOpportunity } from '../types.js';

export interface HubMeta {
  sector: 'FAANG/MNC' | 'Fintech' | 'Consumer' | 'SaaS' | 'Infra/AI';
  subRegion: string;
  location: string;
  domain?: string;
}

// 58 Curated Bengaluru Tech Hub Giants & Unicorns
export const bengaluruCompanyMeta: Record<string, HubMeta> = {
  // ==========================================
  // FAANG / MNC (15)
  // ==========================================
  Apple: {
    sector: 'FAANG/MNC',
    subRegion: 'Indiranagar & CBD',
    location: 'UB City, Vittal Mallya Rd, Bengaluru',
    domain: 'apple.com',
  },
  Uber: {
    sector: 'FAANG/MNC',
    subRegion: 'Indiranagar & CBD',
    location: '100ft Rd, Indiranagar, Bengaluru',
    domain: 'uber.com',
  },
  'Walmart Global Tech': {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Cessna Business Park, Kadubeesanahalli, ORR, Bengaluru',
    domain: 'walmart.com',
  },
  NVIDIA: {
    sector: 'FAANG/MNC',
    subRegion: 'Whitefield',
    location: 'Manyata Tech Park & Whitefield, Bengaluru',
    domain: 'nvidia.com',
  },
  'Target India': {
    sector: 'FAANG/MNC',
    subRegion: 'Whitefield',
    location: 'Manyata Tech Park, Nagavara, Bengaluru',
    domain: 'target.com',
  },
  Intuit: {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'EcoSpace Business Park, Bellandur, ORR, Bengaluru',
    domain: 'intuit.com',
  },
  'Goldman Sachs': {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Helios Business Park, Kadubeesanahalli, ORR, Bengaluru',
    domain: 'goldmansachs.com',
  },
  'JP Morgan Chase': {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Tech Park, Marathahalli-ORR, Bengaluru',
    domain: 'jpmorgan.com',
  },
  'Morgan Stanley': {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Outer Ring Road, Kadubeesanahalli, Bengaluru',
    domain: 'morganstanley.com',
  },
  PayPal: {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Futura Tech Park, Bellandur, Bengaluru',
    domain: 'paypal.com',
  },
  Visa: {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Bagmane World Technology Center, Mahadevapura, Bengaluru',
    domain: 'visa.com',
  },
  LinkedIn: {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Global Technology Park, Bellandur, Bengaluru',
    domain: 'linkedin.com',
  },
  VMware: {
    sector: 'FAANG/MNC',
    subRegion: 'Indiranagar & CBD',
    location: 'Kalyani Vista, JP Nagar, Bengaluru',
    domain: 'vmware.com',
  },
  Qualcomm: {
    sector: 'FAANG/MNC',
    subRegion: 'Outer Ring Road',
    location: 'Bagmane Constellation Park, Marathahalli-ORR, Bengaluru',
    domain: 'qualcomm.com',
  },
  'SAP Labs': {
    sector: 'FAANG/MNC',
    subRegion: 'Whitefield',
    location: 'EPIP Zone, Whitefield, Bengaluru',
    domain: 'sap.com',
  },

  // ==========================================
  // Fintech & WealthTech (13)
  // ==========================================
  PhonePe: {
    sector: 'Fintech',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Tech Park, Bellandur, Bengaluru',
    domain: 'phonepe.com',
  },
  Cred: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: '100ft Road, Indiranagar, Bengaluru',
    domain: 'cred.club',
  },
  Zerodha: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'JP Nagar 4th Phase, Bengaluru',
    domain: 'zerodha.com',
  },
  Groww: {
    sector: 'Fintech',
    subRegion: 'Outer Ring Road',
    location: 'Vaishnavi Tech Park, Bellandur, Bengaluru',
    domain: 'groww.in',
  },
  Slice: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'HAL 2nd Stage, Indiranagar, Bengaluru',
    domain: 'sliceit.com',
  },
  'Jupiter Money': {
    sector: 'Fintech',
    subRegion: 'Koramangala & HSR',
    location: '4th Block, Koramangala, Bengaluru',
    domain: 'jupiter.money',
  },
  Smallcase: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: '12th Main, Indiranagar, Bengaluru',
    domain: 'smallcase.com',
  },
  Zeta: {
    sector: 'Fintech',
    subRegion: 'Outer Ring Road',
    location: 'Pritech Park, Bellandur, Bengaluru',
    domain: 'zeta.tech',
  },
  Juspay: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'Giri Nagar & Indiranagar, Bengaluru',
    domain: 'juspay.in',
  },
  Stripe: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'Residency Road, CBD, Bengaluru',
    domain: 'stripe.com',
  },
  Coinbase: {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'Bengaluru / Remote Hub',
    domain: 'coinbase.com',
  },
  'DE Shaw': {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'Prestige Trade Tower, Palace Road, Bengaluru',
    domain: 'deshaw.com',
  },
  'Tower Research Capital': {
    sector: 'Fintech',
    subRegion: 'Indiranagar & CBD',
    location: 'Prestige Meridian, MG Road, Bengaluru',
    domain: 'tower-research.com',
  },

  // ==========================================
  // Consumer & Hyperlocal (12)
  // ==========================================
  Flipkart: {
    sector: 'Consumer',
    subRegion: 'Outer Ring Road',
    location: 'Embassy TechVillage, Bellandur, Bengaluru',
    domain: 'flipkart.com',
  },
  Swiggy: {
    sector: 'Consumer',
    subRegion: 'Outer Ring Road',
    location: 'Devarabisanahalli, Outer Ring Road, Bengaluru',
    domain: 'swiggy.com',
  },
  Zepto: {
    sector: 'Consumer',
    subRegion: 'Koramangala & HSR',
    location: 'Sector 4, HSR Layout, Bengaluru',
    domain: 'zeptonow.com',
  },
  Myntra: {
    sector: 'Consumer',
    subRegion: 'Koramangala & HSR',
    location: 'AKR Tech Park, Kudlu Gate, Hosur Rd, Bengaluru',
    domain: 'myntra.com',
  },
  Meesho: {
    sector: 'Consumer',
    subRegion: 'Outer Ring Road',
    location: 'Foyer Yemalur, Bellandur, Bengaluru',
    domain: 'meesho.com',
  },
  Ola: {
    sector: 'Consumer',
    subRegion: 'Koramangala & HSR',
    location: 'Regent Insignia, Koramangala, Bengaluru',
    domain: 'olacabs.com',
  },
  Udaan: {
    sector: 'Consumer',
    subRegion: 'Outer Ring Road',
    location: 'IndiQube, Bellandur, Outer Ring Rd, Bengaluru',
    domain: 'udaan.com',
  },
  ShareChat: {
    sector: 'Consumer',
    subRegion: 'Koramangala & HSR',
    location: '8th Block, Koramangala, Bengaluru',
    domain: 'sharechat.com',
  },
  Gojek: {
    sector: 'Consumer',
    subRegion: 'Indiranagar & CBD',
    location: 'Diamond District, Domlur, Bengaluru',
    domain: 'gojek.io',
  },
  Airbnb: {
    sector: 'Consumer',
    subRegion: 'Indiranagar & CBD',
    location: 'Embassy GolfLinks, Domlur, Bengaluru',
    domain: 'airbnb.com',
  },
  'Expedia Group': {
    sector: 'Consumer',
    subRegion: 'Outer Ring Road',
    location: 'Karle Town Centre, Nagavara-ORR, Bengaluru',
    domain: 'expedia.com',
  },
  Agoda: {
    sector: 'Consumer',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Tech Park, Marathahalli-ORR, Bengaluru',
    domain: 'agoda.com',
  },

  // ==========================================
  // SaaS & Enterprise Cloud (9)
  // ==========================================
  Atlassian: {
    sector: 'SaaS',
    subRegion: 'Indiranagar & CBD',
    location: 'Embassy Golf Links, Domlur, Bengaluru',
    domain: 'atlassian.com',
  },
  Postman: {
    sector: 'SaaS',
    subRegion: 'Indiranagar & CBD',
    location: '100ft Road, Indiranagar, Bengaluru',
    domain: 'postman.com',
  },
  Hasura: {
    sector: 'SaaS',
    subRegion: 'Indiranagar & CBD',
    location: '12th Main, Indiranagar, Bengaluru',
    domain: 'hasura.io',
  },
  Rippling: {
    sector: 'SaaS',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Tech Park, Bellandur, Bengaluru',
    domain: 'rippling.com',
  },
  Harness: {
    sector: 'SaaS',
    subRegion: 'Koramangala & HSR',
    location: '1st Block, Koramangala, Bengaluru',
    domain: 'harness.io',
  },
  Sprinklr: {
    sector: 'SaaS',
    subRegion: 'Outer Ring Road',
    location: 'Divyasree Technopolis, Yemalur, Bengaluru',
    domain: 'sprinklr.com',
  },
  Databricks: {
    sector: 'SaaS',
    subRegion: 'Outer Ring Road',
    location: 'Embassy TechVillage, Bellandur, Bengaluru',
    domain: 'databricks.com',
  },
  Snowflake: {
    sector: 'SaaS',
    subRegion: 'Outer Ring Road',
    location: 'Bagmane Capital, Mahadevapura, Bengaluru',
    domain: 'snowflake.com',
  },
  'Media.net': {
    sector: 'SaaS',
    subRegion: 'Indiranagar & CBD',
    location: 'UB City, Vittal Mallya Rd, Bengaluru',
    domain: 'media.net',
  },

  // ==========================================
  // Infra & DeepTech/AI (9)
  // ==========================================
  Rubrik: {
    sector: 'Infra/AI',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Tech Park, Bellandur, Bengaluru',
    domain: 'rubrik.com',
  },
  'Palo Alto Networks': {
    sector: 'Infra/AI',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Ferns Galaxy, Bellandur, Bengaluru',
    domain: 'paloaltonetworks.com',
  },
  Cloudflare: {
    sector: 'Infra/AI',
    subRegion: 'Indiranagar & CBD',
    location: 'Embassy Golf Links, Domlur, Bengaluru',
    domain: 'cloudflare.com',
  },
  Redis: {
    sector: 'Infra/AI',
    subRegion: 'Indiranagar & CBD',
    location: 'Indiranagar, Bengaluru',
    domain: 'redis.io',
  },
  Yugabyte: {
    sector: 'Infra/AI',
    subRegion: 'Koramangala & HSR',
    location: '5th Block, Koramangala, Bengaluru',
    domain: 'yugabyte.com',
  },
  Cohesity: {
    sector: 'Infra/AI',
    subRegion: 'Outer Ring Road',
    location: 'Bagmane World Technology Center, Mahadevapura, Bengaluru',
    domain: 'cohesity.com',
  },
  'Pure Storage': {
    sector: 'Infra/AI',
    subRegion: 'Indiranagar & CBD',
    location: 'Kalyani Magnum, JP Nagar, Bengaluru',
    domain: 'purestorage.com',
  },
  Nutanix: {
    sector: 'Infra/AI',
    subRegion: 'Outer Ring Road',
    location: 'Prestige Platina, Kadubeesanahalli, Bengaluru',
    domain: 'nutanix.com',
  },
  'Observe.AI': {
    sector: 'Infra/AI',
    subRegion: 'Koramangala & HSR',
    location: 'Sector 2, HSR Layout, Bengaluru',
    domain: 'observe.ai',
  },
};

/**
 * Standardize sector names to the uniform 5 categories:
 * 'FAANG/MNC' | 'Fintech' | 'Consumer' | 'SaaS' | 'Infra/AI'
 */
function normalizeSector(sec?: string, cat?: string): 'FAANG/MNC' | 'Fintech' | 'Consumer' | 'SaaS' | 'Infra/AI' {
  const s = (sec || cat || '').toLowerCase();
  if (s.includes('faang') || s.includes('mnc') || s.includes('tier-1') || s.includes('retail systems') || s.includes('semiconductor')) {
    return 'FAANG/MNC';
  }
  if (s.includes('fintech') || s.includes('pay') || s.includes('invest') || s.includes('bank') || s.includes('trading') || s.includes('crypto')) {
    return 'Fintech';
  }
  if (s.includes('consumer') || s.includes('commerce') || s.includes('travel') || s.includes('mobility') || s.includes('social')) {
    return 'Consumer';
  }
  if (s.includes('infra') || s.includes('ai') || s.includes('database') || s.includes('security') || s.includes('storage') || s.includes('cloud') || s.includes('k8s')) {
    return 'Infra/AI';
  }
  return 'SaaS';
}

/**
 * Enrich all jobs in the database with first-class Hub, Sub-Region, and Sector tags.
 * Differentiates:
 * 1. Delhi NCR (53)
 * 2. Bengaluru (58)
 * 3. Remote (162+)
 */
export function enrichJobsWithHubs(jobs: JobOpportunity[]): JobOpportunity[] {
  return jobs.map((job) => {
    // 1. Delhi NCR Preservation
    if (job.hub === 'Delhi NCR') {
      return job;
    }

    const comp = job.company;
    const loc = (job.location || '').toLowerCase();

    // 2. Check Bengaluru Curated Meta
    if (bengaluruCompanyMeta[comp]) {
      const meta = bengaluruCompanyMeta[comp];
      return {
        ...job,
        hub: 'Bengaluru',
        subRegion: meta.subRegion,
        sector: meta.sector,
        location: meta.location,
        domain: meta.domain || job.domain,
        workModel: 'Hybrid / On-site',
      };
    }

    // 3. Check Bengaluru by location string if not explicitly in meta
    if (loc.includes('bengaluru') || loc.includes('bangalore')) {
      let subRegion = 'Outer Ring Road';
      if (loc.includes('koramangala') || loc.includes('hsr')) subRegion = 'Koramangala & HSR';
      else if (loc.includes('indiranagar') || loc.includes('domlur') || loc.includes('cbd') || loc.includes('jp nagar')) subRegion = 'Indiranagar & CBD';
      else if (loc.includes('whitefield')) subRegion = 'Whitefield';
      else if (loc.includes('electronic city')) subRegion = 'Electronic City';

      return {
        ...job,
        hub: 'Bengaluru',
        subRegion,
        sector: normalizeSector(job.sector, job.category),
        workModel: 'Hybrid / On-site',
      };
    }

    // 4. Remote / Distributed Companies
    const isRemote = job.isRemote === true || loc.includes('remote');
    const subRegion = loc.includes('india')
      ? 'India Remote'
      : loc.includes('us') || loc.includes('united states') || loc.includes('emea') || loc.includes('europe')
      ? 'US & EU Async'
      : 'Global Remote';

    return {
      ...job,
      hub: 'Remote',
      isRemote: true,
      subRegion: job.subRegion || subRegion,
      sector: normalizeSector(job.sector, job.category),
      workModel: '100% Remote / Distributed',
      location: job.location?.toLowerCase().includes('remote') ? job.location : `Remote (${subRegion})`,
    };
  });
}
