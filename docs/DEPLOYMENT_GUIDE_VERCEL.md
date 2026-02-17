# Vercel Deployment Guide

This guide outlines the steps to deploy the National Membership Registration & Validation Platform (NMRVP) to Vercel with an external PostgreSQL database (Neon, Supabase, etc.).

## Prerequisites

1.  **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
2.  **GitHub Repository**: Push your code to a GitHub repository.
3.  **External Database**: Connection string for your PostgreSQL database.

## 1. Database Setup

Ensure your database is accessible from the internet.
- **Neon / Supabase**: These are serverless-ready and work great with Vercel.
- **AWS RDS**: Ensure security groups allow traffic from Vercel (or 0.0.0.0/0 if restricting by IP is difficult).

### Run Migrations
Before deploying, run migrations against your production database from your local machine:

1.  Update your local `.env` with the **production** connection string.
2.  Run:
    ```bash
    npm run db:push
    # OR if you prefer migrations
    npm run db:migrate
    ```
3.  Seed the database (optional but recommended for roles/admins):
    ```bash
    npm run db:seed
    ```

## 2. Vercel Project Setup

1.  **New Project**: Go to Vercel Dashboard -> Add New -> Project.
2.  **Import Git Repository**: Select your NMRVP repository.
3.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Root Directory**: `membership-platform` (if your repo has this structure) or `./`.
    - **Build Command**: `next build` (default).
    - **Output Directory**: `.next` (default).
    - **Install Command**: `npm install` (default).

## 3. Environment Variables

Add the following environment variables in the Vercel dashboard:

| Variable | Value Description |
|---|---|
| `DATABASE_URL` | Your full PostgreSQL connection string (e.g. `postgres://...sslmode=require`) |
| `SESSION_SECRET` | A long, random string (32+ chars) for JWT signing |
| `NODE_ENV` | `production` |
| `Rate_Limit_Enabled` | `true` |

## 4. Deploy

Click **Deploy**. Vercel will build your application and assign a domain.

## 5. Post-Deployment Verification

1.  Visit the deployed URL.
2.  Attempt to login with your admin credentials (created during seeding).
3.  Verify that charts load on the dashboard (checks DB connectivity).
4.  Test CSV export to ensure file generation works in the serverless environment.

## Troubleshooting

- **500 Errors**: Check Vercel Function Logs for error details.
- **Database Connection**: Ensure `ssl=require` is in your connection string params or `ssl: 'require'` in the Drizzle config (we handled this in code).
- **Timeouts**: Vercel serverless functions have a timeout (usually 10s-60s). Ensure your DB queries are efficient.
