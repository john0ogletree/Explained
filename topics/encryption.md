---
tags: [security, cryptography, privacy]
---

# Encryption

**Encryption** is the process of transforming readable data into an unreadable form so that only someone with the right key can turn it back. It's the single most important tool in digital privacy, and it's been quietly protecting your messages, purchases, and logins for decades.

The idea is ancient. The math is modern. The stakes are higher than they've ever been.

## The Basic Idea

Every encryption scheme has three parts:

- **Plaintext** — the original message.
- **Ciphertext** — the scrambled output.
- **Key** — the secret that unlocks the transformation.

If someone intercepts the ciphertext without the key, they get noise. With the key, they get the plaintext back. That's the entire premise.

> Encryption doesn't hide the fact that you're communicating. It hides what you're saying.

## Two Families: Symmetric and Asymmetric

Almost every modern system uses a mix of both.

### Symmetric encryption

The same key encrypts and decrypts. Fast, simple, and used for bulk data.

- **AES** (Advanced Encryption Standard) — the modern default. 128, 192, or 256-bit keys.
- **ChaCha20** — a stream cipher designed for speed on devices without hardware AES.

The hard part isn't the math. It's **key distribution** — how do two people agree on a secret without someone eavesdropping?

### Asymmetric encryption

Different keys for encryption and decryption. A **public key** encrypts; a **private key** decrypts.

- **RSA** — the classic, based on the difficulty of factoring large numbers.
- **ECC** (Elliptic Curve Cryptography) — smaller keys, same security. Used in TLS, Signal, and Bitcoin.

Asymmetric crypto is slower, so it's rarely used for bulk data. Instead, it's used to **exchange** a symmetric key, which then encrypts the actual payload.

> Public-key crypto didn't just solve key distribution. It made the modern internet possible.

## How HTTPS Uses Both

When you connect to a secure website, this is roughly what happens:

1. Your browser asks the server for its **certificate** (contains the public key).
2. It verifies the certificate against trusted **Certificate Authorities**.
3. Both sides perform a **key exchange** (often using ECDHE) to derive a shared secret.
4. That shared secret becomes a **symmetric session key**.
5. All subsequent traffic is encrypted with AES or ChaCha20.

Asymmetric crypto does the handshake. Symmetric crypto does the heavy lifting. This is called **hybrid encryption**, and almost every secure system uses it.

## Hashing Is Not Encryption

People mix these up constantly. They're different tools for different jobs.

- **Encryption** is reversible with the right key.
- **Hashing** is one-way. You can't "decrypt" a hash.
- **Hashing** verifies integrity; **encryption** protects confidentiality.

Common hashes: **SHA-256**, **SHA-3**, **BLAKE3**. Never use MD5 or SHA-1 for anything security-related.

## What Encryption Does and Doesn't Protect

| Protected | Not protected |
|---|---|
| Message contents | Who you're talking to |
| File contents at rest | When you sent it |
| Passwords in transit | Message size and timing |
| Session integrity | Metadata |

Metadata is the quiet leak. Even perfect encryption tells an observer that *something* happened between two parties at a specific time. That's often enough.

> Encryption protects the message. It doesn't protect the fact that a message exists.

## Where It Shows Up

You use encryption constantly, usually without noticing.

- **HTTPS** — every secure website visit
- **Signal / WhatsApp** — end-to-end encrypted messaging
- **Full-disk encryption** — FileVault, BitLocker, LUKS
- **Password managers** — encrypted vaults, often zero-knowledge
- **VPNs** — encrypted tunnels between you and a server
- **SSH** — encrypted remote access
- **Wireless** — WPA2/WPA3 on Wi-Fi

If any of these suddenly stopped working, most of daily life would grind to a halt.

## Common Mistakes

- **Rolling your own crypto.** Don't. Use vetted libraries.
- **Reusing IVs or nonces.** Catastrophic for AES-GCM and ChaCha20.
- **Using ECB mode.** It leaks patterns. Never use it.
- **Trusting "military-grade" as a marketing term.** It means nothing.
- **Confusing encoding with encryption.** Base64 is not encryption. It's just a different alphabet.
- **Forgetting about endpoints.** Encrypted in transit means nothing if the receiver's device is compromised.

## The Honest Summary

Encryption is:

- Mathematically sound for the problems it's designed to solve
- Constantly under political pressure to include backdoors
- Only as strong as its implementation and key management
- A necessary tool, never a complete solution

It won't make you anonymous. It won't protect you from a compromised endpoint. It won't stop metadata analysis. But without it, none of the privacy you take for granted would exist.

> Encryption is not a silver bullet. It's a foundation. Everything else is built on top.

## Further Reading

- [Cryptography I — Dan Boneh (Stanford)](https://www.coursera.org/learn/crypto)
- [Serious Cryptography — Jean-Philippe Aumasson](https://nostarch.com/seriouscrypto)
- [Signal Protocol specification](https://signal.org/docs/)
- [RFC 8446 — TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446)
