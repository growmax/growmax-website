import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";

const categories = [
  "All",
  "B2B eCommerce",
  "AI Insights",
  "Partner Engagement",
  "Spare Parts",
  "Case Studies",
  "Sales & Pipeline",
  "Channel Management",
] as const;

type Category = (typeof categories)[number];

interface BlogPost {
  title: string;
  category: Exclude<Category, "All">;
  date: string;
  slug: string;
  author: string;
  excerpt: string;
}

const posts: BlogPost[] = [
  {
    title: "Bridging the Digital Gap: Why Industrial Brands Need a Partner Engagement Strategy",
    category: "Partner Engagement",
    date: "Jan 15, 2026",
    slug: "partner-engagement-strategy-industrial-brands",
    author: "Growmax Team",
    excerpt: "Industrial brands that fail to digitize partner engagement risk losing market share. Learn how a modern partner portal transforms channel performance."
  },
  {
    title: "Opportunity Pipeline Management – Your Data-Driven Path to Predictable Revenue",
    category: "Sales & Pipeline",
    date: "Feb 03, 2026",
    slug: "opportunity-pipeline-management-predictable-revenue",
    author: "Growmax Team",
    excerpt: "Discover how data-driven pipeline management helps industrial businesses forecast revenue accurately and close deals faster."
  },
  {
    title: "Why an Offline Order-Taking App is Essential for Industrial B2B Sales",
    category: "B2B eCommerce",
    date: "Mar 12, 2026",
    slug: "offline-order-taking-app-industrial-b2b-sales",
    author: "Growmax Team",
    excerpt: "Field sales reps in industrial distribution need tools that work without internet. Explore why offline-first order apps are game changers."
  },
  {
    title: "Revamping the Order Process: OBO Bettermann's Digital Transformation",
    category: "Case Studies",
    date: "Nov 20, 2025",
    slug: "obo-bettermann-digital-transformation-case-study",
    author: "Growmax Team",
    excerpt: "How OBO Bettermann, a global electrical systems manufacturer, modernized their order process and achieved 40% faster order-to-delivery cycles."
  },
  {
    title: "Complexity is NOT Bad: Modeling Multi-Tier B2B Pricing",
    category: "B2B eCommerce",
    date: "Oct 05, 2025",
    slug: "multi-tier-b2b-pricing-modeling",
    author: "Growmax Team",
    excerpt: "Multi-tier pricing in B2B isn't a problem to simplify — it's a competitive advantage to model. Learn how to build pricing engines that scale."
  },
  {
    title: "Digital Enabled FMCG Wholesale: Benefits of Launching Self-Ordering Apps",
    category: "B2B eCommerce",
    date: "Jun 10, 2024",
    slug: "digital-enabled-fmcg-wholesale-self-ordering-apps",
    author: "Growmax Team",
    excerpt: "Self-ordering apps are transforming FMCG wholesale distribution. Explore the ROI of empowering retailers to place orders digitally."
  },
  {
    title: "A Comprehensive Sales Order Booking App for Zoho Inventory",
    category: "Sales & Pipeline",
    date: "Jun 15, 2024",
    slug: "sales-order-booking-app-zoho-inventory",
    author: "Growmax Team",
    excerpt: "Integrating a mobile order booking app with Zoho Inventory streamlines B2B sales operations. See how to implement this workflow."
  },
  {
    title: "Transforming Your Digital Landscape: Integrating Third-Party Apps with SAP ECC",
    category: "B2B eCommerce",
    date: "Jul 20, 2024",
    slug: "integrating-third-party-apps-sap-ecc",
    author: "Growmax Team",
    excerpt: "SAP ECC integration doesn't have to be painful. Learn proven approaches to connecting your B2B commerce layer with SAP using JCo and RFC."
  },
  {
    title: "The Quotation-to-Order Process: Converting Marketing Investments to Revenue",
    category: "Sales & Pipeline",
    date: "Aug 05, 2024",
    slug: "quotation-to-order-process-converting-revenue",
    author: "Growmax Team",
    excerpt: "The gap between quoting and ordering is where revenue leaks. See how to bridge the quotation-to-order lifecycle for B2B manufacturers."
  },
  {
    title: "The Digital Partner Engagement Revolution in Industrial Manufacturing",
    category: "Partner Engagement",
    date: "Sep 12, 2024",
    slug: "digital-partner-engagement-revolution-manufacturing",
    author: "Growmax Team",
    excerpt: "Partner portals are no longer optional for industrial manufacturers. Learn how digital engagement drives channel revenue growth."
  },
  {
    title: "The Ultimate Guide to CPQ Software for Small and Medium-Scale Industrial Businesses",
    category: "B2B eCommerce",
    date: "Oct 18, 2024",
    slug: "cpq-software-guide-small-medium-industrial-businesses",
    author: "Growmax Team",
    excerpt: "Configure-Price-Quote (CPQ) software isn't just for enterprises. Discover how SMB manufacturers can leverage CPQ to close deals 3x faster."
  },
  {
    title: "Bridging the Partner Visibility Gap: Quotation-to-Order Process",
    category: "Partner Engagement",
    date: "Nov 02, 2024",
    slug: "bridging-partner-visibility-gap-quotation-order",
    author: "Growmax Team",
    excerpt: "Channel partners lose deals when they can't track quotation status. See how visibility into the quote-to-order cycle transforms partner performance."
  },
  {
    title: "How AI is Reshaping B2B eCommerce for Industrial Distributors",
    category: "AI Insights",
    date: "Dec 01, 2024",
    slug: "ai-reshaping-b2b-ecommerce-industrial-distributors",
    author: "Growmax Team",
    excerpt: "From predictive ordering to intelligent product search, AI is fundamentally changing how industrial distributors sell online."
  },
  {
    title: "AI-Powered Product Recommendations for B2B Spare Parts Catalogs",
    category: "AI Insights",
    date: "Jan 10, 2025",
    slug: "ai-powered-product-recommendations-spare-parts",
    author: "Growmax Team",
    excerpt: "Machine learning can predict which spare parts a customer needs next. Explore AI recommendation engines built for industrial catalogs."
  },
  {
    title: "Spare Parts eCommerce: Building a Self-Service Portal for After-Sales Revenue",
    category: "Spare Parts",
    date: "Feb 14, 2025",
    slug: "spare-parts-ecommerce-self-service-portal",
    author: "Growmax Team",
    excerpt: "After-sales spare parts represent 30-50% of manufacturer revenue. Learn how to build a self-service spare parts portal that scales."
  },
  {
    title: "Why Manufacturers Need a Dedicated Spare Parts Ordering System",
    category: "Spare Parts",
    date: "Mar 08, 2025",
    slug: "manufacturers-dedicated-spare-parts-ordering-system",
    author: "Growmax Team",
    excerpt: "Generic eCommerce platforms fail at spare parts. Discover why manufacturers need purpose-built systems for parts identification and ordering."
  },
  {
    title: "How to Build an Effective B2B eCommerce Strategy for Industrial Manufacturers",
    category: "B2B eCommerce",
    date: "Apr 05, 2025",
    slug: "b2b-ecommerce-strategy-industrial-manufacturers",
    author: "Growmax Team",
    excerpt: "Building a B2B eCommerce strategy for industrial manufacturing requires unique considerations. Here's your comprehensive playbook."
  },
  {
    title: "Channel Partner Management: From Spreadsheets to Digital Platforms",
    category: "Channel Management",
    date: "May 12, 2025",
    slug: "channel-partner-management-spreadsheets-to-digital",
    author: "Growmax Team",
    excerpt: "Most manufacturers still manage channel partners via email and spreadsheets. See how digital platforms transform channel operations."
  },
  {
    title: "The Role of AI in Predictive Inventory Management for Distributors",
    category: "AI Insights",
    date: "Jun 20, 2025",
    slug: "ai-predictive-inventory-management-distributors",
    author: "Growmax Team",
    excerpt: "AI-driven demand forecasting reduces stockouts by 35% and overstock by 25%. Learn how distributors are implementing predictive inventory."
  },
  {
    title: "Building a Multi-Warehouse B2B eCommerce Platform: Architecture Guide",
    category: "B2B eCommerce",
    date: "Jul 15, 2025",
    slug: "multi-warehouse-b2b-ecommerce-platform-architecture",
    author: "Growmax Team",
    excerpt: "Multi-warehouse fulfillment is critical for B2B distributors. This architecture guide covers inventory sync, routing, and real-time availability."
  },
  {
    title: "How Industrial Manufacturers Can Leverage AI for Sales Forecasting",
    category: "AI Insights",
    date: "Aug 10, 2025",
    slug: "industrial-manufacturers-ai-sales-forecasting",
    author: "Growmax Team",
    excerpt: "Sales forecasting in industrial manufacturing is notoriously difficult. AI models trained on order history can improve accuracy by 40%."
  },
  {
    title: "The Complete Guide to B2B Customer-Specific Pricing",
    category: "B2B eCommerce",
    date: "Sep 01, 2025",
    slug: "complete-guide-b2b-customer-specific-pricing",
    author: "Growmax Team",
    excerpt: "Every B2B customer expects their negotiated price. Learn how to implement customer-specific, contract-based, and tier pricing at scale."
  },
  {
    title: "Dealer Portal Best Practices for Industrial Equipment Manufacturers",
    category: "Channel Management",
    date: "Sep 18, 2025",
    slug: "dealer-portal-best-practices-industrial-equipment",
    author: "Growmax Team",
    excerpt: "A well-designed dealer portal increases channel sales by 25%+. Discover the must-have features for industrial equipment dealer portals."
  },
  {
    title: "Case Study: How a Chemical Distributor Increased Online Orders by 300%",
    category: "Case Studies",
    date: "Oct 12, 2025",
    slug: "chemical-distributor-increased-online-orders-case-study",
    author: "Growmax Team",
    excerpt: "A specialty chemical distributor migrated from phone/fax ordering to digital B2B commerce and saw a 300% increase in online order volume."
  },
  {
    title: "Automating the Sales Pipeline for Industrial Distributors",
    category: "Sales & Pipeline",
    date: "Nov 05, 2025",
    slug: "automating-sales-pipeline-industrial-distributors",
    author: "Growmax Team",
    excerpt: "Manual pipeline tracking costs distributors 15+ hours per week. Learn how automation transforms lead-to-close for industrial sales teams."
  },
  {
    title: "Partner Onboarding Automation: Reducing Time-to-Revenue for Channel Sales",
    category: "Partner Engagement",
    date: "Dec 10, 2025",
    slug: "partner-onboarding-automation-time-to-revenue",
    author: "Growmax Team",
    excerpt: "Slow partner onboarding delays revenue. Discover how automated onboarding workflows cut time-to-first-order from weeks to days."
  },
  {
    title: "Spare Parts Identification: Using AI for Visual Part Lookup",
    category: "Spare Parts",
    date: "Jan 22, 2026",
    slug: "spare-parts-identification-ai-visual-lookup",
    author: "Growmax Team",
    excerpt: "AI-powered visual part identification lets technicians snap a photo to find the right spare part. See how this technology works in practice."
  },
  {
    title: "Building a B2B Marketplace for Industrial MRO Supplies",
    category: "B2B eCommerce",
    date: "Feb 18, 2026",
    slug: "b2b-marketplace-industrial-mro-supplies",
    author: "Growmax Team",
    excerpt: "MRO procurement is ripe for digital transformation. Learn how to build a B2B marketplace connecting MRO suppliers with industrial buyers."
  },
  {
    title: "How to Migrate from Legacy EDI to Modern B2B Commerce",
    category: "B2B eCommerce",
    date: "Mar 25, 2026",
    slug: "migrate-legacy-edi-modern-b2b-commerce",
    author: "Growmax Team",
    excerpt: "EDI served B2B commerce for decades, but modern APIs and platforms offer more flexibility. Here's your migration roadmap."
  },
  {
    title: "AI Chatbots for B2B Customer Service: Industrial Use Cases",
    category: "AI Insights",
    date: "Apr 08, 2026",
    slug: "ai-chatbots-b2b-customer-service-industrial",
    author: "Growmax Team",
    excerpt: "AI chatbots trained on product catalogs and order history can handle 60% of B2B customer inquiries. See real industrial deployments."
  },
  {
    title: "The ROI of Digital Channel Management for Building Materials Distributors",
    category: "Channel Management",
    date: "Apr 22, 2026",
    slug: "roi-digital-channel-management-building-materials",
    author: "Growmax Team",
    excerpt: "Building materials distributors managing 500+ dealer relationships see 3x ROI from digital channel management platforms within 12 months."
  },
  {
    title: "Case Study: Electrical Distributor Cuts Order Processing Time by 70%",
    category: "Case Studies",
    date: "May 05, 2026",
    slug: "electrical-distributor-order-processing-case-study",
    author: "Growmax Team",
    excerpt: "A mid-size electrical distributor deployed Growmax and reduced order processing time from 45 minutes to under 12 minutes per order."
  },
  {
    title: "Sales Territory Management for Industrial B2B Companies",
    category: "Sales & Pipeline",
    date: "May 20, 2026",
    slug: "sales-territory-management-industrial-b2b",
    author: "Growmax Team",
    excerpt: "Effective territory management ensures reps cover the right accounts. Learn data-driven approaches to territory design for industrial sales."
  },
  {
    title: "Building Customer-Specific Product Catalogs for B2B Commerce",
    category: "B2B eCommerce",
    date: "Jun 08, 2026",
    slug: "customer-specific-product-catalogs-b2b-commerce",
    author: "Growmax Team",
    excerpt: "Not every customer should see every product. Learn how customer-specific catalogs improve conversion and reduce pricing errors in B2B."
  },
  {
    title: "Partner Performance Analytics: Metrics That Drive Channel Growth",
    category: "Partner Engagement",
    date: "Jun 22, 2026",
    slug: "partner-performance-analytics-channel-growth",
    author: "Growmax Team",
    excerpt: "What gets measured gets managed. Discover the KPIs and dashboards that top industrial brands use to drive partner channel growth."
  },
  {
    title: "Spare Parts Pricing Strategy: Balancing Margin and Customer Retention",
    category: "Spare Parts",
    date: "Jul 10, 2026",
    slug: "spare-parts-pricing-strategy-margin-retention",
    author: "Growmax Team",
    excerpt: "Spare parts pricing is a balancing act — too high and you lose customers to aftermarket, too low and you leave margin on the table."
  },
  {
    title: "How to Implement Tiered Pricing for B2B Wholesale Distribution",
    category: "B2B eCommerce",
    date: "Jul 28, 2026",
    slug: "implement-tiered-pricing-b2b-wholesale-distribution",
    author: "Growmax Team",
    excerpt: "Tiered pricing based on volume, customer type, and contract terms is essential for wholesale. Here's how to implement it without complexity."
  },
  {
    title: "AI-Driven Lead Scoring for Industrial Sales Teams",
    category: "AI Insights",
    date: "Aug 15, 2026",
    slug: "ai-driven-lead-scoring-industrial-sales",
    author: "Growmax Team",
    excerpt: "Not all leads are equal. AI lead scoring models help industrial sales teams focus on prospects most likely to convert to high-value accounts."
  },
  {
    title: "Channel Conflict Resolution: Strategies for Multi-Channel Industrial Sales",
    category: "Channel Management",
    date: "Sep 03, 2026",
    slug: "channel-conflict-resolution-multi-channel-industrial",
    author: "Growmax Team",
    excerpt: "Selling direct while maintaining dealer relationships creates conflict. Learn proven strategies for harmonizing multi-channel B2B sales."
  },
  {
    title: "Case Study: Fastener Distributor Grows Revenue 45% with Digital Commerce",
    category: "Case Studies",
    date: "Sep 20, 2026",
    slug: "fastener-distributor-revenue-growth-case-study",
    author: "Growmax Team",
    excerpt: "A fastener distributor serving the automotive and aerospace sectors grew revenue 45% in 18 months after launching a B2B commerce platform."
  },
  {
    title: "Integrating Zoho CRM with B2B eCommerce: A Complete Guide",
    category: "Sales & Pipeline",
    date: "Oct 08, 2026",
    slug: "integrating-zoho-crm-b2b-ecommerce-guide",
    author: "Growmax Team",
    excerpt: "Zoho CRM is widely used by industrial companies. Learn how to integrate it with your B2B commerce platform for seamless sales operations."
  },
  {
    title: "The Future of B2B Commerce: Headless Architecture for Manufacturers",
    category: "B2B eCommerce",
    date: "Oct 25, 2026",
    slug: "future-b2b-commerce-headless-architecture-manufacturers",
    author: "Growmax Team",
    excerpt: "Headless commerce decouples the frontend from the backend, giving manufacturers flexibility to serve dealers, reps, and customers from one platform."
  },
  {
    title: "How AI Transforms After-Sales Service in Industrial Manufacturing",
    category: "AI Insights",
    date: "Nov 12, 2026",
    slug: "ai-transforms-after-sales-service-manufacturing",
    author: "Growmax Team",
    excerpt: "Predictive maintenance, automated warranty claims, and intelligent parts recommendations — AI is revolutionizing industrial after-sales service."
  },
];

export default function BlogList() {
  const [subEmail, setSubEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const subMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/newsletter", { email: subEmail });
      return res.json();
    },
    onSuccess: () => setSubEmail(""),
  });

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      <SEOHead
        title="Growmax Intelligence | B2B Commerce & Industrial Distribution Insights"
        description="Technical papers, case studies, and insights on B2B eCommerce, industrial distribution, AI in commerce, partner engagement, and revenue operations."
        path="/blog"
      />
      {/* Hero */}
      <section className="pt-24 pb-16 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">
             Intelligence // Documentation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-blog-title">
            Technical papers & <br />
            <span className="text-gray-400">system logic.</span>
          </h1>
          
          <div className="relative max-w-2xl mt-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              className="pl-12 h-14 bg-white rounded-none border-growmax-black focus:ring-growmax-red font-mono text-sm placeholder:text-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
              placeholder="QUERY DOCUMENTATION..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-blog-search"
            />
          </div>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="border-b border-gray-200 bg-white sticky top-16 z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex overflow-x-auto gap-0 -mb-px scrollbar-hide" data-testid="tabs-category-filter">
            {categories.map((cat) => {
              const count = cat === "All" ? posts.length : posts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`tab-category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className={`
                    whitespace-nowrap px-4 py-4 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors shrink-0
                    ${activeCategory === cat
                      ? "border-growmax-red text-growmax-red font-bold"
                      : "border-transparent text-gray-500 hover:text-growmax-black hover:border-gray-300"
                    }
                  `}
                >
                  {cat} <span className="text-gray-400 ml-1">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Post Index - Brutalist List */}
      <section className="py-12 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-growmax-black text-xs font-mono font-bold uppercase tracking-widest text-growmax-black">
            <div className="col-span-2 hidden md:block">Category</div>
            <div className="col-span-12 md:col-span-6">Document Title</div>
            <div className="col-span-2 hidden md:block">Author</div>
            <div className="col-span-2 hidden md:block text-right">Date</div>
          </div>
          
          <div className="flex flex-col">
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center font-mono text-sm text-gray-400 uppercase tracking-widest" data-testid="text-no-results">
                No documents match your query.
              </div>
            ) : (
              filteredPosts.map((post, i) => (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="group border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors block" data-testid={`link-blog-post-${i}`}>
                  <div className="grid grid-cols-12 gap-4 py-6 items-start">
                    <div className="col-span-2 hidden md:block font-mono text-xs uppercase text-growmax-black pt-1">
                      <span className="bg-gray-100 px-2 py-1 border border-gray-200 group-hover:border-growmax-black transition-colors">
                        {post.category}
                      </span>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="flex items-center justify-between md:block">
                        <h2 className="text-xl font-bold text-growmax-black tracking-tight group-hover:text-growmax-red transition-colors pr-4">
                          {post.title}
                        </h2>
                        <ArrowRight className="w-5 h-5 text-growmax-red md:hidden shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="md:hidden mt-2 flex items-center gap-3">
                        <span className="font-mono text-xs uppercase text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">
                          {post.category}
                        </span>
                        <span className="font-mono text-xs text-gray-400">{post.date}</span>
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:block font-mono text-xs text-gray-500 pt-1">
                      {post.author}
                    </div>
                    <div className="col-span-2 hidden md:block font-mono text-xs text-right text-gray-500 pt-1">
                      {post.date}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="font-mono text-xs text-gray-400 uppercase tracking-widest text-center" data-testid="text-post-count">
              Showing {filteredPosts.length} of {posts.length} documents
            </div>
          </div>
        </div>
      </section>

      {/* Intelligence CTA */}
      <section className="py-24 bg-growmax-black text-white border-t border-gray-800 bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-growmax-red flex items-center justify-center mx-auto mb-8 border border-white/20">
             <ArrowRight className="w-8 h-8 text-white -rotate-45" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6 uppercase">Stay synchronized with B2B commerce logic.</h2>
          {subMutation.isSuccess ? (
            <div className="flex items-center justify-center gap-3 mt-8 font-mono text-sm text-growmax-red uppercase tracking-widest" data-testid="text-subscribed">
              <CheckCircle className="w-5 h-5" /> Subscribed Successfully
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto mt-8" onSubmit={(e) => { e.preventDefault(); subMutation.mutate(); }}>
              <Input 
                placeholder="ENTER WORK EMAIL" 
                type="email"
                required
                data-testid="input-newsletter-email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="h-14 bg-white/5 border-gray-700 rounded-none text-white font-mono text-sm placeholder:text-gray-500 focus:border-growmax-red" 
              />
              <Button
                type="submit"
                data-testid="button-subscribe"
                disabled={subMutation.isPending}
                className="h-14 bg-growmax-red hover:bg-white hover:text-growmax-black text-white px-8 rounded-none font-bold uppercase tracking-widest text-xs transition-colors"
              >
                {subMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}