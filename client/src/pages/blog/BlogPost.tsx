import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Copy, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { articleSchema } from "@/lib/structuredData";

interface RelatedPostSummary {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
}

interface BlogPostSection {
  heading: string;
  headingId: string;
  content: string;
}

interface BlogPostData {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  authorTeam: string;
  readTime: string;
  excerpt: string;
  sections: BlogPostSection[] | null;
  relatedSlugs: string[];
  published: boolean;
}

function ComingSoonPlaceholder({ title, excerpt }: { title: string; excerpt: string }) {
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-4xl py-16">
      <div className="border-2 border-dashed border-gray-300 p-12 text-center bg-gray-50">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4" data-testid="text-coming-soon-label">
          Document In Progress
        </div>
        <h2 className="text-2xl font-bold tracking-tighter text-growmax-black mb-6">
          Full Article Coming Soon
        </h2>
        <p className="text-gray-600 font-light leading-relaxed max-w-xl mx-auto mb-8" data-testid="text-excerpt">
          {excerpt}
        </p>
        <Link href="/demo">
          <Button
            className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-12 px-8"
            data-testid="button-cta-coming-soon"
          >
            Request Early Access
          </Button>
        </Link>
      </div>
    </div>
  );
}

function TableOfContents({ sections }: { sections: BlogPostSection[] }) {
  return (
    <div className="border border-gray-200 p-6 bg-gray-50">
      <div className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest border-b border-gray-200 pb-4 mb-4">
        Index
      </div>
      <ul className="space-y-3 font-mono text-xs text-gray-600">
        {sections.map((section, i) => (
          <li key={section.headingId}>
            <a
              href={`#${section.headingId}`}
              className="hover:text-growmax-red transition-colors"
              data-testid={`link-toc-${i}`}
            >
              {i + 1}. {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SidebarCTA() {
  return (
    <div className="mt-6 border-2 border-growmax-black p-6 bg-growmax-black text-white">
      <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2">Deploy Now</div>
      <h4 className="font-bold text-lg mb-4 leading-tight">Ready to connect your partner network?</h4>
      <Link href="/demo">
        <Button
          className="w-full bg-growmax-red hover:bg-white hover:text-growmax-black text-white rounded-none font-bold uppercase tracking-widest text-xs transition-colors h-10"
          data-testid="button-sidebar-cta"
        >
          Initiate Setup
        </Button>
      </Link>
    </div>
  );
}

function RelatedArticles({ relatedSlugs, currentSlug }: { relatedSlugs: string[]; currentSlug: string }) {
  const validSlugs = relatedSlugs.filter(s => !/^\d+$/.test(s) && s !== currentSlug);
  
  const { data: allPosts = [] } = useQuery<RelatedPostSummary[]>({
    queryKey: ["/api/blog"],
  });

  if (validSlugs.length === 0 && allPosts.length === 0) return null;

  let related = allPosts.filter(p => validSlugs.includes(p.slug));
  
  if (related.length === 0 && allPosts.length > 0) {
    const currentPost = allPosts.find(p => p.slug === currentSlug);
    if (currentPost) {
      related = allPosts
        .filter(p => p.slug !== currentSlug && p.category === currentPost.category)
        .slice(0, 3);
    }
  }

  if (related.length === 0) return null;

  return (
    <section className="py-16 border-t-2 border-growmax-black bg-gray-50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8 border-l-2 border-growmax-red pl-3">
          Related Documentation
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {related.slice(0, 3).map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="group border-2 border-growmax-black p-6 bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all block"
              data-testid={`link-related-${r.slug}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">
                {r.category}
              </span>
              <h4 className="text-sm font-bold text-growmax-black mt-3 mb-2 leading-tight group-hover:text-growmax-red transition-colors line-clamp-2">
                {r.title}
              </h4>
              <p className="text-xs text-gray-500 font-light line-clamp-2">{r.excerpt}</p>
              <div className="flex items-center gap-1 mt-3 text-growmax-red font-mono text-[10px] uppercase tracking-widest">
                Read <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleBody({ post }: { post: BlogPostData }) {
  if (!post.sections || post.sections.length === 0) {
    return <ComingSoonPlaceholder title={post.title} excerpt={post.excerpt} />;
  }
  return (
    <div className="container mx-auto px-4 md:px-8 max-w-4xl py-16">
      <div className="grid md:grid-cols-12 gap-12">
        <div className="md:col-span-8 lg:col-span-9 prose max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-growmax-black prose-p:text-gray-700 prose-p:font-light prose-p:leading-relaxed prose-a:text-growmax-red hover:prose-a:text-growmax-black prose-img:border prose-img:border-gray-200 prose-img:shadow-sm prose-li:text-gray-700 prose-li:font-light prose-strong:text-growmax-black">
          {post.sections.map((section) => (
            <div key={section.headingId}>
              <h2 id={section.headingId}>{section.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          ))}
        </div>

        <div className="md:col-span-4 lg:col-span-3">
          <div className="sticky top-24">
            <TableOfContents sections={post.sections} />
            <SidebarCTA />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "";

  const { data: post, isLoading, error } = useQuery<BlogPostData>({
    queryKey: [`/api/blog/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-growmax-red mx-auto mb-4" />
          <div className="font-mono text-sm text-gray-400 uppercase tracking-widest">Loading document...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    const formattedTitle = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return (
      <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
        <div className="pt-20 pb-16 border-b-2 border-growmax-black">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-growmax-red transition-colors mb-12"
              data-testid="link-back-to-blog"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Index
            </Link>
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4" data-testid="text-coming-soon-label">
              Content Deployment Pending
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-growmax-black mb-6" data-testid="text-coming-soon-title">
              {formattedTitle}
            </h1>
            <p className="text-gray-600 font-light leading-relaxed max-w-xl mb-8">
              This article is currently being prepared for deployment. Check back soon for the full content.
            </p>
            <Link href="/blog">
              <Button
                className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-12 px-8"
                data-testid="button-back-to-blog"
              >
                Return to Index
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      <SEOHead
        title={`${post.title} | Growmax Intelligence`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        structuredData={articleSchema({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          date: post.date,
          author: post.author,
        })}
      />
      <article className="pt-20 pb-16 border-b-2 border-growmax-black bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          <div className="mb-8">
            <Breadcrumbs items={[
              { label: "Intelligence", href: "/blog" },
              { label: post.title },
            ]} />
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-growmax-red transition-colors mb-12"
            data-testid="link-back-to-blog"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Index
          </Link>

          <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-widest mb-8">
            <span className="bg-growmax-black text-white px-3 py-1 font-bold" data-testid="text-category">
              {post.category}
            </span>
            <span className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
            <span className="text-gray-500 flex items-center gap-2">
              <Clock className="w-3 h-3" /> {post.readTime}
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8"
            data-testid="text-post-title"
          >
            {post.title}
          </h1>

          <p className="text-xl text-gray-600 font-light leading-relaxed border-l-4 border-growmax-red pl-6 mb-12" data-testid="text-post-excerpt">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center font-mono text-[10px] text-gray-500">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80"
                  alt={post.author}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div>
                <div className="font-bold text-growmax-black text-sm uppercase tracking-tight" data-testid="text-author">
                  {post.author}
                </div>
                <div className="font-mono text-xs text-gray-500">{post.authorTeam}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:text-growmax-black hover:border-growmax-black transition-colors"
                data-testid="button-share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:text-growmax-black hover:border-growmax-black transition-colors"
                data-testid="button-copy"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </article>

      <ArticleBody post={post} />
      <RelatedArticles relatedSlugs={post.relatedSlugs || []} currentSlug={post.slug} />
    </div>
  );
}
