# Product Requirements Document (PRD): Last-Mile Fuel Accountability MVP

## 1) Problem Statement
- Small logistics teams at distributed/forward sites capture fuel activity inconsistently across paper notes, chat messages, and ad hoc spreadsheets.
- Inconsistent capture of **receipts**, **on-hand levels**, **consumption**, and **shortfalls** causes low confidence in fuel status and weak planning signals.
- Teams need a lightweight, web-based decision-support tool to log events quickly and produce a clear timeline and summary without enterprise complexity.

## 2) Target Users
- **Primary users:** 2–5 person logistics cells managing local fuel accountability.
- **Typical roles:**
  - Site fuel recorder (enters daily events)
  - Team lead / operations NCO-equivalent (reviews trend and shortfalls)
  - Planner / coordinator (exports summary for reporting)
- **Environment assumptions:** low admin overhead, mixed technical comfort, browser access, unclassified usage.

## 3) Product Scope
### In-Scope (v1)
- Simple web app with a single shared team workspace; user identity may be mocked or minimally implemented in v1.
- Event capture for three core event types:
  - Receipt
  - Consumption
  - Shortfall
- Chronological event timeline with filters (date/type/site).
- Basic dashboard cards (current on-hand estimate, recent receipts, shortfall total).
- Dashboard values are derived estimates based solely on recorded events and are not a system of record.
- AI-assisted features (support only):
  - Data-quality checks (e.g., missing fields, suspicious unit mismatch, outlier values)
  - Plain-language summary generation for selected date range
  - AI outputs must be reviewable, non-blocking, and never overwrite user-entered data.
- CSV/PDF export of event summary and timeline snapshot.
- Max **4–5 screens** total.

### Out-of-Scope (v1)
- Enterprise/system integrations (ERP, logistics platforms, identity federation).
- Offline-first workflows or offline sync.
- Optimization engines, automated ordering, or automated decision recommendations.
- Multi-organization tenancy, role-heavy permissions, or complex workflow approvals.
- Mobile native apps (web only for v1).

## 4) v1 Screens (4–5 Max)
1. **Sign-in / Team Access** (simple password or magic link style access)
2. **Event Entry** (create Receipt/Consumption/Shortfall)
3. **Timeline** (filterable chronological list)
4. **Summary & Export** (AI summary + CSV/PDF export)
5. *(Optional within limit)* **Event Detail/Edit** modal or page

## 5) Success Criteria (v1)
- Team can log a complete fuel event in under **60 seconds**.
- 90%+ of required fields are completed at entry (with validation prompts).
- Users can generate a weekly summary export in under **2 minutes**.
- Timeline accurately reflects submitted events in chronological order.
- AI quality checks catch obvious inconsistencies (missing units, negative impossible values) before save.
- Pilot users report improved confidence in current on-hand status and recent shortfall visibility.

## 6) Beginner-Friendly Web-First Tech Stack
- **Frontend + Backend:** Next.js (App Router) + TypeScript
  - Reason: one project for UI and API routes; large community; strong AI-coding support.
- **UI Components:** shadcn/ui + Tailwind CSS
  - Reason: copy/paste component patterns, fast iteration, easy styling.
- **Database:** Supabase Postgres
  - Reason: managed Postgres, quick setup, SQL visibility, simple auth options.
- **ORM:** Prisma
  - Reason: readable schema, migrations, beginner-friendly type-safe queries.
- **Auth (lightweight):** Supabase Auth or NextAuth magic-link/passwordless
  - Reason: avoid building auth from scratch.
- **AI Assistance:** OpenAI API (single server-side service module)
  - Restrict prompts to data quality checks and summarization only.
- **Hosting:** Vercel (app) + Supabase (DB)
  - Reason: minimal DevOps overhead and fast deploys.
- **Export:** Server-side CSV generation + print-friendly HTML to PDF
  - Reason: simple and reliable for v1.

## 7) Core Data Model (Fuel Events)
Use a single `fuel_events` table with a required `event_type` and shared fields, plus type-specific fields.

### Shared Fields (all events)
- `id` (UUID): unique event identifier.
- `event_type` (enum: `RECEIPT | CONSUMPTION | SHORTFALL`): event category.
- `event_timestamp` (datetime): when event occurred.
- `site_id` (string): location/site reference.
- `fuel_type` (enum/string): e.g., diesel, gasoline, JP-8.
- `quantity` (decimal): primary amount for event.
- `unit` (enum: liters/gallons): measurement unit.
- `on_hand_after` (decimal, optional): reported inventory after event.
- `reported_by` (string/user id): person entering data.
- `notes` (text, optional): contextual comments.
- `source_ref` (text, optional): receipt number, logbook ref, etc.
- `created_at` / `updated_at` (datetime): audit timestamps.

### Receipt Fields
- `supplier` (string, optional): source/vendor.
- `delivery_ref` (string, optional): bill/receipt number.
- `batch_or_lot` (string, optional): traceability reference.

### Consumption Fields
- `consumer_type` (enum/string, optional): vehicle, generator, other.
- `mission_or_task_ref` (string, optional): operation reference.

### Shortfall Fields
- `expected_quantity` (decimal): expected amount before discrepancy. For shortfall events, quantity represents the measured amount; expected_quantity represents the planned amount.
- `actual_quantity` (decimal): measured amount.
- `shortfall_reason` (enum/string, optional): spill, meter variance, unknown, theft suspected, etc.
- `incident_flag` (boolean): indicates if follow-up is needed.

## 8) Walking Skeleton Milestone (End-to-End Demo)
**Goal:** Prove full flow: **create event → view timeline → export summary**.

### Milestone Scope
- Implement 3 screens only for demo:
  1. Event Entry
  2. Timeline
  3. Summary & Export
- Hard-code one demo team/user account.
- Store events in hosted Postgres.
- Add minimal validation for required fields and numeric ranges.
- Add server action/API endpoint to generate:
  - Date-range timeline summary
  - CSV export file
  - AI-generated narrative summary paragraph

### Demo Acceptance Criteria
- User creates one Receipt, one Consumption, and one Shortfall.
- Timeline shows all three events in correct order with key details.
- Summary page displays totals by event type and current on-hand estimate.
- User exports CSV successfully.
- AI summary produces a short narrative with at least one detected data-quality warning when applicable.
