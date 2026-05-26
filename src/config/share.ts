import { APP_NAME } from "@/config/app";

export type ReferralShareCopy = {
  /** Farcaster cast body (link goes in embeds, not here) */
  farcasterText: string;
  /** X post — link appended separately */
  xText: string;
};

const INVITE_LINE = `Let's cook $F airdrop together 🔥
Join me on ${APP_NAME} on Base — GM, deploy tokens & collect exclusive NFT badges!`;

export function buildReferralShareCopy(): ReferralShareCopy {
  return {
    farcasterText: INVITE_LINE,
    xText: INVITE_LINE,
  };
}
