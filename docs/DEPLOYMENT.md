# National Membership Registration & Validation Platform - Deployment Guide

## 1. Deployment Models

### 1.1 Cloud (AWS Recommended)
Ideal for national scale with 99.99% availability.
- **Compute**: AWS Fargate (ECS) or App Runner for containerized Next.js apps.
- **Database**: Amazon RDS for PostgreSQL (Multi-AZ) or Aurora Serverless v2.
- **Static Assets**: Amazon CloudFront + S3.

### 1.2 On-Premise
Ideal for data sovereignty or strict internal control.
- **Orchestration**: Docker Swarm or Kubernetes (K3s).
- **Database**: PostgreSQL cluster on bare metal or VMs.
- **Load Balancer**: Nginx as a reverse proxy and SSL terminator.

## 2. CI/CD Pipeline

Using GitHub Actions:
1.  **Build**: `npm run build` -> Docker Build.
2.  **Test**: Run Unit & Integration Tests.
3.  **Scan**: Run security scans (Snyk/Trivy).
4.  **Push**: Push Docker image to ECR/Docker Hub.
5.  **Deploy**: Update ECS Service / SSH to on-prem server.

## 3. Environment Variables

Using `.env` files (not committed to git).
- `DATABASE_URL`: Connection string for Drizzle.
- `NEXT_PUBLIC_API_URL`: Public API endpoint.
- `AUTH_SECRET`: Secret for signing session tokens.
- `SMTP_HOST`: Email server config.

## 4. Docker Configuration

### Dockerfile (Production)
```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

FROM base AS deps
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### Docker Compose (Production)
```yaml
services:
  app:
    image: membership-platform:latest
    restart: always
    env_file: .env.production
    ports:
      - "3000:3000"
  
  nginx:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
```
