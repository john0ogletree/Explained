import { parseFrontmatter } from "./markdown.js";
import { withCache } from "./utils.js";

const REPO = "John0ogletree/Explained";
const BRANCH = "main";

const METADATA_CACHE_KEY = "https://internal.explained/__cache/topics-metadata";
const METADATA_TTL = 300; // seconds

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
 * Uncached version: hits GitHub for every topic file.
 */
async function fetchAllTopicsFromGitHub(token) {
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
 * Cached version: only hits GitHub once per TTL.
 */
export async function getAllTopics(token) {
  return withCache(METADATA_CACHE_KEY, METADATA_TTL, () => fetchAllTopicsFromGitHub(token));
}

export function renderTopicCards(topics) {
  return topics
    .map(t => `
      <a class="topic-card" href="/topics/${t.slug}" data-search="${t.title.toLowerCase()} ${t.tags.map(tag => tag.name.toLowerCase()).join(" ")}">
        <div class="topic-info">
          <span class="topic-title">${t.title}</span>
          ${t.tags.length ? `<div class="topic-tags">${t.tags.map(tag => `<a class="topic-tag" href="/tags/${tag.slug}">${tag.name}</a>`).join("")}</div>` : ""}
        </div>
        <span class="topic-arrow">→</span>
      </a>
    `)
    .join("");
}
