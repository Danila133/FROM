"use client";

import Link from "next/link";

import { POINTS_PER_REFERRAL } from "@/config/referral";
import { useReferralRegistration } from "@/hooks/useReferralRegistration";
import { truncateAddress } from "@/lib/leaderboard";
import { isContractConfigured } from "@/config/contract";

export function ReferralInviteBanner() {
  const {
    pendingReferrer,
    referredBy,
    canRegister,
    awaitingFirstGm,
    registerBlockedAfterGm,
    registerReferrer,
    isRegistering,
    registerError,
  } = useReferralRegistration();

  if (!isContractConfigured) return null;

  if (awaitingFirstGm && referredBy) {
    return (
      <div className="uni-card px-4 py-4">
        <p className="uni-label text-[var(--uni-success)]">Referrer linked</p>
        <p className="uni-body mt-2 text-sm">
          You&apos;re connected to{" "}
          <span className="uni-mono">{truncateAddress(referredBy)}</span>. Do
          your <span className="font-medium">first GM</span> on the home tab to
          activate the invite (+{POINTS_PER_REFERRAL} pts for them).
        </p>
        <Link href="/" className="uni-btn uni-btn-primary mt-3 block text-center">
          Go to GM
        </Link>
      </div>
    );
  }

  if (registerBlockedAfterGm) {
    return (
      <div className="uni-card uni-card-critical px-4 py-4">
        <p className="uni-caption">
          This wallet already completed a GM. Referral links must be registered
          before your first GM.
        </p>
      </div>
    );
  }

  if (!canRegister || !pendingReferrer) return null;

  return (
    <div className="uni-card px-4 py-4">
      <p className="uni-label">You were invited</p>
      <p className="uni-body mt-2 text-sm">
        Link{" "}
        <span className="uni-mono">{truncateAddress(pendingReferrer)}</span> as
        your referrer, then do your first GM (+{POINTS_PER_REFERRAL} pts for
        them).
      </p>
      <button
        type="button"
        className="uni-btn uni-btn-primary mt-3 w-full"
        disabled={isRegistering}
        onClick={registerReferrer}
      >
        {isRegistering ? "Confirm in wallet…" : "Register referrer"}
      </button>
      <Link
        href="/referral"
        className="uni-link uni-caption mt-2 block text-center"
      >
        Referral details →
      </Link>
      {registerError && (
        <p className="uni-caption mt-2 text-center text-[var(--uni-critical)]">
          {registerError.message.split("\n")[0]}
        </p>
      )}
    </div>
  );
}
