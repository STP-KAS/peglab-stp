# PegLab

Build a Testnet-10 teaching toy that fails as money in public.

- Work in this checkout. Do not dump PegLab into kaspa-explained or kns.
- `src/engine.mjs` is the executable spec. Tests must fail if the UI or docs claim a peg.
- Network is Testnet-10. No mainnet scripts, no `kaspa:` deploy path, no private keys in git.
- Do not `readInputState` a foreign covenant.
- Do not add a governance token, points, airdrop, CDP, liquidations, or a second asset.
- Keep the WILL DEPEG warning in README, UI banner, and wallet prompt.
- Caps stay at 10 tKAS backing and 10,000 tPEG. The tiny pool stays at 2 tKAS seed.
- A display name is not authenticity.
- Push to GitHub by default. After any meaningful change, commit and `git push origin` to https://github.com/STP-KAS/peglab-stp without waiting to be asked.
- Never commit `.local/`, seeds, private keys, or `PEGLAB_SPONSOR_KEY`.
