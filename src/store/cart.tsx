import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product } from "../data/catalog";

export type CartItem = {
  id: string;
  handle: string;
  name: string;
  image: string;
  collection: string;
  options: Record<string, string>;
  price: number | null;
  qty: number;
  maxQty: number;
  heatColoured?: boolean;
};

export type Order = {
  number: string;
  email: string;
  name: string;
  address: string;
  items: CartItem[];
  placedAt: string;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number | null;
  add: (
    p: Product,
    options: Record<string, string>,
    qty: number,
    heatColoured?: boolean,
  ) => Promise<void>;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  lastAddedId: string | null;
  lastOrder: Order | null;
  placeOrder: (o: Omit<Order, "items" | "placedAt" | "number">) => Promise<Order>;
};

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "argent-lune-bag";
const ORDER_KEY = "argent-lune-last-order";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => read(STORAGE_KEY, []));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(() => read(ORDER_KEY, null));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback<CartCtx["add"]>(async (p, options, qty, heatColoured) => {
    // Simulated network latency so the Add to Cart loading state is visible.
    await wait(700);
    const id = `${p.handle}::${Object.entries(options)
      .map(([k, v]) => `${k}=${v}`)
      .join("|")}`;
    const maxQty = p.stock === "low" ? (p.stockCount ?? 1) : 10;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: Math.min(maxQty, i.qty + qty) } : i));
      }
      const variantImage = p.options
        .flatMap((o) =>
          o.values.filter((v) => options[o.name] === v.value && v.image !== undefined),
        )
        .map((v) => p.images[v.image!]?.src)
        .find(Boolean);
      return [
        ...prev,
        {
          id,
          handle: p.handle,
          name: p.name,
          image: variantImage ?? p.images[0].src,
          collection: p.collection,
          options,
          price: p.price,
          qty: Math.min(maxQty, qty),
          maxQty,
          heatColoured,
        },
      ];
    });
    setLastAddedId(id);
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(i.maxQty, qty)) } : i)),
    );
  }, []);

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((i) => i.id !== id)),
    [],
  );
  const clear = useCallback(() => setItems([]), []);

  const placeOrder = useCallback<CartCtx["placeOrder"]>(
    async (o) => {
      await wait(1400);
      const order: Order = {
        ...o,
        number: `AL-${Math.floor(100000 + Math.random() * 899999)}`,
        items,
        placedAt: new Date().toISOString(),
      };
      localStorage.setItem(ORDER_KEY, JSON.stringify(order));
      setLastOrder(order);
      setItems([]);
      return order;
    },
    [items],
  );

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.some((i) => i.price === null)
      ? null
      : items.reduce((n, i) => n + (i.price ?? 0) * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      lastAddedId,
      lastOrder,
      placeOrder,
    };
  }, [items, add, setQty, remove, clear, drawerOpen, lastAddedId, lastOrder, placeOrder]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export function itemStockNote(item: CartItem) {
  const p = getProduct(item.handle);
  if (p?.stock === "low") return `Only ${p.stockCount} Left`;
  return "Available";
}
