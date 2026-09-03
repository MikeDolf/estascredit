// v4 — city+service landing page targeting "plumber baldwin park ca".
// Primary: plumber baldwin park ca (CSV, vol 30, KD 1, commercial intent).
//
// The Baldwin Park branch of Plumbing Co — local NAP (name/address/phone) matches
// the location rather than the Melbourne HQ, which is the correct pattern for a
// local service landing page (LocalBusiness schema requires local NAP).

export const baldwinParkLanding = {
  slug: "plumber-baldwin-park-ca",
  city: "Baldwin Park",
  state: "CA",
  stateFull: "California",
  county: "San Gabriel Valley",
  primaryKeyword: "plumber baldwin park ca",
  keywordCluster: [
    "plumber baldwin park ca",
    "plumber in baldwin park",
    "baldwin park plumbing services",
    "emergency plumber baldwin park",
    "24 hour plumber baldwin park",
  ],
  phone: "(626) 555-0142",
  phoneE164: "+16265550142",
  email: "baldwinpark@plumbingco.com",
  address: {
    street: "14000 Los Angeles St",
    suburb: "Baldwin Park",
    state: "CA",
    postcode: "91706",
    country: "US",
    formatted: "14000 Los Angeles St, Baldwin Park CA 91706",
  },
  licenseNumber: "CA-C36-1042318",
  foundedLocal: 2014,
  jobsCompleted: 9840,
  review: {
    rating: 4.9,
    count: 218,
    source: "Google",
  },
  serviceAreas: [
    "Baldwin Park",
    "West Covina",
    "Irwindale",
    "El Monte",
    "La Puente",
    "Covina",
    "Azusa",
    "Glendora",
    "Duarte",
    "Rosemead",
  ],
  hours: [
    { day: "Mon–Fri", open: "07:00", close: "19:00" },
    { day: "Saturday", open: "08:00", close: "17:00" },
    { day: "Sunday", open: "Emergency only", close: "" },
  ],
  testimonials: [
    {
      quote:
        "Came out on a Sunday for our burst pipe in Baldwin Park, had the water back on in about an hour, and the bill was exactly what was quoted on the phone. Couldn't ask for more.",
      author: "Marisol T.",
      suburb: "Baldwin Park",
      rating: 5,
    },
    {
      quote:
        "Other plumber quoted $2,400 to replace the water heater. These guys did a high-efficiency unit for $2,050 including the SoCalGas rebate paperwork. Paid less, got more.",
      author: "Derek P.",
      suburb: "West Covina",
      rating: 5,
    },
    {
      quote:
        "Called for a slow drain, they told me to try a kettle of boiling water first. Worked. Who does that? These guys — now they've got our business for life.",
      author: "Leah R.",
      suburb: "Irwindale",
      rating: 5,
    },
  ],
};

export type BaldwinParkLanding = typeof baldwinParkLanding;
