import { fetchAllLiveJobs } from '../services/liveScraperService.js';

async function run() {
  console.log('[CLI Sync] Starting on-demand live jobs synchronization...');
  try {
    const result = await fetchAllLiveJobs();
    console.log(
      `[CLI Sync] Successfully synchronized! Sources scraped: ${result.sourcesScraped}, Total jobs: ${result.totalJobs}, Newly ingested: ${result.ingestedCount}`
    );
    process.exit(0);
  } catch (err) {
    console.error('[CLI Sync] Failed to synchronize live jobs:', err);
    process.exit(1);
  }
}

run();
