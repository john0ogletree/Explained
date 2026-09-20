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
