import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  getCollection,
  isPurchasable,
  products,
  stockLabel,
  TBC,
  type Product,
  type ProductOption,
} from "../data/catalog";
import { IMG } from "../data/images";
import { useCart } from "../store/cart";
import { Link } from "../lib/router";
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
  const groups =
    option.kind === "size" ? [...new Set(option.values.map((v) => v.group ?? ""))] : [""];
  return (
    <fieldset className="py-5">
      <div className="mb-3 flex items-baseline justify-between">
        <legend className="text-[13px]">
          <span className="eyebrow">{option.name}</span>
          <span className="ml-3 text-muted">
            {value ? value.replace(/^.*· /, "") : option.required ? "Please select" : ""}
          </span>
        </legend>
      </div>
      {groups.map((g) => (
        <div key={g} className={cx(g && "mt-3 first-of-type:mt-0")}>
          {g ? <p className="mb-2 text-[12px] text-muted">{g} sizes (UK)</p> : null}
          <div className="flex flex-wrap gap-2">
            {option.values
              .filter((v) => (v.group ?? "") === g)
              .map((v) => {
                const selected = value === v.value;
                const label = v.value.replace(/^.*· /, "");
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
                      "flex min-h-11 cursor-pointer items-center justify-center gap-2 border text-[13px] transition-colors disabled:cursor-not-allowed disabled:text-taupe disabled:line-through",
                      option.kind === "size" ? "min-w-[60px] px-3" : "px-5",
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
        </div>
      ))}
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

function Detail({ value }: { value: string }) {
  if (value === TBC) return <Placeholder>To be confirmed</Placeholder>;
  const parts = value.split(TBC);
  return (
    <>
      {parts.map((p, i) => (
        <span key={i}>
          {p}
          {i < parts.length - 1 ? <Placeholder>To be confirmed</Placeholder> : null}
        </span>
      ))}
    </>
  );
}

/* ---------- Product page ---------- */
export function ProductPage({ product }: { product: Product }) {
  const { add } = useCart();
  const isObject = product.kind === "object";
  const initial = () =>
    Object.fromEntries(
      product.options
        .filter((o) => !o.required)
        .map((o) => [o.name, o.values.find((v) => !v.unavailable)?.value ?? ""])
        .filter(([, v]) => v),
    ) as Record<string, string>;

  const [selected, setSelected] = useState<Record<string, string>>(initial);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "loading" | "added">("idle");
  const [attempted, setAttempted] = useState(false);
  const [ringFit, setRingFit] = useState<RingFit>("");
  const [relatedTab, setRelatedTab] = useState<"like" | "recent">("like");
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    setSelected(initial());
    setActive(0);
    setQty(1);
    setState("idle");
    setAttempted(false);
    setRingFit("");
    setRelatedTab("like");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.handle]);

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
  const hasHeatColour = product.options.some((o) => o.values.some((v) => v.heatColoured));
  const careText = product.care.toLowerCase();
  const hasDelicateMaterials =
    ["enamel", "pearl", "gemstone"].some((m) => careText.includes(m)) ||
    product.collection === "papillon";
  const sizeOption = !isObject ? product.options.find((o) => o.name === "Size") : undefined;
  const otherOptions = product.options.filter((o) => o !== sizeOption);
  const hasMensFit = Boolean(sizeOption?.values.some((v) => v.group === "Men's"));
  const missingOptions = otherOptions.filter((o) => !selected[o.name]);
  const missingSize = Boolean(sizeOption) && !ringFit;
  const purchasable = isPurchasable(product);
  const maxQty = product.stock === "low" ? (product.stockCount ?? 1) : 10;
  const collection = getCollection(product.collection);

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
    await add(product, cartOptions, qty, heatSelected);
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
              {product.category} · SKU:{product.sku}
            </Eyebrow>
            <h1 className="heading mt-4 text-4xl leading-[1.05] md:text-5xl">{product.name}</h1>
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
                status={product.stock}
                label={stockLabel(product)}
                className="text-[13px]"
              />
            </div>
            {product.soldAsPair ? (
              <p className="mt-4 inline-flex items-center border border-deep px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-deep uppercase">
                Sold as a pair · Set of Two
              </p>
            ) : null}
            <p className="body-copy mt-6">{product.summary}</p>

            {/* Finish / other variants */}
            {otherOptions.length ? (
              <div className="mt-4 divide-y divide-line border-y border-line">
                {otherOptions.map((o) => (
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
                sku={product.sku}
                hasMens={hasMensFit}
                value={ringFit}
                onChange={setRingFit}
              />
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
              {product.stock === "low" ? (
                <p className="flex items-center gap-2 text-[13px] text-deep">
                  <InfoIcon size={16} /> Only {product.stockCount} left — handmade in small numbers.
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
                  {product.leadTime ? (
                    <>
                      <p className="mt-3 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                        Lead time
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">
                        {product.leadTime}
                      </p>
                    </>
                  ) : null}
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
              ) : product.stock === "sold-out" ? (
                <>
                  <Button full disabled>
                    Sold Out
                  </Button>
                  <NotifyMe />
                </>
              ) : product.stock === "coming-soon" ? (
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
              <Accordion title="Material & Details">
                <p>
                  <Detail value={product.material} />
                </p>
              </Accordion>
              {isObject ? (
                <Accordion title="UK Hallmarking for our objects">
                  <div className="space-y-3">
                    <p>
                      Each silver object collection will be submitted to a UK Assay Office for
                      independent testing and hallmarking before dispatch to the customer.
                    </p>
                    <p>
                      In the UK, qualifying precious metal objects are required by law to carry a
                      recognised hallmark. A hallmark provides independent verification of the
                      metal’s fineness.
                    </p>
                    <p>
                      Please refer to the official British Hallmarking Council Dealer’s Notice on our
                      UK Hallmarking page for further information.
                    </p>
                  </div>
                  <TextLink to="/hallmarking" className="mt-4 text-ink">
                    Learn more about UK Hallmarking for Objects
                  </TextLink>
                </Accordion>
              ) : null}
              <Accordion title="Craftsmanship">
                <p>{product.craftsmanship}</p>
              </Accordion>
              <Accordion title="Care">
                <div className="space-y-4">
                  <p>{product.care}</p>
                  {hasHeatColour ? (
                    <div>
                      <p className="text-[13px] font-medium text-ink">Heat-Coloured Silver</p>
                      <p className="mt-1">
                        Certain Argent Lune pieces feature colours created through a specialised
                        heat-colouring process. These colours are not permanent and may gradually
                        fade, change or wear away over time, particularly through regular wear,
                        friction and handling.
                      </p>
                      <p className="mt-2">
                        To help preserve the finish, store these pieces separately in a suitable
                        sealed bag when not in use. Avoid frequent wiping, rubbing, polishing and the
                        use of silver-cleaning solutions on coloured surfaces. The original colour
                        and finish cannot be guaranteed to remain unchanged.
                      </p>
                    </div>
                  ) : null}
                  {hasDelicateMaterials ? (
                    <div>
                      <p className="text-[13px] font-medium text-ink">
                        Enamel, Pearls &amp; Gemstones
                      </p>
                      <p className="mt-1">
                        Pieces featuring enamel, freshwater pearls or gemstones require extra care.
                        Avoid impact, prolonged moisture exposure, harsh chemicals, abrasive cleaning
                        products and ultrasonic cleaners unless specifically approved for the piece.
                        Gently clean with a soft, dry cloth. Do not apply silver-polishing products
                        directly to enamel, pearls or gemstones unless the product’s care
                        instructions expressly permit it.
                      </p>
                    </div>
                  ) : null}
                </div>
                <TextLink to="/care" className="mt-4 text-ink">
                  Care Guide
                </TextLink>
              </Accordion>
              <Accordion title="Shipping & Returns">
                <p>
                  Delivery options and timings are shown at checkout. Please see our{" "}
                  <Link to="/shipping" className="text-ink underline underline-offset-4">
                    Shipping
                  </Link>{" "}
                  and{" "}
                  <Link to="/returns" className="text-ink underline underline-offset-4">
                    Returns
                  </Link>{" "}
                  pages. For common questions, see our{" "}
                  <Link to="/faq" className="text-ink underline underline-offset-4">
                    FAQ
                  </Link>
                  .
                </p>
              </Accordion>
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
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink to="/craft" variant="outline-light">
                  Discover Our Craft
                </ButtonLink>
                <ButtonLink to="/hallmarking" variant="outline-light">
                  Learn more about UK Hallmarking for Objects
                </ButtonLink>
              </div>
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
