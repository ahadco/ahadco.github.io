# AHAD Production Launch Checklist — 2026-10-11

## Completed
- [x] New public production URL: `https://ahadco.github.io/`
- [x] GitHub Pages source published from a clean, new-history repository (`ahadco/ahadco.github.io`)
- [x] Production Pages build reached `built`
- [x] Production home, privacy, terms, CSS, JS and editorial image assets return HTTP 200
- [x] Original luxury editorial AHAD identity implemented (not a copy of Kelleher assets/content)
- [x] Arabic RTL, mobile-first layout with large touch targets
- [x] Public no-account marriage application flow added
- [x] Public form posts to `ahad-apply` Supabase Edge Function
- [x] Production browser CORS preflight returned HTTP 200
- [x] Production browser marriage application returned HTTP 201 and success UI
- [x] All synthetic marriage QA records were deleted after verification
- [x] Member signup UI exercised end-to-end; Supabase signup returned HTTP 200 and the confirmation-message UI in the successful QA run
- [x] Synthetic signup user was deleted after verification
- [x] Production signup request uses `redirect_to=https://ahadco.github.io/`
- [x] Mobile production viewport QA at 390x844: no horizontal overflow (`scrollWidth == clientWidth`)
- [x] Desktop viewport QA at 1440x1100: no horizontal overflow
- [x] Main editorial images load and have source/license credits
- [x] Privacy and Terms operational pages added
- [x] `robots.txt`, `sitemap.xml`, canonical and Open Graph metadata added
- [x] JavaScript syntax and JSON manifest checks pass
- [x] Service worker cache version bumped
- [x] Auth errors such as invalid credentials and email throttling are localized to Arabic

## Current Supabase operational/security advisories
- [ ] Supabase Security Advisor reports **Leaked Password Protection Disabled**. Enable it in Supabase Auth password-security settings before describing password security as fully hardened.
- [ ] Supabase reports anonymous sign-ins enabled. AHAD frontend does not intentionally use anonymous sign-in and signs anonymous sessions out; disable anonymous sign-ins in Auth settings if they are not required by any other workload in this Supabase project.
- [ ] The final repeated production signup QA request reached Supabase correctly but hit the project email-send rate limit (HTTP 429) after earlier QA confirmation emails. This is a Supabase email-throttling condition, not a frontend routing failure; the successful signup QA immediately before it returned HTTP 200. For public-scale member signup, configure production SMTP / suitable Auth email rate limits.

## Real-device acceptance still manual
- [ ] Physical iPhone Safari acceptance test
- [ ] Physical Android Chrome acceptance test

Automated browser mobile emulation and live production backend submission are completed. Physical-device testing is not marked complete because no tool in this session can directly operate a real phone browser.
