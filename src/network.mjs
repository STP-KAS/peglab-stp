// Public Testnet-10 facts. No keys.
// SPONSOR_ADDRESS is the operator's TN10 mining payout address.
export const NETWORK = 'testnet-10';
export const RPC_URL = 'wss://muon-10.kaspa.blue/kaspa/testnet-10/wrpc/borsh';
export const SPONSOR_ADDRESS = 'kaspatest:qqup3k4ru5uhj9swa05afa3zqcwkyhtv9vz9dme68cglza73mc5yk4r7an5cj';
// x-only pubkey encoded by the P2PK script of SPONSOR_ADDRESS.
export const SPONSOR_XONLY = '3818daa3e53979160eebe9d4f622061d625d6c2b0456ef3a3e11f177d1de284b';
// ASCII "PegLab-tn10-v1" padded to 32 bytes. A name is still not authenticity.
export const SERIES_ID = '5065674c61622d746e31302d7631000000000000000000000000000000000000';
export const GENESIS_POOL_SOMPI = 200_000_000n;
export const MAX_GENESIS_FEE = 1_000_000n;
