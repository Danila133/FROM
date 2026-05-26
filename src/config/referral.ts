import { getAddress, isAddress } from "viem";

import { APP_SLUG } from "@/config/app";
import { CANONICAL_SITE_URL } from "@/config/appAssets";

/** Query param on any app URL, e.g. /?ref=0x… or /referral?ref=0x… */
export const REFERRAL_QUERY_PARAM = "ref";

export const PENDING_REFERRER_STORAGE_KEY = `${APP_SLUG}_pending_referrer`;

/** Must match Hub.POINTS_PER_REFERRAL */
export const POINTS_PER_REFERRAL = 200;

export function buildReferralLink(referrerAddress: string, origin?: string) {
  const base = (origin ?? CANONICAL_SITE_URL).replace(/\/$/, "");
  const address = isAddress(referrerAddress)
    ? getAddress(referrerAddress)
    : referrerAddress;
  return `${base}/?${REFERRAL_QUERY_PARAM}=${address}`;
}
