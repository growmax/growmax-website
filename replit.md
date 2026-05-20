# Growmax LLC Corporate Website

## Overview
Professional corporate website for Growmax (Webspot Growmax Commerce Private Limited, India / Growmax LLC, US), a B2B software company. Single-product strategy focused on:
1. **Growmax Enterprise** — Intelligent Revenue Operations Platform connecting sales reps, partners, and customers (multi-party ecosystem). SAP/Epicor integrations for 100+ employee manufacturers in industrial, electrical, construction, and building materials. Custom pricing.

**Note:** Growmax ARC (SMB product) has been removed from the website. All references have been replaced with Growmax Enterprise.

## Architecture
- **Framework**: Next.js 15 App Router (migrated from Vite + Express + Wouter)
- **Frontend**: React 19 + Next.js App Router + Tailwind CSS v4 + shadcn/ui components
- **Routing**: Next.js file-system routing (`app/` directory)
- **Auth**: iron-session (replaces express-session) — admin sessions stored in encrypted cookies
- **Database**: PostgreSQL via Drizzle ORM (`drizzle-orm/node-postgres` + `pg` Pool)
- **SSR**: Full Next.js server-side rendering — every page is a Server Component by default
- **SEO**: Next.js Metadata API (`export const metadata`) — no react-helmet-async needed
- **Design System**: Digital Brutalism / Swiss Engineering — IBM Plex Sans + IBM Plex Mono, radius: 0, Growmax Red accent (hsl 0 80% 50%)

## Key Files
- `app/layout.tsx` — Root layout (Navbar, Footer, TanStack Query provider, QueryClientProvider)
- `app/globals.css` — Design system tokens, grid utilities, custom CSS, marquee animation
- `app/page.tsx` — Homepage
- `app/blog/page.tsx` — Blog index server wrapper (exports metadata + JSON-LD)
- `app/blog/BlogListClient.tsx` — Blog list client component (search, filters, pagination)
- `app/blog/[slug]/page.tsx` — Blog post with ISR (`revalidate: 3600`)
- `app/sitemap.ts` — Dynamic XML sitemap (192+ URLs, DB-driven blog posts)
- `app/robots.ts` — Crawler directives
- `middleware.ts` — Dynamic blog slug redirects from DB (edge runtime, Neon HTTP driver)
- `lib/db.ts` — PostgreSQL pool (`drizzle-orm/node-postgres`)
- `lib/storage.ts` — Database storage interface (blog CRUD, demo requests, newsletter)
- `lib/structuredData.ts` — JSON-LD structured data generators
- `lib/queryClient.ts` — TanStack Query client + apiRequest helper
- `components/layout/Navbar.tsx` — Site navigation with dropdowns
- `components/layout/Footer.tsx` — Site footer
- `components/ui/WhichGrowmax.tsx` — Enterprise-only CTA section (used on all 12 industry pages)
- `components/SiloVsConnected.tsx` — Visual comparison diagram
- `app/admin/layout.tsx` — Admin bare layout (no Navbar/Footer)
- `app/admin/login/page.tsx` — Admin login (client component, iron-session)
- `app/admin/page.tsx` — Admin dashboard (client component)
- `app/admin/posts/PostEditor.tsx` — Shared post editor (new + edit)
- `next.config.ts` — Next.js config (ARC page redirects, image settings, allowed dev origins)
- `drizzle.config.ts` — Drizzle kit config
- `shared/schema.ts` — Canonical DB schema (also re-exported from `lib/schema.ts`)

## Routes
### Core Pages
- `/` — Homepage
- `/revenue-platform` — Enterprise product
- `/revenue-platform/compare` — Enterprise competitor comparison
- `/demo` — Demo request form
- `/company/about` — About page

### Competitor Alternatives (14 pages)
- `/comparisons/handshake-alternatives`
- `/comparisons/tradegecko-alternatives`
- `/comparisons/sana-commerce-alternatives`
- `/comparisons/orocommerce-alternatives`
- `/comparisons/bigcommerce-b2b-alternatives`
- `/comparisons/shopify-plus-b2b-alternatives`
- `/comparisons/magento-b2b-alternatives`
- `/comparisons/dynamics-365-commerce-alternatives`
- `/comparisons/salesforce-commerce-alternatives`
- `/comparisons/woocommerce-b2b-alternatives`
- `/comparisons/zoho-commerce-alternatives`
- `/comparisons/sap-commerce-cloud-alternatives`
- `/comparisons/oracle-commerce-alternatives`
- `/comparisons/netsuite-suitecommerce-alternatives`

### Industry Pages (12 pages)
- `/industries/electrical-distributors`
- `/industries/building-materials`
- `/industries/industrial-manufacturing`
- `/industries/food-beverage`
- `/industries/automotive-aftermarket`
- `/industries/plumbing-hvac`
- `/industries/janitorial-sanitation`
- `/industries/safety-ppe`
- `/industries/industrial-fasteners`
- `/industries/pump-valve`
- `/industries/chemical-distributors`
- `/industries/packaging-distributors`

### Content & Blog
- `/blog` — Blog index (154+ posts from DB)
- `/blog/[slug]` — Individual blog post (ISR, revalidates every hour)
- `/solutions/spare-parts-ecommerce` — Spare Parts pillar page
- `/write-for-us` — Guest contributor guidelines

### Legal & Admin
- `/privacy` — Privacy policy
- `/terms-of-service` — Terms of service
- `/admin/login` — Admin login
- `/admin` — Admin dashboard
- `/admin/posts/new` — Create post
- `/admin/posts/[id]/edit` — Edit post

### Generated
- `/sitemap.xml` — Dynamic XML sitemap (192+ URLs)
- `/robots.txt` — Crawler directives

## API Endpoints
- `GET /api/blog` — Published blog posts (public)
- `GET /api/blog/[slug]` — Single published post by slug (public)
- `POST /api/admin/login` — Admin login (iron-session)
- `POST /api/admin/logout` — Admin logout
- `GET /api/admin/session` — Check admin session status
- `GET /api/admin/posts` — All posts (admin, requires auth)
- `GET /api/admin/posts/[id]` — Single post by ID (admin)
- `POST /api/admin/posts` — Create post (admin)
- `PUT /api/admin/posts/[id]` — Update post (admin)
- `DELETE /api/admin/posts/[id]` — Delete post (admin)
- `POST /api/demo-requests` — Submit demo request (+ Google Chat webhook)
- `POST /api/newsletter` — Subscribe to newsletter

## Database Tables
- `demo_requests` — Demo form submissions
- `newsletter_subscriptions` — Email subscriptions
- `blog_posts` — Blog posts (154+ entries, sections as JSONB, relatedSlugs for cross-linking)
- `blog_redirects` — URL redirects for old blog paths

## SEO Infrastructure
- **SSR**: Full Next.js server-side rendering — all pages return complete HTML with SEO tags
- **Metadata API**: Every page exports `metadata` (title, description, canonical, OG, Twitter)
- **Structured Data**: JSON-LD for Organization, Article, WebPage, ContactPage, SoftwareApplication, Product, AboutPage, FAQPage, CollectionPage — rendered as `<script type="application/ld+json">` in server components
- **Sitemap**: `app/sitemap.ts` → 192+ URLs (static + DB-driven blog posts)
- **Robots**: `app/robots.ts`
- **Breadcrumbs**: Monospace uppercase breadcrumbs on all interior pages
- **301 Redirects**: Blog slug redirects via `middleware.ts` (edge, Neon HTTP driver); static ARC page redirects in `next.config.ts`
- **FAQ Schema**: On all comparison and industry pages
- **ISR**: Blog posts revalidate every 3600 seconds
- **Base URL**: https://www.growmax.io

## SEO Content Strategy
- **14 comparison pages** targeting "X alternatives" keywords
- **12 industry pages** targeting "[industry] B2B ecommerce" keywords
- **6 listicle blog posts** targeting "best [category] 2026" keywords
- **154+ blog posts** total
- **Blog SEO enhancements**: FAQ schema, CTAs, Related Articles, internal cross-links

## Design System Notes
- Fonts: IBM Plex Sans (body), IBM Plex Mono (metadata/labels)
- Colors: growmax-red (hsl 0 80% 50%), growmax-black (hsl 0 0% 5%), growmax-white (hsl 0 0% 98%)
- All corners: radius 0 (sharp edges)
- Hover states: hard translate, high-contrast inversions, shadow [8px_8px_0px]
- CSS utilities: bg-grid-blueprint, bg-grid-blueprint-dark, bg-dots, bg-dots-dark, text-stroke, animate-marquee
- Framing language: "Book a Demo", "About Us", "Intelligence" for blog
- Product naming: Always "Growmax Enterprise" (never "Revenue Platform" or "Enterprise Platform")

## External URLs
- **ARC App**: https://app.growmaxai.com
- **ARC Registration**: https://app.growmaxai.com/register
- **ARC Terms**: https://app.growmaxai.com/terms
- **ARC Privacy**: https://app.growmaxai.com/privacy

## Target Market
US Industrial and Electrical Distributors — nationwide coverage across all major manufacturing, construction, and distribution corridors.

## Branding
- **Logo assets** in `public/`: `/logo-white.png` (dark bg), `/logo-dark.png` (light bg), `/favicon.png`
- **Client logos**: `/images/siemens-logo.svg`, `/images/schwing-stetter-logo.png`, `/images/obo-bettermann-logo.svg`
- **ClientLogos.tsx**: Uses `size` prop (sm/md/lg) + `variant` (dark/light)
- **Company names**: India = "Webspot Growmax Commerce Private Limited, Chennai, India"; US = "Growmax LLC, US"

## User Preferences
- Port: 5000 (Replit requirement)
- No output:standalone needed for Replit deployment
- Admin CMS pages are `'use client'` components
- Blog list page uses server wrapper (`app/blog/page.tsx`) + client component (`BlogListClient.tsx`) pattern to enable `export const metadata` with client-side interactivity
