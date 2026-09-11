# Best of both: the real proof of concept

Authority: [DOCTRINE.md](DOCTRINE.md). Parker’s GitHub PoC already has the **unit**. PegLab already has the **warning** and the **product scene**. This tab is both, as one receipt lab.

**Not USD. Not tPEG. Do not raise against this either — fund grants for the live TN10 series.**

---

## Steal from Parker (kaspa-explained + TN12)

| Rule | Why it survives a run |
| --- | --- |
| 1 unit = 1 locked sompi | Redemption is the product. No dollar feed. |
| Sponsor pays fees | Principal cannot skim mass. 0-KAS receivers can still settle. |
| Name ≠ authenticity | Wallets verify genesis / template / series. |
| SCRIPT_ENFORCED vs copy | The engine may demo; only accepted txids count. |
| Timeout / escrow already accepted on TN12 | KaChat pay-with-timeout should reuse that family, not a third covenant. |
| wTestUSD cannot buy the town’s crops | A wrap or tPEG must not sit in KaChat as money. |

## Steal from PegLab

| Rule | Why it belongs |
| --- | --- |
| WILL DEPEG classroom | A 2 tKAS pool is not a peg. Keep that demo **next to** the receipt, not instead of it. |
| KaChat on a phone | The job is a finished conversation, not a block explorer. |
| Capital instruments | Grants for receipts. Equity only if you are a licensed issuer. No sister token. |
| KasWare log-in | Gramlane `getBalance`. Public site never holds the host key. |

## Do not mix

| Object | Tab | Mainnet |
| --- | --- | --- |
| Receipt (this PoC) | **Receipt PoC** | Allowed after live TN10 txids + KaChat signer |
| tPEG + admin oracle + tiny pool | **Depeg warning** | Never as money |
| Named USDC/USDT | Later | Host it. PegLab is not the issuer. |

---

## Executable spec

`src/receipt.mjs` is the receipt engine (browser + Node). Tests in `tests/receipt.test.mjs`.

1. **Lock** 0.5 tKAS → Alice holds 50_000_000 sompi of claim. Backing = claim.
2. **Transfer** to Bob. Totals unchanged.
3. **Redeem** 0.2 tKAS. Bob gets sompi. Sponsor pays 263_800 sompi (native 1-in 2-out floor).
4. **Skim** refused (`SKIM`).
5. **Redeem the rest.** Series empty. 1:1 the whole way.

That is Parker’s wrap-lab native tab, taught on PegLab’s page, with PegLab’s “not a dollar” banner.

## Still missing (so it is a PoC, not production)

- [x] ENGINE_SPEC journal (`artifacts/receipt-engine-spec.json`) — lock/transfer/redeem/SKIM, series empty 1:1. Not a txid.
- [ ] Broadcast lock / transfer / redeem on Testnet-10; journal txids like Parker’s wrap record
- [ ] Indexer row per address
- [ ] KaChat signs the covenant (not only KasWare on the web)
- [ ] Timeout pay using Parker’s TN12 escrow/vault shape
- [ ] External review of the SilverScript, not only this JS spec

Until those boxes tick, this tab is **ENGINE_SPEC**. It is not `SCRIPT_ENFORCED` on mainnet.
