export const business = {
  name: "Plumbing Co",
  legalName: "Plumbing Co Pty Ltd",
  tagline: "Honest plumbers. Same-day if we can.",
  description:
    "Licensed plumbers serving Melbourne's inner south since 2009. Upfront pricing, no call-out fee, and we clean up before we leave.",
  founded: 2009,
  jobsCompleted: 18420,
  licenseNumber: "VIC-PL-48217",
  address: {
    street: "12 Greville Street",
    suburb: "Prahran",
    state: "VIC",
    postcode: "3181",
    country: "AU",
    formatted: "12 Greville Street, Prahran VIC 3181",
  },
  phone: "(03) 9041 8200",
  phoneE164: "+61390418200",
  email: "hello@plumbingco.com.au",
  hours: [
    { day: "Mon–Fri", open: "07:00", close: "18:00" },
    { day: "Saturday", open: "08:00", close: "16:00" },
    { day: "Sunday", open: "Emergency only", close: "" },
  ],
  serviceAreas: [
    "Prahran",
    "South Yarra",
    "Windsor",
    "St Kilda",
    "Armadale",
    "Toorak",
    "Malvern",
    "Caulfield",
    "Elwood",
    "Brighton",
  ],
  socials: {
    google: "https://g.page/plumbing-co-prahran",
    instagram: "https://instagram.com/plumbingco",
    facebook: "https://facebook.com/plumbingco",
  },
  review: {
    rating: 4.9,
    count: 412,
    source: "Google",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://plumbing-co.example.com",
} as const;

export type Business = typeof business;
