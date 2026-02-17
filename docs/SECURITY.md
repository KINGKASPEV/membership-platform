# National Membership Registration & Validation Platform - Security Protocols

## 1. Authentication & Identity

### 1.1 Password Security
- **Algorithm**: Argon2id
- **Configuration**:
    - Memory Cost: 19456 KiB
    - Time Cost: 2 iterations
    - Parallelism: 1
    - Salt Length: 16 bytes
- **Policy**:
    - Min Length: 12 characters
    - Complexity: Uppercase, Lowercase, Number, Special Character req.
    - Expiration: Forced reset every 90 days for Admins.

### 1.2 Session Management
- **Tokens**: 32-byte cryptographically secure random strings.
- **Storage**: Hashed (SHA-256) in database `sessions` table.
- **Transport**: `__Host-` prefixed cookies (where supported), `Secure`, `HttpOnly`, `SameSite=Strict`.
- **Lifetime**: 7 days rolling, absolute timeout 30 days.

## 2. Authorization (RBAC)

Access is strictly controlled via a custom RBAC implementation.

| Role | Scope | Permissions |
|------|-------|-------------|
| **Super Admin** | National | Full Access |
| **State Admin** | State | Read/Write Members in State, Manage LGA/Parish Admins |
| **LGA Admin** | LGA | Read/Write Members in LGA, Managing Parish Admins |
| **Parish Admin** | Parish | Create/Validate Members in Parish, Read own stats |

## 3. Infrastructure Security

### 3.1 Network
- **Firewall**: AWS Security Groups / UFW allowing only port 443 (HTTPS) and 22 (SSH - restricted IP).
- **DDoS Protection**: AWS Shield / CloudFront limits.

### 3.2 Database
- **Access**: Private Subnet only.
- **Encryption**: Storage encrypted at rest using AES-256.

## 4. Security Checklist (Pre-Deployment)

- [ ] Run `npm audit` to check dependencies.
- [ ] Verify no secrets committed to git (`.env` in `.gitignore`).
- [ ] Test rate limiting (100 req/min per IP).
- [ ] Verify CORS policy triggers on unauthorized domains.
- [ ] Confirm SQL Injection protection (Drizzle param queries).
- [ ] Confirm XSS Headers (`Content-Security-Policy`).
