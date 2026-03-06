import { useState } from "react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";

const categories = [
  "All",
  "B2B eCommerce",
  "AI Insights",
  "Partner Engagement",
  "Spare Parts",
  "Case Studies",
  "Sales & Pipeline",
  "Channel Management",
] as const;

type Category = (typeof categories)[number];

interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  slug: string;
  author: string;
  excerpt: string;
  published: boolean;
}

export default function BlogList() {
  const [subEmail, setSubEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const subMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/newsletter", { email: subEmail });
      return res.json();
    },
    onSuccess: () => setSubEmail(""),
  });

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      <SEOHead
        title="Growmax Intelligence | B2B Commerce & Industrial Distribution Insights"
        description="Technical papers, case studies, and insights on B2B eCommerce, industrial distribution, AI in commerce, partner engagement, and revenue operations."
        path="/blog"
      />
      <section className="pt-24 pb-16 border-b border-gray-200 bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">
             Intelligence // Documentation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-blog-title">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-blog-search"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white sticky top-16 z-20">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex overflow-x-auto gap-0 -mb-px scrollbar-hide" data-testid="tabs-category-filter">
            {categories.map((cat) => {
              const count = cat === "All" ? posts.length : posts.filter(p => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  data-testid={`tab-category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  className={`
                    whitespace-nowrap px-4 py-4 font-mono text-xs uppercase tracking-widest border-b-2 transition-colors shrink-0
                    ${activeCategory === cat
                      ? "border-growmax-red text-growmax-red font-bold"
                      : "border-transparent text-gray-500 hover:text-growmax-black hover:border-gray-300"
                    }
                  `}
                >
                  {cat} <span className="text-gray-400 ml-1">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          
          <div className="grid grid-cols-12 gap-4 pb-4 border-b-2 border-growmax-black text-xs font-mono font-bold uppercase tracking-widest text-growmax-black">
            <div className="col-span-2 hidden md:block">Category</div>
            <div className="col-span-12 md:col-span-6">Document Title</div>
            <div className="col-span-2 hidden md:block">Author</div>
            <div className="col-span-2 hidden md:block text-right">Date</div>
          </div>
          
          <div className="flex flex-col">
            {isLoading ? (
              <div className="py-16 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-growmax-red mx-auto mb-4" />
                <div className="font-mono text-sm text-gray-400 uppercase tracking-widest">Loading documents...</div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-16 text-center font-mono text-sm text-gray-400 uppercase tracking-widest" data-testid="text-no-results">
                No documents match your query.
              </div>
            ) : (
              filteredPosts.map((post, i) => (
                <Link href={`/blog/${post.slug}`} key={post.slug} className="group border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors block" data-testid={`link-blog-post-${i}`}>
                  <div className="grid grid-cols-12 gap-4 py-6 items-start">
                    <div className="col-span-2 hidden md:block font-mono text-xs uppercase text-growmax-black pt-1">
                      <span className="bg-gray-100 px-2 py-1 border border-gray-200 group-hover:border-growmax-black transition-colors">
                        {post.category}
                      </span>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="flex items-center justify-between md:block">
                        <h2 className="text-xl font-bold text-growmax-black tracking-tight group-hover:text-growmax-red transition-colors pr-4">
                          {post.title}
                        </h2>
                        <ArrowRight className="w-5 h-5 text-growmax-red md:hidden shrink-0" />
                      </div>
                      <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="md:hidden mt-2 flex items-center gap-3">
                        <span className="font-mono text-xs uppercase text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">
                          {post.category}
                        </span>
                        <span className="font-mono text-xs text-gray-400">{post.date}</span>
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:block font-mono text-xs text-gray-500 pt-1">
                      {post.author}
                    </div>
                    <div className="col-span-2 hidden md:block font-mono text-xs text-right text-gray-500 pt-1">
                      {post.date}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="font-mono text-xs text-gray-400 uppercase tracking-widest text-center" data-testid="text-post-count">
              Showing {filteredPosts.length} of {posts.length} documents
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white border-t border-gray-800 bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="w-16 h-16 bg-growmax-red flex items-center justify-center mx-auto mb-8 border border-white/20">
             <ArrowRight className="w-8 h-8 text-white -rotate-45" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-6 uppercase">Stay synchronized with B2B commerce logic.</h2>
          {subMutation.isSuccess ? (
            <div className="flex items-center justify-center gap-3 mt-8 font-mono text-sm text-growmax-red uppercase tracking-widest" data-testid="text-subscribed">
              <CheckCircle className="w-5 h-5" /> Subscribed Successfully
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto mt-8" onSubmit={(e) => { e.preventDefault(); subMutation.mutate(); }}>
              <Input 
                placeholder="ENTER WORK EMAIL" 
                type="email"
                required
                data-testid="input-newsletter-email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="h-14 bg-white/5 border-gray-700 rounded-none text-white font-mono text-sm placeholder:text-gray-500 focus:border-growmax-red" 
              />
              <Button
                type="submit"
                data-testid="button-subscribe"
                disabled={subMutation.isPending}
                className="h-14 bg-growmax-red hover:bg-white hover:text-growmax-black text-white px-8 rounded-none font-bold uppercase tracking-widest text-xs transition-colors"
              >
                {subMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
}
