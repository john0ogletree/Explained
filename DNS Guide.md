# Introduction to DNS

**DNS** (Domain Name System) is the hierarchical and decentralized naming system used to translate human-readable domain names (like `explained.jao.life`) into numerical **IP addresses** (like `192.0.2.1` or `2001:db8::1`) required by networking protocols to locate and route data.

---

## 1. How DNS Resolution Works (Step-by-Step)

When you type a URL into your browser, a multi-step lookup occurs:

```text
[ Browser ] ──► [ Local Cache / OS ] ──► [ Recursive Resolver (e.g. 1.1.1.1) ]
                                                        │
         ┌──────────────────────────────────────────────┴──────────────────────────────┐
         ▼                                              ▼                              ▼
[ 1. Root Server (.) ]              [ 2. TLD Server (.life) ]     [ 3. Authoritative Server ]
 (Returns TLD server IP)              (Returns Authoritative IP)   (Returns final IP address)
```

1. **Browser / OS Cache:** Checks if the domain IP is already cached locally.
2. **Recursive Resolver:** If not cached, the query is sent to your ISP or public DNS provider (e.g., Cloudflare `1.1.1.1` or Google `8.8.8.8`).
3. **Root Nameserver (`.`):** Directs the resolver to the appropriate Top-Level Domain (TLD) server (e.g., `.com`, `.org`, `.life`).
4. **TLD Nameserver:** Directs the resolver to the domain's Authoritative Nameserver.
5. **Authoritative Nameserver:** Holds the official record for the requested domain and returns the destination IP back to the resolver.

---

## 2. Common DNS Record Types

| Record Type | Purpose | Example / Value |
| :--- | :--- | :--- |
| **A** | Maps a domain to an IPv4 address | `192.0.2.1` |
| **AAAA** | Maps a domain to an IPv6 address | `2001:db8::1` |
| **CNAME** | Aliases one domain name to another (Canonical Name) | `app.example.com` ➔ `example.com` |
| **MX** | Specifies email servers responsible for receiving mail | `10 mail.example.com` |
| **TXT** | Stores arbitrary text data (used for SPF, DKIM verification) | `v=spf1 include:_spf.google.com ~all` |
| **NS** | Delegates a DNS zone to specific Authoritative Nameservers | `ns1.cloudflare.com` |
| **PTR** | Reverse lookup: maps an IP address back to a domain name | `1.2.0.192.in-addr.arpa` |

---

## 3. Key Concepts

* **TTL (Time to Live):** An expiration setting (in seconds) that tells resolvers how long to cache a record before requesting a fresh copy.
* **Propagation:** The time required for DNS changes to spread globally across recursive resolvers across the internet.
* **DNS Caching:** Storing lookup results at multiple layers (Browser ➔ OS ➔ Router ➔ ISP Resolver) to reduce latency and bandwidth usage.

---

## 4. Modern Encrypted DNS Protocols

Traditional DNS operates over unencrypted UDP on **Port 53**, making it susceptible to eavesdropping, spoofing, and ISP hijacking.

* **DoH (DNS over HTTPS):** Encrypts DNS queries inside standard HTTPS traffic on **Port 443**, masking DNS lookups as regular web traffic.
* **DoT (DNS over TLS):** Encrypts DNS queries using TLS protocol on a dedicated port (**Port 853**).
* **DNSSEC (DNS Security Extensions):** Adds cryptographic signatures to DNS records to verify authenticity and prevent DNS spoofing (cache poisoning).