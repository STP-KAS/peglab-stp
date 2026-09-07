# Security

PegLab is a Testnet-10 teaching toy. It will depeg. It is not in scope for a production bug bounty.

- Do not send mainnet KAS or any real asset to PegLab outputs.
- Do not reuse admin keys from this repository’s fixtures (`11`.repeat(32) is a dummy).
- Report contract/compiler issues privately to the maintainers if you believe a Testnet-10 spend can steal *another* application’s funds. PegLab’s own pool being movable by design is not a vulnerability.
- SilverScript is experimental. The checked-in artifact is a snapshot, not a guarantee across compiler versions.

See `AUDIT-LITE.md` and `KNOWN-BREAKS.md`.
