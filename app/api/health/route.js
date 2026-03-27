// app/api/health/route.js
export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  return Response.json({
    status: hasKey ? "operational" : "missing_api_key",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    engine: "PE Secondaries Intelligence Engine",
    model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
  });
}
