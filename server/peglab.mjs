// Testnet-10 helpers. No wallet, no RPC, no broadcast.
import {mkdir, writeFile, readFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {depegDemo, inspect, genesis} from '../src/engine.mjs';
import {receiptDemo, inspect as inspectReceipt} from '../src/receipt.mjs';

const execute = promisify(execFile);
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function silvercPath() {
  return process.env.SILVERC || resolve(process.env.USERPROFILE || process.env.HOME || '', 'tools/silverc/silverc.exe');
}

export async function compilePegLab({
  source = resolve(ROOT, 'contracts/PegLab.sil'),
  ctor = resolve(ROOT, 'contracts/ctor-PegLab.json'),
  output = resolve(ROOT, 'contracts/PegLab.json'),
} = {}) {
  await execute(silvercPath(), [source, '--constructor-args', ctor, '-o', output], {
    timeout: 30000,
    maxBuffer: 2_000_000,
  });
  const artifact = JSON.parse(await readFile(output, 'utf8'));
  if (artifact.compiler_version !== '0.1.0') throw new Error('Unexpected compiler artifact.');
  if (!artifact.contracts?.PegLab) throw new Error('PegLab contract missing from artifact.');
  return artifact;
}

export async function generateFixtures(destination = resolve(ROOT, 'artifacts/depeg-lab.json')) {
  const demo = depegDemo();
  const genesisSnap = inspect(genesis());
  const body = {
    network: 'testnet-10',
    unfunded: true,
    warning: 'TESTNET TOY. NOT USD. WILL DEPEG.',
    seriesIsNotIdentity: 'Anybody can compile a similarly named series. Verify genesis outpoint, template hash, series bytes, and backing.',
    genesis: {
      oraclePrice: genesisSnap.oraclePrice.toString(),
      poolTkas: genesisSnap.poolTkas.toString(),
      poolTpeg: genesisSnap.poolTpeg.toString(),
      capRemaining: genesisSnap.capRemaining.toString(),
      cannotDefendPeg: genesisSnap.cannotDefendPeg,
    },
    demo,
  };
  await mkdir(dirname(destination), {recursive: true});
  await writeFile(destination, JSON.stringify(body, null, 2));
  const receipt = await generateReceiptJournal();
  return {path: destination, steps: demo.steps.length, receipt};
}

export async function generateReceiptJournal(destination = resolve(ROOT, 'artifacts/receipt-engine-spec.json')) {
  const demo = receiptDemo();
  const snap = inspectReceipt(demo.state);
  const body = {
    claim: 'ENGINE_SPEC',
    network: 'testnet-10',
    warning: 'RECEIPT. ONE UNIT = ONE LOCKED SOMPI. NOT USD. NOT tPEG. NOT SCRIPT_ENFORCED.',
    seriesName: snap.seriesName,
    backedOneToOne: snap.backedOneToOne,
    lockedSompi: snap.lockedSompi.toString(),
    circulating: snap.circulating.toString(),
    sponsorFeesPaid: snap.sponsorFeesPaid.toString(),
    skim: demo.skim,
    steps: demo.steps.map((s) => ({
      title: s.title,
      lesson: s.lesson,
      lockedSompi: s.lockedSompi.toString(),
      circulating: s.circulating.toString(),
      backedOneToOne: s.backedOneToOne,
      skim: s.skim || null,
    })),
  };
  await mkdir(dirname(destination), {recursive: true});
  await writeFile(destination, JSON.stringify(body, null, 2) + '\n');
  return {path: destination, steps: body.steps.length, claim: body.claim, skim: body.skim};
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain && process.argv.includes('--fixtures')) {
  const result = await generateFixtures();
  console.log(JSON.stringify(result, null, 2));
}
if (isMain && process.argv.includes('--compile')) {
  const artifact = await compilePegLab();
  console.log(JSON.stringify({
    compiler: artifact.compiler_version,
    template: Object.keys(artifact.contracts),
    entries: Object.keys(artifact.contracts.PegLab.entries || {}),
  }, null, 2));
}
