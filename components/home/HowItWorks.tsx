const steps = [
  {
    n: "01",
    title: "Tell us what's going wrong",
    body: "Call, text, or book online. We'll triage on the phone and tell you honestly if it's a DIY fix before sending anyone.",
  },
  {
    n: "02",
    title: "Fixed price before we start",
    body: "Once we've seen the job, you get a flat, written price. Approve it, we start. Decline, we leave — no call-out fee.",
  },
  {
    n: "03",
    title: "Done, cleaned up, warranted",
    body: "Most jobs finished same day. 12-month workmanship warranty, and we don't leave until the mess is gone.",
  },
];

export default function HowItWorks() {
  return (
    <section className="container-x mt-24 md:mt-32">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="eyebrow">How it works</div>
          <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
            Three steps. <span className="squiggle">No surprises.</span>
          </h2>
          <p className="mt-4 max-w-sm text-ink/70">
            We built our pricing model after getting sick of hearing "the other guy charged me
            $900 for a washer". Flat prices, approved before we start.
          </p>
        </div>

        <ol className="grid gap-4 md:col-span-8 md:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-ink/10 bg-white p-6 shadow-card"
            >
              <div className="mb-5 inline-flex h-10 items-center rounded-full bg-ink px-3 text-xs font-bold tracking-widest text-paper">
                {s.n}
              </div>
              <div className="font-display text-xl font-bold leading-tight">{s.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
