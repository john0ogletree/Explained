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
