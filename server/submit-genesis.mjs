// Review (default) or submit PegLab CONTROL genesis on Testnet-10.
// --submit uses PEGLAB_SPONSOR_KEY, or gitignored .local/sponsor.json.
// The key must derive SPONSOR_ADDRESS. Never commit that file.
import {mkdtemp, writeFile, readFile, rm, mkdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createRequire} from 'node:module';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  NETWORK,
  RPC_URL,
  SPONSOR_ADDRESS,
  SPONSOR_XONLY,
  SERIES_ID,
  GENESIS_POOL_SOMPI,
  MAX_GENESIS_FEE,
  MINING_ADDRESS,
} from '../src/network.mjs';
import {DEFAULT_ORACLE, DEFAULT_POOL_TPEG, MAX_FEE, MAX_TPEG} from '../src/engine.mjs';
import {silvercPath} from './peglab.mjs';

const execute = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const hex32 = (value, label) => {
  if (typeof value !== 'string' || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new Error(`Expected 32-byte hex for ${label}.`);
  }
  return value.toLowerCase();
};

function loadSdk() {
  const path = process.env.KASPA_SDK ||
    resolve(process.env.USERPROFILE || '', 'kaspa-explained/.cache/upstream/kaspa-wasm32-sdk/nodejs/kaspa/kaspa.js');
  return require(path);
}

async function compileControl({owner, series}) {
  owner = hex32(owner, 'owner');
  series = hex32(series, 'series');
  await mkdir(resolve(ROOT, '.cache'), {recursive: true});
  const directory = await mkdtemp(resolve(ROOT, '.cache', 'genesis-compile-'));
  try {
    const args = [
      {kind: 'bytes', value: [...Buffer.from(series, 'hex')]},
      {kind: 'int', value: Number(MAX_FEE)},
      {kind: 'bytes', value: [...Buffer.from(owner, 'hex')]},
      {kind: 'int', value: 1},
      {kind: 'int', value: 0},
      {kind: 'int', value: Number(DEFAULT_ORACLE)},
      {kind: 'int', value: 1},
      {kind: 'int', value: 0},
      {kind: 'int', value: Number(MAX_TPEG - DEFAULT_POOL_TPEG)},
      {kind: 'int', value: Number(DEFAULT_POOL_TPEG)},
    ];
    const input = resolve(directory, 'args.json');
    const output = resolve(directory, 'artifact.json');
    await writeFile(input, JSON.stringify(args));
    await execute(silvercPath(), [resolve(ROOT, 'contracts/PegLab.sil'), '--constructor-args', input, '-o', output], {
      timeout: 30000,
      maxBuffer: 2_000_000,
    });
    const artifact = JSON.parse(await readFile(output, 'utf8'));
    const bytecode = artifact.contracts?.PegLab?.compiled?.bytecode;
    if (!bytecode) throw new Error('Compiler did not emit PegLab bytecode.');
    return {artifact, script: Buffer.from(bytecode).toString('hex'), owner, series};
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
}

function selectFunding(entries, scriptHex, need) {
  const plain = entries.filter((e) => {
    const spk = e.entry?.scriptPublicKey ?? e.scriptPublicKey;
    const cov = e.entry?.covenantId ?? e.covenantId;
    return !cov && spk?.version === 0 && spk?.script === scriptHex;
  });
  const enough = plain
    .filter((e) => BigInt(e.amount) >= need)
    .sort((a, b) => {
      const d = BigInt(a.amount) - BigInt(b.amount);
      return d < 0n ? -1 : d > 0n ? 1 : 0;
    });
  if (!enough.length) {
    throw new Error(
      `Sponsor ${SPONSOR_ADDRESS} has no UTXO covering 2 tKAS + fee. Send at least 2.01 tKAS from ${MINING_ADDRESS}, then retry.`,
    );
  }
  return enough[0];
}

async function loadSponsorKey() {
  if (process.env.PEGLAB_SPONSOR_KEY) return process.env.PEGLAB_SPONSOR_KEY.trim();
  try {
    const saved = JSON.parse(await readFile(resolve(ROOT, '.local/sponsor.json'), 'utf8'));
    if (saved.network !== NETWORK) throw new Error('Local sponsor file is not Testnet-10.');
    if (saved.address !== SPONSOR_ADDRESS) throw new Error('Local sponsor file address mismatch.');
    if (!saved.key) throw new Error('Local sponsor file has no key.');
    return saved.key;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error('Set PEGLAB_SPONSOR_KEY or create gitignored .local/sponsor.json.');
    }
    throw error;
  }
}

function placeholderSig(sdk, tx, index) {
  tx.inputs[index].signatureScript = '41' + '00'.repeat(64) + '01';
}

export async function planGenesis({submit = false} = {}) {
  if (NETWORK !== 'testnet-10') throw new Error('PegLab genesis is Testnet-10 only.');
  const sdk = loadSdk();
  const compiled = await compileControl({owner: SPONSOR_XONLY, series: SERIES_ID});
  const rpc = new sdk.RpcClient({url: RPC_URL, networkId: NETWORK});
  await rpc.connect({blockAsyncConnect: true, timeoutDuration: 8000});
  try {
    const info = await rpc.getServerInfo();
    if (info.networkId !== NETWORK || info.isSynced !== true || info.hasUtxoIndex !== true) {
      throw new Error('Wrong or unsynchronized Testnet-10 node.');
    }
    const {entries} = await rpc.getUtxosByAddresses([SPONSOR_ADDRESS]);
    const own = sdk.payToAddressScript(new sdk.Address(SPONSOR_ADDRESS));
    if (own.script.slice(2, 66) !== SPONSOR_XONLY) throw new Error('Sponsor address does not match pinned x-only key.');
    const estimate = await rpc.getFeeEstimate();
    const feeRate = Math.max(100, Math.ceil(estimate.estimate.priorityBucket.feerate));
    let fee = 100_000n;
    let selected;
    let tx;
    for (let attempt = 0; attempt < 6; attempt++) {
      if (fee > MAX_GENESIS_FEE) throw new Error('Genesis fee would exceed 0.01 tKAS.');
      selected = selectFunding(entries, own.script, GENESIS_POOL_SOMPI + fee);
      const change = BigInt(selected.amount) - GENESIS_POOL_SOMPI - fee;
      if (change <= 0n) throw new Error('Selected UTXO cannot keep positive change.');
      tx = new sdk.Transaction({
        version: 1,
        inputs: [{
          previousOutpoint: selected.outpoint,
          utxo: selected,
          signatureScript: '',
          sequence: 0n,
          sigOpCount: 0,
          computeBudget: 16,
        }],
        outputs: [
          {value: GENESIS_POOL_SOMPI, scriptPublicKey: sdk.payToScriptHashScript(compiled.script)},
          {value: change, scriptPublicKey: own},
        ],
        lockTime: 0n,
        subnetworkId: '00'.repeat(20),
        gas: 0n,
        payload: '',
      });
      tx.populateGenesisCovenants([{authorizingInput: 0, outputs: [0]}]);
      placeholderSig(sdk, tx, 0);
      const mass = tx.mass ? tx.mass : null;
      const minFee = BigInt(Math.ceil(feeRate * 1));
      if (fee < minFee && minFee <= MAX_GENESIS_FEE) {
        fee = minFee;
        continue;
      }
      void mass;
      break;
    }
    const covenantId = sdk.covenantId(
      tx.inputs[0].previousOutpoint,
      [{index: 0, output: tx.outputs[0]}],
    ).toString();
    if (tx.outputs[0].covenant?.covenantId.toString() !== covenantId) {
      throw new Error('Genesis covenant binding was lost.');
    }
    const review = {
      network: NETWORK,
      warning: 'TESTNET TOY. NOT USD. WILL DEPEG.',
      mode: submit ? 'submit' : 'review',
      sponsor: SPONSOR_ADDRESS,
      series: SERIES_ID,
      admin: SPONSOR_XONLY,
      poolSompi: GENESIS_POOL_SOMPI.toString(),
      fee: fee.toString(),
      fundingOutpoint: {
        transactionId: selected.outpoint.transactionId,
        index: selected.outpoint.index,
      },
      fundingAmount: selected.amount.toString(),
      covenantId,
      scriptP2SH: sdk.addressFromScriptPublicKey(tx.outputs[0].scriptPublicKey, NETWORK).toString(),
    };
    if (!submit) return review;

    const key = new sdk.PrivateKey(await loadSponsorKey());
    const address = key.toAddress(NETWORK).toString();
    if (address !== SPONSOR_ADDRESS) throw new Error('PEGLAB_SPONSOR_KEY does not match the documented sponsor address.');
    tx.inputs[0].signatureScript = sdk.createInputSignature(tx, 0, key);
    tx.finalize();
    review.transactionId = tx.id;
    const dir = resolve(ROOT, 'artifacts');
    await mkdir(dir, {recursive: true});
    const journal = resolve(dir, 'testnet-genesis.json');
    await writeFile(journal, JSON.stringify({
      ...review,
      createdAt: new Date().toISOString(),
      transaction: JSON.parse(tx.serializeToSafeJSON()),
    }, null, 2));
    const result = await rpc.submitTransaction({transaction: tx, allowOrphan: false});
    if (result.transactionId !== tx.id) throw new Error('Unexpected transaction ID. Inspect artifacts/testnet-genesis.json; do not retry automatically.');
    review.submitted = true;
    return review;
  } finally {
    await rpc.disconnect();
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const review = await planGenesis({submit: process.argv.includes('--submit')});
  console.log(JSON.stringify(review, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));
}
