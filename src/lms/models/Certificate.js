const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  enrollmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollment',
    required: [true, 'Enrollment ID is required']
  },
  certificateUrl: {
    type: String,
    required: [true, 'Certificate URL is required']
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['issued', 'expired', 'revoked'],
    default: 'issued'
  }
}, {
  timestamps: true
});

// Indexes
certificateSchema.index({ userId: 1 });
certificateSchema.index({ courseId: 1 });
certificateSchema.index({ enrollmentId: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);