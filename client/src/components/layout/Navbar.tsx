import { Link } from "wouter";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { useState } from "react";
import BrandLogo from "../ui/BrandLogo";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <BrandLogo variant="horizontal" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <div className="relative group">
            <button 
              className="flex items-center gap-1 text-sm font-medium text-growmax-black hover:text-growmax-red transition-colors"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              Products <ChevronDown className="w-4 h-4" />
            </button>
            
            {/* Mega Menu (Simplified) */}
            <div 
              className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[600px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 flex gap-8">
                <div className="flex-1 bg-enterprise-bg rounded-lg p-6 text-white">
                  <h3 className="font-semibold text-sm tracking-wider text-gray-400 mb-1">REVENUE PLATFORM</h3>
                  <p className="text-xs text-gray-300 mb-4">For Enterprises</p>
                  <ul className="space-y-3">
                    <li><Link href="/revenue-platform/dealer-portal" className="text-sm hover:text-white text-gray-300">→ Dealer Portal</Link></li>
                    <li><Link href="/revenue-platform/partner-commerce" className="text-sm hover:text-white text-gray-300">→ Partner Commerce</Link></li>
                    <li><Link href="/revenue-platform/spares-portal" className="text-sm hover:text-white text-gray-300">→ Spares Portal</Link></li>
                    <li><Link href="/revenue-platform/sales-rep-app" className="text-sm hover:text-white text-gray-300">→ Sales Rep App</Link></li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-700">
                    <Link href="/demo" className="text-sm font-medium text-white flex items-center hover:text-gray-200">
                      Enterprise? Book a Demo <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <h3 className="font-semibold text-sm tracking-wider text-growmax-black mb-1">GROWMAX ARC</h3>
                  <p className="text-xs text-gray-500 mb-4">For Distributors</p>
                  <ul className="space-y-3">
                    <li><Link href="/arc" className="text-sm hover:text-growmax-red text-gray-600">→ Inventory Management</Link></li>
                    <li><Link href="/arc" className="text-sm hover:text-growmax-red text-gray-600">→ Sales Rep App</Link></li>
                    <li><Link href="/arc" className="text-sm hover:text-growmax-red text-gray-600">→ Customer Portal</Link></li>
                    <li><Link href="/arc/pricing" className="text-sm hover:text-growmax-red text-gray-600">→ Pricing</Link></li>
                  </ul>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Link href="/arc" className="text-sm font-medium text-growmax-red flex items-center hover:text-growmax-red-dark">
                      $199/mo · Start Free Trial <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/company/about" className="text-sm font-medium text-growmax-black hover:text-growmax-red transition-colors">Company</Link>
          <Link href="/blog" className="text-sm font-medium text-growmax-black hover:text-growmax-red transition-colors">Resources</Link>
          <Link href="/arc/pricing" className="text-sm font-medium text-growmax-black hover:text-growmax-red transition-colors">Pricing</Link>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link href="/demo" className="text-sm font-medium px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
            Book a Demo
          </Link>
          <Link href="/arc" className="text-sm font-semibold px-5 py-2 bg-growmax-red text-white rounded-md hover:bg-growmax-red-dark transition-colors flex items-center gap-2">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-growmax-black"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-lg p-4">
          <div className="flex flex-col space-y-4">
            <div className="pb-4 border-b border-gray-100">
              <h3 className="font-semibold text-growmax-black mb-2">Revenue Platform (Enterprise)</h3>
              <div className="flex flex-col space-y-2 pl-2">
                <Link href="/revenue-platform" className="text-sm text-gray-600">Overview</Link>
                <Link href="/revenue-platform/dealer-portal" className="text-sm text-gray-600">Dealer Portal</Link>
              </div>
            </div>
            <div className="pb-4 border-b border-gray-100">
              <h3 className="font-semibold text-growmax-black mb-2">Growmax ARC (Distributors)</h3>
              <div className="flex flex-col space-y-2 pl-2">
                <Link href="/arc" className="text-sm text-gray-600">Overview</Link>
                <Link href="/arc/pricing" className="text-sm text-gray-600">Pricing</Link>
              </div>
            </div>
            <Link href="/company/about" className="text-sm font-medium text-growmax-black">Company</Link>
            <Link href="/blog" className="text-sm font-medium text-growmax-black">Resources</Link>
            
            <div className="pt-4 flex flex-col gap-3">
              <Link href="/demo" className="text-center text-sm font-medium px-4 py-3 border border-gray-200 rounded-md">
                Book a Demo
              </Link>
              <Link href="/arc" className="text-center text-sm font-semibold px-5 py-3 bg-growmax-red text-white rounded-md">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}