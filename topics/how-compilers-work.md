# How Compilers Work

A **compiler** is a program that translates source code written in one language into another — usually a lower-level language the machine can actually run. You write `if (x > 0)`, the compiler emits machine instructions that compare, branch, and jump. The gap between those two is enormous, and the compiler is what bridges it.

It's one of the oldest and most studied pieces of software in computing. The first compilers were built in the 1950s. The basic architecture hasn't changed since. What changed is how aggressively they optimize — modern compilers routinely rewrite your code into something dramatically faster than what you wrote.

Understanding compilers explains a lot about why languages feel the way they do, why some bugs are caught at compile time, and why "just add `-O2`" sometimes doubles performance.

## The Basic Pipeline

Almost every compiler, from a small one to GCC, works in the same stages:

1. **Lexing** — turn raw text into tokens.
2. **Parsing** — turn tokens into a syntax tree.
3. **Semantic analysis** — check types, resolve names, catch errors.
4. **Intermediate representation (IR)** — lower the tree into a simpler, uniform form.
5. **Optimization** — rewrite the IR for speed or size.
6. **Code generation** — emit machine instructions.
7. **Assembly and linking** — produce the final executable.

That's the shape. Real compilers have many sub-stages, multiple IRs, and hundreds of optimization passes, but the pipeline is the same.

> A compiler is a translator, but not a literal one. It doesn't translate the words you wrote — it translates the meaning, then re-expresses that meaning in whatever way is fastest on the target machine.

## Lexing and Parsing

**Lexing** (also called tokenizing) breaks text into tokens: keywords, identifiers, numbers, operators, punctuation. The string `int x = 42;` becomes something like `[KEYWORD int] [IDENT x] [ASSIGN] [NUMBER 42] [SEMICOLON]`.

**Parsing** builds a tree from those tokens — an **abstract syntax tree (AST)**. The tree captures the structure. `a + b * c` becomes `a + (b * c)`, not `(a + b) * c`, because the parser knows `*` binds tighter than `+`.

Syntax errors are caught here. If the tokens don't fit the grammar, the compiler stops.

## Semantic Analysis

The AST is syntactically valid but may not make sense. **Semantic analysis** checks the meaning:

- **Type checking** — is `x` actually an integer? Are you passing a string to a function that expects a number?
- **Name resolution** — which `foo` do you mean? The local variable, the class method, the imported function?
- **Scope rules** — is this variable defined before use?
- **Lifetime and ownership** — in Rust, this is where borrow checking happens.

This stage is where most "the compiler caught my mistake" moments come from. A language with strong static semantics catches classes of bugs that dynamic languages only find at runtime.

## Intermediate Representation

The AST is too high-level to optimize directly. Compilers lower it into an **intermediate representation** — a simpler, more uniform form.

The most common modern IR is **SSA** (Static Single Assignment), where every variable is assigned exactly once. That makes data-flow analysis much easier: a use of a variable has exactly one definition, so optimizations can trace it precisely.

Famous IRs:

- **LLVM IR** — used by Clang, Rust, Swift, and many others.
- **GIMPLE** — GCC's internal IR.
- **CIL / MSIL** — .NET's IR.
- **Bytecode** — Java, Python, JavaScript engines.

IR is the compiler's working language. All optimizations happen on it, and code generation reads it to produce machine instructions.

## Optimization

This is where compilers earn their keep. Modern optimizers run hundreds of passes, each making a small improvement. Some of the most important:

- **Constant folding** — `2 + 3` becomes `5` at compile time.
- **Dead code elimination** — remove code whose results are never used.
- **Common subexpression elimination** — compute `a * b` once, reuse it.
- **Loop unrolling** — duplicate the loop body to reduce overhead.
- **Loop-invariant code motion** — move computations out of loops.
- **Inlining** — replace a function call with the function's body.
- **Vectorization** — use SIMD instructions to do 4 or 8 operations at once.
- **Register allocation** — assign the most-used variables to CPU registers.

Done well, these can make code 2–10x faster than the naive version, without changing what the program does.

> A compiler's job is not to preserve your code. It's to preserve the *meaning* of your code while rewriting everything else. The version that runs may look nothing like the version you wrote.

## Undefined Behavior

Optimizers assume your program has no **undefined behavior** — cases the language spec doesn't define. Division by zero. Reading past the end of an array. Signed integer overflow in C.

If your program has UB, the compiler is free to do anything. In practice, it produces optimizations that assume UB never happens, which means code that *does* trigger UB can behave in ways that look insane.

This is why C and C++ code can be subtly broken by "harmless" optimizations. The bug was always there. The optimizer just noticed it was technically impossible.

## Code Generation

The compiler reads the optimized IR and emits machine instructions for the target architecture.

- **Instruction selection** — pick the right instructions for each IR node.
- **Register allocation** — assign variables to CPU registers (a hard combinatorial problem).
- **Instruction scheduling** — order instructions to hide memory latency and use pipelines well.
- **Peephole optimization** — small local improvements to the emitted code.

The output is **assembly**, which is then assembled into machine code by a separate tool.

## Static vs. Dynamic Compilation

Compilers run at different times.

- **Ahead-of-time (AOT)** — compile before the program runs. C, C++, Rust, Go, Swift.
- **Just-in-time (JIT)** — compile while the program runs. Java, JavaScript, C#, PyPy.
- **Interpreted** — no compilation, execute the AST directly. Early Python, shell scripts.

JIT compilers can optimize based on *actual* runtime behavior — which types are actually being used, which branches are usually taken. That can beat AOT for long-running programs, at the cost of startup time and complexity.

Modern runtimes often use **tiered compilation**: start interpreting, compile to bytecode, then JIT-compile hot functions aggressively.

## Language Design Is Compiler Design

Language features exist because they're easy to compile, or don't exist because they're hard.

- **Static types** exist because they let the compiler catch errors early and generate better code.
- **Garbage collection** exists because manual memory management is error-prone.
- **Generics** exist because templates and monomorphization are compile-time constructs.
- **Async/await** exists because it's a clean way to compile cooperative concurrency.
- **Macros** exist because some languages let you run code at compile time.

Rust's borrow checker is the clearest example: a whole class of memory bugs is caught at compile time because the compiler verifies ownership rules. That only works because the language was designed for it.

## What Compilers Are Good At

- Translating source to machine code reliably
- Catching classes of bugs at compile time
- Making straightforward code run dramatically faster
- Cross-compiling for multiple architectures
- Optimizing across whole programs, not just functions

## What They're Bad At

- Reasoning about dynamic behavior — JIT compilers try, AOT compilers can't
- Understanding intent — the compiler sees what you wrote, not what you meant
- Catching all errors — UB, races, and logic bugs slip through
- Guaranteeing performance — the fastest code isn't always obvious
- Being simple — a serious compiler is one of the largest programs you'll ever build

## The Honest Summary

Compilers are:

- Translators from one language to another
- Built on a pipeline that hasn't fundamentally changed in 60 years
- Where most of the "why is this language fast/slow" answer lives
- Aggressive rewriters of your code, not passive translators
- The reason undefined behavior is so dangerous
- One of the most studied and refined pieces of software in computing

Writing a toy compiler is one of the best ways to understand how programming languages actually work. Writing a production compiler is a career.

> Your code is a description of what you want. The compiler's output is what actually runs. They're usually not the same thing.

## Further Reading

- [Compilers: Principles, Techniques, and Tools — Aho, Lam, Sethi, Ullman](https://www.pearson.com/en-us/subject-catalog/p/compilers-principles-techniques-and-tools/P200000003258)
- [Crafting Interpreters — Robert Nystrom](https://craftinginterpreters.com/)
- [LLVM — The compiler infrastructure](https://llvm.org/)
- [Engineering a Compiler — Cooper & Torczon](https://www.elsevier.com/books/engineering-a-compiler/cooper/978-0-12-815908-8)
