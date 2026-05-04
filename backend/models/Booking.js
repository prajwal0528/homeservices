const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  serviceSnapshot: {
    name: String,
    category: String,
    price: Number,
    duration: String,
    image: String
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  scheduledTime: {
    type: String,
    required: [true, 'Scheduled time is required']
  },
  bookingType: {
    type: String,
    enum: ['instant', 'later', 'multi-day'],
    default: 'later'
  },
  address: {
    fullAddress: { type: String, required: true },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  statusHistory: [{
    status: String,
    updatedBy: String,
    updatedAt: { type: Date, default: Date.now },
    note: String
  }],
  payment: {
    method: {
      type: String,
      enum: ['UPI', 'Cash on Delivery', 'Online'],
      default: 'UPI'
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded', 'Failed'],
      default: 'Pending'
    },
    amount: { type: Number, default: 0 },
    transactionId: { type: String, default: '' },
    paidAt: Date
  },
  assignedProvider: {
    name: { type: String, default: '' },
    mobile: { type: String, default: '' },
    eta: { type: String, default: '' }
  },
  rating: {
    score: { type: Number, min: 1, max: 5 },
    review: { type: String, default: '' },
    createdAt: Date
  },
  notes: {
    type: String,
    default: ''
  },
  cancellationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Auto-generate bookingId
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.bookingId = `HS${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
