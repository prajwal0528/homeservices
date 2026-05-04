import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

// ✅ FIXED: Moved outside Register to prevent remount on every keystroke
const InputField = ({
  icon,
  label,
  type = "text",
  field,
  placeholder,
  value,
  onChange,
  extra,
}) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <div style={{ position: "relative" }}>
      <span
        style={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          display: "flex",
          pointerEvents: "none",
        }}
      >
        {icon}
      </span>
      <input
        className="form-input"
        style={{
          paddingLeft: 42,
          boxSizing: "border-box",
          width: "100%",
          ...(extra?.style || {}),
        }}
        type={extra?.type || type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {extra?.toggle}
    </div>
  </div>
);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile || !form.password)
      return toast.error("All fields are required");
    if (form.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (form.password !== form.confirmPassword)
      return toast.error("Passwords do not match");
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      return toast.error("Enter a valid 10-digit mobile number");

    setLoading(true);
    try {
      const data = await register({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      });
      toast.success(
        `Welcome to Helpmate , ${data.user.name.split(" ")[0]}! 🎉`,
      );
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
          background: "linear-gradient(145deg, #00D4AA, #6C47FF)",
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
            opacity: 0.08,
            backgroundImage: "radial-gradient(white 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div
          style={{ position: "relative", textAlign: "center", color: "white" }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>✨</div>
          <h1 style={{ fontSize: 34, fontWeight: 800, marginBottom: 12 }}>
            Join Helpmate
          </h1>
          <p
            style={{
              fontSize: 17,
              opacity: 0.9,
              maxWidth: 360,
              lineHeight: 1.6,
            }}
          >
            Create your free account and book trusted professionals for any home
            service.
          </p>
          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {[
              { icon: "🏠", label: "Home Cleaning" },
              { icon: "🔧", label: "Repairs" },
              { icon: "✂️", label: "Grooming" },
              { icon: "💆", label: "Beauty" },
              { icon: "👶", label: "Babysitting" },
              { icon: "🌿", label: "Gardening" },
              { icon: "📱", label: "Tech Setup" },
              { icon: "🍳", label: "Home Chef" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 12,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  backdropFilter: "blur(4px)",
                }}
              >
                <span>{icon}</span> {label}
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
          overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <Link
              to="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                marginBottom: 20,
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background:
                    "linear-gradient(135deg, var(--primary), #A855F7)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span>🏠</span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                Home<span className="gradient-text">Services</span>
              </span>
            </Link>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 800,
                fontFamily: "var(--font-display)",
                marginBottom: 6,
              }}
            >
              Create Account
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              Register with your email and mobile number
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 18 }}
          >
            <InputField
              icon={<FiUser />}
              label="Full Name"
              field="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange("name")}
            />
            <InputField
              icon={<FiMail />}
              label="Email Address"
              type="email"
              field="email"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange("email")}
            />
            <InputField
              icon={<FiPhone />}
              label="Mobile Number"
              field="mobile"
              placeholder="10-digit mobile number"
              value={form.mobile}
              onChange={handleChange("mobile")}
            />

            {/* Password */}
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
                    pointerEvents: "none",
                  }}
                />
                <input
                  className="form-input"
                  style={{
                    paddingLeft: 42,
                    paddingRight: 42,
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: "relative" }}>
                <FiLock
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    pointerEvents: "none",
                  }}
                />
                <input
                  className="form-input"
                  style={{
                    paddingLeft: 42,
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                />
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
                "Create Account →"
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              color: "var(--text-secondary)",
              fontSize: 14,
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{ color: "var(--primary)", fontWeight: 700 }}
            >
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
