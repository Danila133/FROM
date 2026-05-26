# Deploy to Base Mainnet (step by step)

## What gets deployed

1. **Hub.sol** — GM, deploy token, points, referrals  
2. **BadgeNFT.sol** — 24 badge NFTs (needs Hub address + rank signer)

Cost: a small amount of **ETH on Base** (usually well under $1 for gas).

---

## Step 0 — Install tools (once)

In Terminal, from the project folder:

```bash
# Node dependencies
npm install

# Foundry (if not installed): https://book.getfoundry.sh/getting-started/installation
forge --version
cast --version
```

---

## Step 1 — Prepare two wallets

| Wallet | Purpose | Needs |
|--------|---------|--------|
| **Deployer** | Pays gas, deploys contracts | ETH on **Base** mainnet |
| **Rank signer** | Signs rank badges (10–12, 16) | Can be the same as deployer for testing; use a separate hot wallet in production |

Export the deployer private key and rank signer key from MetaMask (Account details → Show private key).  
Never share these keys or commit them to git.

---

## Step 2 — Create `.env.local`

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

```bash
# Your production site (after Vercel deploy)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Deployer — must have ETH on Base mainnet
PRIVATE_KEY=0xYOUR_DEPLOYER_PRIVATE_KEY_64_HEX_CHARS

# Rank badge signer (private key of rank signer wallet)
BADGE_RANK_SIGNER_PRIVATE_KEY=0xYOUR_RANK_SIGNER_PRIVATE_KEY

# Recommended for leaderboard API (Alchemy / Infura free tier)
BASE_RPC_URL=https://base-mainnet.g.alchemy.com/v2/YOUR_KEY
```

Rules:

- Keys start with `0x` + 64 hex characters  
- No quotes, no spaces  
- `BADGE_RANK_SIGNER_PRIVATE_KEY` must belong to the wallet you want as `rankSigner` on-chain  

Check deployer balance on [basescan.org](https://basescan.org) (0.001+ ETH is usually enough).

---

## Step 3 — Compile and test (dry run, no gas)

```bash
npm run compile
npm run test:contracts
```

Simulate deploy **without** sending transactions:

```bash
DRY_RUN=1 npm run deploy:base
```

You should see simulation succeed and addresses in the output. If it fails, fix errors before Step 4.

---

## Step 4 — Deploy to Base mainnet (real)

```bash
npm run deploy:base
```

This will:

1. Deploy Hub  
2. Deploy BadgeNFT  
3. Run `scripts/sync-deployments.mjs` — updates `src/config/contract.ts`, `badgeContract.ts`, `signRankBadge.ts`, `deployments/base.json`

Save the printed addresses.

---

## Step 5 — Verify on Basescan

Open the Hub and BadgeNFT addresses on [basescan.org](https://basescan.org).  
Confirm they are **verified** contracts (optional: verify source in Foundry later).

---

## Step 6 — Run the app locally

```bash
npm run dev
```

Open http://localhost:3000 — connect wallet on **Base** mainnet, try GM and `/badges`.

---

## Step 7 — Production (Vercel)

In Vercel → Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `BADGE_RANK_SIGNER_PRIVATE_KEY` | same as `.env.local` |
| `BASE_RPC_URL` | Alchemy/Infura Base mainnet URL |

Redeploy the site after adding variables.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Set PRIVATE_KEY` | Create `.env.local` with deployer key |
| `insufficient funds` | Send more ETH to deployer on Base |
| Rank badges won't mint | `BADGE_RANK_SIGNER_PRIVATE_KEY` must match `RANK_SIGNER_ADDRESS` in `signRankBadge.ts` (auto-synced after deploy) |
| Leaderboard empty / slow | Set `BASE_RPC_URL` and `HUB_DEPLOY_FROM_BLOCK` (auto-set in `contract.ts` after deploy) |
