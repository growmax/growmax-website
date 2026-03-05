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
- `client/src/pages/revenue-platform/CompareEnterprise.tsx` — Growmax vs Corevist vs SAP Commerce Cloud comparison
- `client/src/pages/arc/Arc.tsx` — ARC product page
- `client/src/pages/arc/Pricing.tsx` — ARC pricing page
- `client/src/pages/arc/CompareB2BWave.tsx` — ARC vs B2B Wave comparison
- `client/src/pages/arc/ComparePepperi.tsx` — ARC vs Pepperi comparison
- `client/src/pages/industries/ElectricalDistributors.tsx` — Electrical distributors industry landing page
- `client/src/pages/Demo.tsx` — Demo request form (functional, saves to DB)
- `client/src/pages/company/About.tsx` — About/Team page
- `client/src/pages/blog/BlogList.tsx` — Blog index with 43 posts, category filters, search
- `client/src/pages/blog/BlogPost.tsx` — Blog post detail page (slug-based routing)
- `client/src/data/blogPosts.ts` — Blog post full content data (9 entries, 6 with full articles)
- `client/src/pages/legal/Privacy.tsx` — Privacy policy
- `client/src/pages/legal/Terms.tsx` — Terms of service
- `client/src/components/layout/Navbar.tsx` — Fixed brutalist navbar
- `client/src/components/layout/Footer.tsx` — Footer with sitemap + Industries section
- `client/src/components/ui/BrandLogo.tsx` — Brand logo component
- `shared/schema.ts` — Database schema (demo_requests, newsletter_subscriptions)
- `server/routes.ts` — API routes (POST /api/demo-requests, POST /api/newsletter)
- `server/storage.ts` — Database storage interface
- `server/db.ts` — Database connection (Neon serverless)

## Routes
- `/` — Homepage
- `/revenue-platform` — Enterprise product
- `/revenue-platform/compare` — Enterprise competitor comparison
- `/arc` — ARC product
- `/arc/pricing` — ARC pricing
- `/arc/compare/b2b-wave` — ARC vs B2B Wave
- `/arc/compare/pepperi` — ARC vs Pepperi
- `/industries/electrical-distributors` — Electrical distributors landing
- `/demo` — Demo request form
- `/company/about` — About page
- `/blog` — Blog index (43 posts, category filters)
- `/blog/:slug` — Individual blog post (slug-based)
- `/privacy` — Privacy policy
- `/terms-of-service` — Terms of service

## Database Tables
- `demo_requests` — Stores demo form submissions (firstName, lastName, email, company, companySize, modules[], message)
- `newsletter_subscriptions` — Stores email subscriptions (email, unique constraint)

## Blog System
- BlogList contains 43 posts with categories: B2B eCommerce, AI Insights, Partner Engagement, Spare Parts, Case Studies, Sales & Pipeline, Channel Management
- blogPostsData has 9 entries keyed by numeric ID, with slug field for URL matching
- 6 posts have full article content with sections; 3 have sections: null (Coming Soon)
- Posts not in blogPostsData show a "Content Deployment Pending" placeholder via slug title formatting

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
- Competitor comparison pages target: "Corevist alternative", "SAP Commerce Cloud alternative", "B2B Wave alternative", "Pepperi alternative"
- Industry landing pages target: "B2B ecommerce for electrical distributors", "electrical wholesale ordering platform Texas"
- Blog targets: partner engagement, CPQ, pipeline management, offline ordering, SAP integration keywords
