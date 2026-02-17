# System Architecture

## 1. System Overview

The **National Membership Registration & Validation Platform** is a hierarchical, multi-tenant system designed to manage millions of member records across a national structure (State > LGA > Ward > Parish).

### Core Capabilities
- **Public Registration**: Self-service portal for member registration.
- **Validation Workflow**: Multi-tier approval process (Parish -> Diocese/State).
- **Admin Dashboards**: Role-based analytics and management.
- **Reporting**: Real-time charts and CSV exports.

## 2. Technical Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Recharts.
- **Backend**: Next.js Server Actions & API Routes.
- **Database**: PostgreSQL (Neon/Supabase) via Drizzle ORM.
- **Auth**: Custom JWT session management with Argon2 hashing.
- **Infrastructure**: Vercel (recommended) or Docker.

## 3. Data Flow Architecture

### 3.1 Registration Flow
1. **User Input**: Optimized multi-step form handles personal, location, and denomination data.
2. **Caching**: Geographic data (States -> Parishes) is cached at the edge for sub-50ms response.
3. **Write**: Data is written to PostgreSQL with status `pending`.
4. **Notification**: Background workers (or API triggers) notify Parish Admins.
5. **Validation**: Parish admins receive real-time updates of new members.

### 3.2 Security Layer
- **RBAC**: Custom Role-Based Access Control middleware intercepts every request.
- **Data Scoping**: `getScopedFilters()` utility automatically appends WHERE clauses to SQL queries based on the admin's jurisdiction (e.g., a Lagos State admin only sees Lagos members).
- **Rate Limiting**: LRU-cache based limiting on sensitive endpoints (Login: 5/15min, Validation: 20/min).
- **Sanitization**: Zod schemas with custom sanitization pipelines prevent XSS and injection attacks.

## 4. Database Schema Design

### Hierarchy
- `geographic_units`: Stores all levels (State, LGA, Ward, Parish) in a self-referencing or normalized structure optimized for recursive queries.
- `denominations`: Lookup table for non-Catholic entities.

### Core Data
- `members`: The central table, indexed by `status`, `parish_id`, and `created_at` for fast filtering.
- `audit_logs`: Immutable record of every administrative action (who, what, when, old_value, new_value).

## 5. Scalability & Performance

### Read Optimization
- **Indexing**: Composite indexes on `(parish_id, status)` ensure dashboard queries remain O(log n).
- **Pagination**: keyset-based or offset-based pagination is implemented for member lists.
- **Edge Caching**: Static geographic data is cached at the CDN level.

### Write Handling
- **Transactions**: Critical operations (e.g., Validation) use database transactions to strictly ensure data integrity.
- **Validation**: Schema validation happens at the edge (Zod) before hitting the DB.
- **Connection Pooling**: Managed by Drizzle/Postgres driver to handle high concurrency.

## 6. Disaster Recovery
- **Backups**: Rely on managed database provider (Neon/Supabase) Point-in-Time Recovery (PITR).
- **Resiliency**: Stateless application logic allows instant recovery from server failures.
