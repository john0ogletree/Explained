export function renderPage({ title, subtitle, tags, body, showHeader = true }) {
  const tagsHtml = tags && tags.length
    ? `<div class="page-tags">${tags.map(t => `<span class="page-tag">${t}</span>`).join("")}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <style>${sharedStyles()}</style>
</head>
<body>
  <div class="wrap">
    ${showHeader ? `
      <header>
        <h1>Explained</h1>
        <p class="subtitle">${subtitle || "Topics I've broken down and written about."}</p>
      </header>
    ` : `
      <a class="back" href="/">← Back to topics</a>
    `}
    ${tagsHtml}
    ${body}
    <div id="jao-support" style="margin-top: 2.5rem;"></div>
    <footer>Built at the edge · Cloudflare Pages</footer>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
  <script src="https://support.jao.life/support.js"></script>
</body>
</html>`;
}

function sharedStyles() {
  return `
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
      line-height: 1.7;
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
      line-height: 1.2;
    }
    .subtitle {
      color: var(--muted);
      font-size: 0.95rem;
      margin: 0;
    }

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

    /* Filters */
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
    .tag-pill:hover { border-color: var(--accent-strong); color: var(--accent); }
    .tag-pill.active {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
      color: #1a1a1a;
      font-weight: 600;
    }

    /* Topic list */
    .topics { display: flex; flex-direction: column; gap: 0.6rem; }
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

    .empty, .no-results {
      color: var(--muted);
      font-style: italic;
      text-align: center;
      padding: 2rem 0;
    }
    .no-results { display: none; }
    .no-results.show { display: block; }

    /* Page tags */
    .page-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .page-tag {
      font-size: 0.7rem;
      color: var(--accent);
      background: rgba(245,158,11,0.1);
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid rgba(245,158,11,0.25);
    }

    /* Article */
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
    article h3 { font-size: 1.1rem; color: var(--accent); margin-top: 1.75rem; margin-bottom: 0.5rem; }
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
  `;
}
