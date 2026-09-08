import {SPONSOR_ADDRESS, PUBLIC_DOMAIN} from '/src/network.mjs';

const STORE = 'peglab-guest';
const $ = (id) => document.getElementById(id);

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

async function api(path, options) {
  const res = await fetch(path, options);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || res.statusText);
  return body;
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

function paintHostAddress(address) {
  $('host-address').textContent = address;
  document.querySelectorAll('.host-inline').forEach((el) => { el.textContent = address; });
}

function paintKaswarePanel(address) {
  if (!address) {
    $('kw-state').textContent = 'Not connected';
    $('kw-address').textContent = '—';
    $('kw-network').textContent = '—';
    $('kw-balance').textContent = '—';
    if ($('fund-kasware')) $('fund-kasware').hidden = true;
    if ($('kw-warn')) $('kw-warn').hidden = true;
    return;
  }
  const testnet = isTestnet(address);
  $('kw-state').textContent = 'Connected';
  $('kw-address').textContent = address;
  $('kw-network').textContent = testnet ? 'testnet-10' : 'mainnet';
  const top = document.querySelector('[data-kas-balance]');
  if (top && $('kw-balance')) $('kw-balance').textContent = top.textContent;
  $('fund-kasware').hidden = !(isLocalHost() && testnet);
  if (!testnet) {
    $('kw-warn').hidden = false;
    $('kw-warn').textContent = 'KasWare is on mainnet. Balance in the header is KAS. This lab is Testnet-10.';
  } else {
    $('kw-warn').hidden = true;
  }
  setActive(`KasWare ${address}`);
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
  if (!isLocalHost() || !isTestnet(address) || !target) return;
  try {
    const bal = await api(`/api/balance?address=${encodeURIComponent(address)}`);
    target.textContent = `${bal.confirmedTkas} tKAS`;
  } catch {
    target.textContent = '—';
  }
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

$('connect-kasware').onclick = () => {
  if (!window.KaspaWallets) {
    say('KasWare login is not loaded.', true);
    return;
  }
  window.KaspaWallets.connect('kasware').catch((err) => say(err.message, true));
};
$('fund-kasware').onclick = () => {
  const address = $('kw-address').textContent;
  fund(address, 'KasWare').then(() => {
    if (window.KaspaWallets) window.KaspaWallets.paintButtons();
  }).catch((err) => say(err.message, true));
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

window.addEventListener('kaspa-wallet', (ev) => {
  paintKaswarePanel(ev.detail && ev.detail.address);
});
if (window.KaspaWallets) {
  const now = window.KaspaWallets.current();
  if (now && now.address) paintKaswarePanel(now.address);
}

refreshHost().then(restoreLocal).catch((err) => say(err.message, true));
