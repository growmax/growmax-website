import { Link } from "wouter";
import BrandLogo from "../ui/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-growmax-black text-white py-12 md:py-24 border-t-4 border-growmax-red font-mono text-xs uppercase tracking-widest selection:bg-growmax-red selection:text-white">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 mb-12 md:mb-20">
          
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <BrandLogo variant="horizontal" dark className="mb-8" />
              <p className="text-gray-400 leading-relaxed max-w-md font-sans normal-case text-sm">
                Intelligent Revenue Operations Platform for B2B Manufacturers & Distributors. Connect your sales reps, partners, and customers on one platform — from quote to fulfillment with full visibility.
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
            </div>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            <div>
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Solutions</h4>
              <ul className="space-y-4">
                <li><Link href="/revenue-platform" className="hover:text-growmax-red transition-colors block">Growmax Enterprise</Link></li>
                <li><Link href="/arc" className="hover:text-growmax-red transition-colors block">Growmax ARC</Link></li>
                <li><Link href="/arc/pricing" className="hover:text-growmax-red transition-colors block text-gray-500">ARC Pricing</Link></li>
                <li><Link href="/solutions/spare-parts-ecommerce" className="hover:text-growmax-red transition-colors block">Spare Parts eCommerce</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Comparisons</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="text-gray-600 font-bold text-[10px] mt-2">Enterprise Alternatives</li>
                <li><Link href="/revenue-platform/compare" className="hover:text-white transition-colors block">vs SAP & Corevist</Link></li>
                <li><Link href="/comparisons/sap-commerce-cloud-alternatives" className="hover:text-white transition-colors block">SAP Commerce Cloud</Link></li>
                <li><Link href="/comparisons/salesforce-commerce-alternatives" className="hover:text-white transition-colors block">Salesforce Commerce</Link></li>
                <li><Link href="/comparisons/oracle-commerce-alternatives" className="hover:text-white transition-colors block">Oracle Commerce</Link></li>
                <li><Link href="/comparisons/netsuite-suitecommerce-alternatives" className="hover:text-white transition-colors block">NetSuite SuiteCommerce</Link></li>
                <li><Link href="/comparisons/dynamics-365-commerce-alternatives" className="hover:text-white transition-colors block">Dynamics 365</Link></li>
                <li><Link href="/comparisons/sana-commerce-alternatives" className="hover:text-white transition-colors block">Sana Commerce</Link></li>
                <li><Link href="/comparisons/orocommerce-alternatives" className="hover:text-white transition-colors block">OroCommerce</Link></li>
                <li className="text-gray-600 font-bold text-[10px] mt-4">SMB Alternatives</li>
                <li><Link href="/comparisons/shopify-plus-b2b-alternatives" className="hover:text-white transition-colors block">Shopify Plus B2B</Link></li>
                <li><Link href="/comparisons/bigcommerce-b2b-alternatives" className="hover:text-white transition-colors block">BigCommerce B2B</Link></li>
                <li><Link href="/comparisons/magento-b2b-alternatives" className="hover:text-white transition-colors block">Magento B2B</Link></li>
                <li><Link href="/comparisons/woocommerce-b2b-alternatives" className="hover:text-white transition-colors block">WooCommerce B2B</Link></li>
                <li><Link href="/comparisons/zoho-commerce-alternatives" className="hover:text-white transition-colors block">Zoho Commerce</Link></li>
                <li><Link href="/comparisons/handshake-alternatives" className="hover:text-white transition-colors block">Handshake</Link></li>
                <li><Link href="/comparisons/tradegecko-alternatives" className="hover:text-white transition-colors block">TradeGecko</Link></li>
                <li className="text-gray-600 font-bold text-[10px] mt-4">ARC Direct</li>
                <li><Link href="/arc/compare/b2b-wave" className="hover:text-white transition-colors block">ARC vs B2B Wave</Link></li>
                <li><Link href="/arc/compare/pepperi" className="hover:text-white transition-colors block">ARC vs Pepperi</Link></li>
                <li><Link href="/arc/compare/cin7" className="hover:text-white transition-colors block">ARC vs Cin7</Link></li>
                <li><Link href="/arc/compare/nowcommerce" className="hover:text-white transition-colors block">ARC vs NowCommerce</Link></li>
                <li><Link href="/arc/compare/unleashed" className="hover:text-white transition-colors block">ARC vs Unleashed</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Industries</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link href="/industries/electrical-distributors" className="hover:text-white transition-colors block">Electrical</Link></li>
                <li><Link href="/industries/building-materials" className="hover:text-white transition-colors block">Building Materials</Link></li>
                <li><Link href="/industries/industrial-manufacturing" className="hover:text-white transition-colors block">Industrial Manufacturing</Link></li>
                <li><Link href="/industries/plumbing-hvac" className="hover:text-white transition-colors block">Plumbing & HVAC</Link></li>
                <li><Link href="/industries/safety-ppe" className="hover:text-white transition-colors block">Safety & PPE</Link></li>
                <li><Link href="/industries/pump-valve" className="hover:text-white transition-colors block">Pump & Valve</Link></li>
                <li><Link href="/industries/chemical-distributors" className="hover:text-white transition-colors block">Chemical</Link></li>
                <li><Link href="/industries/packaging-distributors" className="hover:text-white transition-colors block">Packaging</Link></li>
                <li><Link href="/industries/industrial-fasteners" className="hover:text-white transition-colors block">Fasteners</Link></li>
                <li><Link href="/industries/food-beverage" className="hover:text-white transition-colors block">Food & Beverage</Link></li>
                <li><Link href="/industries/automotive-aftermarket" className="hover:text-white transition-colors block">Automotive</Link></li>
                <li><Link href="/industries/janitorial-sanitation" className="hover:text-white transition-colors block">Janitorial</Link></li>
              </ul>
            </div>
            
            <div className="sm:col-span-2 md:col-span-1">
              <h4 className="font-bold mb-6 text-growmax-red border-b border-gray-800 pb-2">Company</h4>
              <ul className="space-y-4">
                <li><Link href="/company/about" className="hover:text-white transition-colors block">About Us</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors block">Intelligence / Blog</Link></li>
                <li><Link href="/write-for-us" className="hover:text-white transition-colors block">Write For Us</Link></li>
                <li><Link href="/demo" className="hover:text-white transition-colors block text-growmax-red font-bold">Book a Demo</Link></li>
              </ul>
            </div>
          </div>
          
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-[10px] text-gray-500">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
            <span className="whitespace-nowrap">SYSTEM OPERATIONAL // {new Date().getFullYear()}</span>
          </div>
          
          <div className="flex gap-6 sm:gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors whitespace-nowrap">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors whitespace-nowrap">Terms of Service</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
