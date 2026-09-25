# Bytes

A **byte** is eight bits. A **bit** is a single binary digit — a 0 or a 1. That's the entire foundation of computing. Everything else — text, images, videos, programs, protocols, encryption keys — is built from patterns of bits grouped into bytes.

It's a small topic that turns out to explain a lot: why file sizes are what they are, why character encoding is a mess, why some numbers lose precision, why colors look the way they do, and why "one kilobyte" means two different things depending on who you ask.

## Bits

A bit is the smallest unit of information. It has two possible states: 0 or 1. Physically, it might be a voltage, a magnetic charge, a pit in an optical disc, or the state of a transistor.

With one bit, you can represent two values: 0 or 1.
With two bits, four values: 00, 01, 10, 11.
With three bits, eight values.
With n bits, 2ⁿ values.

That exponential growth is why 8 bits gives you 256 values, 16 bits gives you 65,536, and 32 bits gives you over 4 billion.

## Bytes

A byte is eight bits, giving 256 possible values (0–255). It's the standard unit of addressable memory — most computers can't address individual bits, only bytes.

Why eight? Historical accident. Early computers used 6-bit, 7-bit, 9-bit, and 12-bit bytes. IBM's System/360 in the 1960s standardized on 8, and the rest of the industry followed.

A byte can hold:

- An integer from 0 to 255.
- A signed integer from −128 to 127.
- One ASCII character.
- Part of a Unicode character (UTF-8 uses 1–4 bytes per character).
- A single RGB color channel value.
- Any of 256 distinct states.

## Larger Units

Bytes stack up into larger units, each 1,000 or 1,024 times the previous.

| Unit | Decimal (SI) | Binary (IEC) |
|---|---|---|
| Kilobyte (KB) | 1,000 bytes | 1,024 bytes (KiB) |
| Megabyte (MB) | 1,000,000 bytes | 1,048,576 bytes (MiB) |
| Gigabyte (GB) | 1,000,000,000 bytes | 1,073,741,824 bytes (GiB) |
| Terabyte (TB) | 10¹² bytes | 2⁴⁰ bytes (TiB) |
| Petabyte (PB) | 10¹⁵ bytes | 2⁵⁰ bytes (PiB) |
| Exabyte (EB) | 10¹⁸ bytes | 2⁶⁰ bytes (EiB) |

That discrepancy — 1,000 vs. 1,024 — is why a "500 GB" SSD shows up as ~465 GB in your OS. Drive manufacturers use decimal. Operating systems traditionally use binary. Both are technically correct. Neither is going away.

> A kilobyte is 1,000 bytes if you're selling a hard drive, and 1,024 bytes if you're the operating system reading it. This has confused users for forty years and will continue to.

## How Numbers Are Stored

Bytes store numbers in different ways depending on the type.

- **Unsigned integer** — all bits are value. An 8-bit unsigned int goes 0–255.
- **Signed integer** — one bit is the sign. Two's complement is the standard. An 8-bit signed int goes −128 to 127.
- **Floating point** — for decimals. IEEE 754 defines the standard. A 32-bit float has ~7 decimal digits of precision. A 64-bit double has ~15.
- **Big-endian vs. little-endian** — the order in which multi-byte numbers are stored. Intel is little-endian. Network protocols are big-endian.

Floating point is why `0.1 + 0.2` doesn't equal `0.3` in most languages. The numbers can't be represented exactly in binary.

## How Text Is Stored

Text encoding is one of computing's messiest historical legacies.

- **ASCII** — 7 bits, 128 characters. English letters, digits, punctuation, control codes. Invented 1963.
- **Extended ASCII / Latin-1** — 8 bits, 256 characters. Added Western European accents.
- **UTF-8** — variable length, 1–4 bytes per character. Backward compatible with ASCII. Now the dominant encoding on the web.
- **UTF-16** — 2 or 4 bytes per character. Used internally by Java, JavaScript, Windows.
- **UTF-32** — 4 bytes per character, always. Simple but wasteful.

UTF-8 is brilliant because the first 128 characters are byte-identical to ASCII. An ASCII file *is* a valid UTF-8 file. This made the transition painless.

The mojibake you see when text is decoded wrong — `â€œ` instead of `"` — is UTF-8 bytes being read as Latin-1.

## How Images Are Stored

A pixel is typically stored as three or four bytes.

- **RGB** — 3 bytes per pixel. Red, green, blue, each 0–255.
- **RGBA** — 4 bytes per pixel. Adds alpha (transparency).
- **HSV / HSL** — alternative color models, still 3 bytes.
- **Indexed color** — 1 byte per pixel, looking up a 256-entry palette.

A 1920×1080 RGB image is 1920 × 1080 × 3 = ~6.2 MB uncompressed. PNG and JPEG compress this dramatically, but the raw representation is straightforward.

## How Audio Is Stored

Audio is a sequence of samples — measurements of air pressure taken at fixed intervals.

- **Sample rate** — how many samples per second. CD quality is 44,100 Hz.
- **Bit depth** — how many bits per sample. CD quality is 16 bits.
- **Channels** — mono (1), stereo (2), surround (6+).

One second of CD-quality stereo audio:
44100 samples × 2 bytes × 2 channels = 176,400 bytes per second, or roughly 10 MB per minute.

That's why MP3 and AAC exist. They exploit perceptual limits to discard data you won't notice.

## How Video Is Stored

Video is a sequence of images plus audio, with heavy compression.

- **Frame rate** — 24, 30, 60 frames per second.
- **Resolution** — 1920×1080 (1080p), 3840×2160 (4K).
- **Bitrate** — how much data per second. Ranges from 1 Mbps to 100+ Mbps.

One second of uncompressed 1080p at 30fps in RGB is about 186 MB. Compressed to H.264 at a reasonable bitrate, it's about 2 MB. That's a 100x reduction, and it's why streaming video exists at all.

## Storage Sizes in Perspective

Some numbers to give a sense of scale:

- **This article** — about 8 KB.
- **A single tweet** — up to 280 characters, roughly 280 bytes.
- **A 3-minute MP3 song** — ~3 MB.
- **A 12 MP JPEG photo** — ~3 MB.
- **A 4-minute 1080p video** — ~50 MB.
- **A 2-hour 4K movie** — ~15 GB.
- **A modern AAA game** — 50–150 GB.
- **The entire English Wikipedia** — ~20 GB compressed.
- **The Library of Congress** — ~20 PB.
- **All data generated by humanity daily** — ~400 EB.

## What Bytes Are Good At

- Being the smallest addressable unit of memory
- Holding one of 256 values
- Encoding almost any digital information
- Being the standard unit for file sizes and network traffic
- Serving as the bridge between bits and everything higher

## What Bytes Are Bad At

- Holding Unicode characters directly (variable length)
- Storing precise decimals (floating point errors)
- Representing large numbers (need to combine many)
- Carrying meaning without context (a byte is just a byte)

## The Honest Summary

Bytes are:

- Eight bits grouped together
- 256 possible states
- The standard unit of memory, storage, and network traffic
- The building block for everything from text to video
- Prone to historical inconsistencies (1,000 vs. 1,024)
- Utterly mundane and utterly foundational

Every image, song, message, and video game you've ever experienced is, at the lowest level, an enormous sequence of bytes. That's the whole trick.

> A byte is eight bits. That's all it is. Everything else — every song, every movie, every program, every website — is just bytes, interpreted differently.

## Further Reading

- [Code: The Hidden Language of Computer Hardware and Software — Charles Petzold](https://www.charlespetzold.com/code/)
- [UTF-8 Everywhere](https://utf8everywhere.org/)
- [What Every Computer Scientist Should Know About Floating-Point Arithmetic — David Goldberg](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html)
- [The Absolute Minimum Every Software Developer Must Know About Unicode — Joel Spolsky](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)
