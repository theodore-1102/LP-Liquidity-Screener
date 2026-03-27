// app/page.js
"use client";

import { useState, useCallback } from "react";

const STRENGTH_BADGES = {
  direct: { label: "DIRECT", cls: "badge-direct" },
  strong_indirect: { label: "STRONG", cls: "badge-strong" },
  weak_indirect: { label: "WEAK", cls: "badge-weak" },
  macro_linked: { label: "MACRO", cls: "badge-macro" },
};

const CATEGORY_LABELS = {
  liquidity: "Liquidity",
  rebalancing: "Rebalancing",
  denominator_effect: "Denominator",
  structural: "Structural",
  behavioral: "Behavioral",
  macro: "Macro",
  regulatory: "Regulatory",
};

function ConfidenceBar({ score }) {
  const level = score >= 65 ? "high" : score >= 35 ? "mid" : "low";
  return (
    <span style={{ display: "inline-flex", alignItems: "center" }}>
      <span className="confidence-bar-container">
        <span className={`confidence-bar ${level}`} style={{ width: `${score}%` }} />
      </span>
      <span className="confidence-text">{score}</span>
    </span>
  );
}

function SignalDetailPanel({ signal, onClose }) {
  if (!signal) return null;

  const flags = signal.screening_flags || {};
  const allFlags = [
    ...( flags.financial || []),
    ...(flags.governance || []),
    ...(flags.behavioral || []),
    ...(flags.market_context || []),
    ...(flags.asia_specific || []),
    ...(flags.time_sensitive || []),
  ];

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose}>← Back</button>

        <div className="detail-title">{signal.lp_name}</div>
        <div className="lp-meta" style={{ marginBottom: 8 }}>
          {signal.lp_type?.toUpperCase()} · {signal.country} · {signal.region}
        </div>

        {signal.asia_exposure_flag && <span className="badge badge-asia" style={{ marginBottom: 12 }}>ASIA EXPOSURE</span>}

        <div className="detail-section">
          <div className="detail-section-title">Signal Summary</div>
          <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text-secondary)" }}>
            {signal.signal_description}
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Signal Profile</div>
          <div className="detail-row">
            <span className="detail-row-label">Strength</span>
            <span className="detail-row-value">
              <span className={`badge ${STRENGTH_BADGES[signal.signal_strength]?.cls || ""}`}>
                {STRENGTH_BADGES[signal.signal_strength]?.label || signal.signal_strength}
              </span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Category</span>
            <span className="detail-row-value">{CATEGORY_LABELS[signal.signal_category] || signal.signal_category}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Confidence</span>
            <span className="detail-row-value"><ConfidenceBar score={signal.confidence_score || 0} /></span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Composite Score</span>
            <span className="detail-row-value">{signal.composite_score || "—"}</span>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Financials</div>
          <div className="detail-row">
            <span className="detail-row-label">Est. AUM</span>
            <span className="detail-row-value">{signal.aum_estimate_usd_bn ? `$${signal.aum_estimate_usd_bn}B` : "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">PE Allocation</span>
            <span className="detail-row-value">{signal.pe_allocation_pct ? `${signal.pe_allocation_pct}%` : "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">PE Portfolio (est.)</span>
            <span className="detail-row-value">{signal.pe_allocation_usd_bn ? `$${signal.pe_allocation_usd_bn}B` : "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Est. Portfolio for Sale</span>
            <span className="detail-row-value">{signal.estimated_portfolio_size_usd_mn ? `$${signal.estimated_portfolio_size_usd_mn}M` : "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Time to Sell (est.)</span>
            <span className="detail-row-value">{signal.estimated_time_to_sell || "—"}</span>
          </div>
        </div>

        {allFlags.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Screening Flags</div>
            <div>{allFlags.map((f, i) => <span key={i} className="flag-tag">{f}</span>)}</div>
          </div>
        )}

        {signal.linked_entities && (
          <div className="detail-section">
            <div className="detail-section-title">Linked Entities</div>
            {signal.linked_entities.gps?.length > 0 && (
              <div className="detail-row">
                <span className="detail-row-label">GPs</span>
                <span className="detail-row-value">{signal.linked_entities.gps.join(", ")}</span>
              </div>
            )}
            {signal.linked_entities.advisors?.length > 0 && (
              <div className="detail-row">
                <span className="detail-row-label">Advisors</span>
                <span className="detail-row-value">{signal.linked_entities.advisors.join(", ")}</span>
              </div>
            )}
            {signal.linked_entities.funds?.length > 0 && (
              <div className="detail-row">
                <span className="detail-row-label">Funds</span>
                <span className="detail-row-value">{signal.linked_entities.funds.join(", ")}</span>
              </div>
            )}
            {signal.linked_entities.related_lps?.length > 0 && (
              <div className="detail-row">
                <span className="detail-row-label">Related LPs</span>
                <span className="detail-row-value">{signal.linked_entities.related_lps.join(", ")}</span>
              </div>
            )}
          </div>
        )}

        {signal.evidence?.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Evidence ({signal.evidence.length})</div>
            {signal.evidence.map((ev, i) => (
              <div key={i} className="evidence-card">
                <div className="evidence-source">{ev.source}</div>
                <div className="evidence-title">{ev.title}</div>
                <div className="evidence-date">{ev.date}</div>
                {ev.url && (
                  <a className="evidence-link" href={ev.url} target="_blank" rel="noopener noreferrer">
                    {ev.url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [focus, setFocus] = useState("all");
  const [lpType, setLpType] = useState("all");
  const [signalTier, setSignalTier] = useState("all");
  const [timeWindow, setTimeWindow] = useState("3m");
  const [customQuery, setCustomQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedSignal, setSelectedSignal] = useState(null);
  const [tableFilter, setTableFilter] = useState("");

  const LOADING_MESSAGES = [
    "Initializing LP universe scan…",
    "Querying multi-source intelligence layer…",
    "Cross-referencing entity networks…",
    "Applying screening criteria matrix…",
    "Scoring and ranking signals…",
    "Running coverage gap analysis…",
  ];

  const runScan = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSelectedSignal(null);

    let msgIndex = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 4000);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focus,
          lp_type: lpType,
          signal_tier: signalTier,
          time_window: timeWindow,
          custom_query: customQuery || null,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error + (data.details ? `: ${data.details}` : ""));
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }, [focus, lpType, signalTier, timeWindow, customQuery]);

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pe-secondaries-scan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSignals = result?.signals?.filter((s) => {
    if (!tableFilter) return true;
    const q = tableFilter.toLowerCase();
    return (
      s.lp_name?.toLowerCase().includes(q) ||
      s.country?.toLowerCase().includes(q) ||
      s.region?.toLowerCase().includes(q) ||
      s.signal_category?.toLowerCase().includes(q) ||
      s.lp_type?.toLowerCase().includes(q)
    );
  }) || [];

  const meta = result?.meta || {};

  return (
    <div className="shell">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="topbar-logo" />
          <div>
            <div className="topbar-title">PE Secondaries Intelligence</div>
            <div className="topbar-subtitle">LP Liquidity Signal Engine</div>
          </div>
        </div>
        <div className="topbar-status">
          {meta.scan_time && <span>Last scan: {new Date(meta.scan_time).toLocaleString()}</span>}
          <span style={{ color: "var(--accent-green)" }}>● ONLINE</span>
        </div>
      </header>

      <main className="main">
        {/* CONTROLS */}
        <div className="controls">
          <div className="control-group">
            <label className="control-label">Geography</label>
            <select className="control-select" value={focus} onChange={(e) => setFocus(e.target.value)}>
              <option value="all">Global (Asia emphasis)</option>
              <option value="asia">Asia Only</option>
              <option value="north_america">North America</option>
              <option value="europe">Europe</option>
              <option value="middle_east">Middle East</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">LP Type</label>
            <select className="control-select" value={lpType} onChange={(e) => setLpType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="pension">Pension Funds</option>
              <option value="swf">Sovereign Wealth</option>
              <option value="endowment">Endowments</option>
              <option value="insurance">Insurance</option>
              <option value="corporate">Corporates</option>
              <option value="dfi">DFIs</option>
              <option value="family_office">Family Offices</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Signal Tier</label>
            <select className="control-select" value={signalTier} onChange={(e) => setSignalTier(e.target.value)}>
              <option value="all">All Tiers</option>
              <option value="direct">Direct Only</option>
              <option value="strong_indirect">Strong Indirect</option>
              <option value="weak_indirect">Weak Indirect</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Time Window</label>
            <select className="control-select" value={timeWindow} onChange={(e) => setTimeWindow(e.target.value)}>
              <option value="1m">Last 1 Month</option>
              <option value="3m">Last 3 Months</option>
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Custom Query</label>
            <input
              className="control-input"
              placeholder="e.g. Japan insurance PE secondary…"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runScan()}
            />
          </div>

          <button className="btn-scan" onClick={runScan} disabled={loading}>
            {loading ? "Scanning…" : "Run Scan"}
          </button>

          {result && (
            <button className="btn-scan" onClick={downloadJSON} style={{ background: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
              Export JSON
            </button>
          )}
        </div>

        {/* ERROR */}
        {error && <div className="error-banner">⚠ {error}</div>}

        {/* LOADING */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <div className="loading-text">{loadingMsg}</div>
          </div>
        )}

        {/* STATS */}
        {result && !loading && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Signals</div>
                <div className="stat-value green">{meta.total || 0}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Direct</div>
                <div className="stat-value green">{meta.by_strength?.direct || 0}</div>
                <div className="stat-sub">Confirmed transactions</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Strong Indirect</div>
                <div className="stat-value blue">{meta.by_strength?.strong_indirect || 0}</div>
                <div className="stat-sub">High-probability leads</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Weak / Macro</div>
                <div className="stat-value amber">{(meta.by_strength?.weak_indirect || 0) + (meta.by_strength?.macro_linked || 0)}</div>
                <div className="stat-sub">Early indicators</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Asia Exposure</div>
                <div className="stat-value red">{meta.asia_exposure_count || 0}</div>
                <div className="stat-sub">Asia-linked signals</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Avg Confidence</div>
                <div className="stat-value purple">{meta.avg_confidence || 0}%</div>
              </div>
            </div>

            {/* BREAKDOWN MINI-BARS */}
            <div className="stats-grid" style={{ marginBottom: 28 }}>
              <div className="stat-card">
                <div className="stat-label">By Category</div>
                {Object.entries(meta.by_category || {}).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{CATEGORY_LABELS[k] || k}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="stat-card">
                <div className="stat-label">By Region</div>
                {Object.entries(meta.by_region || {}).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="stat-card">
                <div className="stat-label">By LP Type</div>
                {Object.entries(meta.by_type || {}).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{k}</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SIGNALS TABLE */}
            <div className="signals-section">
              <div className="section-header">
                <span className="section-title">Detected Signals</span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <input
                    className="control-input"
                    placeholder="Filter table…"
                    value={tableFilter}
                    onChange={(e) => setTableFilter(e.target.value)}
                    style={{ minWidth: 180, padding: "6px 10px" }}
                  />
                  <span className="signal-count">{filteredSignals.length} results</span>
                </div>
              </div>

              {filteredSignals.length > 0 ? (
                <div style={{ overflowX: "auto" }}>
                  <table className="signals-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>LP Name</th>
                        <th>Type</th>
                        <th>Country</th>
                        <th>Strength</th>
                        <th>Category</th>
                        <th>Confidence</th>
                        <th>AUM</th>
                        <th>Asia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSignals.map((sig, i) => (
                        <tr key={i} onClick={() => setSelectedSignal(sig)}>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{i + 1}</td>
                          <td>
                            <div className="lp-name">{sig.lp_name}</div>
                            <div className="lp-meta">{sig.signal_description?.slice(0, 80)}…</div>
                          </td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{sig.lp_type}</td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>{sig.country}</td>
                          <td>
                            <span className={`badge ${STRENGTH_BADGES[sig.signal_strength]?.cls || ""}`}>
                              {STRENGTH_BADGES[sig.signal_strength]?.label || sig.signal_strength}
                            </span>
                          </td>
                          <td style={{ fontSize: 12 }}>{CATEGORY_LABELS[sig.signal_category] || sig.signal_category}</td>
                          <td><ConfidenceBar score={sig.confidence_score || 0} /></td>
                          <td style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}>
                            {sig.aum_estimate_usd_bn ? `$${sig.aum_estimate_usd_bn}B` : "—"}
                          </td>
                          <td>{sig.asia_exposure_flag ? <span className="badge badge-asia">ASIA</span> : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-title">No signals match your filter</div>
                  <div className="empty-text">Try broadening your search criteria.</div>
                </div>
              )}
            </div>

            {/* COVERAGE GAPS */}
            {result.coverage_gaps && (
              <div className="gaps-section">
                <div className="section-title" style={{ marginBottom: 12 }}>Coverage Gap Analysis</div>
                {result.coverage_gaps.missing_regions?.length > 0 && (
                  <div className="gap-item">Under-covered regions: {result.coverage_gaps.missing_regions.join(", ")}</div>
                )}
                {result.coverage_gaps.missing_lp_types?.length > 0 && (
                  <div className="gap-item">Under-covered LP types: {result.coverage_gaps.missing_lp_types.join(", ")}</div>
                )}
                {result.coverage_gaps.suggested_additional_searches?.map((s, i) => (
                  <div key={i} className="gap-item">{s}</div>
                ))}
              </div>
            )}
          </>
        )}

        {/* EMPTY STATE (no scan yet) */}
        {!result && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">◎</div>
            <div className="empty-title">Ready to scan</div>
            <div className="empty-text">
              Configure your parameters above and click Run Scan to execute a comprehensive LP liquidity signal
              detection sweep powered by Claude AI with live web intelligence.
            </div>
          </div>
        )}
      </main>

      {/* DETAIL PANEL */}
      {selectedSignal && <SignalDetailPanel signal={selectedSignal} onClose={() => setSelectedSignal(null)} />}
    </div>
  );
}
