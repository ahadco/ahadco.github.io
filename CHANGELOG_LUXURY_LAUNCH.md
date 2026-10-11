# AHAD Luxury Launch Changelog

## 2026-10-11

- Repositioned public experience as `AHAD | Private Marriage Matchmaking`.
- Added a full public landing page before member authentication.
- Introduced original charcoal / ivory / sand / sage / antique-gold visual language.
- Added editorial adult imagery for men and women with clear “expressive imagery” disclosure and image credits.
- Added serious-marriage messaging for official marriage and misyar where applicable, with no guarantee claims.
- Added privacy-first trust architecture: human review, mutual consent, no public catalogue.
- Added three-step matchmaking journey and tailored men/women sections.
- Added no-account marriage application dialog connected to Supabase `ahad-apply`.
- Added responsive mobile navigation and age-35–70 usability improvements.
- Re-themed member authentication and existing authenticated surfaces without rewriting backend logic.
- Added privacy and terms pages, canonical/OG metadata, robots and sitemap.
- Updated PWA manifests and service-worker shell cache.
- Validated live Edge Function submission from browser UI and cleaned all QA records.
- Validated member signup request and cleaned the synthetic QA auth user.

- Published the clean production repository at `ahadco/ahadco.github.io` and verified GitHub Pages status `built`.
- Verified the live production URL and key assets return HTTP 200.
- Verified the production marriage-application UI against Supabase (HTTP 201) and removed the synthetic record.
- Added Arabic mapping for common member-authentication errors and email throttling.

## 2026-10-11 — Staff Matchmaker Dashboard
- Added staff-only `admin.html` control center for marriage applications.
- Added filtering, search, pipeline status updates, internal notes and assignment.
- Added explicit staff authorization check through `staff_members` + RLS.
- Added anti-bot honeypot to the public marriage application form.
- Added production indexes for application pipeline queries.
- Updated service worker cache to v5 staff shell.
- Public users cannot read `marriage_applications` through the publishable key (RLS verified).

- Added immutable application activity audit trail (status, notes, assignment events) visible only to active staff.

- Revoked direct RPC execution of the SECURITY DEFINER audit trigger function; trigger-only execution remains.

- Enforced stronger 12+ character password quality for new account signups (letter + number) without blocking existing logins.
