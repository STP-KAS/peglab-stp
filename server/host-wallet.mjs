import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {randomBytes} from 'node:crypto';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {NETWORK, RPC_URL, SPONSOR_ADDRESS} from '../src/network.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
export const FAUCET_AMOUNT = 100_000_000n; // 1 tKAS
export const MIN_RELAY_RATE = 100; // sompi / gram, Toccata node policy
export const MAX_FAUCET_FEE = 1_000_000n;
export const MIN_CHANGE = 1_000n;
// CONTROL genesis output encoding on Toccata (covenant id + authorizing input).
export const CONTROL_COVENANT_BYTES = 34;
const PLACEHOLDER_SIG = '41' + '00'.repeat(64) + '01';

function integer(value, min, max) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) throw new Error('Invalid mass integer.');
  return n;
}

function sompi(value) {
  const n = BigInt(value);
  if (n <= 0n) throw new Error('Zero-value input or output.');
  return n;
}

// Native v1 mass, same Toccata rules as kaspa-explained publicTransactionMass.
export function nativeMass(transaction, {feeRate = MIN_RELAY_RATE} = {}) {
  if (!Number.isFinite(feeRate) || feeRate < MIN_RELAY_RATE || feeRate > 100000) {
    throw new Error('Invalid relay fee rate.');
  }
  const inputs = transaction.inputs;
  const outputs = transaction.outputs;
  const size = 94 + inputs.reduce((s, i) => s + 54 + (i.signatureScript?.length ?? 0) / 2, 0)
    + outputs.reduce((s, o) => s + 18 + o.scriptPublicKey.script.length / 2, 0);
  const covenantBytes = [...outputs].reduce((s, o) => s + (o.covenant ? CONTROL_COVENANT_BYTES : 0), 0);
  const computeMass = size
    + outputs.reduce((s, o) => s + (2 + o.scriptPublicKey.script.length / 2) * 10, 0)
    + inputs.reduce((s, i) => s + integer(i.computeBudget, 0, 65535) * 100, 0)
    + covenantBytes;
  const C = 1_000_000_000_000n;
  const plurality = (scriptLen, extra = 0) => BigInt(Math.ceil((63 + scriptLen / 2 + extra) / 100));
  const inputCells = inputs.map((i) => {
    const entry = i.utxo?.entry ?? i.utxo;
    const script = entry?.scriptPublicKey?.script ?? '';
    return {value: sompi(i.utxo.amount), plurality: plurality(script.length)};
  });
  const outputCells = outputs.map((o) => ({
    value: sompi(o.value),
    plurality: plurality(o.scriptPublicKey.script.length),
  }));
  const pOut = outputCells.reduce((s, c) => s + c.plurality, 0n);
  const pIn = inputCells.reduce((s, c) => s + c.plurality, 0n);
  const harmonic = (cells) => cells.reduce((s, c) => s + C * c.plurality * c.plurality / c.value, 0n);
  let inTerm;
  if (pOut === 1n || pIn === 1n || (pOut === 2n && pIn === 2n)) inTerm = harmonic(inputCells);
  else {
    const sum = inputCells.reduce((s, c) => s + c.value, 0n);
    const mean = sum / pIn;
    inTerm = pIn * (C / (mean > 0n ? mean : 1n));
  }
  const hOut = harmonic(outputCells);
  const storageMass = hOut > inTerm ? hOut - inTerm : 0n;
  const normalizedTransientMass = size * 2;
  const minimumFee = BigInt(Math.ceil(Math.max(computeMass, normalizedTransientMass) * feeRate));
  return {
    computeMass,
    storageMass: String(storageMass),
    feeRate,
    minimumFee: String(minimumFee),
    withinBlockLimits: computeMass <= 500000 && storageMass <= 500000n,
  };
}

export function requireTestnetAddress(address) {
  if (typeof address !== 'string' || !address.startsWith('kaspatest:') || address.length < 20 || address.length > 128) {
    throw new Error('Faucet only pays kaspatest: addresses on Testnet-10.');
  }
  return address;
}

function loadSdk() {
  const path = process.env.KASPA_SDK ||
    resolve(process.env.USERPROFILE || '', 'kaspa-explained/.cache/upstream/kaspa-wasm32-sdk/nodejs/kaspa/kaspa.js');
  return require(path);
}

export async function loadSponsor() {
  const saved = JSON.parse(await readFile(resolve(ROOT, '.local/sponsor.json'), 'utf8'));
  if (saved.network !== NETWORK) throw new Error('Sponsor file is not Testnet-10.');
  if (saved.address !== SPONSOR_ADDRESS) throw new Error('Sponsor file address mismatch.');
  if (!saved.key) throw new Error('Sponsor file has no key.');
  return saved;
}

export async function withRpc(action) {
  const sdk = loadSdk();
  const rpc = new sdk.RpcClient({url: RPC_URL, networkId: NETWORK});
  await rpc.connect({blockAsyncConnect: true, timeoutDuration: 8000});
  try {
    const info = await rpc.getServerInfo();
    if (info.networkId !== NETWORK || info.isSynced !== true || info.hasUtxoIndex !== true) {
      throw new Error('Wrong or unsynchronized Testnet-10 node.');
    }
    return await action(sdk, rpc);
  } finally {
    await rpc.disconnect();
  }
}

export async function addressBalance(address) {
  return withRpc(async (sdk, rpc) => {
    const {entries} = await rpc.getUtxosByAddresses([address]);
    const confirmed = entries.reduce((n, e) => n + BigInt(e.amount), 0n);
    return {
      address,
      utxos: entries.length,
      confirmedSompi: confirmed.toString(),
      confirmedTkas: (Number(confirmed) / 1e8).toFixed(8),
    };
  });
}

function selectInputs(entries, scriptHex, need) {
  const plain = entries.filter((e) => {
    const spk = e.entry?.scriptPublicKey ?? e.scriptPublicKey;
    const cov = e.entry?.covenantId ?? e.covenantId;
    return !cov && spk?.version === 0 && spk?.script === scriptHex && BigInt(e.amount) > 0n;
  });
  const enough = plain.filter((e) => BigInt(e.amount) >= need).sort((a, b) => {
    const d = BigInt(a.amount) - BigInt(b.amount);
    return d < 0n ? -1 : d > 0n ? 1 : 0;
  });
  if (enough[0]) return {selected: [enough[0]], total: BigInt(enough[0].amount)};
  const largest = [...plain].sort((a, b) => {
    const d = BigInt(b.amount) - BigInt(a.amount);
    return d < 0n ? -1 : d > 0n ? 1 : 0;
  });
  const selected = [];
  let total = 0n;
  for (const utxo of largest.slice(0, 8)) {
    selected.push(utxo);
    total += BigInt(utxo.amount);
    if (total >= need) return {selected, total};
  }
  throw new Error('Host wallet has no UTXO set that covers the faucet amount plus fee. Send tKAS to the host address first.');
}

export async function sendFromHost({destination, amount = FAUCET_AMOUNT}) {
  destination = requireTestnetAddress(destination);
  amount = BigInt(amount);
  if (amount < 10_000_000n || amount > FAUCET_AMOUNT) {
    throw new Error('Faucet amount must be between 0.1 and 1 tKAS.');
  }
  const sponsor = await loadSponsor();
  if (destination === sponsor.address) throw new Error('Faucet will not send to the host address.');
  return withRpc(async (sdk, rpc) => {
    const key = new sdk.PrivateKey(sponsor.key);
    const from = key.toAddress(NETWORK).toString();
    if (from !== sponsor.address) throw new Error('Sponsor key does not match the host address.');
    const own = sdk.payToAddressScript(new sdk.Address(from));
    const dest = sdk.payToAddressScript(new sdk.Address(destination));
    const estimate = await rpc.getFeeEstimate();
    const feeRate = Math.max(MIN_RELAY_RATE, Math.ceil(estimate.estimate.priorityBucket.feerate || MIN_RELAY_RATE));
    const {entries} = await rpc.getUtxosByAddresses([from]);
    let fee = 1_000n;
    let selected;
    let total;
    let tx;
    let mass;
    for (let attempt = 0; attempt < 8; attempt++) {
      if (fee > MAX_FAUCET_FEE) throw new Error('Faucet fee would exceed 0.01 tKAS.');
      ({selected, total} = selectInputs(entries, own.script, amount + fee + MIN_CHANGE));
      const change = total - amount - fee;
      tx = new sdk.Transaction({
        version: 1,
        inputs: selected.map((e) => ({
          previousOutpoint: e.outpoint,
          utxo: e,
          signatureScript: PLACEHOLDER_SIG,
          sequence: 0n,
          sigOpCount: 0,
          computeBudget: 16,
        })),
        outputs: [
          {value: amount, scriptPublicKey: dest},
          {value: change, scriptPublicKey: own},
        ],
        lockTime: 0n,
        subnetworkId: '00'.repeat(20),
        gas: 0n,
        payload: '',
      });
      mass = nativeMass(tx, {feeRate});
      if (!mass.withinBlockLimits) throw new Error('Faucet transaction exceeds block mass limits.');
      const need = BigInt(mass.minimumFee);
      if (fee < need) {
        fee = need;
        continue;
      }
      tx.storageMass = BigInt(mass.storageMass);
      break;
    }
    if (!mass || fee < BigInt(mass.minimumFee)) throw new Error('Could not meet the node fee for this faucet payment.');
    for (let i = 0; i < tx.inputs.length; i++) {
      tx.inputs[i].signatureScript = sdk.createInputSignature(tx, i, key);
    }
    const checked = nativeMass(tx, {feeRate});
    if (fee < BigInt(checked.minimumFee) || !checked.withinBlockLimits) {
      throw new Error('Signed faucet payment failed mass verification.');
    }
    tx.storageMass = BigInt(checked.storageMass);
    tx.finalize();
    const result = await rpc.submitTransaction({transaction: tx, allowOrphan: false});
    if (result.transactionId !== tx.id) throw new Error('Unexpected faucet transaction ID.');
    return {
      network: NETWORK,
      from,
      to: destination,
      amountSompi: amount.toString(),
      amountTkas: (Number(amount) / 1e8).toFixed(8),
      feeSompi: fee.toString(),
      computeMass: checked.computeMass,
      transactionId: tx.id,
    };
  });
}

export function createGuestKey() {
  const sdk = loadSdk();
  const key = new sdk.PrivateKey(randomBytes(32).toString('hex'));
  const address = key.toAddress(NETWORK).toString();
  if (!address.startsWith('kaspatest:')) throw new Error('Guest wallet is not Testnet-10.');
  return {network: NETWORK, address, key: key.toString()};
}
