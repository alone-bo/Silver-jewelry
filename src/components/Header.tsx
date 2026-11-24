import { useEffect, useRef, useState } from "react";
import { Link, useRoute } from "../lib/router";
import { cx } from "../lib/format";
import { useCart } from "../store/cart";
import { BagIcon, ChevronDown, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { IMG } from "../data/images";
import { Img } from "./ui";

type NavLink = { label: string; to: string };
type NavGroup = { title: string; links: NavLink[] };
type NavItem = {
  label: string;
  to: string;
  groups?: NavGroup[];
  features?: { label: string; to: string; image: string; alt: string }[];
};

export const NAV: NavItem[] = [
  { label: "Shop", to: "/shop" },
  {
    label: "Jewellery",
    to: "/jewellery",
    groups: [
      {
        title: "Categories",
        links: [
          { label: "Rings", to: "/jewellery?category=Rings" },
          { label: "Necklaces", to: "/jewellery?category=Necklaces" },
          { label: "Pendants", to: "/jewellery?category=Pendants" },
          { label: "Bracelets", to: "/jewellery?category=Bracelets" },
          { label: "Earrings", to: "/jewellery?category=Earrings" },
          { label: "Brooch", to: "/jewellery?category=Brooch" },
          { label: "Discover All", to: "/jewellery" },
        ],
      },
      {
        title: "Collections",
        links: [
          { label: "Botanica", to: "/collections/botanica" },
          { label: "Materia", to: "/collections/materia" },
          { label: "Papillon", to: "/collections/papillon" },
          { label: "Miniature Silverware", to: "/collections/miniature-silverware" },
        ],
      },
    ],
    features: [
      {
        label: "Papillon",
        to: "/collections/papillon",
        image: IMG.papillonBlue,
        alt: "Blue enamel butterfly bracelet",
      },
      {
        label: "Materia",
        to: "/collections/materia",
        image: IMG.sculptRing,
        alt: "Sculptural silver ring",
      },
    ],
  },
  {
    label: "Objects",
    to: "/objects",
    groups: [
      {
        title: "Objects",
        links: [
          {
            label: "Hand-Hammered Sculpt Silver Cups",
            to: "/products/sculpt-hand-hammered-fine-silver-cups",
          },
          { label: "All Objects", to: "/objects" },
          { label: "Bespoke Silver Objects", to: "/bespoke" },
        ],
      },
    ],
    features: [
      {
        label: "Sculpt Cups",
        to: "/products/sculpt-hand-hammered-fine-silver-cups",
        image: IMG.sculptSet,
        alt: "Hand-hammered silver cups",
      },
      {
        label: "Bespoke Commissions",
        to: "/bespoke",
        image: IMG.benchTorch,
        alt: "Silversmith at the bench",
      },
    ],
  },
  { label: "Our Craft", to: "/craft" },
  { label: "About", to: "/about" },
];

const ANNOUNCEMENTS = [
  {
    full: "Complimentary UK delivery on orders over £150",
    short: "Complimentary UK delivery over £150",
  },
  {
    full: "Sculpt — Hand-Hammered Fine Silver Cups, now available",
    short: "Sculpt cups — now available",
  },
  {
    full: "Bespoke commissions open — begin a conversation",
    short: "Bespoke commissions open",
  },
];

const ANNOUNCEMENT_DWELL = 6500;

function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length),
      ANNOUNCEMENT_DWELL,
    );
    return () => window.clearInterval(timer);
  }, []);

  const message = ANNOUNCEMENTS[index];

  return (
    <div
      className="flex h-8 items-center justify-center overflow-hidden border-b border-line bg-stone px-4 text-ink md:h-9"
      role="region"
      aria-label="Announcements"
    >
      <p
        key={index}
        aria-live="polite"
        className="animate-fade-in text-center text-[9px] font-medium tracking-[0.12em] uppercase motion-reduce:animate-none sm:text-[10px] sm:tracking-[0.18em]"
      >
        <span className="sm:hidden">{message.short}</span>
        <span className="hidden sm:inline">{message.full}</span>
      </p>
    </div>
  );
}

function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      aria-label="Argent Lune — home"
      className={cx("font-serif leading-none whitespace-nowrap", className)}
    >
      <span className="text-[17px] font-medium tracking-[0.28em] sm:text-[19px] sm:tracking-[0.34em] md:text-[23px] xl:text-[21px] xl:tracking-[0.3em] 2xl:text-[23px] 2xl:tracking-[0.34em]">
        ARGENT LUNE
      </span>
    </Link>
  );
}

function LocaleMenu({ label, items, light }: { label: string; items: string[]; light: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cx(
          "flex cursor-pointer items-center gap-1 py-2 text-[11px] font-medium tracking-[0.14em] uppercase transition-opacity hover:opacity-60",
        )}
      >
        {label}
        <ChevronDown size={12} />
      </button>
      {open ? (
        <ul
          role="listbox"
          className={cx(
            "absolute right-0 top-full z-50 mt-2 min-w-48 animate-drop border border-line bg-ivory py-2 text-ink shadow-[0_12px_40px_-20px_rgba(40,39,36,0.35)]",
            light && "",
          )}
        >
          {items.map((it, i) => (
            <li key={it}>
              <button
                type="button"
                role="option"
                aria-selected={i === 0}
                onClick={() => setOpen(false)}
                className="flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-[13px] hover:bg-stone"
              >
                {it}
                {i === 0 ? <span className="text-[11px] text-deep">Selected</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function Header({ onSearch }: { onSearch: () => void }) {
  const { path } = useRoute();
  const { count, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [path]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const overHero = path === "/about" && !scrolled && !openMenu;
  const activeItem = NAV.find((n) => n.label === openMenu);

  const enter = (label: string | null) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  const isActive = (to: string) => path === to || (to !== "/" && path.startsWith(to));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40" onMouseLeave={leave}>
        <AnnouncementBar />
        <div
          className={cx(
            "relative border-b transition-[background-color,color,border-color] duration-500",
            overHero
              ? "border-transparent bg-transparent text-ivory"
              : "border-line bg-ivory/95 text-ink backdrop-blur-md",
          )}
        >
        <div className="container-lune grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[76px]">
          {/* Left: nav (desktop) / menu button (mobile) */}
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="-ml-2 cursor-pointer p-2 xl:hidden"
            >
              <MenuIcon size={22} />
            </button>
            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center gap-6 2xl:gap-10">
                {NAV.map((item) => (
                  <li
                    key={item.label}
                    onMouseEnter={() => enter(item.groups ? item.label : null)}
                  >
                    {item.groups ? (
                      <button
                        type="button"
                        aria-expanded={openMenu === item.label}
                        aria-haspopup="true"
                        onClick={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                        className={cx(
                          "flex cursor-pointer items-center gap-1.5 py-7 text-[11px] font-medium tracking-[0.16em] uppercase transition-[color,opacity] hover:opacity-70",
                          !overHero && "hover:text-deep",
                          isActive(item.to) &&
                            cx(
                              "underline decoration-1 underline-offset-[10px]",
                              overHero ? "decoration-ivory" : "decoration-deep",
                            ),
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          size={12}
                          className={cx(
                            "transition-transform duration-300",
                            openMenu === item.label && "rotate-180",
                          )}
                        />
                      </button>
                    ) : (
                      <Link
                        to={item.to}
                        className={cx(
                          "block py-7 text-[11px] font-medium tracking-[0.16em] uppercase transition-[color,opacity] hover:opacity-70",
                          !overHero && "hover:text-deep",
                          isActive(item.to) &&
                            cx(
                              "underline decoration-1 underline-offset-[10px]",
                              overHero ? "decoration-ivory" : "decoration-deep",
                            ),
                        )}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Wordmark />

          {/* Right: utilities */}
          <div className="flex items-center justify-end gap-1 md:gap-3">
            <div className="hidden items-center gap-4 pr-3 xl:flex">
              <LocaleMenu label="GBP £" items={["United Kingdom (GBP £)"]} light={overHero} />
              <LocaleMenu label="EN" items={["English (UK)"]} light={overHero} />
            </div>
            <button
              type="button"
              aria-label="Search"
              onClick={onSearch}
              className="cursor-pointer p-2 transition-opacity hover:opacity-60"
            >
              <SearchIcon />
            </button>
            <Link
              to="/account"
              aria-label="Account"
              className="hidden p-2 transition-opacity hover:opacity-60 sm:block"
            >
              <UserIcon />
            </Link>
            <button
              type="button"
              aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
              onClick={openDrawer}
              className="relative -mr-2 cursor-pointer p-2 transition-opacity hover:opacity-60"
            >
              <BagIcon />
              {count > 0 ? (
                <span
                  className={cx(
                    "absolute right-0 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-medium",
                    overHero ? "bg-ivory text-ink" : "bg-ink text-ivory",
                  )}
                >
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
        </div>

        {/* Mega dropdown */}
        {activeItem?.groups ? (
          <div
            className="absolute inset-x-0 top-full hidden animate-drop border-y border-line bg-ivory text-ink shadow-[0_24px_60px_-40px_rgba(37,40,39,0.45)] xl:block"
            onMouseEnter={() => enter(activeItem.label)}
            onMouseLeave={leave}
          >
            <div className="container-lune grid grid-cols-12 gap-10 py-10">
              {activeItem.groups.map((group) => (
                <div key={group.title} className="col-span-3">
                  <p className="eyebrow mb-5 text-muted">{group.title}</p>
                  <ul className="space-y-2.5">
                    {group.links.map((c) => (
                      <li key={c.to}>
                        <Link
                          to={c.to}
                          onClick={() => setOpenMenu(null)}
                          className="heading block text-[21px] leading-snug transition-colors hover:text-deep"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div
                className={cx(
                  "grid grid-cols-2 gap-6",
                  activeItem.groups.length > 1 ? "col-span-6" : "col-span-9",
                )}
              >
                {activeItem.features?.map((f) => (
                  <Link
                    key={f.label}
                    to={f.to}
                    onClick={() => setOpenMenu(null)}
                    className="group block"
                  >
                    <Img
                      src={f.image}
                      alt={f.alt}
                      className="aspect-[16/10]"
                      imgClassName="img-zoom"
                    />
                    <p className="eyebrow mt-4 transition-colors group-hover:text-deep">
                      {f.label}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </header>

      {/* Mobile drawer */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div
            className="absolute inset-0 animate-fade-in bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm animate-slide-in-left flex-col bg-ivory">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Wordmark />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="-mr-2 cursor-pointer p-2"
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-4">
              <ul>
                {NAV.map((item) => (
                  <li key={item.label} className="border-b border-line">
                    {item.groups ? (
                      <>
                        <button
                          type="button"
                          aria-expanded={mobileSection === item.label}
                          onClick={() =>
                            setMobileSection((s) => (s === item.label ? null : item.label))
                          }
                          className="flex w-full cursor-pointer items-center justify-between py-5 heading text-[26px]"
                        >
                          {item.label}
                          <ChevronDown
                            size={18}
                            className={cx(
                              "transition-transform",
                              mobileSection === item.label && "rotate-180",
                            )}
                          />
                        </button>
                        {mobileSection === item.label ? (
                          <div className="animate-drop pb-5 pl-1">
                            {item.groups.map((group) => (
                              <div key={group.title} className="pt-2">
                                <p className="eyebrow mb-1.5 text-[10px] text-taupe">
                                  {group.title}
                                </p>
                                <ul>
                                  {group.links.map((c) => (
                                    <li key={c.to}>
                                      <Link
                                        to={c.to}
                                        onClick={() => setMobileOpen(false)}
                                        className="block py-2 text-[15px] text-muted transition-colors hover:text-deep"
                                      >
                                        {c.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="block py-5 heading text-[26px]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <ul className="mt-8 space-y-4 text-[14px] text-muted">
                <li>
                  <Link to="/account" className="flex items-center gap-3 hover:text-deep">
                    <UserIcon size={18} /> Account
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-deep">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/care" className="hover:text-deep">
                    Care Guide
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex gap-6 border-t border-line px-5 py-5">
              <LocaleMenu label="GBP £" items={["United Kingdom (GBP £)"]} light={false} />
              <LocaleMenu label="English" items={["English (UK)"]} light={false} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
