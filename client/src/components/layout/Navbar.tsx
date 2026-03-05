import { Link } from "wouter";
import BrandLogo from "../ui/BrandLogo";

export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-growmax-white border-b-2 border-growmax-black font-mono text-sm uppercase tracking-widest mix-blend-difference bg-white/90 backdrop-blur-sm">
      <div className="flex items-stretch h-16 w-full">
        {/* Brand */}
        <Link href="/" className="flex items-center px-6 border-r-2 border-growmax-black bg-growmax-black text-white hover:bg-growmax-red transition-colors duration-0 shrink-0">
          <BrandLogo variant="horizontal" dark className="scale-90 origin-left" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex flex-1 items-stretch">
          <Link href="/revenue-platform" className="flex items-center px-8 border-r border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors">
            Platform Arc
          </Link>
          <Link href="/arc" className="flex items-center px-8 border-r border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors">
            Distributor Arc
          </Link>
          <Link href="/company/about" className="flex items-center px-8 border-r border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors">
            Thesis & Team
          </Link>
          <Link href="/blog" className="flex items-center px-8 border-r border-growmax-gray hover:bg-growmax-black hover:text-white transition-colors">
            Intelligence
          </Link>
        </div>

        {/* Push to right */}
        <div className="flex-1 lg:flex-none flex justify-end">
          <Link href="/demo" className="flex items-center px-8 bg-growmax-red text-white font-bold hover:bg-growmax-black transition-colors border-l-2 border-growmax-black">
            Initialize System
          </Link>
        </div>
      </div>
    </header>
  );
}