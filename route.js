// app/api/scan/route.js
import { SYSTEM_PROMPT, SEARCH_KEYWORD_SETS } from "../../../lib/prompt.js";
import { enrichSignal, deduplicateSignals, rankSignals, analyzeCoverageGaps } from "../../../lib/signals.js";

export const maxDuration = 120;

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      focus = "all",           // "all" | "asia" | "north_america" | "europe" | "middle_east"
      lp_type = "all",        // "all" | "pension" | "swf" | "endowment" | "insurance" | "corporate"
      signal_tier = "all",    // "all" | "direct" | "strong_indirect" | "weak_indirect"
      time_window = "3m",     // "1m" | "3m" | "6m" | "12m"
      custom_query = null,
    } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
    }

    // Build user prompt based on filters
    let userPrompt = `Execute a comprehensive LP liquidity signal scan with the following parameters:

GEOGRAPHIC FOCUS: ${focus === "all" ? "Global (with Asia emphasis)" : focus}
LP TYPE FILTER: ${lp_type === "all" ? "All LP categories" : lp_type}
SIGNAL TIER: ${signal_tier === "all" ? "All tiers (direct + indirect + macro)" : signal_tier}
TIME WINDOW: Last ${time_window.replace("m", " months")}

INSTRUCTIONS:
1. Search for LP secondary transactions, stake sales, portfolio rebalancing signals
2. Search for advisor mandates (Evercore, Lazard, Campbell Lutyens, PJT, etc.)
3. Search for allocation changes, denominator effects, governance changes
4. Search for Asia-specific signals: Japan insurance, Korea NPS, China CBIRC, SE Asia pensions
5. Cross-reference entities found in initial results
6. Include ALL signals found, even weak ones — maximize recall

${custom_query ? `ADDITIONAL CONTEXT: ${custom_query}` : ""}

Search using these query groups sequentially:
${SEARCH_KEYWORD_SETS.slice(0, 5).map((group, i) =>
  `Group ${i + 1}: ${group.slice(0, 3).join(", ")}`
).join("\n")}

Return results as a JSON array following the schema in your instructions. Return ONLY the JSON array.`;

    // Call Claude API with web search
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search",
          },
        ],
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json({ error: `API error: ${response.status}`, details: err }, { status: 502 });
    }

    const data = await response.json();

    // Extract text content from response
    const textBlocks = data.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("\n");

    // Parse JSON from response
    let signals = [];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = textBlocks.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        signals = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      // Try cleaning and re-parsing
      try {
        const cleaned = textBlocks
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();
        const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          signals = JSON.parse(jsonMatch[0]);
        }
      } catch {
        return Response.json({
          error: "Failed to parse signals from AI response",
          raw_response: textBlocks.slice(0, 2000),
          signals: [],
          coverage_gaps: {},
          meta: { total: 0, scan_time: new Date().toISOString() },
        });
      }
    }

    // Enrich and process signals
    signals = signals.map(enrichSignal);
    signals = deduplicateSignals(signals);
    signals = rankSignals(signals);

    // Coverage gap analysis
    const coverageGaps = analyzeCoverageGaps(signals);

    // Aggregate stats
    const meta = {
      total: signals.length,
      by_strength: {
        direct: signals.filter((s) => s.signal_strength === "direct").length,
        strong_indirect: signals.filter((s) => s.signal_strength === "strong_indirect").length,
        weak_indirect: signals.filter((s) => s.signal_strength === "weak_indirect").length,
        macro_linked: signals.filter((s) => s.signal_strength === "macro_linked").length,
      },
      by_category: {},
      by_region: {},
      by_type: {},
      asia_exposure_count: signals.filter((s) => s.asia_exposure_flag).length,
      avg_confidence: signals.length
        ? Math.round(signals.reduce((sum, s) => sum + (s.confidence_score || 0), 0) / signals.length)
        : 0,
      scan_time: new Date().toISOString(),
      filters_applied: { focus, lp_type, signal_tier, time_window },
    };

    // Category breakdown
    for (const s of signals) {
      meta.by_category[s.signal_category] = (meta.by_category[s.signal_category] || 0) + 1;
      meta.by_region[s.region || "Unknown"] = (meta.by_region[s.region || "Unknown"] || 0) + 1;
      meta.by_type[s.lp_type || "Unknown"] = (meta.by_type[s.lp_type || "Unknown"] || 0) + 1;
    }

    return Response.json({
      signals,
      coverage_gaps: coverageGaps,
      meta,
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    status: "ready",
    endpoint: "POST /api/scan",
    parameters: {
      focus: "all | asia | north_america | europe | middle_east",
      lp_type: "all | pension | swf | endowment | insurance | corporate",
      signal_tier: "all | direct | strong_indirect | weak_indirect",
      time_window: "1m | 3m | 6m | 12m",
      custom_query: "optional free-text query",
    },
  });
}
