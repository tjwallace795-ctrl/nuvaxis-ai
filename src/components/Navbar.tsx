import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-espresso/10 bg-cream/85 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-espresso"
        >
          Ashbraids
          <span className="ml-1 text-gold">.</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-espresso/80 transition hover:text-espresso"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/book" className="btn btn-primary text-sm">
          Book now
        </Link>
      </div>
    </header>
  );
}
