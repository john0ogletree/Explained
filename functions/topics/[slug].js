import { renderPage } from "../_shared/layout.js";
import { parseFrontmatter, renderMarkdown } from "../_shared/markdown.js";
import { fetchRawMarkdown } from "../_shared/github.js";

export async function onRequest(context) {
  const { params, env, request } = context;
  const slug = params.slug;
  const token = env.GITHUB_TOKEN;

  // --- Edge cache ---
  const cache = caches.default;
  const cacheKey = new Request(new URL(`/__cache/topic/${slug}`, request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let raw;
  try {
    raw = await fetchRawMarkdown(`${slug}.md`, token);
  } catch (e) {
    return new Response("Topic not found", { status: 404 });
  }

  const { tags, body: mdBody } = parseFrontmatter(raw);
  const bodyHtml = renderMarkdown(mdBody);

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const html = renderPage({
    title: `${title} — Explained`,
    tags,
    body: `<article>${bodyHtml}</article>`,
    showHeader: false,
  });

  const response = new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
