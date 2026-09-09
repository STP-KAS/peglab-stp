import {copyFile, mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PUBLIC_DOMAIN} from '../src/network.mjs';
import {PAGES, renderMdPage} from './html-page.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');
const WEB = resolve(ROOT, 'web');

await mkdir(resolve(DOCS, 'src'), {recursive: true});
await mkdir(resolve(DOCS, 'media'), {recursive: true});
await copyFile(resolve(WEB, 'media/lunatic-left.mp4'), resolve(DOCS, 'media/lunatic-left.mp4'));
await copyFile(resolve(WEB, 'media/phone-qr.svg'), resolve(DOCS, 'media/phone-qr.svg'));
try {
  await copyFile(resolve(WEB, 'series.json'), resolve(DOCS, 'series.json'));
} catch {
  // Live genesis journal is optional until npm run genesis:submit succeeds.
}
for (const spec of PAGES) {
  const html = await renderMdPage(ROOT, spec);
  await writeFile(resolve(WEB, spec.html), html);
  await writeFile(resolve(DOCS, spec.html), html);
}
await copyFile(resolve(WEB, 'index.html'), resolve(DOCS, 'index.html'));
await copyFile(resolve(WEB, 'styles.css'), resolve(DOCS, 'styles.css'));
await copyFile(resolve(WEB, 'app.js'), resolve(DOCS, 'app.js'));
await copyFile(resolve(WEB, 'wallet.js'), resolve(DOCS, 'wallet.js'));
await copyFile(resolve(WEB, 'wallets.js'), resolve(DOCS, 'wallets.js'));
await copyFile(resolve(ROOT, 'src/engine.mjs'), resolve(DOCS, 'src/engine.mjs'));
await copyFile(resolve(ROOT, 'src/receipt.mjs'), resolve(DOCS, 'src/receipt.mjs'));
await copyFile(resolve(ROOT, 'src/network.mjs'), resolve(DOCS, 'src/network.mjs'));
await copyFile(resolve(ROOT, 'IDEA.md'), resolve(DOCS, 'IDEA.md'));
await copyFile(resolve(ROOT, 'STABLES-GUIDE.md'), resolve(DOCS, 'STABLES-GUIDE.md'));
await copyFile(resolve(ROOT, 'KACHAT.md'), resolve(DOCS, 'KACHAT.md'));
await copyFile(resolve(ROOT, 'VISION.md'), resolve(DOCS, 'VISION.md'));
await copyFile(resolve(ROOT, 'MAINNET.md'), resolve(DOCS, 'MAINNET.md'));
await copyFile(resolve(ROOT, 'BATTLE.md'), resolve(DOCS, 'BATTLE.md'));
await copyFile(resolve(ROOT, 'BEST.md'), resolve(DOCS, 'BEST.md'));
await writeFile(resolve(DOCS, '.nojekyll'), '');
await writeFile(resolve(DOCS, 'CNAME'), `${PUBLIC_DOMAIN}\n`);
console.log(`docs/ ready for https://${PUBLIC_DOMAIN}`);
