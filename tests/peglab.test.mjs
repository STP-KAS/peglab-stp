import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  PegError,
  genesis,
  mint,
  redeem,
  transfer,
  swapKas,
  swapTpeg,
  postOracle,
  setPause,
  seedPool,
  withdrawPool,
  inspect,
  depegDemo,
  walletPrompt,
  MAX_TPEG,
  DEFAULT_ORACLE,
  DEFAULT_POOL_KAS,
  DEFAULT_POOL_TPEG,
} from '../src/engine.mjs';
import {NETWORK, SPONSOR_ADDRESS, SPONSOR_XONLY, SERIES_ID, GENESIS_POOL_SOMPI, MINING_ADDRESS, PUBLIC_DOMAIN, PUBLIC_SITE_URL} from '../src/network.mjs';

const admin = '11'.repeat(32);
const alice = '22'.repeat(32);
const bob = '33'.repeat(32);

const throws = (fn, code) => {
  assert.throws(fn, (err) => err instanceof PegError && err.code === code);
};

describe('genesis', () => {
  it('seeds a tiny pool under the teaching caps', () => {
    const snap = inspect(genesis());
    assert.equal(snap.poolTkas, DEFAULT_POOL_KAS);
    assert.equal(snap.poolTpeg, DEFAULT_POOL_TPEG);
    assert.equal(snap.capRemaining, MAX_TPEG - DEFAULT_POOL_TPEG);
    assert.equal(snap.circulating, 0n);
    assert.equal(snap.oraclePrice, DEFAULT_ORACLE);
    assert.equal(snap.cannotDefendPeg, true);
    assert.match(snap.warning, /WILL DEPEG/);
  });
});

describe('mint and redeem', () => {
  it('mints whole tPEG at the oracle and conserves the tPEG budget', () => {
    const {state, minted} = mint(genesis(), {tkasIn: 10_000_000n, minter: alice});
    assert.equal(minted, 100n);
    const snap = inspect(state);
    assert.equal(snap.circulating, 100n);
    assert.equal(snap.capRemaining, MAX_TPEG - DEFAULT_POOL_TPEG - 100n);
    assert.equal(snap.tpegBudget, MAX_TPEG);
    assert.equal(snap.poolTkas, DEFAULT_POOL_KAS + 10_000_000n);
  });

  it('refuses unaligned tKAS, over-cap, and pause', () => {
    throws(() => mint(genesis(), {tkasIn: 100_001n, minter: alice}), 'ALIGN');
    throws(() => mint(genesis(), {tkasIn: 900_000_000n, minter: alice}), 'OVER_CAP');
    const paused = setPause(genesis(), {paused: true, admin}).state;
    throws(() => mint(paused, {tkasIn: 100_000n, minter: alice}), 'PAUSED');
  });

  it('redeems at the oracle even while paused, and restores cap', () => {
    let state = mint(genesis(), {tkasIn: 10_000_000n, minter: alice}).state;
    state = setPause(state, {paused: true, admin}).state;
    const {state: next, released} = redeem(state, {units: 40n, holder: alice});
    assert.equal(released, 40n * DEFAULT_ORACLE);
    const snap = inspect(next);
    assert.equal(snap.circulating, 60n);
    assert.equal(snap.paused, true);
    assert.equal(snap.tpegBudget, MAX_TPEG);
  });

  it('refuses a stale oracle for mint and redeem', () => {
    const stale = postOracle(genesis(), {live: false, admin}).state;
    throws(() => mint(stale, {tkasIn: 100_000n, minter: alice}), 'STALE_ORACLE');
    const minted = mint(genesis(), {tkasIn: 10_000_000n, minter: alice}).state;
    const dead = postOracle(minted, {live: false, admin}).state;
    throws(() => redeem(dead, {units: 1n, holder: alice}), 'STALE_ORACLE');
  });
});

describe('transfer', () => {
  it('moves units without touching the pool', () => {
    const minted = mint(genesis(), {tkasIn: 10_000_000n, minter: alice}).state;
    const {state} = transfer(minted, {from: alice, to: bob, units: 25n});
    const snap = inspect(state);
    assert.equal(snap.poolTkas, minted.poolTkas);
    assert.deepEqual(
      snap.units.map((u) => [u.owner, u.quantity]),
      [
        [alice, 75n],
        [bob, 25n],
      ],
    );
  });
});

describe('tiny pool', () => {
  it('moves the price on a modest swap', () => {
    const before = inspect(genesis());
    const {state, tpegOut} = swapKas(genesis(), {tkasIn: 20_000_000n, trader: alice});
    const after = inspect(state);
    assert.ok(tpegOut >= 1n);
    assert.ok(after.depegBps > 500n, `expected >5% move, got ${after.depegBps} bps`);
    assert.notEqual(after.poolPrice, before.poolPrice);
  });

  it('refuses a swap that would breach dust', () => {
    const shallow = genesis({poolTkas: 1_000_000n, poolTpeg: 1n});
    throws(() => swapKas(shallow, {tkasIn: 1_000_000_000n, trader: alice}), 'BUDGET');
  });

  it('round-trips tPEG through the pool without minting extra budget', () => {
    let state = mint(genesis(), {tkasIn: 10_000_000n, minter: alice}).state;
    const sold = 50n;
    const {state: mid, kasOut} = swapTpeg(state, {units: sold, trader: alice});
    assert.ok(kasOut >= 1n);
    const {state: back} = swapKas(mid, {tkasIn: kasOut, trader: alice});
    const snap = inspect(back);
    assert.equal(snap.tpegBudget, MAX_TPEG);
    assert.equal(snap.capRemaining + snap.circulating + snap.poolTpeg, MAX_TPEG);
  });
});

describe('admin', () => {
  it('rejects a foreign admin key', () => {
    throws(() => postOracle(genesis(), {price: 1n, admin: alice}), 'BAD_ADMIN');
  });

  it('posts a nonsense price and mis-prices mint', () => {
    const moved = postOracle(genesis(), {price: 50_000n, admin}).state;
    const {minted} = mint(moved, {tkasIn: 10_000_000n, minter: alice});
    assert.equal(minted, 200n);
  });

  it('keeps the pool inside the 2 tKAS seed bound', () => {
    throws(() => seedPool(genesis(), {tkasIn: 1n, admin}), 'TINY_POOL');
    const cut = withdrawPool(genesis(), {tkasOut: 50_000_000n, admin}).state;
    const {state} = seedPool(cut, {tkasIn: 10_000_000n, admin});
    assert.equal(state.poolTkas, DEFAULT_POOL_KAS - 40_000_000n);
  });
});

describe('name is not identity', () => {
  it('two series with the same display name stay distinct', () => {
    const a = genesis({seriesId: 'aa'.repeat(32)});
    const b = genesis({seriesId: 'bb'.repeat(32)});
    assert.notEqual(a.seriesId, b.seriesId);
    const minted = mint(a, {tkasIn: 100_000n, minter: alice}).state;
    assert.equal(inspect(b).circulating, 0n);
    assert.equal(inspect(minted).circulating, 1n);
  });
});

describe('testnet sponsor', () => {
  it('pins the documented Testnet-10 address and 2 tKAS genesis pool', () => {
    assert.equal(NETWORK, 'testnet-10');
    assert.equal(SPONSOR_ADDRESS, 'kaspatest:qzpvdakagvwfm95g8pv9ndpupjtndgjfhmve08cg3tv5wgfytjzf7cudwwzv0');
    assert.equal(SPONSOR_XONLY, '82c6f6dd431c9d9688385859b43c0c9736a249bed9979f088ad94721245c849f');
    assert.match(MINING_ADDRESS, /^kaspatest:qqup3k4r/);
    assert.equal(PUBLIC_DOMAIN, 'peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club');
    assert.equal(PUBLIC_SITE_URL, 'https://stp-kas.github.io/peglab-stp/');
    assert.equal(SERIES_ID.length, 64);
    assert.equal(GENESIS_POOL_SOMPI, 200_000_000n);
  });
});

describe('depeg lab', () => {
  it('reproduces the advertised break', () => {
    const demo = depegDemo();
    assert.equal(demo.steps.length, 5);
    const last = demo.steps[4];
    assert.notEqual(last.targetSompiPerTpeg, last.poolSompiPerTpeg);
    assert.ok(BigInt(last.depegBps) > 0n);
    assert.match(last.lesson, /cannot pull them together/);
  });

  it('wallet prompt cannot be screenshotted without the warning', () => {
    const text = walletPrompt('mint 100 tPEG', genesis());
    assert.match(text, /WILL DEPEG/);
    assert.match(text, /cannot defend a peg/i);
  });
});
