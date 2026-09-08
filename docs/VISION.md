# Vision: a finished conversation, not a coin

PegLab is not a dollar. KaChat is not a PC app. Kaspa is not a bank.

The job is still real: **two people agree on a number, then one of them gets paid, without the number turning into an FX trade, and without sending anyone to Circle to finish a Kaspa chat.**

This file is the product vision and the to-do for *everything around the chain*: phones, copy, postage, identity, law, ops, education, other apps. The chain is the court. It is not the product.

Related: [IDEA.md](IDEA.md) (what this lab is), [KACHAT.md](KACHAT.md) (chat + pay), [STABLES-GUIDE.md](STABLES-GUIDE.md) (capital and pegs), [MAINNET.md](MAINNET.md) (other-chain PoCs, funding, what mainnet would take). This file does not replace those. It says what “done” looks like for a human.

**TESTNET-10 LAB. NOT USD. DO NOT RAISE MONEY AGAINST tPEG.**

---

## 1. The scene that has to work

A client and a designer are already talking in **KaChat on their phones**.

1. Someone types a quote: twenty units for the logo, timeout 48 hours.
2. The other person taps **Pay**. The number on the button is the number they agreed. It does not move with KAS while they argue.
3. If they claim, the unit unlocks to them. If they ghost, the sender reclaims after the timeout.
4. Neither person opened a PC. Neither bought USDT on another chain. Neither was told “go get KAS dust first” as the first screen.
5. If the unit is a **KAS receipt**, the UI says it is locked sompi, not dollars. If a **named USD** exists later, that is a different asset with a named issuer. Today’s tPEG never appears as `$`.

If that scene fails, the covenant is trivia. If that scene works, invoices, tips, splits, chess stakes, and agent 402s are the same object in a different thread.

KaChat does **not** support PC. The PegLab site on a desktop is the teaching bench. Settlement happens in the pocket.

---

## 2. What is true today (so the vision is not a pitch)

| Layer | Today | Gap |
| --- | --- | --- |
| Conversation | KaChat E2E chat + native KAS pay on iOS and Android | Quote still dies when KAS moves |
| Desktop chat | None. This site says so. | Do not fake a web KaChat |
| Unit | PegLab tPEG: tiny TN10 pool, admin oracle, **will depeg** as USD | Must not be listed in KaChat 4.x as money |
| Lab UI | Local http://127.0.0.1:8765/ and public .club, KasWare or host-funded local wallet | Live on-chain series + indexer row still the next real step |
| Identity | KNS names; aliases are not uniqueness | Wallets must verify series/genesis, not the word “tPEG” |
| Postage | Every message and pay burns KAS mass | Receiver-with-zero-KAS is dead UX |
| Law | No issuer, no raise, no token sale | Saying “dollar” without reserves is the bug |
| Trust | WILL DEPEG banner, depeg lab, this copy | One removed banner and the project becomes a lie |

---

## 3. North star (beyond the blockchain)

**Kaspa dapps run on Kaspa rules.** Lock, timeout, redeem, split. People talk in a mobile messenger they already have. The unit in the pay button is either:

- **A. A KAS receipt** — one unit is one sompi locked in a covenant. Never called a dollar. Default.
- **B. A hosted USD** — Circle/Tether or another *named* issuer, freeze disclosed. PegLab is not that issuer.
- **C. Fake $1 tPEG** — this lab only. Public depeg. Never production money.

The blockchain records the court file. Everything else is how a person reaches that file without getting lost:

- **Surface:** phone first. PC is documentation and the depeg demo, not the chat.
- **Time:** quotes expire. Timeout reclaim is a product, not a contract Easter egg.
- **Postage:** KAS is the stamp. The user thinks in the unit. Sponsor or grams pay mass.
- **Language:** the number, the timeout, and the asset name in the language they already use in KaChat.
- **Honesty:** no `$` on a receipt. No “Open KaChat” on a PC. No raise against tPEG.
- **Privacy:** chat stays E2E. Settlement is public. Do not pretend otherwise.
- **Child / gifts:** receipts or KAS, never a “stable.”
- **Failure:** if pay fails, the thread still shows why (stale quote, missing postage, unknown series, timeout). Support is a sentence in the chat, not a Discord scavenger hunt.
- **Other apps:** games, agents, merchants reuse the same unit and the same timeout shape. KaChat is first, not exclusive.

When a real licensed dollar exists on Kaspa, this stack **hosts** it. It does not compete by printing a thinner copy.

---

## 4. Workstreams (everything that is not “write another covenant”)

### People and surfaces

- KaChat: iOS App Store `id6759102359`, Android Play `com.kachat.app`. Scheme `kachat://`.
- PegLab site: on PC, state that KaChat does not support PC. On phone, open the app if installed.
- QR / short URL so a desktop visitor can hand the page to a phone without typing the .club name.
- Do not build a fake web messenger and call it KaChat.
- Accessibility: large tap targets, contrast, VoiceOver/TalkBack on the pay button, not only the lab.
- Languages: follow KaChat’s locales for pay copy; PegLab lab can stay English until the unit is live.

### Conversation (the product)

- Quote in-thread: amount, asset id, timeout, who pays postage.
- Pay / claim / reclaim as chat actions, not a separate “DeFi” tab.
- Groups: split, tip, stake. Same court, more names.
- Bots: quote → 402 → pay. Human is not told to open a block explorer.
- Notifications: “they paid,” “timeout in 2h,” “reclaimed” — already in KaChat’s push world; extend types, do not invent a second notifier.

### Settlement (the court)

- Live TN10 series: genesis, mint, transfer, redeem accepted by the network.
- Wallets verify genesis outpoint + template hash + series bytes.
- Kill the admin USD oracle on any asset KaChat would show. Receipts do not need a dollar feed.
- Indexer row per address. If KaChat’s indexer cannot see UNIT UTXOs, the balance is a lie.
- Mainnet only for **receipt (A)** after audit-lite + KaChat review. Still not USD.

### Postage (the stamp)

- Sponsor-fee input on pay txs, or prepaid grams (WorkCredit / KIP-21 mass).
- UI never leads with “buy KAS to finish this dollar-shaped pay.”
- Dust policy: refuse, don’t strand.

### Identity and names

- Display KNS when present; pay the address.
- Aliases are not identity. Do not market a handle as uniqueness.
- Series name is a label. Authenticity is hashes.

### Trust and copy

- Keep WILL DEPEG on the lab forever.
- Asset picker: KAS | receipt | (later) named USD.
- Support macros: five failure sentences, translated.
- No in-app sale of tPEG. No points. No sister token.

### Legal and capital

- PegLab: $0 public raise. Testnet gifts are not investments.
- Settlement software: grant / self-fund / later SaaS — not a coin.
- Issuer path: a company with a bank, or do not say dollar. See [STABLES-GUIDE.md](STABLES-GUIDE.md).
- This is not legal advice. Payment stables are regulated money.

### Distribution

- Local lab and public .club stay in sync (`scripts/build-pages.mjs`).
- HTTPS on the public host when GitHub’s cert exists.
- KaChat store listings already exist; PegLab does not need its own app.
- Docs: IDEA, this file, KACHAT, STABLES-GUIDE, AUDIT-LITE, KNOWN-BREAKS.

### Operations

- Node / indexer URLs documented; failover is KaChat’s node pool, not a PegLab server.
- Incident: pause is a brake. Publish what pause does. Redeem stays open if backing remains.
- Keys: sponsor seed never in git, never on the public site, never in a screenshot.
- Host faucet: localhost only, `kaspatest:` only, 1 tKAS cap.

### Education (civic, not marketing)

- Depeg lab stays the first click: three prices disagree.
- Teach “redemption is the peg,” not “our pool is deep.”
- Other-chain lessons stay in STABLES-GUIDE: Terra is terminal; PSM inherits USDC; Chainge-class wraps are IOUs.

### Ecosystem (after the scene works once)

- Merchants: invoice link that opens KaChat on a phone.
- Games / chess: stake and release.
- Agents: quote-work in the unit, postage sponsored.
- Other messengers: same `kchat:1:payunit` shape if they speak the protocol. Do not wait for them.

---

## 5. Detailed to-do

Checkboxes are work, not slogans. “Done when” is the test. Strike nothing that is still a lab.

### Phase 0 — This lab (PegLab repo)

- [x] TN10-only engine, WILL DEPEG, no mainnet path
- [x] Depeg demo on local and public pages
- [x] KasWare path + local wallet funded from host (localhost faucet only)
- [x] Public .club via GitHub Pages; local 127.0.0.1:8765 kept
- [x] KaChat section on both copies
- [x] Phone: open KaChat app if installed, else store
- [x] PC: “KaChat does not support PC”
- [x] IDEA, KACHAT, STABLES-GUIDE, this vision
- [x] Footer and nav point at this file on local and public
- [ ] HTTPS on the public domain once GitHub has a certificate
- [ ] Live TN10 genesis broadcast + journal the series ids (not only the JS engine)
- [ ] Desktop QR / “open on your phone” for the public URL

### Phase 1 — Honesty and handoff (days, not a raise)

Done when a stranger on a PC understands they cannot chat here, and a stranger on a phone can open KaChat without a tutorial.

| Item | Done when |
| --- | --- |
| PC copy | Desktop shows KaChat is mobile-only; no fake “Open” to kachat.org |
| Phone deep link | Installed app opens; missing app → App Store / Play |
| QR to phone | PC visitor can scan into the same public URL |
| Store truth | App Store id and Play package stay in KACHAT.md |
| No seed in UI | Page never asks; mainnet `kaspa:` refused |

### Phase 2 — A real Testnet-10 receipt (not a dollar)

Done when an explorer and a second wallet agree on one series balance.

| Item | Done when |
| --- | --- |
| Genesis on TN10 | Outpoint, template hash, series bytes published |
| Transfer + redeem | Node accepts; not only `src/engine.mjs` |
| No USD oracle on this asset | Receipt = sompi. Admin price stays on the **depeg toy** only |
| Indexer | Address → UNIT UTXOs visible to KaChat’s stack or a documented indexer |
| Wallet verify | Unknown series rejected. Ticker is not funds |
| Caps published | Backing cap, supply cap, dust — same as the lab, named in UI |

### Phase 3 — The scene in KaChat (testnet)

Done when two phones complete quote → pay → claim *or* timeout reclaim, once.

| Item | Done when |
| --- | --- |
| Sign from KaChat | iOS (and Android) wallet signs covenant spend. KasWare-on-the-web is not enough |
| Balance row | UNIT next to KAS, with “not USD” on receipts |
| Protocol | `kchat:1:pay` stays KAS. Add `kchat:1:payunit` (series, amount, timeout, memo) |
| Timeout | Same idea as `KaChatPayTimeout.sil` |
| Postage | Pay succeeds if the receiver has 0 KAS (sponsor or grams) |
| Copy | No `$` on tPEG. Child Mode: receipts/KAS only |
| Failure copy | Five reasons in-thread: stale, postage, unknown series, paused, timeout |

Do **not** wait for Circle to ship timeout-KAS pay. That can go live on **KAS** now.

### Phase 4 — More than two people

| Item | Done when |
| --- | --- |
| Split | Group invoice; each pays or one pays and others settle |
| Tip | One-tap unit to an address in the thread |
| Stake | Chess / wager: lock, release to winner, or refund |
| Broadcast / KaPosts | Optional tip on a post; still receipts, still not USD |

### Phase 5 — Agents and merchants

| Item | Done when |
| --- | --- |
| Bot quote | Agent posts amount + timeout; human pays in KaChat |
| 402 | Pay button is the unit; postage sponsored |
| Merchant invoice | Link/QR opens KaChat on a phone with amount filled |
| Display FX | If they *think* in USD and *pay* a receipt, banner says so |

### Phase 6 — Mainnet receipt only

| Item | Done when |
| --- | --- |
| Audit-lite + KaChat review | KNOWN-BREAKS and AUDIT-LITE closed or accepted |
| Mainnet series | Receipt (A) only. Still not called USD |
| Freeze story | Receipts have no issuer freeze. If we later host USD, freeze is *their* power and the UI says who |

### Phase 7 — Named USD, if it exists

| Item | Done when |
| --- | --- |
| Issuer named | Circle / Tether / licensed entity in the first sentence |
| PegLab not the issuer | Separate asset id. No “tPEG = USDC” |
| Company path | Only if someone actually incorporates and banks. Not this repo |

### Never

- List current lab tPEG in KaChat 4.x as a stable
- Raise money against tPEG or a KaChat-PegLab token
- Use one admin oracle as the dollar
- Ship a PC KaChat clone and imply it is the app
- Remove WILL DEPEG from the lab
- Sister-token / algo / 20% yield to “hold $1”
- Mainnet the 2 tKAS pool as money

---

## 6. Order of work (so we do not skip the human)

```
Lab honesty (done) 
  → phone open / PC refusal (done)
  → live TN10 receipt + indexer
  → KaChat signs it on testnet
  → timeout pay in a 1:1 thread
  → postage so zero-KAS receivers work
  → groups / tips / stakes
  → agents / merchant QR
  → mainnet receipt after review
  → named USD only if an issuer is on Kaspa
```

Skipping to “mainnet chat-pay with a dollar glyph” is how a bridge IOU gets minted.

---

## 7. How to use this file

- Building: pick the next empty checkbox in the current phase. Do not start Phase 6 while Phase 2 is empty.
- Pitching: if a sentence needs this lab without WILL DEPEG, the sentence is wrong. Read [STABLES-GUIDE.md](STABLES-GUIDE.md).
- KaChat: [KACHAT.md](KACHAT.md) is the integration contract. This file is why that contract exists.
- Desktop vs phone: the site already branches. Keep it. KaChat does not support PC.

**Short version:** The chain settles. The phone is where people live. The unit must stay still for the length of a conversation. A toy dollar is a lesson. A receipt is a product. A licensed USD is a company. Do not mix the three.
