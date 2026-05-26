import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from "@/config/app";
import {
  CANONICAL_SITE_URL,
  getAppHeroUrl,
  getAppIconUrl,
  getAppImageUrl,
  getAppSplashUrl,
} from "@/config/appAssets";

/** Farcaster domain verification — from-blue.vercel.app */
export const FARCASTER_ACCOUNT_ASSOCIATION = {
  header:
    "eyJmaWQiOjc3NzY2MywidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweEM1NDU2Q0E5NmEwNTlhNmUzZTlmQ0ZCMDcxMTQxRjMyMjBDM2QwZDQifQ",
  payload: "eyJkb21haW4iOiJmcm9tLWJsdWUudmVyY2VsLmFwcCJ9",
  signature:
    "/ivJLcMjiz4C1r52Qe/xCjqgzZxWf15BpZQ7+JkzB59wT4ew31JGP/qtufk0SQkp2fKgPCVbgDScASGc9twMMBw=",
} as const;

export const FARCASTER_BUTTON_TITLE = "Check this out";
export const FARCASTER_SPLASH_BACKGROUND_COLOR = "#eeccff";

function buildMiniappMetadata(origin: string) {
  return {
    version: "1",
    name: APP_NAME,
    homeUrl: origin,
    iconUrl: getAppIconUrl(origin),
    imageUrl: getAppImageUrl(origin),
    heroImageUrl: getAppHeroUrl(origin),
    buttonTitle: FARCASTER_BUTTON_TITLE,
    splashImageUrl: getAppSplashUrl(origin),
    splashBackgroundColor: FARCASTER_SPLASH_BACKGROUND_COLOR,
    webhookUrl: `${origin}/api/webhook`,
    description: APP_DESCRIPTION,
    subtitle: APP_TAGLINE,
    primaryCategory: "social",
    tags: ["base", "miniapp"],
    noindex: true,
  } as const;
}

export function buildFarcasterManifest() {
  const origin = CANONICAL_SITE_URL.replace(/\/$/, "");
  const metadata = buildMiniappMetadata(origin);

  return {
    accountAssociation: FARCASTER_ACCOUNT_ASSOCIATION,
    miniapp: metadata,
    frame: metadata,
  };
}
