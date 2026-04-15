import React, { createContext, useState, useContext } from 'react';

const translations = {
  th: {
    dashboard: 'แดชบอร์ด',
    myCourses: 'หลักสูตรของฉัน',
    profile: 'โปรไฟล์',
    settings: 'ตั้งค่า',
    logout: 'ออกจากระบบ',
    welcome: 'ยินดีต้อนรับกลับมา',
    todayTask: 'วันนี้คุณมีบทเรียนที่ค้างอยู่ {count} วิชา มาเร่งเรียนให้จบกันเถอะ',
    viewSchedule: 'ดูตารางเรียนวันนี้',
    enrolledCourses: 'คอร์สที่ลงทะเบียน',
    certificates: 'ใบประกาศที่ได้รับ',
    totalStudyTime: 'เวลาเรียนรวม',
    recentCourses: 'บทเรียนล่าสุด',
    studyAnalytics: 'สถิติการเรียนสัปดาห์นี้',
    hours: 'ชม.',
    continue: 'เรียนต่อ',
    search: 'ค้นหาบทเรียน หรือข้อมูลอื่นๆ...',
    role: 'นักศึกษา'
  },
  en: {
    dashboard: 'Dashboard',
    myCourses: 'My Courses',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome back',
    todayTask: 'You have {count} pending lessons today. Let\'s finish them!',
    viewSchedule: 'View Schedule',
    enrolledCourses: 'Enrolled Courses',
    certificates: 'Certificates',
    totalStudyTime: 'Total Study Time',
    recentCourses: 'Recent Courses',
    studyAnalytics: 'Study Analytics (This Week)',
    hours: 'Hrs',
    continue: 'Continue',
    search: 'Search lessons or information...',
    role: 'Student'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('th');

  const t = (key, params = {}) => {
    let text = translations[lang][key] || key;
    Object.keys(params).forEach(p => {
      text = text.replace(`{${p}}`, params[p]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
