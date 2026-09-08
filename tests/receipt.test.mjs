import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  ReceiptError,
  genesis,
  lock,
  transfer,
  redeem,
  skimPrincipal,
  inspect,
  receiptDemo,
  MAX_SOMPI,
} from '../src/receipt.mjs';

const alice = '22'.repeat(32);
const bob = '33'.repeat(32);
const fee = 263_800n;

const throws = (fn, code) => {
  assert.throws(fn, (err) => err instanceof ReceiptError && err.code === code);
};

describe('receipt genesis', () => {
  it('starts empty with no oracle', () => {
    const snap = inspect(genesis());
    assert.equal(snap.lockedSompi, 0n);
    assert.equal(snap.circulating, 0n);
    assert.equal(snap.backedOneToOne, true);
    assert.equal(snap.oracle, 'none');
    assert.match(snap.warning, /NOT USD/);
  });
});

describe('lock transfer redeem', () => {
  it('keeps one unit equal to one locked sompi', () => {
    let {state, locked} = lock(genesis(), {owner: alice, sompi: 50_000_000n, sponsorFee: fee});
    assert.equal(locked, 50_000_000n);
    state = transfer(state, {from: alice, to: bob, quantity: 50_000_000n}).state;
    const {state: next, released} = redeem(state, {holder: bob, quantity: 20_000_000n, sponsorFee: fee});
    assert.equal(released, 20_000_000n);
    const snap = inspect(next);
    assert.equal(snap.lockedSompi, 30_000_000n);
    assert.equal(snap.circulating, 30_000_000n);
    assert.equal(snap.backedOneToOne, true);
    assert.equal(snap.sponsorFeesPaid, fee * 2n);
  });

  it('refuses skim, over-cap, and empty redeem', () => {
    throws(() => skimPrincipal(genesis(), {holder: alice, quantity: 1n}), 'SKIM');
    throws(() => lock(genesis(), {owner: alice, sompi: MAX_SOMPI + 1n, sponsorFee: fee}), 'RANGE');
    const locked = lock(genesis(), {owner: alice, sompi: MAX_SOMPI, sponsorFee: fee}).state;
    throws(() => lock(locked, {owner: alice, sompi: 1n, sponsorFee: fee}), 'OVER_CAP');
    throws(() => redeem(genesis(), {holder: alice, quantity: 1n, sponsorFee: fee}), 'BUDGET');
  });
});

describe('receipt demo', () => {
  it('ends empty, 1:1 the whole way, and records SKIM', () => {
    const demo = receiptDemo();
    const snap = inspect(demo.state);
    assert.equal(snap.lockedSompi, 0n);
    assert.equal(snap.circulating, 0n);
    assert.equal(snap.backedOneToOne, true);
    assert.equal(demo.skim, 'SKIM');
    assert.ok(demo.steps.every((step) => step.backedOneToOne));
  });
});
