import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight } from "lucide-react";

export default function BlogList() {
  const categories = [
    "All", "B2B eCommerce", "Spare Parts", "FMCG & Wholesale", "Sales & Distribution"
  ];

  const posts = [
    {
      title: "Bridging the Digital Gap: Why Industrial Brands Need a Partner Engagement Strategy",
      category: "B2B eCommerce",
      date: "Jan 15, 2025",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Opportunity Pipeline Management for Industrial Businesses – Your Data-Driven Path to Predictable Revenue",
      category: "Sales & Distribution",
      date: "April 3, 2025",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Why an Offline Order-Taking App is Essential for FMCG and Industrial B2B Sales",
      category: "FMCG & Wholesale",
      date: "May 12, 2025",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Revamping the Order Process: OBO Bettermann's Digital Transformation",
      category: "Case Studies",
      date: "Nov 20, 2024",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "7 Tips for Managing and Optimizing Spare Parts Inventory",
      category: "Spare Parts",
      date: "Oct 5, 2024",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=60"
    },
    {
      title: "Boost Efficiency in FMCG Wholesale with a Zoho-Integrated Order Booking App",
      category: "FMCG & Wholesale",
      date: "June 18, 2024",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-growmax-black mb-6">Resources & Insights</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Expert guides, strategies, and industry news for B2B manufacturers and distributors.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-12 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input className="pl-10 h-12 bg-gray-50 border-transparent focus:border-growmax-red focus:bg-white" placeholder="Search articles..." />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((cat, i) => (
              <button 
                key={i}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0 ? 'bg-growmax-red text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post (First one) */}
        <div className="mb-16">
          <div className="group cursor-pointer bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-transform hover:-translate-y-1 duration-300">
            <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto">
              <img src={posts[0].image} alt={posts[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 text-sm mb-4">
                <span className="font-bold text-growmax-red tracking-wide uppercase">{posts[0].category}</span>
                <span className="text-gray-400">{posts[0].date}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{posts[0].readTime}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight group-hover:text-growmax-red transition-colors">
                {posts[0].title}
              </h2>
              <p className="text-gray-600 text-lg mb-8 line-clamp-3">
                Discover the framework leading manufacturers use to empower their channel partners and drive predictable revenue through digital self-service tools.
              </p>
              <div className="flex items-center text-growmax-red font-semibold">
                Read Article <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, i) => (
            <div key={i} className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 duration-300 flex flex-col">
              <div className="aspect-[16/9] relative overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="font-bold text-growmax-red uppercase tracking-wider">{post.category}</span>
                  <span className="text-gray-400">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-growmax-red transition-colors line-clamp-3">
                  {post.title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <span className="text-growmax-red font-medium flex items-center text-sm">
                    Read <ChevronRight className="w-4 h-4 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination / Load More */}
        <div className="mt-16 text-center">
          <Button variant="outline" className="h-12 px-8 text-gray-600 border-gray-300 hover:bg-gray-100">
            Load More Articles
          </Button>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-24 bg-enterprise-bg rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-growmax-red rounded-full opacity-20 blur-2xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Stay ahead in B2B Commerce</h2>
            <p className="text-gray-400 mb-8">Get our latest guides, templates, and insights delivered straight to your inbox once a month.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your work email" className="h-12 bg-white/10 border-gray-700 text-white placeholder:text-gray-500 focus:border-growmax-red" />
              <Button className="h-12 bg-growmax-red hover:bg-growmax-red-dark text-white px-8 shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}