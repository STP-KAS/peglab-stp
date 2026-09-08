# What it would take to leave the lab

PegLab, **as this repo**, cannot deploy on Kaspa mainnet as money. The pool is 2 tKAS. The oracle is one key. If you treat tPEG as a dollar it depegs. That is the proof of concept. The name “PegLab” stays the teaching bench.

What *can* go to mainnet is a **successor** that copies working objects from other chains — not this toy’s ticker. This file is that map: existing proofs of concept, how they were actually funded, and the full list of what Kaspa still lacks. It is not legal advice and not a raise.

Related: [STABLES-GUIDE.md](STABLES-GUIDE.md) (pegs and capital ladder), [VISION.md](VISION.md) (finished conversation on a phone), [KACHAT.md](KACHAT.md) (chat + pay).

**TESTNET-10 LAB. NOT USD. DO NOT RAISE MONEY AGAINST tPEG.**

---

## 1. Call this lab what it is

| Name | Honest sentence | Mainnet? |
| --- | --- | --- |
| **PegLab (this checkout)** | A Testnet-10 depeg demo. Tiny pool, admin price, will fail as $1. | **No.** Keep it as the public lesson. |
| **Successor A — KAS receipt** | One unit is one sompi locked in a covenant. Not a dollar. | Yes, after audit-lite + indexer + wallet verify. Default. |
| **Successor B — hosted USD** | Circle / Tether / a *named* issuer. Freeze is theirs. PegLab is not the issuer. | Only when that asset exists on Kaspa. |
| **Successor C — overcollateral protocol** | Lock more KAS (or later other collateral) than you mint. Can gap. | Yes, at Maker/Liquity budget, not lab budget. |
| **Successor D — licensed payment stable** | We are an issuer. Reserves are cash and T-bills. Here is the entity. | Company + bank **before** SilverScript. |

Shipping PegLab’s current covenant on `kaspa:` with a 2 KAS pool is how Chainge-class wraps taught Kaspa a depeg. Mainnet does not add reserves.

---

## 2. Copy existing proofs of concept (not their brands)

Steal the **mechanism**. Do not steal the claim “we are USDC.”

### Fiat 1:1 (the market’s winner, ~95% of stable value)

**PoC:** USDT, USDC, PYUSD.

**What to copy**

- Redemption at par for cash / T-bills is the product.
- Segregated reserves, monthly examined composition (GENIUS), freeze disclosed in the UI.
- The issuer is a **company** that can be sued.

**How they were funded**

- **Tether:** operating company; float on reserves; not a public-goods grant. Do not copy the opacity.
- **Circle:** ~$1.1B equity over a decade (Coinbase, BlackRock, Fidelity, …). NYSE IPO June 2025 (~$31, later a mania print). GENIUS Act 2025 is the legal floor they already lived by. 2026: OCC national trust path. That is **$10M–$50M+ and lawyers first**, then a token.
- **PayPal PYUSD:** a bank/fintech balance sheet, not a Discord raise.

**Kaspa takeaway:** if the pitch says dollar, you are Circle’s competitor. You need a bank, not a 2 KAS pool. PegLab will never be this.

### Crypto-overcollateral + liquidations

**PoC:** Maker SAI (Dec 2017) → MCD DAI (2019) → Sky USDS; Liquity LUSD (2021) and BOLD (v2).

**What to copy**

- Lock more collateral than you mint.
- **Redemption vs collateral** (Liquity: 1 LUSD/BOLD → $1 of ETH) pulls the price up from below. No sister token.
- Fail closed on stale oracles. Caps published. Surplus buffer.
- Liquity v1: immutable core, no admin pause-as-peg. v2: user-set rates; governance only steers *liquidity incentives*, not the dollar.

**How they were funded**

- **Maker:** no retail ICO of DAI. MKR sold over time (forum, private, then market). Polychain / a16z ~$12M (Dec 2017) then a16z **$15M for ~6% of MKR** (Sep 2018). Maker Foundation in Copenhagen wrote code; later handed governance to the DAO. Trail of Bits / early audits *before* scale. Years of SAI on mainnet before multi-collateral.
- **Liquity:** protocol company (Liquity AG) + LQTY as a **fee-claim / incentive** token, not a sister-token that mints to defend $1. Security culture: multiple audits, immutability as the product. No “20% yield pays the peg.”

**Kaspa takeaway:** this is successor **C**. Budget **$2M–$15M**: oracles that are not one key, liquidation path, audits, incident process, MM. Do not use PegLab’s admin oracle.

### Peg Stability Module (import someone else’s dollar)

**PoC:** Maker/Sky PSM — USDS ↔ USDC at $1 until the ceiling.

**What to copy**

- Arb against a **redeemable** upstream dollar.
- Publish the cap. When the cap binds, the peg **gaps** (DAI ~$0.89 in March 2023 because the PSM *was* USDC, and SVB froze Circle).

**How it was funded**

- Not a separate raise. It piggybacked Maker’s existing MKR/DAI machine and Circle’s reserves.

**Kaspa takeaway:** successor **B** then a PSM. Do not raise to *be* the PSM until a named USDC/USDT (or licensed native) is on Kaspa. Chainge-class wraps are issuer **plus** bridge risk — show that in the UI.

### Hard redemption, no PSM

**PoC:** Liquity. Anyone can redeem the stable for $1 of ETH.

**What to copy**

- The arb is on-chain. No committee “defends” the peg with a new token.
- Can **overpeg** in a flight to safety. That is honest.

**Kaspa takeaway:** a KAS-receipt is even simpler: redeem for **sompi**, not for $1 of KAS. No oracle. That is successor **A**. Closest to what Toccata already is.

### Receipts / programmable cash (not a dollar)

**PoC:** Bitcoin DLCs and Taproot escrow; Ethereum “vesting / streaming” (Sablier, Superfluid) as *time-locked units*; local-settlement IOUs that never claim USD; Kaspa-explained **backed-receipt** (sponsor-fee, no skim of principal).

**What to copy**

- The unit is the locked asset. Display FX is a banner, not a peg.
- Timeout reclaim (they claim now, or you reclaim after `tx.time`) — KaChat already sketched this as `KaChatPayTimeout.sil`.
- Fees paid by a **sponsor**, not stolen from the receipt.

**How they were funded**

- Protocol grants, company R&D, or “sell software.” Not a stablecoin sale.

**Kaspa takeaway:** this is the **first** mainnet that is allowed. PegLab’s teaching UI becomes a receipt explorer, not a dollar.

### What not to copy (funded, then died)

| PoC | How it was funded | Why it is forbidden here |
| --- | --- | --- |
| Terra UST–LUNA | Huge Foundation, Anchor ~20% yield, LUNA as sister token | Backing was confidence. Do Kwon sentenced 2025. Terminal depeg. |
| Iron / Titan, various 2021 “partial collateral” | Farm emissions | Illiquid “reserves.” Quantity was a slogan. |
| Algo / rebase / seigniorage stables | Token sales | GENIUS/MiCA froze or banned the corner. ~0% of working payment stables. |
| Ethena-class hedge as “the dollar” | VC + basis trade | CEX index ≠ redemption (Binance print ~$0.65 vs DEX near par, Oct 2025). Not cash. |
| Wrapped USDT on Kaspa (Chainge-class) | Bridge operator | Kaspa already saw a depeg. Speed without native redemption repeats it. |

---

## 3. How the ones that lived actually got money

Copy the **instrument**, not the tweet.

| Project | Instrument | What money bought | What money did *not* buy |
| --- | --- | --- | --- |
| Circle | Equity → IPO | Bank relationships, exams, ops, lawyers | A smart contract that *is* the dollar |
| Maker | Private MKR sales to funds (a16z, Polychain) + Foundation payroll | Years of SAI, then MCD, audits, oracles | An ICO of DAI-as-shares |
| Liquity | Company + fee token | Audits, immutability, frontends run by others | A governance god-key |
| Ethereum public goods | EF grants, Gitcoin, Protocol Guild | Specs, clients, research | A peg |
| Kaspa Core / KIP work | Ecosystem grants, self-fund, companies | Nodes, KIPs, wallets | A Kaspa USDC |
| This PegLab repo | **$0 public raise** | A depeg demo | Nothing that holds $1 |

**Rules for PegLab / successor fundraising**

1. **Name matches backing.** “Receipt” → grants / self-fund. “Dollar” → equity in a licensed company.
2. **No tPEG sale. No points. No sister token that mints to defend $1.**
3. **Grants pay infrastructure** (indexer, SilverScript, KaChat signer, postage). They do not buy a peg.
4. **If a lawyer says you need a license, stop the token until that is true.**
5. **If the deck needs this lab’s UI without WILL DEPEG, the deck is the bug.**

Order-of-magnitude (same ladder as STABLES-GUIDE):

- Lab: $0–$300k, already built, **will depeg**
- Receipt on mainnet: $100k–$1M (audit-lite, indexer, wallet copy, KaChat testnet pay)
- Overcollateral protocol: $2M–$15M
- Licensed USD: $10M–$50M+ **company**

---

## 4. Think bigger than the covenant

The chain is the court file. Mainnet fails if any of these are missing.

### Product (the scene)

Two people on **KaChat phones** quote a still number, pay, claim or reclaim. Postage is KAS in the background. No PC KaChat. No `$` on a receipt. See [VISION.md](VISION.md).

Without that scene, a mainnet series is a block explorer toy.

### Protocol (what Toccata is for)

- Live **series** on Testnet-10 first: genesis outpoint, template hash, series bytes — wallets verify those, not the word tPEG.
- Transfer + redeem accepted by the node, not only `src/engine.mjs`.
- Kill the admin USD oracle on any asset KaChat would show. Receipts do not need a dollar feed.
- Timeout reclaim (`KaChatPayTimeout` shape). Split / tip / stake as the same family.
- Sponsor-fee or prepaid grams (KIP-21 mass) so a receiver with 0 KAS still works. Kaspa Core already flagged this.

### Wallets and indexers

- KaChat iOS/Android **signs** the covenant (KasWare-on-the-web is not enough).
- KasWare / Kaspa NG / Kaspium: refuse unknown series.
- Indexer row per address (Kasia or documented equivalent). If the wallet cannot see UNIT UTXOs, the balance is a lie.
- Explorer page: genesis, cap, pause, redeem path.

### People, law, ops

- Entity that matches the claim (none for a receipt; company for a dollar).
- GENIUS / MiCA if you say payment stable. Freeze UX named.
- Incident: pause is a brake. Redeem stays open if backing remains. Public post-mortem habit (Liquity/Maker culture, not “trust us”).
- Keys: never in git, never on the public site. Multi-person control if there is an admin at all.
- Support: five failure sentences in the thread (stale, postage, unknown series, paused, timeout).

### Distribution

- Phone first (KaChat). Desktop is the lab and docs.
- Merchant QR that opens KaChat with amount filled.
- Agents: quote → 402 → pay. Human optional.
- Other messengers may speak `kchat:1:payunit`. Do not wait for them.

### What Kaspa uniquely adds (so “bigger” is not “become Circle”)

- One-second sequencing, cheap settlement, public evidence.
- Covenants: lock, timeout, split, prove the spend rule — **programmable cash**.
- Native chat+pay already in a store app (KaChat). Ethereum never had that as a default consumer surface.

What Kaspa does **not** add: a Treasury, a banking charter, or a reason to ignore the law if you print “USD.”

---

## 5. Mainnet checklist (successor A first)

Do not tick “mainnet PegLab.” Tick a **receipt** (or later a named USD).

### Must already be true on Testnet-10

- [ ] One live series; transfer and redeem on-chain
- [ ] Indexer shows UNIT by address
- [ ] KaChat (or a native signer) can pay 1 unit in a 1:1 thread with timeout
- [ ] Postage: pay does not fail because the receiver has 0 KAS
- [ ] Wallets verify genesis / template / series; unknown ticker rejected
- [ ] Copy: no `$`; WILL DEPEG remains on *this* lab forever
- [ ] AUDIT-LITE + KNOWN-BREAKS closed or accepted; at least one external review for the successor contract

### Then mainnet (receipt only)

- [ ] New genesis on `kaspa:` with published hashes
- [ ] Caps published (backing, supply, dust) — not “infinite”
- [ ] No admin USD oracle on this asset
- [ ] Incident channel and pause policy written *before* first user
- [ ] KaChat review: asset picker KAS | receipt, Child Mode receipts only
- [ ] Still not called USD. Still not a token sale.

### Only if you later host a dollar

- [ ] Named issuer in the first sentence
- [ ] Separate asset id from the receipt
- [ ] Freeze / redemption / exam story is *theirs*
- [ ] Company raise if *you* are the issuer — not a PegLab meme round

### Never

- [ ] Mainnet this 2 tKAS pool as money
- [ ] List lab tPEG in KaChat 4.x as stablechat
- [ ] Sister token / algo / 20% yield to hold $1
- [ ] Raise against tPEG
- [ ] Remove WILL DEPEG from the lab to please a deck

---

## 6. Suggested build order (so “bigger” has a sequence)

```
PegLab lab (done: depeg, honesty, KasWare, phone/PC KaChat)
  → live TN10 receipt + indexer
  → KaChat signs it; timeout pay in one thread
  → postage / grams so zero-KAS receivers work
  → groups, tips, stakes, merchant QR, agents
  → mainnet receipt after review
  → hosted USD only if an issuer is on Kaspa
  → overcollateral protocol only with Maker/Liquity-class budget
  → licensed USD only as a company
```

Skipping to “mainnet chat-pay with a dollar glyph” is how a bridge IOU gets minted.

---

## 7. Short version

PegLab is the proof that a cheap pool is not a dollar. Keep it. Deploy **something else** on mainnet:

- First, a **KAS receipt** (copy Liquity’s *redemption-is-the-product*, drop the dollar).
- Later, **host** a named USDC/USDT (copy Sky’s PSM, inherit their risk, name it).
- Only a **company** copies Circle.

Fund grants and payroll for infrastructure. Fund equity for a bank. Never fund a sister token. Think as big as KaChat-in-the-pocket, merchants, and agents — the covenant is the smallest part.

**PegLab stays the lab. The successor earns the mainnet flag.**
