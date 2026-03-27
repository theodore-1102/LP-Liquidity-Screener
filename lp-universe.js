// lib/lp-universe.js
// Pre-seeded LP universe for cross-referencing and enrichment

export const LP_UNIVERSE = [
  // ── SOVEREIGN WEALTH FUNDS ──
  { name: "GIC Private Limited", type: "swf", country: "SG", region: "Asia", aum_bn: 770, pe_alloc_pct: 16 },
  { name: "Temasek Holdings", type: "swf", country: "SG", region: "Asia", aum_bn: 382, pe_alloc_pct: 27 },
  { name: "Abu Dhabi Investment Authority (ADIA)", type: "swf", country: "AE", region: "Middle East", aum_bn: 993, pe_alloc_pct: 10 },
  { name: "Kuwait Investment Authority (KIA)", type: "swf", country: "KW", region: "Middle East", aum_bn: 803, pe_alloc_pct: 12 },
  { name: "Norges Bank Investment Management (NBIM)", type: "swf", country: "NO", region: "Europe", aum_bn: 1600, pe_alloc_pct: 0.2 },
  { name: "Qatar Investment Authority (QIA)", type: "swf", country: "QA", region: "Middle East", aum_bn: 475, pe_alloc_pct: 15 },
  { name: "China Investment Corporation (CIC)", type: "swf", country: "CN", region: "Asia", aum_bn: 1350, pe_alloc_pct: 14 },
  { name: "Public Investment Fund (PIF)", type: "swf", country: "SA", region: "Middle East", aum_bn: 930, pe_alloc_pct: 8 },
  { name: "Hong Kong Monetary Authority (HKMA)", type: "swf", country: "HK", region: "Asia", aum_bn: 520, pe_alloc_pct: 6 },
  { name: "National Pension Service (NPS Korea)", type: "swf", country: "KR", region: "Asia", aum_bn: 890, pe_alloc_pct: 14 },
  { name: "Mubadala Investment Company", type: "swf", country: "AE", region: "Middle East", aum_bn: 302, pe_alloc_pct: 18 },
  { name: "Khazanah Nasional", type: "swf", country: "MY", region: "Asia", aum_bn: 35, pe_alloc_pct: 20 },
  { name: "Future Fund Australia", type: "swf", country: "AU", region: "Asia-Pacific", aum_bn: 165, pe_alloc_pct: 16 },
  { name: "CDPQ", type: "swf", country: "CA", region: "North America", aum_bn: 402, pe_alloc_pct: 20 },
  { name: "New Zealand Super Fund", type: "swf", country: "NZ", region: "Asia-Pacific", aum_bn: 46, pe_alloc_pct: 12 },
  { name: "Brunei Investment Agency", type: "swf", country: "BN", region: "Asia", aum_bn: 60, pe_alloc_pct: 8 },

  // ── PUBLIC PENSION FUNDS (NORTH AMERICA) ──
  { name: "CalPERS", type: "pension", country: "US", region: "North America", aum_bn: 502, pe_alloc_pct: 17 },
  { name: "CalSTRS", type: "pension", country: "US", region: "North America", aum_bn: 318, pe_alloc_pct: 15 },
  { name: "New York State Common Retirement Fund", type: "pension", country: "US", region: "North America", aum_bn: 268, pe_alloc_pct: 12 },
  { name: "Teacher Retirement System of Texas", type: "pension", country: "US", region: "North America", aum_bn: 200, pe_alloc_pct: 16 },
  { name: "Washington State Investment Board", type: "pension", country: "US", region: "North America", aum_bn: 186, pe_alloc_pct: 27 },
  { name: "Oregon Public Employees Retirement System", type: "pension", country: "US", region: "North America", aum_bn: 95, pe_alloc_pct: 26 },
  { name: "PSERS Pennsylvania", type: "pension", country: "US", region: "North America", aum_bn: 73, pe_alloc_pct: 20 },
  { name: "Virginia Retirement System", type: "pension", country: "US", region: "North America", aum_bn: 102, pe_alloc_pct: 16 },
  { name: "MassPRIM", type: "pension", country: "US", region: "North America", aum_bn: 98, pe_alloc_pct: 14 },
  { name: "LACERA", type: "pension", country: "US", region: "North America", aum_bn: 76, pe_alloc_pct: 14 },
  { name: "SFERS", type: "pension", country: "US", region: "North America", aum_bn: 34, pe_alloc_pct: 18 },
  { name: "Colorado PERA", type: "pension", country: "US", region: "North America", aum_bn: 62, pe_alloc_pct: 12 },
  { name: "Ontario Teachers Pension Plan", type: "pension", country: "CA", region: "North America", aum_bn: 250, pe_alloc_pct: 22 },
  { name: "CPP Investments", type: "pension", country: "CA", region: "North America", aum_bn: 590, pe_alloc_pct: 28 },
  { name: "AIMCo", type: "pension", country: "CA", region: "North America", aum_bn: 168, pe_alloc_pct: 16 },
  { name: "BCI (British Columbia Investment)", type: "pension", country: "CA", region: "North America", aum_bn: 211, pe_alloc_pct: 18 },
  { name: "PSP Investments", type: "pension", country: "CA", region: "North America", aum_bn: 243, pe_alloc_pct: 20 },
  { name: "HOOPP", type: "pension", country: "CA", region: "North America", aum_bn: 112, pe_alloc_pct: 10 },

  // ── PENSION FUNDS (EUROPE) ──
  { name: "APG Netherlands", type: "pension", country: "NL", region: "Europe", aum_bn: 580, pe_alloc_pct: 6 },
  { name: "PGGM", type: "pension", country: "NL", region: "Europe", aum_bn: 290, pe_alloc_pct: 7 },
  { name: "ATP Denmark", type: "pension", country: "DK", region: "Europe", aum_bn: 140, pe_alloc_pct: 8 },
  { name: "PFA Denmark", type: "pension", country: "DK", region: "Europe", aum_bn: 115, pe_alloc_pct: 10 },
  { name: "PKA Denmark", type: "pension", country: "DK", region: "Europe", aum_bn: 52, pe_alloc_pct: 9 },
  { name: "AP1 Sweden", type: "pension", country: "SE", region: "Europe", aum_bn: 47, pe_alloc_pct: 9 },
  { name: "AP2 Sweden", type: "pension", country: "SE", region: "Europe", aum_bn: 44, pe_alloc_pct: 8 },
  { name: "AP3 Sweden", type: "pension", country: "SE", region: "Europe", aum_bn: 50, pe_alloc_pct: 7 },
  { name: "AP4 Sweden", type: "pension", country: "SE", region: "Europe", aum_bn: 55, pe_alloc_pct: 6 },
  { name: "VER Finland", type: "pension", country: "FI", region: "Europe", aum_bn: 22, pe_alloc_pct: 10 },
  { name: "USS (Universities Superannuation Scheme)", type: "pension", country: "GB", region: "Europe", aum_bn: 87, pe_alloc_pct: 8 },

  // ── PENSION FUNDS (ASIA-PACIFIC) ──
  { name: "GPIF Japan", type: "pension", country: "JP", region: "Asia", aum_bn: 1500, pe_alloc_pct: 1.5 },
  { name: "EPF Malaysia", type: "pension", country: "MY", region: "Asia", aum_bn: 240, pe_alloc_pct: 4 },
  { name: "AustralianSuper", type: "pension", country: "AU", region: "Asia-Pacific", aum_bn: 225, pe_alloc_pct: 8 },
  { name: "Aware Super", type: "pension", country: "AU", region: "Asia-Pacific", aum_bn: 155, pe_alloc_pct: 7 },
  { name: "UniSuper", type: "pension", country: "AU", region: "Asia-Pacific", aum_bn: 100, pe_alloc_pct: 5 },
  { name: "Government Pension Fund Thailand", type: "pension", country: "TH", region: "Asia", aum_bn: 30, pe_alloc_pct: 3 },

  // ── ENDOWMENTS ──
  { name: "Harvard Management Company", type: "endowment", country: "US", region: "North America", aum_bn: 50, pe_alloc_pct: 34 },
  { name: "Yale Investments Office", type: "endowment", country: "US", region: "North America", aum_bn: 41, pe_alloc_pct: 38 },
  { name: "Stanford Management Company", type: "endowment", country: "US", region: "North America", aum_bn: 36, pe_alloc_pct: 30 },
  { name: "MIT Investment Management Company", type: "endowment", country: "US", region: "North America", aum_bn: 27, pe_alloc_pct: 26 },
  { name: "Princeton University Investment Company", type: "endowment", country: "US", region: "North America", aum_bn: 35, pe_alloc_pct: 32 },
  { name: "University of Pennsylvania", type: "endowment", country: "US", region: "North America", aum_bn: 21, pe_alloc_pct: 28 },
  { name: "Duke University DUMAC", type: "endowment", country: "US", region: "North America", aum_bn: 12, pe_alloc_pct: 30 },
  { name: "Wellcome Trust", type: "endowment", country: "GB", region: "Europe", aum_bn: 38, pe_alloc_pct: 15 },

  // ── INSURANCE ──
  { name: "AXA", type: "insurance", country: "FR", region: "Europe", aum_bn: 850, pe_alloc_pct: 3 },
  { name: "Allianz", type: "insurance", country: "DE", region: "Europe", aum_bn: 790, pe_alloc_pct: 4 },
  { name: "MetLife", type: "insurance", country: "US", region: "North America", aum_bn: 650, pe_alloc_pct: 3 },
  { name: "Nippon Life Insurance", type: "insurance", country: "JP", region: "Asia", aum_bn: 680, pe_alloc_pct: 2 },
  { name: "Dai-ichi Life", type: "insurance", country: "JP", region: "Asia", aum_bn: 370, pe_alloc_pct: 2.5 },
  { name: "Meiji Yasuda Life", type: "insurance", country: "JP", region: "Asia", aum_bn: 340, pe_alloc_pct: 2 },
  { name: "Samsung Life Insurance", type: "insurance", country: "KR", region: "Asia", aum_bn: 280, pe_alloc_pct: 4 },
  { name: "Ping An Insurance", type: "insurance", country: "CN", region: "Asia", aum_bn: 1200, pe_alloc_pct: 1.5 },
  { name: "China Life Insurance", type: "insurance", country: "CN", region: "Asia", aum_bn: 620, pe_alloc_pct: 1 },
  { name: "Cathay Life Insurance", type: "insurance", country: "TW", region: "Asia", aum_bn: 180, pe_alloc_pct: 2 },
  { name: "Fubon Life Insurance", type: "insurance", country: "TW", region: "Asia", aum_bn: 120, pe_alloc_pct: 2.5 },
  { name: "AIA Group", type: "insurance", country: "HK", region: "Asia", aum_bn: 310, pe_alloc_pct: 3 },
  { name: "Manulife", type: "insurance", country: "CA", region: "North America", aum_bn: 400, pe_alloc_pct: 5 },
  { name: "Tokio Marine", type: "insurance", country: "JP", region: "Asia", aum_bn: 240, pe_alloc_pct: 3 },
  { name: "Hanwha Life Insurance", type: "insurance", country: "KR", region: "Asia", aum_bn: 110, pe_alloc_pct: 3.5 },

  // ── CORPORATE / BALANCE SHEET ──
  { name: "SoftBank Group", type: "corporate", country: "JP", region: "Asia", aum_bn: 180, pe_alloc_pct: 50 },
  { name: "Samsung Group Treasury", type: "corporate", country: "KR", region: "Asia", aum_bn: null, pe_alloc_pct: null },
  { name: "SK Group", type: "corporate", country: "KR", region: "Asia", aum_bn: null, pe_alloc_pct: null },
  { name: "Fosun International", type: "corporate", country: "CN", region: "Asia", aum_bn: 28, pe_alloc_pct: 15 },

  // ── DFI / MULTILATERAL ──
  { name: "IFC (International Finance Corporation)", type: "dfi", country: "INT", region: "Global", aum_bn: 45, pe_alloc_pct: 30 },
  { name: "Asian Development Bank (ADB)", type: "dfi", country: "INT", region: "Asia", aum_bn: 20, pe_alloc_pct: 10 },
  { name: "CDC Group (BII)", type: "dfi", country: "GB", region: "Global", aum_bn: 8, pe_alloc_pct: 35 },
  { name: "DEG", type: "dfi", country: "DE", region: "Global", aum_bn: 12, pe_alloc_pct: 25 },
  { name: "FMO", type: "dfi", country: "NL", region: "Global", aum_bn: 13, pe_alloc_pct: 22 },
];

// Advisor universe for cross-referencing
export const ADVISOR_UNIVERSE = [
  "Evercore", "Lazard", "Campbell Lutyens", "PJT Park Hill",
  "Greenhill Cogent", "Setter Capital", "Triago", "UBS",
  "Goldman Sachs", "Morgan Stanley", "Jefferies", "Houlihan Lokey",
  "Rede Partners", "Paladin Capital", "Atlantic-Pacific Capital",
  "MVision", "Eaton Partners", "Monument Group", "Hamilton Lane",
  "Jasper Ridge Partners", "Cambridge Associates", "Mercer",
  "Wilshire Associates", "Aksia", "Cliffwater",
];

// Major secondary buyers for cross-referencing
export const SECONDARY_BUYERS = [
  "Ardian", "Lexington Partners", "Blackstone Strategic Partners",
  "Goldman Sachs Vintage", "HarbourVest", "Partners Group",
  "Coller Capital", "Pantheon", "AlpInvest", "Adams Street",
  "Neuberger Berman", "Hamilton Lane", "Arctos Partners",
  "StepStone", "Ares Secondaries", "ICG Strategic Equity",
  "Whitehorse Liquidity Partners", "Landmark Partners",
  "Portfolio Advisors", "LGT Capital Partners",
  "Goldman Sachs AM", "JP Morgan AM",
  "TR Capital (Asia)", "Asia Alternatives", "NewQuest Capital",
  "Axiom Asia", "57 Stars",
];

export function findLPByName(name) {
  const lower = name.toLowerCase();
  return LP_UNIVERSE.find(lp =>
    lp.name.toLowerCase().includes(lower) || lower.includes(lp.name.toLowerCase())
  );
}

export function getLPsByRegion(region) {
  return LP_UNIVERSE.filter(lp => lp.region === region);
}

export function getLPsByType(type) {
  return LP_UNIVERSE.filter(lp => lp.type === type);
}
