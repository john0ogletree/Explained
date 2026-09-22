import { renderPage } from "../_shared/layout.js";
import { parseFrontmatter, renderMarkdown } from "../_shared/markdown.js";
import { fetchRawMarkdown, getAllTopics } from "../_shared/github.js";

export async function onRequest(context) {
  const { params, env, request } = context;
  const slug = params.slug;
  const token = env.GITHUB_TOKEN;

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

  const { body: mdBody } = parseFrontmatter(raw);
  const { html: bodyHtml } = renderMarkdown(mdBody);

  let navHtml = "";
  try {
    const all = await getAllTopics(token);
    const idx = all.findIndex(t => t.slug === slug);
    if (idx !== -1) {
      const prev = idx > 0 ? all[idx - 1] : null;
      const next = idx < all.length - 1 ? all[idx + 1] : null;

      if (prev || next) {
        navHtml = `<nav class="topic-nav">
          ${prev ? `<a href="/topics/${prev.slug}">
            <span class="label">← Previous</span>
            <span class="name">${prev.title}</span>
          </a>` : `<span class="spacer"></span>`}
          ${next ? `<a class="next" href="/topics/${next.slug}">
            <span class="label">Next →</span>
            <span class="name">${next.title}</span>
          </a>` : `<span class="spacer"></span>`}
        </nav>`;
      }
    }
  } catch (_) {}

  const html = renderPage({
    title: `${slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())} — Explained`,
    body: `<article>${bodyHtml}</article>${navHtml}`,
    showHeader: false,
    showComments: true,
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
