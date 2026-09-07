# Known breaks

PegLab is supposed to fail as money. These reproductions are the deliverable.

All of them are encoded in `tests/peglab.test.mjs` and in the depeg-lab UI.

## 1. Admin sets a nonsense price

`postOracle` is a single key. After the admin posts `50_000` sompi/tPEG, the same `10_000_000` sompi mint issues **200 tPEG** instead of 100.

The toy “dollar” is whatever the key says.

## 2. Pool depth too small

Genesis seeds **2 tKAS + 2,000 tPEG**. A single `20_000_000` sompi (0.2 tKAS) swap moves the pool price by more than 500 bps (>5%).

A market maker this size cannot defend $1.

## 3. Stale oracle

`postOracle({ live: false })` zeros the price. Mint, redeem, and swaps refuse with `STALE_ORACLE`.

There is no independent feed to fall back on.

## 4. Two series, one display name

`genesis({ seriesId: 'aa'… })` and `genesis({ seriesId: 'bb'… })` are distinct. Units minted on A do not appear on B.

The UI must not treat the string “tPEG” as identity. Verify genesis outpoint, template hash, series bytes, and backing.

## 5. Cap hit

Minting `900_000_000` sompi at the default oracle would issue 9,000 tPEG, which exceeds remaining cap after the pool’s 2,000 inventory (`OVER_CAP`). Existing units still transfer and redeem.

## 6. Pause

Pause blocks mint and swaps. Redeem of existing units still works if the oracle is live and the pool stays above dust.

Pause is a brake, not a peg.

## 7. Drain / decouple

Depeg lab:

1. Genesis at 100,000 sompi/tPEG
2. Mint 100 tPEG
3. Admin posts 125,000 (+25%)
4. Swap 0.2 tKAS through the pool
5. Target ≠ pool price ≠ “a dollar”

Three numbers, none of them USD. Reproduce with `npm test` or **Run depeg lab** in the UI.
