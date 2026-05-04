import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingsAPI, authAPI } from '../../utils/api';
import { FiBookOpen, FiHeart, FiUser, FiSettings, FiArrowRight, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editForm, setEditForm] = useState({ name: user?.name || '', mobile: user?.mobile || '', address: user?.address || '', city: user?.city || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await bookingsAPI.getMy({ limit: 5 });
        setBookings(data.bookings || []);
        const all = data.bookings || [];
        setStats({
          total: data.total || 0,
          completed: all.filter(b => b.status === 'Completed').length,
          pending: all.filter(b => b.status === 'Pending').length,
          cancelled: all.filter(b => b.status === 'Cancelled').length,
        });
      } catch { }
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(editForm);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
    setSaving(false);
  };

  const statusColor = { Pending: '#FEF9C3', Confirmed: '#DBEAFE', 'In Progress': '#E0F2FE', Completed: '#DCFCE7', Cancelled: '#FEE2E2' };
  const statusText = { Pending: '#713F12', Confirmed: '#1E3A8A', 'In Progress': '#0C4A6E', Completed: '#166534', Cancelled: '#7F1D1D' };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser /> },
    { id: 'bookings', label: 'My Bookings', icon: <FiBookOpen /> },
    { id: 'profile', label: 'Edit Profile', icon: <FiSettings /> },
  ];

  return (
    <div className="main-content" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #A855F7 100%)', padding: '48px 0 32px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ color: 'white' }}>
            <p style={{ opacity: 0.8, marginBottom: 4 }}>Welcome back,</p>
            <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: 'var(--font-display)' }}>👋 {user?.name}</h1>
          </div>
          <Link to="/services" className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>Book a Service →</Link>
        </div>
      </div>

      <div className="container" style={{ padding: '0 24px 40px' }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginTop: -28, marginBottom: 32 }}>
          {[
            { label: 'Total Bookings', value: stats.total, icon: '📋', color: 'var(--primary)' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: 'var(--success)' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: '#F59E0B' },
            { label: 'Cancelled', value: stats.cancelled, icon: '❌', color: 'var(--error)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '20px', textAlign: 'center', background: 'white' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--surface2)', padding: 4, borderRadius: 'var(--radius-lg)', width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer',
              background: activeTab === t.id ? 'white' : 'transparent',
              color: activeTab === t.id ? 'var(--primary)' : 'var(--text-secondary)',
              fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: activeTab === t.id ? 'var(--shadow-sm)' : 'none',
              transition: 'all 0.2s', fontFamily: 'var(--font-display)'
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'var(--font-display)' }}>Recent Bookings</h3>
                <button onClick={() => setActiveTab('bookings')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>View All →</button>
              </div>
              {loading ? <div className="spinner" /> : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                  <p style={{ color: 'var(--text-muted)' }}>No bookings yet</p>
                  <Link to="/services" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>Book First Service</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {bookings.map(b => (
                    <div key={b._id} onClick={() => navigate(`/dashboard/bookings/${b._id}`)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{b.serviceSnapshot?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                          {b.bookingId} · {new Date(b.scheduledDate).toLocaleDateString('en-IN')} · {b.scheduledTime}
                        </div>
                      </div>
                      <span className="badge" style={{ background: statusColor[b.status], color: statusText[b.status] }}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, var(--primary), #A855F7)', color: 'white' }}>
                <HiSparkles size={24} style={{ marginBottom: 12 }} />
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>AI Recommendations</h3>
                <p style={{ opacity: 0.85, fontSize: 14, marginBottom: 16 }}>Get personalized service suggestions just for you</p>
                <Link to="/ai-chat" className="btn btn-sm" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
                  Try AI Assistant →
                </Link>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <FiHeart style={{ color: 'var(--secondary)', marginBottom: 12 }} size={24} />
                <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Saved Services</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
                  {user?.savedServices?.length || 0} services saved
                </p>
                <Link to="/dashboard/saved" className="btn btn-outline btn-sm btn-full">View Saved →</Link>
              </div>
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {activeTab === 'bookings' && (
          <BookingsTab />
        )}

        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="card" style={{ padding: 32, maxWidth: 540 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 24 }}>Edit Profile</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'Full Name', field: 'name', type: 'text' },
                { label: 'Mobile Number', field: 'mobile', type: 'tel' },
                { label: 'Address', field: 'address', type: 'text' },
                { label: 'City', field: 'city', type: 'text' },
              ].map(({ label, field, type }) => (
                <div key={field} className="form-group">
                  <label className="form-label">{label}</label>
                  <input className="form-input" type={type} value={editForm[field]}
                    onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={user?.email} disabled style={{ background: 'var(--surface2)', cursor: 'not-allowed' }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function BookingsTab() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const params = filter ? { status: filter } : {};
        const { data } = await bookingsAPI.getMy(params);
        setBookings(data.bookings || []);
      } catch { }
      setLoading(false);
    };
    load();
  }, [filter]);

  const statusColor = { Pending: '#FEF9C3', Confirmed: '#DBEAFE', 'In Progress': '#E0F2FE', Completed: '#DCFCE7', Cancelled: '#FEE2E2' };
  const statusText = { Pending: '#713F12', Confirmed: '#1E3A8A', 'In Progress': '#0C4A6E', Completed: '#166534', Cancelled: '#7F1D1D' };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)',
            background: filter === s ? 'var(--primary)' : 'white', color: filter === s ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', fontFamily: 'var(--font-display)'
          }}>{s || 'All'}</button>
        ))}
      </div>
      {loading ? <div className="spinner" style={{ margin: '40px auto', display: 'block' }} /> : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📋</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>No bookings found</p>
          <Link to="/services" className="btn btn-primary">Book a Service</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.map(b => (
            <div key={b._id} className="card" style={{ padding: '20px 24px', cursor: 'pointer' }} onClick={() => navigate(`/dashboard/bookings/${b._id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{b.serviceSnapshot?.name}</h4>
                    <span className="badge" style={{ background: statusColor[b.status], color: statusText[b.status] }}>{b.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    <span>🆔 {b.bookingId}</span>
                    <span>📅 {new Date(b.scheduledDate).toLocaleDateString('en-IN')}</span>
                    <span>⏰ {b.scheduledTime}</span>
                    <span>💰 ₹{b.payment?.amount}</span>
                  </div>
                </div>
                <FiArrowRight style={{ color: 'var(--text-muted)', marginTop: 4 }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
