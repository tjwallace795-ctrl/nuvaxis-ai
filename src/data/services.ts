export type Service = {
  id: string;
  name: string;
  category:
    | "Knotless Braids"
    | "Box Braids"
    | "Twists"
    | "Locs"
    | "Cornrows & Stitch"
    | "Kids"
    | "Natural Hair"
    | "Add-ons";
  description: string;
  durationMin: number;
  priceFrom: number;
  priceTo?: number;
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "knotless-small",
    name: "Small Knotless Braids",
    category: "Knotless Braids",
    description:
      "Lightweight, scalp-friendly small knotless braids. Price varies by length; hair included.",
    durationMin: 420,
    priceFrom: 260,
    priceTo: 320,
    featured: true,
  },
  {
    id: "knotless-medium",
    name: "Medium Knotless Braids",
    category: "Knotless Braids",
    description:
      "Classic medium knotless braids with a natural, flat start. Hair included.",
    durationMin: 360,
    priceFrom: 220,
    priceTo: 280,
    featured: true,
  },
  {
    id: "knotless-large",
    name: "Large Knotless Braids",
    category: "Knotless Braids",
    description:
      "Statement large knotless braids — quicker install, bold look. Hair included.",
    durationMin: 300,
    priceFrom: 180,
    priceTo: 230,
  },
  {
    id: "knotless-jumbo",
    name: "Jumbo Knotless Braids",
    category: "Knotless Braids",
    description: "Oversized, lightweight knotless braids. Hair included.",
    durationMin: 240,
    priceFrom: 160,
    priceTo: 200,
  },
  {
    id: "boho-knotless",
    name: "Boho Knotless Braids",
    category: "Knotless Braids",
    description:
      "Knotless braids with curly human-hair ends for an effortless, bohemian finish.",
    durationMin: 480,
    priceFrom: 300,
    priceTo: 380,
    featured: true,
  },
  {
    id: "goddess-knotless",
    name: "Goddess Knotless Braids",
    category: "Knotless Braids",
    description:
      "Knotless braids detailed with wet-and-wavy curly pieces throughout.",
    durationMin: 480,
    priceFrom: 300,
    priceTo: 360,
  },
  {
    id: "box-small",
    name: "Small Box Braids",
    category: "Box Braids",
    description: "Traditional small box braids with clean square parting.",
    durationMin: 480,
    priceFrom: 250,
    priceTo: 310,
  },
  {
    id: "box-medium",
    name: "Medium Box Braids",
    category: "Box Braids",
    description: "Medium box braids — a timeless, versatile style.",
    durationMin: 360,
    priceFrom: 200,
    priceTo: 260,
  },
  {
    id: "box-large",
    name: "Large Box Braids",
    category: "Box Braids",
    description: "Large box braids for a quicker, bolder install.",
    durationMin: 300,
    priceFrom: 170,
    priceTo: 220,
  },
  {
    id: "passion-twists",
    name: "Passion Twists",
    category: "Twists",
    description:
      "Soft, textured passion twists using water-wave braiding hair.",
    durationMin: 360,
    priceFrom: 210,
    priceTo: 260,
    featured: true,
  },
  {
    id: "senegalese-twists",
    name: "Senegalese Twists",
    category: "Twists",
    description: "Sleek two-strand Senegalese twists with a polished finish.",
    durationMin: 300,
    priceFrom: 180,
    priceTo: 230,
  },
  {
    id: "marley-twists",
    name: "Marley Twists",
    category: "Twists",
    description: "Natural-looking Marley twists with a matte, kinky texture.",
    durationMin: 300,
    priceFrom: 180,
    priceTo: 230,
  },
  {
    id: "spring-twists",
    name: "Spring Twists",
    category: "Twists",
    description: "Bouncy, springy twists — lightweight and playful.",
    durationMin: 300,
    priceFrom: 180,
    priceTo: 220,
  },
  {
    id: "soft-locs",
    name: "Soft Locs",
    category: "Locs",
    description:
      "Distressed, bohemian soft locs installed over individual braids.",
    durationMin: 420,
    priceFrom: 250,
    priceTo: 320,
    featured: true,
  },
  {
    id: "butterfly-locs",
    name: "Butterfly Locs",
    category: "Locs",
    description: "Messy-chic butterfly locs with that signature flyaway finish.",
    durationMin: 360,
    priceFrom: 230,
    priceTo: 290,
  },
  {
    id: "faux-locs",
    name: "Faux Locs",
    category: "Locs",
    description: "Classic faux locs — sleek, long-lasting, and versatile.",
    durationMin: 420,
    priceFrom: 240,
    priceTo: 300,
  },
  {
    id: "goddess-locs",
    name: "Goddess Locs",
    category: "Locs",
    description: "Faux locs dressed with curly human-hair accents.",
    durationMin: 480,
    priceFrom: 280,
    priceTo: 340,
  },
  {
    id: "feed-in-cornrows",
    name: "Feed-in Cornrows (6-10)",
    category: "Cornrows & Stitch",
    description: "Straight-back feed-in cornrows, 6 to 10 braids.",
    durationMin: 150,
    priceFrom: 90,
    priceTo: 140,
  },
  {
    id: "stitch-braids",
    name: "Stitch Braids",
    category: "Cornrows & Stitch",
    description: "Crisp stitch-style cornrows with defined parting.",
    durationMin: 180,
    priceFrom: 110,
    priceTo: 160,
  },
  {
    id: "tribal-braids",
    name: "Tribal / Fulani Braids",
    category: "Cornrows & Stitch",
    description:
      "Statement tribal braids combining cornrows and individuals, beads optional.",
    durationMin: 300,
    priceFrom: 180,
    priceTo: 250,
  },
  {
    id: "pop-smoke-braids",
    name: "Pop Smoke Braids",
    category: "Cornrows & Stitch",
    description: "Four to six large braids going straight back.",
    durationMin: 150,
    priceFrom: 100,
    priceTo: 140,
  },
  {
    id: "kids-knotless",
    name: "Kids Knotless Braids (12 & under)",
    category: "Kids",
    description: "Gentle, comfortable knotless braids sized for little clients.",
    durationMin: 240,
    priceFrom: 130,
    priceTo: 180,
  },
  {
    id: "kids-cornrows",
    name: "Kids Cornrows",
    category: "Kids",
    description: "Simple, neat cornrow styling for children.",
    durationMin: 90,
    priceFrom: 60,
    priceTo: 90,
  },
  {
    id: "wash-blowout",
    name: "Wash & Blowout",
    category: "Natural Hair",
    description: "Cleansing shampoo, deep condition, and silk-press blowout.",
    durationMin: 90,
    priceFrom: 75,
  },
  {
    id: "silk-press",
    name: "Silk Press",
    category: "Natural Hair",
    description: "Smooth, full silk press on natural hair.",
    durationMin: 120,
    priceFrom: 95,
    priceTo: 130,
  },
  {
    id: "takedown",
    name: "Take-Down Service",
    category: "Add-ons",
    description: "Careful removal of existing braids, twists, or locs.",
    durationMin: 60,
    priceFrom: 40,
    priceTo: 80,
  },
  {
    id: "detangle",
    name: "Detangle & Prep",
    category: "Add-ons",
    description: "Pre-install detangling, clarifying wash, and blow-dry.",
    durationMin: 60,
    priceFrom: 35,
  },
  {
    id: "beads-cuffs",
    name: "Beads / Cuffs",
    category: "Add-ons",
    description: "Decorative beads or metal cuffs added to any style.",
    durationMin: 30,
    priceFrom: 15,
    priceTo: 40,
  },
];

export const categories = Array.from(
  new Set(services.map((s) => s.category)),
) as Service["category"][];

export function formatPrice(s: Service) {
  return s.priceTo ? `$${s.priceFrom}–$${s.priceTo}` : `From $${s.priceFrom}`;
}

export function formatDuration(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}
