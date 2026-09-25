# HTTP and HTTPS

**HTTP** is the protocol that moves data between browsers and servers. It's the language of the web — every page you load, every form you submit, every API call you make speaks it. **HTTPS** is the same protocol wrapped in encryption.

They're not separate things. HTTPS is HTTP over TLS. The requests and responses look identical; the difference is that nobody between you and the server can read or modify them.

Understanding HTTP explains why websites work the way they do. Understanding HTTPS explains why you should never log into anything without it.

## The Shape of a Request

Every HTTP request has the same structure.

- **Method** — what you want to do.
- **Path** — what you want it done to.
- **Headers** — metadata: who you are, what you accept, what you've cached.
- **Body** — optional payload, mostly for POST and PUT.

A minimal request:

```
GET /index.html HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
```

That's it. The server reads this, decides what to do, and sends back a response.

## The Shape of a Response

Responses mirror requests.

- **Status code** — what happened.
- **Headers** — content type, length, caching rules, cookies.
- **Body** — the actual content.

A minimal response:

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 1256

<!DOCTYPE html>...
```

The body can be HTML, JSON, an image, a video — anything with a MIME type.

## Methods

HTTP defines several methods. In practice, you'll see five.

- **GET** — retrieve something. Should be safe and idempotent.
- **POST** — submit data. Not idempotent; may create a resource.
- **PUT** — replace a resource entirely. Idempotent.
- **PATCH** — modify part of a resource.
- **DELETE** — remove a resource. Idempotent.

**Idempotent** means doing it twice has the same effect as doing it once. GET, PUT, and DELETE should be idempotent. POST is not. This matters for retries and caching.

## Status Codes

Status codes tell the client what happened. They're grouped by first digit.

- **1xx** — informational, rarely seen.
- **2xx** — success.
- **3xx** — redirect.
- **4xx** — client error.
- **5xx** — server error.

The ones you'll actually encounter:

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No content |
| 301 | Moved permanently |
| 302 | Found (temporary) |
| 304 | Not modified (cached) |
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not found |
| 429 | Too many requests |
| 500 | Server error |
| 502 | Bad gateway |
| 503 | Service unavailable |

The distinction between 401 and 403 matters: 401 means "you're not authenticated," 403 means "you're authenticated but not allowed."

## Headers That Matter

HTTP has dozens of headers. A handful do most of the work.

- **Host** — which domain the request is for. Essential for shared servers.
- **User-Agent** — what client is making the request.
- **Accept** — what content types the client wants.
- **Accept-Encoding** — what compression the client supports.
- **Cookie** — session data sent by the client.
- **Set-Cookie** — session data stored by the server.
- **Cache-Control** — caching rules.
- **Content-Type** — what the body actually is.
- **Authorization** — credentials.
- **Referer** — where the request came from.

## Caching

HTTP has a rich caching model. Done right, it's the difference between a fast site and a slow one.

- **Cache-Control** — the primary directive. `max-age=3600` means cache for an hour.
- **ETag** — a fingerprint of the content. The client sends it back to check for changes.
- **Last-Modified** — timestamp of the last change.
- **If-None-Match** / **If-Modified-Since** — conditional requests. If nothing changed, the server returns 304, and the client uses its cached copy.

A well-configured site caches static assets for a year and HTML for minutes. A poorly configured one re-fetches everything on every visit.

## Cookies and Sessions

HTTP is **stateless**. Each request is independent. Cookies are how the web fakes state.

1. Server sends `Set-Cookie: session=abc123; HttpOnly; Secure`.
2. Browser stores it and sends it back with every subsequent request.
3. Server reads it and knows who you are.

Cookie flags matter:

- **HttpOnly** — JavaScript can't read it. Protects against XSS.
- **Secure** — only sent over HTTPS.
- **SameSite** — controls when cookies are sent cross-site. Mitigates CSRF.

## HTTP/1.1, HTTP/2, HTTP/3

The protocol has evolved significantly.

- **HTTP/1.1** — the classic. One request per connection at a time. Workarounds like pipelining and domain sharding.
- **HTTP/2** — binary, multiplexed. Many requests over one connection. Header compression. Server push. The modern default.
- **HTTP/3** — runs over QUIC (UDP-based). Faster connection setup, better on lossy networks. Increasingly common.

From the application's perspective, the API is the same. From the network's perspective, they're entirely different.

## HTTPS: HTTP Over TLS

HTTPS is HTTP sent through an encrypted TLS tunnel. The HTTP layer doesn't change at all. What changes is that everything is wrapped in encryption before it leaves your machine.

The handshake:

1. Client says hello, lists supported ciphers.
2. Server responds with its certificate.
3. Client verifies the certificate against trusted CAs.
4. Both derive a shared session key.
5. Encrypted traffic flows.

From that point on, every HTTP request and response is encrypted. Intermediaries see only packet sizes and timing — not content.

## What HTTPS Protects

- **Confidentiality** — nobody on the path can read your traffic.
- **Integrity** — nobody can modify your traffic without detection.
- **Authenticity** — you're talking to the site you think you are.

## What HTTPS Doesn't Protect

- **Metadata** — who you're talking to, when, how often.
- **Endpoints** — if the server or your device is compromised, encryption is irrelevant.
- **The contents of your request** — the server sees everything you sent.
- **Your identity** — HTTPS doesn't prove who *you* are, only who *they* are.
- **The past** — if traffic was captured unencrypted before, it's still readable.

## Why HTTPS Everywhere

For years, HTTPS was reserved for login pages and payment forms. Now it's the default for everything.

- **Performance** — HTTP/2 and HTTP/3 require TLS.
- **Features** — many browser APIs only work on secure origins.
- **Privacy** — every request leaks information if unencrypted.
- **Integrity** — ISPs and intermediaries have injected ads and tracking into unencrypted traffic.
- **Trust** — browsers now mark plain HTTP as "Not Secure."

There is no reason to serve a modern website over plain HTTP.

## The Honest Summary

HTTP is:

- A simple request/response protocol
- Stateless by design, with cookies to fake state
- The foundation of every web API
- Evolved through three major versions, each faster than the last
- Not secure on its own — HTTPS is mandatory now

HTTPS is:

- HTTP wrapped in TLS
- Strong enough to defeat most attackers on the path
- Useless against a compromised endpoint
- The bare minimum for any serious site

> HTTP is how the web talks. HTTPS is the same conversation, whispered in a locked room. Both work the same way. Only one is safe.

## Further Reading

- [MDN — HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446)
- [Let's Encrypt — Free TLS certificates](https://letsencrypt.org/)
