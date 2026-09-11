# Doctrine

This is the ruling for **PegLab’s objects**. The human job (invoice, EUR, timeout, rails that are not a token) is [WHOLE.md](WHOLE.md). If a coin page kidnaps the invoice, WHOLE wins. If a page calls tPEG money, this page wins.

**TESTNET-10 LAB. NOT USD. DO NOT RAISE MONEY AGAINST tPEG.**

---

## 1. The ruling

Kaspa does not need a fake dollar. People need a **quote in the unit they mean** (usually EUR/USD) and a **rail that can pay it**. A still number in sompi is not a still euro. Do not kidnap the invoice into a ticker.

Three objects exist. They are not one ticker.

| Object | What it is | Who already proved it | Mainnet |
| --- | --- | --- | --- |
| **Receipt** | 1 unit = 1 locked sompi. No oracle. Sponsor pays fees. Name is not authenticity. | Parker: [backed-receipt](https://github.com/parker2017code/kaspa-explained) + live TN10 journals. PegLab `src/receipt.mjs` is ENGINE_SPEC of those rules. | Allowed after live TN10 lock/transfer/redeem txids, indexer, KaChat signer. |
| **Classroom** | tPEG + admin oracle + 2 tKAS pool. **Will depeg** if you treat it as USD. | This repo. SCRIPT_ENFORCED CONTROL genesis is the *toy*, not the unit. | **Never as money.** |
| **Scene** | Two people in **KaChat on a phone** quote, pay, claim or reclaim. Postage is KAS. | KaChat exists in stores. Timeout/escrow exists on Parker’s TN12. PegLab has the consumer copy. | The scene is the product. The chain is the court. |

A licensed USDC/USDT later is a **fourth** object with a **named issuer**. PegLab is not that issuer. Host it. Do not print a thinner copy.

**Score already taken:** receipts 1–0 Parker. Classroom 1–0 PegLab. Dollars 0–0. Chat settlement 0–0 live.

Do not try to beat Parker by minting tPEG at an oracle. That is a different machine, and it loses as money.

---

## 2. What other chains actually proved

A peg is **redemption at par under stress**, not a pool price in a calm week. Fiat-backed is ~95% of working payment stables. That is the market’s vote and the regulator’s.

| Steal this | From | Do not steal |
| --- | --- | --- |
| Redemption is the product | Liquity (LUSD/BOLD → $1 of ETH); Sky PSM (USDS ↔ USDC at $1 until the cap) | Their dollar claim, unless you are a licensed issuer |
| Fail closed on stale prices | Maker/Sky, PegLab already | Using pause as the peg |
| Publish the cap | Sky PSM ceiling; DAI gapped ~$0.89 when the cap met SVB | “We’ll add a market maker later” |
| Name ≠ identity | Maker fake-token history; Parker genesis/template/series | The word “tPEG” or “USD” in a wallet |
| Sponsor pays fees | Parker backed-receipt; Kaspa Core “who pays the KAS” | Skimming principal for mass |
| Company money for a dollar | Circle: ~$1.1B equity, IPO 2025, GENIUS, OCC path | A Discord round against a 2 tKAS pool |
| Protocol money without selling the stable | Maker: MKR private sales, **no DAI ICO**. Liquity: company + fee token, not a sister that mints to defend $1 | Terra UST–LUNA, Anchor ~20%, any algo/rebase |
| Wrap honesty | Parker: trusted test oracle; **wTestUSD cannot buy the town’s crops** | Chainge-class “USDT on Kaspa” as native money |

**Forbidden copies:** Terra (terminal depeg; Do Kwon sentenced 2025). Iron/Titan illiquid “reserves.” Ethena-class CEX index as cash (Binance ~$0.65 print vs DEX near par, Oct 2025). PegLab’s own tiny pool as a peg.

GENIUS (US) and MiCA (EU) are the floor if you say payment stable. A receipt is not a payment stable. Do not mix the sentences.

---

## 3. What Parker already shipped (so we stop re-litigating)

From [kaspa-explained](https://github.com/parker2017code/kaspa-explained) and [tn12-covenant-vault-demo](https://github.com/parker2017code/tn12-covenant-vault-demo):

- Native receipt: quantity = locked sompi; transfer/split/merge conserve; redeem to holder P2PK; **sponsor input pays fees**; identity = genesis outpoint + covenant ID + template + series.
- Wrap path: pUSD on Sepolia → Kaspa claim → burn/release. Trusted local oracle. Kaspa does not verify Ethereum. **wTestUSD cannot buy crops.**
- Sprout Harbor: real tKAS spends with rules; 21 accepted TN10 txs for one order (7 Sep 2026).
- TN12: delayed vault, pledge release/refund, buyer escrow, batch-assurance, payload receipts, adversarial rejects. Vocabulary: `SCRIPT_ENFORCED` vs `PLANNER_ONLY` vs `INDEXER_DERIVED` vs `WALLET_POLICY`.
- Honest gaps Parker already listed: no AMM, no lending, no production oracle, no user-wallet signing on those accepted proofs, no independent audit, mainnet out of scope.

**PegLab’s job is not to replace that unit.** PegLab’s job is the public depeg classroom, the capital map, and the KaChat scene. Successor **A** in [MAINNET.md](MAINNET.md) *is* Parker’s receipt. Copy the enforcement. Do not copy the town art.

Claim labels on this site:

| Label | Meaning |
| --- | --- |
| `SCRIPT_ENFORCED` | Node accepted the spend rule. Needs a txid. |
| `ENGINE_SPEC` | JS in this repo (`src/receipt.mjs`, `src/engine.mjs`). Demo. |
| `COPY_ONLY` | English on a page. Not funds. |
| `INDEXER_DERIVED` | A balance row. Lie if the indexer cannot see UNIT UTXOs. |

The CONTROL genesis on this lab is **SCRIPT_ENFORCED for the depeg toy**. Mint/swap/redeem on the page are **ENGINE_SPEC**. The receipt tab is **ENGINE_SPEC**. Do not read “genesis on chain” as “the unit is live.”

---

## 4. The scene (why the chain is not the product)

KaChat is E2E chat plus native KAS pay on **iOS and Android**. It does **not** support PC. KasWare is a **desktop extension**. It does **not** exist on a phone.

Done looks like: two people already talking in KaChat, a quote that does not move with KAS, pay / claim / reclaim, postage in the background. If the asset is a receipt, the UI says sompi, not `$`.

Until KaChat signs a receipt covenant, the receipt is a block-explorer toy. Until the classroom stays honest, someone will list tPEG in KaChat 4.x. **tPEG cannot pay KaChat.** Same sentence as Parker’s crops.

Timeout pay should reuse Parker’s TN12 vault/escrow/pledge family (`KaChatPayTimeout` shape), not a third covenant.

---

## 5. Capital (the instrument must match the claim)

| Claim | Instrument | Budget |
| --- | --- | --- |
| This lab / tPEG | **$0 public raise.** Testnet gifts are not investments. | Already built. Will depeg. |
| KAS receipt | Grants / self-fund. Not a stablecoin sale. | $100k–$1M: live series, indexer, KaChat signer, copy |
| Overcollateral protocol | Equity or public-goods for *infrastructure* | $2M–$15M. Not PegLab’s oracle. |
| Hosted USDC/USDT | Do not raise to *be* the PSM until the named asset exists | Distribution |
| Licensed USD | **Company raise.** Bank, exams, lawyers first. | $10M–$50M+ |

Never: tPEG sale, points, sister token, 20% yield, mainnet the 2 tKAS pool, remove WILL DEPEG to please a deck.

---

## 6. Order of work (non-negotiable)

```
Keep the classroom honest (WILL DEPEG, no raise, no KasWare on phones)
  → live TN10 receipt lock/transfer/redeem + journal (Parker evidence pack)
  → indexer row per address
  → KaChat signs it; timeout pay in one thread
  → postage / grams so a 0-KAS receiver still works
  → groups, tips, stakes, merchant QR, agents
  → mainnet receipt after review
  → host a named USD only if that issuer is on Kaspa
  → overcollateral only at Maker/Liquity budget
  → licensed USD only as a company
```

Skipping to “mainnet chat-pay with a dollar glyph” is how a bridge IOU gets minted.

ENGINE_SPEC journal exists (`artifacts/receipt-engine-spec.json`): lock, transfer, redeem, SKIM refused, series empty 1:1. That is not a txid.

Next empty box: **broadcast receipt lock / transfer / redeem on Testnet-10 and journal accepted txids.** Not another tPEG feature. Not another essay.

---

## 7. Never

- List lab tPEG in KaChat as money
- Call a receipt `$`
- Call this CONTROL genesis the receipt series
- Use one admin oracle as a dollar
- Ship a PC KaChat
- Mainnet the 2 tKAS pool
- Raise against tPEG
- Invent a third timeout covenant when Parker already has escrow/vault on TN12

---

## 8. How to use this file

- Building: next empty box in §6. Do not start mainnet while the receipt is ENGINE_SPEC.
- Pitching: if the sentence needs this lab without WILL DEPEG, the sentence is wrong.
- Arguing with Parker: you already lost the unit. Steal the rules. Keep the classroom.
- Arguing for a Kaspa dollar: you are arguing for a company. Read [STABLES-GUIDE.md](STABLES-GUIDE.md).

Evidence: [BATTLE.md](BATTLE.md), [BEST.md](BEST.md), [MAINNET.md](MAINNET.md), [VISION.md](VISION.md), [KACHAT.md](KACHAT.md), Parker’s repos.

**Short version:** Parker has the unit. PegLab has the warning. KaChat has the pocket. Circle has the dollar. Do not mix the four.
