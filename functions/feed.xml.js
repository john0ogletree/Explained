import { getAllTopics } from "./_shared/github.js";
import { escapeHtml } from "./_shared/utils.js";

const SITE = "https://explained.jao.life";

export async function onRequest(context) {
  const { env, request } = context;
  const token = env.GITHUB_TOKEN;

  const cache = caches.default;
  const cacheKey = new Request(new URL("/__cache/feed", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const topics = await getAllTopics(token);
  topics.sort((a, b) => a.title.localeCompare(b.title));

  const items = topics.map(t => {
    const url = `${SITE}/topics/${t.slug}`;
    return `
    <item>
      <title>${escapeHtml(t.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeHtml(t.title)}</description>
    </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Explained</title>
    <link>${SITE}</link>
    <description>Topics I've broken down and written about.</description>
    <language>en-us</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  const response = new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}
