import { hydrateRoot, createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppContent } from "./App";
import "./index.css";

const dehydratedState = (window as any).__REACT_QUERY_STATE__;

const app = (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </HydrationBoundary>
    </QueryClientProvider>
  </HelmetProvider>
);

const rootElement = document.getElementById("root")!;

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}
