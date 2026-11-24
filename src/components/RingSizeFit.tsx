import { useId, useState } from "react";
import { Link } from "../lib/router";
import { cx } from "../lib/format";
import { ChevronDown, ExternalIcon } from "./Icons";

export type RingFit = "women" | "men" | "";

const FITS = {
  women: {
    label: "Standard Size for Women",
    detail: "UK L–N · Approx. 51.2–53.8 mm inner circumference",
  },
  men: {
    label: "Standard Size for Men",
    detail: "UK P–R · Approx. 56.3–58.9 mm inner circumference",
  },
} as const;

/**
 * Size & Fit module for rings: two standard fits (radio cards), a collapsed
 * sizing-help disclosure, and a CTA-enabling selection. The men's option is
 * hidden for designs made in women's sizes only.
 */
export function RingSizeFit({
  productName,
  sku,
  hasMens,
  value,
  onChange,
}: {
  productName: string;
  sku: string;
  hasMens: boolean;
  value: RingFit;
  onChange: (v: RingFit) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const fits = hasMens ? (["women", "men"] as const) : (["women"] as const);

  return (
    <section className="mt-6" aria-labelledby="size-fit-heading">
      <h2 id="size-fit-heading" className="heading text-3xl">
        Size &amp; Fit
      </h2>
      <p className="mt-1 text-[14px] text-muted">Choose your standard size.</p>

      <div className="mt-5 space-y-3" role="radiogroup" aria-labelledby="size-fit-heading">
        {fits.map((fit) => {
          const selected = value === fit;
          return (
            <label
              key={fit}
              className={cx(
                "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-4 transition-colors",
                selected ? "border-ink bg-white" : "border-line hover:border-taupe",
              )}
            >
              <input
                type="radio"
                name="ring-fit"
                value={fit}
                checked={selected}
                onChange={() => onChange(fit)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cx(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-deep",
                  selected ? "border-ink" : "border-taupe",
                )}
              >
                {selected ? <span className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
              </span>
              <span>
                <span className="block text-[14px] font-medium">{FITS[fit].label}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-muted">
                  {FITS[fit].detail}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="mt-3 text-[13px] text-muted">Open-ended and slightly adjustable.</p>

      <div className="mt-5 rounded-xl border border-line">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="text-[14px] font-medium">Size outside this range?</span>
          <ChevronDown
            size={16}
            className={cx("shrink-0 transition-transform", open && "rotate-180")}
          />
        </button>
        <div
          id={panelId}
          role="region"
          className={cx(
            "grid transition-[grid-template-rows] duration-400 ease-out",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="border-t border-line px-5 py-4">
              <p className="text-[13px] leading-relaxed text-muted">
                If your ring size falls outside the ranges shown, or you’re unsure which fit to
                choose, please contact us before ordering. Tell us your usual UK ring size or your
                finger circumference in millimetres, and we’ll advise you on the fit of this design.
              </p>
              <Link
                to={`/contact?piece=${encodeURIComponent(productName)}&sku=${encodeURIComponent(sku)}`}
                className="link-line mt-4 text-ink"
              >
                Ask about sizing
                <ExternalIcon size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
