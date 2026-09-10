import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {NETWORK, SPONSOR_ADDRESS, MINING_ADDRESS} from '../src/network.mjs';
import {
  FAUCET_AMOUNT,
  addressBalance,
  createGuestKey,
  loadSponsor,
  requireTestnetAddress,
  sendFromHost,
} from './host-wallet.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.mp4': 'video/mp4',
  '.svg': 'image/svg+xml',
};

const recent = new Map();
const FAUCET_COOLDOWN_MS = 60_000;

function inside(target) {
  const root = ROOT.endsWith(sep) ? ROOT : ROOT + sep;
  return target === ROOT || target.startsWith(root);
}

function localClient(req) {
  const ip = req.socket.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
}

function sendJson(res, status, body) {
  res.writeHead(status, {'content-type': 'application/json; charset=utf-8'});
  res.end(JSON.stringify(body, (_, v) => typeof v === 'bigint' ? v.toString() : v));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  return JSON.parse(raw);
}

async function hostStatus() {
  let host;
  try {
    host = await addressBalance(SPONSOR_ADDRESS);
  } catch (error) {
    host = {address: SPONSOR_ADDRESS, error: String(error.message || error), confirmedSompi: '0', confirmedTkas: '0'};
  }
  let keyReady = false;
  try {
    await loadSponsor();
    keyReady = true;
  } catch {}
  const sompi = BigInt(host.confirmedSompi || 0);
  return {
    network: NETWORK,
    warning: 'TESTNET TOY. NOT USD. WILL DEPEG.',
    host: SPONSOR_ADDRESS,
    miner: MINING_ADDRESS,
    hostBalanceSompi: sompi.toString(),
    hostBalanceTkas: host.confirmedTkas || '0',
    hostUtxos: host.utxos || 0,
    hostError: host.error || null,
    faucetAmountTkas: (Number(FAUCET_AMOUNT) / 1e8).toFixed(2),
    faucetReady: keyReady && sompi >= FAUCET_AMOUNT + 101_000n,
    keyReady,
  };
}

const PAGE_ALIAS = {
  '/VISION.md': '/vision.html',
  '/vision': '/vision.html',
  '/MAINNET.md': '/mainnet.html',
  '/mainnet': '/mainnet.html',
  '/BATTLE.md': '/battle.html',
  '/battle': '/battle.html',
  '/BEST.md': '/best.html',
  '/best': '/best.html',
  '/KACHAT.md': '/kachat.html',
  '/kachat': '/kachat.html',
  '/DOCTRINE.md': '/doctrine.html',
  '/doctrine': '/doctrine.html',
};

async function load(rel) {
  rel = PAGE_ALIAS[rel] || rel;
  const candidates = rel === '/'
    ? [resolve(ROOT, 'web/index.html')]
    : [resolve(ROOT, '.' + rel), resolve(ROOT, 'web', '.' + rel)];
  for (const target of candidates) {
    if (!inside(target)) continue;
    try {
      return {target, body: await readFile(target)};
    } catch {
      // try next
    }
  }
  return null;
}

function checkCooldown(address) {
  const last = recent.get(address) || 0;
  if (Date.now() - last < FAUCET_COOLDOWN_MS) {
    throw new Error('Wait a minute before asking the host faucet again.');
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
  if (url.pathname.startsWith('/api/')) {
    if (!localClient(req)) {
      sendJson(res, 403, {error: 'Localhost only.'});
      return;
    }
    try {
      if (req.method === 'GET' && url.pathname === '/api/status') {
        sendJson(res, 200, await hostStatus());
        return;
      }
      if (req.method === 'GET' && url.pathname === '/api/balance') {
        const address = requireTestnetAddress(url.searchParams.get('address') || '');
        sendJson(res, 200, await addressBalance(address));
        return;
      }
      if (req.method === 'POST' && url.pathname === '/api/fund') {
        const body = await readJson(req);
        const address = requireTestnetAddress(body.address);
        checkCooldown(address);
        const paid = await sendFromHost({destination: address});
        recent.set(address, Date.now());
        sendJson(res, 200, paid);
        return;
      }
      if (req.method === 'POST' && url.pathname === '/api/guest') {
        const guest = createGuestKey();
        checkCooldown(guest.address);
        let funded = null;
        let fundError = null;
        try {
          funded = await sendFromHost({destination: guest.address});
          recent.set(guest.address, Date.now());
        } catch (error) {
          fundError = String(error.message || error);
        }
        sendJson(res, 200, {
          network: NETWORK,
          warning: 'Disposable Testnet-10 key. Not a seed. Not mainnet. Stored in this tab only.',
          address: guest.address,
          key: guest.key,
          funded,
          fundError,
        });
        return;
      }
      sendJson(res, 404, {error: 'unknown api'});
    } catch (error) {
      sendJson(res, 400, {error: String(error.message || error)});
    }
    return;
  }
  const found = await load(decodeURIComponent(url.pathname));
  if (!found) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, {'content-type': TYPES[extname(found.target)] || 'application/octet-stream'});
  res.end(found.body);
});

const port = Number(process.env.PORT || 8765);
server.listen(port, '127.0.0.1', () => {
  console.log(`PegLab depeg lab → http://127.0.0.1:${port}/`);
});
