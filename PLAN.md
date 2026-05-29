# PlanaCasa — Implementation Plan

**Status:** Planning. No code written yet.
**Repo:** local git initialized (`main` branch). GitHub remote to be added when PAT is provided.
**Integrations live now:** Supabase. **Mocked for MVP:** PayMongo, Stripe, Resend.

---

## 1. Architectural decisions (locked before coding)

These are the choices I'd default to. Flag anything you want changed before Phase 1 starts.

| Area | Decision | Rationale |
|------|----------|-----------|
| Framework | **Next.js 14 App Router**, TypeScript strict | Per spec. RSC for SEO + perf on gallery/design pages. |
| Styling | **Tailwind + shadcn/ui**, CSS variables for design tokens | Per spec. Tokens live in `app/globals.css` so brand colors are one-line changes. |
| Fonts | `next/font/google` for Playfair Display, Inter, Cormorant Garamond | Self-hosted, zero CLS, no Google call at runtime. |
| Data layer | Supabase JS client; **server components** for reads, **route handlers** for mutations | Avoid client-side service-role key. Use RLS-protected anon key in browser. |
| Auth | Supabase Auth with `@supabase/ssr` middleware | Cookie-based sessions, works with App Router server components. |
| Forms | React Hook Form + Zod resolver | Per spec. Shared Zod schemas reused server-side in route handlers. |
| Payments (mock) | Interface `PaymentProvider` with `MockProvider` impl; real PayMongo/Stripe adapters slot in later | Lets us build the full checkout → success → email flow end-to-end without keys. |
| Email (mock) | `EmailService` interface with `ConsoleEmailService` for dev | Logs templates to console. Resend adapter added when key arrives. |
| File downloads | Supabase Storage signed URLs, expiry 30 days, 5-use counter enforced in DB via `purchases.download_count` increment in a route handler | Spec requirement; can't be enforced by Storage alone, needs server-side check. |
| Map | **Leaflet + react-leaflet** (no API key, free tiles) | Cheaper than Google Maps for MVP. Swap later if needed. |
| State | URL search params for gallery filters (shareable), Zustand only if a need appears | Avoid premature global state. |
| Image pipeline | `next/image` with Supabase Storage as remote pattern | Built-in optimization, AVIF/WebP. |
| Animations | Framer Motion for component-level, GSAP **only** for the hero parallax + stats counter | GSAP is heavy; isolate to where it earns its weight. |
| Testing | Playwright for one happy-path E2E (browse → purchase mock → download); Vitest for utils | Don't over-invest in tests before product-market fit. |

**Open questions for you** (not blockers — I'll default if you don't answer):
1. Admin auth: Supabase row in `users` with `role='admin'` column, or a separate `admin_users` table? *Default: add `role` enum to `users`.*
2. Two currencies (PHP/GBP per spec), but only PayMongo (PHP) + Stripe (international) listed. Stripe charges what currency? *Default: USD for international, with GBP option toggleable.*
3. The spec lists `purchases.currency` but no FX handling. *Default: store amount in the currency charged, no conversion math.*

---

## 2. Phase sequencing & rationale

The spec's 30 steps are correct but I'd reorder a few for safer iteration. Each phase ends at a demoable state.

### Phase 0 — Project skeleton (½ day)
- `create-next-app` with TS, Tailwind, App Router, ESLint
- shadcn/ui init, install base components (button, card, input, dialog, sheet, dropdown, badge, skeleton)
- Tailwind config: brand colors, fonts, custom shadows
- Folder structure per spec
- `.env.local.example` with all required vars
- Husky + lint-staged + prettier (cheap insurance)
- First commit

### Phase 1 — Supabase + design system + chrome (1–2 days)
- Supabase project: run migration SQL for **all 10 tables** at once (see §3)
- RLS policies for every table (see §4)
- Seed script: 12 designs, 6 contractors, 5 guides, calculator data for NCR + 3 regions
- `lib/supabase/{client,server,middleware}.ts`
- Auth pages (login, register, forgot password) — minimal but functional
- Navbar (sticky, shrinks on scroll), Footer, MobileMenu, bottom nav for mobile
- Design tokens locked in `globals.css`, typography scale defined
- **Demoable:** can sign up, log in, see chrome on a placeholder homepage

### Phase 2 — Homepage (1–2 days)
All 12 sections + animations. This is the brand statement — do it once, do it right.
- ScrollReveal HOC and AnimatedCounter built here, reused everywhere
- Hero parallax with GSAP ScrollTrigger
- Featured designs pulled from real Supabase data
- Newsletter form writes to `newsletter_subscribers`
- **Demoable:** marketing-quality homepage with real data

### Phase 3 — Gallery + Design detail (2 days)
- Gallery: URL-driven filters, infinite scroll (intersection observer), masonry grid, skeleton loading
- Design page: image lightbox, tabbed content, sticky purchase sidebar (mobile: bottom bar)
- Wishlist (requires auth) — heart toggle writes to `wishlists`
- Share buttons (FB, Messenger, Viber, WhatsApp, Pinterest) — Web Share API + fallbacks
- **Demoable:** full browsing flow

### Phase 4 — Checkout + dashboard (2 days)
- Checkout page with package selection, buyer details, mock payment selector
- `MockProvider`: simulates success/failure via toggle, writes `purchases` row, calls `EmailService.sendPurchaseConfirmation`
- Success page with download buttons (signed URL endpoint enforces 5-use limit)
- Dashboard: purchases, wishlist, customization requests, settings
- **Demoable:** end-to-end purchase using mock payment

### Phase 5 — Marketplace + tools (2 days)
- Constructor marketplace (map view via Leaflet, list view)
- Contractor profile pages with reviews
- Quote request modal (writes lead row, mock email to contractor)
- Cost calculator (no DB writes, pure calculation off `cost_calculator_data`)
- DIY guides (read-only listing + markdown render via `react-markdown`)
- Customization request flow

### Phase 6 — Admin + legal + polish (1–2 days)
- Admin layout with sidebar, route protection via middleware checking `role='admin'`
- Designs/contractors/orders/guides CRUD
- Legal pages (terms, privacy, disclaimer) — content per spec
- SEO metadata API on every route, dynamic OG for design pages, sitemap.ts, robots.ts
- PWA: manifest + service worker via `next-pwa`
- Performance pass: bundle analyzer, image audit, lighthouse mobile run

### Phase 7 — Real integrations (when keys arrive)
- Resend adapter swap
- PayMongo adapter + webhook route
- Stripe adapter + webhook route
- Smoke-test each end-to-end on Vercel preview

**Total estimate:** ~12 working days for a single developer to reach Phase 6 demoable.

---

## 3. Database migrations

All 10 tables get created in a single migration file: `supabase/migrations/0001_init.sql`. This includes:

- All tables per spec
- Enums: `design_style`, `guide_category`, `customization_status`, `listing_tier`, `user_role`
- Indexes on: `designs(slug)`, `designs(style)`, `designs(featured)`, `contractors(province)`, `contractors(is_verified, is_featured)`, `purchases(user_id)`, `wishlists(user_id, design_id)` unique
- Triggers: `updated_at` auto-update on `designs`, average rating recompute on `contractor_reviews` insert/update/delete
- Seed file: `supabase/seed.sql`

One additions vs spec: `users.role user_role not null default 'customer'` for admin gating.

---

## 4. RLS policies (key ones)

| Table | Policy |
|-------|--------|
| `designs`, `guides`, `contractors`, `cost_calculator_data` | Public read, admin write |
| `purchases` | Owner read, server-side insert only (service role) |
| `wishlists` | Owner read/write |
| `customization_requests` | Owner read/write own, admin read all |
| `contractor_reviews` | Public read, authenticated insert (with FK check that user has a `purchases` row), owner update/delete |
| `users` | Owner read/update own, admin read all |
| `newsletter_subscribers` | Anon insert (with rate-limit at route handler), admin read |

---

## 5. What I'm deliberately NOT building in MVP

Avoiding scope creep — flag any of these as required and I'll add them:

- Multi-language (EN/Tagalog toggle)
- In-app messaging between users and contractors (we just log the lead)
- Real-time notifications
- A/B testing infrastructure
- Affiliate/referral program
- Coupon/promo code engine (the field exists in checkout but won't validate against real codes yet)
- Refund flow (spec says no refunds)
- Mobile native app (PWA only)
- Contractor self-service signup portal (admin manually approves for now)

---

## 6. Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Spec asks for premium-magazine visual quality but provides no design files | I'll build to the spec's color/font/animation rules and use [unsplash.com](https://unsplash.com) placeholders for hero/design imagery in dev. You'll need to source real renders before launch. |
| Download enforcement (5 uses, 30 days) is non-trivial — Storage signed URLs don't track usage | Route handler `/api/downloads/[purchaseId]/[fileIndex]` checks `download_count < max_downloads`, increments, then 302s to a freshly-signed URL with short expiry (5min). |
| Webhook security for PayMongo/Stripe (Phase 7) | Verify HMAC signature in route handler, reject on mismatch, idempotency via `transaction_id` unique constraint. |
| Filipino mobile users on slow connections | Aggressive image optimization, RSC for first paint, defer GSAP/Framer to interaction. Lighthouse mobile target: 90+ perf. |
| Climate adaptation copy needs domain expertise | Placeholder text in seed data; flagged for your subject-matter review before launch. |
| `cost_calculator_data` needs real Philippine regional cost figures | I'll seed with plausible ranges sourced from public data (PSA, contractor blogs) and mark as "for reference only" prominently. |

---

## 7. Definition of done (per page)

Before any page is marked complete:
- Mobile (375px) and desktop (1280px) verified visually
- Loading skeleton, empty state, error state all implemented
- Lighthouse mobile run, perf > 85
- Keyboard nav works, focus rings visible
- Real Supabase data (no hardcoded mocks in components)

---

## 8. Immediate next step

If this plan looks right, I'll start **Phase 0** (project skeleton) and **Phase 1** (Supabase migrations + chrome) in one go — they're tightly coupled and produce the first demoable build.

**Before I do, I need from you:**
1. Supabase project URL + anon key + service role key (to put in `.env.local`)
2. Confirmation on the three "open questions" in §1, or "use your defaults"
3. Any visual reference sites/decks you want me to match beyond "Airbnb meets Archdaily meets Apple"
