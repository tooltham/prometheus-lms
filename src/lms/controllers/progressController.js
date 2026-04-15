const Enrollment = require('../models/Enrollment');

// Update progress
const updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.enrollmentId, { progress }, { new: true });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get progress
const getProgress = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ enrollmentId: req.params.enrollmentId, user: req.user.id });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course progress
const getCourseProgress = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id, course: req.params.courseId });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get completion status
const getCompletionStatus = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id, status: 'completed' });
    res.json({ totalCompleted: enrollments.length, totalEnrolled: await Enrollment.countDocuments({ user: req.user.id }) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  updateProgress, getProgress, getCourseProgress, getCompletionStatus
};