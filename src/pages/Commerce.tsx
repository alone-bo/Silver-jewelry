import { useState, type FormEvent } from "react";
import { useCart, type Order } from "../store/cart";
import { CartLine } from "../components/CartDrawer";
import {
  Button,
  ButtonLink,
  Eyebrow,
  Field,
  Img,
  Placeholder,
  StockBadge,
  isEmail,
} from "../components/ui";
import { CheckIcon, TruckIcon } from "../components/Icons";
import { Link, navigate } from "../lib/router";
import { cx, formatPrice } from "../lib/format";
import { products, stockLabel, type StockStatus } from "../data/catalog";

/* ================= Cart page ================= */
export function CartPage() {
  const { items, subtotal, count } = useCart();
  return (
    <div className="container-lune pb-24 pt-14 md:pb-32 md:pt-20">
      <h1 className="display text-5xl md:text-7xl">
        Your Bag <span className="font-sans text-base text-muted">({count})</span>
      </h1>
      {items.length === 0 ? (
        <div className="mt-16 border-t border-line pt-16 text-center">
          <p className="heading text-3xl">Your bag is empty</p>
          <p className="body-copy mt-3">Discover pieces shaped by hand.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to="/jewellery">Explore Jewellery</ButtonLink>
            <ButtonLink to="/objects" variant="secondary">
              Explore Objects
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="hidden grid-cols-[1fr_auto] border-b border-ink pb-3 text-[11px] font-medium tracking-[0.18em] uppercase md:grid">
              <span>Piece</span>
              <span>Total</span>
            </div>
            <ul className="divide-y divide-line border-b border-line">
              {items.map((i) => (
                <CartLine key={i.id} item={i} />
              ))}
            </ul>
            <Link to="/shop" className="link-line mt-8">
              Continue Shopping
            </Link>
          </div>
          <aside className="lg:col-span-4">
            <div className="bg-white p-6 md:p-8 lg:sticky lg:top-[108px]">
              <h2 className="heading text-2xl">Order Summary</h2>
              <dl className="mt-6 space-y-3 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-muted">Calculated at checkout</dd>
                </div>
              </dl>
              <div className="mt-6 flex items-baseline justify-between border-t border-line pt-5">
                <span className="eyebrow">Estimated Total</span>
                <span className="text-xl tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-[12px] text-muted">GBP, including VAT where applicable.</p>
              <Button full className="mt-6" onClick={() => navigate("/checkout")}>
                Checkout
              </Button>
              <p className="mt-6 text-[12px] leading-relaxed text-muted">
                Each piece is handmade; subtle variations are part of its character.
              </p>
            </div>
          </aside>
        </div>
      )}

      <section className="mt-24 border-t border-line pt-12">
        <Eyebrow className="mb-6">Stock Status Reference</Eyebrow>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {(["available", "low", "sold-out", "coming-soon", "enquire"] as StockStatus[]).map(
            (s) => (
              <StockBadge
                key={s}
                status={s}
                label={stockLabel({ stock: s, stockCount: 2 })}
                className="text-[13px]"
              />
            ),
          )}
        </div>
      </section>
    </div>
  );
}

/* ================= Checkout ================= */
export function Checkout() {
  const { items, subtotal, placeOrder } = useCart();
  const [f, setF] = useState({
    email: "",
    first: "",
    last: "",
    address: "",
    address2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    phone: "",
    card: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const set =
    (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setF({ ...f, [k]: e.target.value });
      if (errors[k]) setErrors({ ...errors, [k]: "" });
    };

  if (items.length === 0) {
    return (
      <div className="container-lune py-32 text-center">
        <h1 className="display text-5xl">Your bag is empty</h1>
        <p className="body-copy mt-4">Add a piece to your bag to continue to checkout.</p>
        <ButtonLink to="/shop" className="mt-8">
          Explore the Collection
        </ButtonLink>
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!isEmail(f.email)) er.email = "Enter a valid email address.";
    (["first", "last", "address", "city", "postcode"] as const).forEach((k) => {
      if (!f[k].trim()) er[k] = "Required.";
    });
    if (f.card.replace(/\s/g, "").length < 12) er.card = "Enter a valid card number.";
    if (!/^\d{2}\s?\/\s?\d{2}$/.test(f.expiry)) er.expiry = "MM / YY";
    if (!/^\d{3,4}$/.test(f.cvc)) er.cvc = "3–4 digits";
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`co-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setLoading(true);
    await placeOrder({
      email: f.email,
      name: `${f.first} ${f.last}`,
      address: [f.address, f.address2, f.city, f.postcode, f.country].filter(Boolean).join(", "),
    });
    navigate("/order/confirmed");
  };

  const input = (
    k: keyof typeof f,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
    optional = false,
  ) => (
    <Field label={label} htmlFor={`co-${k}`} error={errors[k]} optional={optional}>
      <input
        id={`co-${k}`}
        className="field-input"
        value={f[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        {...props}
      />
    </Field>
  );

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_minmax(420px,40%)]">
      <div className="px-5 pb-20 pt-10 md:px-10 lg:px-16 xl:pl-[max(4rem,calc((100vw-1520px)/2+4rem))]">
        <nav
          aria-label="Checkout steps"
          className="mb-10 flex items-center gap-3 text-[12px] text-muted"
        >
          <Link to="/cart" className="hover:text-deep">
            Bag
          </Link>
          <span>/</span>
          <span className="text-ink">Information & Payment</span>
          <span>/</span>
          <span>Confirmation</span>
        </nav>
        <h1 className="display text-5xl">Checkout</h1>
        <p className="mt-3 text-[13px] text-muted">
          Prototype of the Shopify-hosted checkout — no payment is taken.
        </p>

        <form onSubmit={submit} noValidate className="mt-10 max-w-2xl space-y-12">
          <section>
            <h2 className="eyebrow mb-5">Contact</h2>
            {input("email", "Email Address", { type: "email", autoComplete: "email" })}
            <label className="mt-4 flex items-center gap-3 text-[13px] text-muted">
              <input type="checkbox" className="accent-ink" /> Email me Notes from Argent Lune
            </label>
          </section>

          <section>
            <h2 className="eyebrow mb-5">Delivery</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Country / Region" htmlFor="co-country">
                  <select
                    id="co-country"
                    className="field-input"
                    value={f.country}
                    onChange={set("country")}
                  >
                    <option>United Kingdom</option>
                  </select>
                </Field>
              </div>
              {input("first", "First Name", { autoComplete: "given-name" })}
              {input("last", "Last Name", { autoComplete: "family-name" })}
              <div className="md:col-span-2">
                {input("address", "Address", { autoComplete: "address-line1" })}
              </div>
              <div className="md:col-span-2">
                {input("address2", "Apartment, Suite", { autoComplete: "address-line2" }, true)}
              </div>
              {input("city", "Town / City", { autoComplete: "address-level2" })}
              {input("postcode", "Postcode", { autoComplete: "postal-code" })}
              <div className="md:col-span-2">
                {input("phone", "Phone", { type: "tel", autoComplete: "tel" }, true)}
              </div>
            </div>
          </section>

          <section>
            <h2 className="eyebrow mb-5">Shipping Method</h2>
            <div className="flex items-center justify-between border border-ink bg-white px-5 py-4">
              <span className="flex items-center gap-3 text-[14px]">
                <span className="flex h-4 w-4 items-center justify-center rounded-full border border-ink">
                  <span className="h-2 w-2 rounded-full bg-ink" />
                </span>
                <Placeholder>Shipping options to be confirmed</Placeholder>
              </span>
              <span className="text-[14px] text-muted">£ —</span>
            </div>
          </section>

          <section>
            <h2 className="eyebrow mb-5">Payment</h2>
            <div className="space-y-5 border border-line bg-white p-5 md:p-6">
              {input("card", "Card Number", {
                inputMode: "numeric",
                autoComplete: "cc-number",
                placeholder: "1234 5678 9012 3456",
              })}
              <div className="grid grid-cols-2 gap-5">
                {input("expiry", "Expiry", { placeholder: "MM / YY", autoComplete: "cc-exp" })}
                {input("cvc", "Security Code", { inputMode: "numeric", autoComplete: "cc-csc" })}
              </div>
              {input("cardName", "Name on Card", { autoComplete: "cc-name" }, true)}
            </div>
          </section>

          <Button type="submit" full loading={loading}>
            {loading ? "Placing Order" : "Place Order"}
          </Button>
        </form>
      </div>

      <aside className="border-t border-line bg-stone px-5 py-10 md:px-10 lg:border-l lg:border-t-0 lg:px-12 lg:pt-28">
        <div className="lg:sticky lg:top-[120px]">
          <h2 className="eyebrow mb-6">Order Summary</h2>
          <ul className="space-y-5">
            {items.map((i) => (
              <li key={i.id} className="flex gap-4">
                <div className="relative">
                  <Img src={i.image} alt={i.name} className="aspect-[4/5] w-16 bg-white" />
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1 text-[10px] text-ivory">
                    {i.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="heading text-[17px] leading-snug">{i.name}</p>
                  <p className="mt-1 text-[12px] text-muted">
                    {Object.values(i.options).join(" · ")}
                  </p>
                </div>
                <p className="text-[14px] tabular-nums">
                  {formatPrice(i.price === null ? null : i.price * i.qty)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-8 space-y-3 border-t border-line pt-6 text-[14px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping</dt>
              <dd className="text-muted">To be confirmed</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-5">
            <span className="eyebrow">Total</span>
            <span className="text-xl tabular-nums">
              <span className="mr-2 text-[11px] text-muted">GBP</span>
              {formatPrice(subtotal)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}

/* ================= Order states ================= */
const sampleOrder = (): Order => ({
  number: "AL-000000",
  email: "client@example.com",
  name: "Sample Client",
  address: "[Delivery address]",
  placedAt: new Date().toISOString(),
  items: [products[8], products[15]].map((p) => ({
    id: p.handle,
    handle: p.handle,
    name: p.name,
    image: p.images[0].src,
    collection: p.collection,
    options: p.options.length ? { [p.options[0].name]: p.options[0].values[0].value } : {},
    price: p.price,
    qty: 1,
    maxQty: 1,
  })),
});

function OrderItems({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {order.items.map((i) => (
        <li key={i.id} className="flex items-center gap-4 py-4">
          <Img src={i.image} alt={i.name} className="aspect-[4/5] w-16" />
          <div className="flex-1">
            <p className="heading text-lg leading-snug">{i.name}</p>
            <p className="text-[12px] text-muted">
              {[...Object.values(i.options), `Qty ${i.qty}`].join(" · ")}
            </p>
          </div>
          <p className="text-[14px] tabular-nums">
            {formatPrice(i.price === null ? null : i.price * i.qty)}
          </p>
        </li>
      ))}
    </ul>
  );
}

const TIMELINE = ["Order placed", "Being prepared", "Dispatched", "Delivered"];

function Timeline({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2">
      {TIMELINE.map((t, i) => (
        <li key={t}>
          <div className={cx("h-0.5", i <= step ? "bg-ink" : "bg-line")} />
          <p
            className={cx(
              "mt-3 text-[11px] tracking-wide md:text-[12px]",
              i <= step ? "text-ink" : "text-muted",
            )}
          >
            {i < step || (i === step && step === 0) ? (
              <CheckIcon size={12} className="mr-1 inline" />
            ) : null}
            {t}
          </p>
        </li>
      ))}
    </ol>
  );
}

export function OrderConfirmed() {
  const { lastOrder } = useCart();
  const order = lastOrder ?? sampleOrder();
  return (
    <div className="container-lune max-w-3xl pb-24 pt-16 md:pb-32 md:pt-24">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ink">
        <CheckIcon size={22} />
      </span>
      <Eyebrow className="mt-8">Order {order.number}</Eyebrow>
      <h1 className="display mt-4 text-5xl md:text-7xl">Thank you, {order.name.split(" ")[0]}.</h1>
      <p className="body-copy mt-6 text-[17px]">
        Your order has been received. A confirmation email has been sent to{" "}
        <span className="text-ink">{order.email}</span>. We will let you know as soon as it has been
        dispatched.
      </p>
      <div className="mt-12">
        <Timeline step={0} />
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Delivery to</p>
          <p className="text-[14px] leading-relaxed text-muted">
            {order.name}
            <br />
            {order.address}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Estimated dispatch</p>
          <Placeholder>To be confirmed</Placeholder>
        </div>
      </div>
      <div className="mt-12">
        <OrderItems order={order} />
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <ButtonLink to="/shop">Continue Shopping</ButtonLink>
        <ButtonLink to="/order/shipped" variant="secondary">
          Preview Shipping Notification
        </ButtonLink>
      </div>
    </div>
  );
}

export function OrderShipped() {
  const { lastOrder } = useCart();
  const order = lastOrder ?? sampleOrder();
  return (
    <div className="bg-stone py-14 md:py-24">
      <div className="mx-auto max-w-2xl bg-ivory px-6 py-12 md:px-14 md:py-16">
        <p className="text-center font-serif text-[20px] font-medium tracking-[0.34em]">
          ARGENT LUNE
        </p>
        <div className="my-10 h-px bg-line" />
        <TruckIcon size={30} />
        <Eyebrow className="mt-6">Shipping Notification · Order {order.number}</Eyebrow>
        <h1 className="display mt-4 text-4xl md:text-6xl">Your order is on its way.</h1>
        <p className="body-copy mt-5">
          Dear {order.name.split(" ")[0]}, your pieces have been carefully packed and dispatched.
        </p>
        <div className="mt-10">
          <Timeline step={2} />
        </div>
        <dl className="mt-10 grid gap-0 text-[14px]">
          {[
            ["Carrier", <Placeholder key="c">To be confirmed</Placeholder>],
            ["Tracking number", <Placeholder key="t">Tracking number</Placeholder>],
            ["Delivery to", order.address],
          ].map(([k, v]) => (
            <div
              key={k as string}
              className="grid grid-cols-[140px_1fr] gap-4 border-b border-line py-3.5"
            >
              <dt className="text-muted">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <Button full disabled className="mt-8">
          Track Your Order
        </Button>
        <div className="mt-10">
          <OrderItems order={order} />
        </div>
        <p className="mt-10 text-[13px] leading-relaxed text-muted">
          Before wearing, take a moment to read our{" "}
          <Link to="/care" className="text-ink underline underline-offset-4">
            Care Guide
          </Link>
          . Silver is a living material and will change, gently, with time.
        </p>
        <div className="my-10 h-px bg-line" />
        <p className="text-center text-[11px] text-muted">
          © 2026 ARGENT LUNE LIMITED. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* ================= Account ================= */
export function Account() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!isEmail(email)) er.email = "Enter a valid email address.";
    if (pw.length < 6) er.pw = "Password must be at least 6 characters.";
    setErr(er);
    if (Object.keys(er).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
  };
  return (
    <div className="container-lune grid gap-12 py-16 md:py-24 lg:grid-cols-2">
      <div className="max-w-md">
        <Eyebrow className="mb-5">Account</Eyebrow>
        <h1 className="display text-5xl md:text-6xl">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>
        {done ? (
          <p
            className="mt-10 flex items-center gap-3 border border-line bg-white p-5 text-[14px]"
            role="status"
          >
            <CheckIcon size={18} /> {mode === "login" ? "Signed in" : "Account created"} — prototype
            state. Shopify customer accounts will handle this in production.
          </p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-10 space-y-6">
            <Field label="Email Address" htmlFor="acc-email" error={err.email}>
              <input
                id="acc-email"
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!err.email}
              />
            </Field>
            <Field label="Password" htmlFor="acc-pw" error={err.pw}>
              <input
                id="acc-pw"
                type="password"
                className="field-input"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                aria-invalid={!!err.pw}
              />
            </Field>
            <Button type="submit" full loading={loading}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>
        )}
        <button
          type="button"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setDone(false);
          }}
          className="mt-6 cursor-pointer text-[13px] text-muted underline underline-offset-4 hover:text-deep"
        >
          {mode === "login"
            ? "New to Argent Lune? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>
      <div className="hidden lg:block">
        <Img
          src={"/images/papillon-model.jpg"}
          alt="Model wearing Papillon jewellery"
          className="aspect-[4/5]"
        />
      </div>
    </div>
  );
}
