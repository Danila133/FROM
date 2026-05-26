# FROM 1234

Base mini app: GM, token deploy, and milestone badge NFTs.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

- **/** — GM + Deploy (Jumper-style UI)
- **/referral** — Personal referral link, invite counter, +200 pts per friend
- **/badges** — Mint NFT badges for GM, Deploy, points, and leaderboard rank
- **/leaderboard** — All participants ranked by points

## Deploy contracts (Base)

### 1. Configure env

Add to `.env.local`:

```bash
PRIVATE_KEY=0x...                      # deployer (needs ETH)
BADGE_RANK_SIGNER_PRIVATE_KEY=0x...    # rank badge signer (can differ from deployer)
```

### 2. Compile & test

```bash
npm run compile
npm run test:contracts
```

### 3. Deploy

**Base Sepolia (recommended first):**

```bash
npm run deploy:sepolia
```

**Base mainnet:**

```bash
npm run deploy:base
```

This deploys `Hub.sol` then `BadgeNFT.sol` (Hub address + rank signer in constructor), broadcasts to chain, and syncs addresses into:

- `src/config/contract.ts` → `HUB_CONTRACT_ADDRESS`
- `src/config/badgeContract.ts` → `BADGE_NFT_ADDRESS`
- `deployments/<network>.json`

Dry-run (simulate only):

```bash
DRY_RUN=1 bash scripts/deploy-contracts.sh base_sepolia
```

### Manual steps (if not using the script)

1. Deploy `contracts/src/Hub.sol`
2. Deploy `contracts/src/BadgeNFT.sol` with `(hubAddress, rankSignerAddress)`
3. Set addresses in `src/config/contract.ts` and `src/config/badgeContract.ts`
4. Set `BADGE_RANK_SIGNER_PRIVATE_KEY` in `.env.local` (must match on-chain `rankSigner`)

```bash
npm run compile   # forge build
npm run test:contracts
```

## Badge milestones

| ID | Type        | Requirement        | Mint |
|----|-------------|--------------------|------|
| 1  | GM          | 10 GMs             | on-chain |
| 2  | GM          | 20 GMs             | on-chain |
| 3  | GM          | 50 GMs             | on-chain |
| 4  | Deploy      | 10 deploys         | on-chain |
| 5  | Deploy      | 20 deploys         | on-chain |
| 6  | Deploy      | 50 deploys         | on-chain |
| 7  | Points      | 100 points         | on-chain |
| 8  | Points      | 500 points         | on-chain |
| 9  | Points      | 1000 points        | on-chain |
| 10 | Leaderboard | Top 10             | signed |
| 11 | Leaderboard | Top 50             | signed |
| 12 | Leaderboard | Top 100            | signed |
| 13 | GM          | 100 GMs            | on-chain |
| 14 | Deploy      | 100 deploys        | on-chain |
| 15 | Points      | 5000 points        | on-chain |
| 16 | Leaderboard | Top 3              | signed |
| 17 | Collection  | 4 milestone badges | on-chain |
| 18 | Collection  | 8 milestone badges | on-chain |
| 19 | Collection  | 12 milestone badges| on-chain |
| 20 | Collection  | 16 milestone badges| on-chain |
| 21 | Referral    | 2 friends (1 GM)   | on-chain |
| 22 | Referral    | 5 friends (1 GM)   | on-chain |
| 23 | Referral    | 10 friends (1 GM)  | on-chain |
| 24 | Referral    | 20 friends (1 GM)  | on-chain |

## Referrals

Share `/?ref=0xYourAddress`. A friend calls `registerReferrer(yourAddress)` **before their first GM**, then completes **1 GM** — you receive **200 points** and `referralCount` increments. Registration alone does not count.

Hub badges (GM, deploy, points, referral, collection): call `mint(badgeType)` when `eligibility(user, badgeType)` is true.

Rank badges (10–12, 16): server checks leaderboard rank, signs a mint payload; user calls `mintRankBadge(badgeType, deadline, signature)`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run compile` | `forge build` |
