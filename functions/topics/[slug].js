import { renderPage } from "../_shared/layout.js";
import { parseFrontmatter, renderMarkdown } from "../_shared/markdown.js";
import { fetchRawMarkdown, githubHeaders } from "../_shared/github.js";
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

  // Last commit date (best-effort — fails silently)
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
  const bodyHtml = renderMarkdown(mdBody);

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const metaParts = [];
  metaParts.push(`<span>${readingTime(mdBody)}</span>`);
  if (lastUpdated) metaParts.push(`<span>Updated ${formatDate(lastUpdated)}</span>`);
  const metaHtml = `<div class="page-meta">${metaParts.join("")}</div>`;

  const html = renderPage({
    title: `${title} — Explained`,
    tags,
    body: `${metaHtml}<article>${bodyHtml}</article>`,
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
