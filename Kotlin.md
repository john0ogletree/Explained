# Introduction to Kotlin

**Kotlin** is a modern, cross-platform, statically typed programming language developed by **JetBrains** and supported by **Google**. It is designed to be fully interoperable with Java, concise, safe, and expressive.

---

## 1. Key Features

* **Conciseness:** Reduces boilerplate code compared to languages like Java (e.g., standard getters/setters, `data` classes).
* **Null Safety:** Built-in mechanisms to eliminate `NullPointerException` (often called the "Billion-Dollar Mistake").
* **Interoperability:** 100% interoperable with Java. You can call existing Java code from Kotlin and vice versa.
* **Coroutines:** Built-in support for asynchronous programming, making concurrent tasks lighter and easier to read.
* **Multiplatform Development:** Can compile to JVM bytecode, JavaScript, and Native code (iOS, macOS, Linux, Windows).

---

## 2. Basic Syntax Examples

### Variables
Kotlin uses `val` for read-only (immutable) variables and `var` for mutable variables.

```kotlin
val name: String = "Alice" // Immutable
var age: Int = 25          // Mutable
```

### Type Inference
Types are often automatically inferred by the compiler:

```kotlin
val city = "New York" // Inferred as String
val count = 10        // Inferred as Int
```

### Functions
Functions are declared using the `fun` keyword.

```kotlin
fun greet(person: String): String {
    return "Hello, $person!"
}

// Single-expression function shorthand
fun add(a: Int, b: Int): Int = a + b
```

### Null Safety
Kotlin distinguishes between nullable and non-nullable types.

```kotlin
var nonNullable: String = "Hello"
// nonNullable = null // Compilation error

var nullable: String? = "Hello"
nullable = null // Works fine

// Safe call operator (?.)
val length = nullable?.length // Returns null if nullable is null
```

---

## 3. Core Concepts

### Data Classes
Data classes automatically generate boilerplate methods like `toString()`, `equals()`, `hashCode()`, and `copy()`.

```kotlin
data class User(val id: Int, val name: String, val email: String)
```

### Smart Casts
Kotlin’s compiler tracks types after checks, avoiding explicit type casting.

```kotlin
fun printStringLength(obj: Any) {
    if (obj is String) {
        // obj is automatically cast to String in this block
        println(obj.length)
    }
}
```

---

## 4. Main Use Cases

1. **Android Development:** Google made Kotlin the preferred language for Android application development in 2019.
2. **Backend Development:** Widely supported in server-side frameworks like **Spring Boot**, **Ktor**, and **Micronaut**.
3. **Multiplatform (KMP):** Sharing business logic across iOS, Android, Desktop, and Web applications.

---

## 5. Quick Comparison: Java vs. Kotlin

| Feature | Java | Kotlin |
| :--- | :--- | :--- |
| Null Safety | Checked at runtime (NullPointerException) | Checked at compile time |
| Boilerplate | High (Getters, setters, builders) | Low (`data class`, type inference) |
| Coroutines | No (Virtual Threads added in Java 21) | Native Support |
| Interoperability | Native | 100% Interoperable with Java |
