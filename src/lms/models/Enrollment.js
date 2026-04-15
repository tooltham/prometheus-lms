const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date
  },
  grade: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'dropped'],
    default: 'in-progress'
  }
}, {
  timestamps: true
});

// Unique constraint
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// Virtual for course details
enrollmentSchema.virtual('course', {
  ref: 'Course',
  localField: 'course',
  foreignField: '_id'
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);