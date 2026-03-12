import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight, CheckCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import SEOHead from "@/components/SEOHead";
import { collectionPageSchema } from "@/lib/structuredData";

const POSTS_PER_PAGE = 18;

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

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-2 border-growmax-black bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all mb-12"
      data-testid="link-featured-post"
    >
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[11px] uppercase tracking-widest text-white bg-growmax-red px-3 py-1 font-bold">
            Featured
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 border border-gray-200">
            {post.category}
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-growmax-black group-hover:text-growmax-red transition-colors mb-4 leading-tight">
          {post.title}
        </h2>
        <p className="text-base text-gray-600 leading-relaxed mb-6 max-w-2xl">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-400 font-mono">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
          </div>
          <span className="flex items-center gap-2 text-growmax-red font-mono text-xs uppercase tracking-widest font-bold group-hover:gap-3 transition-all">
            Read article <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border border-gray-200 bg-white hover:border-growmax-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
      data-testid={`link-blog-post-${index}`}
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5 border border-gray-200">
            {post.category}
          </span>
          <span className="font-mono text-[10px] text-gray-400">{post.date}</span>
        </div>
        <h3 className="text-lg font-bold text-growmax-black tracking-tight group-hover:text-growmax-red transition-colors mb-3 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-mono">{post.author}</span>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-growmax-red transition-colors" />
        </div>
      </div>
    </Link>
  );
}

export default function BlogList() {
  const [subEmail, setSubEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const search = useSearch();
  const pageParam = new URLSearchParams(search).get("page");
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);

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

  const featured = filteredPosts.length > 0 && activeCategory === "All" && searchQuery === "" && currentPage === 1 ? filteredPosts[0] : null;
  const afterFeatured = featured ? filteredPosts.slice(1) : filteredPosts;
  const totalPages = Math.max(1, Math.ceil(afterFeatured.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const gridPosts = afterFeatured.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const paginationLinks = useMemo(() => {
    const prevPage = safePage > 1 ? safePage - 1 : null;
    const nextPage = safePage < totalPages ? safePage + 1 : null;
    return { prevPage, nextPage };
  }, [safePage, totalPages]);

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      <SEOHead
        title={safePage > 1 ? `Growmax Intelligence — Page ${safePage} | B2B Commerce Insights` : "Growmax Intelligence | B2B Commerce & Industrial Distribution Insights"}
        description="Technical papers, case studies, and insights on B2B eCommerce, industrial distribution, AI in commerce, partner engagement, and revenue operations."
        path={safePage > 1 ? `/blog?page=${safePage}` : "/blog"}
        structuredData={collectionPageSchema({
          title: "Growmax Intelligence — B2B Commerce & Industrial Distribution Blog",
          description: "Technical papers, case studies, and insights on B2B eCommerce, industrial distribution, AI in commerce, partner engagement, and revenue operations.",
          path: "/blog",
        })}
      />

      <section className="pt-24 pb-16 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">
            Growmax Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-4" data-testid="text-blog-title">
            Insights for B2B <br className="hidden md:block" />
            <span className="text-gray-400">distributors & manufacturers.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mt-4 leading-relaxed">
            Guides, case studies, and practical strategies for industrial distribution,
            eCommerce, partner engagement, and revenue operations.
          </p>

          <div className="relative max-w-xl mt-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              className="pl-12 h-12 bg-white rounded-none border-gray-300 focus:border-growmax-black focus:ring-growmax-red text-sm placeholder:text-gray-400"
              placeholder="Search articles..."
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
                    whitespace-nowrap px-4 py-4 text-sm border-b-2 transition-colors shrink-0
                    ${activeCategory === cat
                      ? "border-growmax-red text-growmax-black font-semibold"
                      : "border-transparent text-gray-500 hover:text-growmax-black hover:border-gray-300"
                    }
                  `}
                >
                  {cat} <span className="text-gray-400 ml-1 text-xs">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white min-h-[50vh]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">

          {isLoading ? (
            <div className="py-16 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-growmax-red mx-auto mb-4" />
              <div className="text-sm text-gray-400">Loading articles...</div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-400" data-testid="text-no-results">
              No articles match your search.
            </div>
          ) : (
            <>
              {featured && <FeaturedPost post={featured} />}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post, i) => (
                  <PostCard key={post.slug} post={post} index={featured ? i + 1 : i} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-center gap-2" aria-label="Blog pagination" data-testid="nav-pagination">
                  {paginationLinks.prevPage ? (
                    <Link
                      href={paginationLinks.prevPage === 1 ? "/blog" : `/blog?page=${paginationLinks.prevPage}`}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-300 hover:border-growmax-black hover:bg-growmax-black hover:text-white transition-colors"
                      data-testid="link-pagination-prev"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 text-gray-300 cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </span>
                  )}

                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={p === 1 ? "/blog" : `/blog?page=${p}`}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-mono border transition-colors ${
                          p === safePage
                            ? "bg-growmax-black text-white border-growmax-black"
                            : "border-gray-300 hover:border-growmax-black"
                        }`}
                        data-testid={`link-pagination-${p}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>

                  {paginationLinks.nextPage ? (
                    <Link
                      href={`/blog?page=${paginationLinks.nextPage}`}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-300 hover:border-growmax-black hover:bg-growmax-black hover:text-white transition-colors"
                      data-testid="link-pagination-next"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1 px-4 py-2 text-sm font-mono uppercase tracking-widest border border-gray-200 text-gray-300 cursor-not-allowed">
                      Next <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </nav>
              )}
            </>
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-400 text-center" data-testid="text-post-count">
              Showing {startIdx + 1}–{Math.min(startIdx + POSTS_PER_PAGE, afterFeatured.length)} of {filteredPosts.length} articles
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-growmax-black text-white border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8 max-w-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Get B2B commerce insights in your inbox.
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Practical strategies for distributors and manufacturers. No spam.
          </p>
          {subMutation.isSuccess ? (
            <div className="flex items-center justify-center gap-3 font-mono text-sm text-growmax-red uppercase tracking-widest" data-testid="text-subscribed">
              <CheckCircle className="w-5 h-5" /> Subscribed successfully
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); subMutation.mutate(); }}>
              <Input
                placeholder="Your work email"
                type="email"
                required
                data-testid="input-newsletter-email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                className="h-12 bg-white/5 border-gray-700 rounded-none text-white text-sm placeholder:text-gray-500 focus:border-growmax-red"
              />
              <Button
                type="submit"
                data-testid="button-subscribe"
                disabled={subMutation.isPending}
                className="h-12 bg-growmax-red hover:bg-white hover:text-growmax-black text-white px-8 rounded-none font-bold uppercase tracking-widest text-xs transition-colors"
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
