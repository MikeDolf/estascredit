type Tone = "neutral" | "warn" | "good" | "ink";

const toneClasses: Record<Tone, string> = {
  neutral: "border-ink/10 bg-white text-ink/80",
  warn: "border-amber-400/40 bg-amber-50 text-amber-900",
  good: "border-emerald-400/40 bg-emerald-50 text-emerald-900",
  ink: "border-ink/20 bg-ink text-paper",
};

export default function VersionBanner({
  version,
  title,
  body,
  tone = "neutral",
}: {
  version: string;
  title: string;
  body: string;
  tone?: Tone;
}) {
  return (
    <div className={`rounded-2xl border p-5 md:p-6 ${toneClasses[tone]}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
        {version}
      </div>
      <div className="mt-1 font-display text-lg font-bold md:text-xl">{title}</div>
      <p className="mt-1.5 text-sm leading-relaxed opacity-90">{body}</p>
    </div>
  );
}
