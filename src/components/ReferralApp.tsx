"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { AppNav } from "@/components/AppNav";
import { ConnectWallet } from "@/components/ConnectWallet";
import { isContractConfigured, DEPLOY_CHAIN_ID } from "@/config/contract";
import { buildReferralLink, POINTS_PER_REFERRAL } from "@/config/referral";
import { useHubStats } from "@/hooks/useHubStats";
import { useReferralRegistration } from "@/hooks/useReferralRegistration";
import { ReferralShareButtons } from "@/components/ReferralShareButtons";
import { copyToClipboard } from "@/lib/copyToClipboard";
import { truncateAddress } from "@/lib/leaderboard";

export function ReferralApp() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const wrongChain = isConnected && chainId !== DEPLOY_CHAIN_ID;

  const { referralCount, points } = useHubStats();
  const {
    pendingReferrer,
    referredBy,
    canRegister,
    awaitingFirstGm,
    registerBlockedAfterGm,
    isRegistering,
    registerReferrer,
    dismissPending,
    registerError,
  } = useReferralRegistration();

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const referralLink = useMemo(
    () => (address ? buildReferralLink(address) : ""),
    [address],
  );

  const referralPointsEarned = useMemo(() => {
    const count = Number(referralCount ?? BigInt(0));
    return count * POINTS_PER_REFERRAL;
  }, [referralCount]);

  const handleCopy = useCallback(async () => {
    if (!referralLink) return;
    setCopyError(false);

    const ok = await copyToClipboard(referralLink);
    if (ok) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      return;
    }

    setCopyError(true);
    window.setTimeout(() => setCopyError(false), 3000);
  }, [referralLink]);

  return (
    <>
      <AppNav />

      <header className="uni-card px-5 py-5 text-center">
        <p className="uni-eyebrow">Invite friends · Base</p>
        <h1 className="uni-title mt-2 text-3xl">Referral</h1>
        <p className="uni-body mt-2 text-sm">
          Share your link. A friend counts when they register you as referrer{" "}
          <span className="font-medium">and complete their first GM</span>. You
          then earn{" "}
          <span className="uni-text-accent font-semibold">
            +{POINTS_PER_REFERRAL} points
          </span>{" "}
          per activated friend.
        </p>
      </header>

      {!isContractConfigured && (
        <div className="uni-card uni-card-critical px-4 py-4">
          <p className="uni-caption">Deploy Hub and set contract address first.</p>
        </div>
      )}

      <div className="uni-card px-4 py-5">
        <ConnectWallet />
      </div>

      {wrongChain && (
        <button
          type="button"
          className="uni-btn uni-btn-primary"
          disabled={isSwitching}
          onClick={() => switchChain({ chainId: DEPLOY_CHAIN_ID })}
        >
          {isSwitching ? "Switching…" : "Switch to Base"}
        </button>
      )}

      {isConnected && !wrongChain && isContractConfigured && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <ReferralStat
              label="Friends activated"
              value={referralCount?.toString() ?? "0"}
            />
            <ReferralStat
              label="Points from referrals"
              value={referralPointsEarned.toString()}
              accent
            />
          </div>

          <div className="uni-card px-4 py-4">
            <p className="uni-label">Your referral link</p>
            {address ? (
              <>
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  aria-label="Your referral link"
                  onFocus={(event) => event.currentTarget.select()}
                  onClick={(event) => event.currentTarget.select()}
                  className="uni-mono mt-2 w-full rounded-xl border border-[var(--uni-border)] bg-[var(--uni-bg-inset)] px-3 py-2.5 text-xs text-[var(--uni-text-secondary)] outline-none"
                />
                <button
                  type="button"
                  className="uni-btn uni-btn-primary mt-4 w-full"
                  onClick={() => void handleCopy()}
                >
                  {copied ? "Copied!" : "Copy link"}
                </button>
                {copyError && (
                  <p className="uni-caption mt-2 text-center text-[var(--uni-critical)]">
                    Could not copy — tap the link above to select, then copy
                    manually.
                  </p>
                )}
                <div className="mt-4 border-t border-[var(--uni-border)] pt-4">
                  <ReferralShareButtons referralLink={referralLink} />
                </div>
              </>
            ) : (
              <p className="uni-caption mt-2">Connect wallet to get your link.</p>
            )}
          </div>

          {awaitingFirstGm && referredBy && (
            <div className="uni-card px-4 py-4">
              <p className="uni-label text-[var(--uni-success)]">Referrer linked</p>
              <p className="uni-body mt-2 text-sm">
                You&apos;re connected to{" "}
                <span className="uni-mono">{truncateAddress(referredBy)}</span>.
                Complete your <span className="font-medium">first GM</span> on
                the home tab to activate (+{POINTS_PER_REFERRAL} pts for them).
              </p>
            </div>
          )}

          {registerBlockedAfterGm && (
            <div className="uni-card uni-card-critical px-4 py-4">
              <p className="uni-caption">
                You already completed a GM. Referral must be registered before
                your first GM.
              </p>
            </div>
          )}

          {canRegister && pendingReferrer && (
            <div className="uni-card px-4 py-4">
              <p className="uni-label">You were invited</p>
              <p className="uni-body mt-2 text-sm">
                Link{" "}
                <span className="uni-mono">
                  {truncateAddress(pendingReferrer)}
                </span>{" "}
                as your referrer (one transaction), then do your{" "}
                <span className="font-medium">first GM</span> on the home tab.
                They receive +{POINTS_PER_REFERRAL} points only after your first
                GM.
              </p>
              <button
                type="button"
                className="uni-btn uni-btn-primary mt-4 w-full"
                disabled={isRegistering}
                onClick={registerReferrer}
              >
                {isRegistering ? "Confirm in wallet…" : "Register referrer"}
              </button>
              <button
                type="button"
                className="uni-btn uni-btn-ghost mt-2 w-full"
                disabled={isRegistering}
                onClick={dismissPending}
              >
                Dismiss
              </button>
              {registerError && (
                <p className="uni-caption mt-2 text-center text-[var(--uni-critical)]">
                  {registerError.message.split("\n")[0]}
                </p>
              )}
            </div>
          )}

          {referredBy && (
            <div className="uni-card-inset px-4 py-3 text-center">
              <p className="uni-caption">
                Your referrer:{" "}
                <span className="uni-mono">{truncateAddress(referredBy)}</span>
              </p>
            </div>
          )}

          <div className="uni-card-inset px-4 py-3">
            <p className="uni-label">How it works</p>
            <ol className="uni-caption mt-2 list-decimal space-y-1 pl-4">
              <li>Copy your link or use Share on X / Share on Farcaster.</li>
              <li>They open the app, connect a wallet, and tap Register referrer.</li>
              <li>
                They must register you <span className="font-medium">before</span>{" "}
                their first GM.
              </li>
              <li>
                When they complete their <span className="font-medium">first GM</span>,
                you get +{POINTS_PER_REFERRAL} points and your activated-friend
                count increases.
              </li>
            </ol>
          </div>

          <p className="uni-caption text-center">
            Total points:{" "}
            <span className="uni-mono uni-text-accent">
              {points?.toString() ?? "0"}
            </span>
          </p>
        </>
      )}

      {!isConnected && isContractConfigured && (
        <p className="uni-caption text-center">
          Connect your wallet to see your referral link and stats.
        </p>
      )}
    </>
  );
}

function ReferralStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="uni-card-inset px-3 py-2.5">
      <p className="uni-label">{label}</p>
      <p
        className={`uni-mono mt-0.5 text-lg font-semibold ${accent ? "uni-text-accent" : "text-[var(--uni-text)]"}`}
      >
        {value}
      </p>
    </div>
  );
}
