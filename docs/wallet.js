import {SPONSOR_ADDRESS, PUBLIC_DOMAIN} from '/src/network.mjs';

const STORE = 'peglab-guest';
const NETWORKS = ['testnet-10', 'kaspa_testnet', 'kaspa_testnet_10', 'testnet10'];
const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function say(text, error = false) {
  const el = $('wallet-status');
  if (!el) return;
  el.textContent = text;
  el.dataset.error = String(error);
}

function isLocalHost() {
  const host = location.hostname;
  return host === '127.0.0.1' || host === 'localhost';
}

function isTestnet(address) {
  return typeof address === 'string' && address.startsWith('kaspatest:');
}

function tkasFromSompi(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n)) return '0';
  return (n / 1e8).toFixed(8);
}

async function api(path, options) {
  const res = await fetch(path, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
}

async function waitForKasware() {
  if (window.kasware) return window.kasware;
  for (let i = 0; i < 12; i++) {
    await sleep(100 * (i + 1));
    if (window.kasware) return window.kasware;
  }
  return null;
}

async function switchToTestnet(wallet) {
  if (!wallet?.switchNetwork) return wallet.getNetwork?.() || '';
  let last = '';
  for (const id of NETWORKS) {
    try {
      await wallet.switchNetwork(id);
      last = (await wallet.getNetwork?.()) || id;
      if (String(last).toLowerCase().includes('test')) return last;
    } catch {
      last = (await wallet.getNetwork?.()) || last;
    }
  }
  return last;
}

function saveGuest(guest) {
  sessionStorage.setItem(STORE, JSON.stringify({
    address: guest.address,
    key: guest.key,
    txid: guest.funded?.transactionId || null,
  }));
}

function loadGuest() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) || 'null');
  } catch {
    return null;
  }
}

function setActive(label) {
  $('active-wallet').textContent = label;
}

function shortAddr(address) {
  if (!address || address === '—') return '';
  if (address.length <= 22) return address;
  return `${address.slice(0, 14)}…${address.slice(-6)}`;
}

function paintTopKasware() {
  const top = $('kw-top-label');
  const chip = $('kasware-top');
  if (!top || !chip) return;
  const state = $('kw-state')?.textContent || 'Not connected';
  const address = $('kw-address')?.textContent || '';
  const bal = $('kw-balance')?.textContent || '';
  chip.classList.remove('on', 'warn');
  chip.removeAttribute('title');
  if (state === 'Connected' && address.startsWith('kaspatest:')) {
    top.textContent = `${shortAddr(address)} · ${bal}`;
    chip.classList.add('on');
    chip.title = address;
    return;
  }
  if (state === 'Wrong network') {
    top.textContent = 'Switch to Testnet 10';
    chip.classList.add('warn');
    return;
  }
  if (state === 'Not installed') {
    top.textContent = 'Install';
    return;
  }
  if (state === 'Connecting') {
    top.textContent = 'Connecting…';
    return;
  }
  if (state === 'No account') {
    top.textContent = 'No account';
    return;
  }
  top.textContent = 'Connect';
}

function paintHostAddress(address) {
  $('host-address').textContent = address;
  document.querySelectorAll('.host-inline').forEach((el) => { el.textContent = address; });
}

async function refreshHost() {
  paintHostAddress(SPONSOR_ADDRESS);
  if (!isLocalHost()) {
    $('host-balance').textContent = 'public site · host faucet stays on localhost';
    $('make-local').disabled = true;
    $('fund-local').disabled = true;
    say(`This is ${PUBLIC_DOMAIN}. KasWare works here. Host tKAS fill is only on http://127.0.0.1:8765/ so the key never sits on the public web.`);
    return null;
  }
  const status = await api('/api/status');
  paintHostAddress(status.host);
  if (status.hostError) {
    $('host-balance').textContent = `unavailable (${status.hostError})`;
  } else {
    $('host-balance').textContent = `${status.hostBalanceTkas} tKAS` + (status.faucetReady ? '' : ' · faucet not ready');
  }
  return status;
}

async function refreshAddress(address, target) {
  if (!isTestnet(address)) {
    target.textContent = 'not Testnet-10';
    return;
  }
  try {
    const bal = await api(`/api/balance?address=${encodeURIComponent(address)}`);
    target.textContent = `${bal.confirmedTkas} tKAS`;
  } catch (error) {
    target.textContent = error.message;
  }
}

async function kaswareBalance(wallet) {
  if (!wallet?.getBalance) return null;
  const raw = await wallet.getBalance();
  if (!raw || typeof raw !== 'object') return null;
  const confirmed = raw.confirmed ?? raw.total ?? 0;
  return tkasFromSompi(confirmed);
}

async function connectKasware() {
  const wallet = await waitForKasware();
  if (!wallet) {
    window.open('https://www.kasware.xyz', '_blank', 'noopener');
    say('KasWare is not in this browser. Install it, unlock it, switch to Testnet 10, then connect.', true);
    $('kw-state').textContent = 'Not installed';
    paintTopKasware();
    return;
  }
  say('Opening KasWare…');
  $('kw-state').textContent = 'Connecting';
  paintTopKasware();
  const network = await switchToTestnet(wallet);
  const accounts = await wallet.requestAccounts();
  const address = accounts?.[0] ? String(accounts[0]) : '';
  $('kw-address').textContent = address || '—';
  $('kw-network').textContent = network || 'unknown';
  if (!address) {
    say('KasWare returned no address.', true);
    $('kw-state').textContent = 'No account';
    paintTopKasware();
    return;
  }
  if (!isTestnet(address)) {
    $('kw-warn').hidden = false;
    $('kw-warn').textContent = 'KasWare is not on Testnet-10. In KasWare, switch Network to Testnet 10, then connect again. Host tKAS will not be sent to mainnet.';
    $('fund-kasware').hidden = true;
    $('kw-balance').textContent = 'blocked (mainnet)';
    $('kw-state').textContent = 'Wrong network';
    say('Switch KasWare to Testnet 10 before testing.', true);
    paintTopKasware();
    return;
  }
  $('kw-warn').hidden = true;
  $('kw-state').textContent = 'Connected';
  $('fund-kasware').hidden = !isLocalHost();
  try {
    const kw = await kaswareBalance(wallet);
    $('kw-balance').textContent = kw ? `${kw} tKAS` : 'checking node…';
  } catch {
    $('kw-balance').textContent = 'checking node…';
  }
  await refreshAddress(address, $('kw-balance'));
  setActive(`KasWare ${address}`);
  paintTopKasware();
  say('KasWare is on Testnet-10. tKAS balance is from the node. This is not USD.');
}

async function fund(address, label) {
  if (!isLocalHost()) {
    throw new Error('Host tKAS fill only runs on localhost.');
  }
  say(`Sending 1 host tKAS to ${label}…`);
  const paid = await api('/api/fund', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({address}),
  });
  say(`Sent ${paid.amountTkas} tKAS. tx ${paid.transactionId}`);
  await refreshHost();
  return paid;
}

async function makeLocal() {
  if (!isLocalHost()) {
    throw new Error('Make-local + host fill only runs on http://127.0.0.1:8765/. On the public site use KasWare.');
  }
  say('Creating a local Testnet-10 wallet and asking the host for 1 tKAS…');
  const guest = await api('/api/guest', {method: 'POST'});
  saveGuest(guest);
  paintLocal(guest.address, guest.key);
  if (guest.funded) {
    say(`Local wallet ready. Host sent ${guest.funded.amountTkas} tKAS. tx ${guest.funded.transactionId}`);
  } else {
    say(guest.fundError || 'Local wallet created, but the host could not pay. Fund the host address, then click Fund again.', true);
  }
  await refreshAddress(guest.address, $('local-balance'));
  await refreshHost();
  setActive(`local ${guest.address}`);
}

function paintLocal(address, key) {
  $('local-state').textContent = 'In this tab';
  $('local-address').textContent = address;
  $('local-key').textContent = key || 'No key in this tab.';
}

async function restoreLocal() {
  const guest = loadGuest();
  if (!guest?.address) return;
  paintLocal(guest.address, guest.key);
  await refreshAddress(guest.address, $('local-balance'));
  setActive(`local ${guest.address}`);
}

$('connect-kasware').onclick = () => connectKasware().catch((err) => say(err.message, true));
$('kasware-top').onclick = () => connectKasware().catch((err) => say(err.message, true));
$('fund-kasware').onclick = () => {
  const address = $('kw-address').textContent;
  fund(address, 'KasWare').then(() => refreshAddress(address, $('kw-balance')).then(paintTopKasware)).catch((err) => say(err.message, true));
};
$('make-local').onclick = () => makeLocal().catch((err) => say(err.message, true));
$('fund-local').onclick = () => {
  const address = $('local-address').textContent;
  if (!isTestnet(address)) {
    say('Make a local wallet first.', true);
    return;
  }
  fund(address, 'the local wallet').then(() => refreshAddress(address, $('local-balance'))).catch((err) => say(err.message, true));
};

if (window.kasware?.on) {
  window.kasware.on('accountsChanged', () => connectKasware().catch(() => {}));
  window.kasware.on('networkChanged', () => connectKasware().catch(() => {}));
}

paintTopKasware();
refreshHost().then(restoreLocal).catch((err) => say(err.message, true));
