import { LandProperty, MarketplaceListing, StewardshipKey, StewardInquiry, SupplierInquiry } from "./types";

export const INITIAL_PROPERTIES: LandProperty[] = [
  {
    id: "prop-maui",
    name: "Haleakalā Sanctuary",
    steward: "Kai Kealoha",
    location: "Maui, Hawaiʻi (Aloha Territory)",
    tagline: "Volcanic soil regeneration & sacred indigenous agroforestry",
    description: "A 45-acre stewardship sanctuary nestled on the lower slopes of Haleakalā. Dedicated to re-establishing native koa and sandalwood forests while implementing traditional Hawaiian ahupuaʻa land management. The property tracks volcanic soil mineral density and water tables through multi-sensor arrays connected to the blockchain ledger.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    established: "2024",
    areaAcres: 45,
    sensorData: {
      soilMoisture: 68,
      waterPurity: 98,
      biomassDensity: 124.5,
      carbonOffset: 1240,
      netZeroIndex: 94
    },
    journal: [
      {
        id: "j-maui-1",
        date: "2026-06-12",
        author: "Kai Kealoha",
        content: "Planted 150 koa tree saplings on the north ridge using our compost tea inoculation. Soil biology analysis shows high fungal-to-bacterial ratio, which native trees love. Water retention is already up.",
        category: "planting",
        proofOnChain: "0x3f5c...921a",
        verified: true
      },
      {
        id: "j-maui-2",
        date: "2026-07-01",
        author: "Nani Wilcox",
        content: "Monitored the spring outflow. Water purity is at 98%, thanks to the bio-swales we constructed. No erosion detected even after the heavy tropical rains last night.",
        category: "water",
        proofOnChain: "0xa811...d451",
        verified: true
      }
    ],
    tasks: [
      { id: "t-m1", title: "Inoculate soil with mycorrhizal fungi", status: "done", assignee: "Kai Kealoha" },
      { id: "t-m2", title: "Map the sacred botanical boundary", status: "doing", assignee: "Nani Wilcox" },
      { id: "t-m3", title: "Establish gravity-fed bamboo irrigation", status: "todo", assignee: "Lopaka" }
    ],
    documents: [
      { id: "doc-m1", name: "Hawaiʻi Agroforestry Stewardship Permit", type: "permit", status: "approved", date: "2024-05-10", hash: "ipfs://QmY7...df42" },
      { id: "doc-m2", name: "Sacred Native Land Covenant Deed", type: "deed", status: "approved", date: "2024-01-15", hash: "ipfs://QmX9...7c82" },
      { id: "doc-m3", name: "Hydrologic Flow Topography Survey", type: "survey", status: "approved", date: "2025-08-22", hash: "ipfs://QmR3...112c" }
    ],
    wires: [
      { id: "w-m1", from: "Stewardship Fund Alpha", to: "Haleakalā Sanctuary Vault", amount: "25,000 USDC", purpose: "Bamboo gravity irrigation project", status: "completed", hash: "0xb7c...f3b9" },
      { id: "w-m2", from: "Carbon Credits DAO", to: "Haleakalā Sanctuary Vault", amount: "12,400 USDC", purpose: "Annual carbon sequestration payout", status: "completed", hash: "0xfa7...c581" }
    ],
    dataSharingLevel: "public",
    stewardBio: "Hawaiian agroforestry practitioner & ahupuaʻa landkeeper with 15+ years reviving native koa ridges.",
    stewardResponseTime: "Usually responds within 2 hours",
    stewardKeyTier: "Emerald Root"
  },
  {
    id: "prop-texas",
    name: "Texas Clean Data Center Campus",
    steward: "Jordan Reed",
    location: "Taylor, Central Texas",
    tagline: "100% solar & wind microgrid data center with closed-loop zero-water immersion cooling",
    description: "A 110-acre hyperscale green compute sanctuary located in Central Texas. Powered by an on-site 45MW bifacial solar array and Megapack battery reserves, featuring closed-loop dielectric liquid immersion cooling with zero evaporative water consumption, and server waste-heat capture rerouted to warm regional agricultural greenhouses and native tallgrass prairie nurseries. Monitored in real-time by IoT telemetry measuring PUE (1.08) and 100% clean energy matching.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    established: "2024",
    areaAcres: 110,
    sensorData: {
      soilMoisture: 58,
      waterPurity: 99,
      biomassDensity: 145.8,
      carbonOffset: 6850,
      netZeroIndex: 99
    },
    journal: [
      {
        id: "j-tx-1",
        date: "2026-05-18",
        author: "Jordan Reed",
        content: "Commissioned Phase 2 of the 45MW bifacial solar microgrid and Megapack battery banks. All compute clusters operated on 100% locally generated zero-carbon power throughout the peak summer heatwave.",
        category: "soil",
        proofOnChain: "0x33b8...91ac",
        verified: true
      },
      {
        id: "j-tx-2",
        date: "2026-06-12",
        author: "Elena Rostova",
        content: "Completed waste-heat heat exchange pipe link to the adjacent 12-acre Blackland Prairie restoration greenhouse. Server heat output now provides 100% of greenhouse climate control without fossil fuels.",
        category: "community",
        proofOnChain: "0x77ee...422b",
        verified: true
      }
    ],
    tasks: [
      { id: "t-tx1", title: "Calibrate immersion cooling dielectric fluid sensor arrays", status: "done", assignee: "Jordan Reed" },
      { id: "t-tx2", title: "Audit solar microgrid 24/7 matching cryptographic certificates", status: "doing", assignee: "Elena Rostova" },
      { id: "t-tx3", title: "Plant native pollinator wildflowers under solar tracking panels", status: "todo", assignee: "Jordan Reed" }
    ],
    documents: [
      { id: "doc-tx1", name: "ERCOT Green Grid Interconnect Agreement", type: "permit", status: "approved", date: "2024-03-14", hash: "ipfs://QmT8...de21" },
      { id: "doc-tx2", name: "Zero-Water Cooling & PUE 1.08 Audit Report", type: "survey", status: "approved", date: "2024-08-20", hash: "ipfs://QmK4...fa77" }
    ],
    wires: [
      { id: "w-tx1", from: "Clean Compute DAO", to: "Texas Green Data Vault", amount: "65,000 USDC", purpose: "Solar microgrid expansion & battery reserve addition", status: "completed", hash: "0xe81...cf44" }
    ],
    dataSharingLevel: "public",
    stewardBio: "Clean infrastructure systems architect & regenerative land manager pioneering zero-water immersion compute hubs in Texas.",
    stewardResponseTime: "Usually responds within 2 hours",
    stewardKeyTier: "Golden Leaf"
  },
  {
    id: "prop-pyrenees",
    name: "Aragon Canopy",
    steward: "Mateo Sastre",
    location: "Aragon, Spanish Pyrenees",
    tagline: "Arid land re-wilding & deep water table restoration",
    description: "A 220-acre semi-arid restoration project in the foothill canyons of the Pyrenees. Aragon Canopy utilizes keyline design plowing, swales, and multi-species holistic grazing to rebuild topsoil, increase aquifer recharge, and prevent forest fires by encouraging evergreen oak growth.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    established: "2025",
    areaAcres: 220,
    sensorData: {
      soilMoisture: 42,
      waterPurity: 93,
      biomassDensity: 88.4,
      carbonOffset: 1890,
      netZeroIndex: 89
    },
    journal: [
      {
        id: "j-pyr-1",
        date: "2026-04-05",
        author: "Mateo Sastre",
        content: "Plowed 15 kilometers of keyline channels along the northern slope before the spring rains. Water level sensors in our observation wells are already showing positive infiltration curves.",
        category: "soil",
        proofOnChain: "0x4fe1...bb89",
        verified: true
      },
      {
        id: "j-pyr-2",
        date: "2026-07-10",
        author: "Elena Goya",
        content: "Guided the sheep herd through Block B for rapid 24-hour high-impact grazing. They trampled old stubble, fertilized the dry soil, and have been moved out. Native grasses sprouting.",
        category: "soil",
        proofOnChain: "0x77ee...ab12",
        verified: true
      }
    ],
    tasks: [
      { id: "t-p1", title: "Complete Keyline plowing - Block B", status: "done", assignee: "Mateo Sastre" },
      { id: "t-p2", title: "Install satellite soil probe nodes", status: "done", assignee: "Elena Goya" },
      { id: "t-p3", title: "Erect seed-saving climate dome", status: "doing", assignee: "Mateo Sastre" }
    ],
    documents: [
      { id: "doc-p1", name: "EU Regenerative Agriculture Grant Deed", type: "permit", status: "approved", date: "2025-01-18", hash: "ipfs://QmU4...398c" },
      { id: "doc-p2", name: "Soil Saturated Hydrological Map", type: "survey", status: "approved", date: "2025-06-11", hash: "ipfs://QmP7...453a" }
    ],
    wires: [
      { id: "w-p1", from: "EU Horizon Green Fund", to: "Aragon Canopy Multi-Sig", amount: "55,000 EUR", purpose: "Keyline design structural works", status: "completed", hash: "0x8fa...c901" }
    ],
    dataSharingLevel: "private",
    stewardBio: "Hydrologist & keyline land designer restoring aquifer moisture across the Aragon canyons.",
    stewardResponseTime: "Usually responds same day",
    stewardKeyTier: "Silver Seed"
  },
  {
    id: "prop-redwood",
    name: "Redwood Sanctuary",
    steward: "Maya Lin",
    location: "Oakland Hills, California",
    tagline: "Ancient canopy preservation & urban microclimate cooling",
    description: "A 28-acre micro-climate reserve located in the high Oakland Hills. Dedicated to conserving second-growth coast redwood groves, introducing native ferns, and tracking carbon vapor flux. Equipped with high-altitude micro-meteorological sensors to observe coastal fog absorption rates and urban run-off filtration.",
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    established: "2022",
    areaAcres: 28,
    sensorData: {
      soilMoisture: 72,
      waterPurity: 95,
      biomassDensity: 412.8,
      carbonOffset: 5120,
      netZeroIndex: 97
    },
    journal: [
      {
        id: "j-rw-1",
        date: "2026-05-14",
        author: "Maya Lin",
        content: "Completed understory thinning to mitigate extreme fire risk while retaining all shade-providing hazelnut and elderberry shrubs. Soil moisture sensors show a steady level from thick organic duff layer.",
        category: "soil",
        proofOnChain: "0xab82...e742",
        verified: true
      },
      {
        id: "j-rw-2",
        date: "2026-06-28",
        author: "Tariq Owens",
        content: "Analyzed fog drip collector outputs on the ridge. Redwood needles successfully capture 40% of their summer water demand directly from the daily marine fog layer. Simply incredible bio-technology.",
        category: "water",
        proofOnChain: "0xcf59...aa92",
        verified: true
      }
    ],
    tasks: [
      { id: "t-rw1", title: "Install fog-drip volumetric flow sensors", status: "done", assignee: "Tariq Owens" },
      { id: "t-rw2", title: "Inoculate ancient roots with native mycorrhizae", status: "doing", assignee: "Maya Lin" },
      { id: "t-rw3", title: "Conduct seasonal understory fuel-load survey", status: "todo", assignee: "Maya Lin" }
    ],
    documents: [
      { id: "doc-rw1", name: "Oakland Hills Conservation Easement Deed", type: "deed", status: "approved", date: "2022-08-11", hash: "ipfs://QmT3...ff11" },
      { id: "doc-rw2", name: "Redwood Canopy Carbon Flux Audit", type: "survey", status: "approved", date: "2025-11-04", hash: "ipfs://QmK2...aa88" }
    ],
    wires: [
      { id: "w-rw1", from: "California Canopy Conservancy", to: "Redwood Sanctuary Escrow", amount: "32,000 USD", purpose: "Fog irrigation research grant", status: "completed", hash: "0xe5c...b891" }
    ],
    dataSharingLevel: "public",
    stewardBio: "Urban forestry ecologist conserving coastal fog-drip redwood groves in the Oakland Hills.",
    stewardResponseTime: "Usually responds within 1 hour",
    stewardKeyTier: "Emerald Root"
  }
];

export const MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  {
    id: "market-1",
    title: "15-Acre Food Forest Parcel",
    type: "land",
    provider: "Guanacaste Eco-Stewardship Alliance",
    location: "Guanacaste, Costa Rica",
    price: "75,000 USD",
    description: "Fully surveyed, active permaculture agroforest parcel ready for steward transfer. Includes community water access and established vanilla orchids, bananas, and coconut palms.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
    tags: ["Agroforestry", "Water Access", "Eco-Village"],
    supplierRating: 4.9,
    supplierResponseTime: "Under 1 hour",
    supplierVerified: true
  },
  {
    id: "market-2",
    title: "Keyline Topography Design & Hydrology Mapping",
    type: "service",
    provider: "Elena Goya, RegeneScape Labs",
    location: "Remote / European Pyrenees",
    price: "1,200 USD / Area Survey",
    description: "High-resolution satellite topography processing combined with elevation mapping to design optimal swales and water catchment channels for farm restoration.",
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
    tags: ["Keyline Design", "Hydrology", "GIS Survey"],
    supplierRating: 5.0,
    supplierResponseTime: "Under 3 hours",
    supplierVerified: true
  },
  {
    id: "market-3",
    title: "Solar Bio-Reactor Compost Inoculation Kit",
    type: "technology",
    provider: "SoilMicrotech Corp",
    location: "Shipped Globally",
    price: "850 USD / System",
    description: "An automated solar-powered brewer that produces hyper-concentrated mycorrhizal fungal tea to supercharge depleted soils and establish massive biological tree roots.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    tags: ["Soil Biology", "Solar Tech", "Permaculture Tools"],
    supplierRating: 4.8,
    supplierResponseTime: "Under 2 hours",
    supplierVerified: true
  },
  {
    id: "market-4",
    title: "Agroforestry Landscape Architect Consultant",
    type: "professional",
    provider: "Kai Kealoha",
    location: "Hawaiʻi & Pacific Region",
    price: "150 USD / Hour",
    description: "Expert consultant in traditional Hawaiian land divisions, polyculture guild design, and establishing low-maintenance perennial food ecosystems.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80",
    tags: ["Polyculture", "Indigenous Systems", "Consultant"],
    supplierRating: 5.0,
    supplierResponseTime: "Under 30 mins",
    supplierVerified: true
  }
];

export const STEWARDSHIP_KEYS: StewardshipKey[] = [
  {
    id: "key-1",
    name: "Volcanic Sandalwood Key",
    holder: "Kai Kealoha",
    tier: "Emerald Root",
    multiplier: 2.5,
    unlockedAt: "2024-03-12",
    rewardsClaimed: "14,500 USDC",
    description: "Granted to stewards who successfully plant and protect over 100 native sandalwood trees. Enables voting rights in Hawaii land stewardship pools and premium yield offsets."
  },
  {
    id: "key-2",
    name: "Texas Clean Compute Key",
    holder: "Jordan Reed",
    tier: "Golden Leaf",
    multiplier: 1.5,
    unlockedAt: "2024-09-01",
    rewardsClaimed: "14,200 USDC",
    description: "Earned for operating a verified zero-water immersion cooling data campus running on 100% local solar/wind microgrids. Unlocks direct compute rewards from global clean infrastructure pools."
  },
  {
    id: "key-3",
    name: "Pyrenees Water Key",
    holder: "Mateo Sastre",
    tier: "Silver Seed",
    multiplier: 1.2,
    unlockedAt: "2025-05-15",
    rewardsClaimed: "3,200 USDC",
    description: "Earned for keyline water retention structural work increasing aquifer moisture rate by 15%. Awards monthly rewards funded by regional green water resilience programs."
  }
];

export const INITIAL_STEWARD_INQUIRIES: StewardInquiry[] = [
  {
    id: "inq-steward-1",
    propertyId: "prop-maui",
    propertyName: "Haleakalā Sanctuary",
    stewardName: "Kai Kealoha",
    senderName: "Dr. Leilani Vance",
    senderContact: "leilani.v@pacific-agro.org",
    topic: "volunteering",
    status: "replied",
    unreadReplies: 0,
    createdAt: "2026-08-15T14:30:00Z",
    messages: [
      {
        id: "msg-s1-1",
        sender: "Dr. Leilani Vance",
        senderRole: "Field Researcher",
        text: "Aloha Kai, our agroforestry botany team is visiting Maui next month. We would love to volunteer 3 days to assist in native Koa sapling planting along the north ridge.",
        timestamp: "Aug 15, 2:30 PM",
        isStewardOrSupplier: false
      },
      {
        id: "msg-s1-2",
        sender: "Kai Kealoha",
        senderRole: "Primary Property Steward",
        text: "Aloha Leilani! Mahalo for your deep care for this ʻāina. Next month is ideal for Koa inoculation before the seasonal rains. You and your team are warmly welcomed. I have prepared our compost tea brews for your arrival.",
        timestamp: "Aug 15, 4:15 PM",
        isStewardOrSupplier: true
      }
    ]
  },
  {
    id: "inq-steward-2",
    propertyId: "prop-texas",
    propertyName: "Texas Clean Data Center Campus",
    stewardName: "Jordan Reed",
    senderName: "Marcus Thorne",
    senderContact: "m.thorne@biocorridors.fund",
    topic: "funding",
    status: "replied",
    unreadReplies: 0,
    createdAt: "2026-08-20T09:15:00Z",
    messages: [
      {
        id: "msg-s2-1",
        sender: "Marcus Thorne",
        senderRole: "Impact Investor",
        text: "Hi Jordan, our clean tech fund saw your real-time telemetry showing PUE 1.08 and 100% solar microgrid uptime in Texas. We would like to discuss a 50,000 USDC allocation for expanding the battery storage facility.",
        timestamp: "Aug 20, 9:15 AM",
        isStewardOrSupplier: false
      },
      {
        id: "msg-s2-2",
        sender: "Jordan Reed",
        senderRole: "Primary Property Steward",
        text: "Thank you Marcus! That allocation aligns perfectly with our upcoming 15MWh battery expansion. It ensures 24/7 carbon-free computing and enables waste heat distribution to another 8 acres of native prairie greenhouses. Let's review the smart-contract disbursement schedule.",
        timestamp: "Aug 20, 11:40 AM",
        isStewardOrSupplier: true
      }
    ]
  }
];

export const INITIAL_SUPPLIER_INQUIRIES: SupplierInquiry[] = [
  {
    id: "inq-supplier-1",
    listingId: "market-3",
    listingTitle: "Solar Bio-Reactor Compost Inoculation Kit",
    supplierName: "SoilMicrotech Corp",
    senderName: "Kai Kealoha",
    senderContact: "kai@haleakala-sanctuary.org",
    inquiryType: "quote",
    scopeOrQuantity: "2 Automated Units",
    status: "quote_provided",
    unreadReplies: 1,
    createdAt: "2026-08-18T10:00:00Z",
    messages: [
      {
        id: "msg-sup1-1",
        sender: "Kai Kealoha",
        text: "Aloha SoilMicrotech, we are looking to procure 2 Solar Bio-Reactor units for our volcanic soil mycorrhizal brewing in Maui. Can you provide a custom freight quote including solar battery backups?",
        timestamp: "Aug 18, 10:00 AM",
        isStewardOrSupplier: false
      },
      {
        id: "msg-sup1-2",
        sender: "SoilMicrotech Corp",
        senderRole: "Certified Supplier",
        text: "Aloha Kai! We're honored to support the Haleakalā restoration. We can bundle 2 Solar Bio-Reactors with high-efficiency LiFePO4 solar batteries and include 10kg of freeze-dried native spore inoculant. Ocean freight to Kahului Harbor is 180 USD.",
        timestamp: "Aug 18, 11:30 AM",
        isStewardOrSupplier: true,
        quoteDetails: {
          price: "1,780 USD (Total for 2 systems + Freight)",
          timeline: "Ships in 5-7 business days",
          status: "quoted"
        }
      }
    ]
  },
  {
    id: "inq-supplier-2",
    listingId: "market-2",
    listingTitle: "Keyline Topography Design & Hydrology Mapping",
    supplierName: "Elena Goya, RegeneScape Labs",
    senderName: "Mateo Sastre",
    senderContact: "mateo@aragoncanopy.es",
    inquiryType: "specs",
    scopeOrQuantity: "220-acre semi-arid topography survey",
    status: "inquiry_sent",
    unreadReplies: 0,
    createdAt: "2026-08-25T16:20:00Z",
    messages: [
      {
        id: "msg-sup2-1",
        sender: "Mateo Sastre",
        text: "Hola Elena, could your satellite hydrology scan provide centimeter-level contour elevation maps for keyline swales in limestone foothill soils?",
        timestamp: "Aug 25, 4:20 PM",
        isStewardOrSupplier: false
      }
    ]
  }
];

