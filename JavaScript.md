# JavaScript: The Language of the Web

JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. Created by Brendan Eich at Netscape in 1995 in just 10 days, it has grown from a simple scripting language for web pages into the most widely deployed programming language in history — running in every browser, on servers via Node.js, on mobile via React Native, and on desktop via Electron.

## Why JavaScript Exists

In 1995, the web was static. Netscape wanted a lightweight scripting language that could make pages interactive without requiring a full compile step or a Java applet. Brendan Eich was hired to build it, and the first version shipped in Netscape Navigator 2.0 in September 1995.

The language was standardized as **ECMAScript** in 1997 (ECMA-262), which is why the specification is called ECMAScript while the language is called JavaScript. The two names are used almost interchangeably today.

Its core design goals:

- **Embeddable** — runs inside a host environment (browser, server, runtime).
- **Dynamic** — no compilation step, no type declarations required.
- **Prototype-based** — objects inherit directly from other objects.
- **Event-driven** — built around responding to user actions and I/O.

## The Three Pillars of the Web

| Technology | Role |
|------------|------|
| HTML | Structure and content |
| CSS | Presentation and layout |
| JavaScript | Behavior and interactivity |

JavaScript is the only programming language that browsers understand natively. That single fact explains most of its dominance.

## Installation and Tooling

JavaScript needs no installation to run in a browser. For servers and tooling, install **Node.js**, which bundles the **V8** engine and **npm**.

```bash
node --version
npm --version
node script.js
```

| Tool | Purpose |
|------|---------|
| Node.js | Server-side runtime |
| npm / pnpm / yarn / bun | Package managers |
| V8 / SpiderMonkey / JavaScriptCore | Engines |
| Babel | Transpiler for modern syntax |
| TypeScript | Typed superset |
| ESLint | Linter |
| Prettier | Formatter |
| Vite / webpack / esbuild | Bundlers |
| Vitest / Jest / Playwright | Testing |
| Deno / Bun | Alternative runtimes |

## Hello, World

```html
<!DOCTYPE html>
<html>
<body>
  <script>
    console.log("Hello, world");
  </script>
</body>
</html>
```

Or with Node.js:

```bash
echo 'console.log("Hello, world")' > hello.js
node hello.js
```

## Core Language

### Variables

Three declarations, each with different scoping.

```js
var x = 1;      // function-scoped, hoisted, avoid in modern code
let y = 2;      // block-scoped, reassignable
const z = 3;    // block-scoped, cannot be reassigned
```

`const` prevents rebinding, not mutation — objects and arrays declared with `const` can still be modified.

```js
const user = { name: "Ada" };
user.name = "Grace";       // OK
// user = {};              // TypeError
```

### Types

JavaScript has seven primitive types plus objects.

```js
typeof "text"        // "string"
typeof 42            // "number"
typeof 42n           // "bigint"
typeof true          // "boolean"
typeof undefined     // "undefined"
typeof null          // "object"  ← historical bug
typeof Symbol()      // "symbol"
typeof {}            // "object"
typeof []            // "object"  ← arrays are objects
typeof function(){}  // "function"
```

Numbers are always IEEE 754 doubles — there is no separate integer type (except `BigInt`).

```js
0.1 + 0.2            // 0.30000000000000004
Number.MAX_SAFE_INTEGER  // 9007199254740991
```

### Strings

Strings are immutable UTF-16 sequences.

```js
const name = "Ada";
const greeting = `Hello, ${name}!`;    // template literal

name.length                    // 3
name.toUpperCase()             // "ADA"
name.includes("d")             // true
name.slice(0, 2)               // "Ad"
name.split("")                 // ["A", "d", "a"]

// multi-line
const block = `
  line one
  line two
`;

// tagged templates
function tag(strings, ...values) {
  return strings.raw.join("|");
}
```

Template literals (backticks) support interpolation and multi-line strings — they're the default choice for anything beyond trivial string building.

### Objects

Objects are collections of key-value pairs. Keys are strings or symbols.

```js
const user = {
  name: "Ada",
  age: 36,
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

user.name               // "Ada"
user["age"]             // 36
user.email = "ada@x.com";

delete user.age;
"name" in user          // true

Object.keys(user)       // ["name", "greet", "email"]
Object.values(user)
Object.entries(user)
```

Shorthand and computed properties:

```js
const name = "Ada";
const key = "age";

const user = { name, [key]: 36 };
```

Spread and rest:

```js
const base = { a: 1, b: 2 };
const extended = { ...base, c: 3 };

const { a, ...rest } = extended;   // a=1, rest={b,c}
```

### Arrays

```js
const nums = [1, 2, 3, 4, 5];

nums.push(6);              // append
nums.pop();                // remove last
nums.shift();              // remove first
nums.unshift(0);           // prepend

nums.length                // 5
nums[1]                    // 2
nums.includes(3)           // true
nums.indexOf(4)            // 3
nums.slice(1, 3)           // [2, 3] (does not mutate)
nums.splice(1, 2)          // removes and returns [2, 3] (mutates)

// iteration
nums.forEach(n => console.log(n));
const doubled = nums.map(n => n * 2);
const evens = nums.filter(n => n % 2 === 0);
const sum = nums.reduce((acc, n) => acc + n, 0);
const found = nums.find(n => n > 3);
const allPositive = nums.every(n => n > 0);

// sorting (in place, returns the array)
nums.sort((a, b) => b - a);

// copying
const copy = [...nums];
const shallow = nums.slice();
```

### Functions

Functions are first-class values.

```js
function add(a, b) {
  return a + b;
}

const add = (a, b) => a + b;        // arrow function

const double = x => x * 2;          // single param, no parens needed

const log = () => {
  console.log("called");
};
```

Arrow functions differ from regular functions in two important ways:

1. They have no `this` binding — they inherit `this` from the enclosing scope.
2. They cannot be used as constructors.

### Destructuring

```js
const user = { name: "Ada", age: 36, email: "ada@x.com" };

const { name, age } = user;
const { name: fullName } = user;    // rename
const { phone = "none" } = user;    // default

const [first, second, ...rest] = [1, 2, 3, 4];

// nested
const { address: { city } } = user;

// in parameters
function greet({ name, age }) {
  return `${name} is ${age}`;
}
```

### Classes

JavaScript classes are syntactic sugar over prototype-based inheritance.

```js
class User {
  static species = "human";      // static field

  #secret = "internal";          // private field (ES2022)

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hi, I'm ${this.name}`;
  }

  get birthYear() {
    return new Date().getFullYear() - this.age;
  }

  static create(name, age) {
    return new User(name, age);
  }
}

class Admin extends User {
  constructor(name, age, level) {
    super(name, age);
    this.level = level;
  }

  greet() {
    return super.greet() + ` (admin level ${this.level})`;
  }
}
```

### Prototypes

Under the hood, inheritance is prototype-based.

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const d = new Dog("Rex");
d.speak();        // "Rex barks"
```

Modern code uses `class` and `Object.create()`, but understanding prototypes is essential for debugging `this` and reading older code.

### `this`

`this` is the most confusing part of JavaScript. Its value depends on how a function is called.

```js
const obj = {
  name: "Ada",
  regular() {
    return this.name;         // "Ada"
  },
  arrow: () => this.name,     // depends on outer scope
};

obj.regular();                // "Ada"
const fn = obj.regular;
fn();                         // undefined (or global in non-strict mode)
fn.call(obj);                 // "Ada"
fn.apply(obj, []);            // "Ada"
const bound = fn.bind(obj);
bound();                      // "Ada"
```

**Rule:** arrow functions inherit `this`; regular functions get `this` from the call site.

### Equality

```js
1 == "1"      // true  (loose, coerces types)
1 === "1"     // false (strict, no coercion)

null == undefined     // true
null === undefined    // false

NaN === NaN           // false
Object.is(NaN, NaN)   // true

Object.is(-0, 0)      // false
```

**Always use `===`.** Loose equality has too many edge cases.

### Truthiness

These values are falsy:

```js
false
0
-0
0n
""
null
undefined
NaN
```

Everything else is truthy — including `"0"`, `[]`, `{}`, and `"false"`.

## Asynchronous JavaScript

JavaScript is single-threaded, but handles concurrency via the **event loop**.

### Callbacks

```js
setTimeout(() => {
  console.log("after 1 second");
}, 1000);

fetch("/api/data", (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});
```

### Promises

A `Promise` represents a value that will exist in the future.

```js
const p = fetch("/api/data");

p.then(res => res.json())
 .then(data => console.log(data))
 .catch(err => console.error(err))
 .finally(() => console.log("done"));

// creating promises
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
```

### Async/Await

`async`/`await` lets you write asynchronous code that reads synchronously.

```js
async function load() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}

load().then(console.log);
```

An `async` function always returns a promise. `await` pauses the function until the promise settles.

### Parallel Execution

```js
// sequential — slow
const a = await fetchA();
const b = await fetchB();

// parallel — fast
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// wait for all, even if some fail
const results = await Promise.allSettled([fetchA(), fetchB()]);

// first to resolve
const first = await Promise.race([fetchA(), fetchB()]);

// first to fulfill (ignores rejections)
const any = await Promise.any([fetchA(), fetchB()]);
```

### The Event Loop

JavaScript has one call stack, a task queue (macrotasks), and a microtask queue (promises).

```
call stack → empty → microtasks drain → macrotask → microtasks drain → ...
```

`setTimeout`, `setInterval`, and I/O go to the macrotask queue. Promise callbacks go to the microtask queue, which runs first. This is why `Promise.resolve().then(fn)` runs before `setTimeout(fn, 0)`.

## Modules

### ES Modules (modern, standard)

```js
// math.js
export const add = (a, b) => a + b;
export function multiply(a, b) { return a * b; }
export default function divide(a, b) { return a / b; }

// main.js
import divide, { add, multiply } from "./math.js";
import * as math from "./math.js";
```

ES Modules work natively in browsers with `<script type="module">` and in Node.js with `"type": "module"` in `package.json`.

### CommonJS (legacy, Node)

```js
// math.js
module.exports = {
  add: (a, b) => a + b,
};

// main.js
const { add } = require("./math");
```

ES Modules are the modern standard. CommonJS still works in Node and appears throughout older packages.

## The DOM

In browsers, JavaScript interacts with the page through the Document Object Model.

```js
// selecting elements
const el = document.querySelector("#app");
const items = document.querySelectorAll(".item");

// reading and writing
el.textContent = "new text";
el.innerHTML = "<strong>bold</strong>";
el.classList.add("active");
el.classList.toggle("hidden");
el.setAttribute("data-id", "42");

// events
el.addEventListener("click", (event) => {
  event.preventDefault();
  console.log("clicked");
});

// creating elements
const div = document.createElement("div");
div.textContent = "hello";
el.appendChild(div);

// traversing
el.parentElement;
el.children;
el.firstElementChild;
el.nextElementSibling;
```

Modern frameworks (React, Vue, Svelte) abstract most of this, but knowing the DOM is essential for debugging and for lightweight projects.

## Web APIs

Browsers expose hundreds of built-in APIs.

| API | Purpose |
|-----|---------|
| `fetch` | HTTP requests |
| `localStorage` / `sessionStorage` | Key-value persistence |
| `IndexedDB` | Structured client-side storage |
| `Canvas` / `WebGL` | Graphics |
| `WebSocket` | Real-time bidirectional communication |
| `Geolocation` | Location data |
| `Notification` | System notifications |
| `Service Worker` | Offline capability, background sync |
| `Web Crypto` | Cryptographic operations |
| `Web Worker` | Background threads |
| `WebRTC` | Peer-to-peer audio/video/data |

## Node.js

Node.js runs JavaScript outside the browser using V8.

```js
const fs = require("node:fs/promises");
const http = require("node:http");

async function main() {
  const data = await fs.readFile("input.txt", "utf8");
  console.log(data);
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node");
});

server.listen(3000);
```

Node's strengths:

- Non-blocking I/O — handles thousands of concurrent connections.
- Same language as the browser — one language for the whole stack.
- Huge ecosystem — npm is the largest package registry in the world.
- Fast startup — ideal for serverless and CLI tools.

## Popular Frameworks and Libraries

| Category | Options |
|----------|---------|
| UI frameworks | React, Vue, Svelte, Solid, Angular |
| Meta-frameworks | Next.js, Nuxt, SvelteKit, Remix |
| Server | Express, Fastify, Koa, Hono, NestJS |
| State | Redux, Zustand, Jotai, Pinia |
| Data fetching | TanStack Query, SWR |
| Testing | Vitest, Jest, Playwright, Cypress |
| Build | Vite, esbuild, webpack, Rollup, Turbopack |
| Mobile | React Native, Capacitor |
| Desktop | Electron, Tauri |
| CLI | Commander, yargs, oclif |

## Testing

```js
// math.js
export const add = (a, b) => a + b;

// math.test.js
import { describe, it, expect } from "vitest";
import { add } from "./math.js";

describe("add", () => {
  it("adds positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("handles negatives", () => {
    expect(add(-1, -2)).toBe(-3);
  });
});
```

```bash
npx vitest
npx playwright test
```

## Common Pitfalls

- **Loose equality (`==`).** Always use `===` except when checking `x == null` (which matches both `null` and `undefined`).
- **Floating-point arithmetic.** `0.1 + 0.2 !== 0.3`. Use a decimal library for money.
- **`this` in callbacks.** Passing a method as a callback loses its `this`. Use arrow functions or `.bind()`.
- **Mutating shared state.** Objects and arrays are reference types. `const a = b` doesn't copy; it aliases.
- **`var` hoisting.** `var` declarations move to the top of the function. Use `let` and `const`.
- **Forgetting `await`.** An unawaited promise runs silently and its rejection becomes an unhandled rejection.
- **`NaN` comparisons.** `NaN === NaN` is `false`. Use `Number.isNaN()` or `Object.is()`.
- **`parseInt` without radix.** `parseInt("08")` used to return 0 in old engines. Always pass `10` as the second argument.
- **Callback hell.** Deeply nested callbacks are unreadable. Use `async`/`await`.
- **Implicit globals.** Assigning to an undeclared variable creates a global. Use `"use strict"` or modules.

## Modern JavaScript (ES2015+)

Key additions since ES6 (2015):

| Version | Feature |
|---------|---------|
| ES2015 | `let`/`const`, arrow functions, classes, modules, promises, template literals, destructuring, spread/rest, default params, `Map`/`Set`, `Symbol` |
| ES2016 | `Array.prototype.includes`, exponentiation `**` |
| ES2017 | `async`/`await`, `Object.entries`/`values`, string padding |
| ES2018 | Rest/spread in objects, `Promise.finally`, async iteration |
| ES2019 | `Object.fromEntries`, `Array.flat`, optional catch binding |
| ES2020 | Optional chaining `?.`, nullish coalescing `??`, `BigInt`, `Promise.allSettled` |
| ES2021 | `replaceAll`, logical assignment `??=`, `Promise.any` |
| ES2022 | Top-level `await`, class fields, private `#fields`, `.at()` |
| ES2023 | `Array.findLast`, `Array.toSorted`, `Array.toReversed` |
| ES2024 | `Object.groupBy`, `Map.groupBy`, `Promise.withResolvers` |

Modern syntax is universally supported in Node 18+ and all evergreen browsers.

## Where JavaScript Is Used

- **Web frontends** — every website with interactivity.
- **Web backends** — Node.js APIs, serverless functions, real-time services.
- **Mobile apps** — React Native, Ionic, Capacitor.
- **Desktop apps** — Electron (VS Code, Slack, Discord), Tauri.
- **CLI tools** — every modern frontend tool.
- **Bots and automation** — Discord bots, browser automation, scrapers.
- **Games** — Phaser, Three.js, Babylon.js.
- **Embedded** — Espruino, Johnny-Five.

It is, by almost every measure, the most widely deployed programming language in the world.

## When to Use JavaScript

**Good fit:**
- Anything running in a browser.
- Full-stack web applications (one language for client and server).
- Real-time applications — chat, collaboration, streaming.
- Rapid prototyping and MVPs.
- Cross-platform apps via React Native or Electron.
- Serverless functions where fast startup and small packages matter.

**Poor fit:**
- CPU-intensive computation (use Rust, C++, Go, or WebAssembly).
- Data science and ML (use Python).
- Systems programming (use Rust, C, Zig).
- Anything where type safety is non-negotiable — use TypeScript instead, which is JavaScript with types.

## JavaScript vs TypeScript

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. Most new projects — especially large ones — use TypeScript. JavaScript remains the runtime target, the language browsers execute, and the lingua franca of the web platform.

For new projects:
- **Small scripts, quick experiments** → JavaScript is fine.
- **Anything that will be maintained** → TypeScript.

## Summary

JavaScript's value comes down to five things:

1. **Ubiquity** — it runs everywhere a browser runs, which is everywhere.
2. **Zero-install** — any browser is a JavaScript runtime.
3. **Ecosystem** — npm hosts over 2 million packages, the largest in the world.
4. **Full stack** — one language for client, server, mobile, and desktop.
5. **Evolution** — a yearly ECMAScript release cadence has modernized the language continuously since 2015.

JavaScript has plenty of rough edges — `this`, `==`, floating-point numbers, the historical `null`/`undefined` split. But it is also the most accessible language ever created: open a browser, open DevTools, and you're programming. That accessibility, combined with a two-decade head start and a vast ecosystem, is why JavaScript is still the language of the web.

## Further Reading

- MDN Web Docs: developer.mozilla.org
- The Modern JavaScript Tutorial: javascript.info
- Eloquent JavaScript: eloquentjavascript.net (free)
- *You Don't Know JS* by Kyle Simpson (free on GitHub)
- *JavaScript: The Good Parts* by Douglas Crockford
- ECMAScript specification: tc39.es/ecma262
- Node.js docs: nodejs.org/docs
- Can I Use: caniuse.com
