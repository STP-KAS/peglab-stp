# What PegLab is

**Dapps need a unit to run on. That unit does not have to be USDT or USDC.**

PegLab is a Kaspa-native alternative for that job: a covenant unit (tPEG) sequenced on Kaspa, backed by locked tKAS, with rules in the spend — not a bank, not Circle, not Tether.

This checkout is **Testnet-10 only**. If you treat tPEG as a US dollar it **will depeg**. The lab shows that on purpose. A cheap pool and an admin price are not a dollar. Dapps should still run on Kaspa rules (lock, redeem, escrow, fees) instead of waiting for a centralized stable to exist.

## One paragraph

Stablecoins on other chains are mostly cash in a company. Kaspa dapps (invoices, escrow, agents, games) need a predictable unit *on this network*. PegLab is the teaching object for that alternative: same shape as a “stable,” honest about failure, so the next build can be a receipt or a hosted real USD — not a fake peg.

## What it is / is not

| Is | Is not |
| --- | --- |
| A Testnet-10 lab for dapp money on Kaspa | A US dollar |
| tPEG = claim on locked tKAS | USDT / USDC / an issuer license |
| Public depeg: tiny pool cannot defend $1 | A token sale |
| Wallet: your KasWare **or** a local wallet paid from the host | Mainnet |

## How to try it

1. Open http://127.0.0.1:8765/ (from this repo: `npm run serve`).
2. **A** — Connect KasWare, switch it to **Testnet 10**, see your tKAS.  
   **B** — If you have no wallet, **Make local wallet + fund from host** (1 tKAS from `kaspatest:qzpvdaka…`).
3. Click **Run depeg lab**.
4. Read three numbers: admin price, pool price, redeem price. They disagree. That is the lesson for dapps: do not ship a toy dollar; ship Kaspa-native settlement or host a real USD.

Never paste a seed into the page. Mainnet `kaspa:` addresses are refused.

## Next, if you want a real dapp unit

See [STABLES-GUIDE.md](STABLES-GUIDE.md). Short version: do not raise money against tPEG. Host a named USD when it exists, or ship KAS receipts that never claim $1.

KaChat (chat + native KAS pay) is the first dapp that would feel this. How it would use PegLab, and the work to make that real: [KACHAT.md](KACHAT.md).

The product is a finished conversation on a phone, not a coin page. Full vision and the detailed to-do (people, postage, law, ops, agents — not only the covenant): [VISION.md](VISION.md).

This lab does not go to mainnet as money. What a successor would copy from other chains, how those projects were funded, and the checklist: [MAINNET.md](MAINNET.md).
