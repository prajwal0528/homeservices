const express = require('express');
const router = express.Router();
const {
  createReview,
  getServiceReviews,
  getAllReviews,
  toggleReviewVisibility
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/service/:serviceId', getServiceReviews);

// Admin
router.get('/admin/all', protect, adminOnly, getAllReviews);
router.put('/admin/:id/toggle', protect, adminOnly, toggleReviewVisibility);

module.exports = router;
