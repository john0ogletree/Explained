# How GPUs Work

A **GPU** — Graphics Processing Unit — is a processor designed for one thing: doing the same operation on a huge amount of data at the same time. That's it. Everything else about GPUs follows from that single design choice.

They were built for video games, where millions of pixels each need the same lighting and geometry math applied every frame. But the same property — massive parallelism — turned out to be exactly what machine learning, scientific simulation, and video encoding needed too. That's why GPUs are now at the center of the AI boom.

Understanding why GPUs are fast means understanding why CPUs are slow, at least for certain kinds of work.

## The Core Difference

A CPU has a handful of very powerful cores. A GPU has thousands of small ones.

- **CPU** — 8 to 64 cores, each complex, each optimized for single-thread performance, deep pipelines, big caches.
- **GPU** — thousands of cores, each simple, each optimized for throughput, shallow pipelines, small caches.

The CPU is built to finish one task as fast as possible. The GPU is built to finish a million small tasks at once. Neither is universally better — they're optimized for different problems.

> A CPU is a sports car. A GPU is a fleet of buses. For one passenger, the car wins. For ten thousand, the buses do.

## Why CPUs Are Bad at Parallel Work

A CPU core can execute one instruction stream at a time. It uses tricks — out-of-order execution, branch prediction, speculative execution — to squeeze more work out of that single stream.

Those tricks cost silicon. A large fraction of a CPU core is dedicated to control logic, caches, and prediction, not to actually doing math. That's fine when you need fast single-thread performance, but it's wasted overhead when you have a million independent calculations.

A GPU does the opposite: it strips out almost all the control logic and spends the silicon on raw arithmetic units.

## SIMT: The GPU Model

GPUs use a model called **SIMT** — Single Instruction, Multiple Threads. A single instruction is issued to a group of threads at once, and each thread applies it to its own data.

Threads are grouped:

- **Thread** — one lane of execution.
- **Warp** (NVIDIA) / **Wavefront** (AMD) — 32 or 64 threads that execute in lockstep.
- **Block** — a group of warps that share memory.
- **Grid** — all blocks launched by one kernel.

Every thread in a warp executes the same instruction. If they need to branch — say, "if pixel is dark, do this; else do that" — the hardware runs both sides and masks off the inactive lanes. This is called **warp divergence**, and it's the main performance trap in GPU programming.

> GPUs are fast when every thread does the same thing. They slow to a crawl when threads disagree.

## Memory Hierarchy

GPUs have their own memory, separate from the CPU's.

- **Registers** — per thread, thousands of them.
- **Shared memory** — per block. Fast, explicitly managed, like a user-controlled cache.
- **L1/L2 cache** — smaller and simpler than CPU caches.
- **Global memory (VRAM)** — the GPU's main memory. GBs of it, high bandwidth.

VRAM bandwidth is the GPU's secret weapon. A modern GPU can push 1–3 **terabytes per second** of memory bandwidth, roughly 10–20x what a CPU can. For workloads that are memory-bound rather than compute-bound, that alone is transformative.

## Why GPUs Won at AI

Neural networks are, mathematically, giant piles of matrix multiplications. A forward pass through a layer is a matrix-vector multiply. Training is a long sequence of matrix-matrix multiplies.

Matrix multiplication is embarrassingly parallel: every output element is independent. That's the GPU's ideal workload.

The historical turning point was around 2012, when researchers realized that **off-the-shelf GPUs** — designed for games — could train neural networks 10–100x faster than CPUs. That single insight triggered the deep learning boom.

NVIDIA leaned in hard. **CUDA** (2007) gave programmers direct access to GPU compute. **cuDNN** (2014) provided optimized neural network primitives. **Tensor cores** (2017) added dedicated matrix-multiply hardware. The whole modern AI stack runs on this foundation.

## CUDA and Its Rivals

CUDA is NVIDIA's proprietary platform for GPU compute. It's the dominant standard, and it's why NVIDIA has such a strong grip on AI hardware.

Competitors:

- **ROCm** — AMD's open alternative. Functional but less mature.
- **OpenCL** — vendor-neutral, but slower-moving and less optimized.
- **Metal** — Apple's GPU compute framework. Used on Apple Silicon.
- **Vulkan Compute** — cross-platform, low-level.
- **WebGPU** — GPU compute in the browser.
- **SYCL** — Intel-backed, C++-based.

The ecosystem around CUDA — libraries, tooling, documentation — is the real moat. Writing the code is one thing. Having every ML framework optimized for your hardware is another.

## Tensor Cores and Matrix Units

Modern GPUs include **tensor cores** — specialized units for small matrix multiplications, typically 4×4 or 16×16, done in one instruction.

They trade precision for speed. A tensor core operation might use 16-bit or 8-bit floats instead of 32-bit, which is fine for most neural network work. The result is 10–100x throughput on the operations that matter most for AI.

TPUs (Google), NPUs (Apple, Qualcomm), and similar accelerators take this idea further — they drop general-purpose GPU features entirely and build hardware around matrix math.

## What GPUs Are Good At

- Matrix and vector math
- Image and video processing
- Physics simulation
- Ray tracing and rasterization
- Neural network training and inference
- Cryptographic hashing (ironically, also for breaking it)
- Any workload with thousands of independent operations

## What GPUs Are Bad At

- Branchy, unpredictable code (warp divergence kills performance)
- Sequential algorithms (where step N depends on step N−1)
- Small workloads (the overhead of launching kernels dominates)
- Latency-sensitive work (GPUs are throughput machines, not latency machines)
- Pointer chasing and dynamic data structures

This is why CPUs still exist even though GPUs are dramatically faster for the workloads they target. Real programs mix both kinds of work.

## Programming a GPU

Writing GPU code is different from CPU code. You write a **kernel** — a function that runs on thousands of threads — and launch it over a grid.

Pseudocode for a vector add:

```
__global__ void add(float* a, float* b, float* c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) c[i] = a[i] + b[i];
}
```

Each thread computes one output element. Launch this with a million threads and the GPU does a million adds in parallel. The `if` matters because threads past the end must do nothing.

Optimizing GPU code is mostly about memory access patterns: coalesced reads, shared memory reuse, avoiding divergence. Naive GPU code is often only 2–5x faster than CPU. Well-tuned code is 50–100x faster.

## The Honest Summary

GPUs are:

- Massively parallel processors, designed for throughput, not latency
- Fast at anything with thousands of independent operations
- Slow at branchy, sequential, or pointer-heavy code
- Now the foundation of modern AI training and inference
- Increasingly common outside graphics — servers, phones, cars, laptops

They're not a replacement for CPUs. They're a different tool for a different shape of problem. The interesting engineering is in deciding which one each part of a workload belongs on.

> The CPU asks "how do I do this fast?" The GPU asks "how do I do a million of these at once?" The answer to the first question is often "use the second."

## Further Reading

- [Programming Massively Parallel Processors — Kirk & Hwu](https://www.elsevier.com/books/programming-massively-parallel-processors/kirk/978-0-323-91231-0)
- [CUDA C++ Programming Guide — NVIDIA](https://docs.nvidia.com/cuda/cuda-c-programming-guide/)
- [What Every CUDA Programmer Should Know About the GPU — NVIDIA GTC](https://developer.nvidia.com/gtc)
- [WebGPU — GPU compute in the browser](https://www.w3.org/TR/webgpu/)
