const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (User)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'You can only review your own bookings' });
    }
    if (booking.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'You can only review completed services' });
    }

    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this service' });
    }

    const newReview = await Review.create({
      user: req.user._id,
      service: booking.service,
      booking: bookingId,
      rating,
      review
    });

    // Update service rating
    const serviceReviews = await Review.find({ service: booking.service, isVisible: true });
    const avgRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
    await Service.findByIdAndUpdate(booking.service, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: serviceReviews.length
    });

    // Update booking rating
    booking.rating = { score: rating, review, createdAt: new Date() };
    await booking.save();

    await newReview.populate('user', 'name avatar');

    res.status(201).json({ success: true, message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ success: false, message: 'Review already exists for this booking' });
    res.status(500).json({ success: false, message: 'Error creating review' });
  }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
exports.getServiceReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId, isVisible: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    const stats = {
      total: reviews.length,
      average: reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
    reviews.forEach(r => stats.distribution[r.rating]++);

    res.json({ success: true, reviews, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching reviews' });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin/all
// @access  Admin
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('service', 'name category')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching all reviews' });
  }
};

// @desc    Toggle review visibility (Admin)
// @route   PUT /api/reviews/admin/:id/toggle
// @access  Admin
exports.toggleReviewVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isVisible = !review.isVisible;
    await review.save();
    res.json({ success: true, message: `Review ${review.isVisible ? 'shown' : 'hidden'}`, review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling review' });
  }
};
