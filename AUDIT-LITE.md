# Audit-lite

This is not an audit. It is the security story you can buy with a $50k–$300k toy: tests, a threat model, and a list of things a real audit would still have to do. Do not put a badge on this repository.

## Invariants the engine checks

| Invariant | Rule |
| --- | --- |
| tPEG budget | `capRemaining + circulating + poolTpeg <= 10_000` |
| Backing cap | `poolTkas <= 1_000_000_000` sompi |
| Tiny pool | seed/withdraw cannot push pool tKAS above `200_000_000` |
| Dust | pool tKAS `>= 1_000_000`, pool tPEG `>= 1` after protocol ops |
| Oracle | mint / redeem / swap require `oracleLive && oraclePrice > 0` |
| Pause | mint and swap fail closed; redeem stays open |
| Cap | mint cannot exceed `capRemaining`; redeem restores cap |
| Alignment | mint tKAS must be a multiple of the oracle price |
| Admin | oracle, pause, seed, withdraw require the CONTROL admin key |
| Conservation | transfer conserves units; swaps conserve `k = poolTkas * poolTpeg` up to integer floor |

The SilverScript contract (`contracts/PegLab.sil`) is compiled with official `silverc` v1-rc1 and checked in as `contracts/PegLab.json`. It encodes the same operation codes. The **executable spec for this repo is `src/engine.mjs`**. Unsigned Kaspa transactions are not broadcast from this repository.

## Accepted vs rejected

| Path | Result |
| --- | --- |
| Genesis with 2 tKAS / 2,000 tPEG | accepted |
| Mint whole tPEG at a live oracle | accepted |
| Redeem while paused | accepted |
| Transfer to another holder | accepted |
| Swap that moves the pool >5% | accepted (this is the toy) |
| Unaligned mint | rejected `ALIGN` |
| Over cap | rejected `OVER_CAP` |
| Mint/swap while paused | rejected `PAUSED` |
| Stale oracle | rejected `STALE_ORACLE` |
| Foreign admin key | rejected `BAD_ADMIN` |
| Seed past 2 tKAS | rejected `TINY_POOL` |
| Swap/redeem through dust | rejected `POOL_DUST` / `EMPTY_POOL` / `BUDGET` |

## Threat model (honest)

| Threat | Status |
| --- | --- |
| Admin key compromise | Total. Oracle, pause, and pool seed/withdraw are one key. |
| Oracle nonsense | Intended. There is no second feed. |
| Pool drain / price impact | Intended. Depth is the lesson. |
| Series impersonation | Mitigated only if clients verify genesis, not the ticker. |
| Integer floor on AMM | Conserves tPEG budget; a round-trip can still move inventory. Not a peg defense. |
| Foreign-state framing | Not used. v1-rc1 `readInputState` of a foreign covenant is forbidden here. |
| Sponsor fee skim of principal | Contract requires a positive fee inside `maxFee` and keeps UNIT cells at 1000 sompi. Engine does not model fee theft; a wallet must still show the sponsor change. |
| Indexer fork / UI lie | UI can show the wrong series. Name is not identity. |
| Compiler / opcode change | SilverScript is experimental. Artifact is pinned; language is not. |

## What a real audit would still do

- Independent review of `PegLab.sil` against a pinned `silverc` and a pinned rusty-kaspa script engine
- Signed Testnet-10 broadcasts for every accepted and rejected path, not only the JS engine
- Mass/size tx-v1 budgets on a current node
- Admin-key compromise playbook and a second key
- Formal statement that this is **not** a payment stablecoin under any jurisdiction
- Client verification of genesis outpoint and template hash
- Fuzzing of constant-product overflow / zero-division
- Upgrade/migration story (this toy has none)

Until those exist, the honest label remains: **audit-lite, tiny pool, will depeg**.
