import Link from "next/link";
import Logo from "./Logo";
import { business } from "@/lib/business";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ink text-paper">
      <div className="container-x grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div className="col-span-2">
          <div className="text-paper">
            <Logo />
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/70">
            {business.description}
          </p>
          <p className="mt-5 text-xs text-paper/50">
            Licence {business.licenseNumber} · ABN 12 345 678 910
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
            Visit
          </div>
          <p className="mt-4 text-sm leading-relaxed text-paper/80">
            {business.address.street}
            <br />
            {business.address.suburb} {business.address.state} {business.address.postcode}
          </p>
          <a
            href={`tel:${business.phoneE164}`}
            className="mt-3 inline-block text-sm font-semibold text-paper hover:text-brand"
          >
            {business.phone}
          </a>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
            Demo versions
          </div>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li><Link href="/services/" className="hover:text-brand">Services</Link></li>
            <li><Link href="/blog/" className="hover:text-brand">Blog</Link></li>
            <li><Link href="/v4/" className="hover:text-brand">Toilet repair — Baldwin Park</Link></li>
            <li><Link href="/v5/" className="hover:text-brand">Running toilet guide</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col items-start justify-between gap-3 py-6 text-xs text-paper/50 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} {business.legalName}. All rights reserved.</span>
          <span>Built with Next.js · Statically rendered for speed.</span>
        </div>
      </div>
    </footer>
  );
}
