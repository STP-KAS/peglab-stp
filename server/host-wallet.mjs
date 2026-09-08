import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {randomBytes} from 'node:crypto';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {NETWORK, RPC_URL, SPONSOR_ADDRESS} from '../src/network.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
export const FAUCET_AMOUNT = 100_000_000n; // 1 tKAS
export const FAUCET_FEE = 100_000n;
export const MIN_CHANGE = 1_000n;

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
    const {entries} = await rpc.getUtxosByAddresses([from]);
    const {selected, total} = selectInputs(entries, own.script, amount + FAUCET_FEE + MIN_CHANGE);
    const change = total - amount - FAUCET_FEE;
    const tx = new sdk.Transaction({
      version: 1,
      inputs: selected.map((e) => ({
        previousOutpoint: e.outpoint,
        utxo: e,
        signatureScript: '',
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
    for (let i = 0; i < tx.inputs.length; i++) {
      tx.inputs[i].signatureScript = sdk.createInputSignature(tx, i, key);
    }
    tx.finalize();
    const result = await rpc.submitTransaction({transaction: tx, allowOrphan: false});
    if (result.transactionId !== tx.id) throw new Error('Unexpected faucet transaction ID.');
    return {
      network: NETWORK,
      from,
      to: destination,
      amountSompi: amount.toString(),
      amountTkas: (Number(amount) / 1e8).toFixed(8),
      feeSompi: FAUCET_FEE.toString(),
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
