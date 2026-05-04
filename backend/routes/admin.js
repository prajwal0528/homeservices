const express = require('express');
const router = express.Router();
const { getAllUsers, toggleUserStatus, getAnalytics } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/users', protect, adminOnly, getAllUsers);
router.put('/users/:id/toggle', protect, adminOnly, toggleUserStatus);
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
