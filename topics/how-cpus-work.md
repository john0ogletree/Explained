# How CPUs Work

A CPU — Central Processing Unit — is the part of a computer that executes instructions. Every program you've ever run, every website you've ever loaded, every video you've ever watched, was ultimately a very long sequence of tiny operations performed by a CPU.

It's one of the most complex objects humans have ever manufactured, and its basic operation hasn't changed in 50 years. Fetch an instruction. Decode it. Execute it. Store the result. Repeat, billions of times per second.

Understanding that loop explains a lot about why computers are fast, why they're slow, and why some programs are dramatically harder to speed up than others.

## The Basic Loop

Every CPU, from a 1970s microprocessor to a modern 192-core server chip, runs the same cycle.

1. **Fetch** — read the next instruction from memory.
2. **Decode** — figure out what the instruction means.
3. **Execute** — do the operation (add, compare, jump, load, store).
4. **Store** — write the result somewhere (a register, memory, a flag).
5. **Repeat** — go back to step one.

That's the whole idea. Everything else — pipelining, caching, out-of-order execution, speculative execution, branch prediction, SIMD — is an optimization on top of this loop.

> A modern CPU doesn't do anything a 1970s CPU couldn't do. It just does millions of those things in parallel, and guesses what's coming next.

## The Clock

A CPU runs on a **clock** — a signal that pulses at a fixed rate. Each pulse is a **cycle**. "3.5 GHz" means 3.5 billion cycles per second.

Each cycle, the CPU can do a small amount of work. Simple instructions take one cycle. Complex ones take many. Memory access can take hundreds.

For years, CPUs got faster mostly by raising the clock speed. That stopped around 2005 — power consumption and heat made higher clocks impractical. So the industry shifted to doing more work per cycle instead.

## Why Moore's Law Slowed Down

**Moore's Law** observed that transistor counts doubled roughly every two years. That held from the 1970s into the 2010s. It's now slowing, and not because engineers got lazy.

- **Physical limits** — transistors are approaching the size of a few atoms. Quantum effects interfere.
- **Heat** — more transistors in the same area means more heat, and heat is hard to remove.
- **Power** — clock speed increases scale power consumption exponentially.
- **Cost** — each new fabrication node is more expensive than the last.

Modern gains come from specialization — GPUs for graphics and AI, TPUs for tensor math, NPUs for on-device ML — rather than from making CPUs universally faster.

## Pipelining

The fetch-decode-execute-store cycle has stages. A naive CPU does them one at a time. A **pipelined** CPU overlaps them: while one instruction is executing, the next is decoding, and the one after is fetching.

It's like an assembly line. Each stage stays busy even though the whole instruction still takes multiple cycles end-to-end.

Modern CPUs have 10–20 pipeline stages. The trade-off: deeper pipelines mean more work is wasted when the CPU guesses wrong.

## Branch Prediction

Programs are full of branches: `if`, `else`, `while`, `for`. The CPU doesn't know which way a branch will go until the condition is evaluated — but by then, it may already have started fetching the next instructions.

**Branch prediction** guesses. If the guess is right, no time is lost. If it's wrong, the pipeline is flushed and the CPU starts over.

Modern predictors are extremely good — 95–99% accuracy on typical code. But the misses are costly, and they're a major source of the difference between "this code feels fast" and "this code feels slow."

> A branch misprediction can cost 10–20 cycles. That doesn't sound like much until you remember that a modern CPU executes billions of cycles per second.

## Caching

Memory is slow compared to the CPU. DRAM access can take 100+ cycles. The CPU can't wait that long without wasting most of its time.

The fix is **caching** — small, fast memory that holds recently-used data. The CPU checks the cache first; only if the data isn't there does it go to main memory.

Typical cache hierarchy:

- **L1 cache** — 32–128 KB per core, ~4 cycles
- **L2 cache** — 256 KB – 2 MB per core, ~12 cycles
- **L3 cache** — 8–64 MB shared, ~40 cycles
- **Main memory (DRAM)** — gigabytes, ~100–300 cycles

Cache is why sequential access is dramatically faster than random access — the CPU fetches whole cache lines at a time, so it gets neighbors for free.

## Out-of-Order Execution

Instructions aren't always executed in the order they appear. Modern CPUs analyze dependencies and reorder instructions to keep pipelines full.

If instruction B doesn't depend on instruction A, the CPU can run B first. This is **out-of-order execution**, and it's one of the biggest reasons modern CPUs are so fast.

The cost: complexity. Reordering requires tracking dependencies, renaming registers, and rolling back if something goes wrong.

## Speculative Execution

Pushing further: the CPU doesn't just reorder — it **executes instructions that might not even be needed**. If a branch is predicted to go one way, the CPU starts executing that path before knowing for sure.

If the prediction is right, the result is instant. If wrong, the CPU discards the work and starts over. Speculation is why **Spectre** and **Meltdown** were so alarming — they exploited the side effects of speculative execution to leak data across security boundaries.

## Cores and Threads

For decades, CPUs got faster by doing one thing at a time faster. That stopped working. Now they get faster by doing more things at once.

- **Core** — an independent execution unit with its own fetch/decode/execute pipeline.
- **Thread** — a stream of instructions. Some cores run two threads simultaneously (SMT / Hyper-Threading), sharing execution units.

A 16-core CPU can genuinely run 16 programs in parallel. This matters enormously for workloads that can be parallelized — video encoding, simulations, servers — and barely at all for workloads that can't.

## Instruction Sets

The CPU's native language is its **instruction set architecture (ISA)**. Two dominate:

- **x86-64** — Intel and AMD. The desktop and server standard. Backward compatible with 1978's 8086.
- **ARM** — Apple Silicon, most phones, most tablets, increasingly servers. Smaller instructions, better power efficiency.

Programs compiled for one don't run on the other without translation. This is why emulation — like running Windows on Apple Silicon — is slower than native code.

## What CPUs Are Good At

- General-purpose computation — anything that can be expressed as instructions
- Branchy, unpredictable code — where GPUs struggle
- Single-threaded performance — where raw per-core speed matters
- Low-latency workloads — where fast cache and short pipelines dominate

## What CPUs Are Bad At

- Massively parallel numeric work — GPUs do this 10–100x better
- Specialized math — TPUs and NPUs beat them for ML
- Memory-bound workloads — where the bottleneck is DRAM, not compute

This is why modern systems are **heterogeneous**: CPU + GPU + specialized accelerators, each doing what it's best at.

## The Honest Summary

CPUs are:

- Millions of transistors running a 50-year-old loop
- Made fast by pipelining, caching, prediction, and parallelism
- Fundamentally limited by physics, not by design
- General-purpose by construction, which means not optimal for anything
- Increasingly one piece of a multi-chip system, not the whole story

They're not magic. They're a 5-stage loop, executed billions of times per second, tuned to within an inch of physical possibility.

> The CPU is the most general-purpose tool ever built. That's exactly why it's no longer the only tool — everything specialized beats it at something.

## Further Reading

- [Computer Organization and Design — Patterson & Hennessy](https://www.elsevier.com/books/computer-organization-and-design-mips-edition/patterson/978-0-12-820109-1)
- [Modern Microprocessors: A 90-Minute Guide — Jason Robert Carey](https://www.lighterra.com/papers/modernmicroprocessors/)
- [Agner Fog — Instruction tables and microarchitecture](https://www.agner.org/optimize/)
- [What Every Programmer Should Know About Memory — Ulrich Drepper](https://people.freebsd.org/~lstewart/articles/cpumemory.pdf)
