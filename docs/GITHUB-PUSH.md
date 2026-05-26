# Push to GitHub (manual checklist)

Remote is already set:

`https://github.com/Danila133/FROM.git` → branch `main`

## Before you commit

- [ ] `.env.local` is **not** in the commit (`git check-ignore -v .env.local` should list `.gitignore`)
- [ ] No private keys pasted in code, README, or issues
- [ ] Contract addresses in `src/config/contract.ts` and `badgeContract.ts` are OK to publish (they are public on-chain)

## What will be committed

Full app: Next.js frontend, Foundry contracts, tests, `lib/forge-std`, docs, scripts.

**Not committed** (via `.gitignore`): `node_modules`, `.next`, `.env.local`, `.vercel`.

## Commands (run in Terminal from project root)

```bash
cd /Users/kimba/Desktop/SEVEN

# 1. Preview what will be added
git status
git add -n .

# 2. Stage everything (except ignored files)
git add .

# 3. Double-check: .env.local must NOT appear
git status

# 4. Commit
git commit -m "$(cat <<'EOF'
Launch FROM mini app on Base mainnet

Hub and BadgeNFT deployed; referral, badges, leaderboard, and Farcaster share flow.
EOF
)"

# 5. Push
git push -u origin main
```

## After push — Vercel

In Vercel project → **Settings → Environment Variables**, add:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
| `BADGE_RANK_SIGNER_PRIVATE_KEY` | rank signer wallet (never commit) |
| `BASE_RPC_URL` | Alchemy/Infura or `https://base-rpc.publicnode.com` |
| `HUB_DEPLOY_FROM_BLOCK` | `46519947` |

Redeploy after env vars are set.

## If push is rejected

```bash
git pull --rebase origin main
git push origin main
```

## Optional: new repo name

If you want a different GitHub repo, change remote:

```bash
git remote set-url origin https://github.com/YOUR_USER/YOUR_REPO.git
```
