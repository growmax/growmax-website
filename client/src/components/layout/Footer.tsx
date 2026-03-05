import { Link } from "wouter";
import BrandLogo from "../ui/BrandLogo";

export default function Footer() {
  return (
    <footer className="bg-enterprise-bg text-gray-300 py-16 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <BrandLogo variant="horizontal" dark />
            <p className="mt-6 text-sm text-gray-400 max-w-sm">
              Drive Revenue and Customer Loyalty with Digital Experience Solutions. 
              From enterprise manufacturers to growing distributors — Growmax powers your B2B commerce.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {/* Social links placeholder */}
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-growmax-red transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-growmax-red transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Revenue Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/revenue-platform" className="hover:text-white transition-colors">Overview</Link></li>
              <li><Link href="/revenue-platform/dealer-portal" className="hover:text-white transition-colors">Dealer Portal</Link></li>
              <li><Link href="/revenue-platform/partner-commerce" className="hover:text-white transition-colors">Partner Commerce</Link></li>
              <li><Link href="/revenue-platform/spares-portal" className="hover:text-white transition-colors">Spares Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Growmax ARC</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/arc" className="hover:text-white transition-colors">Overview</Link></li>
              <li><Link href="/arc/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/arc/inventory-management" className="hover:text-white transition-colors">Inventory Management</Link></li>
              <li><Link href="/arc/compare/b2b-wave" className="hover:text-white transition-colors">vs B2B Wave</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/company/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Apptino Software Private Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/msa" className="hover:text-white transition-colors">MSA</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}