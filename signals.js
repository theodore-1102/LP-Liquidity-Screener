// lib/signals.js
// Signal processing, scoring, and enrichment engine

import { LP_UNIVERSE, ADVISOR_UNIVERSE, SECONDARY_BUYERS } from "./lp-universe.js";

// ── SIGNAL SCORING WEIGHTS ──
const WEIGHTS = {
  // Signal strength multipliers
  direct: 1.0,
  strong_indirect: 0.7,
  weak_indirect: 0.4,
  macro_linked: 0.2,

  // Category bonuses
  liquidity: 15,
  rebalancing: 10,
  denominator_effect: 12,
  structural: 8,
  behavioral: 6,
  macro: 4,
  regulatory: 7,

  // Asia exposure bonus
  asia_exposure: 10,

  // Recency bonus (signals in last 30 days)
  recent_signal: 8,

  // Multiple evidence sources bonus
  multi_source: 5,
};

// ── SCREENING FLAGS ENGINE ──
export function generateScreeningFlags(signal) {
  const flags = {
    financial: [],
    governance: [],
    behavioral: [],
    market_context: [],
    asia_specific: [],
    time_sensitive: [],
  };

  const desc = (signal.signal_description || "").toLowerCase();
  const category = signal.signal_category || "";
  const country = signal.country || "";
  const type = signal.lp_type || "";

  // Financial flags
  if (desc.includes("over-allocat") || desc.includes("overweight")) flags.financial.push("PE over-allocation detected");
  if (desc.includes("denominator")) flags.financial.push("Denominator effect pressure");
  if (desc.includes("liquidity") && desc.includes("mismatch")) flags.financial.push("Liquidity mismatch");
  if (desc.includes("unfunded")) flags.financial.push("Elevated unfunded commitments");
  if (desc.includes("underfund")) flags.financial.push("Underfunded status");
  if (desc.includes("capital call default")) flags.financial.push("Capital call stress");
  if (desc.includes("pacing") && desc.includes("reduc")) flags.financial.push("Pacing plan reduction");

  // Governance flags
  if (desc.includes("cio") && (desc.includes("depart") || desc.includes("resign") || desc.includes("leav"))) flags.governance.push("CIO departure");
  if (desc.includes("new allocation policy") || desc.includes("policy change")) flags.governance.push("Allocation policy change");
  if (desc.includes("consultant") && desc.includes("change")) flags.governance.push("Consultant change");
  if (desc.includes("board") && (desc.includes("new") || desc.includes("change"))) flags.governance.push("Board composition change");
  if (desc.includes("restructur")) flags.governance.push("Organizational restructuring");

  // Behavioral flags
  if (desc.includes("previously sold") || desc.includes("history of selling")) flags.behavioral.push("Prior secondary seller");
  if (desc.includes("advisor mandate") || desc.includes("advisory mandate")) flags.behavioral.push("Advisory mandate issued");
  if (desc.includes("tender")) flags.behavioral.push("Tender offer participation");
  if (desc.includes("reviewing portfolio") || desc.includes("portfolio review")) flags.behavioral.push("Active portfolio review");

  // Market context
  if (desc.includes("market drawdown") || desc.includes("market decline")) flags.market_context.push("Market drawdown impact");
  if (desc.includes("fx") || desc.includes("currency")) flags.market_context.push("FX/currency pressure");
  if (desc.includes("interest rate")) flags.market_context.push("Interest rate impact");
  if (desc.includes("peer") && desc.includes("sell")) flags.market_context.push("Peer LP selling activity");

  // Asia-specific flags
  const asiaCountries = ["JP", "KR", "CN", "SG", "HK", "MY", "TH", "ID", "IN", "AU", "NZ", "TW", "PH", "VN"];
  if (asiaCountries.includes(country)) {
    if (country === "JP") {
      if (desc.includes("gpif")) flags.asia_specific.push("GPIF alternatives expansion");
      if (desc.includes("yen") || desc.includes("jpy")) flags.asia_specific.push("Yen weakness effect");
      if (desc.includes("solvency margin")) flags.asia_specific.push("Insurance solvency margin change");
    }
    if (country === "KR") {
      if (desc.includes("nps")) flags.asia_specific.push("NPS rebalancing cycle");
      if (desc.includes("k-ics")) flags.asia_specific.push("K-ICS transition impact");
    }
    if (country === "CN") {
      if (desc.includes("cbirc")) flags.asia_specific.push("CBIRC regulatory impact");
      if (desc.includes("lgfv")) flags.asia_specific.push("LGFV restructuring");
    }
    if (country === "AU") {
      if (desc.includes("yfys") || desc.includes("your future")) flags.asia_specific.push("YFYS performance test pressure");
      if (desc.includes("merger") && desc.includes("super")) flags.asia_specific.push("Super fund merger rationalization");
    }
  }

  // Time-sensitive flags
  const now = new Date();
  const month = now.getMonth();
  if (type === "pension" && (month >= 4 && month <= 6)) flags.time_sensitive.push("Near fiscal year-end (June)");
  if (type === "pension" && (month >= 10 || month <= 1)) flags.time_sensitive.push("Near calendar year-end");
  if (desc.includes("fund term expir")) flags.time_sensitive.push("Fund term expiration approaching");
  if (desc.includes("lock-up") && desc.includes("end")) flags.time_sensitive.push("Lock-up period ending");

  return flags;
}

// ── COMPOSITE SCORE CALCULATION ──
export function calculateCompositeScore(signal) {
  let score = signal.confidence_score || 50;

  // Signal strength weight
  const strengthWeight = WEIGHTS[signal.signal_strength] || 0.5;
  score = score * strengthWeight;

  // Category bonus
  const categoryBonus = WEIGHTS[signal.signal_category] || 0;
  score += categoryBonus;

  // Asia exposure bonus
  if (signal.asia_exposure_flag) score += WEIGHTS.asia_exposure;

  // Recency bonus
  if (signal.last_updated) {
    const daysSince = (Date.now() - new Date(signal.last_updated).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince <= 30) score += WEIGHTS.recent_signal;
  }

  // Multi-source bonus
  if (signal.evidence && signal.evidence.length > 1) score += WEIGHTS.multi_source * Math.min(signal.evidence.length - 1, 3);

  return Math.min(Math.round(score), 100);
}

// ── ENTITY ENRICHMENT ──
export function enrichSignal(signal) {
  // Find LP in universe
  const lpMatch = LP_UNIVERSE.find(
    (lp) => lp.name.toLowerCase().includes((signal.lp_name || "").toLowerCase())
  );

  if (lpMatch) {
    signal.aum_estimate_usd_bn = signal.aum_estimate_usd_bn || lpMatch.aum_bn;
    signal.pe_allocation_pct = signal.pe_allocation_pct || lpMatch.pe_alloc_pct;
    signal.country = signal.country || lpMatch.country;
    signal.region = signal.region || lpMatch.region;
    if (lpMatch.pe_alloc_pct && lpMatch.aum_bn) {
      signal.pe_allocation_usd_bn = Math.round((lpMatch.pe_alloc_pct / 100) * lpMatch.aum_bn * 10) / 10;
    }
  }

  // Cross-reference advisors
  if (signal.linked_entities?.advisors) {
    signal.linked_entities.advisors = signal.linked_entities.advisors.filter((a) =>
      ADVISOR_UNIVERSE.some((known) => known.toLowerCase().includes(a.toLowerCase()))
    );
  }

  // Generate screening flags
  signal.screening_flags = generateScreeningFlags(signal);

  // Calculate composite score
  signal.composite_score = calculateCompositeScore(signal);

  // Determine Asia exposure
  const asiaCountries = ["JP", "KR", "CN", "SG", "HK", "MY", "TH", "ID", "IN", "AU", "NZ", "TW", "PH", "VN", "BN"];
  signal.asia_exposure_flag = asiaCountries.includes(signal.country);

  return signal;
}

// ── DEDUPLICATION ──
export function deduplicateSignals(signals) {
  const seen = new Map();
  for (const sig of signals) {
    const key = `${(sig.lp_name || "").toLowerCase()}_${sig.signal_category}`;
    if (!seen.has(key) || (sig.confidence_score || 0) > (seen.get(key).confidence_score || 0)) {
      seen.set(key, sig);
    }
  }
  return Array.from(seen.values());
}

// ── COVERAGE GAP ANALYSIS ──
export function analyzeCoverageGaps(signals) {
  const coveredCountries = new Set(signals.map((s) => s.country));
  const coveredTypes = new Set(signals.map((s) => s.lp_type));

  const allRegions = ["Asia", "Europe", "North America", "Middle East", "Asia-Pacific", "Global"];
  const allTypes = ["pension", "swf", "endowment", "insurance", "corporate", "dfi", "family_office"];

  const coveredRegions = new Set(signals.map((s) => s.region));

  const gaps = {
    missing_regions: allRegions.filter((r) => !coveredRegions.has(r)),
    missing_lp_types: allTypes.filter((t) => !coveredTypes.has(t)),
    under_represented_countries: [],
    suggested_additional_searches: [],
  };

  // Check Asia under-coverage
  const asiaSignals = signals.filter((s) => s.asia_exposure_flag);
  if (asiaSignals.length < 5) {
    gaps.suggested_additional_searches.push(
      "Expand Asia LP coverage: Japan insurance, Korea pension, China SOE, SE Asia EPF"
    );
  }

  // Check by LP type
  for (const type of allTypes) {
    const count = signals.filter((s) => s.lp_type === type).length;
    if (count < 2) {
      gaps.suggested_additional_searches.push(`Increase coverage for LP type: ${type}`);
    }
  }

  return gaps;
}

// ── SORT AND RANK ──
export function rankSignals(signals) {
  return signals.sort((a, b) => {
    // Primary: composite score
    const scoreA = a.composite_score || calculateCompositeScore(a);
    const scoreB = b.composite_score || calculateCompositeScore(b);
    if (scoreB !== scoreA) return scoreB - scoreA;

    // Secondary: Asia exposure preference
    if (a.asia_exposure_flag && !b.asia_exposure_flag) return -1;
    if (!a.asia_exposure_flag && b.asia_exposure_flag) return 1;

    // Tertiary: more evidence
    return (b.evidence?.length || 0) - (a.evidence?.length || 0);
  });
}
