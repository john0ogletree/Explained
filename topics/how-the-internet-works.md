# How the Internet Works

The internet is a **network of networks** that agree on a common set of protocols so they can pass messages to each other. That's the whole idea. Everything else — websites, email, video calls, this page — is built on top of that one agreement.

Understanding it comes down to a few layers, each solving a different problem.

## The Big Picture

When you type a URL and hit enter, roughly this happens:

1. Your browser asks **DNS** for the IP address behind the domain.
2. It opens a **TCP** connection to that IP on port 443.
3. It negotiates **TLS** so the connection is encrypted.
4. It sends an **HTTP** request.
5. The server sends back an HTTP response.
6. Your browser renders the HTML, fetches CSS, JS, images, and paints the page.

Each of those steps is a different protocol, solving a different problem. None of them know about the others.

## Layer 1 — DNS: Names to Numbers

Computers route by IP address, but humans remember names. **DNS** is the phonebook.

- You ask a **resolver** (often your ISP or `1.1.1.1`) for `example.com`.
- The resolver walks a hierarchy: root → `.com` → `example.com`.
- It returns an IP like `93.184.216.34`.
- Your browser caches it for a while, based on the **TTL**.

```bash
# See what a domain resolves to
dig example.com +short

# See the full chain
dig example.com +trace
```

Without DNS, you'd memorize IPs. With it, you get names — and a whole class of attacks like cache poisoning and DNS hijacking.

## Layer 2 — TCP/IP: Packets and Addresses

**IP** gets a packet from one machine to another. **TCP** makes that reliable.

- IP is **connectionless** — it just tries to deliver.
- TCP adds ordering, retries, and flow control on top.
- Every TCP connection is identified by 4 things: source IP, source port, dest IP, dest port.

When you load a page, your browser opens several TCP connections in parallel. Modern HTTP/2 and HTTP/3 reuse a single connection for many requests.

> IP is the postal system. TCP is the certified mail service layered on top of it.

## Layer 3 — TLS: Encryption

**TLS** wraps the TCP connection so nobody between you and the server can read or modify the traffic.

The handshake:

1. Client says hello, lists supported ciphers.
2. Server sends its certificate (signed by a **CA**).
3. Client verifies the cert against trusted roots.
4. Both derive a shared session key.
5. Encrypted traffic flows.

This is why HTTPS matters. Without TLS, anyone on the path — your ISP, a coffee shop router, a hostile government — can read and alter everything.

## Layer 4 — HTTP: Requests and Responses

**HTTP** is the language browsers and servers speak. It's simple:

```http
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

And the response:

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1256

<!DOCTYPE html>...
```

That's it. Everything else is headers, methods, status codes, and bodies.

### Common status codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 301 | Moved permanently |
| 302 | Found (temporary redirect) |
| 304 | Not modified (cached) |
| 404 | Not found |
| 500 | Server error |
| 503 | Service unavailable |

## Layer 5 — The Browser

The browser is the most complex piece most users never think about. It:

- Parses HTML into a **DOM** tree.
- Parses CSS into a **CSSOM**.
- Combines them into a **render tree**.
- Lays out geometry, then **paints** pixels.
- Runs JavaScript, which can mutate any of the above.

That's why a "simple page" can still feel slow. The browser is doing enormous work per frame.

## What Actually Travels

When you send a request, it's wrapped like an onion:

- Your **HTTP request** goes inside
- **TLS** encrypts it
- **TCP** segments it
- **IP** routes each segment
- **Ethernet/Wi-Fi** frames it for the physical link

The receiving side unwraps each layer in reverse. Every router in between only looks at IP — never at your encrypted payload.

## Common Points of Failure

When something breaks, it's usually one of these:

- **DNS** — wrong record, expired TTL, propagation delay
- **TLS** — expired cert, wrong hostname, missing intermediate
- **TCP** — firewall, port blocked, MTU issues
- **HTTP** — bad headers, CORS, redirect loops
- **Browser** — cache, extensions, mixed content

Debugging is mostly figuring out which layer is lying to you.

> "It works on my machine" almost always means the other machine has a different DNS cache, a different TLS root store, or a different proxy.

## The Mental Model To Keep

Layers exist so each one can be replaced without touching the others.

- DNS doesn't care what protocol you use after it resolves.
- TCP doesn't care what's inside the packets.
- TLS doesn't care what HTTP method you used.
- HTTP doesn't care what the page looks like.

When you're debugging, identify the layer first. Then the problem usually solves itself.

## Further Reading

- [MDN — How the web works](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works)
- [High Performance Browser Networking (Grigorik)](https://hpbn.co/)
- [Cloudflare Learning Center](https://www.cloudflare.com/learning/)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
