# How KaChat could use PegLab — and what “real” means

KaChat ([kachat.org](https://www.kachat.org/), [vsmirn0v/KaChat](https://github.com/vsmirn0v/KaChat)) is encrypted chat **plus native KAS payments** on Kaspa (`kchat:1:pay` memos, timeout reclaim). It already runs. What it does not have is a unit that stays still while two people argue over a price in a thread.

PegLab’s idea is that unit: a Kaspa-native alternative to USDT/USDC so a dapp can invoice, escrow, and tip **on Kaspa**, not on Circle.

**PegLab today cannot sit in KaChat as money.** This repo is Testnet-10, tiny pool, one admin price. If you treat tPEG as USD it depegs. KaChat should not ship that.

---

## What KaChat is today

| Piece | Today |
| --- | --- |
| Chat | E2E payloads on L1 (`kchat:1:comm`, groups, KaPosts) |
| Pay | Native **KAS** to a recipient, optional encrypted memo |
| Timeout pay | Sketch already exists: `KaChatPayTimeout.sil` — recipient claims now, sender reclaims after `tx.time` |
| Identity | KNS names; aliases are not consensus uniqueness |
| Fees | Every message and pay still burns **KAS mass** |
| FX | Portfolio uses CoinGecko; the payment itself is still sompi |

The product freeze: people will chat, then refuse to **send** because KAS moved since the quote. That is the same merchant “don’t spend KAS” problem. A centralized stable on another chain does not fix in-chat Kaspa settlement.

---

## Where PegLab would show up in KaChat

Not as “USDT in the bubble.” As **chat actions that keep a number still**:

1. **Quote in the unit, pay in the unit**  
   “20 tPEG for the logo” stays 20 until paid or the timeout fires. The thread is the invoice.

2. **Pay with timeout (compose, don’t rewrite chat)**  
   Lock the unit in a covenant. Recipient claims. If they ghost, sender reclaims after timeout. That is `KaChatPayTimeout` with PegLab UNIT as the asset instead of raw KAS.

3. **Group split / tip / chess stake**  
   Same covenant family: lock, split, release, or refund. Chat is coordination; L1 is the court.

4. **Bots and agents**  
   A bot quotes work in the unit, KaChat shows the 402 / pay button, sponsor pays KAS fees so the human is not told to go buy dust first.

5. **Display honesty**  
   If the unit is a **KAS receipt** (1 unit = 1 sompi), the UI says sompi, not dollars. If someone later hosts real USDC, that is a different asset id. Never show tPEG as `$`.

KaChat does not need PegLab to encrypt. It needs PegLab (or a successor unit) so **the pay button is not an FX trade**.

---

## Two honest units (pick one in the first sentence)

| Unit | First sentence in KaChat | PegLab role |
| --- | --- | --- |
| **A. KAS receipt** | “This is locked tKAS. The number is sompi, not USD.” | Productionise receipt/covenant transfer + redeem. No oracle. Closest to `backed-receipt` + PegLab UNIT transfer. |
| **B. Hosted USD** | “This is USDC/USDT from *named issuer*. Freeze risk is theirs.” | PegLab is not the issuer. KaChat lists a foreign asset when it exists on Kaspa. |
| **C. Fake $1 tPEG** | Do not ship. | This lab only. Admin oracle + 2 tKAS pool. |

**Default for KaChat: A now, B when a real dollar is on Kaspa.** C stays the public depeg demo so nobody “just lists tPEG.”

Work credits / grams (`WorkCredit.sil`) are a **fee voucher** (KIP-21 mass), not a chat dollar. Useful so messages have prepaid grams. Different button from “pay the designer.”

---

## What must be built to make A real

Order matters. Skipping to mainnet chat-pay is how you mint a bridge IOU.

### 1. PegLab (or receipt) on Testnet-10 for real

- Broadcast genesis, mint, transfer, redeem — not only the JS engine.
- Pin series / genesis outpoint / template hash. Wallets verify those, not the word “tPEG”.
- Kill the admin USD oracle for the KaChat asset. Receipts do not need a dollar feed.
- Indexer (or KaChat’s Kasia indexer) must see UNIT UTXOs and balances by address.

### 2. A wallet KaChat already is

KaChat is a Swift wallet (Secure Enclave, node pool, UTXO subscribe). KasWare-on-the-web is not enough.

- Sign covenant spends (`act` / transfer / redeem) from the iOS/desktop wallet.
- Show UNIT balance next to KAS.
- Refuse unknown series. A cloned ticker is not funds.

### 3. Chat protocol

Extend pay, do not invent a second messenger:

- Keep `kchat:1:pay` for KAS.
- Add something like `kchat:1:payunit` (or a typed field): series id, covenant id, amount, timeout, memo ciphertext.
- Handshake still E2E. Payment still a recipient-addressed (or covenant) tx the recipient’s watcher can see.
- Timeout reclaim uses the same idea as `KaChatPayTimeout.sil`.

### 4. Fees (“who pays the KAS”)

A “dollar-shaped” pay that first says “go get KAS for mass” is dead UX.

- Sponsor-fee input on the pay tx, or
- Prepaid **grams** (WorkCredit) consumed when sending chat+pay,
- UI: user thinks in the unit; KAS is the postage.

### 5. Product copy in the app

- Asset picker: KAS | PegLab receipt | (later) named USD.
- No `$` glyph on tPEG.
- Child Mode / gifts: receipts only, not a “stable”.
- No in-app sale of tPEG.

### 6. Still not a bank

If KaChat ever shows **USD**, the issuer is named, freeze is disclosed, and PegLab is not that issuer. Licensed payment stables are a company, not a chat feature.

---

## Suggested build order

| Step | Where | Done when |
| --- | --- | --- |
| 0 | PegLab lab | People can run the depeg demo and read this file |
| 1 | PegLab TN10 | One live series, transfer+redeem accepted on Testnet-10, indexer row |
| 2 | KaChat testnet | Wallet shows that series balance; send 1 unit in a 1:1 chat with timeout |
| 3 | Fees | Pay tx does not fail because the receiver has 0 KAS |
| 4 | Groups | Split / tip using the same covenant, still testnet |
| 5 | Mainnet | Only for **receipt (A)** after audit-lite + KaChat review — still not called USD |
| 6 | USD in chat | Only if a **named** USDT/USDC exists on Kaspa |

---

## What not to do

- Do not put current PegLab tPEG in KaChat 4.x as “stablechat”.
- Do not raise money against a KaChat-PegLab token.
- Do not use an admin oracle as the dollar in production.
- Do not wait for Circle before shipping timeout-KAS pay (`KaChatPayTimeout` can go live on **KAS** now).

**Short version:** KaChat is the conversation. PegLab is the unit the conversation can settle in without USDT. Real means a receipt (or a hosted real USD), a KaChat signer for that covenant, a pay payload, and postage in KAS/grams — not a tiny pool that pretends to be $1.

The rest of the product — phones vs PC, copy, support, agents, merchants, what never to do — is [VISION.md](VISION.md).

---

## Open KaChat from this site

KaChat is a mobile app. It does not support PC.

| Device | What this site does |
| --- | --- |
| Windows / macOS / Linux | Shows: **KaChat does not support PC.** No desktop client. Does not send the visitor to kachat.org as if the app will open. |
| iPhone / iPad | **Open KaChat** uses `kachat://` (registered in KaChat iOS). If the app is missing: [App Store id 6759102359](https://apps.apple.com/us/app/kachat/id6759102359). |
| Android | Chrome `intent://kapost` + package `com.kachat.app` (BROWSABLE host `kapost`; empty path just opens the app). If missing: [Play `com.kachat.app`](https://play.google.com/store/apps/details?id=com.kachat.app). |

`kachat.org` has no Apple App Site Association file, so Universal Links on that domain cannot open the app. The custom scheme is what works on a phone. Android does not accept a bare `kachat://` with no host.
