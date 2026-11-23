import { FEATURED_OBJECT, getProduct, products, stockLabel } from "../data/catalog";
import { IMG } from "../data/images";
import { ProductCard } from "../components/ProductCard";
import { ButtonLink, Eyebrow, Img, Reveal, StockBadge, TextLink } from "../components/ui";
import { formatPrice } from "../lib/format";
import { Link } from "../lib/router";

/** Reusable product feature — driven entirely by FEATURED_OBJECT so future objects can be swapped in. */
function FeaturedObject() {
  const f = FEATURED_OBJECT;
  const p = getProduct(f.handle);
  if (!p) return null;
  return (
    <section aria-labelledby="featured-object" className="bg-stone">
      <div className="container-lune grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-7">
          <div className="grid grid-cols-5 gap-4 md:gap-6">
            <Img src={f.images[0]} alt={p.images[0].alt} className="col-span-3 aspect-[3/4]" />
            <Img
              src={f.images[1]}
              alt={p.images[1]?.alt ?? ""}
              className="col-span-2 mt-20 aspect-[3/4] md:mt-32"
            />
          </div>
        </Reveal>
        <Reveal className="flex flex-col justify-center lg:col-span-4 lg:col-start-9" delay={120}>
          <Eyebrow className="mb-6">{f.eyebrow}</Eyebrow>
          <h2 id="featured-object" className="display text-6xl md:text-8xl">
            {f.title}
          </h2>
          <p className="heading mt-3 text-xl italic text-muted md:text-2xl">{f.subtitle}</p>
          <p className="body-copy mt-8">{f.description}</p>
          <div className="mt-8 flex items-center justify-between border-y border-line py-4">
            <span className="text-[15px] tabular-nums">{formatPrice(p.price)}</span>
            <StockBadge status={p.stock} label={stockLabel(p)} />
          </div>
          <ButtonLink to={`/products/${p.handle}`} className="mt-8 self-start">
            {f.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function Objects() {
  const objects = products.filter((p) => p.kind === "object");
  return (
    <>
      {/* Hero */}
      <section className="grid border-b border-line lg:grid-cols-12">
        <div className="flex flex-col justify-end px-5 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24 lg:col-span-5 xl:px-16">
          <nav aria-label="Breadcrumb" className="mb-10 text-[12px] text-muted">
            <Link to="/" className="hover:text-deep">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Objects</span>
          </nav>
          <Eyebrow className="mb-6">Objects</Eyebrow>
          <h1 className="display text-6xl md:text-8xl">
            Silver, Shaped <em>for Living.</em>
          </h1>
          <p className="body-copy mt-8 max-w-md text-[17px]">
            Discover handcrafted silver objects that bring together traditional craftsmanship and
            contemporary form.
          </p>
        </div>
        <Img
          src={IMG.sculptBar}
          alt="Two Sculpt silver cups on a wooden tray in a dim, warm bar"
          eager
          position="center 68%"
          className="aspect-[4/5] bg-ink md:aspect-[16/10] lg:col-span-7 lg:aspect-auto lg:min-h-[720px]"
        />
      </section>

      <FeaturedObject />

      {/* All Objects */}
      <section className="container-lune py-20 md:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">The Collection</Eyebrow>
            <h2 className="display text-5xl md:text-6xl">All Objects</h2>
          </div>
          <p className="text-[13px] text-muted">
            {objects.length} object{objects.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
          {objects.map((p, i) => (
            <Reveal key={p.handle} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
          <Reveal delay={objects.length * 80}>
            <div className="flex aspect-[4/5] flex-col items-center justify-center border border-dashed border-taupe p-8 text-center">
              <Eyebrow>In the Workshop</Eyebrow>
              <p className="heading mt-4 text-2xl">New objects are in progress</p>
              <p className="mt-3 text-[13px] text-muted">
                Subscribe to Notes from Argent Lune to hear first.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bespoke editorial */}
      <section className="border-t border-line">
        <div className="grid lg:grid-cols-12">
          <div className="flex flex-col justify-center px-5 py-20 md:px-10 lg:col-span-5 xl:px-16">
            <Reveal>
              <Eyebrow className="mb-6">Bespoke Silver Objects</Eyebrow>
              <h2 className="display text-5xl md:text-7xl">
                Some ideas deserve a form of their own.
              </h2>
              <p className="body-copy mt-8 max-w-md">
                Explore the possibility of a handcrafted silver object created around your vision —
                from cups and tea vessels to pieces for meaningful occasions — in collaboration with
                skilled silversmiths.
              </p>
              <ol className="mt-10 space-y-5 border-t border-line pt-8">
                {["Share your idea", "Feasibility & proposal", "Shaped by hand"].map((s, i) => (
                  <li key={s} className="flex items-baseline gap-5">
                    <span className="font-serif text-xl italic text-taupe">0{i + 1}</span>
                    <span className="text-[15px]">{s}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <ButtonLink to="/bespoke">Enquire About a Commission</ButtonLink>
                <TextLink to="/bespoke-terms">Bespoke Terms</TextLink>
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:col-span-7">
            <Img
              src={IMG.benchTorch}
              alt="Silversmith working with a torch at the bench"
              className="col-span-2 aspect-[16/10]"
            />
            <Img src={IMG.hammer} alt="Hammer resting on a steel stake" className="aspect-square" />
            <Img
              src={IMG.sculptPour}
              alt="Coffee poured into a hand-hammered silver cup"
              className="aspect-square"
            />
          </div>
        </div>
      </section>

      <section className="container-lune flex flex-col items-start justify-between gap-6 border-t border-line py-14 md:flex-row md:items-center">
        <div>
          <p className="heading text-2xl md:text-3xl">UK Hallmarking for Objects</p>
          <p className="mt-2 text-[14px] text-muted">
            How our silver objects are tested and hallmarked by a UK Assay Office.
          </p>
        </div>
        <Link to="/hallmarking" className="link-line">
          Learn More
        </Link>
      </section>
    </>
  );
}
