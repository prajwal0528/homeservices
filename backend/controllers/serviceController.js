const Service = require('../models/Service');
const Review = require('../models/Review');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getAllServices = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOpt = {};
    if (sort === 'price_asc') sortOpt = { price: 1 };
    else if (sort === 'price_desc') sortOpt = { price: -1 };
    else if (sort === 'rating') sortOpt = { rating: -1 };
    else if (sort === 'popular') sortOpt = { totalReviews: -1 };
    else sortOpt = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [services, total] = await Promise.all([
      Service.find(query).sort(sortOpt).skip(skip).limit(Number(limit)),
      Service.countDocuments(query)
    ]);

    res.json({
      success: true,
      count: services.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      services
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching services' });
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const reviews = await Review.find({ service: service._id, isVisible: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, service, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching service' });
  }
};

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
exports.getByCategory = async (req, res) => {
  try {
    const services = await Service.find({ category: req.params.category, isActive: true }).sort({ isBestseller: -1, rating: -1 });
    res.json({ success: true, count: services.length, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching services by category' });
  }
};

// @desc    Create service (Admin)
// @route   POST /api/services
// @access  Admin
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Error creating service' });
  }
};

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
// @access  Admin
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service updated successfully', service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating service' });
  }
};

// @desc    Delete service (Admin)
// @route   DELETE /api/services/:id
// @access  Admin
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
};

// @desc    Get all categories with counts
// @route   GET /api/services/categories/all
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};
