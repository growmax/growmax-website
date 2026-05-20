import Link from 'next/link'
import { ArrowRight, Users, Building2, GitMerge } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WhichGrowmaxProps {
  industry?: string;
}

export default function WhichGrowmax({ industry }: WhichGrowmaxProps) {
  return (
    <section className="py-24 bg-growmax-black text-white border-t-2 border-growmax-red" data-testid="section-which-growmax">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Growmax Enterprise</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
            Built for{industry ? ` ${industry}` : ' B2B Manufacturers & Distributors'}
          </h2>
          <p className="font-mono text-sm text-gray-400 uppercase max-w-xl mx-auto">
            One intelligent platform. Full visibility from quote to fulfillment.
          </p>
        </div>

        <div className="max-w-3xl mx-auto border-2 border-growmax-red p-8 md:p-12 flex flex-col justify-between hover:bg-growmax-red/5 transition-colors" data-testid="card-which-enterprise">
          <div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-growmax-red"></span>
              Growmax Enterprise
            </div>
            <h3 className="text-3xl font-bold tracking-tighter uppercase mb-4">Multi-Party Revenue Ecosystem</h3>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
              Connect your sales reps, partners, and customers on one intelligent platform. Multi-version quotes, partner commerce, dealer portals, and full ERP integration — with 100% visibility across your entire revenue chain.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                <Users className="w-4 h-4 text-growmax-red shrink-0" />
                <span className="text-gray-300">100+ employees</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                <GitMerge className="w-4 h-4 text-growmax-red shrink-0" />
                <span className="text-gray-300">Partner/dealer networks</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                <Building2 className="w-4 h-4 text-growmax-red shrink-0" />
                <span className="text-gray-300">SAP, Epicor, industry ERPs</span>
              </div>
            </div>

            <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-8">
              Custom Pricing — Tailored to your ecosystem
            </div>
          </div>

          <Link href="/demo">
            <Button className="w-full bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-14 rounded-none font-bold font-mono text-sm uppercase tracking-widest transition-colors border-2 border-growmax-red" data-testid="button-which-enterprise-demo">
              Book a Demo <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
