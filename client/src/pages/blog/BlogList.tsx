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
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6">
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
              className="pl-12 h-14 bg-white rounded-none border-growmax-black focus:ring-growmax-red font-mono text-sm placeholder:text-gray-400" 
              placeholder="QUERY DOCUMENTATION..." 
            />
          </div>
        </div>
      </section>

      {/* Post Index - Brutalist List */}
      <section className="py-12 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-growmax-black text-xs font-mono font-bold uppercase tracking-widest text-gray-500">
            <div className="col-span-2 hidden md:block">Ref_ID</div>
            <div className="col-span-12 md:col-span-6">Document Title</div>
            <div className="col-span-2 hidden md:block">Category</div>
            <div className="col-span-2 hidden md:block text-right">Date</div>
          </div>
          
          <div className="flex flex-col">
            {posts.map((post, i) => (
              <div key={i} className="group border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                <div className="grid grid-cols-12 gap-4 py-6 items-center">
                  <div className="col-span-2 hidden md:block font-mono text-sm text-gray-400">
                    DOC.{post.id}
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <h2 className="text-xl font-bold text-growmax-black tracking-tight group-hover:text-growmax-red transition-colors">
                      {post.title}
                    </h2>
                    {/* Mobile only metadata */}
                    <div className="flex gap-4 mt-2 md:hidden font-mono text-xs text-gray-500">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:block font-mono text-xs uppercase text-growmax-black">
                    {post.category}
                  </div>
                  <div className="col-span-2 hidden md:block font-mono text-xs text-right text-gray-500">
                    {post.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex justify-center">
            <Button variant="outline" className="rounded-none border-gray-300 text-growmax-black hover:bg-gray-100 font-mono text-xs uppercase tracking-widest h-12 px-8">
               Load Next Batch
            </Button>
          </div>
        </div>
      </section>

      {/* Intelligence CTA */}
      <section className="py-24 bg-growmax-black text-white border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-white/10 flex items-center justify-center mx-auto mb-8">
             <ArrowRight className="w-8 h-8 text-growmax-red -rotate-45" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Stay synchronized with B2B commerce logic.</h2>
          <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
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