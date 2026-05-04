const User = require('../models/User');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role = 'user' } = req.query;
    const query = { role };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobile: { $regex: search, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)),
      User.countDocuments(query)
    ]);

    res.json({ success: true, users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
};

// @desc    Toggle user active status (Admin)
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling user status' });
  }
};

// @desc    Get full analytics (Admin)
// @route   GET /api/admin/analytics
// @access  Admin
exports.getAnalytics = async (req, res) => {
  try {
    const [
      topServices,
      categoryDistribution,
      paymentMethodStats,
      userGrowth,
      revenueByMonth
    ] = await Promise.all([
      // Top 5 booked services
      Booking.aggregate([
        { $group: { _id: '$service', count: { $sum: 1 }, revenue: { $sum: '$payment.amount' } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
        { $unwind: '$service' },
        { $project: { serviceName: '$service.name', category: '$service.category', count: 1, revenue: 1 } }
      ]),

      // Bookings by service category
      Booking.aggregate([
        { $group: { _id: '$serviceSnapshot.category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),

      // Payment method distribution
      Booking.aggregate([
        { $group: { _id: '$payment.method', count: { $sum: 1 }, total: { $sum: '$payment.amount' } } }
      ]),

      // User registrations by month (last 6 months)
      User.aggregate([
        { $match: { role: 'user', createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]),

      // Revenue by month (last 6 months)
      Booking.aggregate([
        { $match: { 'payment.status': 'Paid', createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
        { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$payment.amount' }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ])
    ]);

    res.json({ success: true, topServices, categoryDistribution, paymentMethodStats, userGrowth, revenueByMonth });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: 'Error fetching analytics' });
  }
};
