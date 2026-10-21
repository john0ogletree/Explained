# HTML: The Structure of the Web

HTML (HyperText Markup Language) is the standard markup language for creating documents on the World Wide Web. Created by Tim Berners-Lee at CERN in 1991, it is the backbone of every web page ever published. HTML describes the **structure and meaning** of content — headings, paragraphs, lists, links, forms, images, and media — while CSS handles presentation and JavaScript handles behavior.

## Why HTML Exists

Before HTML, sharing documents across different computer systems required proprietary formats. Berners-Lee designed HTML to solve two problems at once:

- **Portability** — a document written once could be read on any machine.
- **Linkability** — any document could reference any other document, creating a web of information.

HTML was inspired by SGML (Standard Generalized Markup Language), a heavyweight document-description standard used in publishing. HTML simplified SGML into a small set of tags anyone could learn in an hour.

The core idea: **separate content from presentation.** A heading is a heading because it's marked `<h1>`, not because it's bold and 2em. Browsers, screen readers, search engines, and assistive technologies all rely on this semantic structure.

## How HTML Works

An HTML document is a tree of **elements**, each with a **tag name**, optional **attributes**, and **content**.

```html
<tag attribute="value">content</tag>
```

The browser parses the markup into a **Document Object Model (DOM)** — a live tree of objects that CSS styles and JavaScript manipulates.

```
document
└── html
    ├── head
    │   ├── title
    │   └── meta
    └── body
        ├── header
        │   └── h1
        └── main
            └── p
```

## Document Skeleton

Every HTML5 page starts with the same boilerplate.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <meta name="description" content="Page description">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <h1>Hello, world</h1>
  <script src="/app.js" defer></script>
</body>
</html>
```

| Part | Purpose |
|------|---------|
| `<!DOCTYPE html>` | Triggers standards mode |
| `<html lang="en">` | Root element; `lang` helps screen readers and translation |
| `<head>` | Metadata — not rendered |
| `<meta charset="UTF-8">` | Character encoding |
| `<meta name="viewport" ...>` | Mobile viewport |
| `<title>` | Browser tab and search results |
| `<link>` | External resources (stylesheets, icons) |
| `<body>` | Visible content |
| `<script defer>` | Loads script without blocking parsing |

## Semantic Elements

Semantic elements describe the **meaning** of their content, not just its appearance. They're essential for accessibility, SEO, and maintainability.

### Structure

```html
<header>       <!-- top of page or section -->
<nav>          <!-- navigation links -->
<main>         <!-- primary content, one per page -->
<article>      <!-- self-contained content (post, card) -->
<section>      <!-- thematic grouping with a heading -->
<aside>        <!-- tangential content (sidebar) -->
<footer>       <!-- bottom of page or section -->
```

A typical page:

```html
<body>
  <header>
    <h1>Site Name</h1>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <header>
        <h2>Article Title</h2>
        <p>By <a href="/authors/ada">Ada</a> on <time datetime="2024-01-15">Jan 15</time></p>
      </header>
      <p>Article content…</p>
    </article>
  </main>

  <aside>
    <h2>Related</h2>
    <ul><li><a href="/post/2">Another post</a></li></ul>
  </aside>

  <footer>
    <p>&copy; 2024</p>
  </footer>
</body>
```

### Text Content

```html
<h1>…<h6>        <!-- headings, h1 is top-level -->
<p>              <!-- paragraph -->
<br>             <!-- line break -->
<hr>             <!-- thematic break -->
<blockquote>     <!-- quotation -->
<pre>            <!-- preformatted text -->
<code>           <!-- inline code -->
<strong>         <!-- strong importance -->
<em>             <!-- emphasis -->
<mark>           <!-- highlighted text -->
<small>          <!-- fine print -->
<sub>, <sup>     <!-- subscript, superscript -->
<abbr>           <!-- abbreviation -->
<cite>           <!-- title of a work -->
<q>              <!-- short inline quote -->
<time>           <!-- date/time -->
<kbd>            <!-- keyboard input -->
<samp>           <!-- sample output -->
<var>            <!-- mathematical variable -->
```

### Lists

```html
<ul>              <!-- unordered (bulleted) -->
  <li>Item</li>
  <li>Item</li>
</ul>

<ol>              <!-- ordered (numbered) -->
  <li>First</li>
  <li>Second</li>
</ol>

<dl>              <!-- description list -->
  <dt>Term</dt>
  <dd>Definition</dd>
</dl>
```

### Links

```html
<a href="https://example.com">text</a>
<a href="/page">internal link</a>
<a href="#section">anchor on the same page</a>
<a href="mailto:hi@example.com">email</a>
<a href="tel:+15551234567">phone</a>
<a href="/file.pdf" download>download</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">new tab</a>
```

`rel="noopener"` prevents the linked page from accessing `window.opener` — a minor security and performance issue. `rel="noreferrer"` also strips the `Referer` header.

### Images and Media

```html
<img src="/photo.jpg" alt="Description of the photo" width="600" height="400" loading="lazy">

<figure>
  <img src="/chart.png" alt="Revenue grew 40% in Q3">
  <figcaption>Q3 revenue growth</figcaption>
</figure>

<picture>
  <source srcset="/photo.avif" type="image/avif">
  <source srcset="/photo.webp" type="image/webp">
  <img src="/photo.jpg" alt="Fallback">
</picture>

<video controls width="640" poster="/poster.jpg">
  <source src="/video.mp4" type="video/mp4">
  <track kind="captions" src="/captions.vtt" srclang="en">
</video>

<audio controls src="/song.mp3"></audio>
```

`alt` is required for accessibility. Empty `alt=""` is correct for decorative images.

`loading="lazy"` defers off-screen images.

### Tables

Tables are for **tabular data**, not layout.

```html
<table>
  <caption>Quarterly revenue</caption>
  <thead>
    <tr>
      <th scope="col">Quarter</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>$10M</td>
    </tr>
    <tr>
      <th scope="row">Q2</th>
      <td>$14M</td>
    </tr>
  </tbody>
  <tfoot>
    <tr><td colspan="2">Total: $24M</td></tr>
  </tfoot>
</table>
```

`<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `scope`, and `headers` attributes all improve accessibility.

### Forms

```html
<form action="/submit" method="post">
  <fieldset>
    <legend>Contact</legend>

    <label for="name">Name</label>
    <input id="name" name="name" type="text" required>

    <label for="email">Email</label>
    <input id="email" name="email" type="email" required>

    <label for="message">Message</label>
    <textarea id="message" name="message" rows="4"></textarea>

    <label>
      <input type="checkbox" name="newsletter" value="yes">
      Subscribe to newsletter
    </label>

    <label>
      <input type="radio" name="plan" value="free" checked>
      Free
    </label>
    <label>
      <input type="radio" name="plan" value="pro">
      Pro
    </label>

    <select name="country">
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
    </select>

    <button type="submit">Send</button>
  </fieldset>
</form>
```

### Input Types

HTML5 added many input types with built-in validation and mobile keyboard optimization.

| Type | Purpose |
|------|---------|
| `text` | Plain text |
| `email` | Email address |
| `password` | Masked input |
| `number` | Numeric with spinner |
| `tel` | Telephone number |
| `url` | URL with validation |
| `search` | Search box |
| `date`, `time`, `datetime-local` | Date and time pickers |
| `color` | Color picker |
| `range` | Slider |
| `file` | File upload |
| `checkbox`, `radio` | Booleans and choices |
| `hidden` | Not displayed but submitted |

### Other Form Elements

```html
<datalist id="fruits">
  <option value="apple">
  <option value="banana">
</datalist>
<input list="fruits" name="fruit">

<progress value="70" max="100">70%</progress>

<meter value="0.7" min="0" max="1">70%</meter>

<details>
  <summary>Click to expand</summary>
  <p>Hidden content</p>
</details>

<dialog id="modal">
  <p>Modal content</p>
  <button onclick="document.getElementById('modal').close()">Close</button>
</dialog>
```

`<details>` and `<dialog>` provide interactive UI with zero JavaScript.

### Inline Semantics

```html
<span>          <!-- generic inline container -->
<strong>        <!-- importance -->
<em>            <!-- emphasis -->
<b>             <!-- stylistic offset, no importance -->
<i>             <!-- alternate voice, no emphasis -->
<u>             <!-- stylistic underline (avoid) -->
<s>             <!-- strikethrough (no longer accurate) -->
<del>           <!-- deleted content -->
<ins>           <!-- inserted content -->
<mark>          <!-- highlighted -->
<code>          <!-- inline code -->
<sub>, <sup>    <!-- sub/superscript -->
```

`<b>` and `<i>` were originally presentational. They remain in the spec with new semantics (offsets of voice/style) but `<strong>` and `<em>` convey actual meaning.

## Global Attributes

These work on every element.

| Attribute | Purpose |
|-----------|---------|
| `id` | Unique identifier |
| `class` | Space-separated style hooks |
| `style` | Inline CSS |
| `title` | Tooltip text |
| `lang` | Language of content |
| `dir` | Text direction (`ltr`, `rtl`, `auto`) |
| `hidden` | Hide element |
| `tabindex` | Keyboard focus order |
| `contenteditable` | Editable in browser |
| `draggable` | HTML5 drag-and-drop |
| `data-*` | Custom data attributes |

```html
<div id="app" class="container dark" data-user-id="42" data-role="admin">
```

`data-*` attributes are the standard way to attach custom data to elements.

## Accessibility

HTML is where accessibility begins. Most of it is just using the right element.

### Landmarks

Semantic elements create landmark regions that screen readers use for navigation.

```html
<header>   <!-- banner -->
<nav>      <!-- navigation -->
<main>     <!-- main content (only one) -->
<aside>    <!-- complementary -->
<footer>   <!-- contentinfo -->
<form>     <!-- search (if it's a search form) -->
```

### Labels

Every form control needs a label.

```html
<label for="email">Email</label>
<input id="email" type="email">
```

Or wrap:

```html
<label>
  Email
  <input type="email">
</label>
```

### ARIA

ARIA (Accessible Rich Internet Applications) attributes fill gaps in native semantics. Use them only when no HTML element does the job.

```html
<button aria-label="Close dialog">×</button>

<div role="tablist">
  <button role="tab" aria-selected="true" aria-controls="panel-1">Tab 1</button>
  <button role="tab" aria-selected="false" aria-controls="panel-2">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1">Content</div>

<div role="status" aria-live="polite">Saved</div>
```

**First rule of ARIA:** don't use ARIA. Use the native element. `<button>` is better than `<div role="button">`.

### Alt Text

```html
<img src="cat.jpg" alt="A tabby cat sleeping in a sunbeam">
<img src="divider.png" alt="">                    <!-- decorative -->
<img src="chart.png" alt="Revenue by quarter: Q1 $10M, Q2 $14M, Q3 $18M">
```

### Skip Links

```html
<a href="#main" class="skip-link">Skip to content</a>
<main id="main">…</main>
```

```css
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  background: white;
  padding: 0.5rem 1rem;
}
```

## Metadata

`<head>` contains document-level information.

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Page description for search engines">
<meta name="theme-color" content="#b45309">

<!-- Open Graph (Facebook, LinkedIn, Slack) -->
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://example.com/og.png">
<meta property="og:url" content="https://example.com/page">

<!-- Twitter card -->
<meta name="twitter:card" content="summary_large_image">

<!-- favicon -->
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/icon-192.png">

<!-- canonical URL -->
<link rel="canonical" href="https://example.com/page">

<!-- alternate languages -->
<link rel="alternate" hreflang="es" href="https://example.com/es/page">

<!-- preload critical assets -->
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preconnect" href="https://fonts.googleapis.com">
```

Open Graph and Twitter Card tags control how links preview in social media and messaging apps.

## Scripts and Styles

```html
<!-- classic script, blocks parsing -->
<script src="/app.js"></script>

<!-- defer: parse in parallel, execute after DOM is ready -->
<script src="/app.js" defer></script>

<!-- async: parse in parallel, execute as soon as available -->
<script src="/analytics.js" async></script>

<!-- inline -->
<script>
  console.log("inline");
</script>

<!-- module -->
<script type="module" src="/app.js"></script>
```

`defer` is almost always what you want — it runs in order after HTML parsing.

`type="module"` enables ES module imports, strict mode, and deferred execution by default.

## Modern HTML Features

| Feature | Purpose |
|---------|---------|
| `<dialog>` | Native modal |
| `<details>` | Collapsible content |
| `loading="lazy"` | Defer offscreen images/iframes |
| `decoding="async"` | Off-main-thread image decode |
| `srcset` / `sizes` | Responsive images |
| `<picture>` | Art direction, format switching |
| `fetchpriority` | Hint resource priority |
| `enterkeyhint` | Mobile keyboard "enter" label |
| `inputmode` | Optimize keyboard per input |
| `autocapitalize`, `autocomplete` | Better mobile input |
| `popover` | Native popovers (2023) |
| `inert` | Disable focus and interaction |
| `loading="lazy"` on iframes | Defer iframes |
| `blocking="render"` | Control first paint |

### Responsive Images

```html
<img
  src="/photo-800.jpg"
  srcset="/photo-400.jpg 400w,
          /photo-800.jpg 800w,
          /photo-1600.jpg 1600w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1200px) 50vw,
         400px"
  alt="Mountain landscape"
  loading="lazy"
  width="800"
  height="600">
```

The browser picks the best file based on the viewport and network.

## HTML vs XHTML vs HTML5

| | HTML4 | XHTML | HTML5 |
|--|-------|-------|-------|
| Syntax | SGML-based | XML-based | HTML5 parsing |
| Case | Case-insensitive | Case-sensitive | Case-insensitive |
| Void elements | `<br>` | `<br/>` | `<br>` (both work) |
| Error handling | Forgiving | Strict | Forgiving |
| Doctype | Complex | Verbose | `<!DOCTYPE html>` |
| Status | Obsolete | Obsolete | Current |

HTML5 is the current standard, maintained by the WHATWG as a **living standard** — it updates continuously instead of in numbered versions.

## Common Pitfalls

- **Using `<div>` for everything.** Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<button>`) improve accessibility and SEO for free.
- **Forgetting `alt` on images.** Required for accessibility. Empty `alt=""` for decorative images.
- **Missing `lang` on `<html>`.** Screen readers need it to pronounce content correctly.
- **Removing `<label>` elements.** Placeholder text is not a substitute — it disappears when typing.
- **Using `<br>` for spacing.** Use CSS margins instead.
- **Using tables for layout.** Tables are for tabular data. Use CSS Grid or Flexbox.
- **Inline styles everywhere.** They override stylesheets, are impossible to maintain, and prevent caching.
- **Not setting `width` and `height` on images.** Causes layout shift (CLS) as images load.
- **Loading all scripts synchronously.** Blocks rendering. Use `defer` or `async`.
- **Nesting interactive elements.** `<button>` inside `<a>` is invalid and breaks accessibility.
- **Ignoring `rel="noopener"` on `target="_blank"`.** Old browsers exposed `window.opener`; modern browsers default to safe, but explicit is better.
- **Using `contenteditable` for anything serious.** It's inconsistent across browsers and hard to manage.

## HTML Validation

Invalid HTML still renders (browsers are forgiving), but it can cause subtle bugs and accessibility failures. Validate at:

- validator.w3.org
- validator.nu

Common validation errors: unclosed elements, duplicate `id`, missing `alt`, invalid nesting.

## Where HTML Is Used

- **Every website** and web application.
- **Email** — HTML email with severely restricted CSS.
- **Mobile apps** — React Native, Capacitor, Cordova render HTML views.
- **Desktop apps** — Electron and Tauri apps are HTML.
- **Ebooks** — EPUB is XHTML.
- **Documentation** — most docs sites are HTML.
- **SVG** — embedded in HTML or used standalone.
- **Web Components** — custom elements use HTML templates.

## HTML vs Markdown

Markdown is a shorthand for HTML. Every Markdown document converts to HTML.

| | Markdown | HTML |
|--|----------|------|
| Purpose | Writing | Structure |
| Syntax | Minimal | Explicit |
| Expressiveness | Limited | Full |
| Use case | Docs, posts, README | Full control |

Markdown is better for prose. HTML is better for applications and precise control. Most blogs and docs sites use Markdown and convert to HTML at build time.

## Summary

HTML's value comes down to five things:

1. **Structure** — semantic elements describe content, not appearance.
2. **Accessibility** — screen readers, keyboards, and assistive tech rely on semantics.
3. **Portability** — every browser, every device, every era reads HTML.
4. **SEO** — search engines parse structure to understand content.
5. **Foundation** — CSS and JavaScript exist to style and enhance HTML.

HTML is deceptively simple — you can learn the basics in an afternoon. But mastering it means knowing which element to reach for, when semantic structure matters, and how the DOM interacts with CSS and JavaScript. Writing good HTML is the first step toward writing good web pages, and it's the step most developers skip.

## Further Reading

- MDN HTML reference: developer.mozilla.org/docs/Web/HTML
- WHATWG HTML spec: html.spec.whatwg.org
- *HTML and CSS: Design and Build Websites* by Jon Duckett
- *Inclusive Components* by Heydon Pickering: inclusive-components.design
- WebAIM: webaim.org
- The A11Y Project: a11yproject.com
- Web.dev HTML: web.dev/learn/html
- Can I Use: caniuse.com
