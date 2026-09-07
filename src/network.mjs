// Public Testnet-10 facts. No keys.
// SPONSOR_ADDRESS is the dedicated PegLab TN10 wallet (receive index 0).
export const NETWORK = 'testnet-10';
export const RPC_URL = 'wss://muon-10.kaspa.blue/kaspa/testnet-10/wrpc/borsh';
export const SPONSOR_ADDRESS = 'kaspatest:qzpvdakagvwfm95g8pv9ndpupjtndgjfhmve08cg3tv5wgfytjzf7cudwwzv0';
// x-only pubkey encoded by the P2PK script of SPONSOR_ADDRESS.
export const SPONSOR_XONLY = '82c6f6dd431c9d9688385859b43c0c9736a249bed9979f088ad94721245c849f';
// ASCII "PegLab-tn10-v1" padded to 32 bytes. A name is still not authenticity.
export const SERIES_ID = '5065674c61622d746e31302d7631000000000000000000000000000000000000';
export const GENESIS_POOL_SOMPI = 200_000_000n;
export const MAX_GENESIS_FEE = 1_000_000n;
export const MINING_ADDRESS = 'kaspatest:qqup3k4ru5uhj9swa05afa3zqcwkyhtv9vz9dme68cglza73mc5yk4r7an5cj';
