import { renderPage } from "./_shared/layout.js";
import { parseFrontmatter } from "./_shared/markdown.js";
import { listTopics, fetchRawMarkdown } from "./_shared/github.js";

export async function onRequest(context) {
  const { env, request } = context;
  const token = env.GITHUB_TOKEN;

  // --- Edge cache ---
  const cache = caches.default;
  const cacheKey = new Request(new URL("/__cache/homepage", request.url).toString());
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
        tags,
      };
    })
  );

  const allTags = [...new Set(topics.flatMap(t => t.tags))].sort();

  const tagFilterHtml = allTags
    .map(t => `<button class="tag-pill" data-tag="${t}">${t}</button>`)
    .join("");

  const topicCardsHtml = topics
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(t => `
      <a class="topic-card" href="/topics/${t.slug}" data-tags="${t.tags.join(" ")}">
        <div class="topic-info">
          <span class="topic-title">${t.title}</span>
          ${t.tags.length ? `<div class="topic-tags">${t.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join("")}</div>` : ""}
        </div>
        <span class="topic-arrow">→</span>
      </a>
    `)
    .join("");

  const body = `
    ${allTags.length ? `<div class="filters">
      <button class="tag-pill active" data-tag="__all__">all</button>
      ${tagFilterHtml}
    </div>` : ""}

    <div class="topics" id="topics-list">
      ${topics.length ? topicCardsHtml : '<p class="empty">No topics yet.</p>'}
    </div>
    <p class="no-results" id="no-results">No topics match that tag.</p>

    <script>
      (function () {
        var pills = document.querySelectorAll('.tag-pill');
        var cards = document.querySelectorAll('.topic-card');
        var noResults = document.getElementById('no-results');
        pills.forEach(function (pill) {
          pill.addEventListener('click', function () {
            var tag = pill.dataset.tag;
            pills.forEach(function (p) { p.classList.remove('active'); });
            pill.classList.add('active');
            var visible = 0;
            cards.forEach(function (card) {
              var cardTags = (card.dataset.tags || '').split(' ').filter(Boolean);
              var show = tag === '__all__' || cardTags.indexOf(tag) !== -1;
              card.classList.toggle('hidden', !show);
              if (show) visible++;
            });
            noResults.classList.toggle('show', visible === 0);
          });
        });
      })();
    </script>
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
