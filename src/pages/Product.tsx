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
import { CustomerReviews, ProductFAQ } from "../components/ProductExtras";
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
  CloseIcon,
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
  onSizeGuide,
  showError,
}: {
  option: ProductOption;
  value: string | undefined;
  onChange: (v: string) => void;
  onSizeGuide: () => void;
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
        {option.helper ? (
          <button
            type="button"
            onClick={onSizeGuide}
            className="cursor-pointer text-[12px] text-muted underline underline-offset-4 hover:text-deep"
          >
            {option.helper}
          </button>
        ) : null}
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

function SizeGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Size guide"
    >
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-drop bg-ivory p-8 md:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close size guide"
          className="absolute right-4 top-4 cursor-pointer p-2"
        >
          <CloseIcon size={20} />
        </button>
        <h2 className="heading text-3xl">Ring Size Guide</h2>
        <p className="body-copy mt-4">
          Our rings are offered in UK letter sizes, grouped into women’s and men’s ranges for
          clarity. Any size can be chosen by anyone.
        </p>
        <table className="mt-6 w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-ink">
              <th className="py-2 font-medium">UK size</th>
              <th className="py-2 font-medium">Inside diameter</th>
              <th className="py-2 font-medium">Circumference</th>
            </tr>
          </thead>
          <tbody className="text-muted">
            {["J", "L", "N", "R", "T", "V"].map((s) => (
              <tr key={s} className="border-b border-line">
                <td className="py-2.5 text-ink">UK {s}</td>
                <td className="py-2.5">{TBC}</td>
                <td className="py-2.5">{TBC}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-5 text-[12px] text-muted">
          Measurements to be confirmed against Argent Lune’s ring mandrels.
        </p>
      </div>
    </div>
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
  const [sizeGuide, setSizeGuide] = useState(false);

  useEffect(() => {
    setSelected(initial());
    setActive(0);
    setQty(1);
    setState("idle");
    setAttempted(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.handle]);

  const heatSelected = useMemo(
    () =>
      product.options.some((o) =>
        o.values.some((v) => v.heatColoured && selected[o.name] === v.value),
      ),
    [product, selected],
  );
  const missing = product.options.filter((o) => !selected[o.name]);
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
    if (missing.length) return;
    setState("loading");
    await add(product, selected, qty, heatSelected);
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
        : missing.length && attempted
          ? `Select ${missing[0].name}`
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
              {isObject ? "Silver Objects" : collection?.title} · {product.category}
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
            <p className="body-copy mt-6">{product.summary}</p>

            {/* Variants */}
            {product.options.length ? (
              <div className="mt-4 divide-y divide-line border-y border-line">
                {product.options.map((o) => (
                  <OptionSelector
                    key={o.name}
                    option={o}
                    value={selected[o.name]}
                    onChange={(v) => choose(o, v)}
                    onSizeGuide={() => setSizeGuide(true)}
                    showError={attempted}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-6 border-t border-line" />
            )}

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
                    Heat-coloured silver gains its tones through controlled heating, so every piece
                    is unique and its colour will differ from the images shown. The finish may
                    gradually change with wear and handling. Please read the{" "}
                    <Link to="/care" className="text-ink underline underline-offset-4">
                      Heat-Coloured Silver care notes
                    </Link>{" "}
                    before ordering.
                  </p>
                </div>
              ) : null}

              {purchasable ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <QuantitySelector value={qty} onChange={setQty} max={maxQty} />
                  <Button
                    onClick={onAdd}
                    loading={state === "loading"}
                    className={cx("flex-1", state === "added" && "!bg-deep")}
                    aria-describedby={heatSelected ? "heat-ack" : undefined}
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
              {heatSelected && purchasable ? (
                <p id="heat-ack" className="text-[12px] text-muted">
                  By adding this piece you acknowledge the colour finish notice above.
                </p>
              ) : null}

              <p className="flex items-start gap-2 text-[12px] leading-relaxed text-muted">
                <InfoIcon size={15} className="mt-0.5 shrink-0" />
                Handmade piece — subtle variations in form, texture and finish are part of its
                character.
              </p>
            </div>

            {/* Details accordions */}
            <div className="mt-8 border-t border-line">
              <Accordion title="Description" defaultOpen>
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
              {!isObject ? (
                <>
                  <Accordion title="Size & Fit">
                    <p>
                      <Detail value={product.sizeFit ?? TBC} />
                    </p>
                  </Accordion>
                  <Accordion title="Total Weight">
                    <p>
                      <Detail value={product.weight} />
                    </p>
                  </Accordion>
                </>
              ) : null}
              <Accordion title="Craftsmanship">
                <p>{product.craftsmanship}</p>
              </Accordion>
              <Accordion title="Care">
                <p>{product.care}</p>
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
                  pages.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + Customer Reviews */}
      {product.stock !== "enquire" ? (
        <>
          <ProductFAQ product={product} />
          <CustomerReviews product={product} />
        </>
      ) : null}

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
                  UK Hallmarking
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-t border-line bg-stone">
          <div className="container-lune grid items-center gap-10 py-20 md:grid-cols-2 md:py-28">
            <Img
              src={IMG.handsTool}
              alt="A silversmith shaping a ring at the bench"
              className="aspect-[5/4]"
            />
            <div className="md:pl-10">
              <Eyebrow className="mb-6">Made by Hand</Eyebrow>
              <h2 className="display text-4xl md:text-6xl">Noticed in the details.</h2>
              <p className="body-copy mt-6 max-w-md">
                Every piece is shaped, refined and finished by hand. Small irregularities are
                welcomed — they are what make the piece yours alone.
              </p>
              <TextLink to="/craft" className="mt-8">
                Our Craft
              </TextLink>
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      <section className="container-lune py-20 md:py-28">
        <h2 className="display mb-12 text-4xl md:text-5xl">You May Also Like</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.handle} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {sizeGuide ? <SizeGuide onClose={() => setSizeGuide(false)} /> : null}
    </>
  );
}
