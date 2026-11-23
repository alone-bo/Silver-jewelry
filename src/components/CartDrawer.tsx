import { useEffect } from "react";
import { useCart, type CartItem } from "../store/cart";
import { Link, navigate } from "../lib/router";
import { cx, formatPrice } from "../lib/format";
import { getCollection, getProduct, stockLabel } from "../data/catalog";
import { CloseIcon, FlameIcon } from "./Icons";
import { Button, Img, QuantitySelector, StockBadge } from "./ui";

export function CartLine({ item, compact }: { item: CartItem; compact?: boolean }) {
  const { setQty, remove, closeDrawer } = useCart();
  const p = getProduct(item.handle);
  return (
    <li className="flex gap-4 py-6 md:gap-6">
      <Link to={`/products/${item.handle}`} onClick={closeDrawer} className="shrink-0">
        <Img
          src={item.image}
          alt={item.name}
          className={cx("aspect-[4/5]", compact ? "w-24" : "w-24 md:w-32")}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="eyebrow mb-1.5 text-[10px] text-muted">
              {getCollection(item.collection)?.title}
            </p>
            <Link
              to={`/products/${item.handle}`}
              onClick={closeDrawer}
              className="heading block text-lg leading-snug hover:text-deep md:text-xl"
            >
              {item.name}
            </Link>
          </div>
          <p className="shrink-0 text-[14px] tabular-nums">
            {formatPrice(item.price === null ? null : item.price * item.qty)}
          </p>
        </div>
        {Object.keys(item.options).length ? (
          <dl className="mt-2 space-y-0.5 text-[13px] text-muted">
            {Object.entries(item.options).map(([k, v]) => (
              <div key={k} className="flex gap-1.5">
                <dt>{k}:</dt>
                <dd className="text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        {item.heatColoured ? (
          <p className="mt-2 flex items-center gap-1.5 text-[12px] text-muted">
            <FlameIcon size={14} /> Heat-coloured — colour will vary
          </p>
        ) : null}
        {p ? <StockBadge className="mt-2" status={p.stock} label={stockLabel(p)} /> : null}
        <div className="mt-auto flex items-center justify-between pt-4">
          <QuantitySelector
            size="sm"
            value={item.qty}
            max={item.maxQty}
            onChange={(n) => setQty(item.id, n)}
          />
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="cursor-pointer text-[12px] tracking-wide text-muted underline underline-offset-4 hover:text-deep"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const { drawerOpen, closeDrawer, items, subtotal, count } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Your Bag">
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={closeDrawer} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[480px] animate-slide-in-right flex-col bg-ivory">
        <div className="flex h-16 items-center justify-between border-b border-line px-6 md:h-[76px] md:px-8">
          <h2 className="heading text-2xl">
            Your Bag <span className="ml-1 font-sans text-[13px] text-muted">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="-mr-2 cursor-pointer p-2 hover:opacity-60"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="heading text-3xl">Your bag is empty</p>
            <p className="body-copy mt-3">Discover pieces shaped by hand.</p>
            <div className="mt-8 flex w-full flex-col gap-3">
              <Button
                full
                onClick={() => {
                  closeDrawer();
                  navigate("/jewellery");
                }}
              >
                Explore Jewellery
              </Button>
              <Button
                full
                variant="secondary"
                onClick={() => {
                  closeDrawer();
                  navigate("/objects");
                }}
              >
                Explore Objects
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6 md:px-8">
              {items.map((i) => (
                <CartLine key={i.id} item={i} compact />
              ))}
            </ul>
            <div className="border-t border-line bg-white px-6 py-6 md:px-8">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="text-[17px] tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                Shipping and taxes calculated at checkout. Prices shown in GBP.
              </p>
              <div className="mt-5 grid gap-3">
                <Button
                  full
                  onClick={() => {
                    closeDrawer();
                    navigate("/checkout");
                  }}
                >
                  Checkout
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" onClick={closeDrawer}>
                    Continue Shopping
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      closeDrawer();
                      navigate("/cart");
                    }}
                  >
                    View Bag
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
