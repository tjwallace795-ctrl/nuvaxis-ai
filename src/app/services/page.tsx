import Link from "next/link";
import {
  services,
  categories,
  formatPrice,
  formatDuration,
} from "@/data/services";

export const metadata = {
  title: "Services — Ashbraids",
  description:
    "Full service menu: knotless braids, box braids, twists, locs, natural hair, and add-ons.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-sand">
        <div className="container-x py-20 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-caramel">
            Service menu
          </p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Every style, every detail.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-espresso/75">
            Pricing reflects the stylist&apos;s time and hair included for most
            styles. Length past bra-strap, extra density, or custom colors may
            add to the final quote. When in doubt — just ask in chat.
          </p>
        </div>
      </section>

      <section className="container-x py-16">
        {categories.map((cat) => (
          <div key={cat} id={cat} className="mb-16">
            <div className="mb-6 flex items-baseline justify-between border-b border-espresso/10 pb-3">
              <h2 className="font-display text-3xl">{cat}</h2>
              <span className="text-xs uppercase tracking-widest text-espresso/50">
                {services.filter((s) => s.category === cat).length} styles
              </span>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {services
                .filter((s) => s.category === cat)
                .map((s) => (
                  <article
                    key={s.id}
                    className="flex flex-col rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-espresso/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl">{s.name}</h3>
                      <span className="whitespace-nowrap font-semibold">
                        {formatPrice(s)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-espresso/70">
                      {s.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-widest text-espresso/50">
                      <span>{formatDuration(s.durationMin)}</span>
                      <Link
                        href={`/book?service=${s.id}`}
                        className="font-medium normal-case tracking-normal text-caramel hover:text-cocoa"
                      >
                        Book this →
                      </Link>
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
