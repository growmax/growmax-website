import { Link } from "wouter";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 pt-16">
      <SEOHead
        title="Page Not Found | Growmax"
        description="The page you are looking for does not exist. Return to the Growmax homepage to explore our B2B commerce platform."
        path="/404"
      />
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-16 w-16 text-growmax-red" />
        </div>
        <h1 className="text-5xl font-bold tracking-tighter text-growmax-black mb-4 uppercase" data-testid="text-404-title">404</h1>
        <p className="text-xl text-gray-600 font-light mb-8" data-testid="text-404-message">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/">
          <Button className="bg-growmax-black hover:bg-growmax-red text-white h-12 px-8 rounded-none font-bold transition-colors" data-testid="button-go-home">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
