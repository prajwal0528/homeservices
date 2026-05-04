const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getService,
  getByCategory,
  createService,
  updateService,
  deleteService,
  getCategories
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getAllServices);
router.get('/categories/all', getCategories);
router.get('/category/:category', getByCategory);
router.get('/:id', getService);

// Admin only
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
