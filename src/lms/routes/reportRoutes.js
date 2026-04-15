const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  getUserAnalytics,
  getCoursePerformance,
  getCompletionReports,
  getRevenueReport
} = require('../controllers/reportController');

// Protected routes
router.use(authenticate);
router.get('/user/analytics', getUserAnalytics);
router.get('/course/performance', getCoursePerformance);
router.get('/completion', getCompletionReports);
router.get('/revenue', getRevenueReport);

module.exports = router;