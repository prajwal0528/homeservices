import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { servicesAPI, bookingsAPI, paymentsAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiClock, FiMapPin, FiCheck, FiArrowLeft } from 'react-icons/fi';

const TIME_SLOTS = ['9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM'];

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({
    selectedDate: new Date(),
    selectedTime: '',
    address: user?.address || '',
    paymentMethod: 'UPI',
    transactionId: '',
    notes: ''
  });
  const [step, setStep] = useState(1); // 1=details, 2=schedule, 3=payment
  const [submitting, setSubmitting] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const days = getNext7Days();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await servicesAPI.getOne(id);
        setService(data.service);
        setReviews(data.reviews || []);
      } catch { toast.error('Service not found'); navigate('/services'); }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleBookNow = () => {
    if (!isLoggedIn) { toast.error('Please login to book a service'); navigate('/login'); return; }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScheduleNext = () => {
    if (!booking.selectedTime) return toast.error('Please select a time slot');
    if (!booking.address.trim()) return toast.error('Please enter your address');
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiatePayment = async () => {
    setSubmitting(true);
    try {
      // Create booking first
      const bookRes = await bookingsAPI.create({
        serviceId: service._id,
        scheduledDate: booking.selectedDate,
        scheduledTime: booking.selectedTime,
        address: { fullAddress: booking.address },
        payment: { method: booking.paymentMethod },
        notes: booking.notes
      });
      const createdBooking = bookRes.data.booking;

      if (booking.paymentMethod === 'UPI') {
        // Get payment links
        const payRes = await paymentsAPI.initiate({ bookingId: createdBooking._id, amount: service.price, method: 'UPI' });
        setPaymentData({ ...payRes.data.paymentData, bookingId: createdBooking._id });
        // Open Google Pay in new tab
        window.open(payRes.data.paymentData.links.googlePay, '_blank');
      } else {
        toast.success('Booking confirmed! Pay on delivery. 🎉');
        navigate('/dashboard/bookings');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setSubmitting(false);
  };

  const handleVerifyPayment = async () => {
    if (!booking.transactionId.trim()) return toast.error('Please enter your UPI Transaction ID');
    setSubmitting(true);
    try {
      await paymentsAPI.verify({ bookingId: paymentData.bookingId, transactionId: booking.transactionId });
      toast.success('Payment verified! Booking confirmed 🎉');
      navigate('/dashboard/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    }
    setSubmitting(false);
  };

  if (loading) return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!service) return null;

  return (
    <div className="main-content" style={{ background: 'var(--bg)' }}>
      <div className="container" style={{ padding: '32px 24px' }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/services')} className="btn btn-sm" style={{ marginBottom: 24, background: 'white', border: '1px solid var(--border)', color: 'var(--text-primary)', gap: 6 }}>
          <FiArrowLeft size={14} /> {step > 1 ? 'Back' : 'All Services'}
        </button>

        {/* Progress */}
        {step > 1 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 32, alignItems: 'center' }}>
            {['Details', 'Schedule', 'Payment'].map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--border)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                    {step > i + 1 ? <FiCheck size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: step > i + 1 ? 'var(--success)' : 'var(--border)', borderRadius: 2 }} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: step === 1 ? '1fr 380px' : '1fr', gap: 32, maxWidth: step > 1 ? 680 : '100%', margin: step > 1 ? '0 auto' : '0' }}>
          {/* STEP 1: Service Details */}
          {step === 1 && (
            <>
              <div>
                <div className="card" style={{ overflow: 'hidden', marginBottom: 24 }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--primary-light), #EDE9FE)', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                    🏠
                  </div>
                  <div style={{ padding: 28 }}>
                    <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{service.category}</div>
                    {service.isBestseller && <span className="badge badge-green" style={{ marginBottom: 12, display: 'inline-block' }}>BESTSELLER</span>}
                    <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12, fontFamily: 'var(--font-display)' }}>{service.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 15 }}>
                        <FiStar color="#FFB547" fill="#FFB547" /> <strong>{service.rating}</strong> ({service.totalReviews >= 1000 ? `${(service.totalReviews / 1000).toFixed(0)}k` : service.totalReviews} reviews)
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14 }}>
                        <FiClock size={14} /> {service.duration}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>{service.description}</p>
                    {service.features?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {service.features.map(f => (
                          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                            <FiCheck size={16} color="var(--success)" /> {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reviews */}
                {reviews.length > 0 && (
                  <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Customer Reviews</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {reviews.slice(0, 5).map(r => (
                        <div key={r._id} style={{ paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                              {r.user?.name?.[0] || 'U'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 14 }}>{r.user?.name}</div>
                              <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, i) => <FiStar key={i} size={12} color="#FFB547" fill={i < r.rating ? '#FFB547' : 'none'} />)}</div>
                            </div>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{r.review}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Booking sidebar */}
              <div>
                <div className="card" style={{ padding: 24, position: 'sticky', top: 90 }}>
                  <div style={{ marginBottom: 20 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>₹{service.price}</span>
                    {service.originalPrice > service.price && (
                      <span style={{ fontSize: 16, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 8 }}>₹{service.originalPrice}</span>
                    )}
                    {service.originalPrice > service.price && (
                      <span className="badge badge-green" style={{ marginLeft: 8 }}>{Math.round((1 - service.price / service.originalPrice) * 100)}% OFF</span>
                    )}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span>⏱ Duration: {service.duration}</span>
                    <span>⭐ Rating: {service.rating} / 5.0</span>
                    <span>✅ Verified professionals</span>
                    <span>🔄 Free reschedule</span>
                  </div>
                  <button onClick={handleBookNow} className="btn btn-primary btn-full btn-lg">Book Now →</button>
                  <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
                    Free cancellation up to 1 hour before
                  </p>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Schedule */}
          {step === 2 && (
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 6 }}>Select Date & Time</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Service will take approximately {service.duration}</p>

              {/* Date */}
              <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 28 }}>
                {days.map(d => {
                  const isSelected = d.toDateString() === booking.selectedDate.toDateString();
                  return (
                    <button key={d.toDateString()} onClick={() => setBooking(b => ({ ...b, selectedDate: d }))} style={{
                      minWidth: 70, padding: '12px 8px', borderRadius: 'var(--radius-md)', border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      background: isSelected ? 'var(--primary)' : 'white',
                      color: isSelected ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontFamily: 'var(--font-display)'
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, opacity: isSelected ? 1 : 0.6 }}>{d.toLocaleDateString('en', { weekday: 'short' }).toUpperCase()}</div>
                      <div style={{ fontSize: 20, fontWeight: 800 }}>{d.getDate()}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
                {TIME_SLOTS.map(t => {
                  const isSelected = booking.selectedTime === t;
                  return (
                    <button key={t} onClick={() => setBooking(b => ({ ...b, selectedTime: t }))} style={{
                      padding: '12px', borderRadius: 'var(--radius-md)', border: '2px solid',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      background: isSelected ? 'var(--primary)' : 'white',
                      color: isSelected ? 'white' : 'var(--text-primary)',
                      cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13,
                      transition: 'all 0.2s'
                    }}>{t}</button>
                  );
                })}
              </div>

              {/* Address */}
              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label"><FiMapPin style={{ display: 'inline', marginRight: 6 }} />Service Address</label>
                <textarea className="form-input" rows={3} placeholder="Enter your complete address..."
                  value={booking.address} onChange={e => setBooking(b => ({ ...b, address: e.target.value }))} />
              </div>

              <div className="form-group" style={{ marginBottom: 28 }}>
                <label className="form-label">Special Instructions (optional)</label>
                <input className="form-input" placeholder="Any specific instructions for the professional..."
                  value={booking.notes} onChange={e => setBooking(b => ({ ...b, notes: e.target.value }))} />
              </div>

              <button onClick={handleScheduleNext} className="btn btn-primary btn-full btn-lg">Proceed to Payment →</button>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 24 }}>Payment</h2>

              {/* Order summary */}
              <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 28 }}>
                <h4 style={{ marginBottom: 12, fontFamily: 'var(--font-display)' }}>Order Summary</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{service.name}</span>
                  <span>₹{service.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8 }}>
                  <span>📅 {booking.selectedDate.toDateString()}</span>
                  <span>⏰ {booking.selectedTime}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)', fontSize: 20 }}>₹{service.price}</span>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Payment Method</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['UPI', 'Cash on Delivery'].map(m => (
                    <button key={m} onClick={() => setBooking(b => ({ ...b, paymentMethod: m }))} style={{
                      flex: 1, padding: '14px', borderRadius: 'var(--radius-md)', border: '2px solid',
                      borderColor: booking.paymentMethod === m ? 'var(--primary)' : 'var(--border)',
                      background: booking.paymentMethod === m ? 'var(--primary-light)' : 'white',
                      cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                      fontFamily: 'var(--font-display)', color: booking.paymentMethod === m ? 'var(--primary)' : 'var(--text-primary)'
                    }}>{m === 'UPI' ? '📱 UPI' : '💵 Cash on Delivery'}</button>
                  ))}
                </div>
              </div>

              {booking.paymentMethod === 'UPI' && !paymentData && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8, color: 'var(--primary)' }}>✅ Free Delivery on All Orders!</div>
                    <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Pay ₹{service.price} via UPI — Google Pay, PhonePe, Paytm or Amazon Pay</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
                    {['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay'].map(app => (
                      <div key={app} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 8px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {app === 'Google Pay' ? '🎨' : app === 'PhonePe' ? '💜' : app === 'Paytm' ? '💙' : '🛒'} {app}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* After payment initiated — show transaction ID input */}
              {paymentData && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ background: '#FEF9C3', border: '1px solid #FDE68A', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 16, fontSize: 14 }}>
                    ⚠️ After completing payment on Google Pay, enter your UPI Transaction ID below.
                  </div>
                  <div className="form-group">
                    <label className="form-label">UPI Transaction ID</label>
                    <input className="form-input" placeholder="Enter Transaction ID from your payment app"
                      value={booking.transactionId} onChange={e => setBooking(b => ({ ...b, transactionId: e.target.value }))} />
                  </div>
                </div>
              )}

              {!paymentData ? (
                <button onClick={handleInitiatePayment} className="btn btn-primary btn-full btn-lg" disabled={submitting}>
                  {submitting ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> :
                    booking.paymentMethod === 'UPI' ? '📱 Pay ₹' + service.price + ' via UPI' : '✅ Confirm Booking (Pay on Delivery)'}
                </button>
              ) : (
                <button onClick={handleVerifyPayment} className="btn btn-success btn-full btn-lg" disabled={submitting}>
                  {submitting ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : '✅ Verify & Confirm Booking'}
                </button>
              )}

              {paymentData && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => window.open(paymentData.links.googlePay, '_blank')} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>Open Google Pay Again</button>
                  <button onClick={() => window.open(paymentData.links.phonePe, '_blank')} className="btn btn-sm btn-secondary" style={{ flex: 1 }}>PhonePe</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
