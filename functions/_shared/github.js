import { withCache } from "./utils.js";

const REPO = "John0ogletree/Explained";
const BRANCH = "main";

const METADATA_CACHE_KEY = "https://internal.explained/__cache/topics-metadata";
const METADATA_TTL = 300;

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

async function fetchAllTopicsFromGitHub(token) {
  const mdFiles = await listTopics(token);

  const topics = mdFiles.map((f) => {
    const slug = f.name.replace(".md", "");
    return {
      slug,
      title: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    };
  });

  return topics.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getAllTopics(token) {
  return withCache(METADATA_CACHE_KEY, METADATA_TTL, () => fetchAllTopicsFromGitHub(token));
}

export function renderTopicCards(topics) {
  return topics
    .map(t => `
      <a class="topic-card" href="/topics/${t.slug}" data-search="${t.title.toLowerCase()}" data-slug="${t.slug}">
        <div class="topic-info">
          <span class="topic-title">${t.title}</span>
        </div>
        <div class="topic-right">
          <span class="topic-arrow">→</span>
        </div>
      </a>
    `)
    .join("");
}
