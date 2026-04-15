const Content = require('../models/Content');
const Course = require('../models/Course');

// Upload content
const uploadContent = async (req, res) => {
  try {
    const content = new Content({ ...req.body, courseId: req.params.courseId });
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get content
const getContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).populate('courseId');
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update content
const updateContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!content) return res.status(404).json({ message: 'Content not found' });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete content
const deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get course contents
const getCourseContents = async (req, res) => {
  try {
    const contents = await Content.find({ courseId: req.params.courseId }).sort({ order: 1 });
    res.json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadContent, getContent, updateContent, deleteContent, getCourseContents
};