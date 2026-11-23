import { useCallback, useEffect, useState } from "react";
import { useRoute, useScrollTopOnRoute } from "./lib/router";
import { CartProvider } from "./store/cart";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SearchOverlay } from "./components/SearchOverlay";
import { CartDrawer } from "./components/CartDrawer";
import { ButtonLink } from "./components/ui";
import { Home } from "./pages/Home";
import { AllJewellery, CollectionPage, ShopAll } from "./pages/Collection";
import { Objects } from "./pages/Objects";
import { ProductPage } from "./pages/Product";
import { Bespoke } from "./pages/Bespoke";
import { CareGuide, Contact, FAQ, Hallmarking } from "./pages/Brand";
import { About } from "./pages/About";
import { Craft } from "./pages/Craft";
import { POLICIES, PolicyPage } from "./pages/Policy";
import { Account, CartPage, Checkout, OrderConfirmed, OrderShipped } from "./pages/Commerce";
import { DesignSystem } from "./pages/DesignSystem";
import { getCollection, getProduct } from "./data/catalog";

const TITLES: Record<string, string> = {
  "/shop": "Shop All",
  "/jewellery": "Jewellery",
  "/objects": "Objects",
  "/bespoke": "Bespoke Silver Objects",
  "/about": "About",
  "/craft": "Our Craft",
  "/care": "Care Guide",
  "/faq": "FAQ",
  "/contact": "Contact",
  "/hallmarking": "UK Hallmarking for Objects",
  "/cart": "Your Bag",
  "/checkout": "Checkout",
  "/account": "Account",
  "/design-system": "Design System",
};

function NotFound() {
  return (
    <div className="container-lune flex flex-col items-center py-40 text-center">
      <p className="eyebrow text-muted">404</p>
      <h1 className="display mt-6 text-5xl md:text-7xl">This page has not taken form.</h1>
      <ButtonLink to="/" className="mt-10">
        Return Home
      </ButtonLink>
    </div>
  );
}

function Routes() {
  const { path, segments } = useRoute();
  const [a, b] = segments;

  if (path === "/") return <Home />;
  if (path === "/shop") return <ShopAll />;
  if (path === "/jewellery") return <AllJewellery />;
  if (a === "collections" && b) {
    if (b === "objects") return <Objects />;
    return getCollection(b) ? <CollectionPage handle={b} /> : <NotFound />;
  }
  if (path === "/objects") return <Objects />;
  if (a === "products" && b) {
    const p = getProduct(b);
    return p ? <ProductPage product={p} /> : <NotFound />;
  }
  if (path === "/bespoke") return <Bespoke />;
  if (path === "/about") return <About />;
  if (path === "/craft") return <Craft />;
  if (path === "/care") return <CareGuide />;
  if (path === "/faq") return <FAQ />;
  if (path === "/contact") return <Contact />;
  if (path === "/hallmarking") return <Hallmarking />;
  if (a && POLICIES[a] && !b) return <PolicyPage handle={a} />;
  if (path === "/cart") return <CartPage />;
  if (path === "/checkout") return <Checkout />;
  if (path === "/order/confirmed") return <OrderConfirmed />;
  if (path === "/order/shipped") return <OrderShipped />;
  if (path === "/account") return <Account />;
  if (path === "/design-system") return <DesignSystem />;
  return <NotFound />;
}

function Shell() {
  const { path, segments } = useRoute();
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useScrollTopOnRoute(path);

  useEffect(() => {
    const [a, b] = segments;
    let t: string | undefined = TITLES[path];
    if (a === "products" && b) t = getProduct(b)?.name;
    if (a === "collections" && b) t = getCollection(b)?.title;
    if (a && POLICIES[a]) t = POLICIES[a].title;
    document.title = t ? `${t} — ARGENT LUNE` : "ARGENT LUNE — Where Silver Takes Form.";
  }, [path, segments]);

  const minimal = path === "/checkout" || path === "/order/shipped";

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <Header onSearch={() => setSearchOpen(true)} />
      <main id="main" className="min-h-[60vh] pt-24 md:pt-28">
        <Routes key={path} />
      </main>
      {minimal ? null : <Footer />}
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Shell />
    </CartProvider>
  );
}
