export function parseFrontmatter(md) {
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { body: md };
  return { body: md.slice(match[0].length) };
}

export function renderMarkdown(md) {
  // Strip leading H1 (page already has one)
  md = md.replace(/^#\s+(.+)$/m, "");
  return { html: md };
}
