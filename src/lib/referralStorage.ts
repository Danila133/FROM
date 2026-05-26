import { getAddress, isAddress, type Address } from "viem";

import {
  PENDING_REFERRER_STORAGE_KEY,
  REFERRAL_QUERY_PARAM,
} from "@/config/referral";

export function readPendingReferrer(): Address | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_REFERRER_STORAGE_KEY);
  if (!raw || !isAddress(raw)) return null;
  return getAddress(raw);
}

export function savePendingReferrer(address: Address) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_REFERRER_STORAGE_KEY, getAddress(address));
}

export function clearPendingReferrer() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_REFERRER_STORAGE_KEY);
}

export function captureReferrerFromSearch(search: string): Address | null {
  const params = new URLSearchParams(search);
  const ref = params.get(REFERRAL_QUERY_PARAM);
  if (!ref || !isAddress(ref)) return null;
  return getAddress(ref);
}
