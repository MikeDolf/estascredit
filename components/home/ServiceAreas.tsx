import { business } from "@/lib/business";

export default function ServiceAreas() {
  return (
    <section className="container-x mt-24 md:mt-32">
      <div className="overflow-hidden rounded-3xl bg-ink p-10 text-paper md:p-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-paper/60">
              Where we work
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.05] tracking-tightest md:text-5xl">
              Inner south Melbourne. <br />
              <span className="text-brand">On the road in under 60 minutes.</span>
            </h2>
            <p className="mt-5 max-w-xl text-paper/70">
              We deliberately keep our service radius tight so our vans are never more than 20
              minutes from your address. That's how same-day actually works.
            </p>
          </div>

          <div className="md:col-span-5">
            <ul className="flex flex-wrap gap-2">
              {business.serviceAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-paper/15 bg-paper/5 px-4 py-2 text-sm text-paper/90 backdrop-blur"
                >
                  {area}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-paper/50">
              Not sure if we cover your suburb? Call {business.phone} — if we can't, we'll
              recommend someone we trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
