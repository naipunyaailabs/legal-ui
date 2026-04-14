"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCase, summarizeCase } from "../../lib/api";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = Number(params.id);
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (caseId) {
      getCase(caseId)
        .then(setCaseData)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [caseId]);

  const handleSummarize = async () => {
    setSummarizing(true);
    try {
      const data = await summarizeCase(caseId);
      setSummary(data);
    } catch (e) {}
    setSummarizing(false);
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: "40px", width: "300px", marginBottom: "24px" }} />
        <div className="skeleton" style={{ height: "400px" }} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="glass-card" style={{ padding: "48px", textAlign: "center" }}>
        <p style={{ fontSize: "18px" }}>Case not found</p>
        <Link href="/cases" className="btn-primary" style={{ marginTop: "16px", display: "inline-block" }}>
          Back to Cases
        </Link>
      </div>
    );
  }

  const c = caseData;

  const metaFields = [
    { label: "CINO", value: c.cino },
    { label: "CNR Number", value: c.cnr_number },
    { label: "Court", value: c.state },
    { label: "District", value: c.district },
    { label: "Bench Type", value: c.bench_type },
    { label: "Judicial Branch", value: c.judicial_branch },
    { label: "Year", value: c.search_year },
    { label: "Filing Number", value: c.filing_number },
    { label: "Filing Date", value: c.filing_date },
    { label: "Registration Number", value: c.registration_number },
    { label: "Registration Date", value: c.registration_date },
    { label: "First Hearing", value: c.first_hearing_date },
    { label: "Next Hearing", value: c.next_hearing_date },
    { label: "Decision Date", value: c.decision_date },
    { label: "Stage", value: c.stage_of_case },
    { label: "Status", value: c.case_status },
    { label: "Disposal", value: c.nature_of_disposal },
    { label: "Coram", value: c.coram },
  ].filter((f) => f.value);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <Link href="/cases" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "12px" }}>
          ← Back to Cases
        </Link>
        <motion.h1
          style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.3 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {c.raw_petitioner} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>vs</span> {c.raw_respondent}
        </motion.h1>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
          <span className={`badge ${c.case_status?.includes("DISPOSED") ? "badge-success" : "badge-warning"}`}>
            {c.case_status || "Pending"}
          </span>
          {c.company_tags?.map((t: string) => (
            <span key={t} className="badge badge-info">{t}</span>
          ))}
          <span className="badge badge-info">{c.state}</span>
          <span className="badge badge-info">{c.search_year}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Case Metadata */}
        <motion.div className="glass-card" style={{ padding: "24px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>📋 Case Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {metaFields.map((f) => (
              <div key={f.label}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px", wordBreak: "break-word" }}>{f.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Parties & Advocates */}
        <motion.div className="glass-card" style={{ padding: "24px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>👥 Parties & Advocates</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Petitioner</p>
              <p style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}>{c.raw_petitioner}</p>
              {c.petitioner_advocate && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Advocate: {c.petitioner_advocate}</p>}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase" }}>Respondent</p>
              <p style={{ fontSize: "14px", fontWeight: 500, marginTop: "4px" }}>{c.raw_respondent}</p>
              {c.respondent_advocate && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Advocate: {c.respondent_advocate}</p>}
            </div>
          </div>
          {/* Acts */}
          {c.acts?.length > 0 && (
            <div style={{ marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "8px" }}>Acts & Sections</p>
              {c.acts.map((a: any) => (
                <div key={a.id} className="badge badge-info" style={{ marginRight: "6px", marginBottom: "6px" }}>
                  {a.act_name} {a.section ? `§${a.section}` : ""}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Summary */}
      <motion.div className="glass-card" style={{ padding: "24px", marginTop: "24px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>🤖 AI Summary</h3>
          <button className="btn-primary" onClick={handleSummarize} disabled={summarizing} style={{ fontSize: "13px", padding: "8px 16px" }}>
            {summarizing ? "Generating..." : summary ? "Regenerate" : "Generate Summary"}
          </button>
        </div>
        {summary ? (
          <div>
            <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)" }}>{summary.summary}</p>
            {summary.key_facts?.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>Key Facts:</p>
                <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  {summary.key_facts.map((f: string, i: number) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Click "Generate Summary" to get an AI-powered case analysis</p>
        )}
      </motion.div>

      {/* Hearing History */}
      {c.hearings?.length > 0 && (
        <motion.div className="glass-card" style={{ padding: "24px", marginTop: "24px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>📅 Hearing History</h3>
          <div style={{ position: "relative", paddingLeft: "24px" }}>
            <div style={{ position: "absolute", left: "8px", top: 0, bottom: 0, width: "2px", background: "linear-gradient(180deg, var(--accent-primary), transparent)" }} />
            {c.hearings.map((h: any, i: number) => (
              <div key={h.id} style={{ position: "relative", marginBottom: "16px", paddingLeft: "16px" }}>
                <div style={{ position: "absolute", left: "-20px", top: "4px", width: "12px", height: "12px", borderRadius: "50%", background: i === 0 ? "var(--accent-primary)" : "rgba(255,255,255,0.15)", border: "2px solid var(--bg-primary)" }} />
                <p style={{ fontSize: "13px", fontWeight: 500 }}>{h.hearing_date || "Date N/A"}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{h.purpose || "—"}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Judge: {h.judge || "—"}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Orders */}
      {c.orders?.length > 0 && (
        <motion.div className="glass-card" style={{ padding: "24px", marginTop: "24px" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>📜 Orders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {c.orders.map((o: any) => (
              <div key={o.id} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>Order #{o.order_number}</span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{o.order_date}</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>{o.judge}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
