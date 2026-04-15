const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  uploadContent,
  getContent,
  updateContent,
  deleteContent,
  getCourseContents
} = require('../controllers/contentController');

// Public routes
router.get('/:courseId', getCourseContents);

// Protected routes
router.use(authenticate);
router.post('/', uploadContent);
router.put('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;