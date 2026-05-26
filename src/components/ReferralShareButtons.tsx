"use client";

import { useCallback, useState } from "react";

import { shareOnFarcaster, shareOnX } from "@/lib/shareReferral";
import { useFarcasterMiniApp } from "@/hooks/useFarcasterMiniApp";

type ReferralShareButtonsProps = {
  referralLink: string;
  disabled?: boolean;
};

export function ReferralShareButtons({
  referralLink,
  disabled,
}: ReferralShareButtonsProps) {
  const { inMiniApp } = useFarcasterMiniApp();
  const [fcPending, setFcPending] = useState(false);
  const [fcError, setFcError] = useState<string | null>(null);

  const handleShareX = useCallback(() => {
    if (!referralLink || disabled) return;
    shareOnX(referralLink);
  }, [referralLink, disabled]);

  const handleShareFarcaster = useCallback(async () => {
    if (!referralLink || disabled) return;
    setFcError(null);
    setFcPending(true);
    try {
      await shareOnFarcaster(referralLink, inMiniApp);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not open composer";
      setFcError(message.split("\n")[0]);
    } finally {
      setFcPending(false);
    }
  }, [referralLink, disabled, inMiniApp]);

  return (
    <div className="flex flex-col gap-2">
      <p className="uni-label">Share invite</p>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          className="uni-btn uni-btn-secondary text-sm"
          disabled={disabled}
          onClick={handleShareX}
        >
          Share on X
        </button>
        <button
          type="button"
          className="uni-btn uni-btn-secondary text-sm"
          disabled={disabled || fcPending}
          onClick={() => void handleShareFarcaster()}
        >
          {fcPending ? "Opening…" : "Share on Farcaster"}
        </button>
      </div>
      <p className="uni-caption text-center text-[11px] leading-snug text-[var(--uni-text-tertiary)]">
        Opens a pre-filled post — tap Publish or Cast to share.
      </p>
      {fcError && (
        <p className="uni-caption text-center text-[var(--uni-critical)]">
          {fcError}
        </p>
      )}
    </div>
  );
}
