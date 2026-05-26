import sdk from "@farcaster/frame-sdk";

import { buildReferralShareCopy } from "@/config/share";

/** X (formerly Twitter) web intent — https://x.com/intent/post */
const X_INTENT_POST_URL = "https://x.com/intent/post";

export function buildXIntentUrl(text: string, url: string): string {
  const fullText = `${text}\n${url}`;
  return `${X_INTENT_POST_URL}?${new URLSearchParams({
    text: fullText,
  }).toString()}`;
}

export function buildWarpcastComposeUrl(text: string, embeds: string[]): string {
  const params = new URLSearchParams();
  params.set("text", text);
  for (const embed of embeds.slice(0, 2)) {
    params.append("embeds[]", embed);
  }
  return `https://warpcast.com/~/compose?${params.toString()}`;
}

function openSharePopup(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=560,height=640");
}

export function shareOnX(referralLink: string) {
  const { xText } = buildReferralShareCopy();
  openSharePopup(buildXIntentUrl(xText, referralLink));
}

export async function shareOnFarcaster(
  referralLink: string,
  inMiniApp: boolean,
): Promise<void> {
  const { farcasterText } = buildReferralShareCopy();
  const embeds = [referralLink] as [string];

  if (inMiniApp && typeof sdk.actions.composeCast === "function") {
    await sdk.actions.composeCast({ text: farcasterText, embeds });
    return;
  }

  openSharePopup(buildWarpcastComposeUrl(farcasterText, embeds));
}
