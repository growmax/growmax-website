import { Link } from "wouter";
import { ArrowRight, Activity, ShieldCheck, Database, GitMerge, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";

export default function About() {
  return (
    <div className="min-h-screen bg-growmax-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="About Growmax | B2B Commerce for Industrial Distributors"
        description="Growmax delivers connected B2B commerce platforms for industrial distributors and manufacturers. Founded by ex-Siemens and ex-SAP leaders with 25+ years of industry experience."
        path="/company/about"
      />
      
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-growmax-black text-white bg-dots-dark border-b-4 border-growmax-red">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "Company" },
                { label: "About" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8 border-l-2 border-growmax-red pl-4">
              Company Profile // 2026
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
              Built by people <br/>
              who know the <br/>
              <span className="text-growmax-red">industry.</span>
            </h1>
            <p className="font-mono text-lg text-gray-400 max-w-2xl leading-relaxed">
              We deliver the connected platform that replaces disconnected spreadsheets, manual quote workflows, and siloed ERPs. Trusted by manufacturers who chose depth over hype.
            </p>
          </div>
        </div>
      </section>

      {/* ICP & Market validation */}
      <section className="py-16 bg-white border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 font-mono uppercase">
            <div className="border-r border-gray-200 pr-8">
              <h4 className="text-[10px] font-bold text-gray-400 mb-2">Ideal Customer</h4>
              <p className="text-sm font-bold text-growmax-black">Distributors &<br/>Industrial Mfrs.</p>
            </div>
            <div className="border-r border-gray-200 pr-8">
              <h4 className="text-[10px] font-bold text-gray-400 mb-2">Company Size</h4>
              <p className="text-sm font-bold text-growmax-black">$100M - $1B<br/>Mid-Market Enterprise</p>
            </div>
            <div className="border-r border-gray-200 pr-8">
              <h4 className="text-[10px] font-bold text-gray-400 mb-2">Geography</h4>
              <p className="text-sm font-bold text-growmax-black">India, USA, Europe<br/>& Middle-East</p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-gray-400 mb-2">Decision Makers</h4>
              <p className="text-sm font-bold text-growmax-black">CEO, CRO, CMO</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-32 bg-growmax-gray bg-grid-blueprint border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-20">
            <h2 className="text-5xl font-bold tracking-tighter uppercase mb-4">Leadership Logic</h2>
            <div className="w-24 h-2 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Sudhakar */}
            <div className="bg-white border-2 border-growmax-black p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter uppercase text-growmax-black">Sudhakar<br/>Varatharajan</h3>
                  <p className="font-mono text-xs font-bold text-growmax-red mt-2 uppercase tracking-widest">Founder & CEO</p>
                </div>
                <div className="w-16 h-16 bg-gray-200 border border-gray-300 flex items-center justify-center font-mono text-xs text-gray-400">IMG</div>
              </div>
              
              <p className="font-mono text-sm text-gray-600 mb-8 h-12">
                25+ years in technology-led business transformation. Led 40%+ revenue growth at Siemens automation division.
              </p>
              
              <ul className="space-y-4 font-mono text-xs uppercase text-growmax-black border-t border-gray-200 pt-6">
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-growmax-red" /> Ex-Siemens (Industrial Auto, IND & GER)</li>
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-growmax-red" /> Ex-SAP (Upper Mid-Market Enterprises)</li>
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-growmax-red" /> Ex-Mindtree (Home Depot US, Adidas GER)</li>
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-gray-400" /> MBA — Anna University, IIM Bangalore</li>
              </ul>
            </div>

            {/* Aravindan */}
            <div className="bg-white border-2 border-growmax-black p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold tracking-tighter uppercase text-growmax-black">Aravindan<br/>Varatharajan</h3>
                  <p className="font-mono text-xs font-bold text-growmax-red mt-2 uppercase tracking-widest">Director & Business Growth</p>
                </div>
                <div className="w-16 h-16 bg-gray-200 border border-gray-300 flex items-center justify-center font-mono text-xs text-gray-400">IMG</div>
              </div>
              
              <p className="font-mono text-sm text-gray-600 mb-8 h-12">
                20+ years in business development & analytics. Data analytics & KPI optimization specialist.
              </p>
              
              <ul className="space-y-4 font-mono text-xs uppercase text-growmax-black border-t border-gray-200 pt-6">
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-growmax-red" /> Ex-Microsoft (Enterprise Solutions)</li>
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-growmax-red" /> Ex-Softura (QA & Process Transformation)</li>
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-growmax-red" /> Partner Ecosystem Growth</li>
                <li className="flex items-center gap-3"><ArrowRight className="w-4 h-4 text-gray-400" /> B.E (ECE) — Bharathidasan University</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-24 bg-white border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <ShieldCheck className="w-16 h-16 text-growmax-red mb-6" />
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Security & Compliance Highlights</h2>
              <div className="font-mono text-lg font-bold text-gray-400 uppercase tracking-widest border-l-4 border-growmax-red pl-4">
                "Your data. Your Control. Always."
              </div>
            </div>
            
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8 font-mono">
              <div className="border border-gray-200 p-6 bg-gray-50">
                <div className="text-xs font-bold text-growmax-red mb-2 uppercase">01 // Protocol</div>
                <h4 className="text-sm font-bold text-growmax-black uppercase mb-2">Penetration Testing</h4>
                <p className="text-xs text-gray-600">Aligned with OWASP Top 10 standards. Zero Critical Vulnerabilities post-remediation.</p>
              </div>
              <div className="border border-gray-200 p-6 bg-gray-50">
                <div className="text-xs font-bold text-growmax-red mb-2 uppercase">02 // Encryption</div>
                <h4 className="text-sm font-bold text-growmax-black uppercase mb-2">Data Protection</h4>
                <p className="text-xs text-gray-600">Data Encryption at Rest & In Transit ensuring protection of sensitive information.</p>
              </div>
              <div className="border border-gray-200 p-6 bg-gray-50">
                <div className="text-xs font-bold text-growmax-red mb-2 uppercase">03 // Architecture</div>
                <h4 className="text-sm font-bold text-growmax-black uppercase mb-2">Access Control</h4>
                <p className="text-xs text-gray-600">Role-Based Access Control (RBAC) to limit exposure and maintain privacy.</p>
              </div>
              <div className="border border-gray-200 p-6 bg-gray-50 bg-growmax-black text-white">
                <div className="text-xs font-bold text-growmax-red mb-2 uppercase">04 // Compliance</div>
                <h4 className="text-sm font-bold uppercase mb-2">GDPR Ready</h4>
                <p className="text-xs text-gray-400">Infrastructure built for global scale and regulatory compliance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Tech Stack */}
      <section className="py-24 bg-growmax-black text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
           <h2 className="text-3xl font-bold uppercase tracking-tighter mb-8">Technology Stack</h2>
           <p className="font-mono text-sm leading-relaxed text-gray-400 mb-12">
             Growmax commerce cloud is hosted on AWS with Microservice architecture on a K8s infrastructure. This ensures high scalability & security. PWA application covering both Mobile & Web users built on Next JS & React.
           </p>
           
           <div className="flex flex-wrap justify-center gap-4 font-mono text-xs font-bold uppercase">
             <span className="px-4 py-2 border border-white/20 bg-white/5">AWS Cloud</span>
             <span className="px-4 py-2 border border-white/20 bg-white/5">Kubernetes</span>
             <span className="px-4 py-2 border border-white/20 bg-white/5">Microservices</span>
             <span className="px-4 py-2 border border-white/20 bg-white/5">Next.js / React</span>
             <span className="px-4 py-2 border border-white/20 bg-growmax-red">SAP JCo</span>
           </div>
        </div>
      </section>

    </div>
  );
}