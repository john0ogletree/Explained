# Digital Signatures

A digital signature proves that a message came from a specific sender and hasn't been altered. It's the cryptographic equivalent of a handwritten signature, except it can't be forged, can't be copied, and can be verified by anyone.

You use them constantly. Every HTTPS connection, every software update, every signed git commit, every PDF contract with a lock icon — all rely on digital signatures. They're one of the quiet pillars of the modern internet.

## The Core Idea

A handwritten signature proves two things: who signed it, and that the document hasn't changed since. Digital signatures do the same, but with math instead of ink.

- **Authenticity** — only the holder of the private key could have signed.
- **Integrity** — any change to the message invalidates the signature.
- **Non-repudiation** — the signer can't later deny having signed.

That third property is what separates digital signatures from message authentication codes. A MAC can be forged by anyone who shares the key. A signature can only come from one person.

## How It Works

The process uses **asymmetric cryptography** — a keypair with a public and private half.

1. The signer hashes the message. This produces a fixed-size digest.
2. They encrypt that digest with their **private key**.
3. The encrypted digest is the signature. It's attached to the message.
4. Anyone with the **public key** can decrypt the signature, getting back the digest.
5. They hash the message themselves and compare.
6. If the hashes match, the message is authentic and unmodified.

The message itself is never encrypted. Signing doesn't hide content — it proves origin and integrity.

> Signing is not encrypting. One proves where a message came from. The other hides what it says. You often want both, and they're separate operations.

## Why Hash First

You don't sign the message. You sign a **hash** of the message.

That's because signing is expensive and the message can be any size. Hashing compresses it to a fixed length — 256 bits for SHA-256 — and sign the small digest instead.

Two properties matter for the hash:

- **Collision resistance** — no two different messages should produce the same hash.
- **Preimage resistance** — you can't work backward from a hash to a message.

If either fails, the signature scheme is broken. This is why MD5 and SHA-1 are deprecated for signing. Both have known collisions.

## Common Algorithms

- **RSA-PSS** — the classic, based on factoring large numbers. Still widely used, but slow and key-heavy.
- **ECDSA** — elliptic curve, much smaller keys, faster. Used in Bitcoin, TLS, and most modern systems.
- **EdDSA (Ed25519)** — a specific curve with deterministic, fast, side-channel-resistant signing. Now the modern default.
- **DSA** — historic, mostly deprecated.
- **Schnorr** — used in Bitcoin Taproot and modern zero-knowledge systems.

For new work in 2026, Ed25519 is usually the right answer. RSA remains common in legacy systems where compatibility matters.

## What Digital Signatures Guarantee

- The message came from someone holding the matching private key.
- The message hasn't been modified since it was signed.
- The signer can't deny having signed it.

## What They Don't Guarantee

- **That the signer is who you think.** A signature proves a key was used, not a person.
- **That the message is true.** A signed lie is still a lie.
- **That the signing happened at a specific time.** Unless timestamped separately.
- **That the private key wasn't stolen.** If someone steals your key, they sign as you.
- **That the public key belongs to the right person.** That requires certificates or another trust layer.

That last point is why **PKI** — public key infrastructure — exists. A signature is meaningless if you don't know whose key you're verifying against.

## Certificates and Trust

In practice, digital signatures rarely stand alone. They're wrapped in a certificate that binds a public key to an identity.

- A **Certificate Authority** signs the certificate with its own key.
- Your browser or OS trusts a small list of root CAs.
- The chain goes: root → intermediate → leaf.
- When you connect to a website, its certificate is verified against that chain.

That's what the padlock in your browser means. Not "this site is safe" — just "this site's key was vouched for by someone your computer already trusts."

> A certificate doesn't prove a site is honest. It proves the site is who it claims to be, cryptographically. What they do after that is up to them.

## Where You'll See Them

- **HTTPS/TLS** — every secure connection
- **Code signing** — operating systems verify that apps come from the developer
- **Email (S/MIME, PGP)** — signed messages prove origin
- **Git commits** — signed commits show verified authorship
- **PDFs and contracts** — legal documents with cryptographic seals
- **Software updates** — package managers verify signatures before installing
- **Blockchains** — every transaction is signed by the sender's private key
- **Passkeys** — authentication is a signature challenge
- **JWT tokens** — API authentication often uses signed tokens

## Signing vs. Encrypting vs. Hashing

These three are often confused. They solve different problems.

| Operation | Purpose | Reversible? |
|---|---|---|
| **Hashing** | Integrity check | No |
| **Signing** | Authenticity + integrity | No |
| **Encrypting** | Confidentiality | Yes, with key |

Signing and encrypting are independent. You can sign without encrypting (a public announcement), encrypt without signing (a secret message from an unknown sender), do both (a signed, encrypted email), or neither (ordinary traffic).

## Real-World Attacks

Digital signatures are mathematically strong. The breaks come from implementation and key management.

- **Weak randomness in ECDSA** — reusing the same nonce across two signatures leaks the private key. This has happened in real systems, including some early Bitcoin wallets.
- **Hash collisions** — MD5 and SHA-1 collisions have been used to forge certificates.
- **Stolen private keys** — if the key is compromised, signatures are worthless.
- **Fake certificate authorities** — a compromised CA can issue certificates for any domain.
- **Downgrade attacks** — forcing a system to accept a weaker algorithm.

The math is fine. The surrounding ecosystem is where things go wrong.

## The Honest Summary

Digital signatures are:

- A way to prove who sent a message and that it wasn't changed
- Built from asymmetric cryptography and hash functions
- Ubiquitous and mostly invisible
- Only as strong as the key management behind them
- A necessary layer for almost everything secure online

They don't tell you whether to trust someone. They tell you whether the message came from the key you think it did. Everything else is a policy question.

> A digital signature proves a key was used. Proving a person was behind it is a whole different problem — and usually the harder one.

## Further Reading

- [Digital Signatures — NIST](https://csrc.nist.gov/projects/digital-signatures)
- [Ed25519: high-speed high-security signatures — Bernstein et al.](https://ed25519.cr.yp.to/)
- [Let's Encrypt — How it works](https://letsencrypt.org/how-it-works/)
- [RFC 8032 — EdDSA](https://www.rfc-editor.org/rfc/rfc8032)
