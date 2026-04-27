"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { generateDraft } from "../lib/api";

export default function DraftsPage() {
  const [draftType, setDraftType] = useState("brief");
  const [caseIds, setCaseIds] = useState("");
  const [instructions, setInstructions] = useState("");
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const idsOrCinos = caseIds.split(",").map((s) => s.trim()).filter(Boolean);
    if (idsOrCinos.length === 0) {
      setDraft({ content: "Error: Please enter at least one Case ID or CINO.", cited_cases: [], placeholders: [] });
      return;
    }

    setLoading(true);
    try {
      const data = await generateDraft({ draft_type: draftType, case_identifiers: idsOrCinos, instructions: instructions || undefined });
      setDraft(data);
    } catch (err: any) {
      setDraft({ content: `Error: ${err.message}`, cited_cases: [], placeholders: [] });
    }
    setLoading(false);
  };

  const draftTypes = [
    { value: "notice", label: "Legal Notice", icon: "📨", desc: "Formal notice with legal grounds" },
    { value: "reply", label: "Reply/Response", icon: "↩️", desc: "Para-wise reply with objections" },
    { value: "brief", label: "Case Brief", icon: "📄", desc: "Facts, issues, and analysis" },
    { value: "memo", label: "Legal Memo", icon: "📝", desc: "Internal analysis memo" },
  ];

  return (
    <div>
      <motion.h1
        className="gradient-text"
        style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        Legal Drafting Workspace
      </motion.h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px" }}>
        Generate legal documents grounded in your case data
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px" }}>
        {/* Config Panel */}
        <div>
          <form onSubmit={handleGenerate}>
            {/* Draft Type */}
            <div className="glass-card" style={{ padding: "20px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "12px" }}>Document Type</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {draftTypes.map((dt) => (
                  <button
                    key={dt.value}
                    type="button"
                    onClick={() => setDraftType(dt.value)}
                    style={{
                      padding: "14px 12px",
                      borderRadius: "12px",
                      textAlign: "left",
                      cursor: "pointer",
                      border: draftType === dt.value ? "1px solid var(--accent-primary)" : "1px solid rgba(255,255,255,0.06)",
                      background: draftType === dt.value ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.02)",
                      transition: "all 0.2s",
                      color: "inherit",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{dt.icon}</span>
                    <p style={{ fontSize: "13px", fontWeight: 500, marginTop: "6px" }}>{dt.label}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{dt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Case IDs */}
            <div className="glass-card" style={{ padding: "20px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Source Case IDs</p>
              <input
                className="input-glass"
                placeholder="e.g. 1, 2, 3"
                value={caseIds}
                onChange={(e) => setCaseIds(e.target.value)}
              />
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>
                Enter Database IDs (e.g. 1) or CINOs (e.g. KAHC010...) separated by commas
              </p>
            </div>

            {/* Instructions */}
            <div className="glass-card" style={{ padding: "20px", marginBottom: "16px" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>Additional Instructions (Optional)</p>
              <textarea
                className="input-glass"
                style={{ minHeight: "80px", resize: "vertical" }}
                placeholder="e.g. Focus on arbitration-related arguments..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading || !caseIds.trim()} style={{ width: "100%", justifyContent: "center", height: "48px" }}>
              {loading ? "⏳ Generating..." : "✨ Generate Draft"}
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div>
          {!draft && !loading && (
            <div className="glass-card" style={{ padding: "64px 32px", textAlign: "center", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <p style={{ fontSize: "48px", marginBottom: "16px" }}>📝</p>
              <p style={{ fontSize: "16px", fontWeight: 500, marginBottom: "8px" }}>Ready to Draft</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "350px", lineHeight: 1.6 }}>
                Select a document type, enter source case IDs, and click generate. All drafts are grounded in your case evidence.
              </p>
            </div>
          )}

          {loading && (
            <div className="glass-card" style={{ padding: "32px" }}>
              <div className="skeleton" style={{ height: "20px", width: "60%", marginBottom: "16px" }} />
              <div className="skeleton" style={{ height: "300px" }} />
            </div>
          )}

          {draft && !loading && (
            <motion.div
              className="glass-card"
              style={{ padding: "24px" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                  {draftTypes.find((d) => d.value === draftType)?.icon} Generated {draftTypes.find((d) => d.value === draftType)?.label}
                </h3>
                <button
                  className="btn-ghost"
                  style={{ fontSize: "12px" }}
                  onClick={() => navigator.clipboard.writeText(draft.content)}
                >
                  📋 Copy
                </button>
              </div>

              <div style={{
                padding: "20px",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.04)",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
                whiteSpace: "pre-wrap",
                maxHeight: "500px",
                overflow: "auto",
              }}>
                {draft.content}
              </div>

              {/* Cited Cases */}
              {draft.cited_cases?.length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>Cited Cases:</p>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {draft.cited_cases.map((c: string) => (
                      <span key={c} className="badge badge-info" style={{ fontSize: "11px" }}>{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Placeholders */}
              {draft.placeholders?.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  <p style={{ fontSize: "12px", color: "var(--warning)", marginBottom: "6px" }}>⚠️ Placeholders to fill:</p>
                  <ul style={{ paddingLeft: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
                    {draft.placeholders.map((p: string, i: number) => <li key={i}>{p}</li>)}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
