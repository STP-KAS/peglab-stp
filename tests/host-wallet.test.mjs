import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {FAUCET_AMOUNT, MIN_RELAY_RATE, nativeMass, requireTestnetAddress} from '../server/host-wallet.mjs';
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

  it('prices a 1-in 2-out P2PK faucet at compute mass 2638 * 100 sompi', () => {
    const p2pk = {version: 0, script: '20' + 'ab'.repeat(32) + 'ac'};
    const tx = {
      inputs: [{
        computeBudget: 16,
        signatureScript: '41' + '00'.repeat(64) + '01',
        utxo: {amount: 200_000_000n, entry: {scriptPublicKey: p2pk}},
      }],
      outputs: [
        {value: 100_000_000n, scriptPublicKey: p2pk},
        {value: 99_736_200n, scriptPublicKey: p2pk},
      ],
    };
    const mass = nativeMass(tx, {feeRate: MIN_RELAY_RATE});
    assert.equal(mass.computeMass, 2638);
    assert.equal(mass.minimumFee, '263800');
    assert.ok(100_000n < BigInt(mass.minimumFee));
  });
});
