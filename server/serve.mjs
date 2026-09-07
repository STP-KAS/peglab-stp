import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {extname, resolve, sep} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
};

function inside(target) {
  const root = ROOT.endsWith(sep) ? ROOT : ROOT + sep;
  return target === ROOT || target.startsWith(root);
}

async function load(rel) {
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

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://127.0.0.1');
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
