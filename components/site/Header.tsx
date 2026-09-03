import Link from "next/link";
import Logo from "./Logo";
import { business } from "@/lib/business";

const nav = [
  { label: "Services", href: "/services/" },
  { label: "Blog", href: "/blog/" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-paper/80 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4 md:h-20">
        <Link href="/" aria-label={`${business.name} home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink/75 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${business.phoneE164}`}
            className="hidden text-sm font-semibold text-ink/80 hover:text-ink lg:inline"
          >
            {business.phone}
          </a>
          <a href={`tel:${business.phoneE164}`} className="btn-brand">
            Call now
          </a>
        </div>
      </div>
    </header>
  );
}
