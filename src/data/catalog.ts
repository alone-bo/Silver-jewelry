import { IMG } from "./images";

export type StockStatus = "available" | "low" | "sold-out" | "coming-soon" | "enquire";

export type OptionValue = {
  value: string;
  /** Hex swatch for colour options */
  swatch?: string;
  /** Switches the gallery to this image index when selected */
  image?: number;
  /** Triggers the visible Colour Finish Notice */
  heatColoured?: boolean;
  unavailable?: boolean;
};

export type ProductOption = {
  name: string;
  kind: "swatch" | "pill";
  values: OptionValue[];
  /** When true the shopper must actively choose (no default) */
  required?: boolean;
};

export type ProductImage = { src: string; alt: string };

export type ObjectSpecs = {
  dimensions: string;
  capacity: string;
  weight: string;
  hallmarking: string;
  dispatch: string;
  material: string;
};

export type CollectionHandle =
  | "botanica"
  | "materia"
  | "papillon"
  | "miniature-silverware"
  | "objects";

/**
 * A style that shares one product page but is sold under its own SKU.
 * Colourways and distinct forms each appear as their own card in collection grids;
 * opening a card preselects the matching option, image and SKU.
 */
export type Variant = {
  /** URL token, e.g. /products/ginkgo-leaf-drop-earrings?v=heat-coloured */
  id: string;
  sku: string;
  /** Shown on the card and in the option summary */
  label?: string;
  swatch?: string;
  /** Gallery image index for this style */
  image?: number;
  /** Option selections this style represents */
  options?: Record<string, string>;
  /** Ring fit, for designs where women's and men's sizes carry separate SKUs */
  fit?: "women" | "men";
  stock?: StockStatus;
  stockCount?: number;
  /** false = not shown as a separate card (e.g. size-based SKUs) */
  card?: boolean;
};

export type Product = {
  handle: string;
  name: string;
  sku: string;
  kind: "jewellery" | "object";
  collection: CollectionHandle;
  category: string;
  /** null = price to be confirmed */
  price: number | null;
  stock: StockStatus;
  stockCount?: number;
  /** Styles sold under separate SKUs — one card each in collection grids */
  variants?: Variant[];
  images: ProductImage[];
  summary: string;
  description: string[];
  options: ProductOption[];
  /** Card-level material line, e.g. "999 Fine Silver · 925 Sterling Silver" */
  materials: string;
  /** Full composition, per the product's Materials & Details */
  material: string;
  sizeFit?: string;
  weight: string;
  craftsmanship: string;
  care: string;
  /** Rings: shown through the Size & Fit module */
  sizeGuide?: { mens?: boolean };
  objectSpecs?: ObjectSpecs;
  /** Objects: how the piece is sold, e.g. as a pair or a single set */
  soldAsPair?: boolean;
  salesMethod?: string;
  /** Purchase-area note, e.g. the randomly coloured cord supplied with a pendant */
  purchaseNote?: { title: string; body: string };
  isNew?: boolean;
  href?: string;
  order: number;
};

export type Collection = {
  handle: CollectionHandle;
  title: string;
  description: string;
  banner: string;
  bannerAlt: string;
  card: string;
  kind: "jewellery" | "object";
};

export const TBC = "[To be confirmed]";

export const collections: Collection[] = [
  {
    handle: "botanica",
    title: "Botanica",
    description:
      "Forms borrowed from nature — leaves, branches and quiet botanical details, interpreted in silver.",
    banner: IMG.branch,
    bannerAlt: "A branch-like silver form resting on a pale reflective surface",
    card: IMG.branch,
    kind: "jewellery",
  },
  {
    handle: "materia",
    title: "Materia",
    description:
      "An exploration of surface, texture and sculptural form, where silver reveals its own character.",
    banner: IMG.heroRings,
    bannerAlt: "Sculptural silver rings worn on a hand held close to the face",
    card: IMG.sculptRing,
    kind: "jewellery",
  },
  {
    handle: "papillon",
    title: "Papillon",
    description:
      "Butterfly-inspired jewellery brings a delicate sense of movement and colour to Argent Lune.",
    banner: IMG.papillonModel,
    bannerAlt:
      "Model wearing a green enamel butterfly ring and pendant from the Papillon collection",
    card: IMG.papillonBlue,
    kind: "jewellery",
  },
  {
    handle: "miniature-silverware",
    title: "Miniature Silverware",
    description:
      "Wine-cup-inspired silver pendants, conceived as miniature wearable art. Sculptural details and textured surfaces celebrate the character of traditional metalwork.",
    banner: IMG.sphere,
    bannerAlt: "A small polished silver form held between two hands",
    card: IMG.sphere,
    kind: "jewellery",
  },
  {
    handle: "objects",
    title: "Objects",
    description:
      "Silver, shaped for living. Discover handcrafted silver objects that bring together traditional craftsmanship and contemporary form. From sculptural handicraft cups to future explorations in silverware, each piece celebrates the character of the material and the hands that shape it.",
    banner: IMG.sculptSet,
    bannerAlt: "Four hand-hammered silver cups on a wooden tray",
    card: IMG.sculptSet,
    kind: "object",
  },
];

export const jewelleryCollections = collections.filter((c) => c.kind === "jewellery");

export function getCollection(handle: string) {
  return collections.find((c) => c.handle === handle);
}

/* ---------- Care copy ---------- */

const careSilver =
  "Gently wipe with a soft, clean, dry cloth after wear to remove surface oils and moisture. Store separately in a cool, dry place, away from humidity, ideally in the pouch supplied. Avoid prolonged contact with water, perfume, cosmetics and household chemicals. See the Care Guide for full guidance.";

const careHeat =
  "The colour on this piece is created through a specialised heat-colouring process and is not permanent — it may gradually fade or change with wear and friction. Avoid wiping, polishing or rubbing the coloured surface, and store the piece in a sealed bag when not in use.";

const careDelicate =
  "Pieces set with pearls, stones or enamel need extra care: avoid impact, prolonged moisture, harsh chemicals, abrasive products and ultrasonic cleaners. Clean gently with a soft, dry cloth and do not apply silver polish to the set elements.";

/* ---------- Option builders ---------- */

/** Natural silver or heat-coloured — only for pieces made in both versions. */
const finishOption = (heatImage: number, silverImage = 0): ProductOption => ({
  name: "Finish",
  kind: "pill",
  values: [
    { value: "Natural Silver", image: silverImage },
    { value: "Heat-Coloured", heatColoured: true, image: heatImage },
  ],
});

const enamelOption = (images: { green: number; blue: number; yellow: number }): ProductOption => ({
  name: "Enamel Colour",
  kind: "swatch",
  values: [
    { value: "Forest Green", swatch: "#1f6b52", image: images.green },
    { value: "Lake Blue", swatch: "#5d87a0", image: images.blue },
    { value: "Citrine Yellow", swatch: "#c9b447", image: images.yellow },
  ],
});

/** Women's UK L–N, open-ended and slightly adjustable. */
const RING_FIT = "Standard Women's Size · UK L–N (approx. 51.2–53.8 mm) · open-ended, slightly adjustable";
/** Men's UK P–R, open-ended and slightly adjustable. */
const RING_FIT_MENS = "Standard Men's Size · UK P–R (approx. 56.3–58.9 mm) · open-ended, slightly adjustable";

/* ---------- Products ---------- */

export const products: Product[] = [
  /* ================= Botanica ================= */
  {
    handle: "willow-leaf-drop-earrings",
    name: "Willow — Leaf Drop Earrings",
    sku: "AL001",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.earringModel, alt: "Willow leaf drop earrings worn on the ear" },
      { src: IMG.leaves, alt: "Silver leaf forms resting on linen" },
      { src: IMG.texture, alt: "Close detail of a softly finished silver surface" },
    ],
    summary:
      "Long, tapering silver leaves with delicate surface impressions and a softly folded profile.",
    description: [
      "Willow draws inspiration from the way willow branches respond to the breeze. The design captures a sense of fluidity, balancing the strength of silver with the softness of a natural form.",
      "Light in appearance and quietly expressive, it brings a natural line to everyday dressing.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts)",
    weight: "Approx. 10 g",
    craftsmanship:
      "Organic leaf-inspired form with carefully finished surface detailing.",
    care: careSilver,
    isNew: true,
    order: 1,
  },
  {
    handle: "verdant-leaf-stud-earrings",
    name: "Verdant — Green Stone Leaf Stud Earrings",
    sku: "AL002",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.crystals, alt: "Green stone set into a small silver leaf stud" },
      { src: IMG.earringModel, alt: "Stud earrings worn on the ear" },
      { src: IMG.leaves, alt: "Botanical silver detail laid on linen" },
    ],
    summary:
      "Small leaf-shaped silver drops sit beneath vivid green-toned studs, balancing fresh colour with hand-finished metal.",
    description: [
      "Verdant captures a moment of quiet growth. Its flowing contours reflect the gentle unfolding of foliage, translating a fleeting expression of nature into a piece of contemporary silver jewellery.",
      "The subtly sculpted surfaces catch the light, holding colour and metal in quiet contrast.",
    ],
    options: [],
    materials: "Fine Silver · Chalcedony",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts); Chalcedony",
    weight: "Approx. 7.15 g",
    craftsmanship:
      "Sculptural botanical form with carefully finished silver surfaces and chalcedony detailing.",
    care: careDelicate + " " + careSilver,
    order: 2,
  },
  {
    handle: "bloom-floral-stud-earrings",
    name: "Bloom — Floral Stud Earrings",
    sku: "AL003",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.crystalsDark, alt: "Small silver bloom stud with a green-toned centre" },
      { src: IMG.crystals, alt: "Green-toned centre set into a silver flower" },
      { src: IMG.texture, alt: "Textured silver surface in close detail" },
    ],
    summary:
      "Small sculpted silver blooms with textured petals and subtle green-toned centres.",
    description: [
      "Bloom explores the balance between floral softness and the enduring character of silver. Its nature-inspired contours bring a subtle sense of romance to an understated design.",
      "An understated botanical detail, designed to sit close to the ear.",
    ],
    options: [],
    materials: "Fine Silver · Chalcedony",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts); Chalcedony",
    weight: "Approx. 4.6 g",
    craftsmanship:
      "Botanical silver detailing with chalcedony stone setting and a carefully finished surface.",
    care: careDelicate + " " + careSilver,
    order: 3,
  },
  {
    handle: "ginkgo-leaf-drop-earrings",
    name: "Ginkgo — Leaf Drop Earrings",
    sku: "AL004-SLV / AL004-COL",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "natural-silver",
        sku: "AL004-SLV",
        label: "Natural Silver",
        image: 0,
        options: { Finish: "Natural Silver" },
        stock: "low",
        stockCount: 2,
      },
      {
        id: "heat-coloured",
        sku: "AL004-COL",
        label: "Heat-Coloured",
        image: 1,
        options: { Finish: "Heat-Coloured" },
        stock: "low",
        stockCount: 3,
      },
    ],
    images: [
      { src: IMG.leaves, alt: "Ginkgo leaf drop earrings in natural silver" },
      { src: IMG.texture, alt: "Heat-coloured surface detail on a silver ginkgo leaf" },
      { src: IMG.earringModel, alt: "Ginkgo leaf earrings worn on the ear" },
    ],
    summary:
      "The distinctive fan-shaped silhouette of the ginkgo leaf, reimagined in silver.",
    description: [
      "Ginkgo draws on a botanical form associated with longevity and renewal. Its graceful shape and subtle surface details offer a contemporary interpretation of an enduring natural motif.",
      "Available in natural silver, or with colour drawn from the metal by controlled heat.",
    ],
    options: [finishOption(1)],
    materials: "Fine Silver",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts)",
    weight: "Approx. 7 g",
    craftsmanship:
      "Ginkgo-inspired silver detailing, with subtle heat-coloured accents on the coloured version.",
    care: careHeat + " " + careSilver,
    order: 4,
  },
  {
    handle: "ginkgo-leaf-brooch",
    name: "Ginkgo — Leaf Brooch",
    sku: "AL005-SLV / AL005-COL",
    kind: "jewellery",
    collection: "botanica",
    category: "Brooches",
    price: null,
    stock: "available",
    variants: [
      {
        id: "natural-silver",
        sku: "AL005-SLV",
        label: "Natural Silver",
        image: 0,
        options: { Finish: "Natural Silver" },
        stock: "low",
        stockCount: 2,
      },
      {
        id: "heat-coloured",
        sku: "AL005-COL",
        label: "Heat-Coloured",
        image: 1,
        options: { Finish: "Heat-Coloured" },
        stock: "low",
        stockCount: 3,
      },
    ],
    images: [
      { src: IMG.branch, alt: "Ginkgo leaf brooch in natural silver" },
      { src: IMG.texture, alt: "Heat-coloured surface detail on the ginkgo brooch" },
      { src: IMG.handsTool, alt: "Silver brooch pinned to a soft wool lapel" },
    ],
    summary:
      "A botanical silver brooch inspired by the graceful fan-shaped form of the ginkgo leaf.",
    description: [
      "Ginkgo reflects the enduring appeal of a familiar botanical motif. Its expressive surface and graceful outline capture the balance between delicacy and strength found in nature.",
      "A quiet, sculptural gesture for a lapel, a scarf or a plain shoulder.",
    ],
    options: [finishOption(1)],
    materials: "Fine Silver",
    material: "999 Fine Silver (Main Body); Alloy Brooch Pin",
    weight: "Approx. 6.82 g",
    craftsmanship:
      "Botanical silver detailing with a textured surface and subtle heat-coloured accents on the coloured version.",
    care: careHeat + " " + careSilver,
    order: 5,
  },
  {
    handle: "evergreen-branch-drop-earrings",
    name: "Evergreen — Branch Drop Earrings",
    sku: "AL006-SLV / AL006-COL",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "natural-silver",
        sku: "AL006-SLV",
        label: "Natural Silver",
        image: 0,
        options: { Finish: "Natural Silver" },
        stock: "low",
        stockCount: 3,
      },
      {
        id: "heat-coloured",
        sku: "AL006-COL",
        label: "Heat-Coloured",
        image: 1,
        options: { Finish: "Heat-Coloured" },
        stock: "low",
        stockCount: 2,
      },
    ],
    images: [
      { src: IMG.earringModel, alt: "Evergreen branch drop earrings worn on the ear" },
      { src: IMG.texture, alt: "Heat-coloured branch detail in close up" },
      { src: IMG.branch, alt: "Silver branch form resting on a pale surface" },
    ],
    summary:
      "Inspired by evergreen foliage, these silver drops capture the quiet strength and intricate forms of nature.",
    description: [
      "Evergreen celebrates the enduring presence of trees through the changing seasons. Its expressive contours reflect the resilience and understated beauty of the natural world.",
      "Available in natural silver, or warmed by a heat-coloured finish.",
    ],
    options: [finishOption(1)],
    materials: "Fine Silver",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts)",
    weight: "Approx. 9.1 g",
    craftsmanship:
      "Detailed botanical form with subtle surface texture. The coloured version features heat-coloured accents.",
    care: careHeat + " " + careSilver,
    order: 6,
  },
  {
    handle: "twig-silver-hoop-earrings",
    name: "Twig — Silver Hoop Earrings",
    sku: "AL007",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.earringModel, alt: "Slender silver hoop earrings worn on the ear" },
      { src: IMG.branch, alt: "Branch-like silver line against a pale ground" },
      { src: IMG.handsBench, alt: "Silver hoops resting on the workbench" },
    ],
    summary:
      "Minimal silver hoops with subtle irregularities inspired by the contours of slender branches.",
    description: [
      "Twig reflects the quiet individuality found in nature. Rather than pursuing perfect symmetry, the design celebrates flowing contours and the character of irregular form.",
      "Their organic profile adds character to an everyday shape.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts)",
    weight: "Approx. 7.86 g",
    craftsmanship: "Sculptural branch-inspired contours with carefully finished silver surfaces.",
    care: careSilver,
    order: 7,
  },
  {
    handle: "twig-open-branch-ring",
    name: "Twig — Open Branch Ring",
    sku: "AL008",
    kind: "jewellery",
    collection: "botanica",
    category: "Rings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.ringsReflect, alt: "Open silver branch ring with an irregular outline" },
      { src: IMG.ringWood, alt: "Silver ring resting on a wooden surface" },
      { src: IMG.branch, alt: "Branch-like silver form" },
    ],
    summary:
      "An open silver ring formed from slender, branch-like lines — light, sculptural and intentionally irregular.",
    description: [
      "Twig celebrates the subtle imperfections of the natural world. Its sculptural lines follow the character of growing wood, allowing asymmetry to become part of the design.",
      "Worn alone, it brings a natural gesture to the hand.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver",
    sizeFit: RING_FIT,
    weight: "Approx. 4.38 g",
    craftsmanship: "Organic branch-inspired form with carefully finished silver surfaces.",
    care: careSilver,
    sizeGuide: { mens: false },
    order: 8,
  },
  {
    handle: "imprint-floating-leaf-ring",
    name: "Imprint — Floating Leaf Ring",
    sku: "AL009",
    kind: "jewellery",
    collection: "botanica",
    category: "Rings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.heroRings, alt: "Floating leaf ring worn on the hand" },
      { src: IMG.ringsReflect, alt: "Fluid silver ring with an organic silhouette" },
      { src: IMG.leaves, alt: "Leaf-inspired silver form on linen" },
    ],
    summary:
      "A fluid silver ring inspired by the gentle movement of a floating leaf.",
    description: [
      "Imprint captures a fleeting moment in nature, where movement appears almost still. Its graceful lines evoke the quiet rhythm of a leaf carried by air or water.",
      "The organic silhouette brings softness to a contemporary sculptural form.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver",
    sizeFit: RING_FIT,
    weight: "Approx. 5.4 g",
    craftsmanship: "Flowing, leaf-inspired sculptural form with a carefully finished silver surface.",
    care: careSilver,
    sizeGuide: { mens: false },
    order: 9,
  },
  {
    handle: "pinecone-pendant-necklace",
    name: "Pinecone — Pendant Necklace",
    sku: "AL010",
    kind: "jewellery",
    collection: "botanica",
    category: "Necklaces",
    price: null,
    stock: "available",
    images: [
      { src: IMG.necklaceLinen, alt: "Pinecone pendant necklace laid on soft linen" },
      { src: IMG.circleNecklace, alt: "Silver pendant and chain against a pale wall" },
      { src: IMG.moonPendants, alt: "Layered botanical pendants" },
    ],
    summary:
      "Inspired by the layered structure of a pinecone, this silver pendant turns a familiar woodland form into a distinctive miniature.",
    description: [
      "Pinecone explores the intricate geometry hidden within nature. Its layered silhouette reflects the beauty of repetition, structure and organic growth.",
      "Suspended on a fine chain, it sits quietly at the collarbone.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver (Pendant); 925 Sterling Silver (Chain)",
    weight: "Approx. 11.71 g",
    craftsmanship: "Layered botanical detailing with a sculptural silver finish.",
    care: careSilver,
    isNew: true,
    order: 10,
  },
  {
    handle: "coral-silver-brooch",
    name: "Coral — Silver Brooch",
    sku: "AL011",
    kind: "jewellery",
    collection: "botanica",
    category: "Brooches",
    price: null,
    stock: "available",
    images: [
      { src: IMG.leaves, alt: "Coral-inspired silver brooch with a freshwater pearl" },
      { src: IMG.crystals, alt: "Freshwater pearl and silver detail" },
      { src: IMG.handsTool, alt: "Silver brooch pinned to a soft lapel" },
    ],
    summary:
      "Inspired by the branching forms of coral, a silver brooch paired with the soft lustre of a freshwater pearl.",
    description: [
      "Coral draws on the intricate structures of marine life. The contrast between sculptural silver and pearl brings together texture, movement and a quiet sense of natural elegance.",
      "Each pearl is naturally individual in colour and shape, so no two brooches are alike.",
    ],
    options: [],
    materials: "Fine Silver · Freshwater Pearl",
    material:
      "999 Fine Silver (Main Body); 925 Sterling Silver (Pin, supplier-stated); Freshwater Pearl (each pearl may naturally differ in colour and shape)",
    weight: "Approx. 4.11 g",
    craftsmanship: "Coral-inspired sculptural silver detailing with freshwater pearl setting.",
    care: careDelicate + " " + careSilver,
    order: 11,
  },
  {
    handle: "baroque-freshwater-pearl-ring",
    name: "Baroque — Freshwater Pearl Ring",
    sku: "AL012",
    kind: "jewellery",
    collection: "botanica",
    category: "Rings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.ringsReflect, alt: "Baroque pearl ring with a sculptural silver setting" },
      { src: IMG.heroRings, alt: "Pearl and silver ring worn on the hand" },
      { src: IMG.crystals, alt: "Freshwater pearl in close detail" },
    ],
    summary:
      "A baroque freshwater pearl rests within a sculptural silver setting, celebrating the beauty of irregular form.",
    description: [
      "Baroque embraces the individuality of natural form. Rather than seeking perfect symmetry, the design allows the pearl’s irregular contours to become the focal point.",
      "The pearl’s softly luminous surface contrasts with the silver, creating an understated yet distinctive piece.",
    ],
    options: [],
    materials: "Fine Silver · Freshwater Pearl",
    material:
      "999 Fine Silver (Main Body); Freshwater Pearl (each pearl may naturally differ in colour and shape)",
    sizeFit: RING_FIT,
    weight: "Approx. 6.4 g",
    craftsmanship:
      "Sculptural silver setting with freshwater pearl detailing and a carefully finished surface.",
    care: careDelicate + " " + careSilver,
    sizeGuide: { mens: false },
    order: 12,
  },

  /* ================= Materia ================= */
  {
    handle: "geometry-rhombus-stud-earrings",
    name: "Geometry — Rhombus-shaped Stud Earrings",
    sku: "AL013-WHT / AL013-PUR",
    kind: "jewellery",
    collection: "materia",
    category: "Earrings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "white-moonstone",
        sku: "AL013-WHT",
        label: "White Moonstone",
        swatch: "#e8e5dd",
        image: 0,
        options: { Stone: "White Moonstone" },
        stock: "low",
        stockCount: 4,
      },
      {
        id: "purple-moonstone",
        sku: "AL013-PUR",
        label: "Purple Moonstone",
        swatch: "#9b84a8",
        image: 1,
        options: { Stone: "Purple Moonstone" },
        stock: "low",
        stockCount: 1,
      },
    ],
    images: [
      { src: IMG.crystals, alt: "Rhombus silver stud earrings set with white moonstone" },
      { src: IMG.crystalsDark, alt: "Rhombus silver stud earrings set with purple moonstone" },
      { src: IMG.earringModel, alt: "Geometric stud earrings worn on the ear" },
    ],
    summary:
      "Geometric silver stud earrings accented with moonstone — structured lines meeting a gentle, luminous contrast.",
    description: [
      "Geometry explores the relationship between geometry and natural materials. The structured silver setting frames the soft appearance of moonstone, creating a balance between precision and organic beauty.",
      "Offered with white or purple moonstone; each stone is natural and varies slightly.",
    ],
    options: [
      {
        name: "Stone",
        kind: "swatch",
        values: [
          { value: "White Moonstone", swatch: "#e8e5dd", image: 0 },
          { value: "Purple Moonstone", swatch: "#9b84a8", image: 1 },
        ],
      },
    ],
    materials: "Fine Silver · Moonstone",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Ear Posts); Moonstone",
    weight: "Approx. 4.9 g",
    craftsmanship: "Geometric silver detailing with moonstone setting and a carefully finished surface.",
    care: careDelicate + " " + careSilver,
    order: 13,
  },
  {
    handle: "cross-sculptural-ring",
    name: "Cross — Sculptural Ring",
    sku: "AL014-W / AL014-M",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "women",
        sku: "AL014-W",
        fit: "women",
        stock: "low",
        stockCount: 3,
        card: false,
      },
      { id: "men", sku: "AL014-M", fit: "men", stock: "low", stockCount: 2, card: false },
    ],
    images: [
      { src: IMG.sculptRing, alt: "Sculptural silver ring with a brass cross detail" },
      { src: IMG.heroRings, alt: "Cross ring worn on the hand" },
      { src: IMG.handsTool, alt: "Silversmith finishing a sculptural ring" },
    ],
    summary:
      "A sculptural silver ring featuring a contrasting brass cross detail.",
    description: [
      "Cross explores the visual relationship between contrasting metals. The cooler lustre of silver meets the warmer tone of brass, creating a distinctive composition defined by material, balance and form.",
      "Made in women’s and men’s standard sizes, both open-ended and slightly adjustable.",
    ],
    options: [],
    materials: "Fine Silver · Brass",
    material: "999 Fine Silver (Main Body); Brass Cross Detail",
    sizeFit: `${RING_FIT} · ${RING_FIT_MENS}`,
    weight: "Approx. 8.4 g",
    craftsmanship: "Sculptural silver form with contrasting brass detailing.",
    care: careSilver,
    sizeGuide: { mens: true },
    order: 14,
  },
  {
    handle: "strata-rock-texture-ring",
    name: "Strata — Rock Texture Ring",
    sku: "AL015-W / AL015-M",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "women",
        sku: "AL015-W",
        fit: "women",
        stock: "low",
        stockCount: 3,
        card: false,
      },
      { id: "men", sku: "AL015-M", fit: "men", stock: "low", stockCount: 2, card: false },
    ],
    images: [
      { src: IMG.twistRing, alt: "Textured silver ring with layered rock-like surfaces" },
      { src: IMG.texture, alt: "Rock-textured silver surface in close detail" },
      { src: IMG.heroRings, alt: "Textured silver ring worn on the hand" },
    ],
    summary:
      "Inspired by the layered textures of weathered stone, combining an expressive surface with a sculptural silhouette.",
    description: [
      "Strata reflects the quiet transformation of natural materials over time. Its irregular surface evokes the marks left by erosion, revealing beauty through texture, depth and imperfection.",
      "Made in women’s and men’s standard sizes, both open-ended and slightly adjustable.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver",
    sizeFit: `${RING_FIT} · ${RING_FIT_MENS}`,
    weight: "Approx. 8.65 g",
    craftsmanship: "Rock-inspired textured surface with a carefully finished surface.",
    care: careSilver,
    sizeGuide: { mens: true },
    order: 15,
  },
  {
    handle: "time-bark-textured-ring",
    name: "Time — Bark Textured Ring",
    sku: "AL016",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.ringWood, alt: "Bark textured silver ring resting on wood" },
      { src: IMG.texture, alt: "Raised silver surface reminiscent of weathered bark" },
      { src: IMG.ringsReflect, alt: "Textured ring catching the light" },
    ],
    summary:
      "An open sculptural ring with raised, irregular surfaces reminiscent of weathered bark.",
    description: [
      "Time takes its cues from the layered textures of trees and the marks left by years. Each ridge and shadow gives the silver an earthy, tactile presence.",
      "The open form allows a small adjustment to fit.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver",
    sizeFit: RING_FIT,
    weight: "Approx. 9 g",
    craftsmanship: "Bark-inspired textured silver with carefully finished surface detailing.",
    care: careSilver,
    sizeGuide: { mens: false },
    order: 16,
  },
  {
    handle: "trace-textured-ring",
    name: "Trace — Textured Ring",
    sku: "AL017-RND-W / AL017-IRR-W",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "round",
        sku: "AL017-RND-W",
        label: "Round Form",
        image: 0,
        options: { Form: "Round" },
      },
      {
        id: "irregular",
        sku: "AL017-IRR-W",
        label: "Irregular Form",
        image: 1,
        options: { Form: "Irregular" },
      },
    ],
    images: [
      { src: IMG.ringsReflect, alt: "Trace ring with a regular round silver form" },
      { src: IMG.sculptRing, alt: "Trace ring with an irregular hand-shaped silver form" },
      { src: IMG.texture, alt: "Faceted silver surface reflecting light" },
    ],
    summary:
      "A slim band carrying a faceted silver form, its surface reflecting light in different directions.",
    description: [
      "Trace explores the marks and planes created as metal is shaped by hand. A compact, expressive piece with a hand-shaped finish.",
      "Made in a regular round form or an irregular form — each one subtly different.",
    ],
    options: [
      {
        name: "Form",
        kind: "pill",
        values: [
          { value: "Round", image: 0 },
          { value: "Irregular", image: 1 },
        ],
      },
    ],
    materials: "Fine Silver",
    material: "999 Fine Silver",
    sizeFit: RING_FIT,
    weight: "Approx. 3.6 g",
    craftsmanship: "Carefully finished silver, with an emphasis on texture, trace and material.",
    care: careSilver,
    sizeGuide: { mens: false },
    order: 17,
  },
  {
    handle: "trace-textured-pendant-necklace",
    name: "Trace — Textured Pendant Necklace",
    sku: "AL018-RND / AL018-IRR",
    kind: "jewellery",
    collection: "materia",
    category: "Necklaces",
    price: null,
    stock: "available",
    variants: [
      {
        id: "round",
        sku: "AL018-RND",
        label: "Round Form",
        image: 0,
        options: { Form: "Round" },
      },
      {
        id: "irregular",
        sku: "AL018-IRR",
        label: "Irregular Form",
        image: 1,
        options: { Form: "Irregular" },
      },
    ],
    images: [
      { src: IMG.circleNecklace, alt: "Trace pendant necklace with a round silver form" },
      { src: IMG.necklaceLinen, alt: "Trace pendant necklace with an irregular silver form" },
      { src: IMG.chain, alt: "Fine silver chain detail" },
    ],
    summary:
      "A small silver pendant with folds, facets and contrasting highlights.",
    description: [
      "A fragment of texture held close: Trace draws attention to the surface of silver itself.",
      "Its quiet sculptural presence makes it easy to wear alone or to layer.",
    ],
    options: [
      {
        name: "Form",
        kind: "pill",
        values: [
          { value: "Round", image: 0 },
          { value: "Irregular", image: 1 },
        ],
      },
    ],
    materials: "Fine Silver",
    material: "999 Fine Silver (Pendant/Main Body); 925 Sterling Silver (Chain)",
    weight: "Approx. 3.89 g",
    craftsmanship: "Carefully finished silver, with an emphasis on texture, trace and material.",
    care: careSilver,
    order: 18,
  },

  /* ================= Papillon ================= */
  {
    handle: "papillon-pearl-enamel-butterfly-ring",
    name: "Papillon — Pearl & Enamel Butterfly Ring",
    sku: "AL019-GRN / AL019-BLU / AL019-YLW",
    kind: "jewellery",
    collection: "papillon",
    category: "Rings",
    price: null,
    stock: "available",
    variants: [
      {
        id: "forest-green",
        sku: "AL019-GRN",
        label: "Forest Green",
        swatch: "#1f6b52",
        image: 0,
        options: { "Enamel Colour": "Forest Green" },
      },
      {
        id: "lake-blue",
        sku: "AL019-BLU",
        label: "Lake Blue",
        swatch: "#5d87a0",
        image: 1,
        options: { "Enamel Colour": "Lake Blue" },
      },
      {
        id: "citrine-yellow",
        sku: "AL019-YLW",
        label: "Citrine Yellow",
        swatch: "#c9b447",
        image: 2,
        options: { "Enamel Colour": "Citrine Yellow" },
      },
    ],
    images: [
      { src: IMG.papillonModel, alt: "Green enamel butterfly ring with a freshwater pearl, worn on the hand" },
      { src: IMG.papillonBlue, alt: "Blue enamel butterfly ring with a freshwater pearl" },
      { src: IMG.papillonYellow, alt: "Yellow enamel butterfly ring draped over driftwood" },
    ],
    summary:
      "A silver ring pairing delicate enamel wings with the soft lustre of a freshwater pearl.",
    description: [
      "Papillon captures the fleeting beauty of a butterfly in motion. The interplay of silver and enamel reflects a sense of freedom and transformation, expressed through an understated contemporary design.",
      "Offered in green, blue or yellow enamel; each wing is enamelled by hand, so colour sits slightly differently on every piece.",
    ],
    options: [enamelOption({ green: 0, blue: 1, yellow: 2 })],
    materials: "Fine Silver · Freshwater Pearl · Enamel",
    material:
      "999 Fine Silver (Main Body); Freshwater Pearl (each pearl may naturally differ in colour and shape); Enamel",
    sizeFit: RING_FIT,
    weight: "Approx. 4.6 g",
    craftsmanship: "High-temperature enamel detailing with freshwater pearl setting.",
    care: careDelicate + " " + careSilver,
    sizeGuide: { mens: false },
    isNew: true,
    order: 19,
  },
  {
    handle: "papillon-enamel-butterfly-necklace",
    name: "Papillon — Enamel Butterfly Necklace",
    sku: "AL020-GRN / AL020-BLU / AL020-YLW",
    kind: "jewellery",
    collection: "papillon",
    category: "Necklaces",
    price: null,
    stock: "available",
    variants: [
      {
        id: "forest-green",
        sku: "AL020-GRN",
        label: "Forest Green",
        swatch: "#1f6b52",
        image: 0,
        options: { "Enamel Colour": "Forest Green" },
      },
      {
        id: "lake-blue",
        sku: "AL020-BLU",
        label: "Lake Blue",
        swatch: "#5d87a0",
        image: 1,
        options: { "Enamel Colour": "Lake Blue" },
      },
      {
        id: "citrine-yellow",
        sku: "AL020-YLW",
        label: "Citrine Yellow",
        swatch: "#c9b447",
        image: 2,
        options: { "Enamel Colour": "Citrine Yellow" },
      },
    ],
    images: [
      { src: IMG.papillonModel, alt: "Green enamel butterfly necklace worn at the collarbone" },
      { src: IMG.papillonBlue, alt: "Blue enamel butterfly pendant on a fine chain" },
      { src: IMG.papillonYellow, alt: "Yellow enamel butterfly pendant draped over driftwood" },
    ],
    summary: "A single enamel butterfly carried on a fine silver chain.",
    description: [
      "Papillon captures the fleeting beauty of a butterfly in motion. The interplay of silver and enamel reflects a sense of freedom and transformation, expressed through an understated contemporary design.",
      "Offered in green, blue or yellow enamel, to be worn alone or layered.",
    ],
    options: [enamelOption({ green: 0, blue: 1, yellow: 2 })],
    materials: "Fine Silver · Enamel",
    material: "999 Fine Silver (Pendant/Main Body); 925 Sterling Silver (Chain); Enamel",
    weight: "Approx. 3.5 g",
    craftsmanship: "Butterfly-inspired silver detailing with high-temperature enamel accents.",
    care: careDelicate + " " + careSilver,
    isNew: true,
    order: 20,
  },
  {
    handle: "papillon-enamel-butterfly-bracelet",
    name: "Papillon — Enamel Butterfly Bracelet",
    sku: "AL021-GRN / AL021-BLU / AL021-YLW",
    kind: "jewellery",
    collection: "papillon",
    category: "Bracelets",
    price: null,
    stock: "available",
    variants: [
      {
        id: "forest-green",
        sku: "AL021-GRN",
        label: "Forest Green",
        swatch: "#1f6b52",
        image: 0,
        options: { "Enamel Colour": "Forest Green" },
      },
      {
        id: "lake-blue",
        sku: "AL021-BLU",
        label: "Lake Blue",
        swatch: "#5d87a0",
        image: 1,
        options: { "Enamel Colour": "Lake Blue" },
      },
      {
        id: "citrine-yellow",
        sku: "AL021-YLW",
        label: "Citrine Yellow",
        swatch: "#c9b447",
        image: 2,
        options: { "Enamel Colour": "Citrine Yellow" },
      },
    ],
    images: [
      { src: IMG.papillonModel, alt: "Green enamel butterfly bracelet worn on the wrist" },
      { src: IMG.papillonBlue, alt: "Blue enamel butterfly on a beaded silver chain" },
      { src: IMG.papillonYellow, alt: "Yellow enamel butterfly bracelet draped over driftwood" },
    ],
    summary: "An enamel butterfly suspended between fine beaded chains.",
    description: [
      "Papillon captures the fleeting beauty of a butterfly in motion. The interplay of silver and enamel reflects a sense of freedom and transformation, expressed through an understated contemporary design.",
      "Offered in green, blue or yellow enamel.",
    ],
    options: [enamelOption({ green: 0, blue: 1, yellow: 2 })],
    materials: "Fine Silver · Enamel",
    material: "999 Fine Silver (Main Body); 925 Sterling Silver (Chain); Enamel",
    weight: "Approx. 3.6 g",
    craftsmanship: "Delicate butterfly-inspired silver detailing with high-temperature enamel accents.",
    care: careDelicate + " " + careSilver,
    order: 21,
  },

  /* ================= Miniature Silverware ================= */
  {
    handle: "miniature-wine-cup-pendant-a",
    name: "Miniature Silverware — Wine Cup Pendant A",
    sku: "AL022",
    kind: "jewellery",
    collection: "miniature-silverware",
    category: "Pendants",
    price: null,
    stock: "available",
    images: [
      { src: IMG.sphere, alt: "Miniature silver wine cup pendant held between the hands" },
      { src: IMG.necklaceLinen, alt: "Miniature silver pendant on a coloured cord" },
      { src: IMG.texture, alt: "Gold leaf accent on a hand-worked silver surface" },
    ],
    summary:
      "A miniature wine cup reimagined as a silver pendant, with touches of gold leaf across its surface.",
    description: [
      "Miniature Silverware explores the relationship between objects and adornment. By reducing the scale of a familiar vessel, the design invites a closer appreciation of its form and texture.",
      "A sculptural silhouette that turns a familiar object into a distinctive piece of wearable silverware.",
    ],
    options: [],
    materials: "Fine Silver · Copper · Gold Leaf",
    material: "999 Fine Silver (Main Body); Copper (Handle); Gold Leaf Accents (Decoration)",
    weight: "Approx. 18 g · Capacity approx. 10 ml",
    craftsmanship:
      "A sculptural miniature silver cup, delicately accented with touches of gold leaf across its surface.",
    care: careSilver,
    purchaseNote: {
      title: "Included cord",
      body: "Includes a coloured cord in a randomly selected colour. The cord colour cannot be chosen, and the colour supplied may differ from that shown in the photographs.",
    },
    isNew: true,
    order: 22,
  },
  {
    handle: "miniature-wine-cup-pendant-b",
    name: "Miniature Silverware — Wine Cup Pendant B",
    sku: "AL023",
    kind: "jewellery",
    collection: "miniature-silverware",
    category: "Pendants",
    price: null,
    stock: "available",
    images: [
      { src: IMG.sphere, alt: "Miniature silver wine cup pendant held in the hand" },
      { src: IMG.necklaceLinen, alt: "Miniature silver pendant on a coloured cord" },
      { src: IMG.texture, alt: "Gold leaf accent on a hand-worked silver surface" },
    ],
    summary:
      "A second miniature wine cup, shaped by hand and finished with touches of gold leaf.",
    description: [
      "Miniature Silverware explores the relationship between objects and adornment. By reducing the scale of a familiar vessel, the design invites a closer appreciation of its form and texture.",
      "Worn close to the body, it carries the character of the silversmith’s workshop at jewellery scale.",
    ],
    options: [],
    materials: "Fine Silver · Copper · Gold Leaf",
    material: "999 Fine Silver (Main Body); Copper (Handle); Gold Leaf Accents (Decoration)",
    weight: "Approx. 18 g · Capacity approx. 10 ml",
    craftsmanship:
      "A sculptural miniature silver cup, delicately accented with touches of gold leaf across its surface.",
    care: careSilver,
    purchaseNote: {
      title: "Included cord",
      body: "Includes a coloured cord in a randomly selected colour. The cord colour cannot be chosen, and the colour supplied may differ from that shown in the photographs.",
    },
    order: 23,
  },

  /* ================= Objects ================= */
  {
    handle: "sculpt-hand-hammered-fine-silver-cups",
    name: "Sculpt — Hand-Hammered Fine Silver Cups | Set of Two",
    sku: "AL024",
    kind: "object",
    collection: "objects",
    category: "Cups",
    price: null,
    stock: "available",
    images: [
      { src: IMG.sculptSet, alt: "Sculpt hand-hammered fine silver cups on a wooden tray" },
      { src: IMG.sculptPour, alt: "Coffee being poured into a Sculpt silver cup" },
      { src: IMG.sculptBar, alt: "A pair of Sculpt cups on a wooden tray in a dimly lit bar" },
    ],
    summary:
      "A pair of sculptural fine-silver cups, each shaped entirely by hand through thousands of hammer strikes.",
    description: [
      "A pair of sculptural fine-silver cups, each shaped entirely by hand through thousands upon thousands of hammer strikes into a distinct, irregular form. Their gently uneven rims and shifting surfaces celebrate the expressive character of silver as both material and object.",
      "A Form Shaped by Time and Hands. Sculpt begins with a simple idea: allowing silver to take shape through the rhythm of the hammer. In the hands of skilled local silversmiths, a traditional craft passed down through generations becomes a contemporary expression of form.",
      "Through countless deliberate strikes the metal is gradually shaped, its surface recording the quiet dialogue between material, tool and maker. No two cups are exactly alike.",
    ],
    options: [],
    materials: "Fine Silver",
    material: "999 Fine Silver",
    weight: "Approx. 133 g per cup · approx. 266 g per pair",
    craftsmanship:
      "Hand-hammered by traditional silversmiths. Each cup is individually shaped by skilled local silversmiths using traditional hand-hammering techniques; thousands upon thousands of hammer strikes gradually transform silver into its sculptural form.",
    care: "Handle with care to avoid scratches, dents and unnecessary friction. Hand wash in warm water with a mild detergent and dry immediately with a soft cloth. Not dishwasher safe. See Silver Objects in the Care Guide.",
    soldAsPair: true,
    salesMethod: "Sold as a pair. First release: one set available.",
    objectSpecs: {
      dimensions: TBC,
      capacity: "Approx. 280 ml per cup",
      weight: "Approx. 133 g per cup · approx. 266 g per pair",
      hallmarking:
        "Submitted to a UK Assay Office for independent testing and hallmarking before dispatch.",
      dispatch: "Hallmarked to order — the dispatch date is confirmed after your order is placed.",
      material: "999 Fine Silver",
    },
    isNew: true,
    order: 1,
  },
  {
    handle: "bespoke-silver-object",
    name: "Bespoke Silver Object",
    sku: "AL025",
    kind: "object",
    collection: "objects",
    category: "Bespoke",
    price: null,
    stock: "enquire",
    images: [
      { src: IMG.benchTorch, alt: "Silversmith working on a piece at the bench with a torch" },
      { src: IMG.hammering, alt: "Silversmith hammering metal in the workshop" },
    ],
    summary: "A handcrafted silver object, created around your vision.",
    description: ["Bespoke pieces are made by enquiry only."],
    options: [],
    materials: "Silver, by commission",
    material: TBC,
    weight: TBC,
    craftsmanship: "Made in collaboration with skilled silversmiths.",
    care: "",
    href: "/bespoke",
    order: 2,
  },
];

/* ---------- Lookups ---------- */

export function getProduct(handle: string) {
  return products.find((p) => p.handle === handle);
}

export function getVariant(product: Product, id?: string | null) {
  if (!id || !product.variants) return undefined;
  return product.variants.find((v) => v.id === id);
}

/** The style currently described by the shopper's selections. */
export function resolveVariant(
  product: Product,
  selected: Record<string, string>,
  fit?: "women" | "men" | "",
) {
  if (!product.variants?.length) return undefined;
  return product.variants.find((v) => {
    if (v.fit && v.fit !== fit) return false;
    const keys = Object.keys(v.options ?? {});
    if (keys.length) return keys.every((k) => selected[k] === v.options![k]);
    return Boolean(v.fit && v.fit === fit);
  });
}

export function skuFor(
  product: Product,
  selected: Record<string, string> = {},
  fit?: "women" | "men" | "",
) {
  return resolveVariant(product, selected, fit)?.sku ?? product.sku;
}

export function stockFor(
  product: Product,
  selected: Record<string, string> = {},
  fit?: "women" | "men" | "",
): { stock: StockStatus; stockCount?: number } {
  const v = resolveVariant(product, selected, fit);
  return v?.stock
    ? { stock: v.stock, stockCount: v.stockCount }
    : { stock: product.stock, stockCount: product.stockCount };
}

export function productHref(product: Product, variant?: Variant) {
  if (product.href) return product.href;
  return `/products/${product.handle}${variant ? `?v=${variant.id}` : ""}`;
}

export type ProductCardItem = { product: Product; variant?: Variant };

/** One card per colourway / form; falls back to a single card per product. */
export function cardsFor(product: Product): ProductCardItem[] {
  const sellable = (product.variants ?? []).filter((v) => v.card !== false);
  return sellable.length
    ? sellable.map((variant) => ({ product, variant }))
    : [{ product }];
}

export function cardsForAll(list: Product[]): ProductCardItem[] {
  return list.flatMap(cardsFor);
}

/** The Objects page hero feature — swap this handle to feature a future object without redesigning. */
export const FEATURED_OBJECT = {
  handle: "sculpt-hand-hammered-fine-silver-cups",
  eyebrow: "Featured Object",
  title: "Sculpt",
  subtitle: "Hand-Hammered Fine Silver Cups | Set of Two",
  description:
    "A pair of sculptural fine-silver cups, each shaped entirely by hand through thousands of hammer strikes.",
  cta: "Discover Sculpt",
  images: [IMG.sculptSet, IMG.sculptPour],
};

export const stockLabel = (p: Pick<Product, "stock" | "stockCount">) => {
  switch (p.stock) {
    case "available":
      return "Available";
    case "low":
      return `Only ${p.stockCount ?? 1} Left`;
    case "sold-out":
      return "Sold Out";
    case "coming-soon":
      return "Coming Soon";
    case "enquire":
      return "Enquire Only";
  }
};

export const isPurchasable = (p: Pick<Product, "stock">) =>
  p.stock === "available" || p.stock === "low";
