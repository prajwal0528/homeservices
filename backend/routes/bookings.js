const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getAdminStats
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllBookings);
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.put('/admin/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
