export async function onRequest(context) {
  const { env, request } = context;
  const token = env.GITHUB_TOKEN;

  // --- Edge cache check ---
  const cache = caches.default;
  const cacheKey = new Request(new URL("/__cache/homepage", request.url).toString(), { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const headers = {
    "User-Agent": "cf-worker",
    "Accept": "application/vnd.github+json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(
    "https://api.github.com/repos/John0ogletree/Explained/contents/topics",
    { headers }
  );

  if (!res.ok) {
    return new Response(`GitHub API error: ${res.status}`, { status: 500 });
  }

  const files = await res.json();
  const mdFiles = files.filter(f => f.type === "file" && f.name.endsWith(".md"));

  const topics = await Promise.all(
    mdFiles.map(async (f) => {
      const slug = f.name.replace(".md", "");
      const raw = await fetch(
        `https://raw.githubusercontent.com/John0ogletree/Explained/main/topics/${f.name}`
      ).then(r => r.text());

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

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Explained</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --card-hover: #263449;
      --border: #334155;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #fcd34d;
      --accent-strong: #f59e0b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 3rem 1.5rem 6rem;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
    }
    .wrap { max-width: 720px; margin: 0 auto; }

    header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    h1 {
      margin: 0 0 0.5rem;
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #fcd34d, #f59e0b);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: var(--muted);
      font-size: 0.95rem;
      margin: 0;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 1.5rem 0;
    }
    .tag-pill {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.75rem;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }
    .tag-pill:hover {
      border-color: var(--accent-strong);
      color: var(--accent);
    }
    .tag-pill.active {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
      color: #1a1a1a;
      font-weight: 600;
    }

    .topics {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .topic-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 1.1rem;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      text-decoration: none;
      color: var(--text);
      transition: all 0.15s ease;
    }
    .topic-card:hover {
      background: var(--card-hover);
      border-color: var(--accent-strong);
      transform: translateX(4px);
    }
    .topic-card.hidden { display: none; }
    .topic-info { display: flex; flex-direction: column; gap: 4px; }
    .topic-title { font-weight: 500; }
    .topic-tags { display: flex; gap: 4px; flex-wrap: wrap; }
    .topic-tag {
      font-size: 0.65rem;
      color: var(--accent);
      background: rgba(245,158,11,0.1);
      padding: 1px 8px;
      border-radius: 999px;
      border: 1px solid rgba(245,158,11,0.25);
    }
    .topic-arrow {
      color: var(--accent);
      font-size: 1.1rem;
      transition: transform 0.15s ease;
    }
    .topic-card:hover .topic-arrow { transform: translateX(4px); }

    .empty {
      color: var(--muted);
      font-style: italic;
      text-align: center;
      padding: 2rem 0;
    }
    .no-results {
      display: none;
      color: var(--muted);
      font-style: italic;
      text-align: center;
      padding: 2rem 0;
    }
    .no-results.show { display: block; }

    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--muted);
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Explained</h1>
      <p class="subtitle">Topics I've broken down and written about.</p>
    </header>

    ${allTags.length ? `<div class="filters">
      <button class="tag-pill active" data-tag="__all__">all</button>
      ${tagFilterHtml}
    </div>` : ""}

    <div class="topics" id="topics-list">
      ${topics.length ? topicCardsHtml : '<p class="empty">No topics yet.</p>'}
    </div>
    <p class="no-results" id="no-results">No topics match that tag.</p>

    <div id="jao-support" style="margin-top: 2.5rem;"></div>

    <footer>Built at the edge · Cloudflare Pages</footer>
  </div>

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
  <script src="https://support.jao.life/support.js"></script>
</body>
</html>`;

  const response = new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });

  context.waitUntil(cache.put(cacheKey, response.clone()));
  return response;
}

function parseFrontmatter(md) {
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { tags: [] };

  const yaml = match[1];
  const tagLine = yaml.match(/^tags:\s*\[(.*?)\]/m);
  const tags = tagLine
    ? tagLine[1].split(",").map(t => t.trim()).filter(Boolean)
    : [];

  return { tags };
}
