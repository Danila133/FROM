"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { zeroAddress, type Address } from "viem";

import {
  DEPLOY_CHAIN_ID,
  HUB_CONTRACT_ADDRESS,
  hubAbi,
  isContractConfigured,
} from "@/config/contract";
import {
  clearPendingReferrer,
  readPendingReferrer,
} from "@/lib/referralStorage";

export function useReferralRegistration() {
  const { address, isConnected } = useAccount();
  const [pendingReferrer, setPendingReferrer] = useState<Address | null>(null);
  const [registerBlockedAfterGm, setRegisterBlockedAfterGm] = useState(false);

  const enabled = Boolean(address) && isContractConfigured;

  const { data: referredBy, refetch: refetchReferredBy } = useReadContract({
    address: HUB_CONTRACT_ADDRESS,
    abi: hubAbi,
    functionName: "referredBy",
    args: address ? [address] : undefined,
    chainId: DEPLOY_CHAIN_ID,
    query: { enabled },
  });

  const { data: gmCount, refetch: refetchGmCount } = useReadContract({
    address: HUB_CONTRACT_ADDRESS,
    abi: hubAbi,
    functionName: "gmCount",
    args: address ? [address] : undefined,
    chainId: DEPLOY_CHAIN_ID,
    query: { enabled },
  });

  const hasReferrer =
    referredBy != null &&
    referredBy !== zeroAddress &&
    referredBy !== "0x0000000000000000000000000000000000000000";

  const hasDoneGm = gmCount != null && gmCount > BigInt(0);

  useEffect(() => {
    setPendingReferrer(readPendingReferrer());
  }, []);

  useEffect(() => {
    if (!isConnected || !address) {
      setRegisterBlockedAfterGm(false);
      return;
    }
    if (hasDoneGm && !hasReferrer && pendingReferrer) {
      clearPendingReferrer();
      setPendingReferrer(null);
      setRegisterBlockedAfterGm(true);
      return;
    }
    setRegisterBlockedAfterGm(false);
  }, [isConnected, address, hasDoneGm, hasReferrer, pendingReferrer]);

  const canRegister = useMemo(() => {
    if (!isConnected || !address || !pendingReferrer || hasReferrer) {
      return false;
    }
    if (hasDoneGm) return false;
    if (pendingReferrer.toLowerCase() === address.toLowerCase()) return false;
    return true;
  }, [isConnected, address, pendingReferrer, hasReferrer, hasDoneGm]);

  const awaitingFirstGm =
    isConnected && hasReferrer && gmCount != null && gmCount === BigInt(0);

  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const registerReferrer = useCallback(() => {
    if (!canRegister || !pendingReferrer) return;
    reset();
    writeContract({
      address: HUB_CONTRACT_ADDRESS,
      abi: hubAbi,
      functionName: "registerReferrer",
      args: [pendingReferrer],
      chainId: DEPLOY_CHAIN_ID,
    });
  }, [canRegister, pendingReferrer, reset, writeContract]);

  const refresh = useCallback(async () => {
    if (!enabled) return;
    await Promise.all([refetchReferredBy(), refetchGmCount()]);
  }, [enabled, refetchReferredBy, refetchGmCount]);

  useEffect(() => {
    if (!isSuccess) return;
    clearPendingReferrer();
    setPendingReferrer(null);
    void refresh();
  }, [isSuccess, refresh]);

  const dismissPending = useCallback(() => {
    clearPendingReferrer();
    setPendingReferrer(null);
    setRegisterBlockedAfterGm(false);
  }, []);

  useWatchContractEvent({
    address: HUB_CONTRACT_ADDRESS,
    abi: hubAbi,
    eventName: "GM",
    chainId: DEPLOY_CHAIN_ID,
    enabled,
    onLogs(logs) {
      if (
        address &&
        logs.some(
          (log) => log.args.user?.toLowerCase() === address.toLowerCase(),
        )
      ) {
        void refresh();
      }
    },
  });

  useWatchContractEvent({
    address: HUB_CONTRACT_ADDRESS,
    abi: hubAbi,
    eventName: "ReferralActivated",
    chainId: DEPLOY_CHAIN_ID,
    enabled,
    onLogs(logs) {
      if (
        address &&
        logs.some(
          (log) =>
            log.args.referee?.toLowerCase() === address.toLowerCase() ||
            log.args.referrer?.toLowerCase() === address.toLowerCase(),
        )
      ) {
        void refresh();
      }
    },
  });

  return {
    pendingReferrer,
    referredBy: hasReferrer ? (referredBy as Address) : null,
    canRegister,
    awaitingFirstGm,
    registerBlockedAfterGm,
    registerReferrer,
    dismissPending,
    isRegistering: isPending || isConfirming,
    registerError: writeError,
    refresh,
  };
}
