# PegLab is not the Kaspa dollar. Here is the alternative.

**TESTNET TOY. NOT USD. DO NOT RAISE MONEY AGAINST tPEG.**

This is the plan for a Kaspa stable *other than* PegLab. PegLab stays the $50k–$300k teaching rung: code, audit-lite, tiny pool, **will depeg**. Using it as a fundraising story for a payment stable is how people get hurt.

This is a product and capital guide, not legal advice. Payment stables are regulated money in the US (GENIUS Act, 2025–26), the EU (MiCA, full 2026), and similar regimes. A token sale that implies “this is a dollar” is the wrong instrument even before the code is wrong.

---

## 1. Pushback (read this first)

| Temptation | Pushback |
| --- | --- |
| Raise $50k–$300k and call it a Kaspa stable | That budget buys a demo. It does not buy a peg. PegLab already *is* that demo, and it is designed to fail. |
| Sell tPEG, points, or a “stability token” | Sister-token backing is Terra’s death spiral. Do Kwon was sentenced in 2025. Do not copy the mechanism or the marketing. |
| Put PegLab on mainnet with a 2 tKAS pool | A 0.2 tKAS swap already moves the pool >5% on testnet. Mainnet does not add magic. |
| Mint against an admin oracle and say 1:1 USD | The oracle is a key. The key is the dollar. That is not a stable. |
| “We’ll add a market maker later” | The peg *is* redemption plus depth. Later means unbacked liabilities now. |
| Race 1kUSD / Igra / Chainge with a faster launch | Chainge wrapped “stables” already taught Kaspa a depeg. Speed without reserves repeats it. |
| Algorithmic / seigniorage / rebase to hold $1 | Market share of working payment stables is ~95% fiat-backed. Regimes that matter have banned or frozen the algo corner. |

**Do raise money only after the product name matches the backing.** If the pitch says dollar, the reserves must be dollars (or a licensed claim on dollars). If the pitch says “KAS receipt,” do not say dollar.

---

## 2. What actually holds a peg on other chains

A peg is **redemption at par under stress**, not a pool price in a calm week.

### Models that survived at scale

| Model | Examples | How the peg is real | What you must buy | Failure mode |
| --- | --- | --- | --- | --- |
| Fiat-backed 1:1 | USDT, USDC, PYUSD | Redeem for cash / T-bills at par. Segregated reserves. Monthly examined disclosures (GENIUS); Circle also full corporate audit. | License, bank, custodian, attestations, freeze/compliance UX | Bank freeze (USDC/SVB 2023: ~$0.88 for days). **Survived because the cash existed.** |
| Crypto-overcollateral + liquidations | Maker/Sky DAI & USDS, Liquity LUSD/BOLD, crvUSD | Lock more collateral than you mint. Liquidate or continuously rebalance. | Oracles, surplus buffer, liquidation path, risk policy | Oracle lag, cascade, governance. DAI fell with USDC in 2023 because the PSM *was* USDC. |
| PSM to an upstream dollar | Sky LitePSM (USDC ↔ USDS at $1) | Arb against a deep, redeemable dollar. Caps matter. | The upstream dollar already on your chain, plus a ceiling | You inherit the upstream issuer. When the PSM hits its cap, the peg gaps (DAI ~$0.89, March 2023). |
| Native redemption vs collateral | Liquity: redeem LUSD for $1 of ETH | No PSM. Hard redemption pulls price up from below. Can **overpeg** in a flight to safety. | Deep collateral, redemption gas, no yield gimmick | Overpeg; ETH crash + liquidation stress. Not a consumer checking account. |

Fiat-backed is ~$300B+ of a ~$320B market (Q1 2026). Crypto-backed is a rounding error by size. That is the market’s vote, and the regulator’s.

### Models that failed as money

| Model | Example | Lesson |
| --- | --- | --- |
| Algorithmic / sister token | Terra UST–LUNA, May 2022 | Backing was confidence. Minting the volatile token to defend $1 hyperinflated it. Design failure is terminal; UST did not repeg. |
| Thin pool as “peg” | PegLab; countless farm tokens | Constant-product with shallow depth *is* the depeg. Do not market it as stability. |
| Illiquid “reserves” | IRON, various 2021 coins | If you cannot sell the backing in a run, quantity of collateral is a slogan. |
| Yield that pays the peg | Anchor ~20% on UST | Subsidised yield is a run waiting for a date. |
| Venue oracle as price | Ethena USDe on Binance, Oct 2025 (~$0.65 print vs DEX near par) | CEX index ≠ redemption. Hedge + oracle design is not the same as cash. |

### Engineering practices worth copying (not the brand)

1. **Redemption is the product.** Sky’s PSM works because anyone can swap USDS↔USDC at $1 until the ceiling. Liquity works because anyone can redeem for $1 of ETH. PegLab’s “redeem” is tKAS at an admin price. Different object.
2. **Fail closed on stale prices.** Mint/swap stop; existing holders still exit if backing remains. PegLab already does this on testnet. Keep it.
3. **Caps and dust floors.** Sky PSM has a governance ceiling. That ceiling *is* why DAI gapped in 2023. Publish the cap; do not pretend infinite depth.
4. **Name ≠ identity.** Series / genesis / template hash. Maker learned this the hard way with fake tokens; Kaspa UTXO series will be worse if wallets show “tPEG” or “USD”.
5. **Attestation ≠ audit.** A snapshot of balances is not controls. GENIUS-tier payment stables need monthly examined reserve composition; large issuers need GAAP audits.
6. **Do not skim principal for fees.** Sponsor pays fees. Backed receipts on kaspa-explained already encode this. Keep it in any real unit.
7. **Pause is a brake, not a peg.** Circle recovered because reserves were real. Pause without reserves is a rug with extra steps.
8. **Who pays the fee asset.** Kaspa Core R&D already flagged this: a dollar UTXO that still needs KAS for mass is bad consumer UX. Solve sponsor-fee / refundable KAS *before* calling it payments.

---

## 3. What Kaspa can uniquely do (and what it cannot)

Toccata is live (mainnet 30 June 2026). Covenants can lock, split, timeout, and prove a spend rule. That is **programmable cash**, not a central-bank license.

Kaspa is strong as:

- Fast sequencing and cheap settlement
- Public evidence of who got paid
- Covenant escrow, budgets, receipts (LocalSettle / HouseLedger class)

Kaspa is not:

- A Treasury prime fund
- A substitute for Circle/Tether distribution
- A reason to ignore GENIUS/MiCA if you say “dollar”

Wrapped “USDT on Kaspa” via a bridge (Chainge-class) is **issuer + bridge** risk. It is not native. Treat it as a wrapped IOU in the UX, including freeze risk.

[1kUSD](https://github.com/NeaBouli/1kUSD) is a serious research program (PSM, no CDP, Kaspa-primary ADR). It is **not** production: mock oracle, stub governance, no external audit, no mainnet. Do not race it by launching a thinner copy.

---

## 4. The capital ladder (honest)

| Rung | Budget (order of mag.) | What you actually buy | Peg outcome | Raise? |
| --- | --- | --- | --- | --- |
| **PegLab (this repo)** | $0–$300k | Code, tests, tiny TN10 pool, teaching UI | **Will depeg** | **No public raise. No token.** Optional self-fund of testnet coins only. |
| **KAS receipt / unit of account** | $100k–$1M | Covenant receipts = sompi, not USD. Wallet copy, explorer, merchant display with FX banner | Never claimed $1 | Grants / self-fund. Not a stablecoin sale. |
| **Crypto-overcollateral protocol** | $2M–$15M | Oracles (not one key), audits, surplus buffer, MM, incident process | Soft peg; can gap | Equity or public-goods for *infrastructure*, not “buy the dollar.” |
| **PSM to native USDC/USDT** | Mostly distribution | Wait for a real issuer/bridge you can name in the UI | As good as the upstream | Do not raise to *be* the PSM until the upstream exists on Kaspa. |
| **Licensed payment stable** | $10M–$50M+ | Entity, banking, custody, examinations, redemption ops, travel rule, lawyers | Can hold if run honestly | **Company raise.** Not a meme round. |

PegLab already occupies rung 1. Skip to rung 5 in your head and you will ship rung 1 with rung 5 marketing. That is the failure.

---

## 5. Recommended path (what to do)

### Now (PegLab)

- Keep TN10, WILL DEPEG, no mainnet.
- Fund the dedicated sponsor wallet if you want a live genesis demo: send ≥2.01 tKAS from the miner to `kaspatest:qzpvdakagvwfm95g8pv9ndpupjtndgjfhmve08cg3tv5wgfytjzf7cudwwzv0`, then `npm run genesis:submit`.
- Use the depeg lab as **community education**, not a listing pitch.
- Do not add a governance token, points, or “stability fees.”

### Next product (not a dollar)

Build the **settlement app** that becomes useful the day a real stable lands:

1. LocalSettle / invoice / escrow with **display currency = USD** and **pay-in = KAS or future stable**.
2. Honest FX banner on KAS pay-in.
3. Receipts that name asset id, amount, covenant state.
4. Sponsor-fee path so the receiver is not told to go buy KAS first.

That is the Kaspa edge. The dollar token is someone else’s licensed inventory.

The human product (phones, KaChat, postage, agents, what never to ship) is [VISION.md](VISION.md). This file is the capital and peg ladder. Do not mix them: a receipt is not a raise.

What it would take to leave the lab — copy existing proofs of concept, how Maker/Circle/Liquity were actually funded, mainnet checklist — is [MAINNET.md](MAINNET.md). PegLab as this repo still does not go to mainnet as money.

### If you still want a Kaspa-native unit

Pick **one** and say it in the first sentence:

| Choice | First sentence | First build |
| --- | --- | --- |
| **A. Receipt on tKAS** | “One unit is one sompi locked in the covenant. Not USD.” | Productionise kaspa-explained backed-receipt. No oracle. |
| **B. Overcollateral KAS→unit** | “You lock KAS; you get a bounded claim; it can trade off $1 and we will show that.” | Oracles with staleness halt; no sister token; no 20% yield. Budget like rung 3. |
| **C. Host USDC/USDT** | “We do not issue the dollar. Circle/Tether (or named bridge) does.” | Wallet + escrow templates. Freeze UX. |
| **D. Licensed USD on Kaspa** | “We are an issuer. Reserves are cash and T-bills. Here is the entity.” | Lawyers and a bank before SilverScript. |
| **E. Energy / invoice unit** | “This is kWh or EUR invoice, not a consumer dollar.” | Gigawatt-class counterparties, not Discord. |

**Default recommendation:** A + C. Receipts now; host a real dollar when it exists. Do not do B with PegLab’s oracle. Do not do D from this repo.

### Fundraising, if any

- **PegLab:** $0. If someone wants to donate tKAS to the TN10 demo wallet, that is a testnet gift, not an investment.
- **Settlement app:** small grant / self-fund. Sell software or subscriptions later, not a coin.
- **Issuer (path D):** equity in a company that can be examined. If a lawyer says you need a license, stop building the token until that is true.
- **Never:** presale of tPEG, “founders allocation,” or a stability-share that defends the peg.

If a pitch deck needs PegLab’s UI without the WILL DEPEG banner, the pitch is the bug.

---

## 6. Checklist before anyone says “stable”

- [ ] Backing is named (cash, T-bills, ETH, KAS sompi) and is **not** this project’s own token
- [ ] Redemption path is live, capped, and tested as a *run* (not only mint)
- [ ] Oracle, if any, is not a single admin key
- [ ] Pool depth vs. a 5% trade is published; if it cannot defend, the UI says so
- [ ] Pause / freeze is disclosed as issuer power
- [ ] Series / genesis / template are what wallets verify
- [ ] Legal entity matches the claim (payment stable vs. experimental token)
- [ ] No mainnet PegLab

If more than two boxes fail, you still have a toy. Ship it as PegLab, not as money.

---

## 7. Sources (sampled 2026)

- Fiat vs crypto vs algo market structure: Stablecoin Issuance Landscape / design-model surveys (fiat ~95% of value).
- GENIUS Act (US, 2025) and MiCA (EU, 2026): 1:1 liquid reserves, par redemption, disclosures; algo corner constrained.
- Sky/Maker PSM: USDS↔USDC at par; DAI inherited USDC/SVB in March 2023 (Fed note).
- Liquity: ETH redemption, no PSM, overpeg in panics.
- Terra UST: circular backing; terminal depeg.
- Kaspa: Toccata live 30 June 2026; 1kUSD research not production; Core R&D “who pays the KAS” for dollar UTXOs.

PegLab’s own evidence: `KNOWN-BREAKS.md`, `AUDIT-LITE.md`, `npm test`.
