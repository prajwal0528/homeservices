import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiHome,
  FiSearch,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiBookOpen,
  FiHeart,
  FiSettings,
  FiGrid,
  FiMessageCircle,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "FAQ", path: "/faq" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        background: scrolled ? "rgba(255,255,255,0.95)" : "white",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: "1px solid var(--border)",
        boxShadow: scrolled ? "var(--shadow-md)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 70,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              background: "linear-gradient(135deg, var(--primary), #A855F7)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(108,71,255,0.3)",
            }}
          >
            <FiHome size={20} color="white" />
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 20,
              color: "var(--text-primary)",
            }}
          >
            Helpmate <span className="gradient-text"></span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          className="hide-mobile"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                fontWeight: 500,
                fontSize: 15,
                color:
                  location.pathname === path
                    ? "var(--primary)"
                    : "var(--text-secondary)",
                background:
                  location.pathname === path
                    ? "var(--primary-light)"
                    : "transparent",
                transition: "all var(--transition)",
              }}
            >
              {label}
            </Link>
          ))}
          {isLoggedIn && !isAdmin && (
            <Link
              to="/ai-chat"
              style={{
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                fontWeight: 500,
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "var(--primary)",
                background: "var(--primary-light)",
              }}
            >
              <HiSparkles size={16} /> AI Assistant
            </Link>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isLoggedIn ? (
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 16px 8px 8px",
                  borderRadius: "var(--radius-full)",
                  background: dropdownOpen
                    ? "var(--primary-light)"
                    : "var(--surface2)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all var(--transition)",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--primary), #A855F7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span
                  className="hide-mobile"
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--text-primary)",
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user?.name?.split(" ")[0]}
                </span>
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: 0,
                    background: "white",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-xl)",
                    minWidth: 220,
                    padding: "8px 0",
                    zIndex: 100,
                    animation: "scaleIn 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: 15 }}>
                      {user?.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        marginTop: 2,
                      }}
                    >
                      {user?.email}
                    </div>
                    {isAdmin && (
                      <span
                        className="badge badge-purple"
                        style={{ marginTop: 6 }}
                      >
                        Admin
                      </span>
                    )}
                  </div>

                  {isAdmin ? (
                    <>
                      <DropItem
                        icon={<FiGrid />}
                        label="Admin Dashboard"
                        path="/admin"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                      <DropItem
                        icon={<FiBookOpen />}
                        label="Manage Bookings"
                        path="/admin/bookings"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                    </>
                  ) : (
                    <>
                      <DropItem
                        icon={<FiUser />}
                        label="My Profile"
                        path="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                      <DropItem
                        icon={<FiBookOpen />}
                        label="My Bookings"
                        path="/dashboard/bookings"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                      <DropItem
                        icon={<FiHeart />}
                        label="Saved Services"
                        path="/dashboard/saved"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                      <DropItem
                        icon={<HiSparkles />}
                        label="AI Assistant"
                        path="/ai-chat"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                      <DropItem
                        icon={<FiSettings />}
                        label="Settings"
                        path="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        navigate={navigate}
                      />
                    </>
                  )}

                  <div
                    style={{
                      borderTop: "1px solid var(--border)",
                      marginTop: 4,
                      paddingTop: 4,
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 16px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--error)",
                        fontSize: 14,
                        fontWeight: 600,
                        textAlign: "left",
                        transition: "background var(--transition)",
                        borderRadius: "var(--radius-sm)",
                        fontFamily: "var(--font-body)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#FEE2E2")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "none")
                      }
                    >
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="hide-desktop"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              color: "var(--text-primary)",
              display: "flex",
            }}
          >
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            background: "white",
            borderTop: "1px solid var(--border)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {navLinks.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontWeight: 500,
                display: "block",
                background:
                  location.pathname === path
                    ? "var(--primary-light)"
                    : "transparent",
              }}
            >
              {label}
            </Link>
          ))}
          {isLoggedIn && !isAdmin && (
            <Link
              to="/ai-chat"
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                color: "var(--primary)",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--primary-light)",
              }}
            >
              <HiSparkles size={16} /> AI Assistant
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

function DropItem({ icon, label, path, onClick, navigate }) {
  return (
    <button
      onClick={() => {
        navigate(path);
        onClick();
      }}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--text-primary)",
        fontSize: 14,
        fontWeight: 500,
        textAlign: "left",
        transition: "background var(--transition)",
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--font-body)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--surface2)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      <span style={{ color: "var(--primary)", display: "flex" }}>{icon}</span>
      {label}
    </button>
  );
}
