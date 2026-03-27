# PE Secondaries Intelligence Engine

Institutional-grade LP liquidity signal detection system. Deploys on Vercel, powered by Claude AI with live web search.

## Architecture

```
app/
├── page.js              # Dashboard UI (React client component)
├── layout.js            # Root layout
├── globals.css          # Terminal-grade dark UI
└── api/
    ├── scan/route.js    # Main intelligence scan endpoint (calls Claude + web search)
    └── health/route.js  # Health check
lib/
├── prompt.js            # Enhanced system prompt + keyword sets + LP segments
├── lp-universe.js       # Pre-seeded LP database (100+ LPs) + advisors + buyers
└── signals.js           # Scoring engine, screening flags, enrichment, dedup
```

## Signal Detection Coverage

### Tier 1 — Direct (Confidence 80-100)
Confirmed secondary sales, advisor mandates, tender offers, GP-led continuations, strip sales

### Tier 2 — Strong Indirect (Confidence 50-79)
Over-allocation, denominator effect, RFPs for advisory, board discussions, new allocation policy, capital call defaults

### Tier 3 — Weak Indirect (Confidence 20-49)
Portfolio reviews, CIO departures, consultant changes, regulatory pressure, peer LP behavior, prior seller patterns

### Tier 4 — Macro-Linked (Confidence 10-30)
Market drawdowns, FX crises, interest rate impact, sanctions, regulatory changes, demographic shifts

### Screening Criteria
- **Financial**: funded ratio, liquidity ratio, PE allocation drift, unfunded commitments
- **Governance**: CIO change, board changes, consultant change, policy shifts
- **Behavioral**: prior sales, advisory mandates, pacing changes
- **Market Context**: drawdowns, FX pressure, peer activity
- **Asia-Specific**: GPIF, NPS Korea, CBIRC, EPF Malaysia, K-ICS, YFYS
- **Time-Sensitive**: fiscal year-end, fund term expiry, lock-up periods

## Deployment

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
2. Framework: Next.js (auto-detected)
3. Add environment variable:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
4. Deploy

### 3. Local development
```bash
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Usage

### POST /api/scan
```json
{
  "focus": "all",
  "lp_type": "all",
  "signal_tier": "all",
  "time_window": "3m",
  "custom_query": "Japan insurance PE secondary"
}
```

### Response
```json
{
  "signals": [ ... ],
  "coverage_gaps": { ... },
  "meta": {
    "total": 12,
    "by_strength": { "direct": 3, "strong_indirect": 5, ... },
    "asia_exposure_count": 7,
    "avg_confidence": 62
  }
}
```

## LP Universe
Pre-seeded with 100+ institutional LPs across:
- 16 Sovereign Wealth Funds
- 28 Public Pension Funds (US, Canada, Europe, Asia-Pacific)
- 8 Endowments & Foundations
- 15 Insurance Companies
- 4 Corporates
- 4 Development Finance Institutions
- 25 Advisory firms + 27 Secondary buyers for cross-referencing

## Key Design Decisions
- **Maximum recall**: prefers false positives over missed signals
- **Multi-layer discovery**: keyword expansion, entity cross-referencing, coverage gap analysis
- **Asia emphasis**: dedicated screening criteria for Japan, Korea, China, SE Asia, Australia
- **Institutional UI**: Bloomberg-terminal inspired dark theme, sortable/filterable table, slide-out detail panels
