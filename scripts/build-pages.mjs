import {copyFile, mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {PUBLIC_DOMAIN} from '../src/network.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = resolve(ROOT, 'docs');

await mkdir(resolve(DOCS, 'src'), {recursive: true});
await copyFile(resolve(ROOT, 'web/index.html'), resolve(DOCS, 'index.html'));
await copyFile(resolve(ROOT, 'web/styles.css'), resolve(DOCS, 'styles.css'));
await copyFile(resolve(ROOT, 'web/app.js'), resolve(DOCS, 'app.js'));
await copyFile(resolve(ROOT, 'web/wallet.js'), resolve(DOCS, 'wallet.js'));
await copyFile(resolve(ROOT, 'src/engine.mjs'), resolve(DOCS, 'src/engine.mjs'));
await copyFile(resolve(ROOT, 'src/network.mjs'), resolve(DOCS, 'src/network.mjs'));
await copyFile(resolve(ROOT, 'IDEA.md'), resolve(DOCS, 'IDEA.md'));
await copyFile(resolve(ROOT, 'STABLES-GUIDE.md'), resolve(DOCS, 'STABLES-GUIDE.md'));
await copyFile(resolve(ROOT, 'KACHAT.md'), resolve(DOCS, 'KACHAT.md'));
await copyFile(resolve(ROOT, 'VISION.md'), resolve(DOCS, 'VISION.md'));
await writeFile(resolve(DOCS, '.nojekyll'), '');
await writeFile(resolve(DOCS, 'CNAME'), `${PUBLIC_DOMAIN}\n`);
console.log(`docs/ ready for https://${PUBLIC_DOMAIN}`);
