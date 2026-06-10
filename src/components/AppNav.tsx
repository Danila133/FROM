"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppLogo } from "@/components/AppLogo";

const links = [
  { href: "/", label: "App" },
  { href: "/badges", label: "Badges" },
  { href: "/leaderboard", label: "Leaders" },
  { href: "/referral", label: "Referral" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="uni-card mb-1 flex items-center justify-between gap-2 px-3 py-2">
      <Link href="/" className="shrink-0 no-underline" aria-label="FROM home">
        <AppLogo size={32} />
      </Link>
      <div className="uni-tabs">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`uni-tab ${active ? "uni-tab-active" : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
