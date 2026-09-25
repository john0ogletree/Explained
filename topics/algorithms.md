# Algorithms

An **algorithm** is a finite sequence of well-defined steps for solving a problem. That's the whole definition. It's not code, though code often implements one. It's not a program, though programs are made of them. It's a recipe — a precise description of *how* to do something, independent of the language you write it in.

Every piece of software you've ever used is a stack of algorithms, most of which were invented decades ago and haven't changed since. Sorting. Searching. Hashing. Graph traversal. Path finding. Compression. The field is old, and the fundamentals are settled.

What changed is scale. An algorithm that was fine for a thousand records becomes unusable for a billion. Choosing the right one is the difference between a page that loads and a page that doesn't.

## What Makes an Algorithm

Algorithms share a few properties:

- **Finite** — it terminates after a bounded number of steps.
- **Definite** — each step is unambiguous.
- **Effective** — each step is actually doable.
- **Input** — it takes zero or more inputs.
- **Output** — it produces one or more outputs.

If any of these are missing, it's not an algorithm. It's a procedure, a heuristic, or a wish.

## Complexity: The Real Cost

The single most important thing about an algorithm is **how its cost scales** as the input grows. That's what **Big-O notation** expresses.

Big-O ignores constant factors and focuses on the *shape* of the growth curve:

| Notation | Name | Example |
|---|---|---|
| O(1) | Constant | Hash table lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Scanning a list |
| O(n log n) | Linearithmic | Efficient sorting |
| O(n²) | Quadratic | Naive sorting, nested loops |
| O(2ⁿ) | Exponential | Brute-force subset problems |
| O(n!) | Factorial | Brute-force traveling salesman |

The gap between these is not academic. On a million items:

- O(n) takes about a million steps.
- O(n log n) takes about 20 million.
- O(n²) takes a trillion.
- O(2ⁿ) takes longer than the universe has existed.

> An O(n²) algorithm on a small input is fine. On a large input, it's a bug that hasn't happened yet.

## Why Big-O Hides Constants

Big-O ignores constants because they don't matter at scale — but at small scale, they dominate.

An O(n) algorithm with a huge constant can be slower than an O(n log n) algorithm for small n. This is why production code sometimes uses insertion sort inside quicksort: for arrays under ~16 elements, the "slower" algorithm wins.

The rule: **Big-O tells you where the curve goes. Constants tell you where it starts.**

## The Classics

A handful of algorithms show up everywhere. Knowing them is knowing the vocabulary of computer science.

### Sorting

- **Quicksort** — O(n log n) average, O(n²) worst case. Fast in practice, in-place.
- **Merge sort** — O(n log n) always. Stable, predictable, uses extra memory.
- **Heapsort** — O(n log n) always, in-place, but slower constants.
- **Timsort** — hybrid used by Python and Java. Exploits existing order.
- **Counting sort** — O(n + k), only for bounded integer ranges.

There is no single "best" sort. The right one depends on data size, distribution, memory constraints, and whether stability matters.

### Searching

- **Linear search** — O(n). Check every element. Works on anything.
- **Binary search** — O(log n). Requires sorted data. Halves the space each step.
- **Hash lookup** — O(1) average. Requires a good hash function.
- **Tree search** — O(log n) for balanced trees. Ordered, supports range queries.

Binary search is the canonical example of why algorithms matter: searching a billion sorted items takes about 30 comparisons instead of a billion.

### Graph Traversal

- **BFS (breadth-first)** — explores level by level. Finds shortest paths in unweighted graphs.
- **DFS (depth-first)** — goes deep before wide. Used for cycle detection and topological sorting.
- **Dijkstra** — shortest paths with non-negative weights. O((V + E) log V) with a heap.
- **Bellman-Ford** — handles negative weights. Slower.
- **A*** — Dijkstra with a heuristic. The basis of most game pathfinding.

### String Algorithms

- **KMP** — substring search in O(n + m).
- **Rabin-Karp** — rolling hash substring search.
- **Boyer-Moore** — fast in practice, sublinear on average.
- **Levenshtein distance** — edit distance between strings.

## Data Structures Are Half the Story

Algorithms and data structures are inseparable. The right structure makes the right algorithm cheap.

- **Array** — O(1) indexing, O(n) insertion.
- **Linked list** — O(1) insertion, O(n) access.
- **Hash table** — O(1) average lookup, no ordering.
- **Balanced tree** — O(log n) everything, ordered.
- **Heap** — O(log n) insert, O(1) peek at min/max.
- **Graph** — depends entirely on the representation.

Choosing the structure is often more important than choosing the algorithm. A bad structure makes every operation slow.

## Greedy, Dynamic, and Divide-and-Conquer

Three broad strategies for designing algorithms:

- **Greedy** — make the locally best choice at each step. Fast, but only correct for some problems. Coin change, scheduling.
- **Dynamic programming** — break a problem into overlapping subproblems, solve each once, reuse the answer. Knapsack, shortest paths, sequence alignment.
- **Divide-and-conquer** — split, solve recursively, combine. Merge sort, quicksort, FFT.

Each has a different shape of problem it's suited to. Greedy is fast but fragile. DP is correct but memory-hungry. Divide-and-conquer is elegant but only applies when subproblems are independent.

## What Makes a Problem Hard

Some problems have no efficient algorithm known. This is where **complexity theory** lives.

- **P** — problems solvable in polynomial time.
- **NP** — problems whose solutions can be verified in polynomial time.
- **NP-complete** — the hardest problems in NP. If any one has a polynomial algorithm, they all do.
- **NP-hard** — at least as hard as NP-complete, possibly harder.

For NP-complete problems, no one knows a polynomial algorithm, and most researchers believe none exists. In practice, you don't solve them exactly. You approximate, or you solve small instances, or you accept that it's just hard.

> The traveling salesman problem has been studied for nearly a century. No one has a fast algorithm for it. That's not a gap in human knowledge — it's a feature of the problem.

## Where Algorithms Matter Most

Not all code is algorithmically sensitive. Some places it matters enormously:

- **Databases** — query planning, indexing, join order.
- **Compilers** — parsing, optimization, register allocation.
- **Networking** — routing, congestion control, packet scheduling.
- **Cryptography** — key exchange, signatures, hashing.
- **Machine learning** — training loops, gradient descent, matrix operations.
- **Graphics** — rendering, culling, clipping, ray tracing.
- **Search engines** — inverted index, ranking, crawling.

Get the algorithm wrong in any of these and no amount of optimization saves you. Get it right and the rest is engineering.

## The Honest Summary

Algorithms are:

- Precise recipes for solving problems
- Analyzed by how their cost scales, not by how fast they run on your laptop
- Old — most core algorithms predate the personal computer
- Inseparable from data structures
- The difference between "works" and "works at scale"

You don't need to know every algorithm. You need to know the shapes — linear, logarithmic, quadratic — and recognize which shape your problem is. That's most of the practical skill.

> The best programmers aren't the ones who know the most algorithms. They're the ones who recognize which one a problem is asking for.

## Further Reading

- [Introduction to Algorithms — Cormen, Leiserson, Rivest, Stein](https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/)
- [The Algorithm Design Manual — Steven Skiena](https://www.algorist.com/)
- [VisuAlgo — Algorithm visualizations](https://visualgo.net/)
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/)
