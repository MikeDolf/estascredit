export default function AuthorCard({
  name,
  role,
  licence,
  years,
  bio,
}: {
  name: string;
  role: string;
  licence: string;
  years: number;
  bio: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <aside className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand text-lg font-bold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <div className="font-display text-lg font-bold tracking-tight">{name}</div>
          <div className="text-xs text-ink/60">{role}</div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink/60">
            <span>Licence {licence}</span>
            <span>·</span>
            <span>{years} years qualified</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">{bio}</p>
    </aside>
  );
}
