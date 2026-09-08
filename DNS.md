# Point the GoDaddy domain at PegLab

Public site: **https://peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club**

Localhost stays: **http://127.0.0.1:8765/** (`npm run serve`). Host tKAS faucet stays there only.

GitHub Pages serves the copy in `docs/`. After DNS is set, GitHub issues a certificate.

## GoDaddy DNS (this domain)

In [the domain settings](https://dcc.godaddy.com/control/portfolio/peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club/settings) open **DNS** → **Manage DNS**.

Delete conflicting A / CNAME records for `@` and `www` if GoDaddy parked the domain.

Add:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | 600 |
| A | `@` | `185.199.109.153` | 600 |
| A | `@` | `185.199.110.153` | 600 |
| A | `@` | `185.199.111.153` | 600 |
| AAAA | `@` | `2606:50c0:8000::153` | 600 |
| AAAA | `@` | `2606:50c0:8001::153` | 600 |
| AAAA | `@` | `2606:50c0:8002::153` | 600 |
| AAAA | `@` | `2606:50c0:8003::153` | 600 |
| CNAME | `www` | `stp-kas.github.io` | 600 |

Save. Wait 5–30 minutes (sometimes a few hours).

Then in the GitHub repo **Settings → Pages**, confirm:

- Source: `main` / `/docs`
- Custom domain: `peglabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.club`
- Check **Enforce HTTPS** once the certificate appears.

Do not put `.local/sponsor.json` or the seed on this domain.

## Let Grok apply DNS (API)

I cannot log into GoDaddy SSO from this machine. A **production API key** is enough.

1. Open https://developer.godaddy.com/keys while logged into the same GoDaddy account that owns the domain.
2. Create a **production** key (not OTE/test).
3. Either paste the key and secret in chat, or in PowerShell:

```powershell
$env:GODADDY_API_KEY = "..."
$env:GODADDY_API_SECRET = "..."
cd C:\Users\Remco\peglab
node scripts/point-godaddy-dns.mjs
```

That script replaces `@` A records with GitHub Pages IPs and sets `www` → `stp-kas.github.io`. Do not commit the key.
