# API Documentation

## Authentication & Session
- `POST /api/auth/login`: Authenticate user.
    - **Body**: `{ email, password }`
    - **Rate Limit**: 5 req/15min
- `POST /api/auth/logout`: Clear session.
- `GET /api/auth/me`: Get current user context.

## Member Management (Admin)
- `GET /api/admin/members`: List members.
    - **Params**: `page`, `limit`, `status`, `search`
    - **Scope**: Automatically filtered by admin role.
- `GET /api/admin/members/[id]`: Get detailed member profile.
- `POST /api/admin/members/[id]/validate`: Approve or Reject member.
    - **Body**: `{ action: "approve" | "reject", notes: string }`
    - **Transaction**: Updates member status and creates audit log entry.
    - **Rate Limit**: 20 req/min

## Analytics & Reporting
- `GET /api/admin/analytics/trends`: Registration trends over time.
    - **Params**: `period` (daily/weekly/monthly), `days` (7/30/90)
    - **Response**: `[{ date, total, validated, pending, rejected }]`
- `GET /api/admin/analytics/geographic`: Member distribution.
    - **Response**: `{ level: "state"|"lga"|"ward"|"parish", distribution: [{ name, count }] }`
- `GET /api/admin/analytics/validation-rate`: Validation KPIs.
    - **Response**: `{ validationRate, rejectionRate, weekOverWeekChange }`

## Data Export
- `GET /api/admin/export/members`: Download CSV of member data.
    - **Params**: `status`, `startDate`, `endDate`
    - **Security**: Scope-restricted. Returns a stream for performance.

## Geographic Data (Public)
- `GET /api/geo/states`: List all states.
- `GET /api/geo/lgas?stateId=...`: LGAs for a state.
- `GET /api/geo/wards?lgaId=...`: Wards for an LGA.
- `GET /api/geo/parishes?wardId=...`: Parishes for a ward.
- `GET /api/geo/denominations`: List non-Catholic denominations.
