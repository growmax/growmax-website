import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiRequest("POST", "/api/admin/login", { password });
      setLocation("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4" data-testid="page-admin-login">
      <div className="w-full max-w-md border-2 border-growmax-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
        <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2" data-testid="text-login-label">
          Admin Access
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-growmax-black uppercase mb-8" data-testid="text-login-title">
          Blog Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest block mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-2 border-growmax-black h-12 font-mono"
              placeholder="Enter admin password"
              data-testid="input-password"
              required
            />
          </div>

          {error && (
            <div className="font-mono text-xs text-red-600 bg-red-50 border-2 border-red-600 p-3" data-testid="text-login-error">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            data-testid="button-login"
          >
            {loading ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
