import type { JobOpportunity } from '../types';

/**
 * True Damerau-Levenshtein Distance
 * Computes minimum edit distance supporting insertions, deletions, substitutions,
 * and adjacent character transpositions.
 */
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const m: number[][] = [];
  for (let i = 0; i <= al; i++) {
    m[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    m[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      m[i][j] = Math.min(
        m[i - 1][j] + 1,        // deletion
        m[i][j - 1] + 1,        // insertion
        m[i - 1][j - 1] + cost  // substitution
      );

      // Adjacent transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        m[i][j] = Math.min(m[i][j], m[i - 2][j - 2] + 1);
      }
    }
  }

  return m[al][bl];
}

/**
 * Consonant Skeleton / Phonetic Shorthand
 * Preserves the first character and strips all subsequent vowels.
 * e.g., "flipkart" -> "flpkrt", "swiggy" -> "swgy", "zomato" -> "zmt"
 */
export function getConsonantSkeleton(str: string): string {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean.length <= 1) return clean;
  return clean[0] + clean.slice(1).replace(/[aeiou]/g, '');
}

/**
 * Normalized Alphanumeric Key
 */
export function cleanKey(str: string): string {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Word Boundary Matcher
 * Tests if `query` matches a whole word or a prefix of any word in `text`.
 * Prevents arbitrary substring false-positives (e.g. "uber" matching "kUBERnetes", "cat" in "eduCATion").
 */
export function matchesWordPrefix(text: string, query: string): boolean {
  if (!text || !query) return false;
  const q = query.toLowerCase().trim();
  if (!q) return false;
  // If query contains multiple words (e.g. "site reliability", "cyber city"), check phrase substring
  if (q.includes(' ')) {
    return text.toLowerCase().includes(q);
  }
  // Otherwise split text on non-alphanumeric separators and test each word
  const words = text.toLowerCase().split(/[\s,./\-_()&|+:;[\]{}'"]+/);
  return words.some((w) => w === q || (q.length >= 2 && w.startsWith(q)));
}

/**
 * Comprehensive Canonical Company Brand Aliases, Acronyms, Ticker Symbols & Products
 * Keys are normalized clean strings (lowercase alphanumeric only).
 */
export const COMPANY_ALIASES: Record<string, string[]> = {
  // Big Tech & US Tier-1
  'amazon': ['aws', 'amzn', 'amazon web services', 'twitch', 'audible', 'prime video', 'prime'],
  'meta': ['facebook', 'fb', 'instagram', 'insta', 'whatsapp', 'oculus', 'metaverse'],
  'google': ['alphabet', 'goog', 'google cloud', 'gcp', 'youtube', 'deepmind', 'waymo'],
  'microsoft': ['msft', 'azure', 'github', 'linkedin', 'xbox', 'windows', 'office365'],
  'apple': ['aapl', 'ios', 'macos', 'apple inc', 'iphone', 'macbook', 'ipad'],
  'netflix': ['nflx'],
  'nvidia': ['nvda', 'nvidia corp', 'geforce', 'cuda'],
  'salesforce': ['crm', 'slack', 'tableau', 'mulesoft', 'heroku'],
  'snowflake': ['snow'],
  'oracle': ['orcl', 'java', 'mysql', 'oracle cloud'],
  'cisco': ['cisco systems', 'webex', 'meraki'],
  'uber': ['ubr', 'uber eats'],
  'airbnb': ['abnb', 'air bnb'],
  'atlassian': ['jira', 'confluence', 'trello', 'bitbucket', 'team'],
  'stripe': ['payments', 'stripe payments'],
  'paypal': ['pypl', 'venmo', 'braintree'],
  'adobe': ['adbe', 'photoshop', 'illustrator', 'creative cloud'],
  'figma': ['figma design'],
  'notion': ['notion labs'],
  'coinbase': ['coin', 'crypto'],
  'cloudflare': ['net', 'cloudflare workers', 'dns'],
  'crowdstrike': ['crwd', 'falcon'],
  'paloaltonetworks': ['panw', 'palo alto', 'prisma'],
  'databricks': ['spark', 'lakehouse', 'apache spark'],
  'confluent': ['kafka', 'apache kafka'],
  'mongodb': ['mgo', 'mongo', 'atlas'],
  'redis': ['redis labs'],
  'hashicorp': ['terraform', 'vault', 'consul', 'nomad'],
  'gitlab': ['gitlab inc', 'devops'],
  'docker': ['docker inc', 'containers'],
  'postman': ['api platform'],
  'browserstack': ['browser stack'],
  'twilio': ['twlo', 'sendgrid'],
  'servicenow': ['now'],
  'thoughtworks': ['thought works'],
  'publicissapient': ['sapient', 'sapient nitro'],
  'walmartglobaltech': ['walmart', 'wmt', 'walmart labs', 'walmart tech'],
  'targetindia': ['target', 'tgt', 'target tech'],
  'expediagroup': ['expedia', 'vrbo', 'hotels.com'],

  // Global Financial & Quantitative Trading
  'deshaw': ['d. e. shaw', 'de shaw', 'deshaw', 'd.e. shaw', 'd e shaw'],
  'jpmorganchase': ['jpmc', 'jpm', 'jp morgan', 'jpmorgan', 'chase', 'chase bank', 'jp morgan chase'],
  'goldmansachs': ['gs', 'goldman', 'marcus'],
  'morganstanley': ['ms', 'morgan'],
  'bnymellon': ['bny', 'bank of new york'],
  'americanexpress': ['amex', 'axp', 'american express'],
  'wellsfargo': ['wfc', 'wells'],
  'citigroup': ['citi', 'citibank'],
  'bankofamerica': ['bofa', 'bac', 'merrill'],
  'standardchartered': ['stan c', 'scb', 'stanc', 'standard chartered'],
  'barclays': ['barclays bank'],
  'deutschebank': ['db', 'deutsche'],
  'hsbc': ['hsbc bank'],
  'towerresearchcapital': ['trc', 'tower research', 'tower'],
  'arcesium': ['arcesium llc'],
  'fis': ['fidelity information services'],
  'fiserv': ['first data'],

  // Indian Tech Giants, Unicorns & FinTechs
  'flipkart': ['fk', 'myntra', 'cleartrip', 'shopsy', 'supercoins'],
  'swiggy': ['instamart', 'dineout', 'swiggy delivery', 'genie'],
  'zomato': ['blinkit', 'hyperpure', 'feeding india', 'district'],
  'blinkit': ['grofers', 'blinkit delivery', 'quick commerce'],
  'ola': ['ola cabs', 'krutrim', 'ola electric'],
  'paytm': ['one97', 'paytm payments bank', 'paytm insider'],
  'phonepe': ['phone pe', 'phonepe switch', 'pincode'],
  'razorpay': ['razor pay', 'curlec', 'thirdwatch'],
  'cred': ['cred app', 'kunald', 'garage'],
  'zepto': ['kirana kart', 'quick commerce'],
  'urbancompany': ['urbanclap', 'urban clap', 'uc'],
  'makemytrip': ['mmt', 'goibibo', 'redbus'],
  'goibibo': ['mmt', 'makemytrip'],
  'ixigo': ['confirmtkt', 'ixigo trains'],
  'infoedge': ['naukri', '99acres', 'jeevansathi', 'shiksha'],
  'policybazaar': ['pb fintech', 'paisabazaar'],
  'pbfintech': ['policybazaar', 'paisabazaar'],
  'inmobi': ['glance', 'roposo'],
  'glance': ['inmobi', 'roposo'],
  'lenskart': ['lens kart', 'john jacobs', 'aquaberry'],
  'cars24': ['cars 24'],
  'delhivery': ['delhivery logistics'],
  'shiprocket': ['kartrocket', 'pickrr'],
  'snapdeal': ['unicommerce'],
  'innovaccer': ['healthcare data', 'health cloud'],
  'moglix': ['mro supply chain'],
  'nagarro': ['nagarro se'],
  'oyo': ['oyo rooms', 'oyorooms'],
  'groww': ['nextbillion technology', 'stocks', 'mutual funds'],
  'zerodha': ['kite', 'coin', 'rainmatter', 'varsity', 'zerodha broking'],
  'pinelabs': ['pine labs', 'qwikcilver', 'setu'],
  'juspay': ['hypercheckout', 'nammayatri', 'beckn'],
  'jupitermoney': ['jupiter', 'amica financial'],
  'mobikwik': ['zaakpay'],
  'finbox': ['finbox credit'],
  'indifi': ['indifi finance'],
  'slice': ['slice card', 'garagepre'],
  'smallcase': ['small case', 'tickertape'],
  'udaan': ['hiveloop'],
  'meesho': ['fashnear'],
  'freshworks': ['freshdesk', 'freshservice', 'freshsales'],
};

/**
 * Tech Stack, Skill & Role Synonyms
 */
export const TECH_SYNONYMS: Record<string, string[]> = {
  'golang': ['go', 'golang', 'goroutine', 'goroutines'],
  'go': ['golang'],
  'kubernetes': ['k8s', 'kube', 'kubernetes', 'eks', 'gke', 'aks', 'helm'],
  'k8s': ['kubernetes', 'kube', 'eks', 'gke'],
  'aws': ['amazon web services', 'cloud', 's3', 'ec2', 'eks', 'lambda'],
  'gcp': ['google cloud', 'bigquery', 'gke'],
  'azure': ['microsoft azure', 'aks'],
  'python': ['py', 'django', 'fastapi', 'flask', 'pandas', 'numpy'],
  'react': ['reactjs', 'nextjs', 'next.js', 'react native', 'frontend'],
  'nextjs': ['next.js', 'react'],
  'typescript': ['ts'],
  'javascript': ['js'],
  'sre': ['site reliability', 'reliability', 'observability', 'prometheus', 'grafana', 'datadog', 'devops'],
  'devops': ['sre', 'ci/cd', 'platform engineer', 'infrastructure', 'terraform', 'ansible', 'jenkins', 'argocd'],
  'platform': ['platform engineering', 'infrastructure', 'internal developer platform'],
  'sde': ['software engineer', 'software development engineer', 'developer', 'swe'],
  'swe': ['software engineer', 'sde'],
  'backend': ['back-end', 'distributed systems', 'api', 'microservices', 'grpc'],
  'frontend': ['front-end', 'ui engineer', 'react', 'web', 'css'],
  'fullstack': ['full stack', 'full-stack'],
  'ai': ['artificial intelligence', 'machine learning', 'ml', 'llm', 'genai', 'claude', 'gpt'],
  'ml': ['machine learning', 'ai', 'deep learning', 'nlp'],
  'llm': ['genai', 'claude', 'gpt', 'anthropic', 'openai'],
  'fintech': ['payments', 'banking', 'wealthtech', 'trading', 'crypto', 'payment gateway'],
  'crypto': ['web3', 'blockchain', 'bitcoin', 'ethereum'],
  'security': ['infosec', 'cybersecurity', 'appsec', 'cloud security', 'waf', 'ddos'],
  'kafka': ['confluent', 'streaming', 'message queue'],
  'terraform': ['iac', 'infrastructure as code'],
  'linux': ['unix', 'bash', 'shell'],
};

/**
 * Location & Hub Synonyms
 */
export const LOCATION_SYNONYMS: Record<string, string[]> = {
  'delhi': ['delhi ncr', 'ncr', 'new delhi', 'gurugram', 'gurgaon', 'noida'],
  'ncr': ['delhi', 'gurugram', 'gurgaon', 'noida'],
  'gurgaon': ['gurugram', 'cyber city', 'cyber hub', 'golf course road'],
  'gurugram': ['gurgaon', 'cyber city', 'cyber hub', 'golf course road'],
  'noida': ['sector 62', 'sector 125', 'greater noida'],
  'bangalore': ['bengaluru', 'blr', 'whitefield', 'koramangala', 'bellandur', 'indiranagar', 'outer ring road', 'ecospace'],
  'bengaluru': ['bangalore', 'blr', 'whitefield', 'koramangala', 'bellandur', 'indiranagar', 'outer ring road', 'ecospace'],
  'remote': ['distributed', 'work from home', 'wfh', 'anywhere', 'worldwide'],
  'hyderabad': ['hyd', 'hitec city', 'gachibowli'],
  'pune': ['hinjawadi', 'magarpatta'],
  'mumbai': ['bkc', 'powai', 'bombay'],
};

export interface SearchMatchDetails {
  relevance: number;
  matchType:
    | 'exact_company'
    | 'alias'
    | 'company_prefix'
    | 'company_word'
    | 'company_substring'
    | 'skeleton'
    | 'fuzzy_typo'
    | 'multi_token'
    | 'live_role'
    | 'required_skill'
    | 'tech_synonym'
    | 'sector'
    | 'location';
  badgeLabel?: string;
  matchedAlias?: string;
  matchedText?: string;
  correction?: string;
}

/**
 * Intelligent Multi-Pillar Company Search Scorer
 * Blazing-fast scoring evaluated against companies, aliases, live roles, skills, sectors, and locations.
 */
export function evaluateCompanySearch(job: JobOpportunity, rawQuery: string): SearchMatchDetails {
  if (!rawQuery) {
    return { relevance: 0, matchType: 'exact_company' };
  }

  const q = rawQuery.toLowerCase().trim();
  if (!q) {
    return { relevance: 0, matchType: 'exact_company' };
  }

  const qClean = cleanKey(q);
  const qSkeleton = getConsonantSkeleton(q);
  const qTokens = q.split(/\s+/).filter(Boolean);

  const comp = (job.company || '').toLowerCase().trim();
  const compClean = cleanKey(comp);
  const compSkeleton = getConsonantSkeleton(comp);
  const compWords = comp.split(/\s+/).filter(Boolean);

  const title = (job.title || '').toLowerCase().trim();
  const sector = (job.sector || job.category || '').toLowerCase().trim();
  const location = (job.location || job.subRegion || '').toLowerCase().trim();
  const subRegion = (job.subRegion || '').toLowerCase().trim();
  const domain = (job.domain || '').toLowerCase().trim();
  const skills = (job.requiredSkills || []).map((s) => s.toLowerCase());

  // -------------------------------------------------------------
  // PILLAR 1: EXACT COMPANY MATCH (25,000 pts)
  // -------------------------------------------------------------
  if (comp === q || compClean === qClean) {
    return {
      relevance: 25000,
      matchType: 'exact_company',
      badgeLabel: 'Exact Match',
      matchedText: job.company,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 2: CANONICAL COMPANY ALIAS / ACRONYM MATCH (22,000 pts)
  // e.g., "aws" -> Amazon, "fb" -> Meta, "msft" -> Microsoft, "jpmc" -> JPMorgan Chase
  // -------------------------------------------------------------
  const aliasList = COMPANY_ALIASES[compClean] || [];
  const directAliasMatch = aliasList.find(
    (a) => a === q || cleanKey(a) === qClean
  );

  if (directAliasMatch) {
    return {
      relevance: 22000,
      matchType: 'alias',
      badgeLabel: `Alias: ${q.toUpperCase()}`,
      matchedAlias: directAliasMatch,
      matchedText: job.company,
    };
  }

  // Check reverse alias or partial alias match (e.g. searching "Google Cloud" or "AWS")
  for (const [canonicalKey, aliases] of Object.entries(COMPANY_ALIASES)) {
    if (compClean.includes(canonicalKey) || canonicalKey.includes(compClean)) {
      const found = aliases.find((a) => a === q || cleanKey(a) === qClean);
      if (found) {
        return {
          relevance: 21500,
          matchType: 'alias',
          badgeLabel: `Alias: ${q.toUpperCase()}`,
          matchedAlias: found,
          matchedText: job.company,
        };
      }
    }
  }

  // -------------------------------------------------------------
  // PILLAR 3: COMPANY NAME STARTS WITH QUERY (18,000 pts)
  // e.g., "ama" -> Amazon, "goog" -> Google, "strip" -> Stripe
  // -------------------------------------------------------------
  if (comp.startsWith(q) || (qClean.length >= 2 && compClean.startsWith(qClean))) {
    const penalty = Math.min(comp.length - q.length, 25);
    return {
      relevance: 18000 - penalty,
      matchType: 'company_prefix',
      matchedText: job.company,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 4: WORD IN COMPANY STARTS WITH QUERY (15,000 pts)
  // e.g., "tech" -> Walmart Global Tech, "research" -> Tower Research Capital
  // -------------------------------------------------------------
  const wordPrefixMatch = compWords.find(
    (w) => w.startsWith(q) || (qClean.length >= 2 && cleanKey(w).startsWith(qClean))
  );
  if (wordPrefixMatch) {
    return {
      relevance: 15000,
      matchType: 'company_word',
      matchedText: job.company,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 5: COMPANY NAME CONTAINS QUERY SUBSTRING (12,000 pts)
  // -------------------------------------------------------------
  if (comp.includes(q) || (qClean.length >= 3 && compClean.includes(qClean))) {
    return {
      relevance: 12000,
      matchType: 'company_substring',
      matchedText: job.company,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 6: CONSONANT SKELETON / PHONETIC MATCH (11,000 pts)
  // Indian & tech shorthand: "flpkrt" -> flipkart, "swgy" -> swiggy, "zmt" -> zomato, "rzrpy" -> razorpay
  // -------------------------------------------------------------
  if (
    qSkeleton.length >= 3 &&
    (compSkeleton === qSkeleton || compSkeleton.startsWith(qSkeleton))
  ) {
    return {
      relevance: 11000,
      matchType: 'skeleton',
      badgeLabel: 'Phonetic Match',
      matchedText: job.company,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 7: FUZZY TYPO TOLERANCE (Damerau-Levenshtein) (9,500 - dist*1000)
  // Catches 1-2 letter typos & transpositions: "googl", "amzon", "swigy", "atlassn", "microsft"
  // Requires >= 75% normalized character similarity to avoid false positives.
  // -------------------------------------------------------------
  if (qClean.length >= 3) {
    let bestDist = 999;
    const targetKeys = compWords.length > 1 ? [compClean, ...compWords.map(cleanKey)] : [compClean];

    for (const target of targetKeys) {
      if (target.length >= 3 && Math.abs(qClean.length - target.length) <= 2) {
        const dist = damerauLevenshtein(qClean, target);
        const maxLen = Math.max(qClean.length, target.length);
        const similarity = 1 - dist / maxLen;
        if (dist <= 2 && similarity >= 0.75) {
          if (dist < bestDist) bestDist = dist;
        }
      }
    }

    if (bestDist <= 2) {
      return {
        relevance: 9500 - bestDist * 1000,
        matchType: 'fuzzy_typo',
        badgeLabel: `Typo: ${job.company}`,
        correction: job.company,
        matchedText: job.company,
      };
    }
  }

  // -------------------------------------------------------------
  // PILLAR 8: MULTI-TOKEN COMPOUND QUERIES (9,000 + tokens*1000)
  // e.g., "google sde", "stripe backend", "delhi fintech", "cyber city"
  // -------------------------------------------------------------
  if (qTokens.length > 1) {
    const combinedText = `${comp} ${title} ${sector} ${location} ${subRegion} ${skills.join(' ')} ${domain}`.toLowerCase();
    const allTokensFound = qTokens.every((tok) => {
      const tokClean = cleanKey(tok);
      if (combinedText.includes(tok)) return true;
      if (tokClean.length >= 2 && cleanKey(combinedText).includes(tokClean)) return true;
      // Check tech synonyms
      const syns = TECH_SYNONYMS[tokClean] || [];
      if (syns.some((s) => combinedText.includes(s))) return true;
      // Check location synonyms
      const locSyns = LOCATION_SYNONYMS[tokClean] || [];
      if (locSyns.some((s) => combinedText.includes(s))) return true;
      return false;
    });

    if (allTokensFound) {
      let boost = 0;
      if (comp.includes(qTokens[0]) || qTokens.some((t) => comp.includes(t))) {
        boost += 3000;
      }
      return {
        relevance: 9000 + qTokens.length * 1000 + boost,
        matchType: 'multi_token',
        badgeLabel: `Matches ${qTokens.length} terms`,
        matchedText: `${job.company} · ${job.title}`,
      };
    }
  }

  // -------------------------------------------------------------
  // PILLAR 9: LIVE ACTIVE OPENING TITLE MATCH (8,000 pts)
  // Uses word-boundary matching to avoid false positives (e.g. "uber" in "kubernetes")
  // -------------------------------------------------------------
  if (job.liveJobs && job.liveJobs.length > 0) {
    for (const role of job.liveJobs) {
      const rTitle = role.title || '';
      const rLoc = role.location || '';
      if (matchesWordPrefix(rTitle, q)) {
        return {
          relevance: 8000,
          matchType: 'live_role',
          badgeLabel: 'Live Opening',
          matchedText: role.title,
        };
      }
      if (matchesWordPrefix(rLoc, q)) {
        return {
          relevance: 5500,
          matchType: 'location',
          badgeLabel: 'Live Location',
          matchedText: role.location,
        };
      }
    }
  }

  // -------------------------------------------------------------
  // PILLAR 10: ROLE TITLE WORD MATCH (7,500 pts)
  // -------------------------------------------------------------
  if (matchesWordPrefix(title, q)) {
    return {
      relevance: 7500,
      matchType: 'live_role',
      badgeLabel: 'Role Match',
      matchedText: job.title,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 11: REQUIRED SKILL MATCH (7,000 pts)
  // -------------------------------------------------------------
  const skillMatch = skills.find((s) => matchesWordPrefix(s, q));
  if (skillMatch) {
    return {
      relevance: 7000,
      matchType: 'required_skill',
      badgeLabel: `Skill: ${q.toUpperCase()}`,
      matchedText: skillMatch,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 12: TECH STACK SYNONYM MATCH (6,500 pts)
  // -------------------------------------------------------------
  const synList = TECH_SYNONYMS[qClean] || [];
  if (synList.length > 0) {
    const matchesSyn = synList.some(
      (syn) =>
        matchesWordPrefix(title, syn) ||
        skills.some((s) => matchesWordPrefix(s, syn)) ||
        (job.liveJobs || []).some((r) => matchesWordPrefix(r.title || '', syn))
    );
    if (matchesSyn) {
      return {
        relevance: 6500,
        matchType: 'tech_synonym',
        badgeLabel: `Tech: ${q.toUpperCase()}`,
        matchedText: q,
      };
    }
  }

  // -------------------------------------------------------------
  // PILLAR 13: DOMAIN MATCH (5,500 pts)
  // -------------------------------------------------------------
  if (domain.startsWith(q) || cleanKey(domain).startsWith(qClean) || cleanKey(domain) === qClean) {
    return {
      relevance: 5500,
      matchType: 'sector',
      badgeLabel: 'Domain',
      matchedText: job.domain,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 14: SECTOR / CATEGORY MATCH (5,000 pts)
  // -------------------------------------------------------------
  if (matchesWordPrefix(sector, q) || sector.startsWith(q)) {
    return {
      relevance: 5000,
      matchType: 'sector',
      badgeLabel: job.sector || job.category,
      matchedText: job.sector || job.category,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 15: LOCATION & SUB-REGION MATCH (4,500 pts)
  // -------------------------------------------------------------
  const locSynList = LOCATION_SYNONYMS[qClean] || [q];
  const matchesLocation = locSynList.some(
    (locTerm) =>
      matchesWordPrefix(location, locTerm) ||
      matchesWordPrefix(subRegion, locTerm) ||
      (job.liveJobs || []).some((r) => matchesWordPrefix(r.location || '', locTerm))
  );
  if (matchesLocation) {
    return {
      relevance: 4500,
      matchType: 'location',
      badgeLabel: 'Location',
      matchedText: job.subRegion || job.location,
    };
  }

  // -------------------------------------------------------------
  // PILLAR 16: JOB DESCRIPTION WORD MATCH (2,500 pts)
  // -------------------------------------------------------------
  if (qClean.length >= 4 && matchesWordPrefix(job.description || '', q)) {
    return {
      relevance: 2500,
      matchType: 'sector',
      matchedText: 'Matched in description',
    };
  }

  return { relevance: 0, matchType: 'exact_company' };
}

export const DIRECT_COMPANY_TYPES = new Set([
  'exact_company',
  'alias',
  'company_prefix',
  'company_word',
  'skeleton',
  'fuzzy_typo',
]);

/**
 * Filter and sort a list of jobs by search relevance.
 * Enforces company-priority disambiguation so when a user searches for a specific
 * company (e.g. "uber", "google", "aws"), unrelated companies are never shown.
 */
export function searchAndRankJobs(
  jobs: JobOpportunity[],
  query: string
): { job: JobOpportunity; match: SearchMatchDetails }[] {
  if (!query || !query.trim()) {
    return jobs.map((job) => ({
      job,
      match: { relevance: 1, matchType: 'exact_company' },
    }));
  }

  const results: { job: JobOpportunity; match: SearchMatchDetails }[] = [];

  for (const job of jobs) {
    const match = evaluateCompanySearch(job, query);
    if (match.relevance > 0) {
      results.push({ job, match });
    }
  }

  const sortFn = (
    a: { job: JobOpportunity; match: SearchMatchDetails },
    b: { job: JobOpportunity; match: SearchMatchDetails }
  ) => {
    if (b.match.relevance !== a.match.relevance) {
      return b.match.relevance - a.match.relevance;
    }
    return b.job.vectorScore - a.job.vectorScore;
  };

  // TIER 1: Exact company match or canonical alias (e.g. "uber" -> [Uber], "stripe" -> [Stripe], "aws" -> [Amazon])
  const exactOrAliasMatches = results.filter(
    (r) => r.match.matchType === 'exact_company' || r.match.matchType === 'alias'
  );
  if (exactOrAliasMatches.length > 0) {
    return exactOrAliasMatches.sort(sortFn);
  }

  // TIER 2: Company name or word prefix match (e.g. "ama" -> [Amazon], "tech" -> [Walmart Global Tech])
  const companyPrefixMatches = results.filter(
    (r) => r.match.matchType === 'company_prefix' || r.match.matchType === 'company_word'
  );
  if (companyPrefixMatches.length > 0) {
    return companyPrefixMatches.sort(sortFn);
  }

  // TIER 3: Typo / phonetic skeleton on company name (e.g. "amzon" -> [Amazon], "flpkrt" -> [Flipkart], "swigy" -> [Swiggy])
  const directCompanyMatches = results.filter((r) =>
    DIRECT_COMPANY_TYPES.has(r.match.matchType)
  );
  if (directCompanyMatches.length > 0) {
    return directCompanyMatches.sort(sortFn);
  }

  // TIER 4: Secondary matches (roles, skills, tech synonyms, sectors, locations)
  return results.sort(sortFn);
}
