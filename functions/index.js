export async function onRequest(context) {
  const res = await fetch(
    "https://api.github.com/repos/John0ogletree/Explained/contents/topics",
    { headers: { "User-Agent": "cf-worker" } }
  );

  const files = await res.json();

  const topics = files
    .filter(f => f.type === "file" && f.name.endsWith(".md"))
    .map(f => ({
      slug: f.name.replace(".md", ""),
      title: f.name
        .replace(".md", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase()),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const listHtml = topics
    .map(t => `
      <a class="topic-card" href="/topics/${t.slug}">
        <span class="topic-title">${t.title}</span>
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
      --link: #93c5fd;
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
      margin-bottom: 2.5rem;
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
    .topic-title { font-weight: 500; }
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

    <div class="topics">
      ${topics.length ? listHtml : '<p class="empty">No topics yet.</p>'}
    </div>

    <div id="jao-support" style="margin-top: 2.5rem;"></div>

    <footer>Built at the edge · Cloudflare Pages</footer>
  </div>

  <script src="https://support.jao.life/support.js"></script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
