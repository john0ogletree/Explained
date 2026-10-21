# Next.js: The React Framework for Production

Next.js is an open-source React framework created by Vercel that enables developers to build full-stack web applications with server-side rendering, static site generation, and API routes — all within a single codebase. It has become the de facto standard for production React applications.

## Why Next.js Exists

React on its own is a library for building user interfaces. It renders in the browser (client-side), which means:

- The initial HTML sent to the browser is nearly empty.
- Content isn't visible until JavaScript loads and executes.
- Search engines and social preview bots see almost nothing.
- Performance on slow devices suffers.

Next.js solves these problems by moving rendering to the server (or build time) while keeping React's component model and developer experience intact.

## Core Rendering Strategies

Next.js supports multiple rendering modes, and you can mix them per page or per component.

### Server-Side Rendering (SSR)

The page is rendered on the server for **every request**. The HTML is fully formed before it reaches the browser.

```jsx
export async function getServerSideProps(context) {
  const res = await fetch(`https://api.example.com/posts/${context.params.id}`);
  const post = await res.json();
  return { props: { post } };
}

export default function Post({ post }) {
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}
```

**Use when:** content is personalized, changes often, or depends on request context (cookies, headers).

### Static Site Generation (SSG)

The page is rendered **once at build time** into static HTML. Every visitor gets the same file, served from a CDN.

```jsx
export async function getStaticProps() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return { props: { posts }, revalidate: 60 };
}

export default function Blog({ posts }) {
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

**Use when:** content is the same for everyone and doesn't need to change every second. `revalidate` enables Incremental Static Regeneration (ISR) — the page is rebuilt in the background after N seconds.

### Incremental Static Regeneration (ISR)

ISR combines SSG's speed with fresh data. You define a `revalidate` window; after it expires, the next visitor triggers a background rebuild while still receiving the cached page.

```jsx
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data }, revalidate: 30 };
}
```

This gives you static-file performance without needing to rebuild the entire site to update one page.

### Client-Side Rendering (CSR)

Standard React behavior — the page is rendered in the browser. Next.js still supports it for pages that genuinely need it (dashboards, user-specific UI), usually via `useEffect` or a data-fetching library like SWR.

## The App Router

Starting with Next.js 13, a new **App Router** (`app/` directory) replaced the legacy Pages Router as the recommended approach. It introduces:

### Server Components by Default

Every component in `app/` is a **React Server Component** unless marked otherwise. Server Components:

- Run only on the server.
- Can access databases, filesystems, and secrets directly.
- Never ship their code to the browser.
- Cannot use browser APIs or React state.

```jsx
// app/posts/page.jsx — server component by default
import { db } from '@/lib/db';

export default async function Posts() {
  const posts = await db.post.findMany();
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

Client components are opted in with `"use client"` at the top of the file.

```jsx
'use client';
import { useState } from 'react';

export default function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}
```

### Layouts and Nested Routing

The App Router uses filesystem-based routing with `layout.jsx` and `page.jsx` files. Layouts persist across navigation, so state and UI are preserved when moving between sibling routes.

```
app/
├── layout.jsx        ← root layout (html, body)
├── page.jsx          ← home
├── posts/
│   ├── layout.jsx    ← applies to all /posts/*
│   ├── page.jsx      ← /posts
│   └── [id]/
│       └── page.jsx  ← /posts/:id
└── api/
    └── hello/
        └── route.js  ← /api/hello
```

### Route Handlers (API Routes)

API endpoints live in `route.js` files and export HTTP method handlers.

```js
// app/api/hello/route.js
export async function GET() {
  return Response.json({ message: 'Hello from Next.js' });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ received: body });
}
```

### Server Actions

Server Actions let you call server code directly from a form or button without writing an API route.

```jsx
// app/todos/page.jsx
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

async function addTodo(formData) {
  'use server';
  await db.todo.create({ data: { text: formData.get('text') } });
  revalidatePath('/todos');
}

export default async function Todos() {
  const todos = await db.todo.findMany();
  return (
    <>
      <form action={addTodo}>
        <input name="text" required />
        <button type="submit">Add</button>
      </form>
      <ul>{todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>
    </>
  );
}
```

This removes the need to hand-write fetch calls, JSON serialization, and client-side state for simple mutations.

## Data Fetching

In the App Router, data fetching happens **inside Server Components** using `async`/`await` directly.

```jsx
async function getPost(id) {
  const res = await fetch(`https://api.example.com/posts/${id}`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function Post({ params }) {
  const post = await getPost(params.id);
  return <h1>{post.title}</h1>;
}
```

Fetch options include:

| Option | Effect |
|--------|--------|
| `cache: 'no-store'` | Always fetch fresh (dynamic) |
| `cache: 'force-cache'` | Cache indefinitely (static) |
| `next: { revalidate: N }` | Cache for N seconds |
| `next: { tags: ['posts'] }` | Invalidate by tag via `revalidateTag` |

Request memoization automatically dedupes identical fetches within a single render pass.

## Rendering Diagram

```
Request
   │
   ▼
┌──────────────┐
│   Edge/CDN   │──► cached static page? ──► serve immediately
└──────┬───────┘
       │ miss
       ▼
┌──────────────┐
│  Server      │──► render Server Components
│  (Node/Edge) │──► fetch data, run Server Actions
└──────┬───────┘
       │ HTML + RSC payload
       ▼
┌──────────────┐
│   Browser    │──► hydrate Client Components
└──────────────┘
```

## Styling

Next.js supports multiple styling approaches out of the box:

- **CSS Modules** — locally scoped `.module.css` files.
- **Global CSS** — imported once in the root layout.
- **Tailwind CSS** — first-class support via `create-next-app`.
- **CSS-in-JS** — works with libraries like styled-components (with caveats around Server Components).

```jsx
// Button.module.css
.button {
  background: #b45309;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
}
```

```jsx
import styles from './Button.module.css';
export default function Button({ children }) {
  return <button className={styles.button}>{children}</button>;
}
```

## Image and Font Optimization

### `next/image`

Automatically optimizes images: resizes, converts to modern formats (WebP/AVIF), lazy-loads, and prevents layout shift by requiring width and height.

```jsx
import Image from 'next/image';

<Image src="/hero.jpg" alt="Hero" width={1200} height={600} priority />
```

### `next/font`

Self-hosts Google Fonts and other web fonts at build time, eliminating the external request and the layout shift caused by font loading.

```jsx
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return <html lang="en" className={inter.className}><body>{children}</body></html>;
}
```

## Middleware

Middleware runs **before** a request is completed, at the edge. Useful for auth redirects, A/B tests, geo-based routing, and header rewriting.

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('session')?.value;
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
```

## Deployment

Next.js deploys to Vercel with zero configuration, but it runs anywhere Node.js or a compatible edge runtime runs.

| Target | Support |
|--------|---------|
| Vercel | First-class, zero-config |
| Node.js server | `next build && next start` |
| Docker | Standard Node image |
| Static export | `output: 'export'` for SSG-only sites |
| AWS / GCP / Azure | Via container or serverless adapters |
| Cloudflare / Deno | Edge runtime with limited Node APIs |

## Comparison: Pages Router vs App Router

| Feature | Pages Router (`pages/`) | App Router (`app/`) |
|---------|------------------------|---------------------|
| Default component type | Client | Server |
| Data fetching | `getServerSideProps`, `getStaticProps` | `async` in Server Components |
| Layouts | `_app.jsx` (single) | `layout.jsx` (nested) |
| API routes | `pages/api/*.js` | `app/**/route.js` |
| Mutations | API routes + client fetch | Server Actions |
| Streaming | Limited | Built-in |
| Status | Stable, legacy | Stable, recommended |

## Common Pitfalls

- **Using `useState` in a Server Component.** Any component with state, effects, or browser APIs must start with `'use client'`.
- **Overusing `'use client'`.** Pushing it too high in the tree defeats the purpose. Keep client boundaries small.
- **Fetching in Client Components by default.** Fetch in Server Components unless you truly need client-side data (e.g., polling, user-driven refetch).
- **Ignoring cache semantics.** `fetch` in the App Router is cached by default; pass `cache: 'no-store'` when you need fresh data.
- **Large Server Component payloads.** Anything passed from a Server Component to a Client Component is serialized into the RSC payload. Pass IDs, not full objects.
- **Assuming `next dev` matches production.** Development disables many caches. Always test with `next build && next start`.

## When to Use Next.js

**Good fit:**
- Content sites, blogs, docs, and marketing pages that need SEO and fast first paint.
- Full-stack apps where you want server logic and UI in one repo.
- E-commerce with a mix of static catalogs and dynamic carts.
- Any React app where performance and SEO matter.

**Poor fit:**
- Purely internal SPAs behind auth where SEO is irrelevant.
- Extremely dynamic dashboards where every pixel is user-specific and client-rendered.
- Teams unwilling to learn the Server/Client Component split.

## Summary

Next.js turns React from a client-side UI library into a full framework for production applications. Its core value propositions are:

1. **Flexible rendering** — SSR, SSG, ISR, and CSR in one codebase.
2. **Performance by default** — image, font, and script optimization out of the box.
3. **Full-stack in one repo** — API routes, Server Actions, and middleware.
4. **Server Components** — ship less JavaScript, run more on the server.
5. **Deploy anywhere** — Vercel, Docker, Node, or edge runtimes.

If you're building a React app that real users will visit at a real URL, Next.js is the most battle-tested place to start.

## Further Reading

- Official documentation: nextjs.org/docs
- Vercel examples: github.com/vercel/next.js/tree/canary/examples
- React Server Components: react.dev/reference/rsc/server-components
- *Learning Next.js* by Vercel's education team
```
