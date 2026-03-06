import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
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
import CompareB2BWave from "@/pages/arc/CompareB2BWave";
import ComparePepperi from "@/pages/arc/ComparePepperi";
import Demo from "@/pages/Demo";
import About from "@/pages/company/About";
import BlogList from "@/pages/blog/BlogList";
import BlogPost from "@/pages/blog/BlogPost";

// Comparison Pages
import CompareEnterprise from "@/pages/revenue-platform/CompareEnterprise";
import HandshakeAlternatives from "@/pages/comparisons/HandshakeAlternatives";
import TradeGeckoAlternatives from "@/pages/comparisons/TradeGeckoAlternatives";

// Industry Pages
import ElectricalDistributors from "@/pages/industries/ElectricalDistributors";
import BuildingMaterials from "@/pages/industries/BuildingMaterials";
import IndustrialManufacturing from "@/pages/industries/IndustrialManufacturing";
import FoodBeverage from "@/pages/industries/FoodBeverage";
import AutomotiveAftermarket from "@/pages/industries/AutomotiveAftermarket";

// Solution Pages
import SparePartsHub from "@/pages/solutions/SparePartsHub";

// Legal Pages
import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPostEditor from "@/pages/admin/AdminPostEditor";

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/posts/new" component={AdminPostEditor} />
      <Route path="/admin/posts/:id/edit" component={AdminPostEditor} />
      <Route path="/admin" component={AdminDashboard} />

      <Route>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Switch>
              <Route path="/" component={Home} />
              
              <Route path="/revenue-platform" component={RevenuePlatform} />
              <Route path="/revenue-platform/compare" component={CompareEnterprise} />
              <Route path="/revenue-platform/:feature" component={RevenuePlatform} />
              
              <Route path="/arc" component={Arc} />
              <Route path="/arc/pricing" component={Pricing} />
              <Route path="/arc/compare/b2b-wave" component={CompareB2BWave} />
              <Route path="/arc/compare/pepperi" component={ComparePepperi} />
              
              <Route path="/comparisons/handshake-alternatives" component={HandshakeAlternatives} />
              <Route path="/comparisons/tradegecko-alternatives" component={TradeGeckoAlternatives} />
              
              <Route path="/industries/electrical-distributors" component={ElectricalDistributors} />
              <Route path="/industries/building-materials" component={BuildingMaterials} />
              <Route path="/industries/industrial-manufacturing" component={IndustrialManufacturing} />
              <Route path="/industries/food-beverage" component={FoodBeverage} />
              <Route path="/industries/automotive-aftermarket" component={AutomotiveAftermarket} />
              
              <Route path="/solutions/spare-parts-ecommerce" component={SparePartsHub} />
              
              <Route path="/demo" component={Demo} />
              <Route path="/company/about" component={About} />
              
              <Route path="/blog" component={BlogList} />
              <Route path="/blog/:slug" component={BlogPost} />

              <Route path="/privacy" component={Privacy} />
              <Route path="/terms-of-service" component={Terms} />
              <Route path="/msa" component={Terms} />

              <Route component={NotFound} />
            </Switch>
          </main>
          <Footer />
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;