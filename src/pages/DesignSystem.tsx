import { useState } from "react";
import { products, stockLabel, type StockStatus } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import {
  Accordion,
  Button,
  Eyebrow,
  Field,
  PageIntro,
  Placeholder,
  QuantitySelector,
  StockBadge,
  TextLink,
} from "../components/ui";
import { FlameIcon } from "../components/Icons";
import { cx } from "../lib/format";

const colors = [
  ["Ivory", "--color-ivory", "#F6F5F0", "Primary background"],
  ["Stone", "--color-stone", "#ECEEED", "Cards, alternating sections"],
  ["Ink", "--color-ink", "#252827", "Text, primary button"],
  ["Deep", "--color-deep", "#203943", "Link hover, selected states"],
  ["Line", "--color-line", "#DDDDD8", "Dividers, card borders"],
  ["Muted", "--color-muted", "#6D7472", "Secondary text"],
  ["Taupe", "--color-taupe", "#B9C0BE", "Accent, disabled, notices"],
  ["White", "--color-white", "#FFFFFF", "Inputs, cards"],
];

const type = [
  ["Display XL", "display text-7xl md:text-8xl", "Cormorant Garamond 300 · 96–124px · 1.02"],
  ["Display L", "display text-5xl md:text-7xl", "Cormorant Garamond 300 · 48–72px"],
  ["Heading", "heading text-3xl", "Cormorant Garamond 400 · 30px"],
  ["Product title", "heading text-[21px]", "Cormorant Garamond 400 · 21px"],
  ["Body", "body-copy", "Inter 400 · 15px · 1.75"],
  ["Label / Nav", "eyebrow", "Inter 500 · 11px · 0.2em · Uppercase"],
];

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-14">
      <h2 className="eyebrow mb-10 text-muted">{title}</h2>
      {children}
    </section>
  );
}

export function DesignSystem() {
  const [qty, setQty] = useState(1);
  const [pill, setPill] = useState("Natural Silver");
  return (
    <>
      <PageIntro eyebrow="Developer Handoff" title="Design System">
        Tokens, typography, components and states used across the Argent Lune storefront. Tokens are
        defined in <code className="text-ink">src/index.css</code> and map directly to Shopify theme
        settings.
      </PageIntro>
      <div className="container-lune pb-24">
        <Block title="Colour">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {colors.map(([n, v, hex, use]) => (
              <div key={n}>
                <div className="aspect-square border border-line" style={{ background: hex }} />
                <p className="mt-3 text-[14px]">{n}</p>
                <p className="text-[12px] text-muted">{hex}</p>
                <p className="text-[11px] text-muted">{v}</p>
                <p className="mt-1 text-[12px] text-muted">{use}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Typography">
          <div className="divide-y divide-line">
            {type.map(([n, cls, spec]) => (
              <div
                key={n}
                className="grid items-baseline gap-4 py-6 md:grid-cols-[200px_1fr_280px]"
              >
                <p className="text-[13px] text-muted">{n}</p>
                <p className={cls}>Where Silver Takes Form</p>
                <p className="text-[12px] text-muted">{spec}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block title="Buttons">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primary</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary">Secondary</Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <TextLink to="/design-system">Text Link</TextLink>
            </div>
            <div className="flex flex-wrap items-center gap-4 bg-ink p-6 md:col-span-2">
              <Button variant="light">Light</Button>
              <Button variant="outline-light">Outline Light</Button>
            </div>
          </div>
          <p className="mt-6 text-[12px] text-muted">
            Hover: darkens / inverts · Active: scales to 98.5% · Focus: 1px ink outline, 3px offset.
          </p>
        </Block>

        <Block title="Form Elements">
          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Default" htmlFor="ds-1">
              <input id="ds-1" className="field-input" placeholder="Placeholder" />
            </Field>
            <Field label="Error" htmlFor="ds-2" error="Please enter a valid email address.">
              <input id="ds-2" className="field-input" defaultValue="name@" aria-invalid />
            </Field>
            <Field label="Disabled" htmlFor="ds-3">
              <input id="ds-3" className="field-input" disabled defaultValue="Unavailable" />
            </Field>
            <Field label="Select" htmlFor="ds-4">
              <select id="ds-4" className="field-input">
                <option>Please select</option>
              </select>
            </Field>
            <div>
              <span className="field-label">Quantity</span>
              <QuantitySelector value={qty} onChange={setQty} max={5} />
            </div>
            <div>
              <span className="field-label">Placeholder content</span>
              <Placeholder>To be confirmed</Placeholder>
            </div>
          </div>
        </Block>

        <Block title="Variant Selectors & Notices">
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {["Natural Silver", "Heat-Coloured"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-pressed={pill === v}
                    onClick={() => setPill(v)}
                    className={cx(
                      "flex min-h-11 cursor-pointer items-center gap-2 border px-5 text-[13px]",
                      pill === v
                        ? "border-ink bg-ink text-ivory"
                        : "border-line bg-white hover:border-ink",
                    )}
                  >
                    {v === "Heat-Coloured" ? <FlameIcon size={14} /> : null}
                    {v}
                  </button>
                ))}
                <button
                  type="button"
                  disabled
                  className="min-h-11 border border-line bg-white px-5 text-[13px] text-taupe line-through"
                >
                  Unavailable
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["Lake Blue", "#7fa6b4"],
                  ["Citrine Yellow", "#c9c24a"],
                  ["Forest Green", "#1f6b52"],
                ].map(([n, c], i) => (
                  <span
                    key={n}
                    className={cx(
                      "flex min-h-11 items-center gap-2.5 border py-2 pl-2 pr-4 text-[13px]",
                      i === 0 ? "border-ink bg-white" : "border-line",
                    )}
                  >
                    <span
                      className="h-6 w-6 rounded-full ring-1 ring-black/10"
                      style={{ background: c }}
                    />
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div>
              {pill === "Heat-Coloured" ? (
                <div className="animate-drop border border-taupe bg-stone px-5 py-4">
                  <p className="eyebrow flex items-center gap-2">
                    <FlameIcon size={16} /> Colour Finish Notice
                  </p>
                  <p className="mt-2 text-[13px] text-muted">
                    Shown directly above Add to Bag only while a heat-coloured variant is selected.
                  </p>
                </div>
              ) : (
                <p className="text-[13px] text-muted">
                  Select “Heat-Coloured” to preview the conditional Colour Finish Notice.
                </p>
              )}
            </div>
          </div>
        </Block>

        <Block title="Stock Status">
          <div className="flex flex-wrap gap-8">
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
        </Block>

        <Block title="Product Cards">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[products[0], products[1], products[3], products[11]].map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </Block>

        <Block title="Accordion">
          <div className="max-w-xl border-t border-line">
            <Accordion title="Material & Details" defaultOpen>
              Accordion content uses body copy at 15px.
            </Accordion>
            <Accordion title="Care">Collapsed by default.</Accordion>
          </div>
        </Block>

        <Block title="Breakpoints & Grid">
          <ul className="grid gap-4 text-[14px] md:grid-cols-3">
            {[
              ["Mobile", "< 768px", "20px margins · 2-col product grid · drawer navigation"],
              ["Tablet", "768–1023px", "40px margins · 3-col product grid · drawer navigation"],
              [
                "Desktop",
                "≥ 1024px",
                "64px margins (≥1280) · 4-col product grid · mega menu · 1520px max width",
              ],
            ].map(([n, r, d]) => (
              <li key={n} className="border border-line bg-white p-6">
                <Eyebrow>{n}</Eyebrow>
                <p className="heading mt-3 text-2xl">{r}</p>
                <p className="mt-2 text-[13px] text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </Block>
      </div>
    </>
  );
}
