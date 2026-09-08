// Applies GitHub Pages DNS at GoDaddy for @ and www only.
// Does not wipe MX/TXT. Keys from env. Never commit secrets.
const DOMAIN = 'peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club';
const key = process.env.GODADDY_API_KEY;
const secret = process.env.GODADDY_API_SECRET;
if (!key || !secret) {
  console.error('Set GODADDY_API_KEY and GODADDY_API_SECRET, then rerun.');
  process.exit(1);
}

const headers = {
  Authorization: `sso-key ${key}:${secret}`,
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

async function put(path, body) {
  const res = await fetch(`https://api.godaddy.com/v1/domains/${DOMAIN}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${path} ${text}`);
  return text;
}

await put('/records/A/@', [
  {data: '185.199.108.153', ttl: 600},
  {data: '185.199.109.153', ttl: 600},
  {data: '185.199.110.153', ttl: 600},
  {data: '185.199.111.153', ttl: 600},
]);
await put('/records/CNAME/www', [
  {data: 'stp-kas.github.io', ttl: 600},
]);

const get = await fetch(`https://api.godaddy.com/v1/domains/${DOMAIN}/records`, {headers});
const current = await get.json();
const shown = current.filter((r) => (r.type === 'A' && r.name === '@') || (r.type === 'CNAME' && r.name === 'www'));
console.log(JSON.stringify({ok: true, domain: DOMAIN, records: shown}, null, 2));
