import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-espresso/10 bg-sand/60">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="font-display text-2xl">Ashbraids</div>
          <p className="mt-3 max-w-xs text-sm text-espresso/70">
            Luxury braiding & natural hair styling. Every install is hand-crafted
            to protect your edges and show off your style.
          </p>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-espresso/60">
            Visit
          </div>
          <ul className="space-y-1 text-sm">
            <li>Open every day</li>
            <li>10:30 AM – 7:00 PM</li>
            <li>By appointment only</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-espresso/60">
            Explore
          </div>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/services" className="hover:underline">
                Services
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:underline">
                Book an appointment
              </Link>
            </li>
            <li>
              <a
                href="https://booksy.com/en-us/dl/show-business/724017"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Booksy profile
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-espresso/10 py-5">
        <div className="container-x text-xs text-espresso/60">
          © {new Date().getFullYear()} Ashbraids. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
