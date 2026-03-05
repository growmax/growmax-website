import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

export default function BlogList() {
  const posts = [
    {
      title: "Bridging the Digital Gap: Why Industrial Brands Need a Partner Engagement Strategy",
      category: "Architecture",
      date: "Jan 15, 2026",
      id: "001"
    },
    {
      title: "Opportunity Pipeline Management – Your Data-Driven Path to Predictable Revenue",
      category: "Data Logic",
      date: "Feb 03, 2026",
      id: "002"
    },
    {
      title: "Why an Offline Order-Taking App is Essential for FMCG Industrial Sales",
      category: "System Design",
      date: "Mar 12, 2026",
      id: "003"
    },
    {
      title: "Revamping the Order Process: OBO Bettermann's Digital Transformation",
      category: "Case Study",
      date: "Nov 20, 2025",
      id: "004"
    },
    {
      title: "Complexity is NOT Bad: Modeling Multi-Tier B2B Pricing",
      category: "Architecture",
      date: "Oct 05, 2025",
      id: "005"
    },
    // Migrated Content
    {
      title: "Digital Enabled FMCG Wholesale: Benefits of Launching Self-Ordering Apps",
      category: "Distributor Arc",
      date: "Jun 10, 2024",
      id: "006"
    },
    {
      title: "A Comprehensive Sales Order Booking App for Zoho Inventory",
      category: "System Design",
      date: "Jun 15, 2024",
      id: "007"
    },
    {
      title: "Transforming Your Digital Landscape: Integrating Third-Party Apps with SAP ECC",
      category: "Architecture",
      date: "Jul 20, 2024",
      id: "008"
    },
    {
      title: "The Quotation-to-Order Process: Converting Marketing Investments to Revenue",
      category: "Data Logic",
      date: "Aug 05, 2024",
      id: "009"
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      {/* Hero */}
      <section className="pt-24 pb-16 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">
             Intelligence // Documentation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8">
            Technical papers & <br />
            <span className="text-gray-400">system logic.</span>
          </h1>
          
          <div className="relative max-w-2xl mt-12">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              className="pl-12 h-14 bg-white rounded-none border-growmax-black focus:ring-growmax-red font-mono text-sm placeholder:text-gray-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
              placeholder="QUERY DOCUMENTATION..." 
            />
          </div>
        </div>
      </section>

      {/* Post Index - Brutalist List */}
      <section className="py-12 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-growmax-black text-xs font-mono font-bold uppercase tracking-widest text-growmax-black">
            <div className="col-span-2 hidden md:block">Ref_ID</div>
            <div className="col-span-12 md:col-span-6">Document Title</div>
            <div className="col-span-2 hidden md:block">Category</div>
            <div className="col-span-2 hidden md:block text-right">Date</div>
          </div>
          
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <Link href={`/blog/${post.id}`} key={i} className="group border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors block">
                <div className="grid grid-cols-12 gap-4 py-6 items-center">
                  <div className="col-span-2 hidden md:block font-mono text-sm text-gray-400 group-hover:text-growmax-black transition-colors">
                    DOC.{post.id}
                  </div>
                  <div className="col-span-12 md:col-span-6 flex items-center justify-between md:block">
                    <h2 className="text-xl font-bold text-growmax-black tracking-tight group-hover:text-growmax-red transition-colors pr-4">
                      {post.title}
                    </h2>
                    <ArrowRight className="w-5 h-5 text-growmax-red md:hidden shrink-0" />
                  </div>
                  <div className="col-span-2 hidden md:block font-mono text-xs uppercase text-growmax-black">
                    <span className="bg-gray-100 px-2 py-1 border border-gray-200 group-hover:border-growmax-black transition-colors">
                      {post.category}
                    </span>
                  </div>
                  <div className="col-span-2 hidden md:block font-mono text-xs text-right text-gray-500">
                    {post.date}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-16 flex justify-center">
            <Button variant="outline" className="rounded-none border-growmax-black text-growmax-black hover:bg-growmax-black hover:text-white font-mono text-xs uppercase tracking-widest h-12 px-8 transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1">
               Load Legacy Archive
            </Button>
          </div>
        </div>
      </section>

      {/* Intelligence CTA */}
      <section className="py-24 bg-growmax-black text-white border-t border-gray-800 bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-growmax-red flex items-center justify-center mx-auto mb-8 border border-white/20">
             <ArrowRight className="w-8 h-8 text-white -rotate-45" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6 uppercase">Stay synchronized with B2B commerce logic.</h2>
          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto mt-8" onSubmit={(e) => e.preventDefault()}>
            <Input 
              placeholder="ENTER WORK EMAIL" 
              className="h-14 bg-white/5 border-gray-700 rounded-none text-white font-mono text-sm placeholder:text-gray-500 focus:border-growmax-red" 
            />
            <Button className="h-14 bg-growmax-red hover:bg-white hover:text-growmax-black text-white px-8 rounded-none font-bold uppercase tracking-widest text-xs transition-colors">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
}