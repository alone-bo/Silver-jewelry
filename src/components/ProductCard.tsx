import { useState } from "react";
import { productHref, stockLabel, type Product, type Variant } from "../data/catalog";
import { Link } from "../lib/router";
import { cx, formatPrice } from "../lib/format";
import { StockBadge } from "./ui";
import { ChevronRight } from "./Icons";

/**
 * One card per shopper-facing style. When a product is sold in several colourways or
 * forms, each style gets its own card and links to the shared product page with the
 * matching style preselected.
 */
export function ProductCard({
  product,
  variant,
  priority,
}: {
  product: Product;
  variant?: Variant;
  priority?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [showSecond, setShowSecond] = useState(false);

  const lead = variant?.image !== undefined ? product.images[variant.image] : product.images[0];
  const second = product.images.find((im) => im !== lead) ?? product.images[1];
  const stock = variant?.stock ?? product.stock;
  const stockCount = variant?.stockCount ?? product.stockCount;
  const unavailable = stock === "sold-out";
  const href = productHref(product, variant);

  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <Link
          to={href}
          className="absolute inset-0 z-0 block"
          aria-label={`${product.name}${variant?.label ? ` — ${variant.label}` : ""} — ${stockLabel({ stock, stockCount })}`}
        >
          <img
            src={lead.src}
            alt={lead.alt}
            loading={priority ? "eager" : "lazy"}
            ref={(el) => {
              if (el?.complete && el.naturalWidth) setLoaded(true);
            }}
            onLoad={() => setLoaded(true)}
            className={cx(
              "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-lune)] group-hover:scale-[1.03]",
              loaded ? "opacity-100" : "opacity-0",
              second && "group-hover:opacity-0",
              showSecond && "opacity-0",
              unavailable && "grayscale-[35%]",
            )}
          />
          {second ? (
            <img
              src={second.src}
              alt=""
              aria-hidden
              loading="lazy"
              className={cx(
                "absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-[opacity,transform] duration-[900ms] ease-[var(--ease-lune)] group-hover:scale-100 group-hover:opacity-100",
                showSecond && "opacity-100",
              )}
            />
          ) : null}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {product.isNew && stock !== "coming-soon" ? (
            <span className="bg-ivory/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] uppercase">
              New
            </span>
          ) : null}
          {stock === "sold-out" || stock === "coming-soon" || stock === "enquire" ? (
            <span className="bg-ink/85 px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] text-ivory uppercase">
              {stockLabel({ stock, stockCount })}
            </span>
          ) : null}
        </div>

        {/* Mobile: swap between packshot and detail image */}
        {second ? (
          <button
            type="button"
            onClick={() => setShowSecond((s) => !s)}
            aria-pressed={showSecond}
            aria-label={showSecond ? "Show product image" : "Show detail image"}
            className="absolute right-2.5 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-ivory/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-ivory lg:hidden"
          >
            <ChevronRight
              size={16}
              className={cx("transition-transform", showSecond && "rotate-180")}
            />
          </button>
        ) : null}

        <span className="pointer-events-none absolute inset-x-3 bottom-3 z-10 translate-y-2 bg-ivory/95 py-3 text-center text-[10px] font-medium tracking-[0.2em] uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          {stock === "enquire" ? "Enquire" : "View Piece"}
        </span>
      </div>

      <Link to={href} className="block pt-4">
        <p className="eyebrow text-[10px] text-muted uppercase">{product.materials}</p>
        <h3 className="heading mt-1.5 text-[19px] leading-snug transition-colors group-hover:text-deep md:text-[21px]">
          {product.name}
        </h3>
        {variant?.label ? (
          <p className="mt-1.5 flex items-center gap-2 text-[12px] text-muted">
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
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-[14px] tabular-nums">
            {stock === "enquire" ? "Price on enquiry" : formatPrice(product.price)}
          </p>
          <StockBadge status={stock} label={stockLabel({ stock, stockCount })} />
        </div>
      </Link>
    </div>
  );
}
