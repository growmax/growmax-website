import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import BrandLogo from "../ui/BrandLogo";
import { ChevronDown, Menu, X } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdown {
  label: string;
  items: DropdownItem[];
}

const navDropdowns: NavDropdown[] = [
  {
    label: "Growmax Enterprise",
    items: [
      { label: "Growmax Enterprise", href: "/revenue-platform" },
      { label: "Enterprise Comparison", href: "/revenue-platform/compare" },
      { label: "Dealer Portals", href: "/revenue-platform/dealer-portals" },
      { label: "Partner Commerce", href: "/revenue-platform/partner-commerce" },
      { label: "Spares Portals", href: "/revenue-platform/spares-portals" },
      { label: "SAP Integration", href: "/revenue-platform/sap-integration" },
      { label: "vs Sana Commerce", href: "/comparisons/sana-commerce-alternatives" },
      { label: "vs SAP Commerce Cloud", href: "/comparisons/sap-commerce-cloud-alternatives" },
      { label: "vs Salesforce Commerce", href: "/comparisons/salesforce-commerce-alternatives" },
    ],
  },
  {
    label: "Growmax ARC",
    items: [
      { label: "Growmax ARC", href: "/arc" },
      { label: "ARC Pricing", href: "/arc/pricing" },
      { label: "ARC vs B2B Wave", href: "/arc/compare/b2b-wave" },
      { label: "ARC vs Pepperi", href: "/arc/compare/pepperi" },
      { label: "ARC vs NowCommerce", href: "/arc/compare/nowcommerce" },
      { label: "ARC vs Cin7", href: "/arc/compare/cin7" },
      { label: "ARC vs Unleashed", href: "/arc/compare/unleashed" },
    ],
  },
  {
    label: "Industries",
    items: [
      { label: "Electrical Distributors", href: "/industries/electrical-distributors" },
      { label: "Building Materials", href: "/industries/building-materials" },
      { label: "Industrial Manufacturing", href: "/industries/industrial-manufacturing" },
      { label: "Plumbing & HVAC", href: "/industries/plumbing-hvac" },
      { label: "Safety & PPE", href: "/industries/safety-ppe" },
      { label: "Industrial Fasteners", href: "/industries/industrial-fasteners" },
      { label: "Pump & Valve", href: "/industries/pump-valve" },
      { label: "Chemical Distributors", href: "/industries/chemical-distributors" },
      { label: "Packaging Distributors", href: "/industries/packaging-distributors" },
      { label: "Food & Beverage", href: "/industries/food-beverage" },
      { label: "Automotive Aftermarket", href: "/industries/automotive-aftermarket" },
      { label: "Janitorial & Sanitation", href: "/industries/janitorial-sanitation" },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { label: "All Articles", href: "/blog" },
      { label: "Spare Parts Guide", href: "/solutions/spare-parts-ecommerce" },
      { label: "Handshake Alternatives", href: "/comparisons/handshake-alternatives" },
      { label: "TradeGecko Alternatives", href: "/comparisons/tradegecko-alternatives" },
      { label: "Magento B2B Alternatives", href: "/comparisons/magento-b2b-alternatives" },
      { label: "Shopify Plus B2B Alternatives", href: "/comparisons/shopify-plus-b2b-alternatives" },
    ],
  },
];

function DesktopDropdown({ dropdown }: { dropdown: NavDropdown }) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-stretch"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-testid={`nav-dropdown-${dropdown.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <button
        className="flex items-center gap-1 px-6 border-r border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors font-mono text-sm uppercase tracking-widest"
        onClick={() => setOpen(!open)}
        data-testid={`nav-trigger-${dropdown.label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {dropdown.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full left-0 min-w-[280px] bg-white border-2 border-growmax-black z-50 max-h-[70vh] overflow-y-auto">
          {dropdown.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-6 py-3 font-mono text-xs uppercase tracking-widest border-b border-growmax-gray last:border-b-0 hover:bg-growmax-black hover:text-white transition-colors"
              onClick={() => setOpen(false)}
              data-testid={`nav-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (label: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 bg-white" data-testid="mobile-menu">
      <div className="flex items-center justify-between h-16 border-b-2 border-growmax-black">
        <Link href="/" className="flex items-center px-6" onClick={onClose}>
          <BrandLogo variant="horizontal" className="scale-90 origin-left" />
        </Link>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-16 h-16 border-l-2 border-growmax-black hover:bg-growmax-black hover:text-white transition-colors"
          data-testid="mobile-menu-close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-4rem)]">
        {navDropdowns.map((dropdown) => (
          <div key={dropdown.label} className="border-b border-growmax-gray">
            <button
              onClick={() => toggleSection(dropdown.label)}
              className="flex items-center justify-between w-full px-6 py-4 font-mono text-sm uppercase tracking-widest hover:bg-growmax-black hover:text-white transition-colors"
              data-testid={`mobile-section-${dropdown.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {dropdown.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${expandedSections.has(dropdown.label) ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.has(dropdown.label) && (
              <div className="bg-gray-50 border-t border-growmax-gray">
                {dropdown.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-10 py-3 font-mono text-xs uppercase tracking-widest border-b border-growmax-gray last:border-b-0 hover:bg-growmax-black hover:text-white transition-colors"
                    onClick={onClose}
                    data-testid={`mobile-link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="border-b border-growmax-gray">
          <Link
            href="/company/about"
            className="block px-6 py-4 font-mono text-sm uppercase tracking-widest hover:bg-growmax-black hover:text-white transition-colors"
            onClick={onClose}
            data-testid="mobile-link-about-us"
          >
            About Us
          </Link>
        </div>
        <div className="p-6">
          <Link
            href="/demo"
            className="block w-full text-center px-8 py-4 bg-growmax-red text-white font-mono text-sm uppercase tracking-widest font-bold hover:bg-growmax-black transition-colors border-2 border-growmax-black"
            onClick={onClose}
            data-testid="mobile-link-demo"
          >
            Book a Demo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-white/95 border-b-2 border-growmax-black font-mono text-sm uppercase tracking-widest backdrop-blur-sm">
        <div className="flex items-stretch h-16 w-full">
          <Link href="/" className="flex items-center px-3 sm:px-6 border-r-2 border-growmax-black bg-growmax-black text-white hover:bg-growmax-red transition-colors duration-0 shrink-0">
            <BrandLogo variant="horizontal" dark className="scale-75 sm:scale-90 origin-left" />
          </Link>

          <div className="hidden lg:flex flex-1 items-stretch">
            {navDropdowns.map((dropdown) => (
              <DesktopDropdown key={dropdown.label} dropdown={dropdown} />
            ))}
            <Link
              href="/company/about"
              className="flex items-center px-6 border-r border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors"
              data-testid="nav-link-about-us"
            >
              About Us
            </Link>
          </div>

          <div className="flex-1 lg:flex-none flex justify-end">
            <button
              className="flex lg:hidden items-center justify-center w-16 border-l border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors"
              onClick={() => setMobileOpen(true)}
              data-testid="mobile-menu-open"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/demo"
              className="flex items-center px-4 sm:px-8 bg-growmax-red text-white font-bold hover:bg-growmax-black transition-colors border-l-2 border-growmax-black whitespace-nowrap"
              data-testid="nav-link-demo"
            >
              <span className="hidden sm:inline">Book a Demo</span>
              <span className="sm:hidden">Demo</span>
            </Link>
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
