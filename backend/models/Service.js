const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Cleaning Services',
      'Repair & Maintenance',
      'Home Improvement',
      'Outdoor Services',
      'Personal & Care Services',
      'Convenience Services',
      'Smart Home & Tech Services'
    ]
  },
  subcategory: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    default: 0
  },
  duration: {
    type: String,
    default: '1 hour'
  },
  image: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [String],
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema);
