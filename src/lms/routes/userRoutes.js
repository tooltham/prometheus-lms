const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
  getUserById,
  changePassword,
  approveUser
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', require('../controllers/authController').forgotPassword);
router.post('/reset-password', require('../controllers/authController').resetPassword);

// Protected routes
router.use(authenticate);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteUser);
router.put('/change-password', changePassword);

// Admin routes
router.get('/', authenticate, require('../middleware/roleCheck').isAdmin, getAllUsers);
router.get('/:id', authenticate, require('../middleware/roleCheck').isAdmin, getUserById);
router.put('/approve/:id', authenticate, require('../middleware/roleCheck').isInstructor, approveUser);

module.exports = router;