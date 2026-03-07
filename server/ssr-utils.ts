export function buildStateScript(state: any): string {
  if (!state || !state.queries?.length) return "";
  const serialized = JSON.stringify(state).replace(/</g, "\\u003c");
  return `<script>window.__REACT_QUERY_STATE__=${serialized}</script>`;
}

export function injectSSR(
  template: string,
  result: { html: string; headTags: string; state: any },
): string {
  let page = template;

  page = page.replace(/<title[^>]*>.*?<\/title>/gi, "");
  page = page.replace(/<meta\s+[^>]*(?:name=["'](?:description|robots|twitter:[^"']*)|property=["']og:[^"']*)[^>]*\/?>/gi, "");
  page = page.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*\/?>/gi, "");
  page = page.replace(/<script\s+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, "");

  page = page.replace("<!--ssr-head-->", result.headTags || "");
  page = page.replace("<!--ssr-outlet-->", result.html);
  page = page.replace("<!--ssr-state-->", buildStateScript(result.state));
  return page;
}
