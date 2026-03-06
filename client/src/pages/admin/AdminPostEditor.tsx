import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = [
  "B2B eCommerce",
  "AI Insights",
  "Partner Engagement",
  "Spare Parts",
  "Case Studies",
  "Sales & Pipeline",
  "Channel Management",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type Section = { heading: string; headingId: string; content: string };

export default function AdminPostEditor() {
  const params = useParams<{ id: string }>();
  const editId = params.id;
  const isEdit = !!editId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [date, setDate] = useState("");
  const [author, setAuthor] = useState("Growmax Team");
  const [authorTeam, setAuthorTeam] = useState("Growmax Core Team");
  const [readTime, setReadTime] = useState("5 Min Read");
  const [excerpt, setExcerpt] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [published, setPublished] = useState(false);
  const [legacyUrl, setLegacyUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  const { data: session, isLoading: sessionLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/session"],
    retry: false,
  });

  const isAdmin = session?.isAdmin === true;

  const { data: existingPost, isLoading: postLoading } = useQuery<BlogPost>({
    queryKey: [`/api/admin/posts/${editId}`],
    enabled: isEdit && isAdmin,
  });

  useEffect(() => {
    if (!sessionLoading && !isAdmin) {
      setLocation("/admin/login");
    }
  }, [session, sessionLoading, setLocation]);

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title);
      setSlug(existingPost.slug);
      setCategory(existingPost.category);
      setDate(existingPost.date);
      setAuthor(existingPost.author);
      setAuthorTeam(existingPost.authorTeam);
      setReadTime(existingPost.readTime);
      setExcerpt(existingPost.excerpt);
      setSections((existingPost.sections as Section[]) || []);
      setPublished(existingPost.published);
      setLegacyUrl(existingPost.legacyUrl || "");
      setSlugManual(true);
    }
  }, [existingPost]);

  useEffect(() => {
    if (!slugManual) {
      setSlug(slugify(title));
    }
  }, [title, slugManual]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        title,
        slug,
        category,
        date,
        author,
        authorTeam,
        readTime,
        excerpt,
        sections: sections.length > 0 ? sections : null,
        published,
        legacyUrl: legacyUrl || null,
      };
      if (isEdit) {
        return apiRequest("PUT", `/api/admin/posts/${editId}`, body);
      }
      return apiRequest("POST", "/api/admin/posts", body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({ title: isEdit ? "Post updated" : "Post created" });
      if (!isEdit) setLocation("/admin");
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const addSection = () => {
    setSections([...sections, { heading: "", headingId: "", content: "" }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "heading") {
      updated[index].headingId = slugify(value);
    }
    setSections(updated);
  };

  if (sessionLoading || !session) return null;
  if (isEdit && postLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="font-mono text-xs text-gray-400 uppercase">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 pt-24" data-testid="page-admin-editor">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b-2 border-growmax-black pb-4">
          <div>
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-1" data-testid="text-editor-label">
              {isEdit ? "Edit Post" : "New Post"}
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-growmax-black uppercase" data-testid="text-editor-title">
              {isEdit ? "Edit Post" : "Create Post"}
            </h1>
          </div>
          <Link href="/admin" className="font-mono text-xs uppercase tracking-widest text-growmax-red hover:text-growmax-black" data-testid="link-back-dashboard">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (slugManual) {} else { setSlugManual(false); } }}
                className="rounded-none border-2 border-growmax-black h-10 font-mono"
                data-testid="input-title"
              />
            </div>
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Slug</label>
              <Input
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManual(true); }}
                className="rounded-none border-2 border-growmax-black h-10 font-mono"
                data-testid="input-slug"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 border-2 border-growmax-black px-3 font-mono text-xs uppercase tracking-widest bg-white"
                data-testid="select-category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Date</label>
              <Input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="May 15, 2025"
                className="rounded-none border-2 border-growmax-black h-10 font-mono"
                data-testid="input-date"
              />
            </div>
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Read Time</label>
              <Input
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="rounded-none border-2 border-growmax-black h-10 font-mono"
                data-testid="input-read-time"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Author</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="rounded-none border-2 border-growmax-black h-10 font-mono"
                data-testid="input-author"
              />
            </div>
            <div>
              <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Author Team</label>
              <Input
                value={authorTeam}
                onChange={(e) => setAuthorTeam(e.target.value)}
                className="rounded-none border-2 border-growmax-black h-10 font-mono"
                data-testid="input-author-team"
              />
            </div>
          </div>

          <div>
            <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full border-2 border-growmax-black p-3 font-mono text-sm resize-y"
              data-testid="input-excerpt"
            />
          </div>

          <div>
            <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">Legacy URL (optional)</label>
            <Input
              value={legacyUrl}
              onChange={(e) => setLegacyUrl(e.target.value)}
              placeholder="/old-blog-path"
              className="rounded-none border-2 border-growmax-black h-10 font-mono"
              data-testid="input-legacy-url"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-5 h-5 border-2 border-growmax-black accent-growmax-red"
              data-testid="checkbox-published"
            />
            <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest">Published</label>
          </div>

          <div className="border-2 border-growmax-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-4">
              <div className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest">
                Sections ({sections.length})
              </div>
              <Button
                type="button"
                onClick={addSection}
                className="bg-growmax-red hover:bg-growmax-black text-white rounded-none font-mono text-xs uppercase h-8 px-4"
                data-testid="button-add-section"
              >
                + Add Section
              </Button>
            </div>

            {sections.length === 0 && (
              <div className="font-mono text-xs text-gray-400 uppercase text-center py-8" data-testid="text-no-sections">
                No sections yet. Add one to start writing.
              </div>
            )}

            {sections.map((section, i) => (
              <div key={i} className="border border-gray-200 p-4 mb-4" data-testid={`section-${i}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-xs text-gray-500 uppercase">Section {i + 1}</div>
                  <Button
                    type="button"
                    onClick={() => removeSection(i)}
                    className="bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-none font-mono text-xs uppercase border border-red-600 h-7 px-2"
                    data-testid={`button-remove-section-${i}`}
                  >
                    Remove
                  </Button>
                </div>
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="font-mono text-[10px] text-gray-500 uppercase block mb-1">Heading</label>
                    <Input
                      value={section.heading}
                      onChange={(e) => updateSection(i, "heading", e.target.value)}
                      className="rounded-none border border-gray-300 h-9 font-mono text-sm"
                      data-testid={`input-section-heading-${i}`}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-gray-500 uppercase block mb-1">Heading ID</label>
                    <Input
                      value={section.headingId}
                      onChange={(e) => updateSection(i, "headingId", e.target.value)}
                      className="rounded-none border border-gray-300 h-9 font-mono text-sm text-gray-500"
                      data-testid={`input-section-heading-id-${i}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-[10px] text-gray-500 uppercase block mb-1">Content (HTML)</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(i, "content", e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 p-3 font-mono text-xs resize-y"
                    data-testid={`input-section-content-${i}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-12 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              data-testid="button-save"
            >
              {saveMutation.isPending ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
            </Button>
            <Button
              type="button"
              onClick={() => setShowPreview(true)}
              className="bg-white hover:bg-gray-100 text-growmax-black rounded-none font-bold uppercase tracking-widest text-xs h-12 px-8 border-2 border-growmax-black"
              data-testid="button-preview"
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-testid="modal-preview">
          <div className="bg-white border-2 border-growmax-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-growmax-black p-4 flex items-center justify-between z-10">
              <div className="font-mono text-xs text-growmax-red uppercase tracking-widest">Preview</div>
              <Button
                onClick={() => setShowPreview(false)}
                className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-mono text-xs uppercase h-8 px-4"
                data-testid="button-close-preview"
              >
                Close
              </Button>
            </div>
            <div className="p-8">
              <div className="font-mono text-xs uppercase tracking-widest text-growmax-red mb-2">{category}</div>
              <h1 className="text-4xl font-bold tracking-tighter text-growmax-black mb-4" data-testid="preview-title">{title}</h1>
              <div className="flex gap-4 font-mono text-xs text-gray-500 uppercase mb-4">
                <span>{date}</span>
                <span>{readTime}</span>
                <span>{author}</span>
              </div>
              <p className="text-gray-600 font-light leading-relaxed border-l-4 border-growmax-red pl-6 mb-8">{excerpt}</p>
              <div className="prose max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-growmax-black prose-p:text-gray-700 prose-p:font-light prose-p:leading-relaxed">
                {sections.map((section) => (
                  <div key={section.headingId || section.heading}>
                    <h2>{section.heading}</h2>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
