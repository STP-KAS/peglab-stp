# Battle test: PegLab vs Parker’s GitHub PoC

Parker’s public model is not a dollar printer. It is **[kaspa-explained](https://github.com/parker2017code/kaspa-explained)** (Testnet-10 receipts, wrap lab, Sprout Harbor) plus **[tn12-covenant-vault-demo](https://github.com/parker2017code/tn12-covenant-vault-demo)** (accepted TN12 vault/escrow/assurance proofs).

Authority: [DOCTRINE.md](DOCTRINE.md). This file scores **this PegLab checkout** against that model. PegLab is allowed to lose. If a row says Parker wins, do not “fix” it by calling tPEG USD.

**TESTNET TOY. NOT USD. DO NOT RAISE AGAINST tPEG.**

Sources dated September 2026: Parker README + `docs/wrap-poc.md` + `docs/backed-receipt.md`; PegLab `src/engine.mjs`, [MAINNET.md](MAINNET.md), [VISION.md](VISION.md).

---

## 1. What Parker actually proved

### Native receipt (the object PegLab should become)

From `backed-receipt.md` / wrap lab:

- One receipt unit **equals one locked sompi**. Not USD.
- Transfer / split / merge conserve quantity and backing.
- Redeem pays the holder’s P2PK. No mint refill.
- **Sponsor input pays fees.** Principal cannot be skimmed.
- Identity is genesis outpoint + covenant ID + template + series. **A name is not authenticity.**
- Live TN10 evidence exists for create, split, merge, move, partial and full redeem (accepted txids in Parker’s public review docs).

### Wrap / “stable” path (explicitly not money)

- Lock 100 **pUSD** (freely minted Sepolia test token) → issue Kaspa units → burn → release.
- **Trusted local oracle.** Kaspa does **not** verify Ethereum consensus.
- **wTestUSD cannot buy the town’s crops.** Written in the README.
- Round trip recorded 7 September 2026; vault and claim balances ended at zero.

### Economy (Sprout Harbor)

- Real tKAS spends with rules: wage UTXO, vouchers, pledges, schedule check.
- 21 accepted TN10 txs for one order; reload verified 7 September 2026.
- Game art is interpretation; signatures and spend limits are on-chain.

### TN12 covenant lab

- Accepted: delayed vault, pledge release/refund, buyer escrow, batch-assurance, payload receipts, adversarial rejects.
- Vocabulary: `SCRIPT_ENFORCED` vs `PLANNER_ONLY` vs `INDEXER_DERIVED` vs `WALLET_POLICY`.
- Honest gaps: no AMM, no lending, no production oracle, no user-wallet signing on the accepted proofs (local keys), no independent audit, mainnet out of scope.

Parker’s model in one sentence: **lock real tKAS (or a named test wrap), prove the spend rule, journal the txid, never call it a bank dollar.**

---

## 2. Scorecard

| Test | Parker PoC | PegLab (this repo) | Winner |
| --- | --- | --- | --- |
| What the unit *is* | 1 receipt = 1 sompi locked in the output | tPEG minted at an **admin oracle** (default 100_000 sompi/tPEG) plus a 2 tKAS constant-product pool | **Parker** for money. PegLab is a *different object*: a depeg toy. |
| Dollar claim | Forbidden. wTestUSD cannot buy crops. pUSD is freely minted test. | Forbidden in copy (WILL DEPEG). Engine still *has* a USD-shaped oracle + pool | **Tie on copy.** Parker wins on *mechanism* (no dollar feed). |
| Redemption | Holder spends backing; no oracle | Redeem tPEG for tKAS at **admin price** | **Parker** |
| Fees | Sponsor input; no skim of principal | Lab UI does not yet enforce sponsor-fee on a live UNIT tx | **Parker** |
| On-chain evidence | Accepted TN10/TN12 txids, JSON journals, explorer links | Engine + tests + optional genesis submit; **no public accepted UNIT transfer/redeem journal** | **Parker** |
| Caps | 10 tKAS teaching bound on receipts | 10 tKAS backing, 10k tPEG, 2 tKAS pool — same teaching scale | Tie |
| Identity | Genesis / template / series; name ≠ authenticity | Same sentence in PegLab copy | Tie |
| Fail closed | Wrong signer/amount/skim rejected; wrap rejects duplicate deposit/burn | Engine rejects ALIGN, OVER_CAP, PAUSED, STALE_ORACLE, BAD_ADMIN, TINY_POOL | Tie on *intent*. Parker has VM + node rejects on record. |
| Oracle honesty | Wrap oracle is **named as trust**. Native receipt has **none**. | Admin key *is* the price. Lab shows the depeg on purpose | **PegLab** as a *lesson*. **Parker** as a *product*. |
| AMM / “peg defense” | Explicitly **no AMM** on TN12 (“current gaps”) | Tiny pool **is** the depeg demo | **PegLab** for teaching. **Parker** for not pretending a pool is a peg. |
| Timeout / escrow | TN12 buyer escrow, delayed vault, pledge refund — accepted | Documented for KaChat (`KaChatPayTimeout`); **not live** | **Parker** |
| Indexer / replay | Payload receipts, replay guards, claim classes | No UNIT indexer row yet | **Parker** |
| Wallets | Encrypted browser journal; wrap keys stay `.local/`; Kaspa does not get a public signing server | KasWare header (Gramlane `getBalance`) + localhost faucet; public site has no host key | **Tie** (different surfaces). Parker is ahead on **recorded** independent-role txs. |
| Product scene | Town that spends tKAS with rules | KaChat-on-phone vision; PC told KaChat is mobile-only | **PegLab** on *consumer story*. **Parker** on *executed economy*. |
| Funding / law map | Wrap-poc “from here to real capital” table (asset, oracle, users, supply, finality, recovery, assurance, obligations) | [MAINNET.md](MAINNET.md) + [STABLES-GUIDE.md](STABLES-GUIDE.md): Maker/Circle/Liquity funding, GENIUS, never raise tPEG | **PegLab** on *capital honesty*. Parker’s table is tighter on *ops*. |
| Mainnet | Out of scope; readiness doc is gaps | Out of scope as money; successor A = Parker’s receipt | **Parker already *is* successor A** |

**Verdict:** PegLab does **not** beat Parker as a Kaspa unit. Parker’s backed receipt is the thing MAINNET.md calls successor **A**. PegLab wins only as the **public depeg classroom** and the **fundraising/KaChat map**. If you deploy PegLab’s pool+oracle on `kaspa:`, you lose the battle Parker already won in copy: *do not let a test wrap buy the town.*

---

## 3. Battle on Parker’s own tests

Run PegLab’s engine against Parker’s receipt rules. Failures are expected where PegLab is a different machine.

| Parker rule | PegLab today | Result |
| --- | --- | --- |
| Quantity = backing sompi | Mint: tKAS in must be a multiple of **oracle** price, not 1:1 sompi | **FAIL as receipt.** PASS as “toy mint.” |
| No price oracle on the unit | `DEFAULT_ORACLE = 100_000n` sompi/tPEG; mint/swap require `oracleLive` | **FAIL as receipt.** PASS as depeg lab. |
| Sponsor pays fees; no skim | Not encoded in the live UNIT path | **FAIL** until successor copies Parker’s sponsor pattern |
| Transfer conserves units | `transfer` conserves tPEG quantities | **PASS** (tPEG, not sompi) |
| Redeem to holder P2PK | Redeem burns tPEG, pays tKAS at oracle | **FAIL as 1:1 sompi redeem.** Different payout. |
| Tiny pool cannot defend $1 | `cannotDefendPeg` true at seed; depeg lab moves pool >5% | **PASS** — this is PegLab’s job |
| Name ≠ authenticity | Copy + series id | **PASS** in docs |
| Accepted txid journal | Missing for UNIT | **FAIL** |
| wTestUSD cannot buy crops | tPEG must not sit in KaChat as money | **PASS** in [KACHAT.md](KACHAT.md); **FAIL** if anyone lists lab tPEG in 4.x |

---

## 4. What PegLab should steal from Parker (copy-paste)

Not the town art. The **enforcement**.

1. **Successor A = Parker’s receipt.** Kill the admin USD oracle on any asset KaChat would show. 1 unit = 1 sompi.
2. **Sponsor fee input.** Parker already wrote it. MAINNET.md already requires it for 0-KAS receivers.
3. **Evidence pack.** Every “done” is an accepted txid JSON like Parker’s wrap verification record — not a screenshot of the depeg UI.
4. **Claim vocabulary.** Label PegLab engine rows `ENGINE_SPEC`, SilverScript `SCRIPT_ENFORCED`, homepage copy `COPY_ONLY`. Do not mix.
5. **Wrap honesty.** If you ever host USDC, say “trusted issuer/bridge” the way Parker says “trusted test oracle.” **wTestUSD cannot buy crops** becomes **tPEG cannot pay KaChat.**
6. **TN12 primitives for KaChat.** Timeout pay = Parker’s delayed vault + escrow + pledge refund. Do not invent a third covenant family.
7. **`.local/` never on the public host.** Parker’s wrap signing server is loopback-only. PegLab faucet already is. Keep it.

---

## 5. What Parker should steal from PegLab (if anything)

- **Depeg as a first-class demo.** Parker refuses a fake peg. PegLab *shows* why a 2 tKAS pool dies. That lesson belongs next to wrap lab, not instead of receipts.
- **KaChat / phone / “Log in”.** Parker’s proofs still used local keys; TN12 defers user-wallet signing. PegLab wired Gramlane KasWare `getBalance` on the public page.
- **Capital instruments.** Parker’s “from here to real capital” is ops. PegLab’s Maker (MKR private sales, no DAI ICO), Circle (equity → IPO, GENIUS), Liquity (company + immutable core) table is how you *pay* for successor C/D without a sister token.

Do not merge the labs into one ticker.

---

## 6. Outcome

| If you wanted… | Winner | Next move |
| --- | --- | --- |
| A Kaspa-native **unit** people can transfer and redeem | **Parker receipt** | Stop minting tPEG at an oracle. Implement successor A on TN10 with Parker’s sponsor-fee rules. Journal txids. |
| A **dollar** | **Neither** | Circle/Tether or a licensed company. Parker already refused. PegLab MAINNET.md same. |
| A **teaching depeg** | **PegLab** | Keep WILL DEPEG. Do not mainnet the pool. |
| **Chat settlement** | **Neither live** | Parker has escrow/timeout on TN12. PegLab has the KaChat story. Combine: Parker primitive + KaChat signer. |
| **Something to raise money against** | **Neither** | Grants for indexer/signer. Equity only if you are an issuer. |

**Short version:** Parker’s GitHub PoC already *is* the honest Kaspa unit. PegLab is the honest warning that a pool is not a peg. Battle-test score: **receipts 1–0 Parker; classroom 1–0 PegLab; dollars 0–0.** Deploy the receipt. Keep the lab. Do not put PegLab’s oracle on mainnet.

Parker: https://github.com/parker2017code/kaspa-explained · https://github.com/parker2017code/tn12-covenant-vault-demo  
PegLab: this repo · [MAINNET.md](MAINNET.md)
