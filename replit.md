# Growmax LLC Corporate Website

## Overview
Professional corporate website for Growmax LLC (Apptino Software Private Limited), a B2B software company. Two product lines:
1. **Revenue Platform** — Enterprise SAP/ERP integrations for manufacturers (Siemens, Schwing Stetter, OBO Bettermann)
2. **Growmax ARC** — Zoho-integrated ordering platform for SMB distributors ($199/month)

## Architecture
- **Frontend**: React + Vite + Wouter (routing) + Tailwind CSS v4 + shadcn/ui components
- **Backend**: Express.js API server
- **Database**: PostgreSQL via Drizzle ORM (Neon serverless driver)
- **Design System**: Digital Brutalism / Swiss Engineering — IBM Plex Sans + IBM Plex Mono, radius: 0, Growmax Red accent (hsl 0 80% 50%)

## Key Files
- `client/src/App.tsx` — Router with all page routes
- `client/src/index.css` — Design system tokens, grid utilities, custom CSS
- `client/src/pages/Home.tsx` — Homepage
- `client/src/pages/revenue-platform/RevenuePlatform.tsx` — Enterprise product page
- `client/src/pages/arc/Arc.tsx` — ARC product page
- `client/src/pages/arc/Pricing.tsx` — ARC pricing page
- `client/src/pages/Demo.tsx` — Demo request form (functional, saves to DB)
- `client/src/pages/company/About.tsx` — About/Team page
- `client/src/pages/blog/BlogList.tsx` — Blog index (with newsletter subscription)
- `client/src/pages/blog/BlogPost.tsx` — Individual blog post template
- `client/src/pages/legal/Privacy.tsx` — Privacy policy
- `client/src/pages/legal/Terms.tsx` — Terms of service
- `client/src/components/layout/Navbar.tsx` — Fixed brutalist navbar
- `client/src/components/layout/Footer.tsx` — Footer with sitemap
- `client/src/components/ui/BrandLogo.tsx` — Brand logo component
- `shared/schema.ts` — Database schema (demo_requests, newsletter_subscriptions)
- `server/routes.ts` — API routes (POST /api/demo-requests, POST /api/newsletter)
- `server/storage.ts` — Database storage interface
- `server/db.ts` — Database connection (Neon serverless)

## Database Tables
- `demo_requests` — Stores demo form submissions (firstName, lastName, email, company, companySize, modules[], message)
- `newsletter_subscriptions` — Stores email subscriptions (email, unique constraint)

## Design System Notes
- Fonts: IBM Plex Sans (body), IBM Plex Mono (metadata/labels)
- Colors: growmax-red (hsl 0 80% 50%), growmax-black (hsl 0 0% 5%), growmax-white (hsl 0 0% 98%)
- All corners: radius 0 (sharp edges)
- Hover states: hard translate, high-contrast inversions, shadow [8px_8px_0px]
- CSS utilities: bg-grid-blueprint, bg-grid-blueprint-dark, bg-dots, bg-dots-dark, text-stroke
- Framing language: "Architecture" not "Products", "Deploy" not "Get Started", "Intelligence" for blog

## Target Market
US East Coast & Texas — Industrial and Electrical Distributors for enterprise-grade revenue operations platform.

## SEO Strategy
See `client/src/lib/seo-plan.ts` for comprehensive SEO and LLM visibility strategy.