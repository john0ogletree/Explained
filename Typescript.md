# TypeScript: JavaScript with Types

TypeScript is a strongly typed programming language that builds on JavaScript by adding static type checking. Created by Microsoft in 2012 and now maintained as an open-source project, it has become the default choice for large-scale JavaScript applications and the foundation of most modern web frameworks.

## Why TypeScript Exists

JavaScript is dynamically typed. This means:

- Types are checked at runtime, not at compile time.
- A misspelled property name only fails when that line executes.
- Function signatures are informal — nothing stops you from passing a string where a number is expected.
- Refactoring is risky because the editor has no way to know what breaks.

TypeScript adds a **type system on top of JavaScript**. Every valid JavaScript file is valid TypeScript, but TypeScript lets you describe the shape of your data and catches mismatches before the code runs.

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}

greet("Ada");    // OK
greet(42);       // Compile error: number is not assignable to string
```

The second call fails at build time. In plain JavaScript, it would run silently and produce `"Hello, 42"`.

## How TypeScript Works

TypeScript is a **superset of JavaScript**. Its compiler (`tsc`) does two things:

1. **Type-checks** your code and reports errors.
2. **Strips types** and emits plain JavaScript that runs anywhere JavaScript runs.

```
.ts / .tsx files  ──►  tsc  ──►  .js files + .d.ts declarations
                       │
                       └─► type errors (exit code 1 if strict)
```

Types are erased at runtime. There is no performance cost, no runtime dependency, and no special environment needed.

## Basic Types

TypeScript includes the JavaScript primitives plus a few additions.

```ts
let name: string = "Ada";
let age: number = 36;
let active: boolean = true;
let nothing: null = null;
let missing: undefined = undefined;
let anything: any = "trust me";        // opt out of checking
let unknownValue: unknown = getInput(); // safer than any
let id: bigint = 123n;
let sym: symbol = Symbol("key");
```

### Arrays and Tuples

```ts
let scores: number[] = [90, 85, 77];
let names: Array<string> = ["Ada", "Alan"];

// tuple — fixed length, per-position types
let point: [number, number] = [10, 20];
let entry: [string, number] = ["age", 36];
```

### Objects

```ts
let user: { name: string; age: number } = {
  name: "Ada",
  age: 36
};
```

### Functions

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;

// optional and default parameters
function log(msg: string, level: "info" | "warn" = "info"): void {
  console.log(`[${level}] ${msg}`);
}

// rest params
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
```

## Interfaces and Type Aliases

Both describe the shape of an object. They differ in subtle ways.

### Interface

```ts
interface User {
  id: number;
  name: string;
  email?: string;        // optional
  readonly createdAt: Date; // cannot be reassigned
}

const user: User = {
  id: 1,
  name: "Ada",
  createdAt: new Date()
};
```

Interfaces can be **extended** and **merged** across declarations.

```ts
interface Admin extends User {
  permissions: string[];
}
```

### Type Alias

```ts
type Point = {
  x: number;
  y: number;
};

type ID = string | number;
```

Type aliases can describe **unions, tuples, primitives, and function signatures** — things interfaces cannot.

```ts
type Result = { ok: true; value: string } | { ok: false; error: Error };
type Mapper = (input: string) => number;
```

**Rule of thumb:** use `interface` for object shapes you might extend; use `type` for unions, intersections, and aliases of non-object types.

## Union and Intersection Types

### Union (`|`)

A value can be one of several types.

```ts
type Status = "idle" | "loading" | "success" | "error";

function handle(status: Status) {
  switch (status) {
    case "idle": return;
    case "loading": return;
    case "success": return;
    case "error": return;
  }
}
```

Union of literals is called a **discriminated union** when combined with a shared tag field — the pattern used to model state machines and API results.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }
  | { kind: "rect"; width: number; height: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.side ** 2;
    case "rect":   return s.width * s.height;
  }
}
```

### Intersection (`&`)

A value must satisfy **all** types.

```ts
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;

const p: Person = { name: "Ada", age: 36 };
```

## Generics

Generics let you write functions and types that work over many types without losing information.

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity(42);         // T = number
const s = identity("hello");    // T = string
```

### Generic Constraints

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");         // OK
longest([1, 2], [3]);           // OK
longest(1, 2);                  // Error: number has no length
```

### Generic Interfaces

```ts
interface Repository<T> {
  get(id: string): Promise<T>;
  list(): Promise<T[]>;
  save(item: T): Promise<void>;
}

class UserRepo implements Repository<User> {
  async get(id: string) { /* ... */ return {} as User; }
  async list() { return [] as User[]; }
  async save(_item: User) {}
}
```

## Type Narrowing

TypeScript tracks types through control flow, so you can narrow a union to a specific member.

```ts
function describe(x: string | number | null) {
  if (x === null) return "nothing";
  if (typeof x === "string") return x.toUpperCase();
  return x.toFixed(2);
}
```

Narrowing works with:

- `typeof` checks
- `instanceof` checks
- `in` operator for property presence
- Discriminated union `kind` fields
- User-defined type guards

```ts
function isUser(v: unknown): v is User {
  return typeof v === "object" && v !== null && "id" in v && "name" in v;
}

function handle(v: unknown) {
  if (isUser(v)) {
    console.log(v.name); // v is User
  }
}
```

## Utility Types

TypeScript ships with a set of generic utility types that transform existing types.

| Utility | Effect |
|---------|--------|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties readonly |
| `Pick<T, K>` | Subset of keys |
| `Omit<T, K>` | All keys except K |
| `Record<K, V>` | Object with keys K and values V |
| `Exclude<T, U>` | Remove U from T |
| `Extract<T, U>` | Keep only U from T |
| `NonNullable<T>` | Remove null and undefined |
| `ReturnType<F>` | Return type of a function |
| `Parameters<F>` | Parameter tuple of a function |
| `Awaited<T>` | Resolved type of a promise |

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserPreview = Pick<User, "id" | "name">;
type UserUpdate = Partial<Omit<User, "id">>;
type UserMap = Record<string, User>;

async function fetchUser(): Promise<User> { /* ... */ return {} as User; }
type Fetched = Awaited<ReturnType<typeof fetchUser>>; // User
```

## Enums

TypeScript has `enum`, but many teams prefer **union literals** because enums emit runtime code and behave unexpectedly at the boundaries.

```ts
// enum — emits a JS object
enum Color {
  Red,
  Green,
  Blue
}

// union literal — erased at compile time, no runtime cost
type Color = "red" | "green" | "blue";
```

For string-valued enums, `const enum` and union literals are usually better than plain `enum`.

## Type Inference

You don't have to annotate everything. TypeScript infers types from context.

```ts
let x = 42;           // number
let y = "hello";      // string
let z = [1, 2, 3];    // number[]

const user = { name: "Ada", age: 36 };
// { name: string; age: number }
```

Annotate **function parameters and public boundaries** (exports, API handlers, library signatures). Let inference handle locals.

## Strict Mode

The `strict` flag in `tsconfig.json` turns on a set of checks that catch the most common bugs.

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true
  }
}
```

Key checks enabled by `strict`:

| Flag | Effect |
|------|--------|
| `noImplicitAny` | Error on untyped params |
| `strictNullChecks` | `null` and `undefined` are distinct types |
| `strictFunctionTypes` | Correct variance on callbacks |
| `strictPropertyInitialization` | Class fields must be initialized |
| `strictBindCallApply` | Type-check `bind`/`call`/`apply` |
| `useUnknownInCatchVariables` | `catch (e)` is `unknown`, not `any` |

**Always start new projects with `strict: true`.** Turning it on later in an existing project is painful.

## Configuration

`tsconfig.json` controls the compiler. A typical modern setup:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src"]
}
```

| Option | Meaning |
|--------|---------|
| `target` | JS version to emit |
| `module` | Module system to emit |
| `lib` | Ambient type definitions (DOM, ES2022, …) |
| `jsx` | JSX transform mode |
| `noEmit` | Type-check only; let a bundler emit |
| `skipLibCheck` | Skip type-checking of `node_modules` `.d.ts` files |

## Declaration Files

When you install a library, TypeScript looks for a `.d.ts` file that describes its types. Most popular libraries ship their own; older ones use `@types/*` packages.

```ts
// example.d.ts
declare function greet(name: string): string;
declare const VERSION: string;
declare module "some-untyped-lib" {
  export function doThing(x: number): void;
}
```

You can write `.d.ts` files to describe third-party modules or global APIs that lack types.

## TypeScript in Practice

### With React

```tsx
import { useState, ChangeEvent } from "react";

type Props = {
  label: string;
  onSave: (value: string) => void;
};

export function Input({ label, onSave }: Props) {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <label>
      {label}
      <input value={value} onChange={handleChange} />
      <button onClick={() => onSave(value)}>Save</button>
    </label>
  );
}
```

### With Node

```ts
import { readFile } from "node:fs/promises";

async function loadConfig(path: string): Promise<{ port: number }> {
  const raw = await readFile(path, "utf8");
  return JSON.parse(raw);
}
```

Install `@types/node` for Node APIs and `tsx` or `ts-node` to run `.ts` files directly.

### With a Bundler

Vite, Next.js, esbuild, webpack, and Rollup all support TypeScript natively. They transpile by stripping types and rely on `tsc --noEmit` in CI for full type checking. This is faster than running `tsc` as the emitter.

## Common Pitfalls

- **Using `any` to silence errors.** It disables checking from that point forward. Prefer `unknown` plus narrowing, or fix the underlying type.
- **Turning off `strictNullChecks`.** Half of TypeScript's value comes from honest `null` and `undefined` handling.
- **Annotating everything.** Redundant annotations clutter code. Annotate boundaries; let locals infer.
- **Fighting the compiler with `as`.** Type assertions bypass the checker. Use them only when you know more than the compiler, and add a comment explaining why.
- **Not using discriminated unions.** Modeling state with `{ loading: boolean; data?: T; error?: Error }` allows impossible states. Use a tagged union instead.
- **Enums at the API boundary.** They serialize as numbers by default. Prefer string union types for anything that crosses a wire.
- **Ignoring `exactOptionalPropertyTypes`.** It catches `{ foo?: string }` being assigned `{ foo: undefined }`, which breaks code that checks `"foo" in obj`.

## Comparison: TypeScript vs JSDoc

You can get type checking in plain `.js` files using JSDoc annotations and `// @ts-check`.

```js
// @ts-check

/** @param {string} name */
function greet(name) {
  return `Hello, ${name}`;
}
```

| | TypeScript | JSDoc |
|--|-----------|-------|
| Syntax | Dedicated `.ts` files | Comments in `.js` |
| Expressiveness | Full (generics, unions, mapped types) | Limited |
| Tooling | First-class | Partial |
| Migration cost | Rename files, add types | None |
| Best for | New projects | Legacy JS, tiny scripts |

JSDoc is a good stepping stone, but real TypeScript is strictly more capable once a project grows.

## When to Use TypeScript

**Good fit:**
- Any project larger than a few files.
- Any project with more than one contributor.
- Any project that will be maintained for more than a few months.
- Any project with a public API, library, or SDK.
- React, Angular, Vue, Node, Deno, and Bun — all support it natively.

**Poor fit:**
- Throwaway scripts under 50 lines.
- Learning JavaScript for the first time — the type system adds conceptual overhead.
- Environments with no build step and no willingness to add one (though `tsc` alone is enough).

## Summary

TypeScript's value comes down to four things:

1. **Early error detection** — most type mismatches are caught before tests run, let alone before deployment.
2. **Editor intelligence** — autocomplete, inline docs, and safe rename/refactor across the whole codebase.
3. **Self-documenting code** — function signatures and interface definitions describe intent better than comments.
4. **Safe evolution** — changing a type propagates errors through every consumer, so refactors are mechanical instead of terrifying.

It costs a small amount of extra syntax and a one-time setup. In exchange, it eliminates an entire category of runtime bugs and makes large codebases tractable. For most teams today, the question is not *whether* to use TypeScript, but *how strictly*.

## Further Reading

- Official handbook: typescriptlang.org/docs/handbook
- TypeScript playground: typescriptlang.org/play
- *Effective TypeScript* by Dan Vanderkam
- *Programming TypeScript* by Boris Cherny
- Type Challenges (practice): github.com/type-challenges/type-challenges
- Total TypeScript (Matt Pocock): totaltypescript.com
