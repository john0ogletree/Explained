# Rust: Systems Programming Without the Footguns

Rust is a general-purpose systems programming language designed for safety, speed, and concurrency. Created at Mozilla in 2010 and now stewarded by the Rust Foundation, it has won Stack Overflow's "most loved language" award every year since 2016. Rust achieves memory safety without a garbage collector through a compile-time ownership system — a novel approach that eliminates entire classes of bugs before the program ever runs.

## Why Rust Exists

Traditional systems languages force a choice:

- **C and C++** give you full control and speed, but manual memory management leads to use-after-free bugs, buffer overflows, and data races. Roughly 70% of serious security vulnerabilities in large C/C++ codebases are memory-safety issues.
- **Java, Go, C#, Python** give you memory safety via garbage collection, but the GC introduces pauses, unpredictable latency, and runtime overhead.

Rust takes a third path: **memory safety enforced at compile time, with zero runtime cost**. The compiler proves that your program cannot have dangling pointers, double frees, or data races. If it can't prove it, it refuses to compile.

```rust
fn main() {
    let s = String::from("hello");
    let r = &s;              // borrow
    println!("{}", r);       // OK
}                            // s dropped here, r never outlived it
```

No `free`, no `delete`, no GC. The compiler inserts the cleanup automatically at the right scope.

## Installation and Tooling

Rust ships with `rustup`, a toolchain manager that installs the compiler and its companion tools.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

| Tool | Purpose |
|------|---------|
| `rustc` | The compiler |
| `cargo` | Build system and package manager |
| `rustfmt` | Code formatter |
| `clippy` | Linter with hundreds of correctness and style checks |
| `rust-analyzer` | Language server for editors |
| `rustup` | Toolchain manager |

```bash
cargo new hello
cd hello
cargo run
cargo test
cargo build --release
cargo clippy
cargo fmt
```

`Cargo.toml` declares dependencies, and `cargo` fetches them from crates.io, the official registry.

```toml
[package]
name = "hello"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
```

## Core Concepts

### Variables and Mutability

Variables are immutable by default. You opt into mutation with `mut`.

```rust
let x = 5;              // immutable
let mut y = 10;         // mutable
y += 1;
```

Shadowing lets you rebind a name with a new type, which is useful for transformations.

```rust
let spaces = "   ";         // &str
let spaces = spaces.len();  // usize
```

### Ownership

Every value in Rust has exactly one **owner**. When the owner goes out of scope, the value is dropped.

```rust
fn main() {
    let s1 = String::from("hello");   // s1 owns the string
    let s2 = s1;                       // ownership moved to s2
    // println!("{}", s1);             // error: s1 was moved
    println!("{}", s2);                // OK
}
```

Move semantics prevent double-free bugs. For types that are cheap to copy (integers, booleans, `char`, tuples of those), Rust uses `Copy` instead of move.

### Borrowing

Instead of moving ownership, you can **borrow** a reference. Borrows come in two flavors.

```rust
let s = String::from("hello");

let r1 = &s;     // immutable borrow — read-only
let r2 = &s;     // another immutable borrow — fine
println!("{} {}", r1, r2);

let r3 = &mut s; // mutable borrow — exclusive
r3.push_str(" world");
```

The **borrow checker** enforces one rule: at any moment, you can have **either** any number of immutable borrows **or** exactly one mutable borrow — never both. This is what eliminates data races at compile time.

```rust
let mut s = String::from("hello");
let r1 = &s;
let r2 = &mut s;   // error: cannot borrow `s` as mutable
                   // because it is also borrowed as immutable
println!("{}", r1);
```

Borrows must also not outlive the value they point to — no dangling references.

### Lifetimes

Lifetimes are the compiler's way of tracking how long references are valid. Most of the time they're inferred, but sometimes you need to annotate them.

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

`'a` says: the returned reference lives at least as long as the shorter of the two inputs. The compiler uses this to guarantee the caller never holds a reference to freed memory.

Lifetime annotations don't change how long anything lives — they describe relationships the compiler already needs to verify.

### Structs

```rust
struct User {
    name: String,
    age: u32,
    active: bool,
}

impl User {
    fn new(name: &str, age: u32) -> Self {
        Self { name: name.to_string(), age, active: true }
    }

    fn deactivate(&mut self) {
        self.active = false;
    }
}

let mut u = User::new("Ada", 36);
u.deactivate();
```

### Enums and Pattern Matching

Rust enums are **algebraic data types** — each variant can carry different data.

```rust
enum Shape {
    Circle { radius: f64 },
    Square { side: f64 },
    Rectangle { width: f64, height: f64 },
}

fn area(s: &Shape) -> f64 {
    match s {
        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
        Shape::Square { side } => side * side,
        Shape::Rectangle { width, height } => width * height,
    }
}
```

`match` is exhaustive — the compiler forces you to handle every variant. This is the same idea as TypeScript's discriminated unions, but enforced by the language itself.

### `Option` and `Result`

Rust has **no `null`**. Instead, the standard library provides two enums for the two most common "something might be absent / might fail" cases.

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

```rust
fn find_user(id: u32) -> Option<User> {
    // ...
    if id == 1 { Some(User::new("Ada", 36)) } else { None }
}

fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    s.parse::<u32>()
}
```

The `?` operator propagates errors concisely.

```rust
fn read_age(path: &str) -> Result<u32, Box<dyn std::error::Error>> {
    let text = std::fs::read_to_string(path)?;
    let age = text.trim().parse::<u32>()?;
    Ok(age)
}
```

There is no way to accidentally dereference `None` or forget to handle `Err`. The type system forces the decision.

### Traits

Traits are Rust's version of interfaces — shared behavior across types.

```rust
trait Summary {
    fn summarize(&self) -> String;

    fn preview(&self) -> String {
        format!("{}…", &self.summarize()[..50.min(self.summarize().len())])
    }
}

struct Article { title: String, body: String }

impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{}: {}", self.title, self.body)
    }
}
```

Traits can be used as bounds on generics, as `dyn` trait objects for dynamic dispatch, and can have default methods, associated types, and associated constants.

### Generics

```rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest { largest = item; }
    }
    largest
}
```

Generics in Rust are **monomorphized** — specialized at compile time for each concrete type — so they have zero runtime cost, unlike Java's type erasure.

## Concurrency

Rust's ownership rules make data races a **compile-time error**. The compiler enforces that shared mutable state is protected.

### Threads

```rust
use std::thread;

let handles: Vec<_> = (0..4).map(|i| {
    thread::spawn(move || {
        println!("thread {}", i);
    })
}).collect();

for h in handles { h.join().unwrap(); }
```

### Shared State

`Arc<Mutex<T>>` is the standard pattern for shared mutable state across threads.

```rust
use std::sync::{Arc, Mutex};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let mut handles = vec![];

for _ in 0..10 {
    let c = Arc::clone(&counter);
    handles.push(thread::spawn(move || {
        let mut n = c.lock().unwrap();
        *n += 1;
    }));
}

for h in handles { h.join().unwrap(); }
println!("{}", *counter.lock().unwrap()); // 10
```

### Send and Sync

Two marker traits drive Rust's concurrency guarantees:

- **`Send`** — a type can be transferred across threads.
- **`Sync`** — a type can be referenced from multiple threads safely.

The compiler requires `Send`/`Sync` bounds on anything that crosses a thread boundary. Types that aren't thread-safe (like `Rc` or `RefCell`) simply fail to compile if you try.

### Async / Await

Rust has first-class `async`/`await`, but no built-in runtime — you choose one. **Tokio** is the most popular.

```rust
#[tokio::main]
async fn main() {
    let a = fetch("https://example.com/a");
    let b = fetch("https://example.com/b");
    let (a, b) = tokio::join!(a, b);
    println!("{} {}", a, b);
}

async fn fetch(url: &str) -> String {
    reqwest::get(url).await.unwrap().text().await.unwrap()
}
```

Async is zero-cost: futures are state machines compiled into the binary, no green threads, no runtime overhead per task.

## Error Handling

Rust distinguishes between **recoverable** errors (`Result<T, E>`) and **unrecoverable** errors (`panic!`).

```rust
// Recoverable
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 { Err("division by zero".into()) }
    else { Ok(a / b) }
}

// Unrecoverable
panic!("something is deeply wrong");
```

For application code, `anyhow` provides an ergonomic error type. For libraries, `thiserror` generates precise error enums.

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum MyError {
    #[error("io error: {0}")]
    Io(#[from] std::io::Error),
    #[error("parse error: {0}")]
    Parse(#[from] std::num::ParseIntError),
}
```

## Modules and Crates

Rust's module system organizes code within a crate and across crates.

```
src/
├── main.rs         ← binary crate root
├── lib.rs          ← library crate root
├── models/
│   ├── mod.rs      ← declares submodules
│   └── user.rs
└── utils.rs
```

```rust
// src/lib.rs
pub mod models;
mod utils;

pub fn run() { /* ... */ }
```

```rust
// src/models/mod.rs
pub mod user;
```

```rust
// src/models/user.rs
pub struct User {
    pub name: String,
}
```

- `pub` makes items visible outside their module.
- `crate::` refers to the current crate root.
- `super::` and `self::` navigate the module tree.
- External crates are added via `Cargo.toml` and imported with `use`.

## Pattern Matching

`match` is exhaustive and can destructure any type.

```rust
let pair = (0, -2);

match pair {
    (0, y) => println!("first is zero, y = {}", y),
    (x, 0) => println!("second is zero, x = {}", x),
    _ => println!("neither is zero"),
}
```

`if let` and `while let` are shorter forms for single-pattern matches.

```rust
if let Some(user) = find_user(1) {
    println!("{}", user.name);
}

let mut stack = vec![1, 2, 3];
while let Some(top) = stack.pop() {
    println!("{}", top);
}
```

## Common Standard Library Types

| Type | Purpose |
|------|---------|
| `String` / `&str` | Owned / borrowed UTF-8 strings |
| `Vec<T>` | Growable array |
| `HashMap<K, V>` | Hash map |
| `BTreeMap<K, V>` | Ordered map |
| `HashSet<T>` | Hash set |
| `Option<T>` | Optional value |
| `Result<T, E>` | Success or error |
| `Box<T>` | Heap allocation |
| `Rc<T>` / `Arc<T>` | Shared ownership (single / multi-thread) |
| `RefCell<T>` / `Mutex<T>` | Interior mutability (single / multi-thread) |
| `Cow<'a, T>` | Clone-on-write |
| `Iterator` | Lazy sequence of values |

## Iterators and Closures

Iterators are lazy and chainable, and they compile down to hand-written loops.

```rust
let nums = vec![1, 2, 3, 4, 5];

let doubled: Vec<i32> = nums.iter()
    .filter(|&&n| n % 2 == 0)
    .map(|&n| n * 2)
    .collect();

let sum: i32 = nums.iter().sum();
let max = nums.iter().max();
```

Closures capture by reference by default, by `move` when needed.

```rust
let add = |a, b| a + b;
let owned = move || nums.len(); // captures nums by value
```

## Cargo Workspaces

For multi-crate projects, workspaces share a lockfile and build cache.

```toml
# Cargo.toml (workspace root)
[workspace]
members = ["core", "server", "client"]
```

```bash
cargo build --workspace
cargo test -p core
```

This is how large Rust projects (like `rust-analyzer` or `tokio`) organize dozens of crates without duplicating dependencies.

## Testing

Tests live in the same file or in a `tests/` directory.

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn add_works() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    #[should_panic]
    fn divide_by_zero_panics() {
        divide(1.0, 0.0).unwrap();
    }
}
```

```bash
cargo test
cargo test -- --nocapture   # show stdout
cargo test some_filter      # run matching tests only
```

## Common Pitfalls

- **Fighting the borrow checker.** The fix is usually to restructure ownership, not to add `clone()`. If you're cloning everything, you're modeling the data wrong.
- **Using `unwrap()` in library code.** It panics on `None`/`Err`. Use `?` or explicit match in anything that isn't a test or prototype.
- **`Rc<RefCell<T>>` everywhere.** Interior mutability has runtime cost and can cause panics on double borrow. Prefer ownership restructuring.
- **Premature `unsafe`.** `unsafe` blocks disable the safety guarantees. Use them only when you can articulate the invariants and prove they hold.
- **Over-annotating lifetimes.** Most code needs zero explicit lifetime annotations. Add them only when the compiler asks.
- **Ignoring Clippy.** Clippy catches real bugs and idiom mismatches. Run it in CI.
- **Choosing async when sync would do.** Async adds complexity (runtime choice, `Send` bounds, pinning). Use it for I/O concurrency, not CPU parallelism.

## Where Rust Is Used

- **Operating systems** — Linux kernel modules, Redox OS, Windows kernel components.
- **Web services** — Cloudflare, Discord, Dropbox, AWS (Firecracker), Vercel (Turbopack).
- **WebAssembly** — `wasm-pack`, `wasm-bindgen`, `yew`, `leptos`.
- **CLI tools** — `ripgrep`, `fd`, `bat`, `starship`, `hyperfine`, `zoxide`.
- **Blockchain** — Solana, Polkadot, NEAR, many smart contract platforms.
- **Embedded** — `embedded-hal`, `embassy`, `RTIC` for microcontrollers.
- **Game engines** — `bevy`, `godot-rust` bindings.
- **Databases** — `sled`, `tikv`, `databend`, `noria`.

## When to Use Rust

**Good fit:**
- Anything that must be fast **and** safe: parsers, proxies, databases, crypto, network services.
- CLI tools where startup time matters.
- WebAssembly modules.
- Systems that run for months without restarting and can't afford a memory bug.
- Embedded and real-time environments without a GC.

**Poor fit:**
- Small scripts where Python or Bash would do.
- Rapid prototyping where iteration speed beats performance.
- GUIs where the ecosystem is still immature compared to web or mobile.
- Teams with no systems programming experience on a tight deadline — the learning curve is real.

## Learning Curve

Rust's reputation for being hard is accurate but often misunderstood. The difficulty isn't syntax — it's the **borrow checker**, which forces you to think carefully about ownership from day one. That's also why Rust programs tend to have fewer bugs: the thinking you'd otherwise do at 3am debugging a segfault is done at compile time instead.

Expect:

- **Week 1** — fighting the borrow checker, cloning too much, hating the compiler.
- **Month 1** — understanding ownership, building small CLIs and services.
- **Month 3** — writing idiomatic code, reaching for the right patterns.
- **Year 1** — the borrow checker becomes an ally, not an obstacle.

## Summary

Rust's value proposition is singular: **memory safety and thread safety without a garbage collector, verified at compile time.**

1. **Ownership and borrowing** eliminate use-after-free, double-free, and data races at compile time.
2. **`Option` and `Result`** eliminate null pointer exceptions and unchecked error propagation.
3. **Zero-cost abstractions** mean generics, iterators, and async compile to the same machine code you'd write by hand.
4. **Cargo** gives you a world-class build system, package manager, formatter, linter, and test runner out of the box.
5. **A growing ecosystem** with `tokio`, `serde`, `axum`, `clap`, `reqwest`, and thousands more production-ready crates.

Rust is not the right tool for every job, but for the jobs it's right for — anything that must be both fast and correct — it's increasingly the only sensible choice.

## Further Reading

- The Rust Programming Language ("The Book"): doc.rust-lang.org/book
- Rust by Example: doc.rust-lang.org/rust-by-example
- The Rustonomicon (unsafe Rust): doc.rust-lang.org/nomicon
- The Async Book: rust-lang.github.io/async-book
- Rust API Guidelines: rust-lang.github.io/api-guidelines
- *Programming Rust* by Blandy, Orendorff, and Tindall
- *Rust for Rustaceans* by Jon Gjengset
- *Zero to Production in Rust* by Luca Palmieri
- Rust Playground: play.rust-lang.org
