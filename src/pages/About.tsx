import { IMG } from "../data/images";
import { collections, getProduct } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import { ButtonLink, Eyebrow, Img, Placeholder, Reveal, TextLink } from "../components/ui";
import { SymbolBar } from "../components/SymbolBar";
import { Link } from "../lib/router";
import { cx } from "../lib/format";

/* Original About copy — preserved and regrouped. */
const COPY = {
  positioning:
    "A quietly contemporary silver jewellery and objects brand, informed by traditional craftsmanship, organic forms, expressive metal textures and the beauty of imperfection.",
  story:
    "Argent Lune began with a fascination for the way silver responds to the hand. We look for forms found in nature, surfaces left honest by the tool, and the small irregularities that make a piece unmistakably made. Silver changes with time and touch — and we believe that is where its beauty lies.",
  time: "Silver deepens with time and wear. A piece that is worn and handled develops a character that cannot be made — only lived. We see this not as decline, but as continuation.",
  material:
    "Silver is soft, responsive and honest. It records every strike of the hammer and every pass of the hand. We let those traces remain, so each surface carries its own expression.",
  nature:
    "Leaves, branches, the wing of a butterfly. We look to nature not to copy it, but to borrow its rhythm — the way a line bends, the way a surface gathers light.",
  pillars: [
    ["Craftsmanship", "Traditional silversmithing techniques, practised by skilled hands."],
    ["Character", "Organic forms and expressive textures, never mass-produced."],
    ["Care", "Pieces made to be worn, used and kept for a long time."],
  ],
};

const BEST_SELLERS = [
  "botanica-branch-pendant",
  "papillon-pendant-necklace",
  "botanica-twig-earrings",
  "papillon-chain-bracelet",
];

const TEAM_PHOTOS = [
  {
    src: IMG.benchHands,
    alt: "Hands assembling a piece of jewellery at the bench",
    cls: "col-span-4 row-span-2",
  },
  { src: IMG.sketchingClose, alt: "Designing a new piece on paper", cls: "col-span-2 row-span-1" },
  { src: IMG.hammer, alt: "Hammer resting on a steel stake", cls: "col-span-2 row-span-1" },
  {
    src: IMG.artisanLamp,
    alt: "Close, careful work under a magnifying lamp",
    cls: "col-span-3 row-span-2",
  },
  { src: IMG.craftsmanBench, alt: "The workbench, mid-making", cls: "col-span-3 row-span-2" },
];

export function About() {
  const best = BEST_SELLERS.map((h) => getProduct(h)!).filter(Boolean);
  const featured = collections.map((c) => ({
    ...c,
    to: c.handle === "objects" ? "/objects" : `/collections/${c.handle}`,
  }));

  return (
    <>
      {/* 1 — Hero */}
      <section className="relative -mt-24 h-[92svh] min-h-[620px] overflow-hidden bg-ink text-ivory md:-mt-28">
        <Img
          src={IMG.papillonModel}
          alt="Model wearing Argent Lune silver jewellery in warm natural light"
          eager
          position="center 38%"
          className="absolute inset-0 h-full bg-ink"
          imgClassName="sepia-[.18] saturate-[.9]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,40,39,0.55)_0%,rgba(37,40,39,0.4)_45%,rgba(37,40,39,0.7)_100%)]" />
        <div className="container-lune relative flex h-full flex-col items-center justify-center text-center">
          <Eyebrow className="mb-6 text-ivory/75">About Argent Lune</Eyebrow>
          <h1 className="display max-w-5xl text-6xl md:text-8xl xl:text-[116px]">
            Where Silver <em>Takes Form.</em>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-ivory/85 md:text-[18px]">
            {COPY.positioning}
          </p>
        </div>
      </section>

      {/* 2 — Our Story */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <div className="relative">
            <Img
              src={IMG.portraitWarm}
              alt="Portrait of the brand representative wearing silver jewellery"
              className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[720px]"
              position="center 30%"
            />
            <span className="absolute bottom-4 left-4 bg-ivory/90 px-3 py-1.5 text-[11px] italic text-muted">
              Founder portrait to be supplied
            </span>
          </div>
          <Reveal className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 xl:px-20">
            <Eyebrow className="mb-6">Our Story</Eyebrow>
            <h2 className="display text-5xl md:text-6xl">Our Story</h2>
            <div className="body-copy mt-8 max-w-[34rem] space-y-5 text-[16px]">
              <p>{COPY.story}</p>
              <p>{COPY.time}</p>
            </div>
            <p className="mt-8 text-[13px] text-muted">
              <Placeholder>Founder name and role to be confirmed</Placeholder>
            </p>
            <TextLink to="/craft" className="mt-10">
              Discover Our Craft
            </TextLink>
          </Reveal>
        </div>
      </section>

      {/* 3 — Our Team */}
      <section className="border-t border-line">
        <div className="container-lune grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col justify-center">
            <Eyebrow className="mb-6">Behind the Work</Eyebrow>
            <h2 className="display text-5xl md:text-6xl">The Argent Lune Team</h2>
            <p className="mt-8">
              <Placeholder>Team introduction to be confirmed</Placeholder>
            </p>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {COPY.pillars.map(([t, d]) => (
                <li key={t} className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-6">
                  <span className="heading text-2xl">{t}</span>
                  <span className="body-copy text-[15px]">{d}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid auto-rows-[110px] grid-cols-6 gap-3 sm:auto-rows-[150px] md:gap-4 lg:auto-rows-[130px] xl:auto-rows-[150px]">
            {TEAM_PHOTOS.map((p) => (
              <Img key={p.src} src={p.src} alt={p.alt} className={cx("h-full", p.cls)} />
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Featured Collections */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <Img
          src={IMG.texture}
          alt=""
          className="absolute inset-0 h-full bg-ink opacity-[0.12] mix-blend-luminosity"
        />
        <div className="relative container-lune py-20 md:py-28">
          <div className="text-center">
            <Eyebrow className="text-ivory/60">Featured Collections</Eyebrow>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
            {featured.map((c, i) => (
              <li key={c.handle} className={cx(i === 4 && "col-span-2 sm:col-span-1")}>
                <Link to={c.to} className="group block">
                  <Img
                    src={c.card}
                    alt={c.bannerAlt}
                    className={cx("aspect-[3/4] bg-ink", i === 4 && "max-sm:aspect-[16/10]")}
                    imgClassName="img-zoom grayscale-[25%]"
                  />
                  <p className="mt-4 text-center font-serif text-xl tracking-wide text-ivory/90 group-hover:text-ivory">
                    {c.title}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto mt-14 max-w-xl text-center">
            <p className="text-[16px] leading-relaxed text-ivory/75">
              From delicate leaves to sculptural textures, discover pieces made to be noticed in the
              details.
            </p>
            <ButtonLink to="/shop" variant="outline-light" className="mt-8">
              Explore the Collection
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 5 — Charity & Donation (structure only; figures to be supplied) */}
      <section className="bg-stone">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <Img
            src={IMG.woodland}
            alt="Sunlight falling through a quiet woodland"
            className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[620px]"
          />
          <Reveal className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 xl:px-20">
            <Eyebrow className="mb-6">Charity &amp; Donation</Eyebrow>
            <p className="display text-6xl text-muted md:text-7xl">
              <span className="border-b border-dashed border-taupe">[Amount]</span>
            </p>
            <p className="eyebrow mt-4">Donated to date</p>
            <p className="mt-8">
              <Placeholder>
                Charity partners, giving commitment and verified figures to be confirmed
              </Placeholder>
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8">
              {["[Partner organisations]", "[Projects supported]"].map((s) => (
                <div key={s}>
                  <p className="display text-3xl text-muted">—</p>
                  <p className="mt-1 text-[12px] italic text-muted">{s}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6 — Best Sellers */}
      <section className="container-lune py-20 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-5xl md:text-6xl">Best Sellers</h2>
          <TextLink to="/shop">Shop All</TextLink>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {best.map((p, i) => (
            <Reveal key={p.handle} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-[12px] italic text-muted">
          Best seller selection to be confirmed against sales data.
        </p>
      </section>

      {/* 7 — Craftsmanship & Intentional Design */}
      <section className="border-t border-line bg-ivory">
        <div className="container-lune grid gap-6 py-20 md:grid-cols-2 md:py-28">
          {[
            {
              eyebrow: "Craftsmanship",
              title: "Silver, allowed to speak",
              body: COPY.material,
              img: IMG.handsTool,
              alt: "A silversmith polishing and shaping a ring at the bench",
              cta: { to: "/craft", label: "Discover Our Craft" },
            },
            {
              eyebrow: "Intentional Design",
              title: "Forms borrowed from the natural world",
              body: COPY.nature,
              img: IMG.heroRings,
              alt: "Sculptural silver rings worn close to the face",
              cta: { to: "/jewellery", label: "Explore Jewellery" },
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 100} className="h-full">
              <article className="flex h-full flex-col bg-white">
                <Img
                  src={c.img}
                  alt={c.alt}
                  className="aspect-[4/3]"
                  position={i === 1 ? "center 62%" : undefined}
                />
                <div className="flex flex-1 flex-col p-7 md:p-10">
                  <Eyebrow>{c.eyebrow}</Eyebrow>
                  <h3 className="display mt-4 text-4xl">{c.title}</h3>
                  <p className="body-copy mt-5 flex-1">{c.body}</p>
                  <TextLink to={c.cta.to} className="mt-8 self-start">
                    {c.cta.label}
                  </TextLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 8 — Symbol bar (sits directly above the global footer) */}
      <SymbolBar />
    </>
  );
}
