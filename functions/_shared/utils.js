export function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function slugifyHeading(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function unslugify(slug) {
  return slug.replace(/-/g, " ");
}

export function readingTime(text) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const PAGE_SIZE = 10;

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    page: current,
    totalPages,
    total,
  };
}

export function renderPagination(basePath, page, totalPages) {
  if (totalPages <= 1) return "";

  const parts = [];

  if (page > 1) {
    parts.push(`<a class="page-link" href="${basePath}${page - 1 === 1 ? "" : `?page=${page - 1}`}">← Prev</a>`);
  } else {
    parts.push(`<span class="page-link disabled">← Prev</span>`);
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === page) {
      parts.push(`<span class="page-link active">${i}</span>`);
    } else {
      parts.push(`<a class="page-link" href="${basePath}${i === 1 ? "" : `?page=${i}`}">${i}</a>`);
    }
  }

  if (page < totalPages) {
    parts.push(`<a class="page-link" href="${basePath}?page=${page + 1}">Next →</a>`);
  } else {
    parts.push(`<span class="page-link disabled">Next →</span>`);
  }

  return `<nav class="pagination">${parts.join("")}</nav>`;
}

export async function withCache(cacheKey, ttlSeconds, fetcher) {
  const cache = caches.default;
  const key = new Request(cacheKey);

  const hit = await cache.match(key);
  if (hit) {
    return await hit.json();
  }

  const data = await fetcher();

  const response = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${ttlSeconds}`,
    },
  });

  await cache.put(key, response);

  return data;
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
