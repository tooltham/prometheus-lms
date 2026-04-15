const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Course = require('./models/Course');
const dotenv = require('dotenv');
const Enrollment = require('./models/Enrollment');

dotenv.config();

const users = [
  {
    firstName: 'Admin',
    lastName: 'NPU',
    email: 'apirak@npu.ac.th',
    password: 'admin1234',
    role: 'admin'
  },
  {
    firstName: 'Somchai',
    lastName: 'Instructor',
    email: 'instructor@npu.ac.th',
    password: 'instr1234',
    role: 'instructor',
    profile: {
      bio: 'Expert in Educational Technology at NPU'
    }
  },
  {
    firstName: 'Somsak',
    lastName: 'Student',
    email: 'student@npu.ac.th',
    password: 'std1234',
    role: 'student'
  }
];

const seedDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://mongodb:27017/prometheus_lms';
    console.log(`Connecting to ${connStr}...`);
    await mongoose.connect(connStr);
    
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Enrollment.deleteMany({});
    
    console.log('Seeding users...');
    const createdUsers = [];
    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      const user = await User.create({ ...u, password: hashedPassword });
      createdUsers.push(user);
    }
    
    const admin = createdUsers[0];
    const instructor = createdUsers[1];
    const student = createdUsers[2];
    
    console.log('Seeding courses...');
    const courses = [
      {
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript with NPU standard curriculum.',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        instructor: instructor._id,
        category: 'Technology',
        level: 'Beginner',
        duration: 40,
        isPublished: true,
        status: 'published'
      },
      {
        title: 'Digital Marketing Fundamentals',
        description: 'Practical digital marketing skills for the modern business world.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
        instructor: instructor._id,
        category: 'Marketing',
        level: 'Intermediate',
        duration: 25,
        isPublished: true,
        status: 'published'
      },
      {
        title: 'Python for Data Science',
        description: 'Master Python programming for data analysis and visualization.',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        instructor: instructor._id,
        category: 'Technology',
        level: 'Advanced',
        duration: 60,
        isPublished: true,
        status: 'published'
      }
    ];
    
    const createdCourses = await Course.insertMany(courses);
    
    console.log('Seeding initial enrollment...');
    await Enrollment.create({
      user: student._id,
      course: createdCourses[0]._id,
      status: 'in-progress',
      progress: 35
    });
    
    console.log('Database seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
