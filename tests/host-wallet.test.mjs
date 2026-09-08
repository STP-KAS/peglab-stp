import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {FAUCET_AMOUNT, requireTestnetAddress} from '../server/host-wallet.mjs';
import {SPONSOR_ADDRESS} from '../src/network.mjs';

describe('host faucet rules', () => {
  it('only pays kaspatest addresses', () => {
    assert.equal(requireTestnetAddress(SPONSOR_ADDRESS), SPONSOR_ADDRESS);
    assert.throws(() => requireTestnetAddress('kaspa:qqqq'), /kaspatest/);
    assert.throws(() => requireTestnetAddress(''), /kaspatest/);
  });

  it('caps a guest fill at 1 tKAS', () => {
    assert.equal(FAUCET_AMOUNT, 100_000_000n);
  });
});
