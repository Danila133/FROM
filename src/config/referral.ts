import { getAddress, isAddress } from "viem";

import { buildBaseAppLaunchUrl } from "@/config/baseApp";
import { APP_SLUG } from "@/config/app";

/** Query param on any app URL, e.g. /?ref=0x… or /referral?ref=0x… */
export const REFERRAL_QUERY_PARAM = "ref";

export const PENDING_REFERRER_STORAGE_KEY = `${APP_SLUG}_pending_referrer`;

/** Must match Hub.POINTS_PER_REFERRAL */
export const POINTS_PER_REFERRAL = 200;

export function buildReferralLink(referrerAddress: string) {
  const address = isAddress(referrerAddress)
    ? getAddress(referrerAddress)
    : referrerAddress;
  return buildBaseAppLaunchUrl(`/?${REFERRAL_QUERY_PARAM}=${address}`);
}
