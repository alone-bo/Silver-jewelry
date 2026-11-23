import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { IMG } from "../data/images";
import { Button, Eyebrow, Field, Img, isEmail } from "../components/ui";
import { CheckIcon, CloseIcon, UploadIcon } from "../components/Icons";
import { Link } from "../lib/router";
import { cx } from "../lib/format";

type Upload = { id: string; file: File; url: string; progress: number };
const MAX_FILES = 5;
const MAX_MB = 10;

const initial = {
  name: "",
  email: "",
  type: "",
  description: "",
  material: "",
  quantity: "",
  date: "",
};

export function Bespoke() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof initial | "files", string>>>({});
  const [files, setFiles] = useState<Upload[]>([]);
  const [drag, setDrag] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const set =
    (k: keyof typeof initial) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [k]: e.target.value }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const rejected = incoming.filter(
      (f) => !f.type.startsWith("image/") || f.size > MAX_MB * 1024 * 1024,
    );
    const accepted = incoming
      .filter((f) => !rejected.includes(f))
      .slice(0, Math.max(0, MAX_FILES - files.length))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random()}`,
        file,
        url: URL.createObjectURL(file),
        progress: 0,
      }));
    setErrors((er) => ({
      ...er,
      files: rejected.length
        ? `Some files were skipped — please upload images under ${MAX_MB}MB.`
        : files.length + incoming.length > MAX_FILES
          ? `You can upload up to ${MAX_FILES} images.`
          : undefined,
    }));
    setFiles((f) => [...f, ...accepted]);
    // Simulated upload progress
    accepted.forEach((u) => {
      let p = 0;
      const t = setInterval(() => {
        p += 20 + Math.random() * 25;
        setFiles((fs) => fs.map((x) => (x.id === u.id ? { ...x, progress: Math.min(100, p) } : x)));
        if (p >= 100) clearInterval(t);
      }, 180);
    });
  };

  const removeFile = (id: string) => {
    setFiles((fs) => {
      const f = fs.find((x) => x.id === id);
      if (f) URL.revokeObjectURL(f.url);
      return fs.filter((x) => x.id !== id);
    });
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!form.name.trim()) er.name = "Please enter your full name.";
    if (!isEmail(form.email)) er.email = "Please enter a valid email address.";
    if (!form.type) er.type = "Please choose the type of object.";
    if (form.description.trim().length < 20)
      er.description =
        "Please describe your idea in a little more detail (at least 20 characters).";
    setErrors(er);
    if (Object.values(er).some(Boolean)) {
      document.getElementById(`bespoke-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setState("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setState("done");
    window.scrollTo({
      top: document.getElementById("enquiry")!.offsetTop - 100,
      behavior: "smooth",
    });
  };

  const uploading = files.some((f) => f.progress < 100);

  return (
    <>
      {/* Hero */}
      <section className="grid border-b border-line lg:grid-cols-2">
        <div className="flex flex-col justify-end px-5 pb-14 pt-16 md:px-10 md:pb-20 md:pt-24 xl:px-16">
          <Eyebrow className="mb-6">Bespoke Silver Objects</Eyebrow>
          <h1 className="display text-6xl md:text-8xl">
            Your Ideas,
            <br />
            <em>Shaped by Hand.</em>
          </h1>
          <p className="body-copy mt-8 max-w-lg text-[17px]">
            Some objects begin with a personal idea. Working with skilled silversmiths, we explore
            bespoke silver pieces shaped around individual preferences, from cups and tea vessels to
            objects created for meaningful occasions.
          </p>
          <a
            href="#enquiry"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="link-line mt-10 self-start"
          >
            Begin an Enquiry
          </a>
        </div>
        <Img
          src={IMG.soldering}
          alt="A craftsman working on metal pieces at the workbench"
          eager
          className="aspect-[4/3] lg:aspect-auto lg:min-h-[640px]"
        />
      </section>

      {/* Process */}
      <section className="container-lune py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-4 md:gap-8">
          <div>
            <Eyebrow className="mb-4">The Process</Eyebrow>
            <h2 className="display text-4xl md:text-5xl">From idea to object</h2>
          </div>
          {[
            [
              "Enquiry",
              "Share your idea, references and any practical requirements using the form below.",
            ],
            [
              "Feasibility",
              "We review your idea with our silversmiths and confirm feasibility, material availability, pricing and production time.",
            ],
            [
              "Making",
              "Once a proposal is agreed in writing, your piece is shaped by hand using traditional techniques.",
            ],
          ].map(([t, d], i) => (
            <div key={t} className="border-t border-ink pt-6">
              <span className="font-serif text-2xl italic text-taupe">0{i + 1}</span>
              <h3 className="heading mt-3 text-2xl">{t}</h3>
              <p className="body-copy mt-3 text-[14px]">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="enquiry" className="scroll-mt-28 bg-stone">
        <div className="container-lune grid gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">Enquiry</Eyebrow>
            <h2 className="display text-4xl md:text-5xl">Tell us about your idea</h2>
            <p className="body-copy mt-6">
              The more you can share — purpose, scale, references, occasion — the better we can
              understand what you have in mind.
            </p>
            <Img
              src={IMG.sculptSet}
              alt="Hand-hammered silver cups"
              className="mt-10 hidden aspect-[4/5] lg:block"
            />
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {state === "done" ? (
              <div
                className="animate-fade-in border border-line bg-ivory p-8 md:p-14"
                role="status"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ink">
                  <CheckIcon size={20} />
                </span>
                <h3 className="display mt-8 text-4xl md:text-5xl">
                  Thank you, {form.name.split(" ")[0]}.
                </h3>
                <p className="body-copy mt-5">
                  Your enquiry has been received. We’ll review your idea with our silversmiths and
                  reply to <span className="text-ink">{form.email}</span>.
                </p>
                <dl className="mt-8 grid gap-0 text-[14px]">
                  {[
                    ["Type of object", form.type],
                    ["Preferred material", form.material || "—"],
                    ["Estimated quantity", form.quantity || "—"],
                    ["Reference images", `${files.length}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-line py-3">
                      <dt className="text-muted">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-8 text-[12px] leading-relaxed text-muted">
                  Submitting an enquiry does not constitute an order.
                </p>
                <Button
                  variant="secondary"
                  className="mt-8"
                  onClick={() => {
                    setForm(initial);
                    setFiles([]);
                    setState("idle");
                  }}
                >
                  Submit Another Enquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-7 md:grid-cols-2">
                <Field label="Full Name" htmlFor="bespoke-name" error={errors.name}>
                  <input
                    id="bespoke-name"
                    className="field-input"
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    aria-invalid={!!errors.name}
                  />
                </Field>
                <Field label="Email Address" htmlFor="bespoke-email" error={errors.email}>
                  <input
                    id="bespoke-email"
                    type="email"
                    className="field-input"
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                    aria-invalid={!!errors.email}
                  />
                </Field>
                <Field label="Type of Object" htmlFor="bespoke-type" error={errors.type}>
                  <select
                    id="bespoke-type"
                    className="field-input"
                    value={form.type}
                    onChange={set("type")}
                    aria-invalid={!!errors.type}
                  >
                    <option value="">Please select</option>
                    <option>Cup or tumbler</option>
                    <option>Tea vessel</option>
                    <option>Bowl or dish</option>
                    <option>Commemorative object</option>
                    <option>Gift for an occasion</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Preferred Material" htmlFor="bespoke-material" optional>
                  <select
                    id="bespoke-material"
                    className="field-input"
                    value={form.material}
                    onChange={set("material")}
                  >
                    <option value="">No preference / advise me</option>
                    <option>Fine silver</option>
                    <option>Sterling silver</option>
                    <option>Other — described below</option>
                  </select>
                </Field>
                <div className="md:col-span-2">
                  <Field
                    label="Description of Idea"
                    htmlFor="bespoke-description"
                    error={errors.description}
                    hint="Purpose, approximate size, finish, occasion — anything that helps."
                  >
                    <textarea
                      id="bespoke-description"
                      rows={6}
                      className="field-input resize-y"
                      value={form.description}
                      onChange={set("description")}
                      aria-invalid={!!errors.description}
                    />
                  </Field>
                </div>
                <Field label="Estimated Quantity" htmlFor="bespoke-quantity" optional>
                  <input
                    id="bespoke-quantity"
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="field-input"
                    value={form.quantity}
                    onChange={set("quantity")}
                    placeholder="e.g. 2"
                  />
                </Field>
                <Field
                  label="Desired Completion Date"
                  htmlFor="bespoke-date"
                  optional
                  hint="Subject to confirmation."
                >
                  <input
                    id="bespoke-date"
                    type="date"
                    className="field-input"
                    value={form.date}
                    onChange={set("date")}
                    min={new Date().toISOString().slice(0, 10)}
                  />
                </Field>

                {/* Upload */}
                <div className="md:col-span-2">
                  <span className="field-label">
                    Reference Images{" "}
                    <span className="ml-2 normal-case tracking-normal text-muted">
                      (optional · up to {MAX_FILES})
                    </span>
                  </span>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDrag(true);
                    }}
                    onDragLeave={() => setDrag(false)}
                    onDrop={onDrop}
                    className={cx(
                      "flex flex-col items-center justify-center border border-dashed px-6 py-10 text-center transition-colors",
                      drag ? "border-ink bg-ivory" : "border-taupe bg-white",
                    )}
                  >
                    <UploadIcon size={24} />
                    <p className="mt-4 text-[14px]">
                      Drag images here or{" "}
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="cursor-pointer underline underline-offset-4 hover:text-deep"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="mt-1.5 text-[12px] text-muted">
                      JPG, PNG or HEIC · Max {MAX_MB}MB each
                    </p>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      aria-label="Upload reference images"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />
                  </div>
                  {errors.files ? (
                    <p className="mt-2 text-[13px] text-alert">{errors.files}</p>
                  ) : null}
                  {files.length ? (
                    <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {files.map((f) => (
                        <li key={f.id} className="group relative">
                          <img
                            src={f.url}
                            alt={f.file.name}
                            className="aspect-square w-full object-cover"
                          />
                          {f.progress < 100 ? (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-ivory/70">
                              <div
                                className="h-full bg-ink transition-all"
                                style={{ width: `${f.progress}%` }}
                              />
                            </div>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => removeFile(f.id)}
                            aria-label={`Remove ${f.file.name}`}
                            className="absolute right-1 top-1 cursor-pointer bg-ivory/90 p-1 hover:bg-ivory"
                          >
                            <CloseIcon size={14} />
                          </button>
                          <p className="mt-1 truncate text-[11px] text-muted">{f.file.name}</p>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <div className="border-l-2 border-taupe bg-ivory px-5 py-4 text-[13px] leading-relaxed text-muted">
                    Bespoke enquiries are subject to feasibility, material availability, pricing and
                    production time confirmation. Submitting an enquiry does not constitute an
                    order. See our{" "}
                    <Link to="/bespoke-terms" className="text-ink underline underline-offset-4">
                      Bespoke Terms
                    </Link>
                    .
                  </div>
                  <Button
                    type="submit"
                    loading={state === "loading"}
                    disabled={uploading}
                    className="mt-7 w-full md:w-auto"
                  >
                    {uploading ? "Uploading Images" : "Submit Enquiry"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
