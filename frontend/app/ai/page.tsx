"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { askAI } from "../lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidence?: number;
  sources?: any[];
  mode?: string;
  insufficient_evidence?: boolean;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("research");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const data = await askAI({ question: input, mode, max_sources: 5 });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
        sources: data.sources,
        mode: data.mode,
        insufficient_evidence: data.insufficient_evidence,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: `Error: ${err.message}. Make sure the backend is running.` },
      ]);
    }
    setLoading(false);
  };

  const modes = [
    { value: "research", label: "Research", desc: "Evidence-first, conservative" },
    { value: "advisory", label: "Advisory", desc: "Recommendations with citations" },
    { value: "executive", label: "Executive", desc: "Plain English summary" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 48px)" }}>
      <div style={{ marginBottom: "16px" }}>
        <motion.h1
          className="gradient-text"
          style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          AI Legal Assistant
        </motion.h1>

        {/* Mode Selector */}
        <div style={{ display: "flex", gap: "8px" }}>
          {modes.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 500,
                border: mode === m.value ? "1px solid var(--accent-primary)" : "1px solid rgba(255,255,255,0.08)",
                background: mode === m.value ? "rgba(99,102,241,0.15)" : "transparent",
                color: mode === m.value ? "var(--accent-primary)" : "var(--text-muted)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              title={m.desc}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflow: "auto", paddingRight: "8px" }}>
        {messages.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>⚖️</p>
            <p style={{ fontSize: "18px", fontWeight: 500, marginBottom: "8px" }}>Ask a legal question</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", maxWidth: "450px", textAlign: "center", lineHeight: 1.6 }}>
              Get citation-grounded answers from your company&apos;s legal case database. All answers are backed by retrieved evidence.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "24px", justifyContent: "center", maxWidth: "600px" }}>
              {[
                "What arguments have succeeded in writ matters against Adani?",
                "Show tax-related disputes in Gujarat High Court",
                "What is the status of Adani Ports cases in 2025?",
              ].map((q) => (
                <button key={q} className="btn-ghost" style={{ fontSize: "12px", padding: "8px 12px" }} onClick={() => setInput(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: "16px",
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: msg.role === "user" ? "60%" : "85%",
                  padding: "16px 20px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))"
                    : "var(--bg-glass)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border-glass)",
                }}
              >
                <p style={{ fontSize: "14px", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{msg.content}</p>

                {/* Confidence & Mode */}
                {msg.confidence !== undefined && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
                    <span className={`badge ${msg.confidence >= 0.7 ? "badge-success" : msg.confidence >= 0.4 ? "badge-warning" : "badge-danger"}`}>
                      Confidence: {(msg.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="badge badge-info">{msg.mode} mode</span>
                    {msg.insufficient_evidence && <span className="badge badge-warning">⚠ Limited evidence</span>}
                  </div>
                )}

                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div style={{ marginTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>
                      📚 Sources ({msg.sources.length})
                    </p>
                    {msg.sources.map((s: any, i: number) => (
                      <div key={i} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "6px", borderLeft: "3px solid var(--accent-primary)" }}>
                        <Link href={`/cases/${s.case_id}`} style={{ fontSize: "12px", fontWeight: 500, color: "#818cf8", textDecoration: "none" }}>
                          {s.case_title?.slice(0, 80)}
                        </Link>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
                          {s.court} • {s.year} • Score: {(s.relevance_score * 100).toFixed(0)}%
                        </p>
                        {s.relevant_passage && (
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px", fontStyle: "italic" }}>
                            &quot;{s.relevant_passage.slice(0, 150)}...&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "16px" }}>
            <div className="glass-subtle" style={{ padding: "16px 20px", display: "flex", gap: "6px" }}>
              <div className="skeleton" style={{ width: "8px", height: "8px", borderRadius: "50%" }} />
              <div className="skeleton" style={{ width: "8px", height: "8px", borderRadius: "50%" }} />
              <div className="skeleton" style={{ width: "8px", height: "8px", borderRadius: "50%" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "12px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <input
          className="input-glass"
          style={{ flex: 1, height: "52px", fontSize: "14px" }}
          placeholder="Ask a legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()} style={{ height: "52px", padding: "0 24px" }}>
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
