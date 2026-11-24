import { useState } from "react";
import { productHref, stockLabel, TBC, type Product } from "../data/catalog";
import { Link } from "../lib/router";
import { cx, formatPrice } from "../lib/format";
import { StockBadge } from "./ui";
import { ChevronRight } from "./Icons";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const second = product.images[1];
  const unavailable = product.stock === "sold-out";
  const material = product.material && product.material !== TBC ? product.material : "Silver";
  const href = productHref(product);

  return (
    <div className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-stone">
        <Link to={href} className="absolute inset-0 z-0 block" aria-label={`${product.name} — ${stockLabel(product)}`}>
          <img
            src={product.images[0].src}
            alt={product.images[0].alt}
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
          {product.isNew && product.stock !== "coming-soon" ? (
            <span className="bg-ivory/90 px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] uppercase">
              New
            </span>
          ) : null}
          {product.stock === "sold-out" ||
          product.stock === "coming-soon" ||
          product.stock === "enquire" ? (
            <span className="bg-ink/85 px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] text-ivory uppercase">
              {stockLabel(product)}
            </span>
          ) : null}
        </div>

        {/* Mobile: swap between packshot and model image */}
        {second ? (
          <button
            type="button"
            onClick={() => setShowSecond((s) => !s)}
            aria-pressed={showSecond}
            aria-label={showSecond ? "Show product image" : "Show model image"}
            className="absolute right-2.5 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-ivory/90 text-ink shadow-sm backdrop-blur-sm transition-colors hover:bg-ivory lg:hidden"
          >
            <ChevronRight
              size={16}
              className={cx("transition-transform", showSecond && "rotate-180")}
            />
          </button>
        ) : null}

        <span className="pointer-events-none absolute inset-x-3 bottom-3 z-10 translate-y-2 bg-ivory/95 py-3 text-center text-[10px] font-medium tracking-[0.2em] uppercase opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 max-md:hidden">
          {product.stock === "enquire" ? "Enquire" : "View Piece"}
        </span>
      </div>

      <Link to={href} className="block pt-4">
        <p className="eyebrow text-[10px] text-muted uppercase">{material}</p>
        <h3 className="heading mt-1.5 text-[19px] leading-snug transition-colors group-hover:text-deep md:text-[21px]">
          {product.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="text-[14px] tabular-nums">
            {product.stock === "enquire" ? "Price on enquiry" : formatPrice(product.price)}
          </p>
          <StockBadge status={product.stock} label={stockLabel(product)} />
        </div>
      </Link>
    </div>
  );
}
