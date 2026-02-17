# National Membership Registration & Validation Platform - Database Design

## 1. Schema Overview

The database is designed using 3NF (Third Normal Form) principals, optimized for read-heavy workloads with specific denormalization for performance critical queries.

### 1.1 Core Entities

- **Geographic Hierarchy**: `states` -> `lgas` -> `wards` -> `parishes`
- **Membership**: `members` (Central entity)
- **Administration**: `admin_users`, `roles`, `permissions`, `sessions`
- **Logging**: `audit_logs`, `validation_logs`

## 2. Table Definitions

### 2.1 Geographic Tables

```sql
CREATE TABLE states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE lgas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(state_id, name)
);
-- Index for cascading deletions and filtering
CREATE INDEX idx_lgas_state_id ON lgas(state_id);

CREATE TABLE wards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lga_id UUID NOT NULL REFERENCES lgas(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(lga_id, name)
);
CREATE INDEX idx_wards_lga_id ON wards(lga_id);

CREATE TABLE parishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ward_id UUID NOT NULL REFERENCES wards(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ward_id, name)
);
CREATE INDEX idx_parishes_ward_id ON parishes(ward_id);
```

### 2.2 Member Table (Optimized)

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(150),
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
  
  -- Location Foreign Keys
  state_id UUID NOT NULL REFERENCES states(id),
  lga_id UUID NOT NULL REFERENCES lgas(id),
  ward_id UUID NOT NULL REFERENCES wards(id),
  parish_id UUID NOT NULL REFERENCES parishes(id),
  
  -- Denomination Info
  denomination_id UUID REFERENCES denominations(id),
  is_catholic BOOLEAN NOT NULL DEFAULT TRUE,
  has_pvc BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Validation Workflow
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'rejected')),
  validated_at TIMESTAMP,
  validated_by UUID REFERENCES admin_users(id),
  validation_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX idx_members_phone ON members(phone_number);
CREATE INDEX idx_members_parish ON members(parish_id);
CREATE INDEX idx_members_ward ON members(ward_id);
CREATE INDEX idx_members_lga ON members(lga_id);
CREATE INDEX idx_members_state ON members(state_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_pvc ON members(has_pvc);
CREATE INDEX idx_members_denomination ON members(denomination_id);
CREATE INDEX idx_members_created_at ON members(created_at DESC);
-- Composite indexes for common dashboard filters
CREATE INDEX idx_members_composite_location ON members(state_id, lga_id, ward_id, parish_id);
CREATE INDEX idx_members_composite_validation ON members(status, validated_at, parish_id);
```

### 2.3 ORM Selection: Drizzle ORM

**Technical Justification**:
We have selected **Drizzle ORM** over Prisma for the following reasons:

1.  **Performance at Scale**: Drizzle has significantly lower runtime overhead compared to Prisma's Rust binary bridge. For a system expected to handle 40M+ records, every millisecond of query latency matters.
2.  **SQL Control**: Drizzle provides a closer-to-SQL experience, allowing for easier optimization of complex analytical queries without fighting an abstraction layer.
3.  **Lightweight**: It adds minimal bundle size to our Serverless/Edge functions, improving cold start times.
4.  **Type Safety**: It offers comparable TypeScript safety to Prisma but with standard SQL types.

## 3. Migration Strategy

Migrations will be managed via `drizzle-kit`.
- `0000_init`: Geographic tables
- `0001_auth`: Admin tables
- `0002_members`: Members table
- `0003_indexing`: Performance indexes

## 4. Query Optimization

- **Explain Analyze**: All complex queries will be profiled.
- **Pagination**: Keyset pagination (cursor-based) will be preferred over Offset pagination for deep scrolling in member lists.
- **Materialized Views**: For the Analytics Dashboard, we will use materialized views for aggregated stats (e.g., `member_counts_by_state`) refreshed periodically, rather than computing counts on the fly.
