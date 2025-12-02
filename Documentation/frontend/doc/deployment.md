Frontend Deployment Guide

This document outlines the release pipeline for the frontend, including build steps, environment configuration, hosting, and monitoring.

Build Steps

Next.js uses a standard build process.

Commands:

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm run start


Notes:

npm run build compiles TypeScript, bundles JS, and optimizes assets.

Generated .next folder contains production-ready files.

Environment Variables

Frontend configuration uses .env.local for environment-specific settings.

Example:

NEXT_PUBLIC_API_URL=https://api.bytmtaani.com
NEXT_PUBLIC_CHAPA_PUBLIC_KEY=pk_xxxxxxx
NEXT_PUBLIC_ANALYTICS_KEY=analytics_xxxxx


Rules:

All exposed variables must start with NEXT_PUBLIC_.

Backend secrets must never be included in frontend.

Use different files for local, staging, and production.

Hosting Platform

Recommended platforms:

Vercel (default for Next.js, supports serverless functions)

Netlify (alternative static hosting)

Render (supports full-stack Next.js)

Cloudflare Pages (for PWA)

Deployment Steps on Vercel:

Connect GitHub repository.

Configure project environment variables.

Set build command: npm run build

Set output directory: .next (handled automatically)

Trigger deploy via push to main branch.

CI/CD Pipeline

GitHub Actions or platform-integrated pipelines.

Steps:

Install dependencies (npm ci)

Run linting and tests (npm run lint, npm run test)

Build the project (npm run build)

Deploy to chosen platform

Optional: Add preview branches for staging.

Monitoring & Logging

Monitor frontend performance and uptime:

Google Lighthouse for performance audits

Sentry or LogRocket for error tracking

Vercel dashboard or platform logs for deployment monitoring

Analytics for user tracking

Versioning & Rollbacks

Tag releases in GitHub (v1.0.0)

Use branches for feature isolation (feature/xyz)

Rollback by redeploying previous tag or commit

Summary Rules

Build using npm run build

Keep environment variables secure

Use platform-specific deployment (Vercel recommended)

Monitor logs, errors, and performance

Use version tags for release control