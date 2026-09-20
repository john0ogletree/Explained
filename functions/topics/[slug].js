import { renderPage } from "../_shared/layout.js";
import { parseFrontmatter, renderMarkdown, renderTOC } from "../_shared/markdown.js";
import { fetchRawMarkdown, githubHeaders, getAllTopics } from "../_shared/github.js";
import { readingTime, formatDate } from "../_shared/utils.js";

const REPO = "John0ogletree/Explained";

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

  // Last commit date (best-effort)
  let lastUpdated = null;
  try {
    const commitsRes = await fetch(
      `https://api.github.com/repos/${REPO}/commits?path=topics/${slug}.md&per_page=1`,
      { headers: githubHeaders(token) }
    );
    if (commitsRes.ok) {
      const commits = await commitsRes.json();
      lastUpdated = commits[0]?.commit?.committer?.date || null;
    }
  } catch (_) {}

  const { tags, body: mdBody } = parseFrontmatter(raw);
  const { html: bodyHtml, toc } = renderMarkdown(mdBody);

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const metaParts = [];
  metaParts.push(`<span>${readingTime(mdBody)}</span>`);
  if (lastUpdated) metaParts.push(`<span>Updated ${formatDate(lastUpdated)}</span>`);
  const metaHtml = `<div class="page-meta">${metaParts.join("")}</div>`;

  const tocHtml = renderTOC(toc);

  // --- Prev / Next navigation ---
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
    title: `${title} — Explained`,
    tags,
    body: `${metaHtml}${tocHtml}<article>${bodyHtml}</article>${navHtml}`,
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
