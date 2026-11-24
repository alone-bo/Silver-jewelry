import { IMG } from "../data/images";
import { getCollection, products } from "../data/catalog";
import { ProductCard } from "../components/ProductCard";
import { ButtonLink, Eyebrow, Img, Reveal, TextLink } from "../components/ui";
import { HeroVideo } from "../components/HeroVideo";
import benchHands from "@/assets/images/silversmith-hammering-ginkgo.jpg";

/** Three jewellery families shown in "Jewellery with a Natural Rhythm" — Papillon is excluded. */
const SERIES = [
  {
    handle: "botanica",
    items: ["botanica-branch-pendant", "botanica-leaf-ring"],
  },
  {
    handle: "materia",
    items: ["materia-molten-ring", "materia-hammered-band"],
  },
  {
    handle: "miniature-silverware",
    items: ["miniature-wine-cup-pendant", "miniature-tumbler-pendant"],
  },
] as const;

export function Home() {
  const series = SERIES.map((s) => ({
    collection: getCollection(s.handle)!,
    items: s.items.map((h) => products.find((p) => p.handle === h)!),
  }));

  return (
    <>
      {/* 1 — Hero: words left, workshop film right */}
      <section className="border-b border-line bg-ivory">
        <div className="container-lune grid items-center gap-9 pb-12 pt-8 md:gap-12 md:pb-16 md:pt-12 lg:grid-cols-12 lg:gap-14 lg:py-16">
          <div className="lg:col-span-6">
            <Eyebrow className="text-deep">The Atelier</Eyebrow>
            <h1 className="display mt-4 text-[46px] leading-[0.98] sm:text-6xl md:text-7xl xl:text-[96px]">
              Silver, shaped
              <br />
              <em className="font-light">by hand.</em>
            </h1>
            <p className="body-copy mt-5 max-w-md text-[16px] md:mt-7 md:text-[17px]">
              Step into a town of silversmiths. Hear the rhythm of silver taking shape — raised by
              hammer, finished at the bench.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 md:mt-9 md:gap-4">
              <ButtonLink to="/shop">Explore the Collection</ButtonLink>
              <ButtonLink to="/craft" variant="secondary">
                Our Craft
              </ButtonLink>
            </div>
            <p className="mt-6 flex items-center gap-3 text-[10px] font-medium tracking-[0.18em] text-muted uppercase md:mt-8">
              <span aria-hidden className="h-px w-8 bg-line" />
              Filmed in the workshop · Sound available
            </p>
          </div>
          <div className="flex items-center justify-center lg:col-span-6 lg:justify-end">
            <HeroVideo className="hero-film" />
          </div>
        </div>
      </section>


      {/* 3 — Jewellery: three series, two pieces each */}
      <section className="border-t border-line bg-ivory py-14 md:py-28">
        <div className="container-lune">
          <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-2 md:items-end md:gap-8">
            <Reveal>
              <Eyebrow className="mb-5 text-deep md:mb-6">Jewellery</Eyebrow>
              <h2 className="display max-w-xl text-5xl md:text-6xl">
                Jewellery with a Natural Rhythm
              </h2>
            </Reveal>
            <Reveal delay={100} className="md:justify-self-end md:text-right">
              <p className="body-copy max-w-md md:ml-auto">
                From delicate leaves to sculptural textures, discover pieces made to be noticed in
                the details.
              </p>
              <TextLink to="/jewellery" className="mt-5 md:mt-6">
                Explore Jewellery
              </TextLink>
            </Reveal>
          </div>

          <div className="divide-y divide-line border-t border-line">
            {series.map(({ collection, items }, i) => (
              <Reveal key={collection.handle}>
                <div className="grid gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-12">
                  <div className="md:col-span-3">
                    <p className="eyebrow text-muted">Series 0{i + 1}</p>
                    <h3 className="heading mt-2 text-3xl md:text-4xl">{collection.title}</h3>
                    <p className="body-copy mt-3 max-w-xs text-[14px]">{collection.description}</p>
                    <TextLink
                      to={`/collections/${collection.handle}`}
                      className="mt-5"
                    >
                      Explore {collection.title}
                    </TextLink>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:col-span-9 md:gap-6">
                    {items.map((p) => (
                      <ProductCard key={p.handle} product={p} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Papillon */}
      <section className="bg-stone">
        <div className="grid lg:grid-cols-2">
          <Img
            src={IMG.papillonModel}
            alt="Model wearing a green enamel Papillon ring with pearl and a butterfly pendant"
            className="aspect-[4/5] lg:aspect-auto lg:min-h-[480px]"
            position="center 35%"
          />
          <div className="flex flex-col justify-between gap-10 px-6 py-12 md:gap-16 md:px-16 md:py-24 xl:px-24">
            <Reveal>
              <Eyebrow className="mb-5 text-deep md:mb-6">The Papillon Collection</Eyebrow>
              <h2 className="display text-5xl md:text-7xl">
                Papillon —<br />
                <em>A Study in Colour</em>
              </h2>
              <p className="body-copy mt-6 max-w-md text-[17px] md:mt-8">
                Butterfly-inspired forms introduce a playful note of colour to the collection.
              </p>
              <ButtonLink to="/collections/papillon" className="mt-8 md:mt-10">
                Explore more colour
              </ButtonLink>
            </Reveal>
            {/* <div className="grid grid-cols-2 gap-4 md:gap-6">
              <Img
                src={IMG.papillonBlue}
                alt="Blue enamel butterfly bracelet on a dark ground"
                className="aspect-[3/4]"
              />
              <Img
                src={IMG.papillonYellow}
                alt="Yellow enamel butterfly bracelet draped over driftwood"
                className="aspect-[3/4] translate-y-8 md:translate-y-10"
              />
            </div> */}
          </div>
        </div>
      </section>

      {/* 5 — Objects */}
      <section className="container-lune py-14 md:py-28">
        <div className="grid gap-8 md:gap-12 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-5 lg:pr-10">
            <Eyebrow className="mb-5 text-deep md:mb-6">Objects</Eyebrow>
            <h2 className="display text-5xl md:text-7xl">Silver as an Object</h2>
            <p className="body-copy mt-6 max-w-md text-[17px] md:mt-8">
              Beyond adornment, silver becomes an object of form, texture and quiet presence.
              Discover handcrafted pieces shaped by traditional techniques and a contemporary
              sensibility.
            </p>
            <ButtonLink to="/objects" variant="secondary" className="mt-8 md:mt-10">
              Explore Objects
            </ButtonLink>
            <Img
              src={IMG.sculptPour}
              alt="Coffee poured into a hand-hammered silver cup"
              className="mt-16 hidden aspect-[4/5] w-2/3 lg:block"
            />
          </Reveal>
          <Reveal className="lg:col-span-7" delay={120}>
            <Img
              src={IMG.sculptSet}
              alt="Four Sculpt hand-hammered fine silver cups on a wooden tray"
              className="aspect-[4/5]"
            />
            <p className="mt-4 flex justify-between text-[13px] text-muted">
              <span>Sculpt - Hand-Hammered Fine Silver Cups</span>
              <span>Set of Two</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 6 — Bespoke */}
      <section className="relative overflow-hidden bg-ink text-ivory">
        <Img
          src={IMG.sculptBar}
          alt=""
          className="absolute inset-0 h-full bg-ink opacity-60"
          position="center 70%"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent" />
        <div className="container-lune relative py-20 md:py-40">
          <Reveal className="max-w-xl">
            <Eyebrow className="mb-5 text-ivory/70 md:mb-6">Commissions</Eyebrow>
            <h2 className="display text-5xl md:text-7xl">Bespoke Silver Objects</h2>
            <p className="mt-6 text-[17px] leading-relaxed text-ivory/80 md:mt-8">
              Some ideas deserve a form of their own. Explore the possibility of a handcrafted
              silver object created around your vision, in collaboration with skilled silversmiths.
            </p>
            <ButtonLink to="/bespoke" variant="outline-light" className="mt-8 md:mt-10">
              Explore Bespoke
            </ButtonLink>
          </Reveal>
        </div>
      </section>
{/* 2 — About Argent Lune / The Art of Silver (merged) */}
      <section className="container-lune grid items-center gap-8 py-14 md:gap-12 md:py-24 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <Img
            src={benchHands}
            alt="A silversmith’s hammer shaping a silver ginkgo leaf on a workbench"
            className="aspect-[4/3]"
          />
        </Reveal>
        <Reveal className="lg:col-span-4 lg:col-start-9" delay={120}>
          <Eyebrow className="mb-5 text-deep md:mb-6">About Argent Lune</Eyebrow>
          <h2 className="display text-5xl md:text-7xl">The Art of Silver</h2>
          <p className="mt-3 font-serif text-2xl italic text-muted md:text-3xl">
            Where Silver Takes Form.
          </p>
          <p className="body-copy mt-6 text-[16px] md:mt-8 md:text-[17px]">
            Rooted in traditional craftsmanship, Argent Lune brings silver into contemporary life
            through jewellery and objects shaped by hand.
          </p>
          <p className="body-copy mt-4 text-[16px] md:text-[17px]">
            Argent Lune began with a fascination for the way silver responds to the hand. We look for
            forms found in nature, surfaces left honest by the tool, and the small irregularities
            that make a piece unmistakably made. Silver changes with time and touch — and we believe
            that is where its beauty lies.
          </p>
          <TextLink to="/about" className="mt-7 md:mt-9">
            Our Story
          </TextLink>
        </Reveal>
      </section>
    </>
  );
}
