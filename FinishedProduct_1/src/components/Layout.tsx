import React, { useState } from 'react';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import Footer from './Footer';
// import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation setSidebarOpen={setSidebarOpen} />
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      {/* Main content with proper spacing for navbar */}
      <main className="pt-20 pb-8">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
