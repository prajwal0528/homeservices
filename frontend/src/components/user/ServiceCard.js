import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiClock, FiHeart } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";
import toast from "react-hot-toast";

// Fallback images per category in case service.image is missing
const CATEGORY_FALLBACK_IMAGES = {
  "Cleaning Services":
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop",
  "Repair & Maintenance":
    "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop",
  "Home Improvement":
    "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=600&auto=format&fit=crop",
  "Outdoor Services":
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop",
  "Personal & Care Services":
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop",
  "Convenience Services":
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&auto=format&fit=crop",
  "Smart Home & Tech Services":
    "https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop",
};

export default function ServiceCard({ service, showSave = true }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, updateUser } = useAuth();
  const [imgError, setImgError] = useState(false);

  const isSaved = user?.savedServices?.some(
    (s) => (s._id || s) === service._id,
  );

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to save services");
      navigate("/login");
      return;
    }
    try {
      const { data } = await authAPI.toggleSavedService(service._id);
      const updated = { ...user };
      if (data.saved) {
        updated.savedServices = [...(user.savedServices || []), service._id];
        toast.success("Saved to favourites ❤️");
      } else {
        updated.savedServices = (user.savedServices || []).filter(
          (s) => (s._id || s) !== service._id,
        );
        toast.success("Removed from favourites");
      }
      updateUser(updated);
    } catch {
      toast.error("Failed to update");
    }
  };

  const imageSrc =
    !imgError && service.image
      ? service.image
      : CATEGORY_FALLBACK_IMAGES[service.category] ||
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop";

  return (
    <div
      className="card"
      style={{
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={() => navigate(`/services/${service._id}`)}
    >
      {/* Image area */}
      <div
        style={{
          height: 180,
          position: "relative",
          overflow: "hidden",
          borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
        }}
      >
        <img
          src={imageSrc}
          alt={service.name}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.35s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.06)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />

        {/* Dark gradient overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        {service.isBestseller && (
          <span
            style={{ position: "absolute", top: 12, left: 12 }}
            className="badge badge-green"
          >
            BESTSELLER
          </span>
        )}

        {showSave && isLoggedIn && (
          <button
            onClick={handleSave}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "rgba(255,255,255,0.92)",
              border: "none",
              borderRadius: "50%",
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              transition: "all 0.2s",
              backdropFilter: "blur(4px)",
            }}
          >
            <FiHeart
              size={16}
              fill={isSaved ? "#EF4444" : "none"}
              color={isSaved ? "#EF4444" : "#9CA3AF"}
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "16px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "var(--primary)",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
          }}
        >
          {service.category}
        </div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            lineHeight: 1.3,
            fontFamily: "var(--font-display)",
            color: "var(--text-primary)",
          }}
        >
          {service.name}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            flex: 1,
          }}
        >
          {service.description?.slice(0, 80)}...
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 13,
            color: "var(--text-muted)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FiStar size={13} color="#FFB547" fill="#FFB547" />
            <strong style={{ color: "var(--text-primary)" }}>
              {service.rating || "4.8"}
            </strong>
            (
            {service.totalReviews >= 1000
              ? `${(service.totalReviews / 1000).toFixed(0)}k`
              : service.totalReviews}
            )
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <FiClock size={13} /> {service.duration}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 4,
          }}
        >
          <div>
            <span
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "var(--primary)",
                fontFamily: "var(--font-display)",
              }}
            >
              ₹{service.price}
            </span>
            {service.originalPrice > service.price && (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                  marginLeft: 6,
                }}
              >
                ₹{service.originalPrice}
              </span>
            )}
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/services/${service._id}`);
            }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
