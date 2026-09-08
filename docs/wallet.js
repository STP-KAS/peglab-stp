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

function isKasAddress(address) {
  return typeof address === 'string' && (address.startsWith('kaspatest:') || address.startsWith('kaspa:'));
}

function unitFor(address) {
  return isTestnet(address) ? 'tKAS' : 'KAS';
}

function sompiFromBalance(raw) {
  if (raw == null) return null;
  if (typeof raw === 'bigint') return Number(raw);
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw === 'string') {
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }
  const v = raw.confirmed ?? raw.total ?? raw.balance ?? raw.amount ?? raw.mature;
  if (v == null || v === '') return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function fmtAmount(sompi, digits) {
  const n = Number(sompi);
  if (!Number.isFinite(n) || n < 0) return (0).toFixed(digits);
  return (n / 1e8).toFixed(digits);
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

function paintBalance(sompi, address) {
  const unit = unitFor(address);
  if ($('kw-balance')) {
    $('kw-balance').textContent = sompi == null ? '—' : `${fmtAmount(sompi, 8)} ${unit}`;
  }
  if ($('kw-top-kas')) {
    $('kw-top-kas').textContent = sompi == null ? `${unit} —` : `${fmtAmount(sompi, 1)} ${unit}`;
  }
}

function paintTopKasware() {
  const login = $('kasware-top');
  const logout = $('kasware-out');
  const balBox = $('kw-top-bal');
  const who = $('kw-top-who');
  const addr = $('kw-top-addr');
  if (!login) return;
  const state = $('kw-state')?.textContent || 'Not connected';
  const address = $('kw-address')?.textContent || '';
  const connected = state === 'Connected' && isKasAddress(address);
  if (logout) logout.hidden = !connected;
  if (balBox) balBox.hidden = !connected;
  if (who) who.hidden = !connected;
  if (connected) {
    login.hidden = true;
    if (addr) {
      addr.textContent = shortAddr(address);
      addr.title = address;
    }
    return;
  }
  login.hidden = false;
  if (balBox) balBox.hidden = true;
  if (who) who.hidden = true;
  if (state === 'Connecting') login.textContent = 'Connecting…';
  else if (state === 'Not installed') login.textContent = 'Install KasWare';
  else if (state === 'No account') login.textContent = 'No account';
  else login.textContent = 'Log in';
}

async function disconnectKasware() {
  try {
    if (window.kasware?.disconnect) await window.kasware.disconnect(location.origin);
  } catch {
    // still clear the page
  }
  $('kw-state').textContent = 'Not connected';
  $('kw-address').textContent = '—';
  $('kw-network').textContent = '—';
  $('kw-balance').textContent = '—';
  if ($('fund-kasware')) $('fund-kasware').hidden = true;
  if ($('kw-warn')) $('kw-warn').hidden = true;
  setActive('none yet');
  paintTopKasware();
  say('KasWare disconnected.');
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
  if (!isLocalHost() || !isTestnet(address)) return;
  try {
    const bal = await api(`/api/balance?address=${encodeURIComponent(address)}`);
    const sompi = Number(bal.confirmedSompi);
    if (target === $('kw-balance')) paintBalance(Number.isFinite(sompi) ? sompi : null, address);
    else if (target) target.textContent = `${bal.confirmedTkas} tKAS`;
  } catch {
    // Keep the KasWare figure if the local node route is down.
  }
}

async function readKaswareBalance(wallet) {
  if (!wallet?.getBalance) return null;
  try {
    return sompiFromBalance(await wallet.getBalance());
  } catch {
    return null;
  }
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
  let network = '';
  try {
    network = await switchToTestnet(wallet);
  } catch {
    network = (await wallet.getNetwork?.()) || '';
  }
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
  $('kw-state').textContent = 'Connected';
  const testnet = isTestnet(address);
  $('fund-kasware').hidden = !(isLocalHost() && testnet);
  if (!testnet) {
    $('kw-warn').hidden = false;
    $('kw-warn').textContent = 'KasWare is on mainnet. Balance below is KAS. This lab is Testnet-10 — switch Network to Testnet 10 to try tPEG. Host tKAS will not be sent to mainnet.';
  } else {
    $('kw-warn').hidden = true;
  }
  paintBalance(await readKaswareBalance(wallet), address);
  paintTopKasware();
  await refreshAddress(address, $('kw-balance'));
  paintTopKasware();
  setActive(`KasWare ${address}`);
  say(testnet
    ? 'KasWare is on Testnet-10. tKAS balance is from KasWare. This is not USD.'
    : 'KasWare is on mainnet. Showing KAS. Switch to Testnet 10 to use this lab.');
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
if ($('kasware-top')) $('kasware-top').onclick = () => connectKasware().catch((err) => say(err.message, true));
if ($('kasware-out')) $('kasware-out').onclick = () => disconnectKasware().catch((err) => say(err.message, true));
if ($('kw-top-addr')) {
  $('kw-top-addr').onclick = async () => {
    const address = $('kw-address')?.textContent || '';
    if (!isKasAddress(address)) return;
    try {
      await navigator.clipboard.writeText(address);
      say('Copied KasWare address.');
    } catch {
      say(address);
    }
  };
}
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
  window.kasware.on('balanceChanged', (raw) => {
    const address = $('kw-address')?.textContent || '';
    if (!isKasAddress(address) || $('kw-state')?.textContent !== 'Connected') return;
    paintBalance(sompiFromBalance(raw), address);
    paintTopKasware();
  });
}

paintTopKasware();
refreshHost().then(restoreLocal).catch((err) => say(err.message, true));
