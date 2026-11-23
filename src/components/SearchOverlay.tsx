import { useEffect, useMemo, useRef, useState } from "react";
import { products, productHref, collections, stockLabel } from "../data/catalog";
import { Link } from "../lib/router";
import { formatPrice } from "../lib/format";
import { CloseIcon, SearchIcon } from "./Icons";
import { Img } from "./ui";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) =>
      [p.name, p.collection.replace("-", " "), p.category, p.summary]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [q]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} />
      <div className="relative max-h-[90vh] animate-drop overflow-y-auto bg-ivory">
        <div className="container-lune py-6 md:py-10">
          <div className="flex items-center gap-4 border-b border-ink pb-4">
            <SearchIcon size={22} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search jewellery, objects, collections"
              aria-label="Search the store"
              className="w-full bg-transparent font-serif text-2xl placeholder:text-taupe focus:outline-none md:text-4xl"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="cursor-pointer p-2 hover:opacity-60"
            >
              <CloseIcon size={22} />
            </button>
          </div>

          {!q.trim() ? (
            <div className="grid gap-10 py-10 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="eyebrow mb-5 text-muted">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Papillon", "Rings", "Heat-coloured", "Pendant", "Cups", "Botanica"].map(
                    (t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setQ(t === "Heat-coloured" ? "heat" : t)}
                        className="cursor-pointer border border-line px-4 py-2 text-[13px] transition-colors hover:border-ink"
                      >
                        {t}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div>
                <p className="eyebrow mb-5 text-muted">Collections</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  {collections.map((c) => (
                    <Link
                      key={c.handle}
                      to={c.handle === "objects" ? "/objects" : `/collections/${c.handle}`}
                      onClick={onClose}
                      className="group"
                    >
                      <Img
                        src={c.card}
                        alt={c.bannerAlt}
                        className="aspect-[4/5]"
                        imgClassName="img-zoom"
                      />
                      <p className="mt-3 text-[13px]">{c.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <p className="eyebrow mb-6 text-muted" aria-live="polite">
                {results.length} result{results.length === 1 ? "" : "s"} for “{q.trim()}”
              </p>
              {results.length ? (
                <ul className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
                  {results.map((p) => (
                    <li key={p.handle}>
                      <Link to={productHref(p)} onClick={onClose} className="group flex gap-4">
                        <Img
                          src={p.images[0].src}
                          alt={p.images[0].alt}
                          className="aspect-[4/5] w-20 shrink-0"
                        />
                        <div>
                          <p className="heading text-lg leading-snug group-hover:text-deep">
                            {p.name}
                          </p>
                          <p className="mt-1 text-[13px] text-muted">
                            {p.stock === "enquire" ? "Enquire Only" : formatPrice(p.price)} ·{" "}
                            {stockLabel(p)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="body-copy">
                  No pieces match your search. Try “ring”, “Papillon” or “cups”.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
