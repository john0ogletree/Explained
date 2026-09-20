import { renderPage } from "../_shared/layout.js";
import { getAllTopics, renderTopicCards } from "../_shared/github.js";
import { paginate, renderPagination } from "../_shared/utils.js";

export async function onRequest(context) {
  const { params, env, request } = context;
  const tagSlug = params.tag;
  const token = env.GITHUB_TOKEN;

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);

  const cache = caches.default;
  const cacheKey = new Request(new URL(`/__cache/tag/${tagSlug}/${page}`, request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const allTopics = await getAllTopics(token);
  const matching = allTopics.filter(t => t.tags.some(tag => tag.slug === tagSlug));

  const allTagSlugs = [...new Set(allTopics.flatMap(t => t.tags.map(tag => tag.slug)))].sort();
  const tagNames = {};
  allTopics.forEach(t => t.tags.forEach(tag => { tagNames[tag.slug] = tag.name; }));

  const displayName = tagNames[tagSlug] || tagSlug;

  const tagPillsHtml = allTagSlugs
    .map(slug => `<a class="tag-pill ${slug === tagSlug ? "active" : ""}" href="/tags/${slug}">${tagNames[slug]}</a>`)
    .join("");

  const { items, page: currentPage, totalPages } = paginate(matching, page);

  const body = `
    <h2 style="color:var(--accent); margin-top:0;">Tag: ${displayName}</h2>
    ${allTagSlugs.length ? `<div class="filters">${tagPillsHtml}</div>` : ""}
    <div class="topics">
      ${items.length ? renderTopicCards(items) : '<p class="empty">No topics with this tag.</p>'}
    </div>
    ${renderPagination(`/tags/${tagSlug}`, currentPage, totalPages)}
  `;

  const html = renderPage({
    title: `${displayName} — Explained`,
    subtitle: `Topics tagged "${displayName}".`,
    body,
    showSearch: true,
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
