import { useEffect, useRef, useState, type FormEvent } from "react";
import { TBC, type Product } from "../data/catalog";
import { Link } from "../lib/router";
import { cx } from "../lib/format";
import { Accordion, Button, Eyebrow, Field, Placeholder, isEmail } from "./ui";
import { CheckIcon, CloseIcon, UploadIcon } from "./Icons";

/* ---------- Product FAQ ---------- */
function Tbc({ value }: { value: string }) {
  return value.includes(TBC) ? <Placeholder>Answer to be confirmed</Placeholder> : <>{value}</>;
}

export function ProductFAQ({ product }: { product: Product }) {
  const isObject = product.kind === "object";
  const items: [string, React.ReactNode][] = [
    [
      "What materials are used?",
      <>
        <Tbc value={product.objectSpecs?.material ?? product.material} /> Full details are listed
        under Material &amp; Details above.
      </>,
    ],
    [
      isObject ? "Is this object handcrafted?" : "Is this jewelry handcrafted?",
      <>
        {product.craftsmanship} Handmade piece — subtle variations in form, texture and finish are
        part of its character.
      </>,
    ],
    [
      isObject
        ? "How should I care for my silver object?"
        : "How should I care for my silver jewelry?",
      <>
        {product.care}{" "}
        <Link to="/care" className="text-ink underline underline-offset-4">
          Read the Care Guide
        </Link>
        .
      </>,
    ],
    [
      "What is your shipping and return policy?",
      <>
        Delivery options and timings are shown at checkout. Please see our{" "}
        <Link to="/shipping" className="text-ink underline underline-offset-4">
          Shipping
        </Link>{" "}
        and{" "}
        <Link to="/returns" className="text-ink underline underline-offset-4">
          Returns
        </Link>{" "}
        pages.
      </>,
    ],
    [
      isObject ? "Can I use this object every day?" : "Can I wear this jewelry every day?",
      <Placeholder key="p">Answer to be confirmed</Placeholder>,
    ],
  ];
  return (
    <section aria-labelledby="pdp-faq" className="border-t border-line">
      <div className="container-lune grid gap-10 py-20 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Eyebrow className="mb-4">Questions</Eyebrow>
          <h2 id="pdp-faq" className="display text-4xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <Link to="/faq" className="link-line mt-8">
            View all FAQs
          </Link>
        </div>
        <div className="border-t border-line lg:col-span-7 lg:col-start-6">
          {items.map(([q, a]) => (
            <Accordion key={q} title={q} size="lg">
              {a}
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Stars ---------- */
export function Stars({
  value = 0,
  size = 16,
  className,
}: {
  value?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cx("inline-flex gap-0.5", className)} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className="text-ink">
          <path
            d="m12 3.5 2.6 5.5 6 .7-4.4 4.1 1.1 5.9L12 16.8l-5.3 2.9 1.1-5.9-4.4-4.1 6-.7L12 3.5Z"
            fill={i <= value ? "currentColor" : "none"}
            stroke={i <= value ? "currentColor" : "#B9C0BE"}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* ---------- Write a review dialog ---------- */
function ReviewDialog({ productName, onClose }: { productName: string; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [f, setF] = useState({ name: "", email: "", title: "", body: "" });
  const [photos, setPhotos] = useState<{ url: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!rating) er.rating = "Please choose a rating.";
    if (!f.name.trim()) er.name = "Please enter your name.";
    if (!isEmail(f.email)) er.email = "Please enter a valid email address.";
    if (f.body.trim().length < 10) er.body = "Please write a few words about your piece.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setState("loading");
    await new Promise((r) => setTimeout(r, 1100));
    setState("done");
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Write a review"
    >
      <div className="absolute inset-0 animate-fade-in bg-ink/40" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-xl animate-drop overflow-y-auto bg-ivory p-6 md:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 cursor-pointer p-2 hover:opacity-60"
        >
          <CloseIcon size={20} />
        </button>
        {state === "done" ? (
          <div className="py-6" role="status">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink">
              <CheckIcon size={20} />
            </span>
            <h2 className="display mt-6 text-4xl">Thank you for your review.</h2>
            <p className="body-copy mt-4">
              Your review has been submitted and will appear once it has been checked.
            </p>
            <Button className="mt-8" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <Eyebrow>Write a Review</Eyebrow>
            <h2 className="heading mt-3 pr-8 text-3xl leading-tight">{productName}</h2>
            <form onSubmit={submit} noValidate className="mt-8 space-y-6">
              <fieldset>
                <legend className="field-label">Your Rating</legend>
                <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`${i} star${i > 1 ? "s" : ""}`}
                      aria-pressed={rating === i}
                      onMouseEnter={() => setHover(i)}
                      onClick={() => {
                        setRating(i);
                        setErrors((e) => ({ ...e, rating: "" }));
                      }}
                      className="cursor-pointer p-1"
                    >
                      <svg width={26} height={26} viewBox="0 0 24 24" aria-hidden>
                        <path
                          d="m12 3.5 2.6 5.5 6 .7-4.4 4.1 1.1 5.9L12 16.8l-5.3 2.9 1.1-5.9-4.4-4.1 6-.7L12 3.5Z"
                          fill={(hover || rating) >= i ? "#252827" : "none"}
                          stroke={(hover || rating) >= i ? "#252827" : "#B9C0BE"}
                          strokeWidth="1.1"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
                {errors.rating ? (
                  <p className="mt-2 text-[13px] text-alert">{errors.rating}</p>
                ) : null}
              </fieldset>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Name" htmlFor="rv-name" error={errors.name}>
                  <input
                    id="rv-name"
                    className="field-input"
                    value={f.name}
                    onChange={(e) => setF({ ...f, name: e.target.value })}
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field
                  label="Email Address"
                  htmlFor="rv-email"
                  error={errors.email}
                  hint="Not shown publicly."
                >
                  <input
                    id="rv-email"
                    type="email"
                    className="field-input"
                    value={f.email}
                    onChange={(e) => setF({ ...f, email: e.target.value })}
                    aria-invalid={!!errors.email}
                  />
                </Field>
              </div>
              <Field label="Review Title" htmlFor="rv-title" optional>
                <input
                  id="rv-title"
                  className="field-input"
                  value={f.title}
                  onChange={(e) => setF({ ...f, title: e.target.value })}
                />
              </Field>
              <Field label="Your Review" htmlFor="rv-body" error={errors.body}>
                <textarea
                  id="rv-body"
                  rows={5}
                  className="field-input resize-y"
                  value={f.body}
                  onChange={(e) => setF({ ...f, body: e.target.value })}
                  aria-invalid={!!errors.body}
                />
              </Field>
              <div>
                <span className="field-label">
                  Photos{" "}
                  <span className="ml-2 normal-case tracking-normal text-muted">(optional)</span>
                </span>
                <div className="flex flex-wrap gap-3">
                  {photos.map((p) => (
                    <div key={p.url} className="relative">
                      <img src={p.url} alt={p.name} className="h-20 w-20 object-cover" />
                      <button
                        type="button"
                        aria-label={`Remove ${p.name}`}
                        onClick={() => setPhotos((ps) => ps.filter((x) => x.url !== p.url))}
                        className="absolute right-1 top-1 cursor-pointer bg-ivory/90 p-0.5"
                      >
                        <CloseIcon size={12} />
                      </button>
                    </div>
                  ))}
                  {photos.length < 4 ? (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-taupe bg-white text-[11px] text-muted hover:border-ink"
                    >
                      <UploadIcon size={18} /> Add
                    </button>
                  ) : null}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  aria-label="Upload review photos"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? [])
                      .filter((x) => x.type.startsWith("image/"))
                      .slice(0, 4 - photos.length);
                    setPhotos((ps) => [
                      ...ps,
                      ...files.map((x) => ({ url: URL.createObjectURL(x), name: x.name })),
                    ]);
                    e.target.value = "";
                  }}
                />
              </div>
              <Button type="submit" full loading={state === "loading"}>
                Submit Review
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Customer reviews — honest empty state until real reviews exist ---------- */
export function CustomerReviews({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  return (
    <section aria-labelledby="pdp-reviews" className="border-t border-line bg-stone">
      <div className="container-lune py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow className="mb-5">Customer Reviews</Eyebrow>
          <h2 id="pdp-reviews" className="display text-4xl md:text-5xl">
            No reviews yet
          </h2>
          <p className="body-copy mx-auto mt-5 max-w-md">
            Be the first to share your thoughts on {product.name}.
          </p>
          <Button variant="secondary" className="mt-8" onClick={() => setOpen(true)}>
            Write a Review
          </Button>
        </div>
      </div>
      {open ? <ReviewDialog productName={product.name} onClose={() => setOpen(false)} /> : null}
    </section>
  );
}
