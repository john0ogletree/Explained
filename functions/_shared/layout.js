export function renderPage({
  title,
  subtitle,
  tags,
  body,
  showHeader = true,
  showSearch = false,
  showComments = false,
  showCommentCounts = false,
}) {
  const tagsHtml = tags && tags.length
    ? `<div class="page-tags">${tags.map(t => `<a class="page-tag" href="/tags/${t.slug}">${t.name}</a>`).join("")}</div>`
    : "";

  const searchHtml = showSearch
    ? `<div class="search-wrap">
        <input type="search" id="topic-search" placeholder="Search topics…" autocomplete="off">
      </div>`
    : "";

  const commentsHtml = showComments
    ? `<section class="comments-wrap">
        <h2>Comments</h2>
        <div class="comments-disclaimer">
          <strong>Heads up:</strong> comments here are temporarily hosted through
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer">Giscus</a>,
          which stores them as GitHub Discussions on this site's repository. That means:
          <ul>
            <li>Posting a comment requires a GitHub account.</li>
            <li>Your comment, GitHub username, and any linked profile info are visible to GitHub and anyone reading the discussion.</li>
            <li>This setup is a temporary measure while I work on a self-hosted comment system. When that's ready, existing comments will be migrated if possible.</li>
            <li>If you'd rather not use GitHub, you're welcome to reach out via the support links at the bottom of this page instead.</li>
          </ul>
          Nothing here is tracked by me directly — Giscus and GitHub handle the data under their own policies.
        </div>
        <div id="giscus-container"></div>
        <script src="https://giscus.app/client.js"
          data-repo="John0ogletree/Explained"
          data-repo-id="R_kgDOUi66wA"
          data-category="General"
          data-category-id="DIC_kwDOUi66wM4DGC-D"
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="1"
          data-input-position="top"
          data-theme="noborder_gray"
          data-lang="en"
          data-loading="lazy"
          crossorigin="anonymous"
          async>
        </script>
      </section>`
    : "";

  const commentCountScript = showCommentCounts
    ? `<script>
        (function () {
          var counts = {};
          var listeners = [];
          window.addEventListener('message', function (event) {
            if (event.origin !== 'https://giscus.app') return;
            var data = event.data;
            if (!data || !data.giscus) return;

            var pathname = data.giscus.discussion || '';
            var match = /\\/topics\\/([^/?#]+)/.exec(pathname);
            if (!match) return;
            var slug = match[1];

            if (data.giscus.totalCommentCount !== undefined) {
              counts[slug] = data.giscus.totalCommentCount;
              listeners.forEach(function (fn) { fn(slug, counts[slug]); });
            }
          });

          function renderCount(el, slug, count) {
            if (!count) { el.textContent = ''; return; }
            el.textContent = '💬 ' + count;
            el.title = count + ' comment' + (count === 1 ? '' : 's');
          }

          function check() {
            document.querySelectorAll('.comment-count').forEach(function (el) {
              var slug = el.dataset.slug;
              if (counts[slug] !== undefined) renderCount(el, slug, counts[slug]);
            });
          }

          listeners.push(check);

          document.querySelectorAll('.comment-count').forEach(function (el) {
            var slug = el.dataset.slug;
            var iframe = document.createElement('iframe');
            iframe.src = 'https://giscus.app/en/iframe?src=' + encodeURIComponent(location.origin + '/topics/' + slug) + '&repo=John0ogletree%2FExplained&repoId=R_kgDOUi66wA&category=General&categoryId=DIC_kwDOUi66wM4DGC-D&mapping=pathname&strict=0&reactionsEnabled=1&emitMetadata=1&inputPosition=top&theme=noborder_gray&lang=en&loading=lazy';
            iframe.style.display = 'none';
            iframe.loading = 'lazy';
            document.body.appendChild(iframe);
          });
        })();
      </script>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="alternate" type="application/rss+xml" title="Explained" href="/feed.xml">
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
    ${searchHtml}
    ${tagsHtml}
    ${body}
    <p class="no-results" id="no-results">No topics match your search.</p>
    ${commentsHtml}
    <div id="jao-support" style="margin-top: 2.5rem;"></div>
    <footer>Built at the edge · Cloudflare Pages · <a href="/feed.xml">RSS</a></footer>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
  <script>
    (function () {
      var input = document.getElementById('topic-search');
      var noResults = document.getElementById('no-results');
      if (!input) return;
      var cards = Array.prototype.slice.call(document.querySelectorAll('.topic-card'));
      input.addEventListener('input', function () {
        var q = input.value.toLowerCase().trim();
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = card.dataset.search || '';
          var match = !q || haystack.indexOf(q) !== -1;
          card.classList.toggle('hidden', !match);
          if (match) visible++;
        });
        if (noResults) noResults.classList.toggle('show', visible === 0);
      });
    })();
  </script>
  ${commentCountScript}
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

    header { margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
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
    .subtitle { color: var(--muted); font-size: 0.95rem; margin: 0; }

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

    .search-wrap { margin: 1.5rem 0 1rem; }
    #topic-search {
      width: 100%;
      padding: 10px 14px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-size: 0.95rem;
      font-family: inherit;
      transition: border-color 0.15s ease;
    }
    #topic-search:focus { outline: none; border-color: var(--accent-strong); }
    #topic-search::placeholder { color: var(--muted); }

    .filters { display: flex; flex-wrap: wrap; gap: 0.4rem; margin: 1.5rem 0; }
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
      text-decoration: none;
      display: inline-block;
    }
    .tag-pill:hover { border-color: var(--accent-strong); color: var(--accent); }
    .tag-pill.active {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
      color: #1a1a1a;
      font-weight: 600;
    }

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
    .topic-info { display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .topic-title { font-weight: 500; }
    .topic-meta { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; }
    .topic-tag {
      font-size: 0.65rem;
      color: var(--accent);
      background: rgba(245,158,11,0.1);
      padding: 1px 8px;
      border-radius: 999px;
      border: 1px solid rgba(245,158,11,0.25);
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .topic-tag:hover { background: rgba(245,158,11,0.2); }
    .topic-right { display: flex; align-items: center; gap: 8px; }
    .comment-count {
      font-size: 0.7rem;
      color: var(--muted);
      white-space: nowrap;
    }
    .topic-arrow {
      color: var(--accent);
      font-size: 1.1rem;
      transition: transform 0.15s ease;
    }
    .topic-card:hover .topic-arrow { transform: translateX(4px); }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin: 2rem 0 0;
      flex-wrap: wrap;
    }
    .page-link {
      display: inline-block;
      padding: 6px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.85rem;
      transition: all 0.15s ease;
    }
    .page-link:hover { border-color: var(--accent-strong); color: var(--accent); }
    .page-link.active {
      background: var(--accent-strong);
      border-color: var(--accent-strong);
      color: #1a1a1a;
      font-weight: 600;
    }
    .page-link.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      pointer-events: none;
    }

    .empty, .no-results {
      color: var(--muted);
      font-style: italic;
      text-align: center;
      padding: 2rem 0;
    }
    .no-results { display: none; }
    .no-results.show { display: block; }

    .page-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1rem; }
    .page-tag {
      font-size: 0.7rem;
      color: var(--accent);
      background: rgba(245,158,11,0.1);
      padding: 2px 10px;
      border-radius: 999px;
      border: 1px solid rgba(245,158,11,0.25);
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .page-tag:hover { background: rgba(245,158,11,0.2); }

    .page-meta {
      display: flex;
      gap: 1rem;
      color: var(--muted);
      font-size: 0.8rem;
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border);
    }
    .page-meta span::before { content: '· '; margin-right: 4px; }
    .page-meta span:first-child::before { content: ''; margin: 0; }

    .toc {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
      font-size: 0.9rem;
    }
    .toc-title {
      color: var(--accent);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.6rem;
    }
    .toc ul { list-style: none; padding: 0; margin: 0; }
    .toc li { margin-bottom: 0.3rem; }
    .toc a {
      color: var(--text);
      text-decoration: none;
      transition: color 0.15s ease;
    }
    .toc a:hover { color: var(--accent); }

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
      scroll-margin-top: 1rem;
    }
    article h3 {
      font-size: 1.1rem;
      color: var(--accent);
      margin-top: 1.75rem;
      margin-bottom: 0.5rem;
      scroll-margin-top: 1rem;
    }
    article h2 .anchor,
    article h3 .anchor {
      opacity: 0;
      margin-left: 8px;
      color: var(--muted);
      text-decoration: none;
      font-weight: 400;
      transition: opacity 0.15s ease;
    }
    article h2:hover .anchor,
    article h3:hover .anchor { opacity: 1; }
    article h2 .anchor:hover,
    article h3 .anchor:hover { color: var(--accent); }

    article p { margin: 0 0 1rem; }
    article a { color: var(--link); text-decoration: none; }
    article a:hover { text-decoration: underline; }
    article strong { color: #fff; }
    article em { color: #cbd5e1; }
    article ul, article ol { padding-left: 1.5rem; margin: 0 0 1rem; }
    article li { margin-bottom: 0.35rem; }
    article ul ul, article ul ol, article ol ul, article ol ol { margin: 0.35rem 0 0; }

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
    article hr { border: none; border-top: 1px solid var(--border); margin: 2rem 0; }

    article table {
      width: 100%;
      border-collapse: collapse;
      margin: 0 0 1.5rem;
      font-size: 0.92rem;
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      display: block;
      overflow-x: auto;
    }
    article thead { background: var(--card); }
    article th {
      padding: 10px 14px;
      text-align: left;
      color: var(--accent);
      font-weight: 600;
      font-size: 0.85rem;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }
    article td {
      padding: 9px 14px;
      border-bottom: 1px solid rgba(51,65,85,0.5);
      color: var(--text);
    }
    article tbody tr:last-child td { border-bottom: none; }
    article tbody tr:hover { background: rgba(38,52,73,0.4); }

    .topic-nav {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .topic-nav a {
      flex: 1;
      padding: 12px 16px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      text-decoration: none;
      color: var(--text);
      transition: all 0.15s ease;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .topic-nav a:hover {
      border-color: var(--accent-strong);
      transform: translateY(-2px);
    }
    .topic-nav .label {
      font-size: 0.7rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .topic-nav .name {
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--accent);
    }
    .topic-nav .next { text-align: right; margin-left: auto; }
    .topic-nav .spacer { flex: 1; }

    .comments-wrap {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .comments-wrap h2 {
      font-size: 1.1rem;
      color: var(--accent);
      margin: 0 0 1rem;
    }

    .comments-disclaimer {
      background: rgba(245,158,11,0.06);
      border: 1px solid rgba(245,158,11,0.25);
      border-left: 3px solid var(--accent-strong);
      border-radius: 10px;
      padding: 0.9rem 1.1rem;
      font-size: 0.82rem;
      color: var(--muted);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .comments-disclaimer strong { color: var(--accent); }
    .comments-disclaimer a { color: var(--link); text-decoration: none; }
    .comments-disclaimer a:hover { text-decoration: underline; }
    .comments-disclaimer ul {
      margin: 0.6rem 0 0.6rem 1.2rem;
      padding: 0;
    }
    .comments-disclaimer li { margin-bottom: 0.3rem; }

    footer {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--muted);
      font-size: 0.8rem;
    }
    footer a { color: var(--link); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  `;
}
