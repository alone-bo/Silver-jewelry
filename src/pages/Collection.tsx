import { useEffect, useMemo, useState } from "react";
import {
  collections,
  getCollection,
  jewelleryCollections,
  products,
  type Collection as CollectionT,
  type Product,
  type StockStatus,
} from "../data/catalog";
import { IMG } from "../data/images";
import { ProductCard } from "../components/ProductCard";
import { Button, Eyebrow, Img, Reveal } from "../components/ui";
import { CloseIcon, PlusIcon } from "../components/Icons";
import { Link, useRoute } from "../lib/router";
import { cx } from "../lib/format";

type Sort = "featured" | "newest" | "price-asc" | "price-desc" | "name";
const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Alphabetical" },
];
const AVAILABILITY: { value: string; label: string; match: StockStatus[] }[] = [
  { value: "available", label: "Available", match: ["available", "low"] },
  { value: "coming-soon", label: "Coming Soon", match: ["coming-soon"] },
  { value: "sold-out", label: "Sold Out", match: ["sold-out"] },
  { value: "enquire", label: "Enquire Only", match: ["enquire"] },
];
const PAGE_SIZE = 8;

type TemplateProps = {
  eyebrow: string;
  title: string;
  description: string;
  banner: string;
  bannerAlt: string;
  bannerPosition?: string;
  /** "wide" = 16:9 full-width banner with overlaid copy (Shop); "split" = editorial two-column */
  bannerLayout?: "split" | "wide";
  bannerCta?: string;
  items: Product[];
  showCollectionFilter?: boolean;
  /** Category preselected from the URL, e.g. /jewellery?category=Rings */
  initialCategory?: string;
  related: CollectionT[];
};

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { value: string; label: string; count: number }[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className="border-b border-line py-6">
      <legend className="eyebrow mb-4 float-left w-full">{title}</legend>
      <div className="clear-both space-y-1">
        {options.map((o) => {
          const on = selected.includes(o.value);
          return (
            <label
              key={o.value}
              className={cx(
                "flex cursor-pointer items-center gap-3 py-1.5 text-[14px]",
                o.count === 0 && "opacity-40",
              )}
            >
              <input
                type="checkbox"
                checked={on}
                disabled={o.count === 0 && !on}
                onChange={() => onToggle(o.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cx(
                  "flex h-4 w-4 items-center justify-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2",
                  on ? "border-deep bg-deep" : "border-taupe bg-white",
                )}
              >
                {on ? <span className="h-1.5 w-1.5 bg-ivory" /> : null}
              </span>
              <span className="flex-1">{o.label}</span>
              <span className="text-[12px] text-muted">{o.count}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function CollectionTemplate({
  eyebrow,
  title,
  description,
  banner,
  bannerAlt,
  bannerPosition,
  bannerLayout = "split",
  bannerCta,
  items,
  showCollectionFilter,
  initialCategory,
  related,
}: TemplateProps) {
  const [sort, setSort] = useState<Sort>("featured");
  const [cats, setCats] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [avail, setAvail] = useState<string[]>([]);
  const [cols, setCols] = useState<string[]>([]);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset when navigating between collections or category shortcuts
  useEffect(() => {
    setSort("featured");
    setCats(initialCategory ? [initialCategory] : []);
    setAvail([]);
    setCols([]);
    setVisible(PAGE_SIZE);
  }, [title, initialCategory]);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
  }, [filtersOpen]);

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) => {
    setVisible(PAGE_SIZE);
    set((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  };

  const filtered = useMemo(() => {
    let list = items.filter(
      (p) =>
        (cats.length === 0 || cats.includes(p.category)) &&
        (cols.length === 0 || cols.includes(p.collection)) &&
        (avail.length === 0 ||
          AVAILABILITY.filter((a) => avail.includes(a.value)).some((a) =>
            a.match.includes(p.stock),
          )),
    );
    const price = (p: Product) => p.price ?? Number.POSITIVE_INFINITY;
    list = [...list];
    switch (sort) {
      case "newest":
        list.sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew) || a.order - b.order);
        break;
      case "price-asc":
        list.sort((a, b) => price(a) - price(b) || a.order - b.order);
        break;
      case "price-desc":
        list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1) || a.order - b.order);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => a.order - b.order);
    }
    return list;
  }, [items, cats, avail, cols, sort]);

  const countBy = (pred: (p: Product) => boolean) => items.filter(pred).length;
  const categoryOptions = [...new Set(items.map((p) => p.category))].map((c) => ({
    value: c,
    label: c,
    count: countBy((p) => p.category === c),
  }));
  const availabilityOptions = AVAILABILITY.map((a) => ({
    ...a,
    count: countBy((p) => a.match.includes(p.stock)),
  })).filter((a) => a.count > 0);
  const collectionOptions = [...new Set(items.map((p) => p.collection))].map((c) => ({
    value: c,
    label: getCollection(c)?.title ?? c,
    count: countBy((p) => p.collection === c),
  }));

  const activeChips = [
    ...cats.map((v) => ({ v, label: v, clear: () => toggle(setCats)(v) })),
    ...cols.map((v) => ({
      v,
      label: getCollection(v)?.title ?? v,
      clear: () => toggle(setCols)(v),
    })),
    ...avail.map((v) => ({
      v,
      label: AVAILABILITY.find((a) => a.value === v)!.label,
      clear: () => toggle(setAvail)(v),
    })),
  ];
  const clearAll = () => {
    setCats([]);
    setAvail([]);
    setCols([]);
  };

  /** A category shortcut (e.g. Brooch) whose pieces have not launched yet */
  const waitingCategory =
    cats.length === 1 && !categoryOptions.some((c) => c.value === cats[0]) ? cats[0] : null;

  const loadMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 600));
    setVisible((v) => v + PAGE_SIZE);
    setLoadingMore(false);
  };

  const shown = filtered.slice(0, visible);

  return (
    <>
      {/* Editorial banner */}
      {bannerLayout === "wide" ? (
        <section className="relative overflow-hidden bg-ink text-ivory">
          <Img
            src={banner}
            alt={bannerAlt}
            eager
            position={bannerPosition}
            className="aspect-[4/5] w-full bg-ink sm:aspect-[4/3] md:aspect-video"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/10 md:bg-gradient-to-r md:from-ink/80 md:via-ink/45 md:to-ink/5" />
          <div className="absolute inset-0">
            <div className="container-lune flex h-full flex-col justify-end pb-10 md:justify-center md:pb-0">
              <nav aria-label="Breadcrumb" className="mb-8 text-[12px] text-ivory/70 md:mb-10">
                <Link to="/" className="hover:text-ivory">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <span>{eyebrow}</span>
              </nav>
              <Eyebrow className="mb-5 text-ivory/75">{eyebrow}</Eyebrow>
              <h1 className="display text-6xl md:text-8xl xl:text-[112px]">{title}</h1>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ivory/85 md:mt-8 md:text-[17px]">
                {description}
              </p>
              {bannerCta ? (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("collection-grid")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="btn btn-light mt-8 self-start md:mt-10"
                >
                  {bannerCta}
                </button>
              ) : null}
            </div>
          </div>
        </section>
      ) : (
        <section className="grid border-b border-line lg:grid-cols-12">
          <div className="flex flex-col justify-end px-5 pb-12 pt-14 md:px-10 md:pb-16 md:pt-20 lg:col-span-5 xl:px-16">
            <nav aria-label="Breadcrumb" className="mb-10 text-[12px] text-muted">
              <Link to="/" className="hover:text-deep">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span>{eyebrow}</span>
            </nav>
            <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
            <h1 className="display text-6xl md:text-8xl">{title}</h1>
            <p className="body-copy mt-8 max-w-md text-[17px]">{description}</p>
          </div>
          <Img
            src={banner}
            alt={bannerAlt}
            eager
            position={bannerPosition}
            className="aspect-[4/3] md:aspect-[16/9] lg:col-span-7 lg:aspect-auto lg:min-h-[560px]"
          />
        </section>
      )}

      {/* Toolbar */}
      <div className="sticky top-24 z-30 border-b border-line bg-ivory/95 backdrop-blur-md md:top-28">
        <div className="container-lune flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex cursor-pointer items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase hover:opacity-60"
            >
              <PlusIcon size={14} /> Filter
              {activeChips.length ? (
                <span className="text-muted">({activeChips.length})</span>
              ) : null}
            </button>
            <div className="hidden items-center gap-2 lg:flex">
              {categoryOptions.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  aria-pressed={cats.includes(c.value)}
                  onClick={() => toggle(setCats)(c.value)}
                  className={cx(
                    "cursor-pointer border px-3.5 py-1.5 text-[12px] transition-colors",
                    cats.includes(c.value)
                      ? "border-deep bg-deep text-ivory"
                      : "border-line hover:border-deep hover:text-deep",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-[12px] text-muted sm:inline" aria-live="polite">
              {filtered.length} piece{filtered.length === 1 ? "" : "s"}
            </span>
            <label className="flex items-center gap-2 text-[12px]">
              <span className="sr-only sm:not-sr-only text-muted">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="cursor-pointer appearance-none bg-transparent pr-1 text-[11px] font-medium tracking-[0.14em] uppercase focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <section id="collection-grid" className="container-lune scroll-mt-44 py-10 md:scroll-mt-52 md:py-14">
        {activeChips.length ? (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {activeChips.map((c) => (
              <button
                key={c.v}
                type="button"
                onClick={c.clear}
                className="flex cursor-pointer items-center gap-2 bg-stone px-3 py-1.5 text-[12px] hover:bg-line"
              >
                {c.label} <CloseIcon size={12} />
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="ml-2 cursor-pointer text-[12px] text-muted underline underline-offset-4 hover:text-deep"
            >
              Clear all
            </button>
          </div>
        ) : null}

        {shown.length ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 md:gap-y-16 xl:grid-cols-4">
            {shown.map((p, i) => (
              <div key={p.handle}>
                <ProductCard product={p} priority={i < 4} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="heading text-3xl">
              {waitingCategory ? `${waitingCategory} — new pieces are in preparation` : "No pieces match these filters"}
            </p>
            <p className="body-copy mx-auto mt-4 max-w-md">
              {waitingCategory
                ? "This category is not yet in the collection. Explore the full range of silver jewellery in the meantime."
                : "Try removing a filter or browse the complete collection."}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
              <button type="button" onClick={clearAll} className="link-line">
                Clear filters
              </button>
              <Link to="/jewellery" className="link-line">
                All Jewellery
              </Link>
            </div>
          </div>
        )}

        {filtered.length > visible ? (
          <div className="mt-16 flex flex-col items-center gap-4">
            <p className="text-[12px] text-muted">
              Showing {shown.length} of {filtered.length}
            </p>
            <div className="h-px w-40 bg-line">
              <div
                className="h-px bg-ink transition-all"
                style={{ width: `${(shown.length / filtered.length) * 100}%` }}
              />
            </div>
            <Button variant="secondary" onClick={loadMore} loading={loadingMore} className="mt-2">
              Load More
            </Button>
          </div>
        ) : shown.length ? (
          <p className="mt-16 text-center text-[12px] text-muted">
            Showing all {filtered.length} piece{filtered.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </section>

      {/* Related collections */}
      {related.length ? (
        <section className="border-t border-line bg-stone py-20 md:py-28">
          <div className="container-lune">
            <div className="mb-12 flex items-end justify-between">
              <h2 className="display text-4xl md:text-5xl">Related Collections</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
              {related.map((c, i) => (
                <Reveal key={c.handle} delay={i * 80}>
                  <Link
                    to={c.handle === "objects" ? "/objects" : `/collections/${c.handle}`}
                    className="group block"
                  >
                    <Img
                      src={c.card}
                      alt={c.bannerAlt}
                      className="aspect-[3/4]"
                      imgClassName="img-zoom"
                    />
                    <p className="heading mt-4 text-2xl group-hover:text-deep">{c.title}</p>
                    <p className="mt-1 line-clamp-2 text-[13px] text-muted">{c.description}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Filter drawer */}
      {filtersOpen ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 animate-fade-in bg-ink/40"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-full max-w-md animate-slide-in-left flex-col bg-ivory">
            <div className="flex h-16 items-center justify-between border-b border-line px-6 md:h-[76px]">
              <h2 className="heading text-2xl">Filter</h2>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="-mr-2 cursor-pointer p-2"
              >
                <CloseIcon size={22} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6">
              <FilterGroup
                title="Category"
                options={categoryOptions}
                selected={cats}
                onToggle={toggle(setCats)}
              />
              {showCollectionFilter ? (
                <FilterGroup
                  title="Collection"
                  options={collectionOptions}
                  selected={cols}
                  onToggle={toggle(setCols)}
                />
              ) : null}
              <FilterGroup
                title="Availability"
                options={availabilityOptions}
                selected={avail}
                onToggle={toggle(setAvail)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 border-t border-line p-6">
              <Button variant="secondary" onClick={clearAll} disabled={!activeChips.length}>
                Clear
              </Button>
              <Button onClick={() => setFiltersOpen(false)}>Show {filtered.length}</Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function CollectionPage({ handle }: { handle: string }) {
  const c = getCollection(handle);
  if (!c || c.kind !== "jewellery") return null;
  return (
    <CollectionTemplate
      eyebrow="Jewellery"
      title={c.title}
      description={c.description}
      banner={c.banner}
      bannerAlt={c.bannerAlt}
      bannerPosition={
        c.handle === "materia" ? "center 60%" : c.handle === "papillon" ? "center 40%" : undefined
      }
      items={products.filter((p) => p.collection === c.handle)}
      related={collections.filter((x) => x.handle !== c.handle).slice(0, 4)}
    />
  );
}

export function AllJewellery() {
  const { query } = useRoute();
  const category = query.get("category") ?? undefined;
  return (
    <CollectionTemplate
      eyebrow="Jewellery"
      title="All Jewellery"
      description="Rings, necklaces, earrings and bracelets in silver — each shaped and finished by hand, each carrying its own quiet character."
      banner={IMG.heroRings}
      bannerAlt="Sculptural silver rings worn on the hand"
      bannerPosition="center 62%"
      items={products.filter((p) => p.kind === "jewellery")}
      showCollectionFilter
      initialCategory={category}
      related={jewelleryCollections}
    />
  );
}

export function ShopAll() {
  return (
    <CollectionTemplate
      eyebrow="Shop"
      title="Shop All"
      description="The complete Argent Lune collection — silver jewellery and objects shaped by texture, form and the enduring beauty of craft."
      banner={IMG.pendantsOnWood}
      bannerAlt="Handcrafted silver pendants laid out on weathered wood"
      bannerPosition="center 40%"
      bannerLayout="wide"
      bannerCta="Explore the Collection"
      items={products}
      showCollectionFilter
      related={collections.filter((c) => c.handle !== "miniature-silverware")}
    />
  );
}
