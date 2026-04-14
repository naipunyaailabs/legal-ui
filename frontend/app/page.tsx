"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDashboardStats } from "./lib/api";

interface Stats {
  total_cases: number;
  total_courts: number;
  year_range: number[];
  cases_by_year: Record<string, number>;
  cases_by_court: Record<string, number>;
  cases_by_status: Record<string, number>;
  cases_by_company: Record<string, number>;
  recent_cases: any[];
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="gradient-text" style={{ fontSize: "28px", fontWeight: 700, marginBottom: "32px" }}>
          Dashboard
        </h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: "120px" }} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="gradient-text" style={{ fontSize: "28px", fontWeight: 700, marginBottom: "16px" }}>
          Dashboard
        </h1>
        <div className="glass-card" style={{ padding: "32px", textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>
            Backend not connected yet. Start the backend server first.
          </p>
          <code style={{ fontSize: "13px", color: "var(--text-muted)" }}>{error}</code>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Cases", value: stats.total_cases.toLocaleString(), icon: "⚖️", color: "#6366f1" },
    { label: "Courts", value: stats.total_courts, icon: "🏛️", color: "#8b5cf6" },
    { label: "Year Range", value: `${stats.year_range[0]}–${stats.year_range[1]}`, icon: "📅", color: "#3b82f6" },
    { label: "Petitioner Cases", value: stats.cases_by_company?.petitioner || 0, icon: "👤", color: "#10b981" },
  ];

  const courtEntries = Object.entries(stats.cases_by_court).slice(0, 8);
  const maxCourtVal = Math.max(...courtEntries.map(([, v]) => v), 1);
  const yearEntries = Object.entries(stats.cases_by_year).sort(([a], [b]) => Number(a) - Number(b));
  const maxYearVal = Math.max(...yearEntries.map(([, v]) => v), 1);

  return (
    <div>
      <motion.h1
        className="gradient-text"
        style={{ fontSize: "28px", fontWeight: 700, marginBottom: "32px" }}
        {...fadeIn}
      >
        Dashboard
      </motion.h1>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card"
            style={{ padding: "24px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>{card.label}</p>
                <p style={{ fontSize: "28px", fontWeight: 700, color: card.color }}>{card.value}</p>
              </div>
              <span style={{ fontSize: "28px" }}>{card.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
        {/* Cases by Year Chart */}
        <motion.div className="glass-card" style={{ padding: "24px" }} {...fadeIn} transition={{ delay: 0.2 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "var(--text-primary)" }}>
            Cases by Year
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {yearEntries.map(([year, count]) => (
              <div key={year} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "40px" }}>{year}</span>
                <div style={{ flex: 1, height: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", overflow: "hidden" }}>
                  <motion.div
                    style={{
                      height: "100%",
                      background: `linear-gradient(90deg, #6366f1, #8b5cf6)`,
                      borderRadius: "4px",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxYearVal) * 100}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", width: "35px", textAlign: "right" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cases by Court */}
        <motion.div className="glass-card" style={{ padding: "24px" }} {...fadeIn} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "20px", color: "var(--text-primary)" }}>
            Top Courts
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {courtEntries.map(([court, count]) => (
              <div key={court} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{ fontSize: "12px", color: "var(--text-muted)", width: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={court}
                >
                  {court}
                </span>
                <div style={{ flex: 1, height: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", overflow: "hidden" }}>
                  <motion.div
                    style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                      borderRadius: "4px",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCourtVal) * 100}%` }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)", width: "35px", textAlign: "right" }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Cases */}
      <motion.div className="glass-card" style={{ padding: "24px" }} {...fadeIn} transition={{ delay: 0.4 }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>Recent Cases</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {stats.recent_cases.map((c: any) => (
            <a
              key={c.id}
              href={`/cases/${c.id}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
                textDecoration: "none",
                color: "inherit",
                transition: "all 0.2s",
              }}
            >
              <div>
                <p style={{ fontSize: "13px", fontWeight: 500 }}>
                  {c.raw_petitioner?.slice(0, 40)} vs {c.raw_respondent?.slice(0, 40)}
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                  {c.state} • {c.search_year} • {c.cino}
                </p>
              </div>
              <span className={`badge ${c.case_status?.includes("DISPOSED") ? "badge-success" : "badge-warning"}`}>
                {c.case_status || c.stage_of_case || "Pending"}
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
