const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { isInstructor } = require('../middleware/roleCheck');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  publishCourse,
  getEnrolledCourses,
  enrollCourse,
  getCourseStats
} = require('../controllers/courseController');

// Public routes
router.get('/', getAllCourses);

// Protected routes (MUST be before /:id to prevent route collision)
router.use(authenticate);
router.get('/my-courses', getEnrolledCourses);  // was: /enrolled — moved UP before /:id
router.get('/stats/:id', getCourseStats);
router.post('/:id/enroll', enrollCourse);        // NEW: enroll in a course

// Parametric routes (last, to avoid swallowing named routes above)
router.get('/:id', getCourseById);
router.post('/', authenticate, isInstructor, createCourse);
router.put('/:id', authenticate, isInstructor, updateCourse);
router.delete('/:id', authenticate, isInstructor, deleteCourse);
router.put('/:id/publish', authenticate, isInstructor, publishCourse);

module.exports = router;