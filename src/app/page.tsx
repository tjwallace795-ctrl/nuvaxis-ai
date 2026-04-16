import Link from "next/link";
import { services, formatPrice } from "@/data/services";

export default function HomePage() {
  const featured = services.filter((s) => s.featured);

  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-sand">
        <div className="container-x grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-caramel">
              Luxury braiding studio
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[1.05] text-espresso md:text-7xl">
              Braids that feel
              <br />
              like a signature.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-espresso/70">
              Knotless, boho, twists, and locs — hand-crafted by Ashbraids.
              Gentle on your edges, honest on time, and built to turn heads.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn btn-primary">
                Book an appointment
              </Link>
              <Link href="/services" className="btn btn-outline">
                View services
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-espresso/70">
              <div>
                <div className="font-display text-2xl text-espresso">7d</div>
                <div>Open every day</div>
              </div>
              <div>
                <div className="font-display text-2xl text-espresso">10:30</div>
                <div>First chair, AM</div>
              </div>
              <div>
                <div className="font-display text-2xl text-espresso">7:00</div>
                <div>Last chair, PM</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-cocoa/80 shadow-soft">
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cocoa via-espresso to-caramel">
                <span className="font-display text-6xl text-cream/90">A.</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-cream p-5 shadow-soft md:block">
              <div className="text-xs uppercase tracking-widest text-espresso/60">
                Today
              </div>
              <div className="font-display text-xl">Boho Knotless</div>
              <div className="text-xs text-espresso/60">
                Next opening · 2:30 PM
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="container-x py-20">
        <div className="grid items-center gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <h2 className="font-display text-4xl text-espresso">
              Meet your stylist.
            </h2>
          </div>
          <div className="md:col-span-3">
            <p className="text-lg text-espresso/75">
              I&apos;m Ash — the hands behind Ashbraids. I specialize in
              scalp-friendly knotless styles, boho braids with human-hair curls,
              and low-tension protective installs that last. Every chair I sit
              in starts with a real conversation about your lifestyle, your
              edges, and the look you want to leave with.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://booksy.com/en-us/dl/show-business/724017"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                See Booksy reviews
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="bg-sand/60 py-20">
        <div className="container-x">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-caramel">
                Signature styles
              </p>
              <h2 className="mt-2 font-display text-4xl">Most-booked looks</h2>
            </div>
            <Link
              href="/services"
              className="hidden text-sm font-medium underline-offset-4 hover:underline md:inline"
            >
              View all services →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <article
                key={s.id}
                className="group flex flex-col rounded-2xl bg-cream p-6 shadow-soft transition hover:-translate-y-1"
              >
                <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-cocoa to-caramel" />
                <h3 className="font-display text-2xl">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm text-espresso/70">
                  {s.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="font-semibold">{formatPrice(s)}</span>
                  <Link
                    href={`/book?service=${s.id}`}
                    className="font-medium text-caramel hover:text-cocoa"
                  >
                    Book →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-24 text-center">
        <h2 className="font-display text-4xl md:text-5xl">
          Ready for your next style?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-espresso/70">
          Grab a seat at the chair. Slots fill fast — especially weekends.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/book" className="btn btn-primary">
            Check availability
          </Link>
          <Link href="/services" className="btn btn-outline">
            Browse services
          </Link>
        </div>
      </section>
    </>
  );
}
