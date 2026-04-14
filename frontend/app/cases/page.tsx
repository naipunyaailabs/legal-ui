"use client";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getCases, getFilterOptions } from "../lib/api";

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ state: "", year: "", status: "", search: "" });
  const [filterOptions, setFilterOptions] = useState<any>({ states: [], years: [], statuses: [] });

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCases({ page, page_size: 20, ...filters });
      setCases(data.cases);
      setTotal(data.total);
    } catch (e) {}
    setLoading(false);
  }, [page, filters]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  useEffect(() => {
    getFilterOptions().then(setFilterOptions).catch(() => {});
  }, []);

  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <motion.h1
        className="gradient-text"
        style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        Case Explorer
      </motion.h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
        Browse and filter {total.toLocaleString()} cases
      </p>

      {/* Filters */}
      <div className="glass-subtle" style={{ padding: "16px", marginBottom: "20px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          className="input-glass"
          placeholder="Search by party or CINO..."
          style={{ flex: 2, height: "40px", fontSize: "13px" }}
          value={filters.search}
          onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
        />
        <select
          className="input-glass"
          style={{ flex: 1, height: "40px", fontSize: "13px" }}
          value={filters.state}
          onChange={(e) => { setFilters({ ...filters, state: e.target.value }); setPage(1); }}
        >
          <option value="">All Courts</option>
          {filterOptions.states?.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="input-glass"
          style={{ width: "120px", height: "40px", fontSize: "13px" }}
          value={filters.year}
          onChange={(e) => { setFilters({ ...filters, year: e.target.value }); setPage(1); }}
        >
          <option value="">All Years</option>
          {filterOptions.years?.map((y: number) => <option key={y} value={y}>{y}</option>)}
        </select>
        <select
          className="input-glass"
          style={{ flex: 1, height: "40px", fontSize: "13px" }}
          value={filters.status}
          onChange={(e) => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
        >
          <option value="">All Statuses</option>
          {filterOptions.statuses?.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Cases Table */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[1, 2, 3, 4, 5].map((i) => <div key={i} className="skeleton" style={{ height: "64px" }} />)}
        </div>
      ) : (
        <>
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Parties", "Court", "Year", "Company", "Status", "Stage"].map((h) => (
                    <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "var(--text-muted)", fontWeight: 500, fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cases.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                  >
                    <td style={{ padding: "14px 16px", maxWidth: "300px" }}>
                      <Link href={`/cases/${c.id}`} style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 500, fontSize: "13px" }}>
                        {c.raw_petitioner?.slice(0, 30)} vs {c.raw_respondent?.slice(0, 30)}
                      </Link>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{c.cino}</p>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)", fontSize: "12px" }}>{c.state}</td>
                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>{c.search_year}</td>
                    <td style={{ padding: "14px 16px" }}>
                      {c.company_tags?.map((t: string) => (
                        <span key={t} className="badge badge-info" style={{ fontSize: "10px", marginRight: "4px" }}>{t}</span>
                      ))}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span className={`badge ${c.case_status?.includes("DISPOSED") ? "badge-success" : "badge-warning"}`} style={{ fontSize: "10px" }}>
                        {c.case_status || "Pending"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontSize: "11px", maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {c.stage_of_case || "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginTop: "20px" }}>
            <button className="btn-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ fontSize: "13px" }}>
              ← Previous
            </button>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              Page {page} of {totalPages}
            </span>
            <button className="btn-ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ fontSize: "13px" }}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
