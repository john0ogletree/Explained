export async function onRequest(context) {
  const res = await fetch(
    "https://api.github.com/repos/John0ogletree/Explained/contents/topics",
    { headers: { "User-Agent": "cf-worker" } }
  );

  const files = await res.json();

  const topics = files
    .filter(f => f.type === "file" && f.name.endsWith(".md"))
    .map(f => ({
      slug: f.name.replace(".md", ""),
      title: f.name
        .replace(".md", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase()),
    }));

  const listHtml = topics
    .map(t => `<li><a href="/topics/${t.slug}">${t.title}</a></li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Explained</title>
</head>
<body>
  <h1>Explained Topics</h1>
  <ul>${listHtml}</ul>
  <div id="jao-support"></div>
  <script src="https://support.jao.life/support.js"></script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}
