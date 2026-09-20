export function parseFrontmatter(md) {
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { tags: [], body: md };

  const yaml = match[1];
  const tagLine = yaml.match(/^tags:\s*\[(.*?)\]/m);
  const tags = tagLine
    ? tagLine[1].split(",").map(t => t.trim()).filter(Boolean)
    : [];

  return { tags, body: md.slice(match[0].length) };
}

export function renderMarkdown(md) {
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
