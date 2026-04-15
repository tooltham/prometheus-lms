const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Quiz description is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course ID is required']
  },
  questions: [{
    questionText: {
      type: String,
      required: [true, 'Question text is required']
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'true-false', 'essay'],
      required: [true, 'Question type is required']
    },
    options: [{
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required']
    },
    points: {
      type: Number,
      default: 1
    }
  }],
  timeLimit: {
    type: Number,
    unit: 'minutes'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
quizSchema.index({ courseId: 1, order: 1 });
quizSchema.index({ isPublished: 1 });

module.exports = mongoose.model('Quiz', quizSchema);