import { useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Clock, Calendar, Share2, Check, FileText, Loader2, LinkIcon } from "lucide-react";
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
    <div className="container mx-auto px-4 md:px-8 max-w-3xl py-16">
      <div className="border-2 border-dashed border-gray-300 p-12 text-center bg-gray-50">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-6" />
        <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4" data-testid="text-coming-soon-label">
          Coming Soon
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-growmax-black mb-4">
          Full article coming soon
        </h2>
        <p className="text-gray-500 leading-relaxed max-w-xl mx-auto mb-8" data-testid="text-excerpt">
          {excerpt}
        </p>
        <Link href="/demo">
          <Button
            className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-11 px-8"
            data-testid="button-cta-coming-soon"
          >
            Book a Demo
          </Button>
        </Link>
      </div>
    </div>
  );
}

function TableOfContents({ sections }: { sections: BlogPostSection[] }) {
  return (
    <nav className="border border-gray-200 p-5 bg-gray-50/50">
      <div className="text-xs font-semibold text-growmax-black uppercase tracking-wider border-b border-gray-200 pb-3 mb-3">
        In this article
      </div>
      <ol className="space-y-2.5 text-[13px] text-gray-500 leading-snug">
        {sections.map((section, i) => (
          <li key={section.headingId}>
            <a
              href={`#${section.headingId}`}
              className="hover:text-growmax-red transition-colors block"
              data-testid={`link-toc-${i}`}
            >
              <span className="text-gray-400 mr-1.5">{i + 1}.</span>
              {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SidebarCTA() {
  return (
    <div className="mt-6 border-2 border-growmax-black p-6 bg-growmax-black text-white">
      <h4 className="font-bold text-base mb-2 leading-tight">Ready to modernize your B2B sales?</h4>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed">See how Growmax works for distributors like you.</p>
      <Link href="/demo">
        <Button
          className="w-full bg-growmax-red hover:bg-white hover:text-growmax-black text-white rounded-none font-bold uppercase tracking-widest text-xs transition-colors h-10"
          data-testid="button-sidebar-cta"
        >
          Book a Demo
        </Button>
      </Link>
    </div>
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `https://www.growmax.io/blog/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleShare}
        title="Share this article"
        className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-400 hover:text-growmax-black hover:border-growmax-black transition-colors"
        data-testid="button-share"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={handleCopy}
        title={copied ? "Link copied!" : "Copy link"}
        className={`w-8 h-8 border flex items-center justify-center transition-colors ${
          copied
            ? "border-green-500 text-green-600 bg-green-50"
            : "border-gray-300 text-gray-400 hover:text-growmax-black hover:border-growmax-black"
        }`}
        data-testid="button-copy"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
      </button>
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
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h3 className="text-xl font-bold text-growmax-black mb-8">
          Related articles
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {related.slice(0, 3).map((r) => (
            <Link
              key={r.slug}
              href={`/blog/${r.slug}`}
              className="group border border-gray-200 bg-white p-5 hover:border-growmax-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all block"
              data-testid={`link-related-${r.slug}`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 border border-gray-200">
                {r.category}
              </span>
              <h4 className="text-sm font-bold text-growmax-black mt-3 mb-2 leading-snug group-hover:text-growmax-red transition-colors line-clamp-2">
                {r.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{r.excerpt}</p>
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
    <div className="container mx-auto px-4 md:px-8 max-w-5xl py-12 md:py-16">
      <div className="grid md:grid-cols-12 gap-10 lg:gap-16">
        <div className="md:col-span-8 prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-growmax-black prose-headings:mt-10 prose-headings:mb-4 prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:mb-5 prose-a:text-growmax-red prose-a:no-underline hover:prose-a:underline prose-img:border prose-img:border-gray-200 prose-li:text-gray-600 prose-li:leading-[1.8] prose-strong:text-growmax-black prose-strong:font-semibold prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold prose-th:text-growmax-black prose-td:border-gray-200 prose-h3:text-xl prose-h3:mt-8">
          {post.sections.map((section) => (
            <section key={section.headingId} className="mb-4">
              <h2 id={section.headingId} className="scroll-mt-24">{section.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </section>
          ))}
        </div>

        <div className="md:col-span-4 hidden md:block">
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
          <Loader2 className="w-8 h-8 animate-spin text-growmax-red mx-auto mb-4" />
          <div className="text-sm text-gray-400">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    const formattedTitle = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return (
      <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
        <div className="pt-20 pb-16 border-b-2 border-growmax-black">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-growmax-red transition-colors mb-12"
              data-testid="link-back-to-blog"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4" data-testid="text-coming-soon-label">
              Article not found
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-growmax-black mb-4" data-testid="text-coming-soon-title">
              {formattedTitle}
            </h1>
            <p className="text-gray-500 leading-relaxed max-w-xl mb-8">
              This article isn't available yet. It may still be in progress.
            </p>
            <Link href="/blog">
              <Button
                className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-11 px-8"
                data-testid="button-back-to-blog"
              >
                Browse all articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorInitials = post.author
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

      <article className="pt-16 md:pt-20 pb-12 md:pb-16 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="mb-6">
            <Breadcrumbs items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]} />
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-growmax-red transition-colors mb-10"
            data-testid="link-back-to-blog"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="bg-growmax-black text-white px-3 py-1 text-xs font-semibold uppercase tracking-wider" data-testid="text-category">
              {post.category}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {post.date}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold tracking-tight text-growmax-black leading-[1.15] mb-6"
            data-testid="text-post-title"
          >
            {post.title}
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-10" data-testid="text-post-excerpt">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-growmax-black text-white flex items-center justify-center text-xs font-bold tracking-tight">
                {authorInitials}
              </div>
              <div>
                <div className="font-semibold text-growmax-black text-sm" data-testid="text-author">
                  {post.author}
                </div>
                <div className="text-xs text-gray-400">{post.authorTeam}</div>
              </div>
            </div>

            <ShareButtons title={post.title} slug={post.slug} />
          </div>
        </div>
      </article>

      <ArticleBody post={post} />
      <RelatedArticles relatedSlugs={post.relatedSlugs || []} currentSlug={post.slug} />
    </div>
  );
}
