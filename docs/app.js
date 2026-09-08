import {
  genesis,
  mint,
  redeem,
  swapKas,
  postOracle,
  setPause,
  inspect,
  walletPrompt,
  depegDemo,
  DEFAULT_ORACLE,
} from '/src/engine.mjs';

const admin = '11'.repeat(32);
const alice = '22'.repeat(32);
const sompi = (n) => `${n.toString()} sompi`;
const tpeg = (n) => `${n.toString()} tPEG`;

let state = genesis({admin});
let lastAction = 'genesis';
let lastError = '';

const $ = (id) => document.getElementById(id);

function render() {
  const snap = inspect(state);
  const rows = [
    ['Oracle', snap.oracleLive ? sompi(snap.oraclePrice) + ' / tPEG' : 'STALE', false],
    ['Pool tKAS', sompi(snap.poolTkas), false],
    ['Pool tPEG', tpeg(snap.poolTpeg), false],
    ['Pool price', snap.poolPrice === null ? 'n/a' : sompi(snap.poolPrice) + ' / tPEG', snap.depegBps !== null && snap.depegBps > 0n],
    ['Depeg', snap.depegBps === null ? 'n/a' : `${snap.depegBps.toString()} bps`, snap.depegBps !== null && snap.depegBps > 0n],
    ['Cap left', tpeg(snap.capRemaining), false],
    ['Circulating', tpeg(snap.circulating), false],
    ['Paused', snap.paused ? 'yes' : 'no', snap.paused],
  ];
  $('metrics').innerHTML = rows.map(([label, value, brk]) =>
    `<div class="metric${brk ? ' break' : ''}"><span>${label}</span><strong>${value}</strong></div>`
  ).join('');
  const units = snap.units.length
    ? snap.units.map((u) => `<tr><td><code>${u.owner.slice(0, 8)}…</code></td><td>${u.quantity.toString()}</td></tr>`).join('')
    : '<tr><td colspan="2">No circulating tPEG.</td></tr>';
  $('holders').innerHTML = `<table><thead><tr><th>Holder</th><th>tPEG</th></tr></thead><tbody>${units}</tbody></table>`;
  $('prompt').textContent = lastError
    ? `REJECTED\n${lastError}\n\n${walletPrompt(lastAction, state)}`
    : walletPrompt(lastAction, state);
}

function act(name, fn) {
  lastAction = name;
  lastError = '';
  try {
    const out = fn();
    state = out.state ?? out;
  } catch (err) {
    lastError = `${err.code || 'ERROR'}: ${err.message}`;
  }
  render();
}

$('mint').onclick = () => act('mint 100 tPEG', () => mint(state, {tkasIn: 10_000_000n, minter: alice}));
$('swap').onclick = () => act('swap 0.2 tKAS through the tiny pool', () => swapKas(state, {tkasIn: 20_000_000n, trader: alice}));
$('redeem').onclick = () => act('redeem 40 tPEG', () => redeem(state, {units: 40n, holder: alice}));
$('oracle').onclick = () => act('admin posts oracle +25%', () => {
  const next = state.oracleLive ? (state.oraclePrice * 125n) / 100n : DEFAULT_ORACLE;
  return postOracle(state, {price: next, admin});
});
$('stale').onclick = () => act('admin expires the oracle', () => postOracle(state, {live: false, admin}));
$('pause').onclick = () => act(state.paused ? 'unpause' : 'pause', () => setPause(state, {paused: !state.paused, admin}));
$('reset').onclick = () => act('reset genesis', () => ({state: genesis({admin})}));

$('demo').onclick = () => {
  const demo = depegDemo();
  state = genesis({admin});
  lastAction = 'depeg lab';
  lastError = '';
  $('steps').innerHTML = demo.steps.map((step, i) => {
    const nums = step.depegBps
      ? `target ${step.targetSompiPerTpeg || step.oraclePrice}<br>pool ${step.poolSompiPerTpeg || step.poolPrice}<br>${step.depegBps} bps`
      : `oracle ${step.oraclePrice}<br>pool ${step.poolPrice}`;
    return `<article class="step${i === demo.steps.length - 1 ? ' active' : ''}"><b>${String(i + 1).padStart(2, '0')}</b><div><strong>${step.title}</strong><p>${step.lesson || step.warning}</p></div><div class="nums">${nums}</div></article>`;
  }).join('');
  demo.steps.slice(0, 4).forEach((step, i) => {
    if (i === 0) state = genesis({admin});
    if (i === 1) state = mint(state, {tkasIn: 10_000_000n, minter: alice}).state;
    if (i === 2) state = postOracle(state, {price: 125_000n, admin}).state;
    if (i === 3) state = swapKas(state, {tkasIn: 20_000_000n, trader: alice}).state;
  });
  render();
};

render();
