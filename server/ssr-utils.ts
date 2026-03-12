export function buildStateScript(state: any): string {
  if (!state || !state.queries?.length) return "";
  const serialized = JSON.stringify(state).replace(/</g, "\\u003c");
  return `<script>window.__REACT_QUERY_STATE__=${serialized}</script>`;
}

const SITE_URL = "https://www.growmax.io";
const POSTS_PER_PAGE = 18;

export function buildPaginationLinks(url: string, totalPosts: number): string {
  const cleanUrl = url.split("?")[0];
  if (cleanUrl !== "/blog") return "";

  const params = new URLSearchParams(url.split("?")[1] || "");
  const currentPage = Math.max(1, parseInt(params.get("page") || "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(Math.max(0, totalPosts - 1) / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const links: string[] = [];
  if (safePage > 1) {
    const prevHref = safePage === 2 ? `${SITE_URL}/blog` : `${SITE_URL}/blog?page=${safePage - 1}`;
    links.push(`<link rel="prev" href="${prevHref}"/>`);
  }
  if (safePage < totalPages) {
    links.push(`<link rel="next" href="${SITE_URL}/blog?page=${safePage + 1}"/>`);
  }
  return links.join("\n    ");
}

export function injectSSR(
  template: string,
  result: { html: string; headTags: string; state: any },
  paginationLinks?: string,
): string {
  let page = template;

  page = page.replace(/<title[^>]*>.*?<\/title>/gi, "");
  page = page.replace(/<meta\s+[^>]*(?:name=["'](?:description|robots|twitter:[^"']*)|property=["']og:[^"']*)[^>]*\/?>/gi, "");
  page = page.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*\/?>/gi, "");
  page = page.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");

  const headContent = [result.headTags, paginationLinks].filter(Boolean).join("\n    ");
  page = page.replace("<!--ssr-head-->", headContent);
  page = page.replace("<!--ssr-outlet-->", result.html);
  page = page.replace("<!--ssr-state-->", buildStateScript(result.state));
  return page;
}
