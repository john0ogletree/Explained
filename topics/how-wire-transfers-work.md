# How Wire Transfers Work

A wire transfer is a direct transfer of funds from one bank account to another. No card network, no merchant in the middle. Just two banks moving money between themselves on your behalf.

It's one of the oldest forms of electronic payment still in daily use, and it's still the standard for anything large, time-sensitive, or international. Buying a house. Paying a supplier overseas. Sending money to family in another country. Wires are the tool.

They're also slow, expensive, and irreversible. Understanding why explains a lot about the global financial system.

## The Basic Idea

You tell your bank to send money to someone else's account. Your bank debits your account and credits theirs — or, more precisely, instructs the receiving bank to credit their account, and settles up with that bank later.

That's the whole concept. Everything else is plumbing.

The plumbing exists because banks don't actually hold "your" money in a vault. They hold ledger entries. A wire is a message that says: *move this number from this account to that account*. The actual money — the reserves — moves separately, between central banks, usually later.

## Domestic Wires

Within a single country, wires run over a domestic settlement system.

- **United States** — Fedwire (run by the Federal Reserve) and CHIPS (run by a private consortium). Same-day, final, usually $25–$35 to send.
- **Eurozone** — TARGET2 and SEPA. SEPA transfers are often free or near-free within the EU.
- **UK** — Faster Payments, CHAPS. Faster Payments is free and near-instant for most amounts.
- **India** — RTGS and NEFT, both run by the RBI.
- **Australia** — NPP (New Payments Platform), real-time.

The US stands out for charging for something much of the rest of the developed world offers free.

## International Wires

Cross-border wires are more complex because two countries' banking systems have to talk to each other. They usually don't have a direct relationship, so the money passes through **correspondent banks** — banks that have accounts with each other in both countries.

A typical flow for a US→Europe transfer:

1. Your bank debits your account.
2. It sends a **SWIFT message** to a correspondent bank it trusts.
3. The correspondent bank forwards it to another correspondent in Europe.
4. That bank delivers the funds to the recipient's bank.
5. The recipient's bank credits the recipient's account.

Each hop may take a fee. The recipient may see less money than you sent. The whole thing can take 1–5 business days.

> An international wire is not one transaction. It's a chain of transactions, each leg with its own bank, its own fee, and its own risk.

## SWIFT: The Messaging Layer

**SWIFT** (Society for Worldwide Interbank Financial Telecommunication) is not a payment system. It's a **messaging network**.

It doesn't move money. It moves **instructions** — standardized messages that banks use to tell each other what to do. Founded in 1973, it now connects over 11,000 financial institutions in more than 200 countries.

Each bank has a **SWIFT/BIC code** — 8 or 11 characters that identify it. You'll see these on wire forms, alongside **IBAN** (for European accounts) or **routing numbers** (for US accounts).

- **BIC/SWIFT** — identifies the bank
- **IBAN** — identifies the specific account in many countries
- **Routing number** — identifies the bank in the US
- **Account number** — identifies the account

Get any of these wrong and the wire bounces, often with a fee attached.

## Why Wires Are Irreversible

Once a wire is sent, it's final. There's no chargeback, no reversal, no "oops" button.

This is by design. A wire is a **settlement** instruction, not a payment authorization. Once the receiving bank has credited the funds, those funds are the recipient's. Getting them back requires the recipient's cooperation, or a court order, or both.

That's why wire fraud is so devastating. If you wire money to a scammer, the money is gone. Banks will help you file a report, but they generally cannot reverse the transfer.

> A wire is the closest thing to handing someone cash across a counter. Once it's out of your hand, it's theirs.

## The Fees

A single international wire can involve 4–6 separate fees:

- **Sending fee** — your bank, typically $25–$50
- **Correspondent fees** — each intermediary, often $15–$30 per hop
- **Receiving fee** — the recipient's bank, often $10–$25
- **FX markup** — the hidden cost, often 2–4% of the total, baked into the exchange rate
- **Lifting fees** — if the recipient's bank won't release funds without a payment
- **Investigation fee** — if something goes wrong and you ask them to trace it

On a $500 transfer, it's not unusual for $50–$75 to disappear along the way. That's why fintechs like Wise and Revolut built entire businesses on cheaper alternatives.

## Alternatives That Actually Work

- **Wise** — uses local bank accounts to route transfers without SWIFT, typically 0.5–1% total cost
- **Revolut** — similar model, good for frequent senders
- **Remitly / WorldRemit** — focused on remittances, especially to emerging markets
- **Stablecoins** — USDC and similar, for those comfortable with crypto infrastructure
- **SEPA / FedNow** — for EU and US domestic transfers, now often free
- **Direct bank transfer (ACH)** — slower, cheaper, domestic-only

For a one-off international wire to buy a house, traditional wires still make sense. For sending $200 to a relative monthly, almost anything else is cheaper.

## When to Use a Wire

- **Real estate closings** — title companies usually require wires
- **Large international payments** — above a few thousand dollars
- **Time-sensitive settlements** — same-day requirements
- **High-value B2B transactions** — where finality matters
- **Anything requiring proof of settlement** — for legal or contractual reasons

For everything else, ask whether a cheaper option exists. Usually one does.

## The Honest Summary

Wire transfers are:

- Direct bank-to-bank transfers, no intermediary network
- Irreversible once settled
- Expensive, especially internationally
- Slow, especially across borders
- Still the standard for large or legally significant payments
- Increasingly replaceable by cheaper fintech alternatives for everyday use

> The wire system is not designed to be cheap or fast. It's designed to be **final**. That's what you're paying for.

## Further Reading

- [SWIFT — How it works](https://www.swift.com/about-us/discover-swift)
- [Fedwire — Federal Reserve](https://www.frbservices.org/financial-services/wires/index.html)
- [Wise — How transfers work](https://wise.com/us/blog/how-do-bank-transfers-work)
- [CFPB — Sending money abroad](https://www.consumerfinance.gov/consumer-tools/money-transfers/)
