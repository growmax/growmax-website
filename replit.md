# Growmax LLC Corporate Website

## Overview
Professional corporate website for Growmax LLC (Apptino Software Private Limited), a B2B software company. Two product lines:
1. **Revenue Platform** — Enterprise SAP/ERP integrations for manufacturers (Siemens, Schwing Stetter, OBO Bettermann)
2. **Growmax ARC** — Zoho-integrated ordering platform for SMB distributors ($199/month)

## Architecture
- **Frontend**: React + Vite + Wouter (routing) + Tailwind CSS v4 + shadcn/ui components + react-helmet-async (SEO)
- **Backend**: Express.js API server
- **Database**: PostgreSQL via Drizzle ORM (Neon serverless driver)
- **Design System**: Digital Brutalism / Swiss Engineering — IBM Plex Sans + IBM Plex Mono, radius: 0, Growmax Red accent (hsl 0 80% 50%)

## Key Files
- `client/src/App.tsx` — Router with all page routes, HelmetProvider wrapper
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
- `client/src/pages/blog/BlogList.tsx` — Blog index with 43 posts, category filters, search
- `client/src/pages/blog/BlogPost.tsx` — Blog post detail page (slug-based routing) + Article schema
- `client/src/data/blogPosts.ts` — Blog post full content data (43 entries, all with full article content)
- `client/src/pages/legal/Privacy.tsx` — Privacy policy
- `client/src/pages/legal/Terms.tsx` — Terms of service
- `client/src/pages/not-found.tsx` — 404 page with SEOHead
- `client/src/components/layout/Navbar.tsx` — Fixed navbar with dropdown menus (Platform, ARC, Industries, Intelligence)
- `client/src/components/layout/Footer.tsx` — Footer with Solutions, Comparisons, Industries, Company sections
- `client/src/components/ui/BrandLogo.tsx` — Brand logo component
- `shared/schema.ts` — Database schema (demo_requests, newsletter_subscriptions)
- `server/routes.ts` — API routes + sitemap.xml (63 URLs) + robots.txt endpoints
- `server/storage.ts` — Database storage interface
- `server/db.ts` — Database connection (Neon serverless)

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
- `/blog` — Blog index (43 posts, category filters)
- `/blog/:slug` — Individual blog post (slug-based)
- `/privacy` — Privacy policy
- `/terms-of-service` — Terms of service
- `/sitemap.xml` — Dynamic XML sitemap (63 URLs, server-generated)
- `/robots.txt` — Crawler directives (server-generated)

## Database Tables
- `demo_requests` — Stores demo form submissions (firstName, lastName, email, company, companySize, modules[], message)
- `newsletter_subscriptions` — Stores email subscriptions (email, unique constraint)

## Blog System
- BlogList contains 43 posts with categories: B2B eCommerce, AI Insights, Partner Engagement, Spare Parts, Case Studies, Sales & Pipeline, Channel Management
- blogPostsData has 43 entries keyed by numeric ID ("001"-"043"), with slug field for URL matching
- All 43 posts have full article content with 3-4 sections each
- Lookup: `getPostBySlug(slug)` finds posts in blogPostsData by slug field
- Posts not found show a "Content Deployment Pending" placeholder

## SEO Infrastructure
- **Meta Tags**: react-helmet-async with reusable SEOHead component on every page (including 404)
- **Structured Data**: JSON-LD for Organization, Article, WebPage, ContactPage, SoftwareApplication, Product, AboutPage, FAQPage
- **Sitemap**: Dynamic XML sitemap at /sitemap.xml covering 63 URLs
- **Robots.txt**: Allows all crawlers, points to sitemap at https://www.growmax.io/sitemap.xml
- **Breadcrumbs**: Monospace uppercase breadcrumbs on all interior pages
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
