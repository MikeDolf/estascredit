export type TocItem = { id: string; label: string };

export default function TableOfContents({
  items,
  label = "On this page",
}: {
  items: TocItem[];
  label?: string;
}) {
  return (
    <nav
      aria-label={label}
      className="rounded-2xl border border-ink/10 bg-white/60 p-5"
    >
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
        {label}
      </div>
      <ol className="mt-3 space-y-2 text-sm">
        {items.map((item, i) => (
          <li key={item.id} className="flex gap-2">
            <span className="text-ink/70 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <a
              href={`#${item.id}`}
              className="text-ink/80 hover:text-brand hover:underline underline-offset-4"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
