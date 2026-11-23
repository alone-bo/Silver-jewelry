import { Link } from "../lib/router";
import { Newsletter } from "./Newsletter";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Shop All", to: "/shop" },
      { label: "Jewellery", to: "/jewellery" },
      { label: "Objects", to: "/objects" },
      { label: "Bespoke", to: "/bespoke" },
    ],
  },
  {
    title: "Argent Lune",
    links: [
      { label: "Our Craft", to: "/craft" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Client Care",
    links: [
      { label: "Care Guide", to: "/care" },
      { label: "FAQ", to: "/faq" },
      { label: "Shipping", to: "/shipping" },
      { label: "Returns", to: "/returns" },
      { label: "UK Hallmarking", to: "/hallmarking" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Bespoke Terms", to: "/bespoke-terms" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const social = ["Instagram", "Pinterest"];

export function Footer() {
  return (
    <footer className="bg-stone">
      <div className="container-lune grid gap-14 pb-14 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-10">
        {/* Left: brand + newsletter (anchored bottom-left on desktop, first on mobile) */}
        <div className="flex flex-col justify-between gap-12 lg:col-span-5">
          <div>
            <Link to="/" className="font-serif text-[22px] font-medium tracking-[0.34em]">
              ARGENT LUNE
            </Link>
            <p className="mt-4 font-serif text-xl italic text-muted">Where Silver Takes Form.</p>
          </div>
          <Newsletter />
        </div>

        {/* Right: navigation */}
        <div className="flex flex-col justify-between gap-12 lg:col-span-6 lg:col-start-7">
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="eyebrow mb-5">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map((l) => (
                    <li key={l.to}>
                      <Link
                        to={l.to}
                        className="text-[14px] text-muted transition-colors hover:text-deep"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-3">Client Care</p>
              <p className="text-[14px] text-muted">
                <span className="border border-dashed border-taupe px-2 py-0.5 italic">
                  customer-service@[domain]
                </span>
              </p>
            </div>
            <div>
              <p className="eyebrow mb-3">Follow</p>
              <ul className="flex gap-5 text-[14px] text-muted">
                {social.map((s) => (
                  <li key={s}>
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      title="Link to be confirmed"
                      aria-label={`${s} (link to be confirmed)`}
                      className="transition-colors hover:text-deep"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="container-lune flex flex-col gap-3 border-t border-line py-6 text-[12px] text-muted md:flex-row md:items-center md:justify-between">
        <p>© 2026 ARGENT LUNE LIMITED. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>United Kingdom · GBP £ · English</span>
          <Link to="/design-system" className="hover:text-deep">
            Design System
          </Link>
        </div>
      </div>
    </footer>
  );
}
