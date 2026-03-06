import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import Home from "@/pages/Home";
import RevenuePlatform from "@/pages/revenue-platform/RevenuePlatform";
import Arc from "@/pages/arc/Arc";
import Pricing from "@/pages/arc/Pricing";
import CompareB2BWave from "@/pages/arc/CompareB2BWave";
import ComparePepperi from "@/pages/arc/ComparePepperi";
import CompareNowCommerce from "@/pages/arc/CompareNowCommerce";
import CompareCin7 from "@/pages/arc/CompareCin7";
import CompareUnleashed from "@/pages/arc/CompareUnleashed";
import Demo from "@/pages/Demo";
import About from "@/pages/company/About";
import BlogList from "@/pages/blog/BlogList";
import BlogPost from "@/pages/blog/BlogPost";

import CompareEnterprise from "@/pages/revenue-platform/CompareEnterprise";
import HandshakeAlternatives from "@/pages/comparisons/HandshakeAlternatives";
import TradeGeckoAlternatives from "@/pages/comparisons/TradeGeckoAlternatives";
import SanaCommerceAlternatives from "@/pages/comparisons/SanaCommerceAlternatives";
import OroCommerceAlternatives from "@/pages/comparisons/OroCommerceAlternatives";
import BigCommerceB2BAlternatives from "@/pages/comparisons/BigCommerceB2BAlternatives";
import ShopifyPlusB2BAlternatives from "@/pages/comparisons/ShopifyPlusB2BAlternatives";
import MagentoB2BAlternatives from "@/pages/comparisons/MagentoB2BAlternatives";
import Dynamics365Alternatives from "@/pages/comparisons/Dynamics365Alternatives";
import SalesforceCommerceAlternatives from "@/pages/comparisons/SalesforceCommerceAlternatives";
import WooCommerceB2BAlternatives from "@/pages/comparisons/WooCommerceB2BAlternatives";
import ZohoCommerceAlternatives from "@/pages/comparisons/ZohoCommerceAlternatives";
import SAPCommerceCloudAlternatives from "@/pages/comparisons/SAPCommerceCloudAlternatives";
import OracleCommerceAlternatives from "@/pages/comparisons/OracleCommerceAlternatives";
import NetSuiteSuiteCommerceAlternatives from "@/pages/comparisons/NetSuiteSuiteCommerceAlternatives";

import ElectricalDistributors from "@/pages/industries/ElectricalDistributors";
import BuildingMaterials from "@/pages/industries/BuildingMaterials";
import IndustrialManufacturing from "@/pages/industries/IndustrialManufacturing";
import FoodBeverage from "@/pages/industries/FoodBeverage";
import AutomotiveAftermarket from "@/pages/industries/AutomotiveAftermarket";
import PlumbingHvac from "@/pages/industries/PlumbingHvac";
import JanitorialSanitation from "@/pages/industries/JanitorialSanitation";
import SafetyPpe from "@/pages/industries/SafetyPpe";
import IndustrialFasteners from "@/pages/industries/IndustrialFasteners";
import PumpValve from "@/pages/industries/PumpValve";
import ChemicalDistributors from "@/pages/industries/ChemicalDistributors";
import PackagingDistributors from "@/pages/industries/PackagingDistributors";

import SparePartsHub from "@/pages/solutions/SparePartsHub";

import WriteForUs from "@/pages/WriteForUs";

import Privacy from "@/pages/legal/Privacy";
import Terms from "@/pages/legal/Terms";

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
              <Route path="/arc/compare/nowcommerce" component={CompareNowCommerce} />
              <Route path="/arc/compare/cin7" component={CompareCin7} />
              <Route path="/arc/compare/unleashed" component={CompareUnleashed} />
              
              <Route path="/comparisons/handshake-alternatives" component={HandshakeAlternatives} />
              <Route path="/comparisons/tradegecko-alternatives" component={TradeGeckoAlternatives} />
              <Route path="/comparisons/sana-commerce-alternatives" component={SanaCommerceAlternatives} />
              <Route path="/comparisons/orocommerce-alternatives" component={OroCommerceAlternatives} />
              <Route path="/comparisons/bigcommerce-b2b-alternatives" component={BigCommerceB2BAlternatives} />
              <Route path="/comparisons/shopify-plus-b2b-alternatives" component={ShopifyPlusB2BAlternatives} />
              <Route path="/comparisons/magento-b2b-alternatives" component={MagentoB2BAlternatives} />
              <Route path="/comparisons/dynamics-365-commerce-alternatives" component={Dynamics365Alternatives} />
              <Route path="/comparisons/salesforce-commerce-alternatives" component={SalesforceCommerceAlternatives} />
              <Route path="/comparisons/woocommerce-b2b-alternatives" component={WooCommerceB2BAlternatives} />
              <Route path="/comparisons/zoho-commerce-alternatives" component={ZohoCommerceAlternatives} />
              <Route path="/comparisons/sap-commerce-cloud-alternatives" component={SAPCommerceCloudAlternatives} />
              <Route path="/comparisons/oracle-commerce-alternatives" component={OracleCommerceAlternatives} />
              <Route path="/comparisons/netsuite-suitecommerce-alternatives" component={NetSuiteSuiteCommerceAlternatives} />
              
              <Route path="/industries/electrical-distributors" component={ElectricalDistributors} />
              <Route path="/industries/building-materials" component={BuildingMaterials} />
              <Route path="/industries/industrial-manufacturing" component={IndustrialManufacturing} />
              <Route path="/industries/food-beverage" component={FoodBeverage} />
              <Route path="/industries/automotive-aftermarket" component={AutomotiveAftermarket} />
              <Route path="/industries/plumbing-hvac" component={PlumbingHvac} />
              <Route path="/industries/janitorial-sanitation" component={JanitorialSanitation} />
              <Route path="/industries/safety-ppe" component={SafetyPpe} />
              <Route path="/industries/industrial-fasteners" component={IndustrialFasteners} />
              <Route path="/industries/pump-valve" component={PumpValve} />
              <Route path="/industries/chemical-distributors" component={ChemicalDistributors} />
              <Route path="/industries/packaging-distributors" component={PackagingDistributors} />
              
              <Route path="/solutions/spare-parts-ecommerce" component={SparePartsHub} />
              
              <Route path="/demo" component={Demo} />
              <Route path="/company/about" component={About} />
              
              <Route path="/blog" component={BlogList} />
              <Route path="/blog/:slug" component={BlogPost} />
              <Route path="/write-for-us" component={WriteForUs} />

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
