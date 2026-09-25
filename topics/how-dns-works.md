# How DNS Works

**DNS** — the Domain Name System — is the phonebook of the internet. It translates human-readable names like `example.com` into the IP addresses computers use to route traffic.

It's one of the oldest and most critical pieces of internet infrastructure, and it's also one of the most invisible. When it works, you never think about it. When it doesn't, nothing works at all.

Understanding DNS explains a lot: why a new domain can take hours to "propagate," why some sites are blocked in some countries, why a typo can send you somewhere suspicious, and why your ISP might be watching where you go.

## The Core Problem

Computers route packets by IP address. Humans remember names. The gap between them is enormous — there are hundreds of millions of registered domains, and the number grows daily.

DNS bridges that gap. You type `jao.life`, your computer asks a resolver "what's the IP for this?", gets back something like `104.21.42.7`, and connects. All in milliseconds, all invisible.

## The Hierarchy

DNS is not one database. It's a hierarchy of servers, each responsible for a slice of the namespace.

- **Root servers** — 13 logical root server clusters worldwide. They know who's responsible for `.com`, `.org`, `.life`, and every other top-level domain.
- **TLD servers** — one set per top-level domain. They know who's responsible for `jao.life`, `example.com`, and so on.
- **Authoritative servers** — the nameservers for a specific domain. They hold the actual records: A, AAAA, MX, TXT, and more.
- **Recursive resolvers** — the servers your computer actually talks to. They walk the hierarchy on your behalf and cache the results.

When you load a page, your resolver does the walking. You just see the page.

## The Resolution Process

Here's what happens when you type `jao.life` into a browser for the first time:

1. Your OS checks its local cache. Nothing.
2. Your OS asks the configured resolver (often your ISP's, or `1.1.1.1`, or `8.8.8.8`).
3. The resolver checks its cache. Nothing.
4. The resolver asks a **root server**: "who handles `.life`?"
5. The root server replies with the address of the `.life` TLD servers.
6. The resolver asks a **TLD server**: "who handles `jao.life`?"
7. The TLD server replies with the address of the domain's authoritative nameservers.
8. The resolver asks the **authoritative server**: "what's the A record for `jao.life`?"
9. The authoritative server returns the IP.
10. The resolver caches the answer and returns it.
11. Your browser connects to that IP.

On subsequent lookups, the resolver serves from cache. That's why DNS feels instant most of the time.

> Every first lookup walks a tree from the root down. Every subsequent lookup is a cache hit. That's the entire design.

## Record Types

DNS stores more than just IP addresses. Different record types serve different purposes.

| Type | Purpose |
|---|---|
| **A** | IPv4 address |
| **AAAA** | IPv6 address |
| **CNAME** | Alias to another name |
| **MX** | Mail server |
| **TXT** | Arbitrary text — used for SPF, DKIM, verification |
| **NS** | Nameserver for the domain |
| **SOA** | Start of authority — zone metadata |
| **SRV** | Service location |
| **CAA** | Which CAs may issue certs for this domain |
| **PTR** | Reverse lookup — IP to name |

Each type has its own TTL, its own cache lifetime, and its own quirks.

## TTL and Propagation

Every DNS record has a **TTL** (time to live) — how long resolvers may cache it. Typical values are 300 seconds (5 minutes) to 86400 seconds (1 day).

When you change a record, the old value stays cached until the TTL expires. That's why "DNS propagation" takes time. Nothing is actually propagating — every resolver is just waiting out its cache.

If you're planning a change, lower the TTL a day beforehand. Then the change takes effect quickly. After confirming, raise it again.

## DNS Caching Layers

DNS answers get cached at multiple levels:

- **Browser cache** — Chrome, Firefox, Safari each keep their own.
- **OS cache** — system-level resolver cache.
- **Router cache** — some home routers cache.
- **ISP resolver cache** — the big one.
- **Authoritative server cache** — usually minimal.

Each layer has its own TTL handling. This is why `dig` might return a different answer than your browser, and why clearing one cache doesn't always fix the problem.

## Public Resolvers

Your ISP usually provides a resolver, but you don't have to use it.

- **Cloudflare (1.1.1.1)** — fast, privacy-focused, no logging of personal data.
- **Google (8.8.8.8)** — fast, well-distributed, logs some data.
- **Quad9 (9.9.9.9)** — blocks known malicious domains.
- **OpenDNS** — filtering options for families and businesses.
- **NextDNS** — configurable, ad-blocking, parental controls.

Switching resolvers changes which answers you get, how fast you get them, and who sees your browsing pattern.

## DoH and DoT

Traditional DNS is **plaintext UDP on port 53**. Anyone on the path — your ISP, a coffee shop router, a hostile network — can see every domain you look up.

Two protocols fix that:

- **DoH (DNS over HTTPS)** — DNS wrapped in HTTPS. Looks like normal web traffic. Used by Firefox, Chrome, and increasingly by default.
- **DoT (DNS over TLS)** — DNS wrapped in TLS on a dedicated port. Used by Android and system-level resolvers.

Both encrypt the query so intermediaries can't read it. Both have critics — network operators who relied on DNS for monitoring and filtering. The trade-off is privacy vs. visibility, and the modern web is choosing privacy.

## DNS Attacks

DNS is a target because it's a single point of failure and a common trust anchor.

- **DNS spoofing / cache poisoning** — injecting false records into a resolver's cache.
- **DNS hijacking** — taking over a domain's nameservers to redirect traffic.
- **DDoS on DNS** — overwhelming resolvers with traffic, taking down all dependent services.
- **DNS tunneling** — using DNS queries to exfiltrate data past firewalls.
- **Typosquatting** — registering domains that look like legitimate ones.
- **Domain fronting** — hiding real destinations behind legitimate CDNs.

The **DNSSEC** extension adds cryptographic signatures to DNS records, so resolvers can verify authenticity. Adoption is slow but growing.

## Why DNS Matters More Than It Seems

DNS isn't just a lookup service. It's:

- The first step in every web request.
- A tool for ad blocking and content filtering.
- A privacy surface — every domain you visit is visible to whoever runs your resolver.
- A resilience surface — if DNS fails, everything fails.
- A censorship tool — ISPs and governments can block domains at the resolver level.

Who controls DNS controls what you can reach. That's why resolver choice matters far more than most people realize.

## The Honest Summary

DNS is:

- The internet's naming system, hierarchical and cached
- Fast because of caching, slow to change because of caching
- Invisible when working, catastrophic when broken
- Increasingly encrypted and privacy-protected
- A critical trust layer that everything else depends on

It was designed in 1983 as a simple phonebook. It's now one of the most consequential pieces of infrastructure on the planet — and almost nobody thinks about it until something goes wrong.

> DNS is the layer everyone forgets until it breaks. And when it breaks, nothing works — not email, not websites, not anything that relies on names.

## Further Reading

- [RFC 1034, 1035 — The original DNS specification](https://www.rfc-editor.org/rfc/rfc1034)
- [Cloudflare Learning Center — What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/)
- [DNSViz — Visual DNS analysis](https://dnsviz.net/)
- [Quad9 — Privacy-focused DNS](https://www.quad9.net/)
