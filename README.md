# PegLab

**Dapps need a unit to run on. That unit does not have to be USDT or USDC.**

PegLab is a Kaspa-native **alternative for stablecoins** so apps can invoice, escrow, and pay on Kaspa without a bank issuer. tPEG is a covenant claim on locked tKAS, not a US dollar.

This repo is the **Testnet-10 lab**. If you treat tPEG as USD it **will depeg**. That is shown on purpose. Read [IDEA.md](IDEA.md) for the one-page story.

**TESTNET-10 · NOT USD · NOT AN ISSUER · NOT A TOKEN SALE**

| What you get | What you do not get |
| --- | --- |
| SilverScript covenant + economic engine | A bank, a Circle/Tether license, or T-bills |
| Tests that reproduce the depeg | A paid firm audit or a badge |
| A 2 tKAS / 2,000 tPEG pool | A market maker |
| One admin-posted price | Multi-feed oracles |
| Honest wallet copy | 1:1 USD redemption |

A name is not authenticity. Anybody can compile a similarly named series. Verify genesis outpoint, template hash, series bytes, and backing.

## Why it depegs

A peg survives on **reserves, liquidity, and an operator who can be sued**. This toy has:

- **10 tKAS** of maximum backing
- **10,000 tPEG** of maximum supply
- **2 tKAS** of pool seed (the “tiny pool”)
- **one admin key** as the oracle

The depeg lab mints at the oracle, moves the oracle +25%, then sells tKAS through the pool. Target, pool price, and redeem price disagree. The pool cannot pull them together. That is the product.

Run it:

```bash
npm test
npm run fixtures
npm run serve
```

Then open `http://127.0.0.1:8765/`. Public copy (no host faucet): **https://peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club** — DNS steps in [DNS.md](DNS.md).

How to try it:

1. **A** — Connect KasWare on **Testnet 10**, see tKAS.  
   **B** — No wallet? **Make local wallet + fund from host** (1 tKAS).
2. Click **Run depeg lab**.
3. Three prices (admin, pool, redeem) will disagree. That is why this is not a bank stable.

The page never asks for a seed. Mainnet `kaspa:` is refused.

## Testnet-10 sponsor

Dedicated PegLab wallet (receive index 0). The seed/key is **not** in git.

`kaspatest:qzpvdakagvwfm95g8pv9ndpupjtndgjfhmve08cg3tv5wgfytjzf7cudwwzv0`

Mining payouts still land on:

`kaspatest:qqup3k4ru5uhj9swa05afa3zqcwkyhtv9vz9dme68cglza73mc5yk4r7an5cj`

Send **at least 2.01 tKAS** from the miner to the PegLab wallet, then:

```bash
npm run genesis
npm run genesis:submit
```

`--submit` reads gitignored `.local/sponsor.json` or `PEGLAB_SPONSOR_KEY`. Genesis locks **2 tKAS** in CONTROL, fee cap **0.01 tKAS**, change back to the PegLab address. Journal: `artifacts/testnet-genesis.json`.

## Layout

```
contracts/PegLab.sil     Testnet-10 covenant (compiled JSON checked in)
src/engine.mjs           Executable economic spec (browser + Node)
server/peglab.mjs        Fixtures + silverc wrapper
web/                     Depeg-lab UI
tests/                   Reject paths, conservation, depeg reproduction
IDEA.md                  What PegLab is: dapp unit on Kaspa, not a bank dollar
VISION.md                Finished conversation on a phone: full vision and to-do beyond the chain
MAINNET.md               What a successor would need to leave the lab; other-chain PoCs and how they were funded
BATTLE.md                PegLab scored against Parker’s kaspa-explained / TN12 receipt PoC
KACHAT.md                How KaChat could use that unit, and what must be built first
STABLES-GUIDE.md         Capital ladder, other-chain practice, fundraising pushback
AUDIT-LITE.md            What was checked; what a real audit would still do
KNOWN-BREAKS.md          Required failure reproductions
```

## Caps (teaching scale)

- Network: **Kaspa Testnet-10 only**
- Backing cap: `1_000_000_000` sompi (10 tKAS)
- tPEG cap: `10_000` integer units
- Fee cap: `3_000_000` sompi, paid by a sponsor input
- Unit cell: `1_000` sompi (not backing)
- Pool dust: `1_000_000` sompi and `1` tPEG
- Default oracle: `100_000` sompi per tPEG

Mint and redeem use the oracle. Swaps use constant-product on the tiny pool. Pause blocks mint and swaps; redeem of existing units still works if the oracle is live and backing remains.

## Compile

Requires [silverc v1-rc1](https://github.com/kaspanet/silverscript/releases/tag/v1-rc1). On this machine the wrapper looks for `%USERPROFILE%\tools\silverc\silverc.exe`, or `$SILVERC`.

```bash
npm run compile
```

The covenant uses `#[covenant(binding = cov, from = 3, to = 3)]`. It does not `readInputState` of a foreign covenant.

## What this is not

Want a Kaspa dollar instead of this toy? Read [STABLES-GUIDE.md](STABLES-GUIDE.md). Short version: do not raise money against tPEG; host a real USD when it exists; or ship KAS receipts that never claim $1.

Not [1kUSD](https://github.com/NeaBouli/1kUSD). That is a larger research program. PegLab does not import Solidity and does not claim that track’s product objective.

Not mainnet. There is no deploy script for `kaspa:`. Do not put real funds in this.

## License

MIT. No warranty. Will depeg.
