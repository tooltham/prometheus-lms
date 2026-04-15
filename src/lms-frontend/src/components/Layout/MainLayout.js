import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-viewport">
        <Header />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <style>{`
        .main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
