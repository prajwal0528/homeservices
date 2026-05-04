import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { servicesAPI, aiAPI } from "../../utils/api";
import ServiceCard from "../../components/user/ServiceCard";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";

const CATEGORIES = [
  "All",
  "Cleaning Services",
  "Repair & Maintenance",
  "Home Improvement",
  "Outdoor Services",
  "Personal & Care Services",
  "Convenience Services",
  "Smart Home & Tech Services",
];
const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Top Rated" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [category, setCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [sort, setSort] = useState("popular");
  const [aiSearching, setAiSearching] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category !== "All") params.category = category;
      const { data } = await servicesAPI.getAll(params);
      setServices(data.services || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load services");
    }
    setLoading(false);
  }, [page, search, category, sort]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) {
      setSearch("");
      return;
    }
    // Try AI smart search first
    setAiSearching(true);
    try {
      const { data } = await aiAPI.smartSearch({ query: q });
      if (data.category) setCategory(data.category);
      setSearch(q);
      setPage(1);
    } catch {
      setSearch(q);
      setPage(1);
    }
    setAiSearching(false);
  };

  const clearFilters = () => {
    setSearch("");
    setSearchInput("");
    setCategory("All");
    setSort("popular");
    setPage(1);
    setSearchParams({});
  };

  const hasFilters = search || category !== "All" || sort !== "popular";

  return (
    <div
      className="main-content"
      style={{ background: "var(--bg)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)",
          padding: "48px 0 32px",
        }}
      >
        <div className="container">
          <h1
            style={{
              color: "white",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 900,
              marginBottom: 8,
            }}
          >
            All Services
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 16,
              marginBottom: 24,
            }}
          >
            {total > 0
              ? `${total} services available`
              : "Browse all home services"}
          </p>
          {/* Search */}
          <form
            onSubmit={handleSearch}
            style={{ maxWidth: 600, position: "relative" }}
          >
            <div style={{ display: "flex", gap: 0 }}>
              <div
                style={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  zIndex: 1,
                }}
              >
                {aiSearching ? (
                  <span
                    className="spinner"
                    style={{ width: 16, height: 16, borderWidth: 2 }}
                  />
                ) : (
                  <FiSearch size={18} />
                )}
              </div>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search with AI — try 'fix my leaky pipe' or 'deep clean bathroom'"
                style={{
                  flex: 1,
                  padding: "14px 14px 14px 48px",
                  fontSize: 14,
                  border: "none",
                  borderRadius: "12px 0 0 12px",
                  outline: "none",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ borderRadius: "0 12px 12px 0", gap: 6 }}
              >
                <HiSparkles size={16} /> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container" style={{ padding: "24px" }}>
        {/* Filters row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 24,
          }}
        >
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: 14,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              background: "white",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="btn btn-sm"
              style={{ background: "#FEE2E2", color: "var(--error)", gap: 6 }}
            >
              <FiX size={14} /> Clear filters
            </button>
          )}
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: 14,
              marginLeft: "auto",
            }}
          >
            {loading ? "Loading..." : `${total} results`}
          </span>
        </div>

        {/* Category tabs */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 24,
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setCategory(cat);
                setPage(1);
              }}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                transition: "all 0.2s",
                background: category === cat ? "var(--primary)" : "white",
                color: category === cat ? "white" : "var(--text-secondary)",
                borderColor:
                  category === cat ? "var(--primary)" : "var(--border)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {[...Array(12)].map((_, i) => (
              <div key={i} style={{ height: 300 }} className="shimmer" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontFamily: "var(--font-display)", marginBottom: 8 }}>
              No services found
            </h3>
            <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
              Try a different search or clear your filters
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 24,
              }}
            >
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
            {/* Pagination */}
            {total > 12 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 40,
                }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-outline btn-sm"
                >
                  ← Prev
                </button>
                <span
                  style={{
                    padding: "8px 16px",
                    fontSize: 14,
                    color: "var(--text-secondary)",
                  }}
                >
                  Page {page} of {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 12)}
                  className="btn btn-outline btn-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
