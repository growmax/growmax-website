import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, CheckCircle, Users, BarChart3, Zap } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";

const topics = [
  "B2B eCommerce Strategy & Implementation",
  "Industrial Distribution & Supply Chain",
  "Spare Parts Management & Aftermarket Sales",
  "AI & Machine Learning in B2B Commerce",
  "ERP Integration (SAP, Zoho, NetSuite)",
  "Channel Partner Management & Engagement",
  "Pricing Strategy for Wholesale & Distribution",
  "Digital Transformation Case Studies",
  "Inventory Management & Demand Forecasting",
  "Sales Automation & Pipeline Management",
];

const guidelines = [
  { title: "Original Content", desc: "All submissions must be original, unpublished work. We do not accept content that has been published elsewhere." },
  { title: "Word Count", desc: "Articles should be between 1,500–3,000 words. We value depth and actionable insights over length." },
  { title: "Data-Driven", desc: "Include real statistics, case studies, or industry data to support your arguments. Cite your sources." },
  { title: "Audience", desc: "Write for B2B decision-makers: operations managers, sales directors, IT leaders, and C-suite executives at industrial companies." },
  { title: "Formatting", desc: "Use clear headings (H2, H3), bullet points, and short paragraphs. Include at least one relevant image or diagram." },
  { title: "No Promotions", desc: "Guest posts should provide genuine value. Subtle product mentions are acceptable if relevant, but no advertorials." },
];

const benefits = [
  { icon: Users, title: "Reach 50K+ Monthly Readers", desc: "Our audience includes decision-makers at industrial distributors, manufacturers, and B2B enterprises across the US." },
  { icon: BarChart3, title: "Build Authority", desc: "Establish yourself as a thought leader in B2B commerce, supply chain, and industrial technology." },
  { icon: Zap, title: "SEO Backlink", desc: "Get a high-quality dofollow backlink from a domain with strong authority in the B2B commerce space." },
];

export default function WriteForUs() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      <SEOHead
        title="Write For Us | Contribute to Growmax Intelligence"
        description="Contribute guest posts to Growmax Intelligence. We publish articles on B2B eCommerce, industrial distribution, spare parts management, AI in commerce, and supply chain strategy."
        path="/write-for-us"
      />

      <section className="pt-24 pb-16 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <Breadcrumbs items={[{ label: "Write For Us" }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-8">
            Contributors // Guest Authors
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-write-for-us-title">
            Write for <br />
            <span className="text-gray-400">Growmax Intelligence.</span>
          </h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-12" data-testid="text-write-for-us-intro">
            We publish technical papers, industry analyses, and practical guides for B2B commerce leaders.
            If you have expertise in industrial distribution, supply chain, or B2B technology — we want to hear from you.
          </p>
          <a href="mailto:content@growmax.io?subject=Guest Post Submission" data-testid="button-submit-pitch">
            <Button className="bg-growmax-red hover:bg-growmax-black text-white rounded-none font-bold uppercase tracking-widest text-xs h-14 px-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              Submit Your Pitch <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8">
            Why Contribute
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <div key={i} className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all" data-testid={`card-benefit-${i}`}>
                <div className="w-12 h-12 bg-growmax-red flex items-center justify-center mb-6">
                  <b.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-growmax-black mb-3 tracking-tight">{b.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8">
                Topics We Cover
              </div>
              <ul className="space-y-4">
                {topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-3" data-testid={`text-topic-${i}`}>
                    <CheckCircle className="w-5 h-5 text-growmax-red mt-0.5 shrink-0" />
                    <span className="text-gray-700 font-light">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8">
                Submission Guidelines
              </div>
              <div className="space-y-6">
                {guidelines.map((g, i) => (
                  <div key={i} className="border-l-2 border-growmax-black pl-4" data-testid={`card-guideline-${i}`}>
                    <h4 className="font-bold text-growmax-black mb-1">{g.title}</h4>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">{g.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8">
            How It Works
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Pitch", desc: "Email your topic idea with a brief outline and your background." },
              { step: "02", title: "Approval", desc: "Our editorial team reviews within 3 business days." },
              { step: "03", title: "Write", desc: "Draft your article following our guidelines. We provide feedback." },
              { step: "04", title: "Publish", desc: "Your article goes live with full author attribution and bio." },
            ].map((item, i) => (
              <div key={i} className="text-center" data-testid={`card-step-${i}`}>
                <div className="font-mono text-4xl font-bold text-growmax-red mb-4">{item.step}</div>
                <h4 className="font-bold text-growmax-black mb-2 uppercase tracking-tight">{item.title}</h4>
                <p className="text-sm text-gray-600 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-growmax-red flex items-center justify-center mx-auto mb-8 border border-white/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6 uppercase" data-testid="text-cta-heading">
            Ready to share your expertise?
          </h2>
          <p className="text-gray-400 font-light mb-10 max-w-lg mx-auto">
            Send your topic pitch to <strong className="text-white">content@growmax.io</strong> with a brief outline and your relevant experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:content@growmax.io?subject=Guest Post Submission" data-testid="button-cta-email">
              <Button className="bg-growmax-red hover:bg-white hover:text-growmax-black text-white rounded-none font-bold uppercase tracking-widest text-xs h-14 px-10 transition-colors">
                Email Your Pitch
              </Button>
            </a>
            <Link href="/blog" data-testid="link-view-blog">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-white/10 rounded-none font-bold uppercase tracking-widest text-xs h-14 px-10">
                View Published Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
