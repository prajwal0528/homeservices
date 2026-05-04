const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res) => {
  try {
    const { serviceId, scheduledDate, scheduledTime, bookingType, address, payment, notes } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      serviceSnapshot: {
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        image: service.image
      },
      scheduledDate,
      scheduledTime,
      bookingType: bookingType || 'later',
      address,
      payment: {
        method: payment?.method || 'UPI',
        amount: service.price,
        transactionId: payment?.transactionId || '',
        status: payment?.method === 'UPI' && payment?.transactionId ? 'Paid' : 'Pending'
      },
      notes,
      statusHistory: [{ status: 'Pending', updatedBy: req.user.name || 'User', note: 'Booking created' }]
    });

    // Send confirmation email
    const user = await User.findById(req.user._id);
    if (user) {
      const { subject, html } = emailTemplates.bookingConfirmation(booking, user);
      sendEmail({ to: user.email, subject, html });
    }

    const populatedBooking = await Booking.findById(booking._id).populate('service', 'name category image');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully!',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: 'Error creating booking' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private (User)
exports.getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate('service', 'name category image')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Booking.countDocuments(query)
    ]);

    res.json({ success: true, bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bookings' });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service').populate('user', 'name email mobile');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only admin or booking owner can see
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching booking' });
  }
};

// @desc    Cancel booking (User)
// @route   PUT /api/bookings/:id/cancel
// @access  Private (User)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email mobile');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (['Completed', 'Cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.statusHistory.push({ status: 'Cancelled', updatedBy: req.user.name, note: req.body.reason || 'Cancelled by user' });
    await booking.save();

    // Send email
    const user = await User.findById(req.user._id);
    if (user) {
      const { subject, html } = emailTemplates.statusUpdate(booking, user, 'Cancelled', req.body.reason);
      sendEmail({ to: user.email, subject, html });
    }

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error cancelling booking' });
  }
};

// ===================== ADMIN ROUTES =====================

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin/all
// @access  Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status) query.status = status;

    let bookings = await Booking.find(query)
      .populate('user', 'name email mobile')
      .populate('service', 'name category image')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (search) {
      bookings = bookings.filter(b =>
        b.bookingId?.toLowerCase().includes(search.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.serviceSnapshot?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Booking.countDocuments(query);

    // Status counts
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, bookings, total, page: Number(page), pages: Math.ceil(total / limit), statusCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all bookings' });
  }
};

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/admin/:id/status
// @access  Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, note, assignedProvider } = req.body;

    const booking = await Booking.findById(req.params.id).populate('user', 'name email mobile');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    const prevStatus = booking.status;
    booking.status = status;
    booking.statusHistory.push({ status, updatedBy: 'Admin', note: note || `Status changed from ${prevStatus} to ${status}` });

    if (assignedProvider) {
      booking.assignedProvider = assignedProvider;
    }

    if (status === 'Completed' && booking.payment.method !== 'Cash on Delivery') {
      booking.payment.status = 'Paid';
      booking.payment.paidAt = new Date();
    }

    await booking.save();

    // Send email to user
    if (booking.user && booking.user.email) {
      const { subject, html } = emailTemplates.statusUpdate(booking, booking.user, status, note);
      sendEmail({ to: booking.user.email, subject, html });
    }

    res.json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: 'Error updating booking status' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/bookings/admin/stats
// @access  Admin
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      completedBookings,
      cancelledBookings,
      totalUsers,
      totalServices,
      revenueData,
      recentBookings,
      monthlyData
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Cancelled' }),
      require('../models/User').countDocuments({ role: 'user' }),
      require('../models/Service').countDocuments({ isActive: true }),
      Booking.aggregate([
        { $match: { status: 'Completed', 'payment.status': 'Paid' } },
        { $group: { _id: null, total: { $sum: '$payment.amount' } } }
      ]),
      Booking.find().populate('user', 'name email').populate('service', 'name').sort({ createdAt: -1 }).limit(5),
      Booking.aggregate([
        {
          $group: {
            _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
            count: { $sum: 1 },
            revenue: { $sum: '$payment.amount' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalBookings,
        pendingBookings,
        completedBookings,
        cancelledBookings,
        confirmedBookings: await Booking.countDocuments({ status: 'Confirmed' }),
        inProgressBookings: await Booking.countDocuments({ status: 'In Progress' }),
        totalUsers,
        totalServices,
        totalRevenue
      },
      recentBookings,
      monthlyData
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ success: false, message: 'Error fetching stats' });
  }
};
