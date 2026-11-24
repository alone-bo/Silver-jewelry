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
  /** Labelled size group, e.g. "Women's" / "Men's" */
  group?: string;
  unavailable?: boolean;
};

export type ProductOption = {
  name: string;
  kind: "swatch" | "pill" | "size";
  values: OptionValue[];
  /** When true the shopper must actively choose (no default) */
  required?: boolean;
  helper?: string;
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
  images: ProductImage[];
  summary: string;
  description: string[];
  options: ProductOption[];
  material: string;
  sizeFit?: string;
  weight: string;
  craftsmanship: string;
  care: string;
  objectSpecs?: ObjectSpecs;
  /** Objects: how the piece is sold, e.g. as a pair or a single set */
  soldAsPair?: boolean;
  salesMethod?: string;
  /** Objects: making, hallmarking and dispatch timing */
  leadTime?: string;
  /** Links the card to another page instead of the product template (e.g. bespoke enquiries) */
  href?: string;
  isNew?: boolean;
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
    description: "Wine-cup-inspired silver pendants, conceived as miniature wearable art.",
    banner: IMG.sphere,
    bannerAlt: "A small polished silver form held between two hands",
    card: IMG.sphere,
    kind: "jewellery",
  },
  {
    handle: "objects",
    title: "Objects",
    description:
      "Discover handcrafted silver objects that bring together traditional craftsmanship and contemporary form.",
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

const womensSizes = ["UK J", "UK K", "UK L", "UK M", "UK N", "UK O"].map((v) => ({
  value: `Women's · ${v}`,
  group: "Women's",
}));
const mensSizes = ["UK R", "UK S", "UK T", "UK U", "UK V", "UK W"].map((v) => ({
  value: `Men's · ${v}`,
  group: "Men's",
}));

const ringSize = (includeMens = true): ProductOption => ({
  name: "Size",
  kind: "size",
  required: true,
  helper: "Size guide",
  values: includeMens ? [...womensSizes, ...mensSizes] : womensSizes,
});

const finish = (heatImage?: number): ProductOption => ({
  name: "Finish",
  kind: "pill",
  values: [
    { value: "Natural Silver", image: 0 },
    { value: "Heat-Coloured", heatColoured: true, image: heatImage },
  ],
});

const jewelleryCare =
  "Store separately in the Argent Lune pouch, away from moisture. Remove before swimming, bathing or applying perfume. Polish gently with a soft silver cloth. See the Care Guide for full guidance.";

export const products: Product[] = [
  // — Materia
  {
    handle: "materia-molten-ring",
    name: "Materia - Molten Ring",
    sku: "AL011",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.sculptRing, alt: "Materia Molten Ring in natural silver on a pale background" },
      { src: IMG.heroRings, alt: "Sculptural silver rings worn on the hand" },
      { src: IMG.texture, alt: "Close detail of a textured silver surface" },
    ],
    summary: "A soft, sculptural band with a surface that catches light unevenly.",
    description: [
      "Shaped to feel as though the silver were still in motion, the Molten Ring carries the gentle irregularities of a piece formed by hand.",
      "Available in natural silver or a heat-coloured finish, where controlled heat draws subtle tones from the metal’s surface.",
    ],
    options: [finish(2), ringSize(true)],
    material: TBC,
    sizeFit:
      "Offered in women’s and men’s UK ring sizes. Please refer to the size guide before ordering.",
    weight: TBC,
    craftsmanship:
      "Shaped and finished by hand. Slight variations in form and surface are part of each piece’s character.",
    care: jewelleryCare,
    isNew: true,
    order: 1,
  },
  {
    handle: "materia-hammered-band",
    name: "Materia - Hammered Band",
    sku: "AL012",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "low",
    stockCount: 3,
    images: [
      { src: IMG.twistRing, alt: "Materia Hammered Band with a ribbed, flowing surface" },
      { src: IMG.texture, alt: "Hammered silver texture in close detail" },
      { src: IMG.hammer, alt: "Silversmith’s hammer resting on a steel block" },
    ],
    summary: "A band defined by the rhythm of the hammer.",
    description: [
      "Each facet on the Hammered Band records a single strike. No two bands are identical — the texture is a direct trace of the making.",
    ],
    options: [finish(1), ringSize(true)],
    material: TBC,
    sizeFit: "Offered in women’s and men’s UK ring sizes.",
    weight: TBC,
    craftsmanship: "Hand-hammered and hand-finished.",
    care: jewelleryCare,
    order: 2,
  },
  {
    handle: "materia-texture-pendant",
    name: "Materia - Texture Pendant",
    sku: "AL013",
    kind: "jewellery",
    collection: "materia",
    category: "Necklaces",
    price: null,
    stock: "available",
    images: [
      { src: IMG.circleNecklace, alt: "Materia Texture Pendant on a pale wall" },
      { src: IMG.texture, alt: "Textured silver surface detail" },
    ],
    summary: "A quiet circular form with a worked surface.",
    description: [
      "A minimal pendant where texture, rather than ornament, gives the piece its presence.",
    ],
    options: [finish(1)],
    material: TBC,
    sizeFit: `Chain length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Surface worked by hand.",
    care: jewelleryCare,
    order: 3,
  },
  {
    handle: "materia-signet-ring",
    name: "Materia - Signet Ring",
    sku: "AL014",
    kind: "jewellery",
    collection: "materia",
    category: "Rings",
    price: null,
    stock: "sold-out",
    images: [
      { src: IMG.ringWood, alt: "Materia Signet Ring resting on a wooden surface" },
      { src: IMG.handsTool, alt: "Silversmith working a ring at the bench" },
    ],
    summary: "A contemporary signet with a softly worn edge.",
    description: ["A modern take on the signet, finished by hand to a soft, satin lustre."],
    options: [ringSize(true)],
    material: TBC,
    sizeFit: "Offered in women’s and men’s UK ring sizes.",
    weight: TBC,
    craftsmanship: "Hand-finished.",
    care: jewelleryCare,
    order: 4,
  },
  // — Botanica
  {
    handle: "botanica-branch-pendant",
    name: "Botanica - Branch Pendant",
    sku: "AL015",
    kind: "jewellery",
    collection: "botanica",
    category: "Necklaces",
    price: null,
    stock: "available",
    images: [
      { src: IMG.branch, alt: "Botanica Branch Pendant on a reflective surface" },
      { src: IMG.leaves, alt: "Silver botanical piece laid on linen with leaves" },
    ],
    summary: "Fine silver branches, gathered into a single form.",
    description: [
      "Inspired by winter branches, the pendant traces fine, irregular lines that read differently from every angle.",
    ],
    options: [],
    material: TBC,
    sizeFit: `Chain length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Detailed and finished by hand.",
    care: jewelleryCare,
    isNew: true,
    order: 5,
  },
  {
    handle: "botanica-leaf-ring",
    name: "Botanica - Leaf Ring",
    sku: "AL016",
    kind: "jewellery",
    collection: "botanica",
    category: "Rings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.ringsReflect, alt: "Botanica Leaf Ring with organic curved forms" },
      { src: IMG.handsBench, alt: "Silver ring worn on the hand" },
    ],
    summary: "A leaf, curled softly around the finger.",
    description: ["An organic ring whose outline follows the gentle curve of a single leaf."],
    options: [ringSize(true)],
    material: TBC,
    sizeFit: "Offered in women’s and men’s UK ring sizes.",
    weight: TBC,
    craftsmanship: "Shaped by hand.",
    care: jewelleryCare,
    order: 6,
  },
  {
    handle: "botanica-twig-earrings",
    name: "Botanica - Twig Earrings",
    sku: "AL017",
    kind: "jewellery",
    collection: "botanica",
    category: "Earrings",
    price: null,
    stock: "available",
    images: [
      { src: IMG.earringModel, alt: "Model wearing slender silver drop earrings" },
      { src: IMG.leaves, alt: "Botanical silver detail on linen" },
    ],
    summary: "Slender drops with the irregularity of a fallen twig.",
    description: ["Light enough for every day, with a quiet sense of movement."],
    options: [],
    material: TBC,
    sizeFit: `Drop length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Formed and finished by hand.",
    care: jewelleryCare,
    order: 7,
  },
  {
    handle: "botanica-fern-necklace",
    name: "Botanica - Fern Necklace",
    sku: "AL018",
    kind: "jewellery",
    collection: "botanica",
    category: "Necklaces",
    price: null,
    stock: "low",
    stockCount: 2,
    images: [
      { src: IMG.necklaceLinen, alt: "Botanica Fern Necklace laid on soft linen" },
      { src: IMG.circleNecklace, alt: "Silver necklace detail" },
    ],
    summary: "A fine chain with small, scattered botanical details.",
    description: ["A delicate necklace, designed to be layered or worn alone."],
    options: [],
    material: TBC,
    sizeFit: `Chain length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Assembled and finished by hand.",
    care: jewelleryCare,
    order: 8,
  },
  // — Papillon
  {
    handle: "papillon-chain-bracelet",
    name: "Papillon - Chain Bracelet",
    sku: "AL019",
    kind: "jewellery",
    collection: "papillon",
    category: "Bracelets",
    price: null,
    stock: "available",
    images: [
      {
        src: IMG.papillonBlue,
        alt: "Papillon Chain Bracelet with blue enamel butterfly on a dark background",
      },
      {
        src: IMG.papillonYellow,
        alt: "Papillon Chain Bracelet with yellow enamel butterfly draped over driftwood",
      },
      { src: IMG.papillonModel, alt: "Papillon pieces worn by a model" },
    ],
    summary: "An enamel butterfly suspended on a fine silver chain.",
    description: [
      "A single butterfly rests between beaded chains, its enamel wings introducing a soft note of colour.",
      "Choose from blue or yellow enamel. Enamel colour may vary slightly from piece to piece.",
    ],
    options: [
      {
        name: "Enamel Colour",
        kind: "swatch",
        values: [
          { value: "Lake Blue", swatch: "#7fa6b4", image: 0 },
          { value: "Citrine Yellow", swatch: "#c9c24a", image: 1 },
        ],
      },
    ],
    material: TBC,
    sizeFit: `Bracelet length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Hand-finished silver with hand-applied enamel.",
    care: "Enamel should be protected from knocks and abrasive cloths. " + jewelleryCare,
    isNew: true,
    order: 9,
  },
  {
    handle: "papillon-pearl-ring",
    name: "Papillon - Pearl Ring",
    sku: "AL020",
    kind: "jewellery",
    collection: "papillon",
    category: "Rings",
    price: null,
    stock: "low",
    stockCount: 1,
    images: [
      {
        src: IMG.papillonModel,
        alt: "Papillon Pearl Ring with green enamel butterfly worn on the hand",
      },
      { src: IMG.papillonBlue, alt: "Papillon butterfly detail" },
    ],
    summary: "A green enamel butterfly paired with a single pearl.",
    description: [
      "An open ring balancing a jewel-green butterfly against the soft lustre of a pearl.",
    ],
    options: [
      {
        name: "Enamel Colour",
        kind: "swatch",
        values: [{ value: "Forest Green", swatch: "#1f6b52" }],
      },
      ringSize(false),
    ],
    material: TBC,
    sizeFit: "Offered in women’s UK ring sizes.",
    weight: TBC,
    craftsmanship: "Hand-finished silver with hand-applied enamel and a set pearl.",
    care: "Pearls are delicate — wipe with a soft dry cloth after wear. " + jewelleryCare,
    order: 10,
  },
  {
    handle: "papillon-pendant-necklace",
    name: "Papillon - Pendant Necklace",
    sku: "AL021",
    kind: "jewellery",
    collection: "papillon",
    category: "Necklaces",
    price: null,
    stock: "available",
    images: [
      {
        src: IMG.papillonModel,
        alt: "Papillon Pendant Necklace with green enamel butterfly worn at the collarbone",
      },
      { src: IMG.papillonYellow, alt: "Papillon butterfly in yellow enamel" },
    ],
    summary: "A butterfly pendant resting at the collarbone.",
    description: [
      "A fine chain carries a single enamel butterfly, designed to sit lightly at the neck.",
    ],
    options: [
      {
        name: "Enamel Colour",
        kind: "swatch",
        values: [
          { value: "Forest Green", swatch: "#1f6b52", image: 0 },
          { value: "Citrine Yellow", swatch: "#c9c24a", image: 1, unavailable: true },
        ],
      },
    ],
    material: TBC,
    sizeFit: `Chain length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Hand-finished silver with hand-applied enamel.",
    care: jewelleryCare,
    order: 11,
  },
  {
    handle: "papillon-drop-earrings",
    name: "Papillon - Drop Earrings",
    sku: "AL022",
    kind: "jewellery",
    collection: "papillon",
    category: "Earrings",
    price: null,
    stock: "coming-soon",
    images: [
      { src: IMG.papillonYellow, alt: "Yellow enamel butterfly with long chain drops" },
      { src: IMG.papillonBlue, alt: "Blue enamel butterfly detail" },
    ],
    summary: "Butterflies trailing fine beaded chains.",
    description: ["Long, fluid drops that move with the wearer."],
    options: [],
    material: TBC,
    sizeFit: `Drop length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Hand-finished silver with hand-applied enamel.",
    care: jewelleryCare,
    order: 12,
  },
  // — Miniature Silverware
  {
    handle: "miniature-wine-cup-pendant",
    name: "Miniature Silverware - Wine Cup Pendant",
    sku: "AL023",
    kind: "jewellery",
    collection: "miniature-silverware",
    category: "Pendants",
    price: null,
    stock: "available",
    images: [
      { src: IMG.sphere, alt: "Miniature silver form held between the hands" },
      { src: IMG.necklaceLinen, alt: "Silver pendant on fine chain laid on linen" },
      { src: IMG.texture, alt: "Heat-coloured silver surface detail" },
    ],
    summary: "A wine cup in miniature, worn as a pendant.",
    description: ["A tiny echo of the silversmith’s wine cup, rendered at the scale of jewellery."],
    options: [finish(2)],
    material: TBC,
    sizeFit: `Pendant dimensions and chain length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Formed and finished by hand.",
    care: jewelleryCare,
    isNew: true,
    order: 13,
  },
  {
    handle: "miniature-tumbler-pendant",
    name: "Miniature Silverware - Tumbler Pendant",
    sku: "AL024",
    kind: "jewellery",
    collection: "miniature-silverware",
    category: "Pendants",
    price: null,
    stock: "available",
    images: [
      { src: IMG.chain, alt: "Silver chain on a pale background" },
      { src: IMG.sphere, alt: "Miniature silver form held in the hands" },
    ],
    summary: "A softly dented tumbler, scaled down to wear.",
    description: ["Inspired by our hand-hammered cups, reimagined as a wearable miniature."],
    options: [],
    material: TBC,
    sizeFit: `Pendant dimensions and chain length: ${TBC}`,
    weight: TBC,
    craftsmanship: "Hand-hammered in miniature.",
    care: jewelleryCare,
    order: 14,
  },
  {
    handle: "miniature-goblet-pendant",
    name: "Miniature Silverware - Goblet Pendant",
    sku: "AL025",
    kind: "jewellery",
    collection: "miniature-silverware",
    category: "Pendants",
    price: null,
    stock: "coming-soon",
    images: [
      { src: IMG.heartNecklace, alt: "Fine silver chain with small charms" },
      { src: IMG.sphere, alt: "Miniature silver form" },
    ],
    summary: "A goblet silhouette, in miniature.",
    description: ["A forthcoming addition to Miniature Silverware."],
    options: [],
    material: TBC,
    sizeFit: TBC,
    weight: TBC,
    craftsmanship: TBC,
    care: jewelleryCare,
    order: 15,
  },
  // — Objects
  {
    handle: "sculpt-hand-hammered-fine-silver-cups",
    name: "Sculpt - Hand-Hammered Fine Silver Cups | Set of Two",
    sku: "AL031",
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
      "A pair of sculptural silver cups, each patiently shaped by our skilled silversmiths through countless hammer strikes using traditional techniques.",
    description: [
      "A pair of sculptural silver cups, each patiently shaped by our skilled silversmiths through countless hammer strikes using traditional techniques.",
      "The softly indented walls are left to show the hand of the maker, so each cup carries its own slight differences in form and surface.",
    ],
    options: [],
    material: "Fine silver",
    weight: TBC,
    craftsmanship:
      "Hand-hammered using traditional silversmithing techniques. Every cup is unique.",
    care: "Hand wash in warm water with a mild detergent and dry immediately with a soft cloth. Not dishwasher safe. See Silver Objects in the Care Guide.",
    soldAsPair: true,
    salesMethod: "Sold as a pair — one set available in the first release.",
    leadTime:
      "Made and hallmarked to order. The dispatch date is confirmed after your order is placed.",
    objectSpecs: {
      dimensions: TBC,
      capacity: "Approx. 280 ml per cup",
      weight: "Approx. 133 g per cup · approx. 266 g per pair",
      hallmarking:
        "Submitted to a UK Assay Office for independent testing and hallmarking before dispatch.",
      dispatch: "Hallmarked to order — dispatch date confirmed after your order.",
      material: "999 fine silver",
    },
    isNew: true,
    order: 1,
  },
  {
    handle: "bespoke-silver-object",
    name: "Bespoke Silver Object",
    sku: "AL032",
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
    material: TBC,
    weight: TBC,
    craftsmanship: "Made in collaboration with skilled silversmiths.",
    care: "",
    href: "/bespoke",
    order: 2,
  },
];

export function getProduct(handle: string) {
  return products.find((p) => p.handle === handle);
}

export function productHref(p: Product) {
  return p.href ?? `/products/${p.handle}`;
}

/** The Objects page hero feature — swap this handle to feature a future object without redesigning. */
export const FEATURED_OBJECT = {
  handle: "sculpt-hand-hammered-fine-silver-cups",
  eyebrow: "Featured Object",
  title: "Sculpt",
  subtitle: "Hand-Hammered Fine Silver Cups | Set of Two",
  description:
    "A pair of sculptural silver cups, each patiently shaped by our skilled silversmiths through countless hammer strikes using traditional techniques.",
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
