import { renderPage } from "../_shared/layout.js";
import { parseFrontmatter } from "../_shared/markdown.js";
import { listTopics, fetchRawMarkdown } from "../_shared/github.js";

export async function onRequest(context) {
  const { params, env, request } = context;
  const tag = decodeURIComponent(params.tag).toLowerCase();
  const token = env.GITHUB_TOKEN;

  // --- Edge cache ---
  const cache = caches.default;
  const cacheKey = new Request(new URL(`/__cache/tag/${tag}`, request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const mdFiles = await listTopics(token);

  const topics = await Promise.all(
    mdFiles.map(async (f) => {
      const slug = f.name.replace(".md", "");
      const raw = await fetchRawMarkdown(f.name, token);
      const { tags } = parseFrontmatter(raw);
      return {
        slug,
        title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        tags: tags.map(t => t.toLowerCase()),
      };
    })
  );

  const matching = topics.filter(t => t.tags.includes(tag));

  const topicCardsHtml = matching
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(t => `
      <a class="topic-card" href="/topics/${t.slug}">
        <div class="topic-info">
          <span class="topic-title">${t.title}</span>
          <div class="topic-tags">${t.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join("")}</div>
        </div>
        <span class="topic-arrow">→</span>
      </a>
    `)
    .join("");

  const body = `
    <div class="tag-header">
      <span class="tag-label">Tagged:</span>
      <span class="tag-name">${tag}</span>
      <span class="tag-count">${matching.length} topic${matching.length === 1 ? "" : "s"}</span>
    </div>
    <div class="topics">
      ${matching.length ? topicCardsHtml : '<p class="empty">No topics with this tag yet.</p>'}
    </div>
  `;

  const html = renderPage({
    title: `#${tag} — Explained`,
    body,
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
