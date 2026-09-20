export async function onRequest(context) {
  const { params, env, request } = context;
  const slug = params.slug;
  const token = env.GITHUB_TOKEN;

  // --- Edge cache check ---
  const cache = caches.default;
  const cacheKey = new Request(new URL(`/__cache/topic/${slug}`, request.url).toString(), { method: "GET" });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const headers = {
    "User-Agent": "cf-worker",
    "Accept": "application/vnd.github.raw",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const apiUrl = `https://api.github.com/repos/John0ogletree/Explained/contents/topics/${slug}.md`;
  const res = await fetch(apiUrl, { headers });

  if (!res.ok) {
    return new Response("Topic not found", { status: 404 });
  }

  const raw = await res.text();
  const { tags, body } = parseFrontmatter(raw);
  const bodyHtml = renderMarkdown(body);

  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());

  const tagsHtml = tags.length
    ? `<div class="page-tags">${tags.map(t => `<span class="page-tag">${t}</span>`).join("")}</div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Explained</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #fcd34d;
      --accent-strong: #f59e0b;
      --link: #93c5fd;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 3rem 1.5rem 6rem;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.75;
      min-height: 100vh;
    }
    .wrap { max-width: 720px; margin: 0 auto; }

    .back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.9rem;
      margin-bottom: 2rem;
      transition: color 0.15s ease;
    }
    .back:hover { color: var(--accent); }

    .page-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .page-tag {
      font-size: 0.7rem;
      color: var(--accent);
      background: rgba(245,158,11,0.1);
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid rgba(245,158,11,0.25);
    }

    article { font-size: 1rem; }
    article h1 {
      font-size: 2rem;
      margin: 0 0 1rem;
      background: linear-gradient(135deg, #fcd34d, #f59e0b);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.2;
    }
    article h2 {
      font-size: 1.35rem;
      color: var(--accent);
      margin-top: 2.2rem;
      margin-bottom: 0.75rem;
      padding-bottom: 0.4rem;
      border-bottom: 1px solid var(--border);
    }
    article h3 {
      font-size: 1.1rem;
      color: var(--accent);
      margin-top: 1.75rem;
      margin-bottom: 0.5rem;
    }
    article p { margin: 0 0 1rem; }
    article a { color: var(--link); text-decoration: none; }
    article a:hover { text-decoration: underline; }
    article strong { color: #fff; }
    article em { color: #cbd5e1; }
    article ul, article ol { padding-left: 1.5rem; margin: 0 0 1rem; }
    article li { margin-bottom: 0.35rem; }

    article code {
      background: var(--card);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.88em;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      color: #fca5a5;
    }
    article pre {
      background: #282c34;
      border: 1px solid var(--border);
      padding: 1rem;
      border-radius: 10px;
      overflow-x: auto;
      margin: 0 0 1.25rem;
    }
    article pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    article blockquote {
      border-left: 3px solid var(--accent-strong);
      padding-left: 1rem;
      margin: 0 0 1rem;
      color: var(--muted);
      font-style: italic;
    }
    article hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 2rem 0;
    }

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
    <a class="back" href="/">← Back to topics</a>
    ${tagsHtml}
    <article>${bodyHtml}</article>

    <div id="jao-support" style="margin-top: 2.5rem;"></div>

    <footer>Built at the edge · Cloudflare Pages</footer>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
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
  if (!match) return { tags: [], body: md };

  const yaml = match[1];
  const tagLine = yaml.match(/^tags:\s*\[(.*?)\]/m);
  const tags = tagLine
    ? tagLine[1].split(",").map(t => t.trim()).filter(Boolean)
    : [];

  return { tags, body: md.slice(match[0].length) };
}

function renderMarkdown(md) {
  md = md.replace(/^#\s+(.+)$/m, "");

  md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang ? ` class="language-${lang}"` : "";
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<pre><code${language}>${escaped}</code></pre>`;
  });

  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/^---$/gim, "<hr>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/^\s*[-*] (.*$)/gim, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gim, "<ul>$1</ul>")
    .replace(/<\/ul>\s*<ul>/g, "")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
