import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { db } from './services/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
import { fetchAllLiveJobs, getScraperStatus, generateLiveOpeningsForCompany } from './services/liveScraperService.js';
import {
  executeAutoApply,
  executeBatchAutoApply,
  subscribeTelemetry,
  synthesizeTailoredAnswers
} from './services/autoApplyEngine.js';
import { parseResumeBuffer } from './services/resumeParser.js';
import { computeVectorMatch } from './services/vectorMatcher.js';
import { scanCurrentResume, analyzeResumeForAts, rewriteSingleBullet } from './services/atsScannerService.js';
import { generateOutreachTemplates } from './services/outreachService.js';
import { generateTailoredResume } from './services/tailoredResumeService.js';
import type { JobStatus } from './types.js';

import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 4000;

// Production security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Gzip / Brotli payload compression
app.use(compression());

// Configurable CORS for Vercel / staging / local dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));

// Rate limiter for heavy compute (PDF uploads & ATS scans)
const heavyComputeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many compute requests. Please wait a few moments before trying again.' },
});

// Health check endpoint for Render / Railway / Docker liveness
app.get(['/health', '/api/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'in.gress-compute-backend',
    version: '0.5.0',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    memory: {
      rssMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapUsedMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// Helper to re-score and rank all jobs based on candidate profile and resume text
function recomputeAndRankJobs(resumeText?: string) {
  const profile = db.getProfile();
  const currentJobs = db.getJobs();

  const updatedJobs = currentJobs.map((job) => {
    const match = computeVectorMatch(
      profile,
      job.title,
      job.description,
      job.requiredSkills || [],
      resumeText
    );
    return {
      ...job,
      vectorScore: match.score,
      matchBreakdown: match.breakdown
    };
  });

  // Sort descending by match score so top matches are first
  updatedJobs.sort((a, b) => b.vectorScore - a.vectorScore);
  db.updateAllJobs(updatedJobs);
  return updatedJobs;
}

// Candidate Profile Endpoints
app.get('/api/profile', (req, res) => {
  res.json(db.getProfile());
});

app.put('/api/profile', (req, res) => {
  const updated = db.updateProfile(req.body);
  const rankedJobs = recomputeAndRankJobs();
  db.updateAllJobs(rankedJobs);
  res.json({
    ...updated,
    profile: updated,
    jobs: rankedJobs,
  });
});

// Upload resume file (PDF, TXT, etc.)
app.post('/api/profile/upload-resume', heavyComputeLimiter, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const parsed = await parseResumeBuffer(req.file.buffer, req.file.originalname);

    // Merge detected skills into profile
    const profile = db.getProfile();
    const combinedSkills = Array.from(new Set([...profile.skills, ...parsed.skills]));

    db.updateProfile({
      skills: combinedSkills,
      summary: parsed.text ? parsed.text.slice(0, 500).replace(/\n+/g, ' ') : profile.summary
    });

    // Recompute vector match scores across all jobs and sort descending
    const rankedJobs = recomputeAndRankJobs(parsed.text);

    db.addTelemetry({
      type: 'VECTOR_MATCH',
      company: 'Resume Scanner',
      jobTitle: req.file.originalname,
      message: `Parsed ${parsed.skills.length} skills. Re-ranked ${rankedJobs.length} jobs. Peak match: ${rankedJobs[0]?.vectorScore}% (${rankedJobs[0]?.company}).`
    });

    res.json({
      success: true,
      parsed,
      profile: db.getProfile(),
      jobsCount: rankedJobs.length,
      topScore: rankedJobs[0]?.vectorScore,
      topCompany: rankedJobs[0]?.company,
      jobs: rankedJobs
    });
  } catch (err: any) {
    console.error('Error uploading resume:', err);
    res.status(500).json({ error: err.message || 'Failed to process resume' });
  }
});

// Scan existing local resume file (Resume_abhinav.pdf in Downloads)
app.post('/api/profile/scan-existing', async (req, res) => {
  try {
    const defaultPaths = [
      '/Users/abhinav/Downloads/Resume_abhinav.pdf',
      path.resolve(process.cwd(), '../Resume_abhinav.pdf')
    ];

    let resumePath = defaultPaths.find((p) => fs.existsSync(p));

    if (!resumePath) {
      return res.status(404).json({ error: 'Resume_abhinav.pdf not found in ~/Downloads' });
    }

    const buffer = fs.readFileSync(resumePath);
    const parsed = await parseResumeBuffer(buffer, path.basename(resumePath));

    const profile = db.getProfile();
    const combinedSkills = Array.from(new Set([...profile.skills, ...parsed.skills]));

    db.updateProfile({
      skills: combinedSkills,
      summary: parsed.text ? parsed.text.slice(0, 500).replace(/\n+/g, ' ') : profile.summary
    });

    const rankedJobs = recomputeAndRankJobs(parsed.text);

    db.addTelemetry({
      type: 'VECTOR_MATCH',
      company: 'Local Scanner',
      jobTitle: path.basename(resumePath),
      message: `Scanned ${path.basename(resumePath)}: Extracted ${parsed.skills.length} technical skills. Re-ranked ${rankedJobs.length} jobs (Top match: ${rankedJobs[0]?.vectorScore}%).`
    });

    res.json({
      success: true,
      parsed,
      profile: db.getProfile(),
      jobsCount: rankedJobs.length,
      topScore: rankedJobs[0]?.vectorScore,
      topCompany: rankedJobs[0]?.company,
      jobs: rankedJobs
    });
  } catch (err: any) {
    console.error('Error scanning existing resume:', err);
    res.status(500).json({ error: err.message || 'Failed to scan resume' });
  }
});

// Re-rank jobs without new upload
app.post('/api/profile/import-resume', (req, res) => {
  const rankedJobs = recomputeAndRankJobs();
  const profile = db.getProfile();
  db.addTelemetry({
    type: 'VECTOR_MATCH',
    company: 'Resume Engine',
    jobTitle: 'Resume_abhinav.pdf',
    message: `Re-indexed candidate vectors. Top match: ${rankedJobs[0]?.vectorScore}% at ${rankedJobs[0]?.company}.`
  });
  res.json({ success: true, profile, jobs: rankedJobs });
});

// AI ATS Resume Scanner Endpoints
app.post('/api/ats/scan', async (req, res) => {
  try {
    const { targetJd, domain } = req.body || {};
    const audit = await scanCurrentResume(targetJd, domain);

    db.addTelemetry({
      type: 'VECTOR_MATCH',
      company: 'AI ATS Audit Engine',
      jobTitle: `ATS Score: ${audit.overallScore}/100 (${audit.grade})`,
      message: `Completed 6-pillar ATS evaluation. Verdict: ${audit.verdict.slice(0, 100)}...`
    });

    res.json({ success: true, audit });
  } catch (err: any) {
    console.error('ATS Scan Error:', err);
    res.status(500).json({ error: err.message || 'Failed to perform ATS scan' });
  }
});

app.post('/api/ats/upload-scan', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const parsed = await parseResumeBuffer(req.file.buffer, req.file.originalname);
    let targetJd: any = undefined;
    if (req.body.targetJd) {
      try {
        targetJd = typeof req.body.targetJd === 'string' ? JSON.parse(req.body.targetJd) : req.body.targetJd;
      } catch {}
    }
    const domain = req.body.domain;

    const audit = analyzeResumeForAts(parsed.text, req.file.originalname, targetJd, domain);

    db.addTelemetry({
      type: 'VECTOR_MATCH',
      company: 'AI ATS Audit Engine',
      jobTitle: `${req.file.originalname} - ${audit.overallScore}/100`,
      message: `Audited uploaded resume. Detected ${audit.identifiedSkills.length} skills, score: ${audit.overallScore}/100 (${audit.grade}).`
    });

    res.json({ success: true, audit });
  } catch (err: any) {
    console.error('ATS Upload Scan Error:', err);
    res.status(500).json({ error: err.message || 'Failed to process resume for ATS scan' });
  }
});

// Live Custom Bullet Point Optimizer Endpoint (Google X-Y-Z Formula)
app.post('/api/ats/rewrite-bullet', (req, res) => {
  try {
    const { bullet, role, domain } = req.body;
    if (!bullet || typeof bullet !== 'string' || !bullet.trim()) {
      return res.status(400).json({ error: 'Valid bullet point text is required' });
    }
    const rewrite = rewriteSingleBullet(bullet, role, domain);
    res.json({ success: true, rewrite });
  } catch (err: any) {
    console.error('Bullet rewrite error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate bullet rewrite' });
  }
});

// Active Google User Session
let activeGoogleUser: any = null;

app.post('/api/auth/google', (req, res) => {
  const { user } = req.body;
  if (!user || !user.email) {
    return res.status(400).json({ error: 'Valid user profile required' });
  }
  activeGoogleUser = user;

  // Sync candidate profile email and name
  const currentProfile = db.getProfile();
  if (currentProfile) {
    db.updateProfile({
      email: user.email,
      name: user.name || currentProfile.name,
    });
  }

  db.addTelemetry({
    type: 'VECTOR_MATCH',
    company: 'Google OAuth 2.0',
    jobTitle: user.email,
    message: `Authenticated via Google Identity Services: ${user.name} (${user.email}).`
  });

  res.json({ success: true, user: activeGoogleUser });
});

app.get('/api/auth/me', (_req, res) => {
  res.json({ user: activeGoogleUser });
});

app.post('/api/auth/logout', (_req, res) => {
  activeGoogleUser = null;
  res.json({ success: true, message: 'Logged out successfully' });
});

// Reset tracker: Revert all jobs to 'discovered' status and clear emails
app.post('/api/jobs/reset', (req, res) => {
  try {
    const result = db.resetAllJobs();

    // Clean email receipts
    const EMAILS_DIR = path.resolve(process.cwd(), 'server/data/emails');
    if (fs.existsSync(EMAILS_DIR)) {
      const files = fs.readdirSync(EMAILS_DIR);
      for (const file of files) {
        if (file.endsWith('.html')) {
          fs.unlinkSync(path.join(EMAILS_DIR, file));
        }
      }
    }

    db.addTelemetry({
      type: 'VECTOR_MATCH',
      company: 'Tracker Controller',
      jobTitle: 'Clean Slate Reset',
      message: `Reset ${result.count} applications back to DISCOVERED. Application counter cleared.`
    });

    res.json({
      success: true,
      count: result.count,
      message: 'All jobs successfully reset to discovered'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reset tracker' });
  }
});

// Jobs Endpoints
app.get('/api/jobs', (req, res) => {
  res.json(db.getJobs());
});

app.post('/api/jobs/sync', async (req, res) => {
  try {
    const result = await fetchAllLiveJobs();
    res.json({
      success: true,
      ingestedCount: result.ingestedCount,
      totalJobs: result.totalJobs,
      sourcesScraped: result.sourcesScraped,
      jobs: result.jobs
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/scraper/status', (req, res) => {
  res.json(getScraperStatus());
});

app.post('/api/jobs/:id/apply', async (req, res) => {
  const { id } = req.params;
  const { mode = 'live' } = req.body;
  const result = await executeAutoApply(id, mode);
  if (!result.success) {
    return res.status(404).json(result);
  }
  res.json(result);
});

// Mark company as applied via career portal (initiates 7-day cooldown auto-reset)
app.post('/api/jobs/:id/apply-portal', (req, res) => {
  const { id } = req.params;
  const updated = db.applyJobPortal(id);
  if (!updated) return res.status(404).json({ error: 'Job not found' });

  db.addTelemetry({
    type: 'VECTOR_MATCH',
    company: updated.company,
    jobTitle: updated.title,
    message: `Applied via Career Portal! Company moved to Applied section (auto-resets in 7 days).`
  });

  res.json({ success: true, job: updated });
});

// Unapply: Manually return company back to Available pipeline immediately
app.post('/api/jobs/:id/unapply', (req, res) => {
  const { id } = req.params;
  const updated = db.unapplyJob(id);
  if (!updated) return res.status(404).json({ error: 'Job not found' });

  db.addTelemetry({
    type: 'VECTOR_MATCH',
    company: updated.company,
    jobTitle: updated.title,
    message: `Restored ${updated.company} back to Available Portals pipeline.`
  });

  res.json({ success: true, job: updated });
});

app.post('/api/jobs/batch-apply', async (req, res) => {
  const { minScore = 85 } = req.body;
  const result = await executeBatchAutoApply(minScore);
  res.json(result);
});

app.get('/api/jobs/:id/tailor', (req, res) => {
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const payload = synthesizeTailoredAnswers(job);
  res.json(payload);
});

app.patch('/api/jobs/:id/status', (req, res) => {
  const { status } = req.body as { status: JobStatus };
  const updated = db.updateJob(req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'Job not found' });

  db.addTelemetry({
    type: 'VECTOR_MATCH',
    company: updated.company,
    jobTitle: updated.title,
    message: `Pipeline stage updated to: ${status.toUpperCase()}`
  });

  res.json(updated);
});

// Sent Emails endpoint
app.get('/api/emails', (req, res) => {
  const EMAILS_DIR = new URL('../data/emails', import.meta.url).pathname;
  try {
    const fs = req.app.get('fs') || import('node:fs');
    import('node:fs').then((fsMod) => {
      if (!fsMod.existsSync(EMAILS_DIR)) return res.json([]);
      const files = fsMod.readdirSync(EMAILS_DIR).filter((f) => f.endsWith('.html'));
      res.json(
        files.map((f) => ({
          filename: f,
          recipient: 'abhinav.aryan0802@gmail.com',
          timestamp: f.split('-')[0]
        }))
      );
    });
  } catch {
    res.json([]);
  }
});

// Telemetry & Real-Time SSE Stream
app.get('/api/telemetry', (req, res) => {
  res.json(db.getTelemetry());
});

app.get('/api/telemetry/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial connected event
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream Active' })}\n\n`);

  const unsubscribe = subscribeTelemetry((event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// Analytics & Stats
app.get('/api/stats', (req, res) => {
  const jobs = db.getJobs();
  const applied = jobs.filter((j) => j.status === 'applied');
  const interviewing = jobs.filter((j) => j.status === 'interviewing');
  const offers = jobs.filter((j) => j.status === 'offer');

  const avgMatch = Math.round(
    jobs.reduce((acc, curr) => acc + curr.vectorScore, 0) / (jobs.length || 1)
  );

  res.json({
    totalTracked: jobs.length,
    totalApplied: applied.length,
    interviewing: interviewing.length,
    offers: offers.length,
    avgMatchScore: avgMatch,
    topMatch: Math.max(...jobs.map((j) => j.vectorScore)),
    autoPilotActive: db.getProfile().preferences.autoPilotEnabled
  });
});

// Preparation Resources from Sheet
app.get('/api/resources', (req, res) => {
  const resourcesPath = path.join(DATA_DIR, 'resources.json');
  if (fs.existsSync(resourcesPath)) {
    const data = JSON.parse(fs.readFileSync(resourcesPath, 'utf-8'));
    res.json(data);
  } else {
    res.json([]);
  }
});

// 1-Click Recruiter & Referral Outreach Generator (Option 1 USP)
app.post('/api/outreach/generate', (req, res) => {
  try {
    const { company, title, jobId, tone, recipientRole } = req.body;
    const result = generateOutreachTemplates({ company, title, jobId, tone, recipientRole });
    res.json(result);
  } catch (err: any) {
    console.error('Error generating outreach templates:', err);
    res.status(500).json({ error: err.message || 'Failed to generate outreach templates' });
  }
});

// 1-Click Role-Tailored Resume Exporter (Option 2 USP)
app.post('/api/resume/tailor', heavyComputeLimiter, (req, res) => {
  try {
    const { jobId, company, title, description, requiredSkills } = req.body;
    const result = generateTailoredResume({ jobId, company, title, description, requiredSkills });
    res.json(result);
  } catch (err: any) {
    console.error('Error tailoring resume:', err);
    res.status(500).json({ error: err.message || 'Failed to tailor resume' });
  }
});

// Developer Feedback Submission
app.post('/api/feedback', (req, res) => {
  try {
    const { type, name, email, rating, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Feedback message cannot be empty' });
    }

    const feedbackEntry = {
      id: `fb-${Date.now()}`,
      type: type || 'General Feedback',
      name: name || 'Anonymous Candidate',
      email: email || '',
      rating: rating || 5,
      message: message.trim(),
      submittedAt: new Date().toISOString(),
    };

    db.addTelemetry({
      type: 'APPLICATION_SUCCESS',
      company: 'in.gress Feedback',
      jobTitle: feedbackEntry.type,
      message: `Dev feedback received from ${feedbackEntry.name} (${feedbackEntry.rating}★): "${feedbackEntry.message.slice(0, 60)}..."`,
    });

    res.json({ success: true, feedback: feedbackEntry });
  } catch (err: any) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ error: err.message || 'Failed to submit feedback' });
  }
});

// Static frontend serving (Optional production full-stack / single-container deployment)
const CLIENT_DIST = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// Centralized Production Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error Handler]:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message || 'Server error',
  });
});

const server = app.listen(PORT, () => {
  console.log(`[in.gress Server] Running on http://localhost:${PORT}`);
});

// Automated Background Live Job Synchronization
let syncIntervalTimer: NodeJS.Timeout | null = null;
const syncIntervalHours = Number(process.env.SYNC_INTERVAL_HOURS) || 12;
const shouldAutoSync = process.env.ENABLE_AUTO_SYNC === 'true' || process.env.NODE_ENV === 'production';

if (shouldAutoSync) {
  console.log(`[Auto-Sync Engine] Scheduled background live job sync every ${syncIntervalHours}h.`);
  syncIntervalTimer = setInterval(async () => {
    try {
      console.log('[Auto-Sync Engine] Running scheduled live job synchronization...');
      await fetchAllLiveJobs();
      console.log('[Auto-Sync Engine] Scheduled synchronization completed successfully.');
    } catch (err) {
      console.error('[Auto-Sync Engine] Scheduled synchronization failed:', err);
    }
  }, syncIntervalHours * 60 * 60 * 1000);
}

const gracefulShutdown = (signal: string) => {
  console.log(`[in.gress Server] Received ${signal}. Initiating graceful shutdown...`);
  if (syncIntervalTimer) {
    clearInterval(syncIntervalTimer);
  }
  server.close(() => {
    console.log('[in.gress Server] HTTP listener closed cleanly.');
    process.exit(0);
  });
  setTimeout(() => {
    console.error('[in.gress Server] Forced termination after timeout.');
    process.exit(1);
  }, 8000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
