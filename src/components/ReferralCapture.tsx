"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import {
  captureReferrerFromSearch,
  savePendingReferrer,
} from "@/lib/referralStorage";

/** Persists ?ref= from any page into localStorage for wallet registration. */
export function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = captureReferrerFromSearch(searchParams.toString());
    if (ref) savePendingReferrer(ref);
  }, [searchParams]);

  return null;
}
