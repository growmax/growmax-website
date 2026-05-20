import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import { aboutPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'About Growmax | B2B Commerce for Industrial Distributors',
  description: 'Growmax delivers connected B2B commerce platforms for industrial distributors and manufacturers. Founded by ex-Siemens and ex-SAP leaders with 25+ years of industry experience.',
  alternates: { canonical: 'https://www.growmax.io/company/about' },
  openGraph: { title: 'About Growmax | B2B Commerce for Industrial Distributors', description: 'Founded by ex-Siemens and ex-SAP leaders with 25+ years of industry experience.', url: 'https://www.growmax.io/company/about' },
}

export default function About() {
  const schema = aboutPageSchema()
  return (
    <div className="min-h-screen bg-growmax-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />

      <section className="py-24 md:py-32 bg-growmax-black text-white bg-dots-dark border-b-4 border-growmax-red">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl">
            <div className="mb-6"><Breadcrumbs items={[{ label: 'Company' }, { label: 'About' }]} /></div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8 border-l-2 border-growmax-red pl-4">Company Profile // 2026</div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 uppercase">
              Built by people <br/>who know the <br/><span className="text-growmax-red">industry.</span>
            </h1>
            <p className="font-mono text-lg text-gray-400 max-w-2xl leading-relaxed">We deliver the connected platform that replaces disconnected spreadsheets, manual quote workflows, and siloed ERPs. Trusted by manufacturers who chose depth over hype.</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 font-mono uppercase">
            {[{ label: 'Ideal Customer', value: 'Distributors &\nIndustrial Mfrs.' },{ label: 'Company Size', value: '$100M - $1B\nMid-Market Enterprise' },{ label: 'Geography', value: 'India, USA, Europe\n& Middle-East' },{ label: 'Decision Makers', value: 'CEO, CRO, CMO' }].map((item,i) => (
              <div key={i} className={i < 3 ? 'sm:border-r border-gray-200 sm:pr-8' : ''}>
                <h4 className="text-[10px] font-bold text-gray-400 mb-2">{item.label}</h4>
                <p className="text-sm font-bold text-growmax-black whitespace-pre-line">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-gray bg-grid-blueprint border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-20"><h2 className="text-3xl sm:text-5xl font-bold tracking-tighter uppercase mb-4">Leadership Logic</h2><div className="w-24 h-2 bg-growmax-black"></div></div>
          <div className="grid md:grid-cols-2 gap-8 pb-2 pr-2">
            {[
              { name: 'Sudhakar\nVaratharajan', role: 'Founder & CEO', bio: '25+ years in technology-led business transformation. Led 40%+ revenue growth at Siemens automation division.', credentials: ['Ex-Siemens (Industrial Auto, IND & GER)','Ex-SAP (Upper Mid-Market Enterprises)','Ex-Mindtree (Home Depot US, Adidas GER)','MBA — Anna University, IIM Bangalore'] },
              { name: 'Aravindan\nVaratharajan', role: 'Director & Business Growth', bio: '20+ years in business development & analytics. Data analytics & KPI optimization specialist.', credentials: ['Ex-Microsoft (Enterprise Solutions)','Ex-Softura (QA & Process Transformation)','Partner Ecosystem Growth','B.E (ECE) — Bharathidasan University'] },
            ].map((person,i) => (
              <div key={i} className="bg-white border-2 border-growmax-black p-4 sm:p-8 hover:-translate-y-2 transition-transform duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase text-growmax-black whitespace-pre-line">{person.name}</h3>
                    <p className="font-mono text-xs font-bold text-growmax-red mt-2 uppercase tracking-widest">{person.role}</p>
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 border border-gray-300 flex items-center justify-center font-mono text-xs text-gray-400 shrink-0">IMG</div>
                </div>
                <p className="font-mono text-sm text-gray-600 mb-8 sm:h-12">{person.bio}</p>
                <ul className="space-y-4 font-mono text-xs uppercase text-growmax-black border-t border-gray-200 pt-6">
                  {person.credentials.map((c,j) => (
                    <li key={j} className="flex items-center gap-3">
                      <ArrowRight className={`w-4 h-4 shrink-0 ${j < 3 ? 'text-growmax-red' : 'text-gray-400'}`} />{c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <ShieldCheck className="w-16 h-16 text-growmax-red mb-6" />
              <h2 className="text-4xl font-bold tracking-tighter uppercase mb-6">Security &amp; Compliance Highlights</h2>
              <div className="font-mono text-lg font-bold text-gray-400 uppercase tracking-widest border-l-4 border-growmax-red pl-4">&quot;Your data. Your Control. Always.&quot;</div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8 font-mono">
              {[
                { num: '01', protocol: 'Protocol', title: 'Penetration Testing', desc: 'Aligned with OWASP Top 10 standards. Zero Critical Vulnerabilities post-remediation.' },
                { num: '02', protocol: 'Encryption', title: 'Data Protection', desc: 'Data Encryption at Rest & In Transit ensuring protection of sensitive information.' },
                { num: '03', protocol: 'Architecture', title: 'Access Control', desc: 'Role-Based Access Control (RBAC) to limit exposure and maintain privacy.' },
                { num: '04', protocol: 'Compliance', title: 'GDPR Ready', desc: 'Infrastructure built for global scale and regulatory compliance.' },
              ].map((item,i) => (
                <div key={i} className={`border border-gray-200 p-6 ${i === 3 ? 'bg-growmax-black text-white' : 'bg-gray-50'}`}>
                  <div className="text-xs font-bold text-growmax-red mb-2 uppercase">{item.num} // {item.protocol}</div>
                  <h4 className="text-sm font-bold uppercase mb-2">{item.title}</h4>
                  <p className={`text-xs ${i === 3 ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold uppercase tracking-tighter mb-8">Technology Stack</h2>
          <p className="font-mono text-sm leading-relaxed text-gray-400 mb-12">Growmax commerce cloud is hosted on AWS with Microservice architecture on a K8s infrastructure. This ensures high scalability &amp; security. PWA application covering both Mobile &amp; Web users built on Next JS &amp; React.</p>
          <div className="flex flex-wrap justify-center gap-4 font-mono text-xs font-bold uppercase">
            {['AWS Cloud','Kubernetes','Microservices','Next.js / React'].map(t => <span key={t} className="px-4 py-2 border border-white/20 bg-white/5">{t}</span>)}
            <span className="px-4 py-2 border border-white/20 bg-growmax-red">SAP JCo</span>
          </div>
        </div>
      </section>
    </div>
  )
}
