"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/search", label: "AI Search", icon: "🔍" },
  { href: "/cases", label: "Case Explorer", icon: "📂" },
  { href: "/ai", label: "AI Assistant", icon: "🤖" },
  { href: "/drafts", label: "Drafting", icon: "📝" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "260px",
        background: "rgba(10, 14, 26, 0.95)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 8px", marginBottom: "40px" }}>
        <h1
          className="gradient-text"
          style={{ fontSize: "22px", fontWeight: 800, letterSpacing: "-0.5px" }}
        >
          LexRAG Counsel
        </h1>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
          Legal AI Research Platform
        </p>
      </div>

      {/* Navigation */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive
                  ? "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 100%)"
                  : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.2)" : "1px solid transparent",
                textDecoration: "none",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "3px",
                    height: "20px",
                    background: "linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))",
                    borderRadius: "0 3px 3px 0",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        <p>Powered by Groq + pgvector</p>
        <p style={{ marginTop: "2px" }}>v1.0 • {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
}
