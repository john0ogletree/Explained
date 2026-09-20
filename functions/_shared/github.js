import { parseFrontmatter } from "./markdown.js";

const REPO = "John0ogletree/Explained";
const BRANCH = "main";

export function githubHeaders(token, accept = "application/vnd.github+json") {
  const headers = {
    "User-Agent": "cf-worker",
    "Accept": accept,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function listTopics(token) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/topics`,
    { headers: githubHeaders(token) }
  );
  if (!res.ok) throw new Error(`GitHub list error: ${res.status}`);
  const files = await res.json();
  return files.filter(f => f.type === "file" && f.name.endsWith(".md"));
}

export async function fetchRawMarkdown(filename, token) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO}/contents/topics/${filename}`,
    { headers: githubHeaders(token, "application/vnd.github.raw") }
  );
  if (!res.ok) throw new Error(`GitHub raw error: ${res.status}`);
  return res.text();
}

/**
 * Fetch every topic with its parsed tags, sorted by title.
 * Used by both the homepage and the tag page.
 */
export async function getAllTopics(token) {
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

  return topics.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Build the HTML for a list of topic cards.
 */
export function renderTopicCards(topics) {
  return topics
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
}
