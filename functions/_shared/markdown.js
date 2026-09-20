import { slugify } from "./utils.js";

export function parseFrontmatter(md) {
  const match = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { tags: [], body: md };

  const yaml = match[1];
  const tagLine = yaml.match(/^tags:\s*\[(.*?)\]/m);
  const tags = tagLine
    ? tagLine[1].split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const tagObjects = tags.map(t => ({ name: t, slug: slugify(t) }));

  return { tags: tagObjects, body: md.slice(match[0].length) };
}

export function renderMarkdown(md) {
  // Strip leading H1 (page already has one)
  md = md.replace(/^#\s+(.+)$/m, "");

  // --- 1. Code fences first (protect from other transformations) ---
  const codeBlocks = [];
  md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const language = lang ? ` class="language-${lang}"` : "";
    const escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const placeholder = `\u0000CODEBLOCK${codeBlocks.length}\u0000`;
    codeBlocks.push(`<pre><code${language}>${escaped}</code></pre>`);
    return placeholder;
  });

  // --- 2. Tables ---
  md = md.replace(
    /(^\|.+\|\s*\n\|[\s:|-]+\|\s*\n(?:\|.*\|\s*\n?)+)/gm,
    (tableBlock) => renderTable(tableBlock)
  );

  // --- 3. Everything else ---
  md = md
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

  // --- 4. Restore code blocks ---
  md = md.replace(/\u0000CODEBLOCK(\d+)\u0000/g, (_, i) => codeBlocks[Number(i)]);

  return md;
}

function renderTable(block) {
  const lines = block.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return block;

  const splitRow = (line) =>
    line
      .replace(/^\||\|$/g, "")
      .split("|")
      .map(cell => cell.trim());

  const headers = splitRow(lines[0]);
  const rows = lines.slice(2).map(splitRow);

  const alignments = splitRow(lines[1]).map(spec => {
    if (/^:?-+:$/.test(spec)) return "center";
    if (/^-+:$/.test(spec)) return "right";
    if (/^:-+$/.test(spec)) return "left";
    return "";
  });

  const styleFor = (i) => (alignments[i] ? ` style="text-align:${alignments[i]}"` : "");

  const thead = `<thead><tr>${headers
    .map((h, i) => `<th${styleFor(i)}>${inline(h)}</th>`)
    .join("")}</tr></thead>`;

  const tbody = `<tbody>${rows
    .map(
      row =>
        `<tr>${row
          .map((cell, i) => `<td${styleFor(i)}>${inline(cell)}</td>`)
          .join("")}</tr>`
    )
    .join("")}</tbody>`;

  return `<table>${thead}${tbody}</table>`;
}

// Apply inline formatting to table cells (bold, italic, code, links)
function inline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}
