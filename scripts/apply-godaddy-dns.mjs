import {createRequire} from 'node:module';
import {join} from 'node:path';
import {homedir} from 'node:os';

const require = createRequire('C:/Users/Remco/kaspa-explained/package.json');
const {chromium} = require('playwright');

const DOMAIN = 'peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club';
const DST = join(homedir(), 'AppData/Local/Temp/stp-godaddy-chrome');
const GH_A = ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153'];
const GH_AAAA = ['2606:50c0:8000::153', '2606:50c0:8001::153', '2606:50c0:8002::153', '2606:50c0:8003::153'];
const WWW = 'stp-kas.github.io';

const context = await chromium.launchPersistentContext(DST, {
  channel: 'chrome',
  headless: false,
  viewport: {width: 1400, height: 900},
});
const page = context.pages()[0] || await context.newPage();
await page.goto(`https://dcc.godaddy.com/control/${DOMAIN}/dns`, {waitUntil: 'domcontentloaded', timeout: 60000}).catch(() => {});
await page.waitForTimeout(2500);

if (/sso|signin|login/i.test(page.url())) {
  console.log('LOGIN_REQUIRED: sign in to GoDaddy in the opened Chrome window. Waiting up to 3 minutes.');
  try {
    await page.waitForURL((url) => /dcc\.godaddy\.com|dns\.godaddy\.com/i.test(String(url)) && !/sso|signin/i.test(String(url)), {timeout: 180000});
  } catch {
    console.log(JSON.stringify({ok: false, url: page.url(), error: 'still on login'}));
    await context.close();
    process.exit(1);
  }
}

const result = await page.evaluate(async ({domain, ghA, ghAaaa, www}) => {
  async function call(method, path, body) {
    const res = await fetch(`https://api.godaddy.com/v1/domains/${domain}${path}`, {
      method,
      credentials: 'include',
      headers: body ? {'Content-Type': 'application/json'} : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    return {method, path, status: res.status, body: text.slice(0, 2500)};
  }
  const before = await call('GET', '/records');
  const a = await call('PUT', '/records/A/@', ghA.map((data) => ({data, ttl: 600})));
  const aaaa = await call('PUT', '/records/AAAA/@', ghAaaa.map((data) => ({data, ttl: 600})));
  const cname = await call('PUT', '/records/CNAME/www', [{data: www, ttl: 600}]);
  let forward = await call('GET', '/forwarding');
  let forwardDel = null;
  if (forward.status === 200 && forward.body && forward.body !== '[]' && forward.body !== '{}') {
    forwardDel = await call('DELETE', '/forwarding');
  }
  const after = await call('GET', '/records');
  return {url: location.href, before, a, aaaa, cname, forward, forwardDel, after};
}, {domain: DOMAIN, ghA: GH_A, ghAaaa: GH_AAAA, www: WWW});

console.log(JSON.stringify(result, null, 2));
await page.screenshot({path: join(homedir(), 'AppData/Local/Temp/peglab-godaddy-dns.png'), fullPage: true});
await context.close();
if (result.a.status >= 400 || result.cname.status >= 400) process.exit(1);
