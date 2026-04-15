const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  getEnrolledCourses,
  getCourseStats
} = require('../controllers/courseController');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.use(authenticate);
router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);
router.put('/:id/publish', publishCourse);
router.get('/enrolled', getEnrolledCourses);
router.get('/stats/:id', getCourseStats);

module.exports = router;