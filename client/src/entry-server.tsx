import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppContent } from "./App";

interface RenderResult {
  html: string;
  headTags: string;
  state: any;
}

function extractHeadTags(html: string): { cleanHtml: string; headTags: string } {
  const extractedTags: string[] = [];
  let cleanHtml = html;

  cleanHtml = cleanHtml.replace(/<title[^>]*>.*?<\/title>/gi, (match) => {
    if (!match.includes('data-replit-metadata')) {
      extractedTags.push(match);
    } else {
      const cleaned = match
        .replace(/\s*data-replit-metadata="[^"]*"/g, '')
        .replace(/\s*data-component-name="[^"]*"/g, '');
      extractedTags.push(cleaned);
    }
    return '';
  });

  cleanHtml = cleanHtml.replace(/<meta\s+[^>]*(?:name=["'](?:description|robots|twitter:[^"']*)|property=["']og:[^"']*)[^>]*\/?>/gi, (match) => {
    const cleaned = match
      .replace(/\s*data-replit-metadata="[^"]*"/g, '')
      .replace(/\s*data-component-name="[^"]*"/g, '');
    extractedTags.push(cleaned);
    return '';
  });

  cleanHtml = cleanHtml.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*\/?>/gi, (match) => {
    const cleaned = match
      .replace(/\s*data-replit-metadata="[^"]*"/g, '')
      .replace(/\s*data-component-name="[^"]*"/g, '');
    extractedTags.push(cleaned);
    return '';
  });

  cleanHtml = cleanHtml.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, (match) => {
    const cleaned = match
      .replace(/\s*data-replit-metadata="[^"]*"/g, '')
      .replace(/\s*data-component-name="[^"]*"/g, '');
    extractedTags.push(cleaned);
    return '';
  });

  return {
    cleanHtml,
    headTags: extractedTags.join('\n    '),
  };
}

export function render(url: string, initialData?: Record<string, any>): RenderResult {
  const helmetContext: Record<string, any> = {};

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
        queryFn: () => Promise.resolve(null),
      },
    },
  });

  if (initialData) {
    for (const [key, data] of Object.entries(initialData)) {
      queryClient.setQueryData([key], data);
    }
  }

  const rawHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={url}>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );

  const { cleanHtml, headTags } = extractHeadTags(rawHtml);
  const state = dehydrate(queryClient);
  queryClient.clear();

  return {
    html: cleanHtml,
    headTags,
    state,
  };
}
