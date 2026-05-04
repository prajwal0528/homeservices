import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bookingsAPI, adminAPI, servicesAPI } from "../../utils/api";
import {
  FiUsers,
  FiBookOpen,
  FiDollarSign,
  FiTrendingUp,
  FiEdit2,
  FiChevronRight,
  FiPlus,
} from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await bookingsAPI.adminGetStats();
        setStats(data.stats);
        setRecentBookings(data.recentBookings || []);
      } catch (e) {
        toast.error("Failed to load stats");
      }
      setLoading(false);
    };
    load();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Total Bookings",
          value: stats.totalBookings,
          icon: "📋",
          color: "var(--primary)",
          bg: "var(--primary-light)",
        },
        {
          label: "Pending",
          value: stats.pendingBookings,
          icon: "⏳",
          color: "#F59E0B",
          bg: "#FEF9C3",
        },
        {
          label: "Completed",
          value: stats.completedBookings,
          icon: "✅",
          color: "var(--success)",
          bg: "#DCFCE7",
        },
        {
          label: "Total Users",
          value: stats.totalUsers,
          icon: "👥",
          color: "#6366F1",
          bg: "#EEF2FF",
        },
        {
          label: "Total Services",
          value: stats.totalServices,
          icon: "🛠️",
          color: "#14B8A6",
          bg: "#CCFBF1",
        },
        {
          label: "Revenue",
          value: `₹${(stats.totalRevenue / 100).toFixed(0)}`,
          icon: "💰",
          color: "#EC4899",
          bg: "#FCE7F3",
        },
      ]
    : [];

  const adminTabs = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Bookings" },
    { id: "users", label: "Users" },
    { id: "services", label: "Services" },
  ];

  return (
    <div
      className="main-content"
      style={{ background: "var(--bg)", minHeight: "100vh" }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #0F0C29, #302B63)",
          padding: "48px 0 32px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ color: "white" }}>
            <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>
              Admin Panel
            </div>
            <h1
              style={{
                fontSize: 28,
                fontWeight: 900,
                fontFamily: "var(--font-display)",
              }}
            >
              🛡️ Dashboard
            </h1>
          </div>
          {/* <div style={{ display: "flex", gap: 10 }}>
            <Link
              to="/admin/services/new"
              className="btn btn-sm"
              style={{ background: "var(--primary)", color: "white", gap: 6 }}
            >
              <FiPlus /> Add Service
            </Link>
          </div> */}
        </div>
      </div>

      <div className="container" style={{ padding: "0 24px 40px" }}>
        {/* Stat cards */}
        {!loading && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 16,
              marginTop: -28,
              marginBottom: 32,
            }}
          >
            {statCards.map((s) => (
              <div
                key={s.label}
                className="card"
                style={{
                  padding: "20px",
                  background: "white",
                  cursor: "default",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        fontWeight: 600,
                        marginBottom: 8,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 900,
                        color: s.color,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {s.value}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "var(--radius-md)",
                      background: s.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {s.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: "var(--surface2)",
            padding: 4,
            borderRadius: "var(--radius-lg)",
            width: "fit-content",
            flexWrap: "wrap",
          }}
        >
          {adminTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "var(--radius-md)",
                border: "none",
                cursor: "pointer",
                background: activeTab === t.id ? "white" : "transparent",
                color:
                  activeTab === t.id
                    ? "var(--primary)"
                    : "var(--text-secondary)",
                fontWeight: 600,
                fontSize: 14,
                boxShadow: activeTab === t.id ? "var(--shadow-sm)" : "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-display)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <AdminOverview
            recentBookings={recentBookings}
            navigate={navigate}
            loading={loading}
          />
        )}
        {activeTab === "bookings" && <AdminBookings />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "services" && <AdminServices navigate={navigate} />}
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────

function AdminOverview({ recentBookings, navigate, loading }) {
  const statusColor = {
    Pending: "#FEF9C3",
    Confirmed: "#DBEAFE",
    "In Progress": "#E0F2FE",
    Completed: "#DCFCE7",
    Cancelled: "#FEE2E2",
  };
  const statusText = {
    Pending: "#713F12",
    Confirmed: "#1E3A8A",
    "In Progress": "#0C4A6E",
    Completed: "#166534",
    Cancelled: "#7F1D1D",
  };

  return (
    <div className="card" style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontFamily: "var(--font-display)" }}>Recent Bookings</h3>
        <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Latest 5 bookings
        </span>
      </div>
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                {/* <th></th> */}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr
                  key={b._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/bookings/${b._id}`)}
                >
                  <td
                    style={{
                      fontWeight: 600,
                      color: "var(--primary)",
                      fontSize: 13,
                    }}
                  >
                    {b.bookingId}
                  </td>
                  <td>{b.user?.name || "N/A"}</td>
                  <td
                    style={{
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.serviceSnapshot?.name}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {new Date(b.scheduledDate).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: statusColor[b.status],
                        color: statusText[b.status],
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{b.payment?.amount}</td>
                  {/* <td>
                    <FiChevronRight style={{ color: "var(--text-muted)" }} />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      if (search) params.search = search;
      const { data } = await bookingsAPI.adminGetAll(params);
      setBookings(data.bookings || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleStatusUpdate = async (bookingId, status) => {
    setUpdating(bookingId);
    try {
      await bookingsAPI.adminUpdateStatus(bookingId, { status });
      toast.success(`Status updated to ${status}`);
      load();
    } catch {
      toast.error("Failed to update status");
    }
    setUpdating(null);
  };

  const STATUS_OPTIONS = [
    "Pending",
    "Confirmed",
    "In Progress",
    "Completed",
    "Cancelled",
  ];
  const statusColor = {
    Pending: "#FEF9C3",
    Confirmed: "#DBEAFE",
    "In Progress": "#E0F2FE",
    Completed: "#DCFCE7",
    Cancelled: "#FEE2E2",
  };
  const statusText = {
    Pending: "#713F12",
    Confirmed: "#1E3A8A",
    "In Progress": "#0C4A6E",
    Completed: "#166534",
    Cancelled: "#7F1D1D",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <input
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          style={{
            padding: "8px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            outline: "none",
            width: 220,
          }}
        />
        {["", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "8px 14px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--border)",
              background: filter === s ? "var(--primary)" : "white",
              color: filter === s ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.2s",
              fontFamily: "var(--font-display)",
            }}
          >
            {s || "All"}
          </button>
        ))}
      </div>
      {loading ? (
        <div
          className="spinner"
          style={{ margin: "40px auto", display: "block" }}
        />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date/Time</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td
                    style={{
                      fontWeight: 600,
                      color: "var(--primary)",
                      fontSize: 13,
                    }}
                  >
                    {b.bookingId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {b.user?.name}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {b.user?.mobile}
                    </div>
                  </td>
                  <td
                    style={{
                      maxWidth: 140,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 13,
                    }}
                  >
                    {b.serviceSnapshot?.name}
                  </td>
                  <td style={{ fontSize: 12, whiteSpace: "nowrap" }}>
                    {new Date(b.scheduledDate).toLocaleDateString("en-IN")}
                    <br />
                    {b.scheduledTime}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: statusColor[b.status],
                        color: statusText[b.status],
                      }}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{b.payment?.amount}</td>
                  <td>
                    <select
                      value={b.status}
                      disabled={updating === b._id}
                      onChange={(e) =>
                        handleStatusUpdate(b._id, e.target.value)
                      }
                      style={{
                        padding: "6px 10px",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "var(--font-body)",
                        background: "white",
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--text-muted)",
              }}
            >
              No bookings found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ search });
      setUsers(data.users || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUser(id);
      toast.success(data.message);
      load();
    } catch {
      toast.error("Failed to toggle user");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          style={{
            padding: "8px 14px",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            outline: "none",
            width: 240,
          }}
        />
        <button onClick={load} className="btn btn-primary btn-sm">
          Search
        </button>
      </div>
      {loading ? (
        <div
          className="spinner"
          style={{ margin: "40px auto", display: "block" }}
        />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Registered</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {u.email}
                  </td>
                  <td>{u.mobile}</td>
                  <td style={{ fontSize: 13 }}>
                    {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: u.isActive ? "#DCFCE7" : "#FEE2E2",
                        color: u.isActive ? "#166534" : "#7F1D1D",
                      }}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleUser(u._id)}
                      className="btn btn-sm"
                      style={{
                        background: u.isActive ? "#FEE2E2" : "#DCFCE7",
                        color: u.isActive ? "var(--error)" : "var(--success)",
                        border: "none",
                      }}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "var(--text-muted)",
              }}
            >
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AdminServices({ navigate }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await servicesAPI.getAll({ limit: 50 });
        setServices(data.services || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const toggleService = async (id) => {
    try {
      await servicesAPI.delete(id);
      toast.success("Service status updated");
      setServices((s) =>
        s.map((svc) =>
          svc._id === id ? { ...svc, isActive: !svc.isActive } : svc,
        ),
      );
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        {/* <button
          onClick={() => navigate("/admin/services/new")}
          className="btn btn-primary btn-sm"
          style={{ gap: 6 }}
        >
          <FiPlus /> Add New Service
        </button> */}
      </div>
      {loading ? (
        <div
          className="spinner"
          style={{ margin: "40px auto", display: "block" }}
        />
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Reviews</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id}>
                  <td style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</td>
                  <td style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {s.category}
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                    ₹{s.price}
                  </td>
                  <td>⭐ {s.rating}</td>
                  <td>{(s.totalReviews / 1000).toFixed(0)}k</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: s.isActive ? "#DCFCE7" : "#FEE2E2",
                        color: s.isActive ? "#166534" : "#7F1D1D",
                      }}
                    >
                      {s.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {/* <button onClick={() => navigate(`/admin/services/edit/${s._id}`)} className="btn btn-sm btn-secondary" style={{ gap: 4 }}><FiEdit2 size={12} /> Edit</button> */}
                      <button
                        onClick={() => toggleService(s._id)}
                        className="btn btn-sm"
                        style={{
                          background: "#FEE2E2",
                          color: "var(--error)",
                          border: "none",
                        }}
                      >
                        {s.isActive ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
