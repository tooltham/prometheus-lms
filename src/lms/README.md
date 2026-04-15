# Prometheus LMS - Backend API

## 📚 Learning Management System Backend

A RESTful API built with Node.js, Express, and MongoDB for managing courses, users, and content.

## 🚀 Features

- ✅ User Management (Register, Login, Profile)
- ✅ Course Management (Create, Update, Delete, Publish)
- ✅ Content Management (Upload, Deliver, Types)
- ✅ Progress Tracking
- ✅ Certificate Generation
- ✅ Analytics & Reporting
- ✅ JWT Authentication
- ✅ Role-based Access Control

## 🛠 Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **File Upload:** Multer
- **Security:** Helmet, CORS
- **Validation:** Express Validator
- **Logging:** Morgan
- **Compression:** Compression

## 📦 Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/prometheus-lms.git

cd prometheus-lms/src/lms

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# See .env.example for required variables

# Start the server
npm start

# Or in development mode
npm run dev
```

## 📁 Project Structure

```
lms/
├── models/           # Database models
├── routes/           # API routes
├── controllers/      # Business logic
├── middleware/       # Auth, validation, error handling
├── utils/            # Helper functions
├── config/           # Database config
├── uploads/          # Uploaded files
├── certificates/     # Generated certificates
├── templates/        # Email/Certificate templates
├── server.js         # Entry point
├── package.json
└── Dockerfile
```

## 🔌 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Content
- `POST /api/content` - Upload content
- `GET /api/content/:courseId` - Get course contents

### Progress
- `GET /api/progress/enrollment/:id` - Get progress
- `PUT /api/progress/enrollment/:id` - Update progress

### Reports
- `GET /api/reports/user/analytics` - User analytics
- `GET /api/reports/course/performance` - Course performance

## 🐳 Docker

```bash
docker-compose up -d
```

## 📝 License

MIT License

## 👥 Contact

For support, email: support@prometheus-lms.com