# Frontend Dockerfile for Todo Application
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

RUN apk add --no-cache libc6-compat

# Install dependencies based on the preferred package manager
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
RUN apk add --no-cache libc6-compat

COPY package*.json ./
RUN npm ci

COPY . .

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS production
ENV NODE_ENV=production

RUN apk add --no-cache libc6-compat

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# Development stage
FROM base AS development
ENV NODE_ENV=development

RUN apk add --no-cache libc6-compat

# Install all dependencies including devDependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]