import { IMG } from "../data/images";
import { collections } from "../data/catalog";
import { ButtonLink, Eyebrow, Img, Reveal, TextLink } from "../components/ui";
import { SymbolBar } from "../components/SymbolBar";
import { Link } from "../lib/router";
import { cx } from "../lib/format";

/* About copy, per the brand guide. */
const COPY = {
  positioning:
    "Argent Lune is a study in silver, shaped by human hands and inspired by the natural world.",
  story: [
    "We are drawn to quiet forms, expressive textures and the beauty of imperfection. Rooted in traditional craftsmanship, our pieces take shape through the skill, patience and considered gestures of the artisans we work with.",
    "Bringing a contemporary perspective to time-honoured techniques, we create jewellery and silver objects that celebrate the character of the material and the subtle traces of making.",
    "Each piece tells a quiet story of silver, time and the human touch.",
  ],
  behind:
    "We work with skilled silversmiths and craftspeople using a combination of traditional and contemporary techniques. Some pieces are shaped by hand, while others combine casting with careful hand-finishing and surface detailing.",
  pillars: [
    ["Craftsmanship", "Traditional silversmithing techniques, practised by skilled hands."],
    ["Character", "Organic forms and expressive textures, never mass-produced."],
    ["Care", "Pieces made to be worn, used and kept for a long time."],
  ],
};

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
  const featured = collections.map((c) => ({
    ...c,
    to: c.handle === "objects" ? "/objects" : `/collections/${c.handle}`,
  }));

  return (
    <>
      {/* 1 — About Argent Lune */}
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
          <h1 className="display max-w-5xl text-6xl md:text-8xl xl:text-[112px]">
            Silver, Shaped <em>by Hand.</em>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-[16px] leading-relaxed text-ivory/85 md:text-[18px]">
            {COPY.positioning}
          </p>
        </div>
      </section>

      {/* 2 — Our Story */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <Img
            src={IMG.handsTool}
            alt="A silversmith shaping and finishing a piece at the bench"
            className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[720px]"
            position="center 40%"
          />
          <Reveal className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 xl:px-20">
            <Eyebrow className="mb-6">Our Story</Eyebrow>
            <h2 className="display text-5xl md:text-6xl">Our Story</h2>
            <div className="body-copy mt-8 max-w-[34rem] space-y-5 text-[16px]">
              {COPY.story.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <TextLink to="/craft" className="mt-10">
              Discover Our Craft
            </TextLink>
          </Reveal>
        </div>
      </section>

      {/* 3 — Behind the Work */}
      <section className="border-t border-line">
        <div className="container-lune grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
          <Reveal className="flex flex-col justify-center">
            <Eyebrow className="mb-6">Behind the Work</Eyebrow>
            <h2 className="display text-5xl md:text-6xl">The Hands Behind Each Piece</h2>
            <p className="body-copy mt-8 max-w-md">{COPY.behind}</p>
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

      <SymbolBar />
    </>
  );
}
