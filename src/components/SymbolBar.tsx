import { Link } from "../lib/router";
import { ArrowRight } from "./Icons";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/* Line motifs drawn from Argent Lune's own collections */
const SYMBOLS = [
  {
    label: "Lune",
    to: "/shop",
    path: <path {...stroke} d="M27 7a13 13 0 1 0 6 21A11 11 0 0 1 27 7Z" />,
  },
  {
    label: "Botanica",
    to: "/collections/botanica",
    path: (
      <>
        <path {...stroke} d="M8 32C10 16 20 8 32 8c0 12-8 22-24 24Z" />
        <path {...stroke} d="M8 32 24 16M15 25h7M19 21v-6" />
      </>
    ),
  },
  {
    label: "Materia",
    to: "/collections/materia",
    path: (
      <>
        <path {...stroke} d="M20 6c8 1 14 7 14 14s-6 14-14 14S6 28 6 20 12 5 20 6Z" />
        <circle {...stroke} cx="15" cy="16" r="2.5" />
        <circle {...stroke} cx="24" cy="14" r="2" />
        <circle {...stroke} cx="22" cy="24" r="3" />
        <circle {...stroke} cx="13" cy="25" r="1.6" />
      </>
    ),
  },
  {
    label: "Papillon",
    to: "/collections/papillon",
    path: (
      <>
        <path {...stroke} d="M20 13v17M20 13l-3-5M20 13l3-5" />
        <path {...stroke} d="M20 17C15 8 5 8 6 15c1 5 7 6 14 4M20 17c5-9 15-9 14-2-1 5-7 6-14 4" />
        <path {...stroke} d="M20 21c-4 1-9 4-8 8 1 3 6 1 8-4M20 21c4 1 9 4 8 8-1 3-6 1-8-4" />
      </>
    ),
  },
  {
    label: "Miniature",
    to: "/collections/miniature-silverware",
    path: (
      <>
        <path {...stroke} d="M11 8h18c0 9-4 14-9 14s-9-5-9-14Z" />
        <path {...stroke} d="M20 22v9M14 32h12" />
      </>
    ),
  },
  {
    label: "Objects",
    to: "/objects",
    path: (
      <>
        <path {...stroke} d="M10 9h20l-1.5 20c-.3 3-2.5 5-5.5 5h-6c-3 0-5.2-2-5.5-5L10 9Z" />
        <path {...stroke} d="M14 15c2 1 3 4 1 6M25 13c-2 2-1 5 1 6M18 26c1-1 3-1 4 0" />
      </>
    ),
  },
];

/** Dark motif bar shown directly above the footer on brand pages. */
export function SymbolBar() {
  return (
    <section aria-label="Find your collection" className="bg-ink text-ivory">
      <div className="container-lune flex flex-col items-center gap-10 py-12 lg:flex-row lg:justify-between lg:py-14">
        <ul className="grid w-full grid-cols-3 gap-y-8 sm:grid-cols-6 lg:max-w-4xl">
          {SYMBOLS.map((s) => (
            <li key={s.label}>
              <Link
                to={s.to}
                className="group flex flex-col items-center gap-3"
                aria-label={s.label}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  aria-hidden
                  className="text-ivory/85 transition-transform duration-500 group-hover:-translate-y-1 group-hover:text-ivory"
                >
                  {s.path}
                </svg>
                <span className="text-[10px] font-medium tracking-[0.2em] text-ivory/55 uppercase group-hover:text-ivory">
                  {s.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/shop" className="link-line shrink-0 text-ivory">
          Find Your Collection <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
