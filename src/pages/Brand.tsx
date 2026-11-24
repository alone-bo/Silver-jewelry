import { useEffect, useState, type FormEvent } from "react";
import { IMG } from "../data/images";
import dealersNotice from "@/assets/images/hallmark-dealers-notice.webp";
import dealersNoticeFull from "@/assets/images/hallmark-dealers-notice.png";
import {
  Accordion,
  Button,
  ButtonLink,
  Eyebrow,
  Field,
  Img,
  PageIntro,
  Placeholder,
  Reveal,
  TextLink,
  isEmail,
} from "../components/ui";
import { CheckIcon, CloseIcon, DocIcon, ExternalIcon } from "../components/Icons";
import { ImageUpload, type UploadedImage } from "../components/ImageUpload";
import { Link, useRoute } from "../lib/router";
import { cx } from "../lib/format";

/* ================= Care Guide ================= */
const care = [
  {
    id: "everyday",
    title: "Everyday Care",
    points: [
      "Put your jewellery on last — after perfume, lotions and hair products.",
      "Remove pieces before swimming, bathing, exercising or cleaning.",
      "Wipe gently with a soft, dry cloth after wearing to remove oils and moisture.",
      "Wearing silver regularly helps to slow tarnishing.",
    ],
  },
  {
    id: "storage",
    title: "Storage",
    points: [
      "Store each piece separately in its pouch or box to prevent scratches.",
      "Keep silver in a cool, dry place, away from humidity and direct sunlight.",
      "Anti-tarnish strips in your jewellery box can help absorb moisture.",
      "Fasten chains before storing to prevent tangling.",
    ],
  },
  {
    id: "tarnish",
    title: "Natural Tarnishing",
    points: [
      "Silver naturally reacts with sulphur in the air, gradually darkening over time. This is normal and not a defect.",
      "Light tarnish can usually be removed with a silver polishing cloth.",
      "Avoid abrasive pastes or dips on textured, oxidised or coloured surfaces.",
      "Some prefer the softened patina that develops with age — there is no single “correct” finish.",
    ],
  },
  {
    id: "heat",
    title: "Heat-Coloured Silver",
    points: [
      "Heat-coloured finishes are surface effects created by controlled heating. Each piece’s colour is unique.",
      "Do not use polishing cloths, silver dips or ultrasonic cleaners on heat-coloured areas — they may remove the colour.",
      "Wipe gently with a soft, dry cloth only.",
      "The colour may gradually soften or change with wear, friction and exposure to moisture.",
    ],
  },
  {
    id: "enamel",
    title: "Enamel, Pearls & Gemstones",
    points: [
      "Enamel can chip if knocked — remove pieces before activities where they may be struck.",
      "Pearls are soft and porous: keep them away from perfume, cosmetics and water, and wipe after wear.",
      "Clean gemstones and enamel with a soft, slightly damp cloth, then dry thoroughly.",
      "Never use chemical dips or ultrasonic cleaners on enamel, pearls or gemstones.",
    ],
  },
  {
    id: "objects",
    title: "Silver Objects",
    points: [
      "Hand wash in warm water with a mild, non-abrasive detergent; rinse and dry immediately with a soft cloth.",
      "Do not place silver objects in the dishwasher or microwave.",
      "Avoid leaving acidic or salty contents in silver vessels for long periods.",
      "Polish occasionally with a silver cloth to maintain lustre; textured surfaces may be left to develop natural patina.",
    ],
  },
];

export function CareGuide() {
  return (
    <>
      <PageIntro eyebrow="Client Care" title="Care Guide">
        Silver is a living material. With a little attention, your pieces will remain beautiful —
        and grow more personal — for many years.
      </PageIntro>
      <div className="container-lune grid gap-12 pb-24 md:pb-32 lg:grid-cols-12">
        <nav aria-label="Care guide sections" className="lg:col-span-3">
          <ul className="flex gap-4 overflow-x-auto border-b border-line pb-4 lg:sticky lg:top-[120px] lg:flex-col lg:gap-3 lg:border-0">
            {care.map((c) => (
              <li key={c.id} className="shrink-0">
                <a
                  href={`#care-${c.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`care-${c.id}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-[14px] text-muted hover:text-deep"
                >
                  {c.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-16 lg:col-span-8 lg:col-start-5">
          {care.map((c, i) => (
            <section
              key={c.id}
              id={`care-${c.id}`}
              className="scroll-mt-32 border-t border-line pt-10"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-serif text-xl italic text-taupe">0{i + 1}</span>
                <h2 className="display text-4xl md:text-5xl">{c.title}</h2>
              </div>
              {c.id === "heat" ? (
                <div className="mt-6 border border-taupe bg-stone px-5 py-4 text-[14px] text-ink">
                  Heat-coloured pieces require gentler care than natural silver. Please read before
                  cleaning.
                </div>
              ) : null}
              <ul className="mt-8 grid gap-5 md:grid-cols-2">
                {c.points.map((p) => (
                  <li key={p} className="body-copy border-l border-line pl-5 text-[15px]">
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <div className="border-t border-line pt-10">
            <p className="body-copy">Unsure how to care for a particular piece?</p>
            <TextLink to="/contact" className="mt-4">
              Contact Us
            </TextLink>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= FAQ ================= */
const faqs: { group: string; items: [string, React.ReactNode][] }[] = [
  {
    group: "Orders & Payment",
    items: [
      ["Which currency are prices shown in?", "All prices are shown in British Pounds (GBP)."],
      [
        "Which payment methods do you accept?",
        <Placeholder key="p">Accepted payment methods to be confirmed</Placeholder>,
      ],
      [
        "Can I change or cancel my order?",
        <>
          Please contact us as soon as possible.{" "}
          <Placeholder>Order amendment and cancellation policy to be confirmed</Placeholder>
        </>,
      ],
    ],
  },
  {
    group: "Shipping & Returns",
    items: [
      [
        "Where do you deliver and how long does it take?",
        <>
          Delivery destinations, costs and timings are shown at checkout and on our{" "}
          <Link to="/shipping" className="text-ink underline underline-offset-4">
            Shipping
          </Link>{" "}
          page.
        </>,
      ],
      [
        "Can I return a piece?",
        <>
          Please see our{" "}
          <Link to="/returns" className="text-ink underline underline-offset-4">
            Returns & Refunds
          </Link>{" "}
          page for full details. Bespoke pieces are covered by our Bespoke Terms.
        </>,
      ],
    ],
  },
  {
    group: "Materials & Care",
    items: [
      [
        "Why does my silver look darker over time?",
        "Silver naturally tarnishes as it reacts with the air. This is normal. Light tarnish can usually be removed with a silver polishing cloth — except on heat-coloured finishes, which should only be wiped with a soft dry cloth.",
      ],
      [
        "What is heat-coloured silver?",
        "Heat-coloured silver gains subtle surface tones through controlled heating. Each piece is unique, so its colour will differ from product images, and the finish may change gradually with wear.",
      ],
      [
        "Why does my piece look slightly different from the photographs?",
        "Our pieces are made and finished by hand. Subtle variations in form, texture and finish are part of their character.",
      ],
      [
        "Are your objects hallmarked?",
        <>
          Please see{" "}
          <Link to="/hallmarking" className="text-ink underline underline-offset-4">
            UK Hallmarking for Objects
          </Link>{" "}
          and the hallmarking status listed on each object’s product page.
        </>,
      ],
    ],
  },
  {
    group: "Bespoke",
    items: [
      [
        "How do I start a bespoke commission?",
        <>
          Submit an enquiry through our{" "}
          <Link to="/bespoke" className="text-ink underline underline-offset-4">
            Bespoke Silver Objects
          </Link>{" "}
          page. We will review feasibility, material availability, pricing and production time
          before confirming anything.
        </>,
      ],
      [
        "Does submitting an enquiry commit me to an order?",
        "No. Submitting an enquiry does not constitute an order.",
      ],
    ],
  },
];

export function FAQ() {
  return (
    <>
      <PageIntro eyebrow="Client Care" title="Frequently Asked Questions" />
      <div className="container-lune grid gap-14 pb-24 md:pb-32 lg:grid-cols-12">
        <div className="space-y-16 lg:col-span-8">
          {faqs.map((g) => (
            <section key={g.group} aria-labelledby={`faq-${g.group}`}>
              <h2 id={`faq-${g.group}`} className="eyebrow mb-2 text-muted">
                {g.group}
              </h2>
              <div className="border-t border-line">
                {g.items.map(([q, a]) => (
                  <Accordion key={q} title={q} size="lg">
                    {a}
                  </Accordion>
                ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="lg:col-span-3 lg:col-start-10">
          <div className="bg-stone p-8 lg:sticky lg:top-[120px]">
            <p className="heading text-2xl">Still have a question?</p>
            <p className="body-copy mt-3 text-[14px]">
              Our client care team will be happy to help.
            </p>
            <ButtonLink to="/contact" className="mt-6 w-full">
              Contact Us
            </ButtonLink>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ================= Contact ================= */
export function Contact() {
  const { query } = useRoute();
  const piece = query.get("piece");
  const sku = query.get("sku");
  const [f, setF] = useState({
    name: "",
    email: "",
    order: "",
    subject: piece ? "Product information" : "General enquiry",
    message: piece
      ? `I’d like advice on sizing for ${piece}${sku ? ` (SKU: ${sku})` : ""}. My usual ring size is —`
      : "",
    reference: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadError, setUploadError] = useState("");
  const uploading = images.some((i) => i.progress < 100);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    const er: Record<string, string> = {};
    if (!f.name.trim()) er.name = "Please enter your name.";
    if (!isEmail(f.email)) er.email = "Please enter a valid email address.";
    if (f.message.trim().length < 10) er.message = "Please enter a message.";
    if (f.reference.trim() && !isHttpUrl(f.reference.trim()))
      er.reference = "Please enter a full link, starting with https://";
    setErrors(er);
    if (Object.keys(er).length) return;
    setState("loading");
    await new Promise((r) => setTimeout(r, 1100));
    setState("done");
  };
  return (
    <>
      <PageIntro eyebrow="Client Care" title="Contact">
        For questions about an order, a piece, or a bespoke idea, please write to us below.
      </PageIntro>
      <div className="container-lune grid gap-14 pb-24 md:pb-32 lg:grid-cols-12">
        <aside className="space-y-10 lg:col-span-4">
          <div>
            <p className="eyebrow mb-3">Customer Service</p>
            <p className="text-[15px]">
              <Placeholder>customer-service@[domain]</Placeholder>
            </p>
          </div>
          <div>
            <p className="eyebrow mb-3">Response Times</p>
            <Placeholder>To be confirmed</Placeholder>
          </div>
          <div>
            <p className="eyebrow mb-3">Bespoke Commissions</p>
            <p className="body-copy text-[14px]">
              For commission enquiries, please use our dedicated form.
            </p>
            <TextLink to="/bespoke" className="mt-3">
              Bespoke Enquiry
            </TextLink>
          </div>
          <Img
            src={IMG.handsBench}
            alt="Hands wearing a silver ring at the bench"
            className="hidden aspect-[4/3] lg:block"
          />
        </aside>
        <div className="lg:col-span-7 lg:col-start-6">
          {state === "done" ? (
            <div className="animate-fade-in border border-line bg-white p-10" role="status">
              <CheckIcon size={24} />
              <h2 className="display mt-6 text-4xl">Thank you for your message.</h2>
              <p className="body-copy mt-4">
                We’ve received your note and will reply to {f.email}.
              </p>
              {images.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {images.map((img) => (
                    <img
                      key={img.id}
                      src={img.url}
                      alt={img.file.name}
                      className="h-16 w-16 object-cover"
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-7 md:grid-cols-2">
              <Field label="Name" htmlFor="c-name" error={errors.name}>
                <input
                  id="c-name"
                  className="field-input"
                  value={f.name}
                  onChange={(e) => setF({ ...f, name: e.target.value })}
                  aria-invalid={!!errors.name}
                />
              </Field>
              <Field label="Email Address" htmlFor="c-email" error={errors.email}>
                <input
                  id="c-email"
                  type="email"
                  className="field-input"
                  value={f.email}
                  onChange={(e) => setF({ ...f, email: e.target.value })}
                  aria-invalid={!!errors.email}
                />
              </Field>
              <Field label="Subject" htmlFor="c-subject">
                <select
                  id="c-subject"
                  className="field-input"
                  value={f.subject}
                  onChange={(e) => setF({ ...f, subject: e.target.value })}
                >
                  <option>General enquiry</option>
                  <option>An existing order</option>
                  <option>Product information</option>
                  <option>Care & repairs</option>
                  <option>Press & collaborations</option>
                </select>
              </Field>
              <Field label="Order Number" htmlFor="c-order" optional>
                <input
                  id="c-order"
                  className="field-input"
                  value={f.order}
                  onChange={(e) => setF({ ...f, order: e.target.value })}
                  placeholder="e.g. AL-123456"
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Message" htmlFor="c-message" error={errors.message}>
                  <textarea
                    id="c-message"
                    rows={7}
                    className="field-input resize-y"
                    value={f.message}
                    onChange={(e) => setF({ ...f, message: e.target.value })}
                    aria-invalid={!!errors.message}
                  />
                </Field>
              </div>
              <div className="md:col-span-2">
                <span className="field-label">
                  Reference Image
                  <span className="ml-2 normal-case tracking-normal text-muted">(optional)</span>
                </span>
                <p className="-mt-1 mb-3 text-[13px] text-muted">
                  Share a photo of your piece or an image that shows what you mean.
                </p>
                <ImageUpload
                  id="c-reference-upload"
                  images={images}
                  onChange={setImages}
                  onError={setUploadError}
                />
                {uploadError ? (
                  <p className="mt-2 text-[13px] text-alert" role="alert">
                    {uploadError}
                  </p>
                ) : null}
                <div className="mt-5">
                  <label htmlFor="c-reference" className="mb-2 block text-[12px] text-muted">
                    Or paste an image link
                  </label>
                  <input
                    id="c-reference"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    className="field-input"
                    value={f.reference}
                    onChange={(e) => {
                      setF({ ...f, reference: e.target.value });
                      if (errors.reference) setErrors({ ...errors, reference: "" });
                    }}
                    placeholder="https://"
                    aria-invalid={!!errors.reference}
                  />
                  {errors.reference ? (
                    <p className="mt-2 text-[13px] text-alert" role="alert">
                      {errors.reference}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="md:col-span-2">
                <Button type="submit" loading={state === "loading"} disabled={uploading}>
                  {uploading ? "Uploading Image" : "Send Message"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

/* ================= UK Hallmarking ================= */
export function Hallmarking() {
  const [noticeOpen, setNoticeOpen] = useState(false);

  useEffect(() => {
    if (!noticeOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setNoticeOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [noticeOpen]);

  return (
    <>
      <PageIntro eyebrow="Client Care" title="UK Hallmarking for Objects">
        A hallmark is an official mark applied by an independent UK Assay Office, guaranteeing that
        a precious-metal article meets the legal standard of fineness.
      </PageIntro>
      <div className="container-lune grid gap-14 pb-24 md:pb-32 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <section>
            <h2 className="display text-3xl md:text-4xl">What a UK hallmark shows</h2>
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {[
                ["Sponsor’s mark", "Identifies the maker or sponsor who submitted the article."],
                [
                  "Fineness mark",
                  "Shows the precious-metal content, e.g. 925 for sterling silver or 999 for fine silver.",
                ],
                [
                  "Assay Office mark",
                  "Identifies which UK Assay Office tested and marked the article.",
                ],
                [
                  "Date letter (optional)",
                  "Indicates the year in which the article was hallmarked.",
                ],
              ].map(([t, d]) => (
                <li key={t} className="grid gap-2 py-5 md:grid-cols-[200px_1fr]">
                  <span className="text-[15px]">{t}</span>
                  <span className="body-copy text-[14px]">{d}</span>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="display text-3xl md:text-4xl">Argent Lune objects</h2>
            <p className="body-copy mt-5">
              Each silver object collection will be submitted to a UK Assay Office for independent
              testing and hallmarking before dispatch to the customer. A hallmark provides
              independent verification of the metal’s fineness.
            </p>
            <p className="body-copy mt-4">
              Please refer to the official British Hallmarking Council Dealer’s Notice in the panel
              below for further information.
            </p>
          </section>
          <section>
            <h2 className="display text-3xl md:text-4xl">Further information</h2>
            <ul className="mt-6 space-y-3">
              {[
                ["The Assay Office London", "https://www.assayofficelondon.co.uk/"],
                [
                  "Assay Office London — hallmarking downloads",
                  "https://www.assayofficelondon.co.uk/downloads",
                ],
                [
                  "British Hallmarking Council",
                  "https://www.gov.uk/government/organisations/british-hallmarking-council",
                ],
              ].map(([t, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noreferrer noopener" className="link-line">
                    {t} <ExternalIcon size={14} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <div className="border border-line bg-white p-5 md:p-6 lg:sticky lg:top-[120px]">
            <DocIcon size={28} />
            <p className="eyebrow mt-5">Official Document</p>
            <h2 className="heading mt-2 text-2xl">Dealers' Notice</h2>
            <button
              type="button"
              onClick={() => setNoticeOpen(true)}
              className="group relative mt-5 block w-full cursor-pointer overflow-hidden border border-line"
              aria-label="Enlarge the Dealers' Notice"
            >
              <img
                src={dealersNotice}
                alt="Official British Hallmarking Council Dealers' Notice: Look for the Hallmark, It's Your Guarantee"
                className="w-full"
              />
              <span className="absolute inset-0 flex items-end justify-center bg-ink/0 p-3 opacity-0 transition group-hover:bg-ink/15 group-hover:opacity-100">
                <span className="bg-ivory px-3 py-1.5 text-[10px] font-medium tracking-[0.16em] uppercase">
                  Click to enlarge
                </span>
              </span>
            </button>
            <Button full className="mt-4" onClick={() => setNoticeOpen(true)}>
              View Dealers' Notice
            </Button>
            <a
              href={dealersNoticeFull}
              target="_blank"
              rel="noreferrer noopener"
              className="link-line mt-4"
            >
              Open full size <ExternalIcon size={12} />
            </a>
            <p className="mt-3 text-[12px] text-muted">
              Click the notice to enlarge the small print. The official file opens in a new tab for
              closer reading on mobile.
            </p>
          </div>
        </aside>
      </div>

      {noticeOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Dealers' Notice"
        >
          <div
            className="absolute inset-0 animate-fade-in bg-ink/60"
            onClick={() => setNoticeOpen(false)}
          />
          <div className="relative flex max-h-[94vh] w-full max-w-6xl flex-col bg-ivory shadow-xl">
            <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
              <p className="eyebrow">Dealers' Notice</p>
              <div className="flex items-center gap-4">
                <a
                  href={dealersNoticeFull}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[11px] tracking-[0.14em] uppercase underline underline-offset-4"
                >
                  Open full size
                </a>
                <button
                  type="button"
                  onClick={() => setNoticeOpen(false)}
                  aria-label="Close Dealers' Notice"
                  className="-mr-1 cursor-pointer p-1"
                >
                  <CloseIcon size={20} />
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-stone p-2 sm:p-4">
              <img
                src={dealersNoticeFull}
                alt="Official British Hallmarking Council Dealers' Notice: Look for the Hallmark, It's Your Guarantee"
                className="mx-auto block w-[900px] max-w-none sm:w-full sm:max-w-full"
              />
            </div>
            <p className="border-t border-line px-4 py-2 text-[11px] text-muted sm:hidden">
              Scroll sideways and zoom to read the full notice.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

function isHttpUrl(value: string) {
  try {
    const u = new URL(value);
    return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}
