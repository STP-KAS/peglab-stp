import {readFile} from 'node:fs/promises';

export const PAGES = [
  {md: 'WHOLE.md', html: 'whole.html', title: 'The scheme', nav: 'Scheme', description: 'Conversation, invoice, rail, timeout. Crypto is optional. tPEG is not money.'},
  {md: 'DOCTRINE.md', html: 'doctrine.html', title: 'Doctrine', nav: 'Doctrine', description: 'Parker has the unit. PegLab has the warning. KaChat has the pocket. Do not mix them.'},
  {md: 'BEST.md', html: 'best.html', title: 'Receipt', nav: 'Receipt', description: 'Parker’s receipt rules plus PegLab honesty: the real proof of concept.'},
  {md: 'KACHAT.md', html: 'kachat.html', title: 'KaChat', nav: 'KaChat', description: 'How KaChat would settle in a Kaspa unit. Mobile only.'},
  {md: 'STABLES-GUIDE.md', html: 'stables.html', title: 'Capital', nav: 'Capital', description: 'PegLab is not the Kaspa dollar. Capital ladder and peg models.'},
  {md: 'VISION.md', html: 'vision.html', title: 'Vision', nav: 'Vision', description: 'A finished conversation on a phone. Not a coin.'},
  {md: 'MAINNET.md', html: 'mainnet.html', title: 'Mainnet', nav: 'Mainnet', description: 'What a successor would need to leave the PegLab toy.'},
  {md: 'BATTLE.md', html: 'battle.html', title: 'Battle', nav: 'Battle', description: 'PegLab scored against Parker’s GitHub receipt PoC.'},
];

const HREF = {
  'WHOLE.md': 'whole.html',
  'DOCTRINE.md': 'doctrine.html',
  'VISION.md': 'vision.html',
  'MAINNET.md': 'mainnet.html',
  'BATTLE.md': 'battle.html',
  'BEST.md': 'best.html',
  'KACHAT.md': 'kachat.html',
  'STABLES-GUIDE.md': 'stables.html',
};

export function rewriteHref(href) {
  const clean = String(href || '').replace(/^\.\//, '');
  if (HREF[clean]) return HREF[clean];
  const base = clean.split('/').pop();
  if (HREF[base]) return HREF[base];
  return href;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s) {
  let out = '';
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m;
  while ((m = re.exec(s))) {
    out += escapeHtml(s.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('`')) out += `<code>${escapeHtml(tok.slice(1, -1))}</code>`;
    else if (tok.startsWith('**')) out += `<strong>${inline(tok.slice(2, -2))}</strong>`;
    else {
      const parts = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      out += `<a href="${escapeHtml(rewriteHref(parts[2]))}">${inline(parts[1])}</a>`;
    }
    last = m.index + tok.length;
  }
  out += escapeHtml(s.slice(last));
  return out;
}

export function mdToHtml(src) {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let i = 0;
  const flushPara = (buf) => {
    const t = buf.join(' ').trim();
    if (t) html.push(`<p>${inline(t)}</p>`);
    buf.length = 0;
  };
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const buf = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        buf.push(escapeHtml(lines[i]));
        i += 1;
      }
      html.push(`<pre><code>${buf.join('\n')}</code></pre>`);
      i += 1;
      continue;
    }
    if (/^\|/.test(line) && i + 1 < lines.length && /^\|?\s*-/.test(lines[i + 1])) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        rows.push(lines[i]);
        i += 1;
      }
      const cells = (row) => row.split('|').slice(1, -1).map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      html.push('<div class="table-wrap"><table><thead><tr>'
        + head.map((c) => `<th>${inline(c)}</th>`).join('')
        + '</tr></thead><tbody>'
        + body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')
        + '</tbody></table></div>');
      continue;
    }
    if (line.startsWith('# ')) {
      html.push(`<h1>${inline(line.slice(2))}</h1>`);
      i += 1;
      continue;
    }
    if (line.startsWith('## ')) {
      html.push(`<h2>${inline(line.slice(3))}</h2>`);
      i += 1;
      continue;
    }
    if (line.startsWith('### ')) {
      html.push(`<h3>${inline(line.slice(4))}</h3>`);
      i += 1;
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      html.push('<hr>');
      i += 1;
      continue;
    }
    if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items = [];
      while (i < lines.length && (/^[-*] /.test(lines[i]) || (ordered && /^\d+\. /.test(lines[i])))) {
        let t = lines[i].replace(/^[-*] |^\d+\. /, '');
        const check = t.match(/^\[([ xX])\]\s+(.*)$/);
        if (check) {
          const on = check[1] !== ' ';
          items.push(`<li class="check">${on ? '☑' : '☐'} ${inline(check[2])}</li>`);
        } else items.push(`<li>${inline(t)}</li>`);
        i += 1;
      }
      html.push(`${ordered ? '<ol>' : '<ul>'}${items.join('')}${ordered ? '</ol>' : '</ul>'}`);
      continue;
    }
    if (!line.trim()) {
      i += 1;
      continue;
    }
    const buf = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^[#`|*\-]/.test(lines[i]) && !/^\d+\. /.test(lines[i]) && !/^---+$/.test(lines[i].trim())) {
      buf.push(lines[i]);
      i += 1;
    }
    flushPara(buf);
  }
  return html.join('\n');
}

export function navHtml(active) {
  const links = [
    ['index.html#best', 'Receipt'],
    ['index.html#classroom', 'Classroom'],
    ['kachat.html', 'KaChat'],
    ['doctrine.html', 'Doctrine'],
    ['whole.html', 'Scheme'],
  ];
  return links.map(([href, label]) =>
    `<a href="${href}"${label === active ? ' class="on"' : ''}>${label}</a>`
  ).join('\n      ');
}

export function chrome({title, description, active, extra = '', body}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — PegLab</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="stylesheet" href="./styles.css?v=auth">
  <script>
    try {
      var ua = navigator.userAgent || '';
      var touch = (navigator.maxTouchPoints || 0) > 1 || 'ontouchstart' in window;
      var coarse = window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      var mobileHint = !!(navigator.userAgentData && navigator.userAgentData.mobile);
      var phone = mobileHint
        || coarse
        || /Android|iPhone|iPad|iPod|Mobile|Tablet|CriOS|FxiOS|EdgiOS|webOS|Silk|Kindle|BlackBerry|IEMobile|Opera Mini/i.test(ua)
        || (/Macintosh|Mac OS X/i.test(ua) && touch)
        || (navigator.platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1);
      var root = document.documentElement;
      var host = location.hostname;
      if (host === '127.0.0.1' || host === 'localhost' || /\.localhost$/i.test(host)) root.dataset.local = '1';
      if (phone) { root.dataset.phone = '1'; root.removeAttribute('data-pc'); }
      else { root.dataset.pc = '1'; root.removeAttribute('data-phone'); }
    } catch (e) {}
  </script>
</head>
<body>
  <div class="banner">TESTNET-10 LAB · NOT USD · NOT USDT/USDC · WILL DEPEG IF YOU TREAT IT AS A DOLLAR</div>
  <header class="nav">
    <a class="brand" href="index.html" title="Home">PegLab</a>
    <nav>
      ${navHtml(active)}
    </nav>
    <a class="bal" data-balances hidden title="This wallet's KAS or tKAS from KasWare.">
      <span data-kas-balance>KAS 0.0</span>
    </a>
    <div class="who" data-who hidden>
      <button type="button" class="who-name" data-copy-who="name" title="Copy kasname">—</button>
      <button type="button" class="who-addr" data-copy-who="addr" title="Copy Kaspa address">—</button>
    </div>
    <button class="btn ghost kasware-only" type="button" data-wallet-connect data-idle-label="Log in">Log in</button>
    <button class="btn ghost kasware-only" type="button" data-wallet-logout hidden>Log out</button>
  </header>
  ${extra}
  <article class="doc">
${body}
  </article>
  <footer>
    <p class="note">Anybody can compile a similarly named series. A name is not authenticity. Redeem is tKAS at an admin price, not dollars. Pause is a brake, not a peg.</p>
    <p class="note"><a href="index.html">Home</a> · <a href="whole.html">Scheme</a> · <a href="doctrine.html">Doctrine</a> · <a href="best.html">Receipt</a> · <a href="kachat.html">KaChat</a> · <a href="battle.html">Battle</a> · <a href="mainnet.html">Mainnet</a> · <a href="vision.html">Vision</a> · <a href="stables.html">Capital</a></p>
  </footer>
  <script src="./wallets.js?v=auth"></script>
</body>
</html>
`;
}

export async function renderMdPage(root, spec) {
  const src = await readFile(`${root}/${spec.md}`, 'utf8');
  const extra = spec.html === 'best.html' || spec.html === 'doctrine.html' || spec.html === 'whole.html'
    ? '<p class="rung doc-jump"><a class="primary" href="index.html#best">Run the receipt PoC on the home page</a></p>'
    : spec.html === 'kachat.html'
      ? `<section class="phone-handoff card" id="phone-handoff">
    <p class="eyebrow">Phone</p>
    <h2>Open PegLab on your phone</h2>
    <p class="note">KaChat does not support PC. Scan to open the public lab on iOS or Android.</p>
    <figure class="phone-qr">
      <img src="media/phone-qr.svg" width="148" height="148" alt="QR code for the public PegLab page">
      <figcaption>Scan to open <a href="https://stp-kas.github.io/peglab-stp/">stp-kas.github.io/peglab-stp</a></figcaption>
    </figure>
  </section>`
      : '';
  return chrome({
    title: spec.title,
    description: spec.description,
    active: spec.nav,
    extra,
    body: mdToHtml(src),
  });
}
