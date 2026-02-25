# fuel-last-mile-mvp

Minimal web-based walking skeleton for last-mile fuel accountability events.

## What is implemented
- Next.js + TypeScript app (App Router)
- Prisma + SQLite schema with a single `fuel_events` model
- Three pages only:
  - `/events/new` create Receipt / Consumption / Shortfall event
  - `/events` chronological event timeline
  - `/summary` simple totals + CSV export link
- Mock user identity (no auth)
- Minimal server-side validation

## Prerequisites
- Node.js 20+

## Local setup (SQLite, no external database required)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
3. Create the local SQLite database and tables:
   ```bash
   npx prisma db push
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
5. Open:
   - http://localhost:3000/events/new
   - http://localhost:3000/events
   - http://localhost:3000/summary

## Notes
- This is intentionally minimal and unpolished to preserve readability and fast iteration.
- TODO(auth): replace mock user identity with real authentication.
- TODO(ai): add AI-assisted data quality checks and summary generation in a later milestone.
