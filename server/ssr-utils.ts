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
  page = page.replace("<!--ssr-head-->", result.headTags || "");
  page = page.replace("<!--ssr-outlet-->", result.html);
  page = page.replace("<!--ssr-state-->", buildStateScript(result.state));
  return page;
}
