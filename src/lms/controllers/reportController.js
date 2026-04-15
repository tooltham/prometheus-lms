const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Content = require('../models/Content');

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id });
    const completedCourses = enrollments.filter(e => e.status === 'completed');
    
    const user = await User.findById(req.user.id);
    
    res.json({
      totalCoursesEnrolled: enrollments.length,
      completedCourses: completedCourses.length,
      totalContentCompleted: await Content.countDocuments({ courseId: { $in: enrollments.map(e => e.course) } })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course performance
const getCoursePerformance = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollments = await Enrollment.find({ course: req.params.courseId });
    const completed = enrollments.filter(e => e.status === 'completed');
    
    res.json({
      totalEnrolled: enrollments.length,
      completionRate: enrollments.length > 0 ? (completed.length / enrollments.length * 100).toFixed(2) : 0,
      averageRating: course.rating
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get completion reports
const getCompletionReports = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ status: 'completed' }).populate('user', 'email firstName lastName').populate('course', 'title');
    res.json({ totalCompleted: enrollments.length, reports: enrollments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get revenue report
const getRevenueReport = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true });
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.totalEnrolled), 0);
    
    res.json({ totalRevenue, coursesCount: courses.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserAnalytics, getCoursePerformance, getCompletionReports, getRevenueReport
};