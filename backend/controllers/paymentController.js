const Booking = require('../models/Booking');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Initiate UPI payment - redirect to Google Pay
// @route   POST /api/payments/initiate
// @access  Private
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Generate UPI payment URL for Google Pay
    const upiId = 'homeservices@googlepay'; // Replace with real UPI ID
    const payeeName = 'HomeServices';
    const transactionNote = `Booking ${booking.bookingId}`;
    const amountVal = amount || booking.payment.amount;

    // UPI deep link for Google Pay
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountVal}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${booking.bookingId}`;

    // Google Pay web URL (for browser redirect)
    const googlePayUrl = `https://pay.google.com/gp/p/ui/pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountVal}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    // PhonePe URL
    const phonePeUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountVal}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    // Paytm URL
    const paytmUrl = `paytmmp://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amountVal}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    res.json({
      success: true,
      paymentData: {
        bookingId: booking._id,
        bookingNumber: booking.bookingId,
        amount: amountVal,
        upiId,
        payeeName,
        transactionNote,
        links: {
          upi: upiLink,
          googlePay: googlePayUrl,
          phonePe: phonePeUrl,
          paytm: paytmUrl,
          amazonPay: `https://www.amazon.in/pay?pa=${upiId}&am=${amountVal}`
        }
      }
    });
  } catch (error) {
    console.error('Payment initiate error:', error);
    res.status(500).json({ success: false, message: 'Error initiating payment' });
  }
};

// @desc    Verify/confirm UPI payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
  try {
    const { bookingId, transactionId } = req.body;

    if (!transactionId || transactionId.trim() === '') {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    const booking = await Booking.findById(bookingId).populate('user', 'name email mobile');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.payment.transactionId = transactionId;
    booking.payment.status = 'Paid';
    booking.payment.paidAt = new Date();
    booking.payment.method = 'UPI';
    booking.statusHistory.push({ status: booking.status, updatedBy: 'Payment System', note: `Payment verified. Transaction ID: ${transactionId}` });

    await booking.save();

    // Send payment confirmation email
    if (booking.user?.email) {
      const { subject, html } = emailTemplates.bookingConfirmation(booking, booking.user);
      sendEmail({ to: booking.user.email, subject, html });
    }

    res.json({ success: true, message: 'Payment verified successfully!', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};

// @desc    Get payment history for user
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      'payment.status': { $in: ['Paid', 'Refunded'] }
    })
      .select('bookingId serviceSnapshot payment createdAt status')
      .sort({ createdAt: -1 });

    const totalSpent = bookings
      .filter(b => b.payment.status === 'Paid')
      .reduce((sum, b) => sum + (b.payment.amount || 0), 0);

    res.json({ success: true, payments: bookings, totalSpent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment history' });
  }
};
