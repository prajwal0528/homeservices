import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { servicesAPI } from "../utils/api";
import { FiSearch, FiArrowRight, FiStar, FiZap } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import ServiceCard from "../components/user/ServiceCard";

const CATEGORIES = [
  { name: "Cleaning Services", icon: "🧹", color: "#EEF2FF" },
  { name: "Repair & Maintenance", icon: "🔧", color: "#FFF7ED" },
  { name: "Home Improvement", icon: "🎨", color: "#F0FDF4" },
  { name: "Outdoor Services", icon: "🌿", color: "#ECFDF5" },
  { name: "Personal & Care Services", icon: "💆", color: "#FFF1F2" },
  { name: "Convenience Services", icon: "🍳", color: "#FFFBEB" },
  { name: "Smart Home & Tech Services", icon: "📱", color: "#EFF6FF" },
];

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "4.8★", label: "Avg Rating" },
  { value: "10min", label: "Insta Arrival" },
  { value: "100+", label: "Services" },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [featuredServices, setFeaturedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await servicesAPI.getAll({
          limit: 6,
          sort: "popular",
        });
        setFeaturedServices(data.services || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/services?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="page-wrapper">
      {/* ─── Hero ─── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0F0C29, #302B63, #24243e)",
          padding: "100px 0 80px",
          marginTop: 70,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* bg circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(108,71,255,0.2)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(168,85,247,0.15)",
            filter: "blur(60px)",
          }}
        />

        <div
          className="container"
          style={{ position: "relative", textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(108,71,255,0.3)",
              border: "1px solid rgba(108,71,255,0.5)",
              borderRadius: 99,
              padding: "8px 18px",
              marginBottom: 24,
              color: "#C4B5FD",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <HiSparkles /> AI-Powered Home Services Platform
          </div>
          <h1
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              fontWeight: 900,
              color: "white",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Professional Home Services
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #A78BFA, #EC4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              at Your Doorstep
            </span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 18,
              maxWidth: 560,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Book trusted professionals in 10 minutes. Cleaning, repairs, beauty,
            grooming and more — all at standardized pricing.
          </p>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            style={{ maxWidth: 600, margin: "0 auto 48px" }}
          >
            <div style={{ position: "relative", display: "flex", gap: 0 }}>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9CA3AF",
                  zIndex: 1,
                }}
              >
                <FiSearch size={20} />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services — cleaning, plumbing, AC repair..."
                style={{
                  flex: 1,
                  padding: "18px 18px 18px 52px",
                  fontSize: 15,
                  border: "none",
                  borderRadius: "16px 0 0 16px",
                  outline: "none",
                  background: "white",
                  fontFamily: "var(--font-body)",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  borderRadius: "0 16px 16px 0",
                  padding: "18px 28px",
                  fontSize: 15,
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 32,
            }}
          >
            {STATS.map(({ value, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 900,
                    color: "white",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 13,
                    marginTop: 2,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Insta Help Banner ─── */}
      <section
        style={{
          padding: "32px 0",
          background: "var(--primary)",
          color: "white",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <FiZap size={28} />
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: 20,
                  fontFamily: "var(--font-display)",
                }}
              >
                InstaHelp — Arrive in 10 Minutes!
              </div>
              <div style={{ opacity: 0.85, fontSize: 14 }}>
                Househelp on leave? No worries — instant booking available
              </div>
            </div>
          </div>
          <Link
            to="/services?bookingType=instant"
            className="btn"
            style={{
              background: "white",
              color: "var(--primary)",
              fontWeight: 700,
            }}
          >
            Book Now <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div
            style={{
              marginBottom: 40,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2 className="section-title">Discover Services</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                Choose from services for you and your home
              </p>
            </div>
            <Link to="/services" className="btn btn-outline">
              View All →
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            {CATEGORIES.map(({ name, icon, color }) => (
              <Link
                key={name}
                to={`/services?category=${encodeURIComponent(name)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: color,
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 16px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    border: "1px solid transparent",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <span style={{ fontSize: 36 }}>{icon}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Services ─── */}
      <section className="section" style={{ background: "white" }}>
        <div className="container">
          <div
            style={{
              marginBottom: 40,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2 className="section-title">Popular Services</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                Book services at standardized pricing. No surprises.
              </p>
            </div>
            <Link to="/services" className="btn btn-outline">
              All Services →
            </Link>
          </div>

          {loading ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{ height: 280, borderRadius: "var(--radius-lg)" }}
                  className="shimmer"
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 24,
              }}
            >
              {featuredServices.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title">How It Works</h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 48,
              fontSize: 16,
            }}
          >
            Book your service in 3 simple steps
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
              maxWidth: 900,
              margin: "0 auto",
            }}
          >
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Choose Service",
                desc: "Browse and select from 100+ home services across 7 categories",
              },
              {
                step: "02",
                icon: "📅",
                title: "Pick a Slot",
                desc: "Select your preferred date and time slot. Instant or scheduled booking.",
              },
              {
                step: "03",
                icon: "✅",
                title: "Service Done",
                desc: "Verified professional arrives. Service done. Rate and review after completion.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "var(--primary-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    fontSize: 32,
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    color: "var(--primary)",
                    fontWeight: 700,
                    fontSize: 12,
                    marginBottom: 8,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  STEP {step}
                </div>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    marginBottom: 10,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: 14,
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Feature ─── */}
      <section
        style={{
          padding: "80px 0",
          background:
            "linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)",
        }}
      >
        <div
          className="container"
          style={{ textAlign: "center", color: "white" }}
        >
          <HiSparkles size={40} style={{ marginBottom: 16 }} />
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 900,
              marginBottom: 16,
            }}
          >
            AI-Powered Recommendations
          </h2>
          <p
            style={{
              opacity: 0.85,
              fontSize: 17,
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            Our AI learns your preferences, search history and booking patterns
            to recommend exactly what you need.
          </p>
          <Link
            to="/ai-chat"
            className="btn btn-lg"
            style={{
              background: "white",
              color: "var(--primary)",
              fontWeight: 700,
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            }}
          >
            <HiSparkles /> Try AI Assistant
          </Link>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        style={{ padding: "80px 0", background: "white", textAlign: "center" }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 900,
              marginBottom: 16,
              fontFamily: "var(--font-display)",
            }}
          >
            Ready to Get Started?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: 17,
              marginBottom: 32,
            }}
          >
            Create a free account and book your first service today.
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Free →
            </Link>
            <Link to="/services" className="btn btn-outline btn-lg">
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
