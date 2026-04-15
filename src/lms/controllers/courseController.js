const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// Create course
const createCourse = async (req, res) => {
  try {
    const course = new Course({ ...req.body, instructor: req.user.id });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all courses (public)
const getAllCourses = async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (level) query.level = level;

    const skip = (page - 1) * limit;
    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.json({ courses, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course by ID (public)
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName email');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Publish course
const publishCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to publish this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, { isPublished: true, status: 'published' }, { new: true });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get enrolled courses for current user (GET /api/courses/my-courses)
const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({ path: 'course', populate: { path: 'instructor', select: 'firstName lastName' } })
      .sort({ enrolledAt: -1 });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Enroll in a course (POST /api/courses/:id/enroll)
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!course.isPublished) return res.status(400).json({ message: 'Course is not available' });

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.id });
    if (existingEnrollment) return res.status(400).json({ message: 'Already enrolled in this course' });

    const enrollment = new Enrollment({
      user: req.user.id,
      course: req.params.id,
      status: 'in-progress',
      progress: 0
    });
    await enrollment.save();

    // Increment enrolled count
    await Course.findByIdAndUpdate(req.params.id, { $inc: { totalEnrolled: 1 } });

    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course stats
const getCourseStats = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollments = await Enrollment.countDocuments({ course: req.params.id });
    res.json({ totalEnrolled: enrollments, averageRating: course.rating, totalReviews: course.totalReviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse,
  publishCourse, getEnrolledCourses, enrollCourse, getCourseStats
};