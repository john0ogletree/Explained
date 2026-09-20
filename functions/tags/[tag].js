import { renderPage } from "../_shared/layout.js";
import { getAllTopics, renderTopicCards } from "../_shared/github.js";

export async function onRequest(context) {
  const { params, env, request } = context;
  const tag = params.tag;
  const token = env.GITHUB_TOKEN;

  const cache = caches.default;
  const cacheKey = new Request(new URL(`/__cache/tag/${tag}`, request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const allTopics = await getAllTopics(token);
  const matching = allTopics.filter(t => t.tags.includes(tag));

  const allTags = [...new Set(allTopics.flatMap(t => t.tags))].sort();

  const tagPillsHtml = allTags
    .map(t => `<a class="tag-pill ${t === tag ? "active" : ""}" href="/tags/${t}">${t}</a>`)
    .join("");

  const body = `
    <h2 style="color:var(--accent); margin-top:0;">Tag: ${tag}</h2>
    ${allTags.length ? `<div class="filters">${tagPillsHtml}</div>` : ""}
    <div class="topics">
      ${matching.length ? renderTopicCards(matching) : '<p class="empty">No topics with this tag.</p>'}
    </div>
  `;

  const html = renderPage({
    title: `${tag} — Explained`,
    subtitle: `Topics tagged "${tag}".`,
    body,
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
