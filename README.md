# Prometheus LMS 🎓

[![NPU Branding](https://upload.wikimedia.org/wikipedia/th/a/a3/Nakhon_Phanom_University_Logo.svg)](https://www.npu.ac.th)

**Prometheus LMS** is a premium, open-source Learning Management System designed specifically with the **Nakhon Phanom University (NPU)** identity in mind. It features a modern, responsive design with full multilingual support for Thai and English.

---

## ✨ Features

- **🎨 NPU Premium UI**: Styled with Royal Navy (`#0d2750`) and Gold (`#c8a415`) color palette.
- **🌐 Multilingual**: Seamlessly switch between Thai and English UI.
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.
- **🛡️ User Approval System**: Mandatory account verification by Instructors/Admins for new student registrations.
- **🎓 Student-Specific Profiles**: Comprehensive registration including Student ID, Education Level, and Academic Major.
- **🔒 Enhanced Security**: Password change verification and secure session management.
- **📊 Study Analytics**: Visualized learning progress with interactive charts.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js ⚛️
- **Styling**: Vanilla CSS with modern Glassmorphism.
- **State Management**: Redux Toolkit & Context API.
- **Charts**: Recharts.
- **Icons**: React Icons (Fa context).

### Backend
- **Environment**: Node.js & Express.
- **Database**: MongoDB with Mongoose.
- **Security**: Helmet, CORS, and JWT.

---

## 📂 Project Structure

```
prometheus-lms/
├── src/
│   ├── lms/              # Backend API (Node.js/Express)
│   └── lms-frontend/     # Frontend Client (React.js)
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/tooltham/prometheus-lms.git
cd prometheus-lms
```

### 2. Setup Backend
```bash
cd src/lms
npm install
# Create .env file with MONGODB_URI and JWT_SECRET
npm run dev
```

### 3. Setup Frontend
```bash
cd src/lms-frontend
npm install
npm start
```

---

## 📸 Screenshots
*(Coming Soon - Preview available in the internal walkthrough)*

---

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors
Developed by **Dr. Apirak Tooltham** for the Nakhon Phanom University community.
