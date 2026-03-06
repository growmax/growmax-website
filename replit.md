# Growmax LLC Corporate Website

## Overview
Professional corporate website for Growmax LLC (Apptino Software Private Limited), a B2B software company. Two product lines:
1. **Revenue Platform** — Enterprise SAP/ERP integrations for manufacturers (Siemens, Schwing Stetter, OBO Bettermann)
2. **Growmax ARC** — Zoho-integrated ordering platform for SMB distributors ($199/month)

## Architecture
- **Frontend**: React + Vite + Wouter (routing) + Tailwind CSS v4 + shadcn/ui components + react-helmet-async (SEO)
- **Backend**: Express.js API server with express-session for admin auth
- **Database**: PostgreSQL via Drizzle ORM (Neon serverless driver)
- **Design System**: Digital Brutalism / Swiss Engineering — IBM Plex Sans + IBM Plex Mono, radius: 0, Growmax Red accent (hsl 0 80% 50%)

## Key Files
- `client/src/App.tsx` — Router with all page routes (admin routes outside Navbar/Footer), HelmetProvider wrapper
- `client/src/index.css` — Design system tokens, grid utilities, custom CSS, marquee animation
- `client/src/components/SEOHead.tsx` — Reusable SEO meta tag component (title, description, OG, Twitter)
- `client/src/components/Breadcrumbs.tsx` — Reusable breadcrumb navigation component
- `client/src/lib/structuredData.ts` — JSON-LD structured data generators (Organization, Article, WebPage, ContactPage, SoftwareApplication, Product, AboutPage, FAQPage)
- `client/src/pages/Home.tsx` — Homepage with customer logo wall, partner marquee
- `client/src/pages/revenue-platform/RevenuePlatform.tsx` — Enterprise product page + compare alternatives banner + SoftwareApplication schema
- `client/src/pages/revenue-platform/CompareEnterprise.tsx` — Growmax vs Corevist vs SAP Commerce Cloud comparison
- `client/src/pages/arc/Arc.tsx` — ARC product page + compare alternatives banner + SoftwareApplication schema
- `client/src/pages/arc/Pricing.tsx` — ARC pricing page + Product/Offer schema
- `client/src/pages/arc/CompareB2BWave.tsx` — ARC vs B2B Wave comparison + cross-links
- `client/src/pages/arc/ComparePepperi.tsx` — ARC vs Pepperi comparison + cross-links
- `client/src/pages/comparisons/HandshakeAlternatives.tsx` — Best Handshake Alternatives comparison page (5 competitors)
- `client/src/pages/comparisons/TradeGeckoAlternatives.tsx` — Best TradeGecko/QuickBooks Commerce Alternatives page (5 competitors)
- `client/src/pages/solutions/SparePartsHub.tsx` — Spare Parts eCommerce pillar page with FAQ schema
- `client/src/pages/industries/ElectricalDistributors.tsx` — Electrical distributors industry landing page
- `client/src/pages/industries/IndustrialManufacturing.tsx` — Industrial manufacturing landing page
- `client/src/pages/industries/BuildingMaterials.tsx` — Building materials distributors landing page
- `client/src/pages/industries/FoodBeverage.tsx` — Food & Beverage distributors industry landing page
- `client/src/pages/industries/AutomotiveAftermarket.tsx` — Automotive Aftermarket & Spare Parts industry landing page
- `client/src/pages/Demo.tsx` — Demo request form (functional, saves to DB) + ContactPage schema
- `client/src/pages/company/About.tsx` — About/Team page + AboutPage schema
- `client/src/pages/blog/BlogList.tsx` — Blog index fetching from /api/blog, category filters, search
- `client/src/pages/blog/BlogPost.tsx` — Blog post detail page fetching from /api/blog/:slug + Article schema
- `client/src/pages/admin/AdminLogin.tsx` — Admin login (password-only, brutalist design)
- `client/src/pages/admin/AdminDashboard.tsx` — Admin dashboard (post list, search, filter, delete, publish toggle)
- `client/src/pages/admin/AdminPostEditor.tsx` — Admin post editor (create/edit, sections editor, preview modal)
- `client/src/data/blogPosts.ts` — Legacy blog post data (43 entries, now seeded into DB)
- `client/src/pages/legal/Privacy.tsx` — Privacy policy
- `client/src/pages/legal/Terms.tsx` — Terms of service
- `client/src/pages/not-found.tsx` — 404 page with SEOHead
- `client/src/components/layout/Navbar.tsx` — Fixed navbar with dropdown menus (Platform, ARC, Industries, Intelligence)
- `client/src/components/layout/Footer.tsx` — Footer with Solutions, Comparisons, Industries, Company sections
- `client/src/components/ui/BrandLogo.tsx` — Brand logo component
- `shared/schema.ts` — Database schema (demo_requests, newsletter_subscriptions, blog_posts, blog_redirects)
- `server/routes.ts` — API routes + admin auth + blog CRUD + dynamic sitemap.xml + robots.txt + 301 redirects
- `server/storage.ts` — Database storage interface with blog CRUD methods
- `server/index.ts` — Express app with session middleware
- `server/db.ts` — Database connection (Neon serverless)
- `scripts/seed-blog.ts` — Seed script for migrating 43 posts + 95 redirects into DB

## Routes
- `/` — Homepage
- `/revenue-platform` — Enterprise product
- `/revenue-platform/compare` — Enterprise competitor comparison
- `/revenue-platform/:feature` — Dynamic feature sub-pages
- `/arc` — ARC product
- `/arc/pricing` — ARC pricing
- `/arc/compare/b2b-wave` — ARC vs B2B Wave
- `/arc/compare/pepperi` — ARC vs Pepperi
- `/comparisons/handshake-alternatives` — Best Handshake Alternatives & Competitors
- `/comparisons/tradegecko-alternatives` — Best TradeGecko/QuickBooks Commerce Alternatives
- `/solutions/spare-parts-ecommerce` — Spare Parts eCommerce pillar page
- `/industries/electrical-distributors` — Electrical distributors landing
- `/industries/industrial-manufacturing` — Industrial manufacturing landing
- `/industries/building-materials` — Building materials landing
- `/industries/food-beverage` — Food & Beverage distributors landing
- `/industries/automotive-aftermarket` — Automotive Aftermarket & Spare Parts landing
- `/demo` — Demo request form
- `/company/about` — About page
- `/blog` — Blog index (43 posts from DB, category filters)
- `/blog/:slug` — Individual blog post (slug-based, from DB)
- `/privacy` — Privacy policy
- `/terms-of-service` — Terms of service
- `/admin/login` — Admin login page
- `/admin` — Admin dashboard (blog post management)
- `/admin/posts/new` — Create new blog post
- `/admin/posts/:id/edit` — Edit existing blog post
- `/sitemap.xml` — Dynamic XML sitemap (63 URLs, pulls blog slugs from DB)
- `/robots.txt` — Crawler directives (server-generated)

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
- `demo_requests` — Stores demo form submissions (firstName, lastName, email, company, companySize, modules[], message)
- `newsletter_subscriptions` — Stores email subscriptions (email, unique constraint)
- `blog_posts` — Blog posts (id serial, slug unique, title, category, date, author, authorTeam, readTime, excerpt, sections jsonb, relatedSlugs text[], published boolean, legacyUrl, createdAt, updatedAt)
- `blog_redirects` — URL redirects for old blog paths (id serial, oldPath unique, newPath, createdAt)

## Blog Admin System
- Password-based admin auth using ADMIN_PASSWORD env var
- Session-based authentication (express-session, cookie-based, sameSite: lax)
- Admin UI at /admin with brutalist design matching the site
- Dashboard: search/filter posts, view published status, create/edit/delete
- Post editor: title, slug (auto-generated), category dropdown, sections editor (add/remove), HTML content, preview modal, published toggle
- 43 posts seeded from legacy data, 95 old URL redirects configured
- Blog frontend reads from API with react-query (loading states, error handling)
- Dynamic sitemap pulls published post slugs from DB

## SEO Infrastructure
- **Meta Tags**: react-helmet-async with reusable SEOHead component on every page (including 404)
- **Structured Data**: JSON-LD for Organization, Article, WebPage, ContactPage, SoftwareApplication, Product, AboutPage, FAQPage
- **Sitemap**: Dynamic XML sitemap at /sitemap.xml covering 63 URLs (DB-driven blog slugs)
- **Robots.txt**: Allows all crawlers, points to sitemap at https://www.growmax.io/sitemap.xml
- **Breadcrumbs**: Monospace uppercase breadcrumbs on all interior pages
- **301 Redirects**: 95 old blog URLs mapped to new paths via blog_redirects table
- **Base URL**: https://www.growmax.io (consistent across sitemap and meta tags)

## Navigation
- **Navbar**: Dropdown menus for Platform Arc, Distributor Arc, Industries (5 pages), Intelligence (blog + comparisons + solutions)
- **Footer**: 4-column layout — Solutions (incl. Spare Parts), Comparisons (5 comparison pages), Industries (5 pages), Company
- **Internal Cross-Links**: Compare alternatives banners on product pages, related architecture sections on all pages
- **Breadcrumbs**: On blog posts, comparison pages, industry pages, pricing, about

## Design System Notes
- Fonts: IBM Plex Sans (body), IBM Plex Mono (metadata/labels)
- Colors: growmax-red (hsl 0 80% 50%), growmax-black (hsl 0 0% 5%), growmax-white (hsl 0 0% 98%)
- All corners: radius 0 (sharp edges)
- Hover states: hard translate, high-contrast inversions, shadow [8px_8px_0px]
- CSS utilities: bg-grid-blueprint, bg-grid-blueprint-dark, bg-dots, bg-dots-dark, text-stroke, animate-marquee
- Framing language: "Architecture" not "Products", "Deploy" not "Get Started", "Intelligence" for blog

## Target Market
US East Coast & Texas — Industrial and Electrical Distributors for enterprise-grade revenue operations platform.

## SEO Strategy
- Competitor comparison pages target: "Corevist alternative", "SAP Commerce Cloud alternative", "B2B Wave alternative", "Pepperi alternative", "Handshake alternatives", "TradeGecko alternatives"
- Industry landing pages target: "B2B ecommerce for electrical distributors", "industrial manufacturing B2B commerce", "building materials distributor platform", "food beverage B2B ecommerce", "automotive aftermarket ecommerce", "spare parts B2B platform"
- Solutions hub: Spare Parts eCommerce pillar page linking to all spare parts blog content
- Blog targets: 43 SEO-optimized articles covering partner engagement, CPQ, pipeline management, offline ordering, SAP integration, AI B2B, customer-specific pricing, dealer portal, spare parts, channel management keywords
