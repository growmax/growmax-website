import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost } from "@shared/schema";

const CATEGORIES = [
  "All",
  "B2B eCommerce",
  "AI Insights",
  "Partner Engagement",
  "Spare Parts",
  "Case Studies",
  "Sales & Pipeline",
  "Channel Management",
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/session"],
    retry: false,
  });

  const isAdmin = session?.isAdmin === true;

  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/posts"],
    enabled: isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/posts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/posts"] });
      toast({ title: "Post deleted" });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/logout"),
    onSuccess: () => setLocation("/admin/login"),
  });

  useEffect(() => {
    if (!sessionLoading && !isAdmin) {
      setLocation("/admin/login");
    }
  }, [session, sessionLoading, setLocation]);

  if (sessionLoading || !session) return null;

  const filtered = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 pt-24" data-testid="page-admin-dashboard">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b-2 border-growmax-black pb-4">
          <div>
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-1" data-testid="text-dashboard-label">
              Admin Panel
            </div>
            <h1 className="text-3xl font-bold tracking-tighter text-growmax-black uppercase" data-testid="text-dashboard-title">
              Blog Posts
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/posts/new">
              <Button
                className="bg-growmax-red hover:bg-growmax-black text-white rounded-none font-bold uppercase tracking-widest text-xs h-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                data-testid="button-new-post"
              >
                + New Post
              </Button>
            </Link>
            <Button
              onClick={() => logoutMutation.mutate()}
              className="bg-white hover:bg-gray-100 text-growmax-black rounded-none font-bold uppercase tracking-widest text-xs h-10 border-2 border-growmax-black"
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="rounded-none border-2 border-growmax-black h-10 font-mono"
              data-testid="input-search"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 border-2 border-growmax-black px-3 font-mono text-xs uppercase tracking-widest bg-white"
            data-testid="select-category-filter"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4" data-testid="text-post-count">
          {filtered.length} post{filtered.length !== 1 ? "s" : ""}
        </div>

        {postsLoading ? (
          <div className="font-mono text-xs text-gray-400 uppercase p-8 text-center">Loading...</div>
        ) : (
          <div className="border-2 border-growmax-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            <table className="w-full" data-testid="table-posts">
              <thead>
                <tr className="bg-growmax-black text-white">
                  <th className="font-mono text-xs uppercase tracking-widest text-left p-3">Title</th>
                  <th className="font-mono text-xs uppercase tracking-widest text-left p-3">Category</th>
                  <th className="font-mono text-xs uppercase tracking-widest text-left p-3">Date</th>
                  <th className="font-mono text-xs uppercase tracking-widest text-center p-3">Status</th>
                  <th className="font-mono text-xs uppercase tracking-widest text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50" data-testid={`row-post-${post.id}`}>
                    <td className="p-3 font-bold text-sm text-growmax-black max-w-xs truncate" data-testid={`text-title-${post.id}`}>
                      {post.title}
                    </td>
                    <td className="p-3 font-mono text-xs uppercase text-gray-600" data-testid={`text-category-${post.id}`}>
                      {post.category}
                    </td>
                    <td className="p-3 font-mono text-xs text-gray-500" data-testid={`text-date-${post.id}`}>
                      {post.date}
                    </td>
                    <td className="p-3 text-center" data-testid={`status-published-${post.id}`}>
                      <span className={`inline-block w-3 h-3 ${post.published ? "bg-green-500" : "bg-red-500"}`} />
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/posts/${post.id}/edit`}>
                          <Button
                            className="bg-white hover:bg-growmax-black hover:text-white text-growmax-black rounded-none font-mono text-xs uppercase border-2 border-growmax-black h-8 px-3"
                            data-testid={`button-edit-${post.id}`}
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          onClick={() => setDeleteId(post.id)}
                          className="bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-none font-mono text-xs uppercase border-2 border-red-600 h-8 px-3"
                          data-testid={`button-delete-${post.id}`}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center font-mono text-xs text-gray-400 uppercase" data-testid="text-no-posts">
                      No posts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="modal-delete-confirm">
          <div className="bg-white border-2 border-growmax-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full mx-4">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2">Confirm</div>
            <h2 className="text-xl font-bold tracking-tighter text-growmax-black uppercase mb-4">Delete Post?</h2>
            <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white rounded-none font-bold uppercase tracking-widest text-xs h-10 flex-1"
                data-testid="button-confirm-delete"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
              <Button
                onClick={() => setDeleteId(null)}
                className="bg-white hover:bg-gray-100 text-growmax-black rounded-none font-bold uppercase tracking-widest text-xs h-10 border-2 border-growmax-black flex-1"
                data-testid="button-cancel-delete"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
