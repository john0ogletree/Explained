# CSS: The Language of Visual Style

CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of documents written in HTML or XML. Created by Håkon Wium Lie at CERN in 1994 and standardized by the W3C, CSS is one of the three foundational technologies of the web — alongside HTML for structure and JavaScript for behavior. It controls every visual aspect of a page: layout, color, typography, animation, and responsive behavior.

## Why CSS Exists

Before CSS, styling was embedded in HTML through presentational tags like `<font>`, `<center>`, and `bgcolor` attributes. This made documents verbose, inconsistent, and impossible to restyle without editing every page.

CSS introduced **separation of concerns**:

- **HTML** describes *what* content is.
- **CSS** describes *how* it looks.
- **JavaScript** describes *what it does*.

A single stylesheet can restyle thousands of pages. Change one rule, and every page updates. This separation is the foundation of modern web development.

## How CSS Works

A stylesheet is a list of **rules**. Each rule has a **selector** and a **declaration block**.

```css
selector {
  property: value;
  property: value;
}
```

```css
h1 {
  color: #1a1e24;
  font-size: 2rem;
  margin-bottom: 1rem;
}
```

The browser reads HTML, builds a **DOM tree**, then applies CSS rules to produce a **render tree**, then paints it on screen.

## Including CSS in a Page

Three methods, in order of preference:

```html
<!-- external (preferred) -->
<link rel="stylesheet" href="/styles.css">

<!-- internal -->
<style>
  body { margin: 0; }
</style>

<!-- inline (avoid except for dynamic values) -->
<p style="color: red;">text</p>
```

## Selectors

Selectors target elements. A few dozen exist, but most code uses a small subset.

### Basic Selectors

```css
*              /* universal */
element        /* type, e.g. p */
.class         /* class */
#id            /* id */
[attr]         /* attribute present */
[attr="val"]   /* attribute equals */
[attr^="val"]  /* starts with */
[attr$="val"]  /* ends with */
[attr*="val"]  /* contains */
```

### Combinators

```css
a b            /* descendant */
a > b          /* direct child */
a + b          /* adjacent sibling */
a ~ b          /* general sibling */
```

### Pseudo-Classes

```css
:hover, :focus, :active, :visited       /* state */
:first-child, :last-child, :nth-child(2n)
:not(.excluded)
:is(h1, h2, h3)                         /* matches any */
:where(h1, h2, h3)                      /* like :is but zero specificity */
:has(> img)                             /* parent selector */
:root                                   /* html element */
```

### Pseudo-Elements

```css
::before, ::after          /* generated content */
::first-line, ::first-letter
::selection                /* user-selected text */
::placeholder              /* input placeholder */
```

### Specificity

When two rules conflict, the more specific one wins. Specificity is a weighted count:

| Component | Weight |
|-----------|--------|
| Inline style | 1000 |
| ID | 100 |
| Class, attribute, pseudo-class | 10 |
| Element, pseudo-element | 1 |

```css
p { color: blue; }               /* 0,0,0,1 */
.intro { color: green; }         /* 0,0,1,0 */
#main { color: red; }            /* 0,1,0,0 */
p.intro { color: purple; }       /* 0,0,1,1 */
```

Higher specificity wins. Equal specificity: last rule wins. `!important` overrides everything (and should be avoided except in utilities or emergency fixes).

**Modern best practice:** keep specificity flat. Use single-class selectors (`.card`, `.button`) instead of nesting (`#main .sidebar ul li a`). Tools like CSS Modules, Tailwind, and CSS-in-JS enforce this automatically.

### Inheritance and the Cascade

Some properties inherit (`color`, `font-family`, `line-height`); others don't (`margin`, `padding`, `border`).

The cascade resolves conflicts in this order:

1. **Origin** — user-agent, user, author styles.
2. **Importance** — normal, then `!important`.
3. **Specificity** — higher wins.
4. **Order** — later rules win.

`@layer` (CSS Cascade Layers, 2022) adds explicit control over the cascade.

```css
@layer reset, base, components, utilities;

@layer base {
  h1 { font-size: 2rem; }
}

@layer utilities {
  .text-sm { font-size: 0.875rem; }
}
```

Utilities always win because the layer is declared last.

## The Box Model

Every element is a box with four layers:

```
┌───────────────────────────┐
│         margin            │
│  ┌─────────────────────┐  │
│  │      border         │  │
│  │  ┌───────────────┐  │  │
│  │  │    padding    │  │  │
│  │  │  ┌─────────┐  │  │  │
│  │  │  │ content │  │  │  │
│  │  │  └─────────┘  │  │  │
│  │  └───────────────┘  │  │
│  └─────────────────────┘  │
└───────────────────────────┘
```

```css
.box {
  width: 200px;
  height: 100px;
  padding: 16px;
  border: 1px solid #ccc;
  margin: 8px;
}
```

**`box-sizing: border-box`** makes `width` and `height` include padding and border, which is almost always what you want.

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

## Layout: Flexbox

Flexbox is a **one-dimensional** layout system — perfect for rows or columns.

```css
.container {
  display: flex;
  flex-direction: row;         /* row | column */
  justify-content: center;     /* main axis alignment */
  align-items: center;         /* cross axis alignment */
  gap: 1rem;
  flex-wrap: wrap;
}

.item {
  flex: 1 1 200px;             /* grow shrink basis */
}
```

| Property | Values | Meaning |
|----------|--------|---------|
| `justify-content` | `flex-start`, `center`, `space-between`, `space-around`, `space-evenly` | Main axis |
| `align-items` | `flex-start`, `center`, `stretch`, `baseline` | Cross axis |
| `gap` | length | Space between items |
| `flex` | `grow shrink basis` | Sizing |
| `order` | integer | Visual order |

Flexbox solved the "centering problem" that haunted CSS for 15 years:

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Layout: Grid

Grid is a **two-dimensional** layout system — rows and columns at once.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 1rem;
}

.span-2 {
  grid-column: span 2;
}

/* named template areas */
.page {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }
```

`fr` units divide remaining space proportionally. `minmax()`, `auto-fit`, and `auto-fill` handle responsive layouts without media queries.

```css
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
```

**Rule of thumb:** Grid for page-level layout and two-dimensional arrangements; Flexbox for one-dimensional alignment (nav bars, buttons, card contents).

## Responsive Design

### Media Queries

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
}

@media (min-width: 1024px) and (orientation: landscape) {
  /* ... */
}

@media (prefers-color-scheme: dark) {
  body { background: #111; color: #eee; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

### Fluid Typography with `clamp()`

```css
h1 {
  font-size: clamp(1.5rem, 1rem + 2vw, 2.5rem);
}
```

Scales smoothly between a minimum and maximum without any media queries.

### Container Queries

Container queries (2023) respond to a **container's** size, not the viewport.

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    gap: 1rem;
  }
}
```

This makes components truly self-contained — they adapt to wherever they're placed, not just the screen size.

## Colors

```css
.element {
  color: #ff6600;
  color: #f60;                    /* shorthand */
  color: rgb(255 102 0);
  color: rgb(255 102 0 / 0.5);    /* alpha */
  color: hsl(24 100% 50%);
  color: oklch(70% 0.15 50);      /* modern, perceptual */
  color: transparent;
  color: currentColor;            /* inherits text color */
}
```

Modern CSS prefers **OKLCH** for perceptually uniform color, and **`light-dark()`** for automatic light/dark theming.

```css
:root {
  --accent: oklch(60% 0.15 50);
  color-scheme: light dark;
}

.button {
  background: light-dark(#eee, #222);
  color: light-dark(#111, #eee);
}
```

## Typography

```css
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0;
  text-rendering: optimizeLegibility;
}

h1 {
  font-size: 2rem;
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

p {
  max-width: 65ch;               /* readable line length */
  text-wrap: pretty;             /* modern browser hint */
}
```

`ch` units (character width) give a readable measure. `text-wrap: balance` and `pretty` improve line breaks in headings and paragraphs.

## Custom Properties (CSS Variables)

Variables make stylesheets maintainable and enable runtime theming.

```css
:root {
  --color-bg: #fefefe;
  --color-text: #1a1e24;
  --color-accent: #b45309;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 1rem;
  --radius: 10px;
}

.button {
  background: var(--color-accent);
  color: var(--color-bg);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #121211;
    --color-text: #efefec;
    --color-accent: #f0a05c;
  }
}
```

Custom properties cascade, so you can override them per-component or per-scope.

```css
.card {
  --radius: 4px;                /* overrides for children */
}
```

## Transitions and Animations

### Transitions

Animate property changes over time.

```css
.button {
  background: var(--color-accent);
  transition: background 0.15s ease, transform 0.1s ease;
}

.button:hover {
  background: #93370d;
  transform: translateY(-1px);
}
```

### Keyframe Animations

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.enter {
  animation: fadeIn 0.4s ease forwards;
}
```

### Transforms

```css
.element {
  transform: translate(10px, 20px);
  transform: rotate(45deg);
  transform: scale(1.5);
  transform: skew(10deg);
  transform: translate(10px, 20px) rotate(45deg) scale(1.5);
  transform-origin: center;
}
```

Transforms are GPU-accelerated — animate `transform` and `opacity` for smooth 60fps motion. Avoid animating `width`, `height`, `top`, and `left`.

## Modern CSS Features

| Feature | Purpose |
|---------|---------|
| Flexbox | 1D layout |
| Grid | 2D layout |
| Custom properties | Variables |
| `clamp()`, `min()`, `max()` | Fluid sizing |
| Container queries | Responsive by parent |
| `:has()` | Parent selector |
| `@layer` | Cascade control |
| Nesting | Write selectors inside selectors |
| `color-mix()` | Blend colors |
| `oklch()`, `lch()` | Perceptual color |
| `text-wrap: balance/pretty` | Better line breaks |
| `:is()`, `:where()` | Selector grouping |
| Logical properties | `margin-inline`, `padding-block` |
| `aspect-ratio` | Width:height without hacks |
| `gap` in flexbox | Space between items |
| `scroll-snap` | Carousels without JS |
| `@scope` | Scoped styles (in progress) |
| View Transitions | Page/state transitions |

### Nesting

Native CSS nesting (2023) allows writing:

```css
.card {
  padding: 1rem;
  background: white;

  & .title {
    font-weight: 600;
  }

  &:hover {
    background: #f5f5f5;
  }
}
```

This was a preprocessor feature (Sass/Less) that's now built into the platform.

## CSS Architecture

Large projects need conventions to avoid specificity wars and dead code.

### BEM (Block Element Modifier)

```css
.card {}
.card__title {}
.card__body {}
.card--featured {}
```

Flat, readable, low specificity. Still used in many codebases.

### Utility-First (Tailwind)

```html
<div class="p-4 bg-white rounded-lg shadow-md flex gap-2">
  <button class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
    Save
  </button>
</div>
```

No custom CSS. Every style is a single class. Predictable but verbose.

### CSS Modules

```css
/* Button.module.css */
.button { background: #b45309; }
```

```js
import styles from "./Button.module.css";
<button className={styles.button} />
```

Class names are scoped at build time — no global collisions.

### CSS-in-JS

Styles written in JavaScript, scoped to components.

```js
const Button = styled.button`
  background: #b45309;
  padding: 0.5rem 1rem;
`;
```

Used in React with `styled-components`, `emotion`, or `vanilla-extract`. Compile-time versions (`vanilla-extract`, `Linaria`) have zero runtime cost.

### Cascade Layers

`@layer` gives explicit control over the cascade — reset, base, components, utilities — eliminating the `!important` arms race.

## Accessibility

CSS is part of accessibility. Common requirements:

```css
/* never remove focus outlines without replacement */
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

/* respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* minimum tap target */
button {
  min-height: 44px;
  min-width: 44px;
}

/* visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* respect user color scheme */
@media (prefers-contrast: more) {
  :root { --color-text: #000; }
}
```

## Common Pitfalls

- **Fighting specificity.** Deeply nested selectors and `!important` are symptoms. Refactor to flat classes or use `@layer`.
- **Not using `box-sizing: border-box`.** The default `content-box` makes padding and border add to width, causing layout surprises.
- **Animating layout properties.** Animating `width`, `height`, `top`, or `left` triggers expensive layout. Use `transform` and `opacity`.
- **Magic numbers.** Hardcoded pixel values scattered everywhere. Use custom properties and a consistent spacing scale.
- **Ignoring `prefers-reduced-motion`.** Motion can cause nausea for some users. Always respect the setting.
- **Removing focus outlines.** A common accessibility failure. Use `:focus-visible` to style focus without breaking keyboard navigation.
- **Fixed heights on text containers.** Content changes break them. Use `min-height` or `auto`.
- **`z-index` chaos.** Stacking contexts are tricky. Use `isolation: isolate` and a documented z-index scale.
- **Not testing on real devices.** Chrome's device emulator is not a phone. Test on actual hardware for touch, viewport, and font rendering.
- **Over-engineering with frameworks.** A marketing page doesn't need 300KB of CSS. Start with plain CSS and add complexity only when it earns its place.

## Performance

- **Keep selectors simple.** Browsers match right-to-left; deep selectors are slow.
- **Avoid layout thrashing.** Reading layout (`offsetHeight`) then writing (`style.height`) in a loop forces reflow.
- **Use `content-visibility: auto`** on long pages to skip rendering off-screen sections.
- **Prefer `transform` and `opacity` for animation.** They're composited on the GPU.
- **Inline critical CSS.** Ship above-the-fold styles in `<head>`, defer the rest.
- **Use `will-change` sparingly.** It consumes GPU memory and can hurt performance if overused.
- **Avoid `@import` in production.** It serializes downloads. Use `<link>` or a bundler.

## CSS Variables vs Preprocessor Variables

| | CSS Custom Properties | Sass/Less Variables |
|--|----------------------|---------------------|
| Scope | DOM tree, cascades | Compile time only |
| Runtime | Changeable via JS | Fixed at build |
| Inheritance | Yes | No |
| Media queries | Yes, in values | Yes, in rules |
| Usage | Theming, dynamic | Computation, loops |

Modern projects use both — Sass for build-time computation, custom properties for runtime theming.

## Where CSS Is Used

- **Every website** in existence.
- **Web apps** — React, Vue, Svelte, Angular all ship CSS.
- **Mobile apps** — React Native uses a CSS-like style object; NativeScript supports CSS.
- **Desktop apps** — Electron and Tauri apps are styled with CSS.
- **Email** — CSS with severe constraints (no flexbox, no grid, inline only).
- **Print** — `@media print` for PDF and paper output.
- **SVG** — SVG elements accept CSS properties.
- **Design systems** — tokens, components, and docs are all built on CSS.

## When to Use Plain CSS vs a Framework

**Plain CSS:**
- Small sites, static pages, prototypes.
- Projects with a strong design system and disciplined team.
- Anything where bundle size is critical.
- Email, embedded widgets, third-party embeds.

**Tailwind / utility CSS:**
- Projects with many contributors and frequent UI changes.
- Teams that prefer constraints over freedom.
- Design systems with a fixed token scale.

**CSS Modules / CSS-in-JS:**
- Component-based frameworks (React, Vue, Svelte).
- Projects that need scoped styles and colocated CSS.

There's no universally right answer. The wrong answer is starting with a heavy framework before you know what the project needs.

## Summary

CSS's value comes down to five things:

1. **Separation of concerns** — structure, presentation, and behavior are independent.
2. **The cascade** — one stylesheet can restyle thousands of pages.
3. **Layout systems** — Flexbox and Grid solve every layout problem that once required hacks.
4. **Responsiveness** — media queries, container queries, and fluid units adapt to any device.
5. **Zero runtime cost** — CSS is parsed and applied by the browser, not executed by JavaScript.

CSS has a reputation for being frustrating, and for a decade that was fair: floats, table hacks, centering problems, specificity wars. But the modern platform has changed everything. Flexbox, Grid, custom properties, container queries, `clamp()`, and cascade layers have made CSS more expressive and more predictable than it has ever been. If your last serious CSS project was before 2020, it's worth taking another look — the language has fundamentally changed.

## Further Reading

- MDN CSS reference: developer.mozilla.org/docs/Web/CSS
- CSS-Tricks: css-tricks.com
- *Every Layout* by Heydon Pickering and Andy Bell: every-layout.dev
- *CSS: The Definitive Guide* by Eric Meyer and Estelle Weyl
- *Refactoring UI* by Adam Wathan and Steve Schoger
- Web.dev CSS: web.dev/learn/css
- Can I Use: caniuse.com
- Modern CSS Solutions: moderncss.dev
