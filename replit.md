# Growmax LLC Corporate Website

## Overview
Professional corporate website for Growmax (Webspot Growmax Commerce Private Limited, India / Growmax LLC, US), a B2B software company. Single-product strategy focused on:
1. **Growmax Enterprise** — Intelligent Revenue Operations Platform connecting sales reps, partners, and customers (multi-party ecosystem). SAP/Epicor integrations for 100+ employee manufacturers in industrial, electrical, construction, and building materials. Custom pricing.

**Note:** Growmax ARC (SMB product) has been removed from the website. All references have been replaced with Growmax Enterprise. The 7 ARC-specific pages (`/arc`, `/arc/pricing`, and 5 `/arc/compare/*` pages) have been deleted.

## Architecture
- **Frontend**: React 19 + Vite + Wouter (routing) + Tailwind CSS v4 + shadcn/ui components + react-helmet-async (SEO meta tags)
- **Backend**: Express.js API server with express-session (connect-pg-simple PostgreSQL store) for admin auth
- **Database**: PostgreSQL via Drizzle ORM (Neon serverless driver)
- **SSR**: Full server-side rendering for SEO/AEO crawlability
  - `client/src/entry-server.tsx` — SSR render function using `renderToString`, extracts head tags (title, meta, canonical, JSON-LD) from rendered HTML via regex (React 19 workaround since react-helmet-async v3 HelmetProvider ignores context with React 19)
  - `client/src/entry-client.tsx` — Client hydration entry using `hydrateRoot` + TanStack Query `HydrationBoundary`
  - `server/vite.ts` — Dev SSR handler (uses `vite.ssrLoadModule`)
  - `server/static.ts` — Production SSR handler (loads pre-built server bundle)
  - `server/ssr-utils.ts` — SSR injection helpers (head tags, HTML, dehydrated state)
  - `script/build.ts` — Dual Vite build (client → `dist/public`, server → `dist/server`)
  - Blog pages prefetch data server-side via storage layer, serialized as `window.__REACT_QUERY_STATE__`
- **Design System**: Digital Brutalism / Swiss Engineering — IBM Plex Sans + IBM Plex Mono, radius: 0, Growmax Red accent (hsl 0 80% 50%)

## Key Files
- `client/src/App.tsx` — Router with all page routes (admin routes outside Navbar/Footer), HelmetProvider wrapper
- `client/src/index.css` — Design system tokens, grid utilities, custom CSS, marquee animation
- `client/src/components/SEOHead.tsx` — Reusable SEO meta tag component (title, description, OG, Twitter)
- `client/src/components/Breadcrumbs.tsx` — Reusable breadcrumb navigation component
- `client/src/lib/structuredData.ts` — JSON-LD structured data generators (Organization, Article, WebPage, ContactPage, SoftwareApplication, Product, AboutPage, FAQPage, CollectionPage)
- `client/src/pages/Home.tsx` — Homepage with ecosystem hero, visual ecosystem diagrams, architecture split (Enterprise + Demo CTA), customer logos
- `client/src/components/ui/WhichGrowmax.tsx` — Enterprise-only CTA section used on all 12 industry pages
- `client/src/pages/revenue-platform/RevenuePlatform.tsx` — Growmax Enterprise product page with ecosystem flow diagram + SoftwareApplication schema
- `client/src/pages/revenue-platform/CompareEnterprise.tsx` — Growmax vs Corevist vs SAP Commerce Cloud comparison
- `client/src/pages/comparisons/` — 14 comparison/alternatives pages (Handshake, TradeGecko, Sana Commerce, OroCommerce, BigCommerce B2B, Shopify Plus, Magento B2B, Dynamics 365, Salesforce Commerce, WooCommerce B2B, Zoho Commerce, SAP Commerce Cloud, Oracle Commerce, NetSuite SuiteCommerce) — all now position Growmax Enterprise as the top recommendation
- `client/src/pages/industries/` — 12 industry landing pages (Electrical, Building Materials, Industrial Manufacturing, Food & Beverage, Automotive Aftermarket, Plumbing & HVAC, Janitorial & Sanitation, Safety & PPE, Industrial Fasteners, Pump & Valve, Chemical, Packaging)
- `client/src/pages/solutions/SparePartsHub.tsx` — Spare Parts eCommerce pillar page with FAQ schema
- `client/src/pages/Demo.tsx` — Demo request form (functional, saves to DB) + ContactPage schema
- `client/src/pages/company/About.tsx` — About/Team page + AboutPage schema
- `client/src/pages/blog/BlogList.tsx` — Blog index with CollectionPage schema, category filters, search
- `client/src/pages/blog/BlogPost.tsx` — Blog post detail with Article schema + Related Articles
- `client/src/pages/WriteForUs.tsx` — Guest contributor page
- `client/src/pages/admin/` — Admin login, dashboard, post editor
- `client/src/pages/legal/` — Privacy Policy (aligned with app.growmaxai.com/privacy), Terms of Service (aligned with app.growmaxai.com/terms)
- `shared/schema.ts` — Database schema (demo_requests, newsletter_subscriptions, blog_posts, blog_redirects)
- `server/routes.ts` — API routes + admin auth + blog CRUD + dynamic sitemap.xml (152 URLs) + robots.txt + 301 redirects
- `server/storage.ts` — Database storage interface with blog CRUD methods
- `scripts/seed-blog.ts` — Seed script for blog posts + redirects
- `scripts/seed-listicle-posts.ts` — Seed script for 6 "best of" listicle blog posts

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
- `/blog` — Blog index (109+ posts from DB)
- `/blog/:slug` — Individual blog post
- `/solutions/spare-parts-ecommerce` — Spare Parts pillar page
- `/write-for-us` — Guest contributor guidelines

### Legal & Admin
- `/privacy` — Privacy policy
- `/terms-of-service` — Terms of service
- `/admin/login` — Admin login
- `/admin` — Admin dashboard
- `/admin/posts/new` — Create post
- `/admin/posts/:id/edit` — Edit post

### Generated
- `/sitemap.xml` — Dynamic XML sitemap (152 URLs: 44 static + 108 blog posts)
- `/robots.txt` — Crawler directives

## API Endpoints
- `GET /api/blog` — Published blog posts (public)
- `GET /api/blog/:slug` — Single published post by slug (public)
- `POST /api/admin/login` — Admin login (password check)
- `POST /api/admin/logout` — Admin logout
- `GET /api/admin/session` — Check admin session status
- `GET /api/admin/posts` — All posts (admin, requires auth)
- `GET /api/admin/posts/:id` — Single post by ID (admin)
- `POST /api/admin/posts` — Create post (admin)
- `PUT /api/admin/posts/:id` — Update post (admin)
- `DELETE /api/admin/posts/:id` — Delete post (admin)
- `POST /api/demo-requests` — Submit demo request
- `POST /api/newsletter` — Subscribe to newsletter

## Database Tables
- `demo_requests` — Demo form submissions
- `newsletter_subscriptions` — Email subscriptions
- `blog_posts` — Blog posts (109+ entries, sections as JSONB, relatedSlugs for cross-linking)
- `blog_redirects` — URL redirects for old blog paths

## SEO Infrastructure
- **SSR**: Full server-side rendering — all pages return complete HTML with SEO tags for Google, AI answer engines (Perplexity, SGE), and social crawlers
- **Canonical Tags**: Every page includes `<link rel="canonical">` via SEOHead component
- **Meta Tags**: SEOHead component manages ALL meta tags (title, description, og:type, og:title, og:description, og:url, og:image, twitter:card, twitter:site, twitter:title, twitter:description, twitter:image) — NO meta tags in index.html (only charset, viewport, favicon, fonts). SSR deduplication in `injectSSR()` strips any existing meta/title/canonical/LD+JSON from template before injecting SSR head tags.
- **Structured Data**: JSON-LD for Organization, Article, WebPage, ContactPage, SoftwareApplication, Product, AboutPage, FAQPage, CollectionPage
- **Sitemap**: Dynamic XML sitemap at /sitemap.xml (152 URLs, DB-driven blog posts)
- **Robots.txt**: Allows all crawlers, points to sitemap
- **Breadcrumbs**: Monospace uppercase breadcrumbs on all interior pages
- **301 Redirects**: Old blog URLs mapped to new paths
- **FAQ Schema**: On all comparison and industry pages for rich snippet eligibility
- **Base URL**: https://www.growmax.io

## SEO Content Strategy (Neil Patel Gap Analysis)
- **15 comparison pages** targeting "X alternatives" keywords for every major B2B commerce competitor
- **12 industry pages** targeting "[industry] B2B ecommerce" keywords
- **6 listicle blog posts** targeting "best [category] 2026" keywords (best-b2b-ecommerce-platforms-2026, best-b2b-ordering-apps-distributors, best-sap-b2b-commerce-solutions, best-dealer-portal-software-2026, best-spare-parts-management-software, top-wholesale-ordering-platforms-2026)
- **154 blog posts** total, including 7 competitor keyword-targeted posts (DSD guide, B2B sales tips, CRM vs SFA, trade promotions, push vs pull marketing, EDI vs eCommerce, B2B mobile ordering app)
- **Competitor keyword posts**: `scripts/competitor-keyword-posts.ts` — synced via `syncMissingPosts()` in auto-seed alongside `scripts/csv-imported-posts.ts`
- **Blog SEO enhancements**: 141 posts have FAQ schema, 143 have CTAs, 147 have Related Articles, 133 have internal cross-links
- **Comparison page upgrades**: Pepperi and B2B Wave comparison pages upgraded with FAQ schema, deep-dive analysis content, Quick Verdict sections, and internal links to blog posts

## Design System Notes
- Fonts: IBM Plex Sans (body), IBM Plex Mono (metadata/labels)
- Colors: growmax-red (hsl 0 80% 50%), growmax-black (hsl 0 0% 5%), growmax-white (hsl 0 0% 98%)
- All corners: radius 0 (sharp edges)
- Hover states: hard translate, high-contrast inversions, shadow [8px_8px_0px]
- CSS utilities: bg-grid-blueprint, bg-grid-blueprint-dark, bg-dots, bg-dots-dark, text-stroke, animate-marquee
- Framing language: "Book a Demo" (not "Initialize System"), "About Us" (not "Thesis & Team"), "Intelligence" for blog
- Product naming: Always "Growmax Enterprise" (never "Revenue Platform" or "Enterprise Platform"), always "Growmax ARC"
- Enterprise comparison pages: Position Growmax Enterprise with ecosystem story, custom pricing, SAP/Epicor (8 pages)
- ARC comparison pages: Position Growmax ARC with $199/mo, QuickBooks/Zoho/Xero (6 pages + 5 direct comparisons)

## External URLs
- **ARC App**: https://app.growmaxai.com
- **ARC Registration**: https://app.growmaxai.com/register (linked from ARC pricing, ARC page CTAs, ARC compare CTAs, legal pages)
- **ARC Terms**: https://app.growmaxai.com/terms (source of truth for Terms of Service content)
- **ARC Privacy**: https://app.growmaxai.com/privacy (source of truth for Privacy Policy content)

## Target Market
US Industrial and Electrical Distributors — nationwide coverage across all major manufacturing, construction, and distribution corridors.

## Branding
- **Logo assets** in `client/public/`: `/logo-white.png` (dark bg), `/logo-dark.png` (light bg), `/favicon.png`
- **Client logos**: `/images/siemens-logo.svg`, `/images/schwing-stetter-logo.png`, `/images/obo-bettermann-logo.svg`
- **ClientLogos.tsx**: Uses `size` prop (sm/md/lg) + `variant` (dark/light)
- **Company names**: India = "Webspot Growmax Commerce Private Limited, Chennai, India"; US = "Growmax LLC, US"
