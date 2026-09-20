import { renderPage } from "./_shared/layout.js";
import { getAllTopics, renderTopicCards } from "./_shared/github.js";

export async function onRequest(context) {
  const { env, request } = context;
  const token = env.GITHUB_TOKEN;

  const cache = caches.default;
  const cacheKey = new Request(new URL("/__cache/homepage", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const topics = await getAllTopics(token);
  const allTags = [...new Set(topics.flatMap(t => t.tags))].sort();

  const tagPillsHtml = allTags
    .map(t => `<a class="tag-pill" href="/tags/${t}">${t}</a>`)
    .join("");

  const body = `
    ${allTags.length ? `<div class="filters">${tagPillsHtml}</div>` : ""}
    <div class="topics">
      ${topics.length ? renderTopicCards(topics) : '<p class="empty">No topics yet.</p>'}
    </div>
  `;

  const html = renderPage({
    title: "Explained",
    subtitle: "Topics I've broken down and written about.",
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
