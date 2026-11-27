import { Eyebrow, Img, Reveal } from "../components/ui";
import { Link } from "../lib/router";
import heating from "@/assets/images/craft/heating-the-silver.webp";
import hammering from "@/assets/images/craft/hammering-the-silver-disc.webp";
import backToFlame from "@/assets/images/craft/back-to-the-flame.webp";
import refining from "@/assets/images/craft/refining-the-form.webp";
import hammeredSurface from "@/assets/images/craft/the-hammered-surface.webp";

const STEPS = [
  {
    img: heating,
    alt: "A gas torch heating a silver disc in a bed of coals",
    caption: "Heating the Silver",
  },
  {
    img: hammering,
    alt: "A hammer striking a silver disc on a steel stake",
    caption: "Hammering the Silver Disc",
  },
  {
    img: backToFlame,
    alt: "A shaped silver vessel returned to the coals for annealing",
    caption: "Back to the Flame",
  },
  {
    img: refining,
    alt: "A silversmith refining the form of a silver vessel by hand",
    caption: "Refining the Form",
  },
];

export function Craft() {
  return (
    <>
      {/* Intro */}
      <section className="container-lune pt-16 pb-12 md:pt-24 md:pb-20">
        <div className="lg:w-[62%]">
          <Eyebrow className="mb-6">Our Craft</Eyebrow>
          <h1 className="display text-5xl sm:text-6xl md:text-7xl xl:text-[92px]">
            Between Hammer and Flame
          </h1>
          <p className="body-copy mt-7 max-w-2xl text-[16px] md:mt-9 md:text-[17px]">
            A glimpse into traditional silversmithing in Yunnan, where silver is still worked by
            hand at the bench. From the first heat to the final polish, every stage is guided by eye,
            ear and touch. 
          </p>
        </div>
      </section>

      {/* 2 × 2 process grid */}
      <section className="container-lune pb-20 md:pb-28" aria-label="The making process">
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 md:gap-x-8 md:gap-y-16">
          {STEPS.map((step) => (
            <Reveal key={step.caption}>
              <figure>
                <Img src={step.img} alt={step.alt} className="aspect-[4/3]" />
                <figcaption className="mt-4 text-[12px] font-medium tracking-[0.14em] text-ink uppercase">
                  {step.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Asymmetric feature */}
      <section className="container-lune pt-10 pb-24 md:pt-16 md:pb-32">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Img
              src={hammeredSurface}
              alt="Close-up of hammer marks across the surface of a silver vessel"
              className="aspect-[4/5] md:aspect-[3/4]"
              position="center 45%"
            />
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-8 lg:pb-16" delay={120}>
            <h2 className="display text-5xl md:text-6xl">
              The Hammered
              <br />
              Surface
            </h2>
            <p className="body-copy mt-8 max-w-xs text-[16px]">
              Each hammer mark catches the light at a slightly different angle.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Page footer bar */}
      <footer className="container-lune border-t border-line py-8 md:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="font-serif text-[18px] font-medium tracking-[0.28em] whitespace-nowrap"
          >
            ARGENT LUNE
          </Link>
          <nav
            aria-label="Craft page"
            className="flex items-center gap-8 text-[11px] font-medium tracking-[0.18em] uppercase"
          >
            <Link to="/contact" className="transition-colors hover:text-deep">
              Contact
            </Link>
            <Link to="/care" className="transition-colors hover:text-deep">
              Client Care
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
