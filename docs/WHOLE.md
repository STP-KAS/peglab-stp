# The whole scheme (keep it real)

This is the human job. Crypto is one rail. It is not the job.

If this file disagrees with a coin page, this file wins on *what to build for people*. [DOCTRINE.md](DOCTRINE.md) still wins on PegLab’s three objects. **TESTNET-10 LAB. NOT USD. DO NOT RAISE AGAINST tPEG.**

---

## 1. Pushback (the delusions)

| Delusion | Reality |
| --- | --- |
| People need a Kaspa stable so they can finish a chat | People need a **quote that matches how they think** (usually EUR/USD) and a **rail that actually pays**. Most already have that: bank, iDEAL, Tikkie, Wise, PayPal, cash. |
| Locking sompi freezes a $20 logo | It freezes **sompi**. If they quoted dollars, KAS still moved. A receipt is not a FX hedge. |
| PegLab / tPEG is the unit KaChat settles in | tPEG is a depeg toy. **tPEG cannot pay KaChat.** Parker’s receipt is sompi, not a dollar. |
| “Don’t send them to Circle to finish a Kaspa chat” | If the invoice is dollars, **a dollar rail is the honest finish**. Forcing Kaspa to be the dollar is how you mint a bridge IOU. |
| One ticker is chat + dollar + escrow + phone + raise | Those are different companies, laws, and failure modes. Mixing them is how Terra-shaped stories start. |
| Covenants replace courts and banks | Covenants are a **court file for coins you already accept**. They do not invoice a plumber in Eindhoven. |
| Build Circle from a 2 tKAS pool | Circle is equity, banks, exams, GENIUS. Budget is tens of millions and lawyers. This lab is a classroom. |

The freeze “they won’t send because KAS moved” is real. The solution is **not always a new asset**. Often it is: stop quoting dollars in a KAS pay button.

---

## 2. The job (no chain required)

Two people already talking. One owes the other a still number. Ghosts exist. Dust-as-a-first-screen is rude. Kids should not see a casino.

That job is invoicing + settlement + timeout. WhatsApp + Tikkie already does it for a lot of NL. iMessage + Apple Cash / bank transfer does it elsewhere. Email + SEPA does it for invoices. PayPal Goods & Services does it with a dispute desk.

KaChat is a **messenger that can also move KAS**. That is a niche. It is not a reason to reinvent the euro.

---

## 3. Split the objects (this is the scheme)

| Layer | Question | Honest answers |
| --- | --- | --- |
| **1. Conversation** | Where do they talk? | KaChat, Signal, WhatsApp, email. Do not wait for one app to win. |
| **2. Unit of account** | What number did they agree? | EUR, USD, or **KAS/sompi**. Pick one per quote. Write it. |
| **3. Quote lifetime** | How long is that number good? | 15 minutes / 48 hours / until delivered. Airline-style expiry. Not a peg. |
| **4. Settlement rail** | How does the money actually move? | **Fiat:** iDEAL, Tikkie, SEPA, Wise, cash, card. **Dollar-crypto:** named USDC/USDT when it exists. **KAS:** native pay. **Receipt:** locked sompi, redeemable 1:1, still not USD. |
| **5. Ghosts / escrow** | What if they vanish? | Fiat: PayPal G&S, notaries, just don’t prepay. KAS: timeout reclaim (Parker TN12 / `KaChatPayTimeout`). Receipt: same family. |
| **6. Postage** | Who pays the network? | Fiat: the bank. KAS: sponsor or grams so the receiver is not sent to buy dust first. |
| **7. Classroom** | What must never be listed as money? | PegLab tPEG. Any 2 tKAS pool. Any admin oracle as `$`. |

If layer 2 is EUR and layer 4 is KAS, the UI must say **“pay about N KAS (quote expires 21:14)”**. That is an FX banner, not a stablecoin.

If layer 2 is EUR and they need it still, layer 4 should be **fiat or a named dollar**. Do not invent tPEG.

---

## 4. Solutions that are not “another token”

Build these as product, not as SilverScript:

1. **Quote card in the thread** — amount, unit (EUR or KAS), expiry, pay / decline / expired. No new asset.
2. **EUR invoice, KAS optional** — default button is “I’ll pay in EUR” (copy IBAN / open Tikkie / open Wise). Secondary: “Pay in KAS at this quote.” Child Mode: EUR only, or no pay.
3. **Timeout on KAS pay** — already the real crypto edge. They claim now or you reclaim. Ship that on **KAS**, not on tPEG.
4. **FX banner** — CoinGecko (or any feed) is display. Stale feed → disable the KAS button. Do not mint.
5. **Don’t pay in chat at all** — send an invoice link. Chat stays talk. Settlement is the bank. This is how most real work is paid.
6. **Named dollar later** — if USDC/USDT is actually on Kaspa from an issuer you can name, list *that* asset id. Freeze is theirs. PegLab is not the issuer.
7. **Receipt only when the quote was sompi** — “lock 0.5 KAS until Friday.” Parker’s object. Useful. Not a euro.

Do not: sister token, 20% yield, admin oracle, mainnet the pool, raise against tPEG, PC KaChat, `$` on a receipt.

---

## 5. What this repo is allowed to be in that scheme

| Piece | Role |
| --- | --- |
| PegLab classroom | Show why a cheap pool is not layer 4. Public lesson. |
| Receipt ENGINE_SPEC | Teach 1 sompi = 1 sompi. Next real crypto box: live TN10 txids, then KaChat signs **that**, not tPEG. |
| KaChat copy on this site | Phone only. Open app or store. Never imply a PC client. |
| Doctrine | Parker has the unit. PegLab has the warning. Circle has the dollar. This file has the **job**. |

Done for a designer in a thread is: they got paid the number they agreed, in a rail they already trust, or they got their KAS back after a timeout. Done is **not** a new ticker.

---

## 6. Short version

Quote in the unit people mean (usually EUR). Settle on a rail that can pay that unit. Use KAS only when they agreed KAS. Use a receipt only when they agreed locked sompi. Use a named dollar only when a named issuer exists. Use PegLab only as the warning.

The scheme is a **conversation + an invoice + a rail + a timeout**. Crypto can be the rail. It must not kidnap the invoice.
