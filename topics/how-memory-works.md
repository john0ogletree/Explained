# How Memory Works

Memory is where programs store what they're working on. Every variable, every open file, every pixel on screen, every byte of a web request — all of it lives somewhere in memory while it's being used.

It's also the source of some of the hardest bugs in software. Programs that crash, programs that leak, programs that corrupt their own data — most of those come down to memory being used wrong.

Understanding memory comes down to two things: the **hierarchy** (where data lives and how fast it is) and the **model** (how programs are allowed to touch it).

## The Hierarchy

Memory is not one thing. It's a stack of layers, each larger, slower, and cheaper than the one above it.

- **Registers** — inside the CPU. A few hundred bytes. Sub-nanosecond access.
- **L1 cache** — per core. ~32–128 KB. ~1 nanosecond.
- **L2 cache** — per core. ~256 KB – 2 MB. ~4 nanoseconds.
- **L3 cache** — shared across cores. ~8–64 MB. ~12 nanoseconds.
- **Main memory (RAM)** — gigabytes. ~100 nanoseconds.
- **SSD** — hundreds of GB to TB. ~100 microseconds.
- **HDD** — several TB. ~10 milliseconds.
- **Network storage** — effectively unbounded. Milliseconds to seconds.

Each step down is roughly 10–100x slower than the step above. That ratio is why caching exists at every level — the CPU wants data as close as possible.

> There is no such thing as "fast memory." There's only memory that's closer to the CPU than the rest.

## RAM: What It Actually Is

**RAM** (Random Access Memory) is the main workspace. It's volatile — it loses its contents when power is cut. It's byte-addressable — the CPU can read or write any byte directly.

Physically, RAM is a grid of tiny capacitors, each holding a charge or not. Each cell needs periodic refreshing, hence **dynamic** RAM (DRAM). It's cheap, dense, and fast enough. It's also the reason your computer "forgets" everything when it shuts down.

## Virtual Memory

Programs don't see physical RAM. They see **virtual memory** — an abstraction managed by the operating system and the CPU's memory management unit (MMU).

Every process gets its own virtual address space. When a program accesses address `0x7fff5fbff8c0`, the MMU translates that to a real physical address behind the scenes.

Why bother:

- **Isolation** — one process can't read or write another's memory.
- **Contiguity** — programs see a flat address space even if physical memory is fragmented.
- **Overcommit** — programs can allocate more virtual memory than physically exists.
- **Security** — pages can be marked read-only, executable, or non-executable.

> Virtual memory is the single most important abstraction in modern computing. Almost every security property of a modern OS depends on it.

## Pages and the TLB

Virtual memory is divided into fixed-size chunks called **pages** (typically 4 KB). Physical memory is divided into **frames** of the same size. The OS maintains a **page table** mapping virtual pages to physical frames.

Looking up a page table entry on every memory access would be far too slow. So the CPU caches recent translations in a **TLB** (Translation Lookaside Buffer) — a small, very fast cache of recent mappings.

When the TLB misses, the CPU has to walk the page table, which can take hundreds of cycles. This is why programs that access memory randomly across large regions run slower than programs that access memory sequentially.

## Stack vs. Heap

Within a process, memory is usually split into regions. The two most important are the **stack** and the **heap**.

### The stack

- Fast — allocation is just moving a pointer.
- Automatic — memory is freed when the function returns.
- Small — typically 1–8 MB per thread.
- LIFO — last in, first out.
- Holds local variables, function arguments, return addresses.

### The heap

- Slower — allocation requires finding free space.
- Manual or garbage-collected — you must free it, or a runtime does.
- Large — bounded only by available memory.
- Fragmented over time.
- Holds dynamically-sized data, objects that outlive their scope.

Mixing these up is a common source of bugs. Returning a pointer to a stack variable is one of the classic mistakes in C.

> The stack is a scratchpad. The heap is a warehouse. Confusing one for the other is how programs crash.

## Caching in Practice

The cache hierarchy exists because the CPU is much faster than RAM. A program that ignores this runs at a fraction of its potential speed.

- **Spatial locality** — access nearby addresses. Caches fetch whole lines (typically 64 bytes), so using neighbors is nearly free.
- **Temporal locality** — access the same address repeatedly. It stays in cache.
- **Cache line** — the smallest unit the CPU loads from RAM. Accessing one byte loads 64.

This is why iterating a 2D array row-major is dramatically faster than column-major, even though the math is identical. One pattern hits the cache; the other misses constantly.

## Memory Allocation

On the heap, allocation is a real engineering problem.

- **malloc/free** — manual, fast, error-prone. Used in C.
- **Garbage collection** — automatic, pauses execution periodically. Used in Java, Go, JavaScript.
- **Reference counting** — deterministic cleanup, but cycles leak. Used in Python, Swift.
- **Arena allocation** — allocate a large block, subdivide. Used in games and compilers.
- **Stack allocation** — no cost when it works. Used wherever possible.

Each has trade-offs. Manual is fast but dangerous. GC is safe but pauses. Reference counting is predictable but can't handle cycles. Most languages pick one and stick with it.

## Common Memory Bugs

- **Buffer overflow** — writing past the end of an allocation. Classic security vulnerability.
- **Use-after-free** — accessing memory that's already been freed.
- **Double free** — freeing the same pointer twice.
- **Memory leak** — allocating without freeing. Slowly consumes RAM.
- **Dangling pointer** — a pointer to memory that no longer exists.
- **Race condition** — two threads accessing the same memory without synchronization.
- **Uninitialized read** — reading memory before writing it.

These are the categories behind a huge fraction of CVEs — the security vulnerabilities that make the news.

## How Languages Handle Memory

The language you use determines how much memory management you do.

| Language | Model |
|---|---|
| C | Manual, unsafe, maximum control |
| C++ | Manual with RAII and smart pointers |
| Rust | Compile-time ownership and borrowing |
| Go | Garbage collected, low pause |
| Java | Garbage collected, JVM |
| Python | Reference counted with cycle GC |
| JavaScript | Garbage collected |
| Swift | Reference counted with weak refs |

Rust is notable because it enforces memory safety at compile time — no garbage collector, no manual free, but the compiler refuses to build programs with dangling pointers or data races.

## What Memory Is Good At

- Keeping active data close to the CPU
- Isolating processes from each other
- Making allocation cheap when it's on the stack
- Providing the illusion of unbounded address space

## What Memory Is Bad At

- Random access across large regions
- Surviving power loss (that's storage's job)
- Being fast when the working set exceeds the cache
- Staying correct when programs manage it manually

## The Honest Summary

Memory is:

- A hierarchy, not a single thing
- Abstracted by the OS into virtual address spaces
- Split into stack and heap regions
- Cached at every level for speed
- The source of most low-level bugs and many security exploits
- Managed differently by every language

Programmers who understand memory write code that's fast and safe. Programmers who don't write code that works until it doesn't.

> You can write a lot of software without thinking about memory. Eventually, performance or a crash forces you to.

## Further Reading

- [What Every Programmer Should Know About Memory — Ulrich Drepper](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)
- [Computer Systems: A Programmer's Perspective — Bryant & O'Hallaron](https://csapp.cs.cmu.edu/)
- [Memory, Cache, and Virtual Memory — MIT 6.172](https://ocw.mit.edu/courses/6-172-performance-engineering-of-software-systems-fall-2018/)
- [The Rust Book — Ownership](https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html)
