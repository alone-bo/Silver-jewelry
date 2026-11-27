import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  getCollection,
  getVariant,
  isPurchasable,
  products,
  skuFor,
  stockFor,
  stockLabel,
  TBC,
  type Product,
  type ProductOption,
} from "../data/catalog";
import { IMG } from "../data/images";
import { useCart } from "../store/cart";
import { Link, useRoute } from "../lib/router";
import { cx, formatPrice } from "../lib/format";
import { ProductCard } from "../components/ProductCard";
import { CustomerReviews } from "../components/ProductExtras";
import { RingSizeFit, type RingFit } from "../components/RingSizeFit";
import {
  Accordion,
  Button,
  ButtonLink,
  Eyebrow,
  Img,
  Placeholder,
  QuantitySelector,
  Reveal,
  StockBadge,
  TextLink,
  isEmail,
} from "../components/ui";
import {
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  FlameIcon,
  InfoIcon,
} from "../components/Icons";

/* ---------- Gallery ---------- */
function Gallery({
  product,
  active,
  setActive,
}: {
  product: Product;
  active: number;
  setActive: (i: number) => void;
}) {
  const imgs = product.images;
  const scroller = useRef<HTMLDivElement>(null);

  // Keep mobile carousel in sync when a variant changes the image
  useEffect(() => {
    const el = scroller.current;
    if (el && el.clientWidth) el.scrollTo({ left: active * el.clientWidth, behavior: "smooth" });
  }, [active]);

  const go = (d: number) => setActive((active + d + imgs.length) % imgs.length);

  return (
    <div className="lg:grid lg:grid-cols-[88px_1fr] lg:gap-5">
      {/* Thumbnails (desktop) */}
      <div className="hidden flex-col gap-3 lg:flex" role="tablist" aria-label="Product images">
        {imgs.map((im, i) => (
          <button
            key={im.src + i}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={`View image ${i + 1}`}
            onClick={() => setActive(i)}
            className={cx(
              "cursor-pointer border transition-opacity",
              active === i
                ? "border-ink opacity-100"
                : "border-transparent opacity-60 hover:opacity-100",
            )}
          >
            <Img src={im.src} alt="" className="aspect-[4/5]" />
          </button>
        ))}
      </div>

      {/* Main (desktop) */}
      <div className="group relative hidden lg:block">
        <Img
          key={imgs[active].src}
          src={imgs[active].src}
          alt={imgs[active].alt}
          eager
          className="aspect-[4/5] animate-fade-in"
        />
        {imgs.length > 1 ? (
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="cursor-pointer bg-ivory/90 p-3 hover:bg-ivory"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="bg-ivory/90 px-3 py-1.5 text-[11px] tabular-nums tracking-widest">
              {active + 1} / {imgs.length}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="cursor-pointer bg-ivory/90 p-3 hover:bg-ivory"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        ) : null}
      </div>

      {/* Mobile / tablet swipe carousel */}
      <div className="lg:hidden">
        <div
          ref={scroller}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / el.clientWidth);
            if (i !== active) setActive(i);
          }}
        >
          {imgs.map((im, i) => (
            <Img
              key={im.src + i}
              src={im.src}
              alt={im.alt}
              eager={i === 0}
              className="aspect-[4/5] w-full shrink-0 snap-center"
            />
          ))}
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {imgs.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={cx(
                "h-px cursor-pointer transition-all",
                active === i ? "w-10 bg-ink" : "w-5 bg-taupe",
              )}
              style={{ height: 2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Variant selector ---------- */
function OptionSelector({
  option,
  value,
  onChange,
  showError,
}: {
  option: ProductOption;
  value: string | undefined;
  onChange: (v: string) => void;
  showError: boolean;
}) {
  return (
    <fieldset className="py-5">
      <div className="mb-3 flex items-baseline justify-between">
        <legend className="text-[13px]">
          <span className="eyebrow">{option.name}</span>
          <span className="ml-3 text-muted">
            {value ? value : option.required ? "Please select" : ""}
          </span>
        </legend>
      </div>
      <div className="flex flex-wrap gap-2">
          {option.values.map((v) => {
            const selected = value === v.value;
            const label = v.value;
                if (option.kind === "swatch") {
                  return (
                    <button
                      key={v.value}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`${v.value}${v.unavailable ? " — unavailable" : ""}`}
                      disabled={v.unavailable}
                      onClick={() => onChange(v.value)}
                      className={cx(
                        "group relative flex min-h-11 cursor-pointer items-center gap-2.5 border py-2 pl-2 pr-4 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                        selected ? "border-ink bg-white" : "border-line hover:border-taupe",
                      )}
                    >
                      <span
                        className="h-6 w-6 rounded-full ring-1 ring-black/10"
                        style={{ background: v.swatch }}
                      />
                      <span className={cx(v.unavailable && "line-through")}>{v.value}</span>
                    </button>
                  );
                }
                return (
                  <button
                    key={v.value}
                    type="button"
                    aria-pressed={selected}
                    disabled={v.unavailable}
                    onClick={() => onChange(v.value)}
                    className={cx(
                      "flex min-h-11 cursor-pointer items-center justify-center gap-2 border px-5 text-[13px] transition-colors disabled:cursor-not-allowed disabled:text-taupe disabled:line-through",
                      selected
                        ? "border-ink bg-ink text-ivory"
                        : "border-line bg-white hover:border-ink",
                    )}
                  >
                    {v.heatColoured ? <FlameIcon size={14} /> : null}
                    {label}
                  </button>
                );
              })}
      </div>
      {showError && !value ? (
        <p className="mt-3 text-[13px] text-alert" role="alert">
          Please select a {option.name.toLowerCase()}.
        </p>
      ) : null}
    </fieldset>
  );
}

function NotifyMe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [err, setErr] = useState("");
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setErr("Please enter a valid email address.");
    setErr("");
    setState("loading");
    await new Promise((r) => setTimeout(r, 800));
    setState("done");
  };
  if (state === "done")
    return (
      <p
        className="flex items-center gap-2 border border-line bg-white px-4 py-4 text-[14px]"
        role="status"
      >
        <CheckIcon size={16} /> We’ll let you know when this piece becomes available.
      </p>
    );
  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="notify-email" className="field-label">
        Notify me when available
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        <input
          id="notify-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!err}
          placeholder="Email address"
          className="field-input sm:border-r-0"
        />
        <Button type="submit" loading={state === "loading"} className="shrink-0">
          Notify Me
        </Button>
      </div>
      {err ? <p className="mt-2 text-[13px] text-alert">{err}</p> : null}
    </form>
  );
}

/* ---------- Spec rows ---------- */
function Spec({ label, value }: { label: string; value: string }) {
  const parts = value.split(TBC);
  return (
    <div className="grid grid-cols-[minmax(120px,40%)_1fr] gap-4 border-b border-line py-3.5 text-[14px]">
      <dt className="text-muted">{label}</dt>
      <dd>
        {parts.map((p, i) => (
          <span key={i}>
            {p}
            {i < parts.length - 1 ? <Placeholder>To be confirmed</Placeholder> : null}
          </span>
        ))}
      </dd>
    </div>
  );
}

/* ---------- Product page ---------- */
export function ProductPage({ product }: { product: Product }) {
  const { add } = useCart();
  const { query } = useRoute();
  const isObject = product.kind === "object";
  const initial = () =>
    Object.fromEntries(
      product.options
        .filter((o) => !o.required)
        .map((o) => [o.name, o.values.find((v) => !v.unavailable)?.value ?? ""])
        .filter(([, v]) => v),
    ) as Record<string, string>;

  /** A card can link here with the style it represents, e.g. ?v=heat-coloured */
  const variantId = query.get("v");
  const variant = getVariant(product, variantId);

  const [selected, setSelected] = useState<Record<string, string>>(
    () => variant?.options ?? initial(),
  );
  const [active, setActive] = useState(variant?.image ?? 0);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "added">("idle");
  const [attempted, setAttempted] = useState(false);
  const [ringFit, setRingFit] = useState<RingFit>(variant?.fit ?? "");
  const [relatedTab, setRelatedTab] = useState<"like" | "recent">("like");
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  // Preselect the style the shopper arrived from — option, image and SKU together.
  useEffect(() => {
    const v = getVariant(product, variantId);
    setSelected(v?.options ?? initial());
    setActive(v?.image ?? 0);
    setRingFit(v?.fit ?? "");
    setQty(1);
    setState("idle");
    setAttempted(false);
    setRelatedTab("like");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.handle, variantId]);

  useEffect(() => {
    const key = "argent-lune-recently-viewed";
    let stored: string[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(parsed)) stored = parsed.filter((h): h is string => typeof h === "string");
    } catch {
      stored = [];
    }
    const others = [...new Set(stored.filter((h) => h !== product.handle))];
    try {
      localStorage.setItem(key, JSON.stringify([product.handle, ...others].slice(0, 8)));
    } catch {
      /* storage unavailable */
    }
    setRecentProducts(
      others
        .map((h) => products.find((p) => p.handle === h))
        .filter((p): p is Product => Boolean(p))
        .slice(0, 4),
    );
  }, [product.handle]);

  const heatSelected = useMemo(
    () =>
      product.options.some((o) =>
        o.values.some((v) => v.heatColoured && selected[o.name] === v.value),
      ),
    [product, selected],
  );
  const sizeOption = !isObject ? product.sizeGuide : undefined;
  const hasMensFit = Boolean(sizeOption?.mens);
  const missingOptions = product.options.filter((o) => !selected[o.name]);
  const missingSize = Boolean(sizeOption) && !ringFit;
  const { stock, stockCount } = stockFor(product, selected, ringFit);
  const purchasable = isPurchasable({ stock });
  const maxQty = stock === "low" ? (stockCount ?? 1) : 10;
  const collection = getCollection(product.collection);
  const sku = skuFor(product, selected, ringFit);

  const choose = (o: ProductOption, v: string) => {
    setSelected((s) => ({ ...s, [o.name]: v }));
    const val = o.values.find((x) => x.value === v);
    if (val?.image !== undefined && product.images[val.image]) setActive(val.image);
  };

  const onAdd = async () => {
    setAttempted(true);
    if (missingOptions.length || missingSize) return;
    setState("loading");
    const cartOptions =
      sizeOption && ringFit
        ? {
            ...selected,
            Size: ringFit === "women" ? "Standard Size for Women" : "Standard Size for Men",
          }
        : selected;
    await add({ ...product, stock, stockCount }, cartOptions, qty, heatSelected);
    setState("added");
    setTimeout(() => setState("idle"), 2200);
  };

  const related = products
    .filter((p) => p.handle !== product.handle && p.stock !== "enquire")
    .sort(
      (a, b) =>
        Number(b.collection === product.collection) - Number(a.collection === product.collection) ||
        a.order - b.order,
    )
    .slice(0, 4);

  const buttonLabel =
    state === "loading"
      ? "Adding to Bag"
      : state === "added"
        ? "Added to Bag"
        : missingOptions.length && attempted
          ? `Select ${missingOptions[0].name}`
          : "Add to Bag";

  return (
    <>
      <div className="container-lune pt-6 md:pt-8">
        <nav aria-label="Breadcrumb" className="text-[12px] text-muted">
          <Link to="/" className="hover:text-deep">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={isObject ? "/objects" : "/jewellery"} className="hover:text-deep">
            {isObject ? "Objects" : "Jewellery"}
          </Link>
          {!isObject && collection ? (
            <>
              <span className="mx-2">/</span>
              <Link to={`/collections/${collection.handle}`} className="hover:text-deep">
                {collection.title}
              </Link>
            </>
          ) : null}
          <span className="mx-2">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>
      </div>

      <section className="container-lune grid gap-10 pb-20 pt-6 md:pt-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <div className="-mx-5 md:mx-0 lg:col-span-7">
          <Gallery product={product} active={active} setActive={setActive} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[108px]">
            <Eyebrow>
              {product.category} · SKU: {sku}
            </Eyebrow>
            <h1 className="heading mt-4 text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
            {variant?.label ? (
              <p className="mt-2 flex items-center gap-2 text-[13px] text-muted">
                {variant.swatch ? (
                  <span
                    aria-hidden
                    className="h-3 w-3 rounded-full ring-1 ring-black/10"
                    style={{ background: variant.swatch }}
                  />
                ) : null}
                {variant.label}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[18px] tabular-nums">{formatPrice(product.price)}</p>
                {product.price === null ? (
                  <p className="mt-0.5 text-[12px] text-muted">
                    Price to be confirmed · GBP, incl. VAT
                  </p>
                ) : null}
              </div>
              <StockBadge
                status={stock}
                label={stockLabel({ stock, stockCount })}
                className="text-[13px]"
              />
            </div>
            <p className="body-copy mt-6">{product.summary}</p>

            {/* Style options — colourways and forms that carry their own SKU */}
            {product.options.length ? (
              <div className="mt-4 divide-y divide-line border-y border-line">
                {product.options.map((o) => (
                  <OptionSelector
                    key={o.name}
                    option={o}
                    value={selected[o.name]}
                    onChange={(v) => choose(o, v)}
                    showError={attempted}
                  />
                ))}
              </div>
            ) : null}

            {/* Ring size & fit */}
            {sizeOption ? (
              <RingSizeFit
                productName={product.name}
                sku={sku}
                hasMens={hasMensFit}
                value={ringFit}
                onChange={setRingFit}
              />
            ) : null}

            {/* Materials, weight and size — per the product's specification */}
            {!isObject ? (
              <dl className="mt-6">
                <Spec label="Materials" value={product.material} />
                <Spec label="Total weight" value={product.weight} />
                {product.sizeFit && !sizeOption ? (
                  <Spec label="Size & fit" value={product.sizeFit} />
                ) : null}
              </dl>
            ) : null}

            {/* Object specs — always visible for objects */}
            {isObject && product.objectSpecs ? (
              <dl className="mt-6">
                <Spec label="Dimensions" value={product.objectSpecs.dimensions} />
                <Spec label="Capacity" value={product.objectSpecs.capacity} />
                <Spec label="Weight" value={product.objectSpecs.weight} />
                <Spec label="Material" value={product.objectSpecs.material} />
                <Spec label="UK Hallmarking" value={product.objectSpecs.hallmarking} />
                <Spec label="Production & dispatch" value={product.objectSpecs.dispatch} />
              </dl>
            ) : null}

            {/* Purchase area */}
            <div className="mt-6 space-y-4">
              {isObject && stock === "low" ? (
                <p className="flex items-center gap-2 text-[13px] text-deep">
                  <InfoIcon size={16} /> Only {stockCount ?? 1} left — handmade in small numbers.
                </p>
              ) : null}

              {isObject && product.salesMethod ? (
                <div className="rounded-xl border border-line bg-white px-5 py-4">
                  {product.soldAsPair ? (
                    <p className="eyebrow text-[10px] text-deep">Set of Two</p>
                  ) : null}
                  <p className="mt-1 text-[13px] leading-relaxed text-ink">
                    {product.salesMethod}
                  </p>
                </div>
              ) : null}

              {product.purchaseNote ? (
                <div className="rounded-xl border border-line bg-white px-5 py-4">
                  <p className="eyebrow text-[10px] text-deep">{product.purchaseNote.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink">
                    {product.purchaseNote.body}
                  </p>
                </div>
              ) : null}

              {/* Colour Finish Notice: visible, directly above Add to Cart, only when heat-coloured is selected */}
              {heatSelected && purchasable ? (
                <div
                  role="note"
                  aria-live="polite"
                  className="animate-drop border border-taupe bg-stone px-5 py-4"
                >
                  <p className="flex items-center gap-2 eyebrow">
                    <FlameIcon size={16} /> Colour Finish Notice
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">
                    This piece features a heat-coloured finish that may fade or change with time and
                    wear. Please review the{" "}
                    <Link to="/care" className="text-ink underline underline-offset-4">
                      Colour &amp; Care information
                    </Link>{" "}
                    before purchasing.
                  </p>
                </div>
              ) : null}

              {purchasable ? (
                <div className={cx("flex flex-col gap-3", !sizeOption && "sm:flex-row")}>
                  <QuantitySelector value={qty} onChange={setQty} max={maxQty} />
                  <Button
                    onClick={onAdd}
                    loading={state === "loading"}
                    disabled={missingSize}
                    className={cx(sizeOption ? "w-full" : "flex-1", state === "added" && "!bg-deep")}
                  >
                    {state === "added" ? (
                      <CheckIcon size={16} className="-ml-2 mr-1 inline" />
                    ) : null}
                    {buttonLabel}
                  </Button>
                </div>
              ) : stock === "sold-out" ? (
                <>
                  <Button full disabled>
                    Sold Out
                  </Button>
                  <NotifyMe />
                </>
              ) : stock === "coming-soon" ? (
                <>
                  <Button full disabled>
                    Coming Soon
                  </Button>
                  <NotifyMe />
                </>
              ) : (
                <ButtonLink to="/bespoke" className="w-full">
                  Enquire About a Commission
                </ButtonLink>
              )}
              {missingSize ? (
                <p className="text-[12px] text-muted">Select a size above to continue.</p>
              ) : null}

              <p className="flex items-start gap-2 text-[12px] leading-relaxed text-muted">
                <InfoIcon size={15} className="mt-0.5 shrink-0" />
                Handmade piece — subtle variations in form, texture and finish are part of its
                character.
              </p>
            </div>

            {sizeOption ? (
              <div className="mt-6 rounded-xl bg-stone px-5 py-4">
                <p className="text-[13px] font-medium">Sizing Note</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  Please adjust gently and avoid repeated bending to preserve the ring’s original
                  shape.
                </p>
              </div>
            ) : null}

            {/* Details accordions */}
            <div className="mt-8 border-t border-line">
              <Accordion title="Design Story" defaultOpen>
                {product.description.map((d) => (
                  <p key={d} className="mb-3 last:mb-0">
                    {d}
                  </p>
                ))}
              </Accordion>
              <Accordion title="Craftsmanship">
                <p>{product.craftsmanship}</p>
              </Accordion>
              <Accordion title="Care">
                <div className="space-y-4">
                  <p>{product.care}</p>
                </div>
                <TextLink to="/care" className="mt-4 text-ink">
                  Care Guide
                </TextLink>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <p>
                  Delivery options, charges and timings are shown at checkout and set out in our{" "}
                  <Link to="/shipping" className="text-ink underline underline-offset-4">
                    Shipping &amp; Delivery policy
                  </Link>
                  . Returns are governed by our{" "}
                  <Link to="/returns" className="text-ink underline underline-offset-4">
                    Returns &amp; Refunds policy
                  </Link>
                  .
                </p>
              </Accordion>
              <div className="py-5">
                <Link to="/faq" className="text-ink underline underline-offset-4">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      {product.stock !== "enquire" ? <CustomerReviews product={product} /> : null}

      {/* Editorial band */}
      {isObject ? (
        <section className="bg-ink text-ivory">
          <div className="grid lg:grid-cols-2">
            <Img
              src={product.images[1]?.src ?? IMG.hammer}
              alt={product.images[1]?.alt ?? ""}
              className="aspect-[4/5] bg-ink lg:aspect-auto lg:min-h-[720px]"
            />
            <div className="flex flex-col justify-center px-6 py-20 md:px-16 xl:px-24">
              <Eyebrow className="mb-6 text-ivory/60">The Making</Eyebrow>
              <h2 className="display text-5xl md:text-6xl">Shaped by countless hammer strikes.</h2>
              <p className="mt-8 max-w-md text-[16px] leading-relaxed text-ivory/75">
                Each object is shaped by hand through patient, repeated hammer strikes using
                traditional techniques. The marks left behind are not flaws to be polished away, but
                the record of its making.
              </p>
              <div className="mt-10">
                <ButtonLink to="/craft" variant="outline-light">
                  Discover Our Craft
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Hallmarking — directly beneath The Making */}
      {isObject && product.objectSpecs ? (
        <section aria-labelledby="hallmarking-heading" className="border-y border-line bg-stone">
          <div className="container-lune grid gap-8 py-16 md:py-24 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-5">
              <Eyebrow className="mb-5">Hallmarking</Eyebrow>
              <h2 id="hallmarking-heading" className="display text-4xl md:text-5xl">
                UK Hallmarking for our objects
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="body-copy">
                Each silver cup will be submitted to a UK Assay Office for independent testing and
                hallmarking before dispatch to the customer.
              </p>
              <p className="body-copy mt-4">
                In the UK, qualifying precious metal objects are required by law to carry a
                recognised hallmark. A hallmark provides independent verification of the metal’s
                fineness.
              </p>
              <TextLink to="/hallmarking" className="mt-6">
                Learn more about UK Hallmarking for Objects
              </TextLink>
            </div>
          </div>
        </section>
      ) : null}

      {/* Related creations */}
      <section className="container-lune py-16 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <h2 className="display text-4xl md:text-5xl">Related Creations</h2>
          <div className="flex flex-wrap items-center gap-6" role="tablist" aria-label="Related creations">
            <button
              type="button"
              role="tab"
              aria-selected={relatedTab === "like"}
              onClick={() => setRelatedTab("like")}
              className={cx(
                "cursor-pointer border-b pb-1.5 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors",
                relatedTab === "like"
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-deep",
              )}
            >
              You may also like
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={relatedTab === "recent"}
              onClick={() => setRelatedTab("recent")}
              className={cx(
                "cursor-pointer border-b pb-1.5 text-[11px] font-medium tracking-[0.16em] uppercase transition-colors",
                relatedTab === "recent"
                  ? "border-ink text-ink"
                  : "border-transparent text-muted hover:text-deep",
              )}
            >
              Recently viewed
            </button>
          </div>
        </div>

        {relatedTab === "like" ? (
          <div
            role="tabpanel"
            className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4"
          >
            {related.map((p, i) => (
              <Reveal key={p.handle} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : recentProducts.length ? (
          <div
            role="tabpanel"
            className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4"
          >
            {recentProducts.map((p, i) => (
              <Reveal key={p.handle} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div role="tabpanel" className="border-y border-line py-12 text-center">
            <p className="heading text-2xl">Nothing viewed yet</p>
            <p className="body-copy mt-3">Pieces you open will appear here.</p>
            <TextLink to="/jewellery" className="mt-6">
              Explore Jewellery
            </TextLink>
          </div>
        )}
      </section>
    </>
  );
}
