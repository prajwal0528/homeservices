import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password)
      return toast.error("Please fill all fields");
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! 👋`);
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          background:
            "linear-gradient(145deg, #6C47FF 0%, #A855F7 60%, #EC4899 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
        className="hide-mobile"
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.1,
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{ position: "relative", textAlign: "center", color: "white" }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏠</div>
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>
            Welcome Back!
          </h1>
          <p
            style={{
              fontSize: 18,
              opacity: 0.9,
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            Your trusted home services platform. Book professionals in minutes.
          </p>
          <div
            style={{
              marginTop: 40,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {[
              "10+ Service Categories",
              "4.8★ Average Rating",
              "50,000+ Happy Customers",
              "AI-Powered Recommendations",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontSize: 15,
                  opacity: 0.9,
                }}
              >
                <span style={{ fontSize: 20 }}>✅</span> {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
          background: "var(--bg)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 36, textAlign: "center" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 24,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  background:
                    "linear-gradient(135deg, var(--primary), #A855F7)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 14px rgba(108,71,255,0.3)",
                }}
              >
                <span style={{ fontSize: 20 }}>🏠</span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 22,
                  color: "var(--text-primary)",
                }}
              >
                Helpmate <span className="gradient-text"> </span>
              </span>
            </Link>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: 8,
              }}
            >
              Sign in
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Admin hint */}
          <div
            style={{
              background: "var(--primary-light)",
              border: "1px solid rgba(108,71,255,0.2)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              marginBottom: 24,
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <HiSparkles
              style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }}
            />
            <div style={{ fontSize: 13, color: "var(--primary)" }}>
              <strong>Admin login:</strong> username: <code>admin</code> |
              password: <code>admin@123</code>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            <div className="form-group">
              <label className="form-label">Email / Username</label>
              <div style={{ position: "relative" }}>
                <FiMail
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  type="text"
                  placeholder="Email or 'admin'"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <FiLock
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  className="form-input"
                  style={{ paddingLeft: 42, paddingRight: 42 }}
                  type={showPwd ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                  }}
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? (
                <span
                  className="spinner"
                  style={{ width: 20, height: 20, borderWidth: 2 }}
                />
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 24,
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{ color: "var(--primary)", fontWeight: 700 }}
            >
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
