import { getAllTopics, fetchRawMarkdown } from "./_shared/github.js";
import { escapeHtml } from "./_shared/utils.js";

const SITE = "https://explained.jao.life"; // ← change if your domain differs

export async function onRequest(context) {
  const { env, request } = context;
  const token = env.GITHUB_TOKEN;

  const cache = caches.default;
  const cacheKey = new Request(new URL("/__cache/feed", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const topics = await getAllTopics(token);

  // Sort by lastUpdated desc (fallback: title)
  topics.sort((a, b) => {
    if (a.lastUpdated && b.lastUpdated) {
      return new Date(b.lastUpdated) - new Date(a.lastUpdated);
    }
    if (a.lastUpdated) return -1;
    if (b.lastUpdated) return 1;
    return a.title.localeCompare(b.title);
  });

  const items = topics.map(t => {
    const pubDate = t.lastUpdated ? new Date(t.lastUpdated).toUTCString() : new Date().toUTCString();
    const url = `${SITE}/topics/${t.slug}`;
    return `
    <item>
      <title>${escapeHtml(t.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <
