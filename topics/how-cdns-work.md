# How CDNs Work

A **CDN** — Content Delivery Network — is a geographically distributed system that serves content to users from a server near them. It's one of those pieces of infrastructure that nobody thinks about until it stops working.

The idea is simple: distance costs time. A user in Tokyo fetching a page from a server in Virginia waits hundreds of milliseconds for every request. Serve that page from a server in Tokyo, and the wait drops to single-digit milliseconds.

CDNs are why modern websites feel instant even when the origin is on the other side of the planet. They're also a major part of how DDoS attacks are absorbed, how TLS certificates get managed at scale, and how static sites like yours get delivered.

## The Problem CDNs Solve

The speed of light is not negotiable. A signal between New York and London takes about 28 milliseconds of round-trip time, minimum, in a straight fiber line. Real routes are longer. Multiply that by dozens of requests per page, and geography becomes a bottleneck.

Without a CDN, every user hits the same origin server. With one, they hit a copy of the origin that lives close by.

- **Latency** — user is closer to the server.
- **Bandwidth** — traffic is distributed across many servers.
- **Availability** — if one edge node fails, others keep serving.
- **DDoS resistance** — attacks are absorbed across the network.
- **Cost** — CDNs often charge less than origin egress.

Origin servers become the source of truth, not the public-facing service.

## The Basic Architecture

A CDN has three parts:

- **Origin** — where the original content lives. Your server, your S3 bucket, your GitHub Pages site.
- **Edge** — hundreds or thousands of servers worldwide that cache content and serve users.
- **Routing layer** — decides which edge node each user should hit.

When a user requests a file, the CDN:

1. Routes them to the nearest edge node (via DNS, anycast, or both).
2. Checks if the edge has the file cached.
3. If yes, serves it directly.
4. If no, fetches it from origin, serves it, and caches it for next time.

That's the whole loop. Everything else is optimization.

> A CDN is a cache with a global footprint. The cache is the product. The global footprint is what makes it useful.

## Caching Rules

What gets cached, for how long, and under what conditions is set by HTTP headers and CDN configuration.

- **Cache-Control** — the primary directive. `public, max-age=3600` means cache for one hour.
- **s-maxage** — overrides max-age for shared caches (like CDNs).
- **ETag** — a fingerprint for the content. Used for revalidation.
- **Last-Modified** — timestamp for conditional requests.
- **Vary** — tells the CDN which headers affect the response. `Vary: Accept-Encoding` means gzip and plain versions are cached separately.

Common patterns:

- **Static assets** — long cache, hashed filenames (`app.abc123.js`). Immutable.
- **HTML** — short cache or no cache. Often needs to reflect new content.
- **API responses** — depends entirely on semantics. User-specific responses should not be cached at the edge.
- **Images** — long cache, often transformed on the fly.

Getting cache headers wrong causes some of the most frustrating bugs in web development — stale content, broken personalization, phantom errors that don't reproduce locally.

## Cache Invalidation

The hard problem in caching is not caching. It's getting rid of stale entries.

Three common approaches:

- **TTL expiry** — wait for the cache entry to age out. Simple but slow.
- **Purge by URL** — explicitly tell the CDN to drop a specific path.
- **Purge by tag or key** — group related entries and purge them together.

Modern CDNs support API-driven purges, so a deploy can invalidate the affected files automatically. Without this, you either wait out the TTL or accept stale content.

## Routing: Anycast and DNS

Two mechanisms route users to the right edge node.

**Anycast** — multiple edge servers announce the same IP address. The internet's routing protocol (BGP) sends each user to the topologically nearest one. This is how Cloudflare, Google, and most major CDNs work.

**DNS-based routing** — the CDN's DNS resolver returns different IPs depending on the user's location. Older approach, still widely used.

Anycast is faster and more resilient. DNS-based is easier to reason about. Many CDNs use both.

## What CDNs Do Beyond Caching

Modern CDNs are not just caches. They're programmable edge platforms.

- **TLS termination** — handle HTTPS at the edge, often with automatic certificate management.
- **Compression** — gzip or Brotli on the fly.
- **Image optimization** — resize, convert to WebP or AVIF, serve based on `Accept` headers.
- **Edge compute** — run JavaScript, WASM, or custom functions at the edge. Cloudflare Workers, Lambda@Edge, Vercel Edge Functions.
- **WAF (Web Application Firewall)** — block common attacks before they reach origin.
- **DDoS mitigation** — absorb volumetric attacks across the network.
- **Bot management** — detect and filter automated traffic.
- **Rate limiting** — cap requests per IP or per endpoint.
- **A/B testing** — split traffic at the edge without touching origin.
- **Authentication** — some CDNs handle OAuth flows and session management at the edge.

That last category — edge compute — is where the biggest shift is happening. CDNs started as caches. They're becoming the primary execution environment for web applications.

## Push vs. Pull

There are two models for getting content into the cache.

**Pull CDN** — the edge fetches content from origin the first time it's requested, then caches it. Simple, no setup, works for anything. What most sites use.

**Push CDN** — content is uploaded to the CDN ahead of time, and the CDN serves only from its own storage. More control, useful for large static assets like video, but requires coordination.

Pull is the default. Push is used when you know exactly what content needs to be available and want to avoid the first-request penalty.

## Edge Compute in Practice

Traditional CDNs served static files. Modern CDNs run code.

A Cloudflare Worker, for example, can:

- Rewrite HTML on the way out.
- Route API requests based on geolocation.
- Add authentication headers.
- Cache responses with custom logic.
- Serve dynamic content from the edge without touching origin.

This is what your "Explained" site's functions are doing. They run at Cloudflare's edge, cache at Cloudflare's edge, and never talk to a traditional origin server for most requests.

> The line between "CDN" and "hosting platform" has effectively disappeared. Cloudflare, Vercel, Netlify, and Fastly are all both.

## What CDNs Are Good At

- Delivering static content globally at low latency
- Absorbing traffic spikes and DDoS attacks
- Terminating TLS at the edge
- Running small pieces of compute near users
- Reducing origin load and cost
- Handling failover and redundancy

## What They're Bad At

- Personalization — caching per-user responses is expensive
- Strong consistency — edge caches are eventually consistent by design
- Complex stateful logic — edge runtimes are stateless by necessity
- Large uploads — CDNs are optimized for egress, not ingress
- Debugging — problems at the edge can be invisible from origin logs

## The Honest Summary

CDNs are:

- A global cache between users and origin
- Fundamentally about latency, not bandwidth
- Increasingly a compute platform, not just a file server
- Essential for modern web performance and DDoS resilience
- Invisible when working, painful when not
- The reason a "static site" can feel faster than a dynamic one

They solve a problem — distance — that no amount of server optimization can fix. That's why almost every serious website sits behind one.

> A CDN doesn't make your server faster. It makes your server closer. And for most of the web, closer is faster.

## Further Reading

- [Cloudflare Learning Center — What is a CDN?](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)
- [Fastly — How CDNs work](https://www.fastly.com/learning/what-is-a-cdn)
- [MDN — HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Web Almanac — CDN adoption](https://almanac.httparchive.org/)
