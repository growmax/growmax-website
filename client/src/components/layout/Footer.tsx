import { Link } from "wouter";
import BrandLogo from "../ui/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-growmax-black text-white py-24 border-t-4 border-growmax-red font-mono text-xs uppercase tracking-widest selection:bg-growmax-red selection:text-white">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <BrandLogo variant="horizontal" dark className="mb-8" />
              <p className="text-gray-400 leading-relaxed max-w-md font-sans normal-case text-sm">
                Intelligent Revenue Operations Platform for B2B Manufacturers & Distributors. We deliver the connected platform that handles customer self ordering portal to sales quote & pricing to partner portal & fulfillment.
              </p>
            </div>
            
            <div className="mt-12 space-y-3 text-gray-500">
              <div>
                <p className="text-gray-400 font-bold">Growmax LLC</p>
                <p>United States</p>
              </div>
              <div>
                <p className="text-gray-400 font-bold">Webspot Growmax Commerce Private Limited</p>
                <p>Chennai, India</p>
              </div>
              <p className="text-growmax-red mt-4 block">Target Operations: US East Coast & Texas</p>
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Solutions</h4>
              <ul className="space-y-4">
                <li><Link href="/revenue-platform" className="hover:text-growmax-red transition-colors block">Enterprise Platform</Link></li>
                <li><Link href="/arc" className="hover:text-growmax-red transition-colors block">Growmax ARC</Link></li>
                <li><Link href="/arc/pricing" className="hover:text-growmax-red transition-colors block text-gray-500">ARC Pricing</Link></li>
                <li><Link href="/solutions/spare-parts-ecommerce" className="hover:text-growmax-red transition-colors block">Spare Parts eCommerce</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Comparisons</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/comparisons/handshake-alternatives" className="hover:text-white transition-colors block">Handshake Alternatives</Link></li>
                <li><Link href="/comparisons/tradegecko-alternatives" className="hover:text-white transition-colors block">TradeGecko Alternatives</Link></li>
                <li><Link href="/arc/compare/b2b-wave" className="hover:text-white transition-colors block">ARC vs B2B Wave</Link></li>
                <li><Link href="/arc/compare/pepperi" className="hover:text-white transition-colors block">ARC vs Pepperi</Link></li>
                <li><Link href="/revenue-platform/compare" className="hover:text-white transition-colors block">Enterprise Comparison</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Industries</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/industries/electrical-distributors" className="hover:text-white transition-colors block">Electrical Distributors</Link></li>
                <li><Link href="/industries/building-materials" className="hover:text-white transition-colors block">Building Materials</Link></li>
                <li><Link href="/industries/industrial-manufacturing" className="hover:text-white transition-colors block">Industrial Manufacturing</Link></li>
                <li><Link href="/industries/food-beverage" className="hover:text-white transition-colors block">Food & Beverage</Link></li>
                <li><Link href="/industries/automotive-aftermarket" className="hover:text-white transition-colors block">Automotive Aftermarket</Link></li>
              </ul>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/company/about" className="hover:text-white transition-colors block">Profile & Team</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors block">Intelligence / Blog</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors block text-growmax-red font-bold">Contact Sales</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-gray-500">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            SYSTEM OPERATIONAL // {new Date().getFullYear()}
          </div>
          
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}