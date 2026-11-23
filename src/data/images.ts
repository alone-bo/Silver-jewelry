const un = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * Central image library. Brand photography (Papillon & Sculpt) lives in /public/images.
 * Editorial stand-ins come from Unsplash and should be replaced with Argent Lune photography.
 */
export const IMG = {
  // Argent Lune brand photography
  papillonBlue: "/images/papillon-blue.jpg",
  papillonYellow: "/images/papillon-yellow.jpg",
  papillonModel: "/images/papillon-model.jpg",
  sculptSet: "/images/sculpt-set.jpg",
  sculptPour: "/images/sculpt-pour.jpg",
  sculptBar: "/images/sculpt-bar.jpg",

  // Editorial stand-ins
  heroRings: un("1791237835059-b9f32537b01c", 2400),
  sculptRing: un("1736520557871-f189e5640225"),
  branch: un("1786052337430-e5548b0b838a"),
  benchHands: un("1715374033196-0ff662284a7e"),
  benchTorch: un("1598724168411-9ba1e003a7fe", 2000),
  handsTool: un("1622424751566-d9f68043d404"),
  handsBench: un("1623365545467-d0f2c7ecd677"),
  soldering: un("1785809998813-ee7a68ec1346", 2000),
  hammer: un("1624382716270-4384e913766d"),
  hammering: un("1787422929310-a1b3d31d6b56", 2000),
  tools: un("1588389296194-42ab195d3965"),
  texture: un("1656055448477-94f0757aa0d4"),
  twistRing: un("1635190010609-8dcb53c17d3e"),
  ringsReflect: un("1786052336913-80c517350000"),
  earringModel: un("1611653842967-39eb011b2ca3"),
  circleNecklace: un("1634229475946-6099ad182cf4"),
  necklaceLinen: un("1585053736987-f817dc225fc5"),
  chain: un("1605884878538-6468614df578"),
  sphere: un("1786826940616-17775e1666d5"),
  ringWood: un("1668199021750-48996bbe035a"),
  leaves: un("1639690265259-38a93c0d5b79"),
  heartNecklace: un("1676329947145-99145926d3eb"),
  pendantsOnWood: un("1695799293824-7be723e37123", 2400),
  moonPendants: un("1695799285207-3d0bb311ee89"),
  ornatePendants: un("1711352637258-e75a2a6d4f52"),
  charms: un("1733356555996-6d62c16220c5"),
  sketching: un("1505569127510-bde1536937bc"),
  sketchingClose: un("1650783756094-25f4ef2e3d1f"),
  crystals: un("1790015885251-5be35e3fb577"),
  crystalsDark: un("1784662193369-bbb4fbf259f2"),
  craftsmanBench: un("1781617783301-554c857fc7ea"),
  artisanDetail: un("1761033105268-adae2087a552"),
  artisanLamp: un("1761027204911-d8c4ebe2e64d"),
  portraitNecklace: un("1645389692136-4b344532362f"),
  portraitWarm: un("1679466061812-211a6b737175"),
  woodland: un("1719909871663-16c3c8106ed6"),
};
