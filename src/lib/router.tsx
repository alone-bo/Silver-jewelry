import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from "react";

/** Minimal hash router — keeps the prototype portable (maps 1:1 to Shopify URL handles). */
function getHash() {
  const raw = window.location.hash.replace(/^#/, "") || "/";
  return raw.startsWith("/") ? raw : `/${raw}`;
}

function subscribe(cb: () => void) {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
}

export function useRoute() {
  const hash = useSyncExternalStore(subscribe, getHash, () => "/");
  const [path, queryString = ""] = hash.split("?");
  const segments = path.split("/").filter(Boolean);
  return {
    path: path.replace(/\/$/, "") || "/",
    segments,
    query: new URLSearchParams(queryString),
  };
}

export function navigate(to: string) {
  window.location.hash = to;
}

export function useScrollTopOnRoute(path: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, ...rest }: LinkProps) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
  };
  return <a href={`#${to}`} onClick={handle} {...rest} />;
}
