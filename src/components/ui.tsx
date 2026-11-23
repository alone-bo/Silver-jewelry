import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "../lib/format";
import { Link } from "../lib/router";
import { ArrowRight, MinusIcon, PlusIcon } from "./Icons";
import type { StockStatus } from "../data/catalog";

/* ---------- Image with soft placeholder ---------- */
export function Img({
  src,
  alt,
  className,
  imgClassName,
  eager,
  position,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
  position?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={cx(
        "overflow-hidden",
        !className?.includes("absolute") && "relative",
        !className?.includes("bg-") && "bg-stone",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        ref={(el) => {
          if (el?.complete && el.naturalWidth) setLoaded(true);
        }}
        onLoad={() => setLoaded(true)}
        style={position ? { objectPosition: position } : undefined}
        className={cx(
          "h-full w-full object-cover transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
      />
    </div>
  );
}

/* ---------- Buttons ---------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "light" | "outline-light";
  loading?: boolean;
  full?: boolean;
};
export function Button({
  variant = "primary",
  loading,
  full,
  className,
  children,
  disabled,
  ...rest
}: BtnProps) {
  return (
    <button
      className={cx("btn", `btn-${variant}`, full && "w-full", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="spinner" aria-hidden /> : null}
      <span>{children}</span>
    </button>
  );
}

export function ButtonLink({
  to,
  variant = "primary",
  className,
  children,
}: {
  to: string;
  variant?: BtnProps["variant"];
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={cx("btn", `btn-${variant}`, className)}>
      {children}
    </Link>
  );
}

export function TextLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={cx("link-line", className)}>
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}

/* ---------- Typography helpers ---------- */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx("eyebrow text-muted", className)}>{children}</p>;
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={cx("reveal", visible && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- Accordion ---------- */
export function Accordion({
  title,
  children,
  defaultOpen,
  size = "md",
}: {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  size?: "md" | "lg";
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className={cx(
            "flex w-full cursor-pointer items-center justify-between gap-6 text-left transition-colors hover:text-deep",
            size === "lg" ? "py-6 heading text-xl md:text-2xl" : "py-5 eyebrow",
          )}
        >
          <span>{title}</span>
          <span className="shrink-0 text-ink">
            {open ? <MinusIcon size={16} /> : <PlusIcon size={16} />}
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={cx(
          "grid transition-[grid-template-rows] duration-500 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className={cx("body-copy", size === "lg" ? "pb-7 max-w-3xl" : "pb-6")}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stock badge ---------- */
const stockTone: Record<StockStatus, string> = {
  available: "bg-deep",
  low: "bg-[#8b8275]",
  "sold-out": "bg-muted",
  "coming-soon": "bg-taupe",
  enquire: "bg-ink",
};
export function StockBadge({
  status,
  label,
  className,
}: {
  status: StockStatus;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 text-[12px] tracking-wide text-muted",
        className,
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", stockTone[status])} aria-hidden />
      {label}
    </span>
  );
}

/* ---------- Placeholder for unconfirmed content ---------- */
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-dashed border-taupe bg-stone/60 px-2 py-0.5 text-[13px] italic text-muted">
      {children}
    </span>
  );
}

/* ---------- Quantity selector ---------- */
export function QuantitySelector({
  value,
  onChange,
  max = 10,
  size = "md",
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const h = size === "sm" ? "h-9" : "h-[52px]";
  const w = size === "sm" ? "w-9" : "w-12";
  return (
    <div
      className={cx(
        "inline-flex items-center border border-line bg-white",
        h,
        disabled && "opacity-50",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className={cx(
          "flex h-full cursor-pointer items-center justify-center transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:text-line disabled:hover:bg-transparent",
          w,
        )}
      >
        <MinusIcon size={14} />
      </button>
      <span
        className={cx(
          "min-w-8 text-center tabular-nums",
          size === "sm" ? "text-[13px]" : "text-[15px]",
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={cx(
          "flex h-full cursor-pointer items-center justify-center transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:text-line disabled:hover:bg-transparent",
          w,
        )}
      >
        <PlusIcon size={14} />
      </button>
    </div>
  );
}

/* ---------- Form field ---------- */
export function Field({
  label,
  error,
  hint,
  children,
  optional,
  htmlFor,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  optional?: boolean;
  htmlFor: string;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label}
        {optional ? (
          <span className="ml-2 normal-case tracking-normal text-muted">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="mt-2 text-[13px] text-alert" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-[13px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- Page header for content pages ---------- */
export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container-lune pt-16 pb-12 md:pt-24 md:pb-16">
      {eyebrow ? <Eyebrow className="mb-6">{eyebrow}</Eyebrow> : null}
      <h1 className="display max-w-4xl text-5xl md:text-7xl">{title}</h1>
      {children ? (
        <div className="body-copy mt-8 max-w-2xl text-base md:text-[17px]">{children}</div>
      ) : null}
    </header>
  );
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
