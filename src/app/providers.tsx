"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, Suspense, useState } from "react";
import type { State } from "wagmi";
import { WagmiProvider } from "wagmi";

import { FarcasterPinModal } from "@/components/FarcasterPinModal";
import { ReferralCapture } from "@/components/ReferralCapture";
import { WalletAutoReconnect } from "@/components/WalletAutoReconnect";
import { FarcasterAddMiniAppProvider } from "@/context/FarcasterAddMiniAppContext";
import { FarcasterMiniAppProvider } from "@/context/FarcasterMiniAppContext";
import { wagmiConfig } from "@/config/wagmi";

export function Providers({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <FarcasterMiniAppProvider>
      <WagmiProvider
        config={wagmiConfig}
        initialState={initialState}
        reconnectOnMount={false}
      >
        <QueryClientProvider client={queryClient}>
          <FarcasterAddMiniAppProvider>
            <WalletAutoReconnect />
            <Suspense fallback={null}>
              <ReferralCapture />
            </Suspense>
            <FarcasterPinModal />
            {children}
          </FarcasterAddMiniAppProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </FarcasterMiniAppProvider>
  );
}
