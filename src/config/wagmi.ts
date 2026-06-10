import { Attribution } from "ox/erc8021";
import { http, createConfig, createStorage, cookieStorage } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";

import { APP_NAME, BASE_BUILDER_CODE } from "@/config/app";
import { farcasterMiniApp } from "@/lib/farcasterMiniAppConnector";

export const chains = [base] as const;

/** ERC-8021 suffix appended to every writeContract tx for base.dev attribution */
const builderDataSuffix = Attribution.toDataSuffix({
  codes: [process.env.NEXT_PUBLIC_BASE_BUILDER_CODE?.trim() || BASE_BUILDER_CODE],
});

export const wagmiConfig = createConfig({
  chains: [...chains],
  connectors: [
    farcasterMiniApp(),
    baseAccount({
      appName: APP_NAME,
    }),
    injected({ target: "metaMask" }),
    injected(),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
  dataSuffix: builderDataSuffix,
});

export function getConfig() {
  return wagmiConfig;
}

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
