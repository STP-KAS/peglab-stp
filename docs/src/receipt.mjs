// Best-practice receipt PoC. Parker rules, PegLab teaching scale.
// One unit = one locked sompi. No dollar oracle. Sponsor pays fees.
// This is not tPEG and not USD.

export const NETWORK = 'testnet-10';
export const MAX_SOMPI = 1_000_000_000n; // 10 tKAS
export const MAX_FEE = 3_000_000n;
export const SERIES_NAME = 'PegLab-receipt-v1';

export class ReceiptError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ReceiptError';
    this.code = code;
  }
}

const hex32 = (value, label = 'bytes') => {
  if (typeof value !== 'string' || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new ReceiptError('BAD_HEX', `Expected 32-byte hex for ${label}.`);
  }
  return value.toLowerCase();
};

const u = (value, {min = 1n, max = MAX_SOMPI, label = 'amount'} = {}) => {
  const n = typeof value === 'bigint' ? value : BigInt(value);
  if (n < min || n > max) throw new ReceiptError('RANGE', `${label} out of range.`);
  return n;
};

const copyUnits = (units) => units.map((x) => ({owner: x.owner, quantity: x.quantity}));

const circulating = (state) => state.units.reduce((n, x) => n + x.quantity, 0n);

const take = (units, owner, quantity) => {
  const next = [];
  let need = quantity;
  for (const row of units) {
    if (row.owner !== owner || need === 0n) {
      next.push({...row});
      continue;
    }
    if (row.quantity <= need) {
      need -= row.quantity;
    } else {
      next.push({owner, quantity: row.quantity - need});
      need = 0n;
    }
  }
  if (need > 0n) throw new ReceiptError('BUDGET', 'Holder does not have that many sompi.');
  return next.filter((row) => row.quantity > 0n);
};

export function inspect(state) {
  const circ = circulating(state);
  return {
    network: NETWORK,
    seriesId: state.seriesId,
    seriesName: SERIES_NAME,
    lockedSompi: state.lockedSompi,
    circulating: circ,
    backedOneToOne: circ === state.lockedSompi,
    oracle: 'none',
    sponsorFeesPaid: state.sponsorFeesPaid,
    units: copyUnits(state.units),
    warning: 'RECEIPT. ONE UNIT = ONE LOCKED SOMPI. NOT USD. NOT tPEG.',
  };
}

export function genesis({seriesId = 'aa'.repeat(32)} = {}) {
  return {
    seriesId: hex32(seriesId, 'seriesId'),
    lockedSompi: 0n,
    units: [],
    sponsorFeesPaid: 0n,
  };
}

export function lock(state, {owner, sompi, sponsorFee}) {
  const qty = u(sompi, {label: 'lock'});
  const fee = u(sponsorFee, {min: 1n, max: MAX_FEE, label: 'sponsorFee'});
  if (state.lockedSompi + qty > MAX_SOMPI) throw new ReceiptError('OVER_CAP', 'Backing cap is 10 tKAS.');
  return {
    state: {
      ...state,
      lockedSompi: state.lockedSompi + qty,
      units: [...copyUnits(state.units), {owner: hex32(owner, 'owner'), quantity: qty}],
      sponsorFeesPaid: state.sponsorFeesPaid + fee,
    },
    locked: qty,
    fee,
  };
}

export function transfer(state, {from, to, quantity}) {
  const qty = u(quantity, {label: 'transfer'});
  const src = hex32(from, 'from');
  const dst = hex32(to, 'to');
  if (src === dst) throw new ReceiptError('SELF', 'Transfer to self is not a move.');
  const rest = take(state.units, src, qty);
  return {
    state: {
      ...state,
      units: [...rest, {owner: dst, quantity: qty}],
    },
    moved: qty,
  };
}

export function redeem(state, {holder, quantity, sponsorFee}) {
  const qty = u(quantity, {label: 'redeem'});
  const fee = u(sponsorFee, {min: 1n, max: MAX_FEE, label: 'sponsorFee'});
  const owner = hex32(holder, 'holder');
  const rest = take(state.units, owner, qty);
  return {
    state: {
      ...state,
      lockedSompi: state.lockedSompi - qty,
      units: rest,
      sponsorFeesPaid: state.sponsorFeesPaid + fee,
    },
    released: qty,
    fee,
  };
}

export function skimPrincipal(state, {holder, quantity}) {
  throw new ReceiptError('SKIM', 'Fees come from a sponsor input. Principal cannot pay mass.');
}

export function walletPrompt(action, state) {
  const snap = inspect(state);
  return [
    `PegLab receipt PoC · ${snap.network}`,
    `Action: ${action}`,
    `Series: ${snap.seriesName} (name is not authenticity)`,
    `Locked: ${snap.lockedSompi.toString()} sompi`,
    `Claims: ${snap.circulating.toString()} sompi`,
    `1:1: ${snap.backedOneToOne ? 'yes' : 'NO'}`,
    `Oracle: none`,
    `Sponsor fees paid: ${snap.sponsorFeesPaid.toString()} sompi`,
    snap.warning,
  ].join('\n');
}

export function receiptDemo() {
  const alice = '22'.repeat(32);
  const bob = '33'.repeat(32);
  const fee = 263_800n;
  let state = genesis();
  const steps = [];
  const push = (title, lesson, extra = {}) => {
    const snap = inspect(state);
    steps.push({title, lesson, lockedSompi: snap.lockedSompi, circulating: snap.circulating, backedOneToOne: snap.backedOneToOne, ...extra});
  };
  push('Genesis', 'Empty series. No oracle. Nothing is a dollar.');
  state = lock(state, {owner: alice, sompi: 50_000_000n, sponsorFee: fee}).state;
  push('Lock 0.5 tKAS', 'Alice’s claim equals locked sompi. Parker’s receipt rule.');
  state = transfer(state, {from: alice, to: bob, quantity: 50_000_000n}).state;
  push('Transfer to Bob', 'Quantity and backing unchanged. Name is not authenticity.');
  state = redeem(state, {holder: bob, quantity: 20_000_000n, sponsorFee: fee}).state;
  push('Redeem 0.2 tKAS', 'Bob gets sompi. Sponsor pays the fee. No skim.');
  let skim = 'not tried';
  try {
    skimPrincipal(state, {holder: bob, quantity: 1n});
  } catch (err) {
    skim = err.code;
  }
  state = redeem(state, {holder: bob, quantity: 30_000_000n, sponsorFee: fee}).state;
  push('Full redeem + skim refused', 'Series empty. SKIM rejected. This can go on-chain as successor A.', {skim});
  return {state, steps, skim};
}
