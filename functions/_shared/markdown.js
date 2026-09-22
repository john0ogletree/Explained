export function renderMarkdown(md) {
  // Strip leading H1 (page already has one)
  md = md.replace(/^#\s+(.+)$/m, "");

  // --- 1. Code fences first ---
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

  // --- 3. Headings (with anchor IDs) ---
  md = md.replace(/^(##|###)\s+(.+)$/gm, (_, hashes, text) => {
    const level = hashes.length;
    const id = slugifyHeading(text);
    return `<h${level} id="${id}">${text}<a class="anchor" href="#${id}" aria-label="Anchor">#</a></h${level}>`;
  });

  // --- 4. Other block elements ---
  md = md
    .replace(/^#\s+(.*$)/gim, "<h1>$1</h1>")
    .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
    .replace(/^---$/gim, "<hr>");

  // --- 5. Lists (nested-aware) ---
  md = renderLists(md);

  // --- 6. Inline styles ---
  md = md
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // --- 7. Paragraphs ---
  md = wrapParagraphs(md);

  // --- 8. Restore code blocks ---
  md = md.replace(/\u0000CODEBLOCK(\d+)\u0000/g, (_, i) => codeBlocks[Number(i)]);

  return { html: md };
}

function slugifyHeading(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderLists(md) {
  const lines = md.split("\n");
  const out = [];
  const stack = [];

  const indentOf = (line) => line.match(/^(\s*)/)[1].length;
  const listMatch = (line) => line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);

  const closeList = () => {
    while (stack.length) {
      out.push(stack.pop() === "ol" ? "</ol>" : "</ul>");
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = listMatch(line);

    if (!m) {
      closeList();
      out.push(line);
      continue;
    }

    const indent = m[1].length;
    const marker = m[2];
    const type = /^\d/.test(marker) ? "ol" : "ul";

    if (!stack.length) {
      out.push(type === "ol" ? "<ol>" : "<ul>");
      stack.push(type);
    } else if (indent > indentOf(lines[i - 1] || "")) {
      out.push(type === "ol" ? "<ol>" : "<ul>");
      stack.push(type);
    } else if (stack.length > 1 && indent < indentOf(lines[i - 1] || "")) {
      while (stack.length > 1) {
        out.push(stack.pop() === "ol" ? "</ol>" : "</ul>");
      }
    }

    out.push(`<li>${m[3]}</li>`);
  }

  closeList();
  return out.join("\n");
}

function wrapParagraphs(md) {
  const blockTags = /^<(h[1-6]|ul|ol|li|pre|blockquote|hr|table|thead|tbody|tr|th|td|nav)/i;

  const lines = md.split("\n");
  const out = [];
  let buffer = [];

  const flush = () => {
    if (!buffer.length) return;
    const text = buffer.join(" ").trim();
    if (text) out.push(`<p>${text}</p>`);
    buffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (blockTags.test(trimmed) || /^<\//.test(trimmed) || trimmed.includes("\u0000CODEBLOCK")) {
      flush();
      out.push(trimmed);
      continue;
    }
    buffer.push(trimmed);
  }

  flush();
  return out.join("\n");
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

function inline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}
