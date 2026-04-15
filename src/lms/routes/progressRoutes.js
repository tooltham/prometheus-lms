const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  updateProgress,
  getProgress,
  getCourseProgress,
  getCompletionStatus
} = require('../controllers/progressController');

// Protected routes
router.use(authenticate);
router.put('/:enrollmentId', updateProgress);
router.get('/:enrollmentId', getProgress);
router.get('/course/:courseId', getCourseProgress);
router.get('/completion', getCompletionStatus);

module.exports = router;