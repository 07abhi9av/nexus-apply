# ================================================================
# Multi-Stage Production Dockerfile for in.gress Compute Backend
# ================================================================

# --- Stage 1: Build & Compile TypeScript ---
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and config
COPY tsconfig.json ./
COPY src/ ./src/
COPY data/ ./data/

# Compile TypeScript to dist/
RUN npm run build

# Prune devDependencies for minimal runtime image
RUN npm prune --production

# --- Stage 2: Production Minimal Runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Security: run as non-root user
USER node

# Copy production node_modules and compiled output
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/data ./data
COPY --chown=node:node package.json ./

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

CMD ["node", "dist/index.js"]
