import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Pages
import Home from "@/pages/Home";
import RevenuePlatform from "@/pages/revenue-platform/RevenuePlatform";
import Arc from "@/pages/arc/Arc";
import Pricing from "@/pages/arc/Pricing";
import Demo from "@/pages/Demo";
import About from "@/pages/company/About";
import BlogList from "@/pages/blog/BlogList";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          
          <Route path="/revenue-platform" component={RevenuePlatform} />
          <Route path="/revenue-platform/:feature" component={RevenuePlatform} />
          
          <Route path="/arc" component={Arc} />
          <Route path="/arc/pricing" component={Pricing} />
          <Route path="/arc/compare/:competitor" component={Arc} />
          
          <Route path="/demo" component={Demo} />
          <Route path="/company/about" component={About} />
          
          <Route path="/blog" component={BlogList} />

          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;