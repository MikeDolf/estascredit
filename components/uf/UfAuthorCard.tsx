import { uralforklift as uf } from "@/lib/uralforklift";

/**
 * E-E-A-T: подпись автора без выдуманных регалий.
 * Аттестаций и стажа здесь нет намеренно — см. правило в lib/uralforklift.ts.
 */
export default function UfAuthorCard() {
  return (
    <aside className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold text-white"
        >
          {uf.author.initials}
        </div>
        <div className="min-w-0">
          <div className="font-display text-lg font-bold tracking-tight">{uf.author.name}</div>
          <div className="text-xs text-ink/60">
            {uf.author.role} · {uf.name}
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">{uf.author.bio}</p>
    </aside>
  );
}
