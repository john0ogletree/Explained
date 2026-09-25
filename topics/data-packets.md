# Data Packets

Every byte you send across the internet is broken into small chunks called **packets**. Each packet travels independently, may take a different path than its neighbors, and is reassembled at the destination. That's the fundamental design of the internet.

It sounds fragile. In practice, it's the single most resilient networking decision ever made. It's why the internet survived nuclear war planning, why it scales to billions of devices, and why no single cable cut can take it down.

Understanding packets explains everything about networking that seems strange: latency, jitter, packet loss, why video calls stutter, why file transfers are slower than they should be, and why "the internet is down" almost never means what people think.

## Why Packets, Not Streams

The early telephone network used **circuit switching**: a dedicated physical path between two callers, held open for the entire conversation. It worked fine for voice. It was terrible for data.

Circuit switching wastes capacity. If you're sending a file, you don't need a dedicated line for the entire duration. You need short bursts of transmission with gaps in between. A dedicated line during those gaps is wasted.

**Packet switching** fixes that. Break data into chunks, route each chunk independently, share the network with everyone else. No reservations, no wasted capacity.

The trade-off is that packets can arrive out of order, late, or not at all. That's the price of efficiency. The protocols above handle it.

> Circuit switching gives you a private road. Packet switching gives everyone a shared highway. The highway is faster for almost everything.

## What's in a Packet

A packet has two parts:

- **Header** — where it's going, where it came from, how it fits with other packets.
- **Payload** — the actual data.

The header is a stack of nested headers, one per layer:

- **Ethernet header** — source and destination MAC addresses.
- **IP header** — source and destination IP addresses, TTL, protocol.
- **TCP or UDP header** — ports, sequence numbers, flags.
- **Application data** — the actual HTTP request, DNS query, or whatever else.

Each layer adds its own header and hands the whole thing down. The receiving side unwraps them in reverse.

## MTU and Fragmentation

Every network link has a maximum packet size — the **MTU** (Maximum Transmission Unit). Ethernet's default is **1500 bytes**.

If an application sends more than fits, the packet must be split. This is **fragmentation**, and it's the source of a lot of subtle bugs.

- **IPv4** — routers can fragment packets in flight.
- **IPv6** — routers do not fragment; the sender must determine the path MTU.

Modern practice is **path MTU discovery**: send packets with the "don't fragment" bit set, see how large a packet can pass, adjust accordingly. When this fails, you get the classic "some sites load, some don't" symptom.

## TCP: Reliability on Top of Chaos

Packets don't guarantee anything. They can be lost, duplicated, reordered, or delayed. **TCP** (Transmission Control Protocol) turns this unreliable stream into a reliable one.

How it works:

- Every byte is numbered with a **sequence number**.
- The receiver acknowledges what it's received with **ACKs**.
- If an ACK doesn't arrive in time, the sender retransmits.
- Out-of-order packets are buffered until the gap is filled.
- Flow control prevents overwhelming the receiver.
- Congestion control prevents overwhelming the network.

The result: an application sees a reliable, ordered byte stream. TCP handles the mess underneath.

## UDP: Speed Over Reliability

**UDP** (User Datagram Protocol) is TCP's minimalist sibling. It sends packets and doesn't care what happens next.

- No handshake.
- No acknowledgments.
- No retransmission.
- No ordering.
- No congestion control.

That sounds useless. It isn't. UDP is right when:

- **Latency matters more than reliability.** Live video, voice calls, games.
- **The application handles reliability itself.** QUIC, DNS.
- **You're doing broadcast or multicast.** One-to-many.
- **You want raw speed.** No protocol overhead.

A dropped frame in a video call isn't worth retransmitting — by the time it arrives, it's obsolete. TCP would stall everything waiting for it. UDP just moves on.

## TCP vs. UDP

| | TCP | UDP |
|---|---|---|
| Connection | Yes | No |
| Ordering | Guaranteed | Not guaranteed |
| Reliability | Guaranteed | Best-effort |
| Speed | Slower | Faster |
| Header size | 20+ bytes | 8 bytes |
| Use cases | Web, email, file transfer | Video, voice, games, DNS |

Modern protocols increasingly use UDP for things that used to require TCP. **QUIC** — the basis of HTTP/3 — uses UDP but implements reliability, congestion control, and encryption at the application layer. It gets the best of both.

## Packet Loss

Loss happens. Networks drop packets when:

- **Congestion** — queues overflow on a busy link.
- **Errors** — physical corruption on Wi-Fi or cellular.
- **Deliberate drops** — some firewalls and QoS systems drop by policy.
- **Routing changes** — a path disappears mid-flight.

TCP reacts by retransmitting and slowing down. UDP just loses the data. Applications choose which behavior they want.

On a normal wired connection, loss is under 0.1%. On Wi-Fi, it can hit 1–5%. On mobile networks, worse. This is why video calls are perfect on Ethernet and stutter on a train.

## Latency, Jitter, and Throughput

Three different measurements, often confused.

- **Latency** — how long a single packet takes to travel. Measured in milliseconds.
- **Jitter** — how much latency varies between packets. Matters for real-time traffic.
- **Throughput** — how much data moves per second. Measured in Mbps or Gbps.
- **Bandwidth** — the theoretical maximum throughput.

A connection with high bandwidth and high latency feels slow for interactive use but fine for downloads. A connection with low bandwidth and low latency feels snappy for chat but can't stream video. Jitter is what makes voice calls robotic.

## The Path a Packet Takes

Packets don't follow a fixed path. Each router decides independently where to send them next, based on its own routing table.

Two packets sent a millisecond apart may take completely different routes. One might go through Frankfurt, the other through Amsterdam. They'll usually arrive within milliseconds of each other, but not always.

This is why:

- **Traceroute** shows different routes on different runs.
- **Packet reordering** happens even on stable networks.
- **A path failure** doesn't kill the connection — packets reroute.
- **Geographic assumptions** about servers don't always hold.

The internet routes around damage by design. It also routes around congestion, maintenance, and politics.

## Packet Sniffing and Privacy

Anyone on the path can see packet headers. With unencrypted traffic, they can see everything.

- **On your local network** — Wi-Fi, Ethernet, anyone on the same segment.
- **At your ISP** — every packet passes through their routers.
- **At transit providers** — Tier 1 networks carry traffic between ISPs.
- **At the destination network** — obviously.

HTTPS encrypts the payload, so intermediaries see only destination IPs and ports. That's still a lot of metadata — which sites you visit, when, and for how long.

**VPNs** wrap the entire packet inside another packet, so intermediaries see only the VPN's IP. The VPN provider, however, sees everything.

## The Honest Summary

Packets are:

- Small chunks of data with headers
- Routed independently, arriving out of order or not at all
- Reassembled by TCP when reliability matters
- Ignored by UDP when speed matters
- The fundamental unit of the entire internet
- Invisible to users, essential to how everything works

The whole internet is built on top of a system that doesn't guarantee delivery, doesn't preserve order, and doesn't care if packets get lost. Everything reliable about the internet is layered on top of something fundamentally unreliable.

> The internet is fast because it doesn't promise anything. TCP is reliable because it promises everything. Most of networking is choosing which one you want where.

## Further Reading

- [Computer Networking: A Top-Down Approach — Kurose & Ross](https://www.pearson.com/en-us/subject-catalog/p/computer-networking/P200000003334)
- [RFC 791 — Internet Protocol](https://www.rfc-editor.org/rfc/rfc791)
- [RFC 9293 — TCP](https://www.rfc-editor.org/rfc/rfc9293)
- [Wireshark — Packet analysis tool](https://www.wireshark.org/)
