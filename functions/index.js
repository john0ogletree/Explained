import { renderPage } from "./_shared/layout.js";
import { getAllTopics, renderTopicCards } from "./_shared/github.js";
import { paginate, renderPagination } from "./_shared/utils.js";

export async function onRequest(context) {
  const { env, request } = context;
  const token = env.GITHUB_TOKEN;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const cache = caches.default;
  const cacheKey = new Request(new URL(`/__cache/homepage/${page}`, request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const topics = await getAllTopics(token);
  const allTags = [...new Set(topics.flatMap(t => t.tags.map(tag => tag.slug)))].sort();

  const tagNames = {};
  topics.forEach(t => t.tags.forEach(tag => { tagNames[tag.slug] = tag.name; }));

  const tagPillsHtml = allTags
    .map(slug => `<a class="tag-pill" href="/tags/${slug}">${tagNames[slug]}</a>`)
    .join("");

  const { items, page: currentPage, totalPages } = paginate(topics, page);

  const body = `
    ${allTags.length ? `<div class="filters">${tagPillsHtml}</div>` : ""}
    <div class="topics">
      ${items.length ? renderTopicCards(items) : '<p class="empty">No topics yet.</p>'}
    </div>
    ${renderPagination("/", currentPage, totalPages)}
  `;

  const html = renderPage({
    title: "Explained",
    subtitle: "Topics I've broken down and written about.",
    body,
    showSearch: true,
    showCommentCounts: true,
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
