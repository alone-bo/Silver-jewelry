/** GBP is the default store currency. A null price means "to be confirmed" — never invent prices. */
export const CURRENCY = "GBP";

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: CURRENCY });

export function formatPrice(value: number | null | undefined) {
  if (value === null || value === undefined) return "£ —";
  return gbp.format(value);
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
