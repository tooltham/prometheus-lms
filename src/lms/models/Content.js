const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Content title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Content description is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  type: {
    type: String,
    required: [true, 'Content type is required'],
    enum: ['video', 'text', 'quiz', 'pdf', 'audio']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileMimeType: {
    type: String
  },
  fileSize: {
    type: Number
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    unit: 'minutes'
  },
  thumbnail: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
contentSchema.index({ courseId: 1, order: 1 });
contentSchema.index({ type: 1 });

module.exports = mongoose.model('Content', contentSchema);