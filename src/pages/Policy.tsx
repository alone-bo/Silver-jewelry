import { Placeholder, PageIntro, TextLink } from "../components/ui";

type Section = { title: string; body?: string; placeholder?: string };
type PolicyDef = {
  eyebrow: string;
  title: string;
  intro?: string;
  sections: Section[];
  updated?: boolean;
};

export const POLICIES: Record<string, PolicyDef> = {
  shipping: {
    eyebrow: "Client Care",
    title: "Shipping & Delivery",
    intro: "Every piece is carefully inspected and packed before it leaves us.",
    sections: [
      {
        title: "UK Delivery",
        placeholder: "UK delivery services, costs and estimated timings to be confirmed",
      },
      {
        title: "International Delivery",
        placeholder: "International destinations, costs, duties and taxes to be confirmed",
      },
      {
        title: "Processing & Dispatch",
        placeholder: "Processing times for in-stock pieces to be confirmed",
      },
      {
        title: "Made-to-Order & Objects",
        body: "Some handmade pieces and silver objects have individual production and dispatch times, shown on each product page.",
        placeholder: "Production lead times to be confirmed per product",
      },
      {
        title: "Tracking",
        body: "Once your order has been dispatched, you will receive a shipping confirmation email with tracking details where available.",
      },
      { title: "Packaging", placeholder: "Packaging details to be confirmed" },
    ],
  },
  returns: {
    eyebrow: "Client Care",
    title: "Returns & Refunds",
    sections: [
      { title: "Returns Window", placeholder: "Returns window and eligibility to be confirmed" },
      { title: "Condition of Returns", placeholder: "Condition requirements to be confirmed" },
      {
        title: "Non-Returnable Items",
        body: "Bespoke and personalised pieces are governed by our Bespoke Terms.",
        placeholder: "Full list to be confirmed",
      },
      { title: "How to Return", placeholder: "Returns process and address to be confirmed" },
      { title: "Refunds", placeholder: "Refund method and timescales to be confirmed" },
      {
        title: "Faulty Items",
        body: "Your statutory rights under UK consumer law are not affected.",
        placeholder: "Faulty item process to be confirmed",
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    updated: true,
    sections: [
      {
        title: "Who We Are",
        placeholder: "ARGENT LUNE LIMITED company details and registered address to be confirmed",
      },
      { title: "Information We Collect", placeholder: "To be confirmed" },
      { title: "How We Use Your Information", placeholder: "To be confirmed" },
      { title: "Cookies", placeholder: "To be confirmed" },
      { title: "Sharing Your Information", placeholder: "To be confirmed" },
      { title: "Your Rights", placeholder: "UK GDPR rights statement to be confirmed" },
      { title: "Contact", placeholder: "Data protection contact to be confirmed" },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    updated: true,
    sections: [
      { title: "About These Terms", placeholder: "To be confirmed" },
      { title: "Orders & Contract", placeholder: "To be confirmed" },
      {
        title: "Pricing & Payment",
        body: "Prices are displayed in GBP.",
        placeholder: "Further terms to be confirmed",
      },
      { title: "Delivery", placeholder: "To be confirmed" },
      { title: "Returns & Cancellation", placeholder: "To be confirmed" },
      { title: "Handmade Variation", placeholder: "To be confirmed" },
      { title: "Liability", placeholder: "To be confirmed" },
      { title: "Governing Law", placeholder: "To be confirmed" },
    ],
  },
  "bespoke-terms": {
    eyebrow: "Legal",
    title: "Bespoke Terms",
    intro:
      "Bespoke enquiries are subject to feasibility, material availability, pricing and production time confirmation. Submitting an enquiry does not constitute an order.",
    updated: true,
    sections: [
      {
        title: "Enquiries",
        body: "Submitting an enquiry does not constitute an order or create any obligation on either party.",
      },
      { title: "Proposals & Quotations", placeholder: "To be confirmed" },
      { title: "Deposits & Payment", placeholder: "To be confirmed" },
      { title: "Design Approval", placeholder: "To be confirmed" },
      { title: "Production Time", placeholder: "To be confirmed" },
      { title: "Cancellations & Returns", placeholder: "To be confirmed" },
      { title: "Intellectual Property", placeholder: "To be confirmed" },
    ],
  },
};

export function PolicyPage({ handle }: { handle: string }) {
  const p = POLICIES[handle];
  if (!p) return null;
  return (
    <>
      <PageIntro eyebrow={p.eyebrow} title={p.title}>
        {p.intro}
      </PageIntro>
      <div className="container-lune grid gap-12 pb-24 md:pb-32 lg:grid-cols-12">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-[120px] space-y-3 text-[14px] text-muted">
            {p.sections.map((s, i) => (
              <li key={s.title}>
                <a
                  href={`#s-${i}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`s-${i}`)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="hover:text-deep"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="max-w-3xl lg:col-span-8 lg:col-start-5">
          {p.updated ? (
            <p className="mb-10 text-[13px] text-muted">
              Last updated: <Placeholder>Date to be confirmed</Placeholder>
            </p>
          ) : null}
          <div className="divide-y divide-line border-y border-line">
            {p.sections.map((s, i) => (
              <section key={s.title} id={`s-${i}`} className="scroll-mt-32 py-9">
                <h2 className="heading text-2xl md:text-3xl">
                  <span className="mr-4 font-serif text-lg italic text-taupe">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                {s.body ? <p className="body-copy mt-4">{s.body}</p> : null}
                {s.placeholder ? (
                  <p className="mt-4">
                    <Placeholder>{s.placeholder}</Placeholder>
                  </p>
                ) : null}
              </section>
            ))}
          </div>
          <div className="mt-12">
            <p className="body-copy">Questions about this policy?</p>
            <TextLink to="/contact" className="mt-4">
              Contact Us
            </TextLink>
          </div>
        </div>
      </div>
    </>
  );
}
