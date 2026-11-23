import { useState, type FormEvent } from "react";
import { Button, isEmail } from "./ui";
import { CheckIcon } from "./Icons";

/** Newsletter subscription — lives in the footer's lower-left column. Copy unchanged. */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setState("loading");
    await new Promise((r) => setTimeout(r, 900));
    setState("done");
  };

  return (
    <section aria-labelledby="newsletter-title" className="max-w-md">
      <h2 id="newsletter-title" className="display text-3xl md:text-4xl">
        Notes from Argent Lune
      </h2>
      <p className="body-copy mt-3 text-[14px]">
        Occasional stories, new pieces and moments from the workshop.
      </p>
      {state === "done" ? (
        <div
          className="mt-6 flex animate-fade-in items-center gap-3 border border-line bg-ivory px-5 py-4 text-[14px]"
          role="status"
        >
          <CheckIcon size={18} />
          Thank you — you’re on the list. Look out for our next note.
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-invalid={!!error}
              className="field-input sm:border-r-0"
            />
            <Button type="submit" loading={state === "loading"} className="shrink-0 !px-6">
              Subscribe
            </Button>
          </div>
          {error ? (
            <p className="mt-3 text-[13px] text-alert" role="alert">
              {error}
            </p>
          ) : (
            <p className="mt-3 text-[12px] text-muted">
              By subscribing you agree to our Privacy Policy. Unsubscribe at any time.
            </p>
          )}
        </form>
      )}
    </section>
  );
}
