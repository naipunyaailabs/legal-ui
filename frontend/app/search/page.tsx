"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { searchCases } from "../lib/api";
import Link from "next/link";

interface SearchResult {
  case: any;
  score: number;
  matched_chunk: string;
  match_reason: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ state: "", year: "", company_tag: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchCases({
        query,
        state: filters.state || undefined,
        year: filters.year ? Number(filters.year) : undefined,
        company_tag: filters.company_tag || undefined,
      });
      setResults(data.results);
      setCurrentPage(1); // Reset to first page on new search
    } catch (err: any) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <motion.h1
        className="gradient-text"
        style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        AI-Powered Legal Search
      </motion.h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "32px" }}>
        Search through company legal cases using natural language
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              className="input-glass"
              style={{ paddingLeft: "44px", fontSize: "15px", height: "52px" }}
              placeholder='Try: "Adani Enterprises cases in Gujarat High Court related to tax..."'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>
              🔍
            </span>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ height: "52px", padding: "0 28px" }}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <input
            className="input-glass"
            placeholder="Court / State"
            style={{ flex: 1, height: "40px", fontSize: "13px" }}
            value={filters.state}
            onChange={(e) => setFilters({ ...filters, state: e.target.value })}
          />
          <input
            className="input-glass"
            placeholder="Year"
            type="number"
            style={{ width: "120px", height: "40px", fontSize: "13px" }}
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
          />
          <input
            className="input-glass"
            placeholder="Company Tag"
            style={{ flex: 1, height: "40px", fontSize: "13px" }}
            value={filters.company_tag}
            onChange={(e) => setFilters({ ...filters, company_tag: e.target.value })}
          />
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: "120px" }} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {!loading && searched && results.length === 0 && (
          <motion.div
            className="glass-card"
            style={{ padding: "48px", textAlign: "center" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ fontSize: "18px", marginBottom: "8px" }}>No results found</p>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Try different keywords or broaden your filters</p>
          </motion.div>
        )}

        {!loading && results.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {results.length} results found
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {results.length > pageSize && (
                  <div style={{ display: "flex", gap: "4px" }}>
                    {Array.from({ length: Math.ceil(results.length / pageSize) }, (_, i) => {
                      const pageNum = i + 1;
                      if (pageNum > 5) return null; // Show max 5 pages at top to keep it clean
                      return (
                        <button
                          key={pageNum}
                          className={currentPage === pageNum ? "btn-primary" : "btn-ghost"}
                          style={{ width: "32px", height: "32px", padding: 0, justifyContent: "center", fontSize: "12px" }}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {Math.ceil(results.length / pageSize) > 5 && (
                      <span style={{ display: "flex", alignItems: "center", padding: "0 4px", color: "var(--text-muted)", fontSize: "12px" }}>...</span>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Show:</span>
                  <select 
                    className="input-glass" 
                    style={{ width: "80px", height: "32px", padding: "0 8px", fontSize: "12px" }}
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    {[10, 50, 100, 150, 200].map(size => (
                      <option key={size} value={size} style={{ background: "white", color: "black" }}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {results.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((r, i) => (
              <motion.div
                key={r.case.id}
                className="glass-card"
                style={{ padding: "20px" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <Link
                      href={`/cases/${r.case.id}`}
                      style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", textDecoration: "none" }}
                    >
                      {r.case.raw_petitioner} vs {r.case.raw_respondent}
                    </Link>
                    <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>🏛️ {r.case.state}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>📅 {r.case.search_year}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>📋 {r.case.cino}</span>
                      {r.case.stage_of_case && (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>📌 {r.case.stage_of_case}</span>
                      )}
                    </div>
                    {r.matched_chunk && (
                      <p style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        marginTop: "12px",
                        padding: "10px 14px",
                        background: "rgba(79, 70, 229, 0.05)",
                        borderLeft: "3px solid var(--accent-primary)",
                        borderRadius: "0 8px 8px 0",
                        lineHeight: "1.5",
                      }}>
                        {r.matched_chunk.slice(0, 250)}...
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", marginLeft: "16px" }}>
                    <div
                      className="badge badge-info"
                      style={{ fontSize: "11px" }}
                    >
                      Score: {((r.score / Math.max(...results.map(res => res.score), 1)) * 100).toFixed(0)}%
                    </div>
                    {r.case.company_tags?.map((tag: string) => (
                      <span key={tag} className="badge badge-success" style={{ fontSize: "11px" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination Controls */}
            {results.length > pageSize && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                <button 
                  className="btn-ghost" 
                  style={{ padding: "8px 12px" }}
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </button>
                
                <div style={{ display: "flex", gap: "4px" }}>
                  {Array.from({ length: Math.min(5, Math.ceil(results.length / pageSize)) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={currentPage === pageNum ? "btn-primary" : "btn-ghost"}
                        style={{ width: "36px", height: "36px", padding: 0, justifyContent: "center" }}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {Math.ceil(results.length / pageSize) > 5 && (
                    <span style={{ display: "flex", alignItems: "center", padding: "0 8px", color: "var(--text-muted)" }}>...</span>
                  )}
                </div>

                <button 
                  className="btn-ghost" 
                  style={{ padding: "8px 12px" }}
                  disabled={currentPage === Math.ceil(results.length / pageSize)}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Suggested queries */}
      {!searched && (
        <motion.div
          style={{ marginTop: "24px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>Suggested queries:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              "Adani Enterprises vs Income Tax cases",
              "Gujarat High Court writ petitions 2024",
              "Cases related to Arbitration Act",
              "Adani Ports tax disputes",
              "Cases disposed in 2025",
            ].map((q) => (
              <button
                key={q}
                className="btn-ghost"
                style={{ fontSize: "12px", padding: "8px 14px" }}
                onClick={() => { setQuery(q); }}
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
