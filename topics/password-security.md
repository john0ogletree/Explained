# Password Security

Passwords are the oldest authentication method still in widespread use, and they're also the weakest. The average person has around 100 online accounts. Nobody can memorize 100 unique strong passwords, so most people don't — they reuse a handful, pick memorable patterns, and hope for the best.

That approach worked when attackers had to guess manually. It doesn't work now.

## How Passwords Actually Get Broken

Most people imagine a hacker typing guesses into a login form. That's almost never what happens. Real attacks look like this:

- **Credential stuffing** — using passwords leaked from one site to break into another, because people reuse them.
- **Brute force** — trying every combination, often offline, against a stolen password hash.
- **Dictionary attacks** — trying common words, names, and known leaked passwords first.
- **Rainbow tables** — precomputed hash lookups that defeat unsalted storage.
- **Phishing** — tricking you into typing your password into a fake login page.
- **Keyloggers** — malware that records everything you type.
- **Password spray** — trying a few common passwords against many accounts to avoid lockouts.

Notice that half of those don't involve guessing at all. They involve the password being **reused**, **phished**, or **stored badly**.

## What Makes a Password Strong

The common advice — "add a symbol, capitalize something, use eight characters" — is outdated. What actually matters:

1. **Length** — every extra character multiplies the search space. A 20-character passphrase beats an 8-character symbol soup.
2. **Uniqueness** — never reused across sites. One leak shouldn't cascade.
3. **Unpredictability** — not a dictionary word, not a name, not a pattern like `Summer2024!`.
4. **Randomness** — generated, not invented. Humans are terrible at random.

> "Correct horse battery staple" is stronger than `Tr0ub4dor&3` because it's longer and harder to brute-force, even though it's easier to remember.

## The Only Real Solution: A Password Manager

You cannot do this in your head. Use a password manager.

A good manager:
- Generates long, random passwords for every site
- Remembers all of them so you don't have to
- Autofills credentials, which also protects against phishing
- Syncs across devices with end-to-end encryption
- Warns you about reused or breached passwords

Recommended options:
- **Bitwarden** — open source, free tier, self-hostable
- **1Password** — polished, paid, strong family features
- **KeePassXC** — offline, file-based, maximum control
- **Proton Pass** — integrated with Proton's privacy suite

Avoid browser-only password storage if you care about portability. It works, but it ties you to one ecosystem.

## The Master Password

A password manager is only as strong as its master password. That's the one password you actually have to remember.

Make it:
- **Long** — four to six random words is ideal
- **Unique** — never used anywhere else
- **Memorable** — you'll type it often
- **Written down once** — on paper, stored somewhere physically safe, for emergencies

This is the one place where a passphrase beats a random string. You need to remember it, so make it long but meaningful to you.

> The master password is the key to everything. If you lose it, you lose access. If someone gets it, they get everything.

## Two-Factor Authentication

Even a perfect password can be stolen. That's why **2FA** exists — a second factor that proves it's really you.

From weakest to strongest:

- **SMS codes** — better than nothing, but vulnerable to SIM swapping
- **Email codes** — similar weaknesses
- **Authenticator apps** (TOTP) — much better, offline, app-based
- **Hardware keys** (YubiKey, etc.) — phishing-resistant, gold standard
- **Passkeys** — the emerging future, no password at all

Enable 2FA on every account that supports it. Start with email, banking, and your password manager itself.

## Passkeys: The Actual Future

A **passkey** replaces the password entirely. Instead of a shared secret, your device holds a private key and the site holds the public key. Authentication happens through a cryptographic challenge.

Why passkeys are better:
- Nothing to phish — there's no password to steal
- Nothing to reuse — each site gets a unique keypair
- Nothing to remember — your device handles it
- Bound to the site's origin — can't be tricked into working on a fake domain

They're supported by Apple, Google, Microsoft, and a growing list of sites. Within a few years, they'll likely replace passwords for most consumer services.

## Common Mistakes

- **Reusing passwords** — the single biggest risk
- **Using personal info** — birthdays, pet names, and addresses are guessable
- **Storing passwords in plaintext** — notebooks, spreadsheets, unencrypted notes
- **Sharing passwords** — even with people you trust
- **Ignoring breach notifications** — change the password immediately
- **Relying on "security questions"** — often weaker than the password they protect
- **Skipping 2FA because it's annoying** — the minor friction is the point

## The Honest Summary

Passwords aren't going away overnight, but the way you use them should change today.

1. Get a password manager.
2. Generate a unique password for every site.
3. Use a long passphrase for the master password.
4. Turn on 2FA everywhere it's offered.
5. Adopt passkeys as sites support them.
6. Check haveibeenpwned.com periodically and act on what you find.

Do those six things and you'll be more secure than 99% of internet users. Not because it's clever — because it's the baseline, and almost nobody runs it.

> The goal isn't a perfect password. It's making sure that one breach doesn't become ten.

## Further Reading

- [Have I Been Pwned](https://haveibeenpwned.com/)
- [Bitwarden](https://bitwarden.com/)
- [EFF — How to Enable Two-Factor Authentication](https://ssd.eff.org/module/how-to-enable-two-factor-authentication)
- [Passkeys.dev](https://passkeys.dev/)
