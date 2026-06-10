"use client";

import { useState } from "react";
import Link from "next/link";
import { useAccount, useChainId, useSwitchChain } from "wagmi";

import { APP_TAGLINE } from "@/config/app";
import { AppNav } from "@/components/AppNav";
import { ConnectWallet } from "@/components/ConnectWallet";
import { DeployPanel } from "@/components/DeployPanel";
import { GmPanel } from "@/components/GmPanel";
import {
  DEPLOY_CHAIN_ID,
  isContractConfigured,
} from "@/config/contract";
import { isBadgeContractConfigured } from "@/config/badgeContract";
import { PointsRulesCard } from "@/components/PointsRulesCard";
import { ReferralInviteBanner } from "@/components/ReferralInviteBanner";
import { useFarcasterMiniApp } from "@/hooks/useFarcasterMiniApp";
import { useHubStats } from "@/hooks/useHubStats";

type Tab = "gm" | "deploy";

export function HomeApp() {
  const { inMiniApp } = useFarcasterMiniApp();
  const [tab, setTab] = useState<Tab>("gm");
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const wrongChain = isConnected && chainId !== DEPLOY_CHAIN_ID;

  const {
    deployCount,
    freeDeployAvailable,
    deployFeeOnChain,
    refreshStats,
  } = useHubStats();

  const hubReady = isContractConfigured;
  const actionDisabled = !isConnected || wrongChain || !hubReady;

  return (
    <>
      <AppNav />

      <header className="uni-card px-4 py-2.5 text-center">
        <p className="uni-caption">
          {inMiniApp ? "Farcaster" : "Web"} · Base · {APP_TAGLINE}
        </p>
        <p className="uni-airdrop-text mt-1 text-xs">
          More points = bigger{" "}
          <span className="uni-text-accent font-semibold">$F</span> airdrop
        </p>
      </header>

      {!hubReady && (
        <div className="uni-card uni-card-critical px-4 py-4">
          <p className="uni-label text-[var(--uni-critical)]">Hub not configured</p>
          <p className="uni-caption mt-2">
            Deploy <span className="uni-code">Hub.sol</span> and set{" "}
            <span className="uni-code">HUB_CONTRACT_ADDRESS</span>.
          </p>
        </div>
      )}

      <div className="uni-card px-3 py-2.5">
        <ConnectWallet compact />
      </div>

      {hubReady && isConnected && !wrongChain && <ReferralInviteBanner />}

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

      {hubReady && isConnected && !wrongChain && (
        <div className="uni-card p-3">
          <div className="uni-tabs mb-2">
            <button
              type="button"
              className={`uni-tab ${tab === "gm" ? "uni-tab-active" : ""}`}
              onClick={() => setTab("gm")}
            >
              GM
            </button>
            <button
              type="button"
              className={`uni-tab ${tab === "deploy" ? "uni-tab-active" : ""}`}
              onClick={() => setTab("deploy")}
            >
              Deploy
            </button>
          </div>

          {tab === "gm" ? (
            <GmPanel disabled={actionDisabled} />
          ) : (
            <DeployPanel
              freeDeployAvailable={freeDeployAvailable}
              deployFeeOnChain={deployFeeOnChain}
              onSuccess={() => void refreshStats()}
            />
          )}
        </div>
      )}

      {hubReady && (
        <PointsRulesCard />
      )}

      {isBadgeContractConfigured && (
        <Link href="/badges" className="uni-btn uni-btn-secondary block text-center">
          View badges · GM & Deploy milestones
        </Link>
      )}

      {hubReady && (
        <Link href="/referral" className="uni-btn uni-btn-secondary block text-center">
          Referral · +200 pts when friend does 1 GM
        </Link>
      )}

      {hubReady && (
        <Link href="/leaderboard" className="uni-btn uni-btn-secondary block text-center">
          Leaderboard · rank by points
        </Link>
      )}

      {!isBadgeContractConfigured && hubReady && (
        <p className="uni-caption text-center">
          Deploy <span className="uni-code">BadgeNFT.sol</span> and set{" "}
          <span className="uni-code">BADGE_NFT_ADDRESS</span> for NFT badges.
        </p>
      )}

      {hubReady && isConnected && !wrongChain && (
        <p className="uni-caption text-center">
          Deploys: <span className="uni-mono">{deployCount?.toString() ?? "0"}</span>
          {" · "}
          <Link href="/badges" className="uni-link">
            Earn badges
          </Link>
        </p>
      )}
    </>
  );
}
