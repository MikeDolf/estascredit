"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const versions = [
  { id: "v1", label: "v1 · Scaffold" },
  { id: "v2", label: "v2 · AI slop" },
  { id: "v3", label: "v3 · Voiced" },
  { id: "v4", label: "v4 · Landing" },
  { id: "v5", label: "v5 · On-page SEO" },
  { id: "v6", label: "v6 · Technical SEO" },
];

export default function VersionSwitcher() {
  const pathname = usePathname() || "";
  const active = versions.find((v) => pathname.startsWith(`/${v.id}`))?.id;

  return (
    <nav
      aria-label="Version switcher"
      className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/70 p-1 backdrop-blur md:flex"
    >
      {versions.map((v) => {
        const isActive = v.id === active;
        return (
          <Link
            key={v.id}
            href={`/${v.id}/`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-ink text-paper"
                : "text-ink/60 hover:bg-ink/5 hover:text-ink"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
