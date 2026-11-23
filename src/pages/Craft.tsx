import type { ReactNode } from "react";
import { IMG } from "../data/images";
import { ButtonLink, Eyebrow, Img, Placeholder, Reveal, TextLink } from "../components/ui";
import { cx } from "../lib/format";
import { SymbolBar } from "../components/SymbolBar";

/* Original process copy — preserved verbatim, regrouped into the new structure. */
const PROCESS = {
  intro:
    "A closer look at the hands, tools and thoughtful processes behind each form — from silver material to finished object.",
  material:
    "Every piece begins with silver in its raw state. Its softness and responsiveness are what make it so expressive under the hand.",
  hammering:
    "Strike by strike, the silver is moved and compressed. Each mark is deliberate; together they create the surface rhythm that defines our work.",
  shaping:
    "Form emerges slowly — turned, tested, returned to the stake. Our silversmiths judge by eye and touch rather than template.",
  polishing:
    "Surfaces are refined by hand, balancing lustre with texture so that the history of the making remains visible.",
  finishing:
    "Final details — edges, clasps, colour finishes — are completed piece by piece before each work is inspected and prepared for its new owner.",
};

type Module = {
  title: string;
  body: ReactNode;
  img: string;
  alt: string;
  imgSide: "left" | "right";
  darkImage?: boolean;
  cta?: { to: string; label: string };
};

const MODULES: Module[] = [
  {
    title: "Sterling Silver Jewelry",
    body: (
      <>
        <p>
          Silver is soft, responsive and honest. It records every strike of the hammer and every
          pass of the hand. We let those traces remain, so each surface carries its own expression.
        </p>
        <p>
          Silver deepens with time and wear. A piece that is worn and handled develops a character
          that cannot be made — only lived.
        </p>
      </>
    ),
    img: IMG.moonPendants,
    alt: "Handcrafted silver pendants with crescent and floral forms laid on stone",
    imgSide: "right",
    cta: { to: "/jewellery", label: "Explore Jewellery" },
  },
  {
    title: "Handcrafted Silver Designs",
    body: (
      <>
        <p>
          Leaves, branches, the wing of a butterfly. We look to nature not to copy it, but to borrow
          its rhythm — the way a line bends, the way a surface gathers light.
        </p>
        <p>
          Every piece is shaped, refined and finished by hand. Small irregularities are welcomed —
          they are what make the piece yours alone.
        </p>
      </>
    ),
    img: IMG.necklaceLinen,
    alt: "Handmade silver necklace resting on natural linen",
    imgSide: "left",
  },
  {
    title: "925 Sterling Silver",
    body: (
      <>
        <p>
          A hallmark is an official mark applied by an independent UK Assay Office, guaranteeing
          that a precious-metal article meets the legal standard of fineness. The fineness mark
          shows the precious-metal content — 925 for sterling silver, or 999 for fine silver.
        </p>
        <p>
          Silver naturally reacts with the air, gradually darkening over time. This is normal and
          not a defect.
        </p>
      </>
    ),
    img: IMG.ringsReflect,
    alt: "Silver rings with organic forms reflected in natural light",
    imgSide: "right",
    cta: { to: "/hallmarking", label: "UK Hallmarking" },
  },
  {
    title: "Silver Craftsmanship & Details",
    body: (
      <>
        <p>Traditional silversmithing techniques, practised by skilled hands.</p>
        <p>
          Shaped and finished by hand. Slight variations in form and surface are part of each
          piece’s character — organic forms and expressive textures, never mass-produced.
        </p>
      </>
    ),
    img: IMG.ornatePendants,
    alt: "Detailed handcrafted silver pendants on a dark background",
    imgSide: "left",
    darkImage: true,
  },
  {
    title: "Natural Gemstones",
    body: (
      <>
        <p>
          Selected pieces pair silver with natural materials — such as the Papillon Pearl Ring,
          balancing a jewel-green butterfly against the soft lustre of a pearl.
        </p>
        <p>
          Clean gemstones and enamel with a soft, slightly damp cloth, then dry thoroughly. Never
          use chemical dips or ultrasonic cleaners on enamel, pearls or gemstones.
        </p>
        <p>
          <Placeholder>Gemstone types and sourcing details to be confirmed</Placeholder>
        </p>
      </>
    ),
    img: IMG.crystals,
    alt: "Natural quartz and calcite crystals on a wooden surface",
    imgSide: "right",
    cta: { to: "/care", label: "Care Guide" },
  },
];

function SplitImage({
  src,
  alt,
  className,
  dark,
}: {
  src: string;
  alt: string;
  className?: string;
  dark?: boolean;
}) {
  return (
    <Img
      src={src}
      alt={alt}
      className={cx(
        "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[560px]",
        dark && "bg-ink",
        className,
      )}
    />
  );
}

export function Craft() {
  return (
    <>
      {/* 1 — Design Philosophy: text left, image right */}
      <section className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center px-5 py-16 md:order-1 md:px-12 md:py-24 xl:px-20">
            <Eyebrow className="mb-6">Our Craft</Eyebrow>
            <h1 className="display text-5xl md:text-6xl xl:text-7xl">
              Designed with Love and Intention
            </h1>
            <div className="body-copy mt-8 max-w-[34rem] space-y-5 text-[16px]">
              <p>{PROCESS.intro}</p>
              <p>{PROCESS.shaping}</p>
            </div>
          </div>
          <SplitImage
            src={IMG.sketching}
            alt="A designer sketching jewellery on paper at a marble table surrounded by tools"
            className="order-1 md:order-2"
          />
        </div>
      </section>

      {/* 2 — Hand-crafted Process: image left, text right */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-2">
          <SplitImage
            src={IMG.craftsmanBench}
            alt="A craftsman concentrating on small pieces at a busy workbench"
          />
          <div className="flex flex-col justify-center px-5 py-16 md:px-12 md:py-24 xl:px-20">
            <Eyebrow className="mb-6">The Process</Eyebrow>
            <h2 className="display text-5xl md:text-6xl">Hand-crafted with Care</h2>
            <ol className="mt-10 max-w-[34rem] divide-y divide-line border-y border-line">
              {[
                ["Hammering", PROCESS.hammering],
                ["Polishing", PROCESS.polishing],
                ["Hand-Finishing", PROCESS.finishing],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[44px_1fr] gap-4 py-6">
                  <span className="font-serif text-xl italic text-taupe">0{i + 1}</span>
                  <div>
                    <h3 className="heading text-2xl">{t}</h3>
                    <p className="body-copy mt-2 text-[15px]">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 3 — Our Materials banner */}
      <section className="bg-ink text-ivory">
        <div className="container-lune py-24 text-center md:py-32">
          <p className="eyebrow text-ivory/60">Our Materials</p>
          <p className="display mx-auto mt-8 max-w-3xl text-3xl leading-snug md:text-5xl md:leading-[1.15]">
            {PROCESS.material}
          </p>
        </div>
      </section>

      {/* 4 — Materials showcase: strict Z-pattern */}
      <section aria-label="Materials" className="bg-ivory">
        <div className="mx-auto max-w-[1440px]">
          {MODULES.map((m, i) => (
            <div
              key={m.title}
              className={cx("grid md:grid-cols-2", i > 0 && "border-t border-line")}
            >
              <SplitImage
                src={m.img}
                alt={m.alt}
                dark={m.darkImage}
                className={m.imgSide === "right" ? "md:order-2" : ""}
              />
              <Reveal
                className={cx(
                  "flex flex-col justify-center px-5 py-16 md:px-12 md:py-20 xl:px-20",
                  m.imgSide === "right" ? "md:order-1" : "",
                )}
              >
                <span className="font-serif text-lg italic text-taupe">0{i + 1}</span>
                <h2 className="display mt-3 text-4xl md:text-5xl">{m.title}</h2>
                <div className="body-copy mt-6 max-w-[32rem] space-y-4 text-[15px]">{m.body}</div>
                {m.cta ? (
                  <TextLink to={m.cta.to} className="mt-8">
                    {m.cta.label}
                  </TextLink>
                ) : null}
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      {/* Original closing copy, retained */}
      <section className="border-t border-line bg-stone">
        <div className="container-lune flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="display text-4xl md:text-5xl">The finished form.</h2>
            <p className="body-copy mt-4">
              Countless hammer strikes become a cup that sits comfortably in the hand — an everyday
              object carrying the quiet evidence of its making.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <ButtonLink to="/objects">Explore Objects</ButtonLink>
            <ButtonLink to="/bespoke" variant="secondary">
              Bespoke Commissions
            </ButtonLink>
          </div>
        </div>
      </section>

      <SymbolBar />
    </>
  );
}
