import React, { useState, useEffect } from "react";
import { faqsAPI } from "../utils/api";
import { FiSearch, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await faqsAPI.getAll();
        setFaqs(data.faqs || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()),
  );

  const categories = [...new Set(filtered.map((f) => f.category))];

  return (
    <div className="main-content" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)",
          padding: "60px 0 48px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            marginBottom: 12,
          }}
        >
          Frequently Asked Questions
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: 17,
            marginBottom: 32,
          }}
        >
          Find answers to the most common questions
        </p>
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
            position: "relative",
            padding: "0 24px",
          }}
        >
          <FiSearch
            style={{
              position: "absolute",
              left: 42,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9CA3AF",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs..."
            style={{
              width: "100%",
              padding: "14px 16px 14px 44px",
              border: "none",
              borderRadius: "var(--radius-lg)",
              fontSize: 15,
              outline: "none",
              fontFamily: "var(--font-body)",
            }}
          />
        </div>
      </div>

      <div
        className="container"
        style={{ padding: "48px 24px", maxWidth: 800 }}
      >
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 64 }} className="shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>
              No FAQs found for "{search}"
            </p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  marginBottom: 16,
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    display: "inline-block",
                  }}
                />
                {cat}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered
                  .filter((f) => f.category === cat)
                  .map((faq) => (
                    <div
                      key={faq._id}
                      style={{
                        background: "white",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--border)",
                        overflow: "hidden",
                        transition: "all 0.2s",
                      }}
                    >
                      <button
                        onClick={() =>
                          setOpen(open === faq._id ? null : faq._id)
                        }
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "18px 20px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                          fontFamily: "var(--font-display)",
                          fontWeight: 600,
                          fontSize: 15,
                          color:
                            open === faq._id
                              ? "var(--primary)"
                              : "var(--text-primary)",
                        }}
                      >
                        <span style={{ flex: 1, marginRight: 12 }}>
                          {faq.question}
                        </span>
                        {open === faq._id ? (
                          <FiChevronUp
                            style={{ flexShrink: 0, color: "var(--primary)" }}
                          />
                        ) : (
                          <FiChevronDown
                            style={{
                              flexShrink: 0,
                              color: "var(--text-muted)",
                            }}
                          />
                        )}
                      </button>
                      {open === faq._id && (
                        <div
                          style={{
                            padding: "0 20px 18px",
                            color: "var(--text-secondary)",
                            fontSize: 15,
                            lineHeight: 1.7,
                            borderTop: "1px solid var(--border)",
                            paddingTop: 14,
                            animation: "fadeIn 0.2s ease",
                          }}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
