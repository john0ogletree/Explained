---
tags: [software, architecture, privacy]
---

# Local-First Software

The phrase "local-first" describes a way of building applications where the primary copy of your data lives on **your device**, not on a company's server. It's a direct response to the dominant model of the last fifteen years, where almost everything you create in a web app is stored on "someone else's computer."

In a local-first app, the local copy is the source of truth. The network becomes an enhancement, not a requirement.

## The Problem with Cloud-First

Cloud apps brought us collaboration and cross-device access, but they introduced a trade-off. Your data is held on a server you don't control, and you can only access it as long as the service exists and the network works.

This creates several practical problems:
- **Latency.** Every action waits for a server round-trip, which makes the app feel slow.
- **Connectivity dependency.** Lose the internet, lose the app.
- **Ownership ambiguity.** The provider effectively controls your data. If the service shuts down, your work may become inaccessible.
- **Privacy concerns.** Your data sits on infrastructure you have no visibility into.

> "There is no cloud, it's just someone else's computer." — a common saying in the local-first community [citation:13].

## What Local-First Changes

Local-first software flips the architecture. The local device becomes the authority. Sync happens in the background when possible, but the app works fully offline.

This is often framed as a set of "ideals," though most real apps only achieve some of them [citation:4][citation:13]:

- **No spinners.** The app responds instantly because it reads from local storage.
- **Offline by default.** Connectivity becomes optional, not required.
- **Multi-device sync.** When you're online, changes propagate across your devices.
- **Real-time collaboration.** Multiple people can edit the same data without a central bottleneck.
- **Data ownership.** You control the files and can back them up, delete them, or take them elsewhere.

## How It Actually Works

Local-first relies on a few key technologies working together. The hard part is not storing data locally—it's making sure two copies of that data stay consistent when they've both been edited independently.

### Conflict-Free Replicated Data Types (CRDTs)

**CRDTs** are data structures designed to merge changes from different replicas automatically, without a central coordinator. If two people edit the same document offline, a CRDT can combine both changes deterministically [citation:4][citation:11].

There are different flavors:
- **Document-based CRDTs** (like Yjs and Automerge) model data as rich documents [citation:11].
- **Relational partial-sync engines** (like PowerSync and ElectricSQL) use a relational model and sync only what's needed [citation:11].

### Sync Engines

A **sync engine** sits on top of CRDTs and storage. It handles the protocol for exchanging changes, resolving conflicts, and applying them to the local database [citation:11].

Examples include **Yjs**, **Automerge**, **PowerSync**, and **ElectricSQL** [citation:11].

## The Trade-Offs

Local-first is not free. Moving authority to the client introduces real complexity.

- **Conflict resolution is hard.** CRDTs solve the math, but designing the data model correctly still takes care.
- **Security gets trickier.** Access control and validation now happen on devices you don't fully control [citation:17].
- **Coordination is still needed.** For shared datasets, complex business rules, or integrations with external services, some server-side logic is usually unavoidable [citation:17].
- **The ecosystem is still maturing.** Tooling and best practices are improving, but they're not as settled as the cloud-first world.

> Local-first is not a final answer. It's a different set of trade-offs, favoring responsiveness and ownership over the convenience of a central authority [citation:17].

## Why It Matters

The local-first movement is as much about **user agency** as it is about architecture. When your data lives on your machine, you can back it up, move it, and keep using the software even if the original developer disappears [citation:7][citation:10].

It's a return to some of the properties of old-fashioned desktop software—files you own, apps that work without a connection—without giving up the collaboration that made the cloud so compelling [citation:13].

## Further Reading

- [Local-First Software (Ink & Switch)](https://www.inkandswitch.com/local-first/)
- [The Seven Ideals of Local-First Software](https://www.inkandswitch.com/local-first/static/local-first.pdf)
- [Yjs — CRDT framework](https://yjs.dev/)
- [Automerge — CRDT library](https://automerge.org/)
