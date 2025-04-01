import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('Dashboard');

  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActivePage('Dashboard');
    else if (path === '/tasks-goals') setActivePage('Tasks & Goals');
    else if (path === '/budget-tracker') setActivePage('Budget Tracker');
    else if (path === '/calendar') setActivePage('Calendar');
    else if (path === '/habits') setActivePage('Habits');
    else if (path === '/journal') setActivePage('Journal');
    else if (path === '/social-circle') setActivePage('Social Circle');
    else if (path === '/documents') setActivePage('Documents');
    else if (path === '/quick-tools') setActivePage('Quick Tools');
    else if (path === '/community-hub') setActivePage('Community Hub');
    else if (path === '/wellness') setActivePage('Wellness');
    else if (path === '/assistant') setActivePage('Assistant');
    else if (path === '/gamification') setActivePage('Gamification');
    else if (path === '/health-wellness') setActivePage('Health & Wellness');
    else if (path === '/notifications') setActivePage('Notifications');
    else if (path === '/profile') setActivePage('Profile');
    else if (path === '/settings') setActivePage('Settings');
  }, [location]);

  const navItems = [
    { name: 'Dashboard', icon: 'M3 12h18M3 6h18M3 18h18', path: '/dashboard' },
    { name: 'Tasks & Goals', icon: 'M5 13l4 4L19 7', path: '/tasks-goals' },
    { name: 'Budget Tracker', icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z', path: '/budget-tracker' },
    { name: 'Calendar', icon: 'M6 2h12v4H6V2zm0 6h12v14H6V8zm2 2v10h8V10H8z', path: '/calendar' },
    { name: 'Habits', icon: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', path: '/habits' },
    { name: 'Journal', icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6z', path: '/journal' },
    { name: 'Social Circle', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', path: '/social-circle' },
    { name: 'Documents', icon: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 2l5 5h-5V4z', path: '/documents' },
    { name: 'Quick Tools', icon: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z', path: '/quick-tools' },
    { name: 'Community Hub', icon: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z', path: '/community-hub' },
    { name: 'Wellness', icon: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z', path: '/wellness' },
    { name: 'Assistant', icon: 'M9 17c0 .55-.45 1-1 1s-1-.45-1-1v-3H5c-.55 0-1-.45-1-1s.45-1 1-1h2v-3c0-.55.45-1 1-1s1 .45 1 1v3h2c.55 0 1 .45 1 1s-.45 1-1 1H9v3zm6-1c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1h-4z', path: '/assistant' },
    { name: 'Gamification', icon: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z', path: '/gamification' },
    { name: 'Health & Wellness', icon: 'M12 19c-1.1 0-2-.9-2-2v-5H8v-2h2V5c0-1.1.9-2 2-2s2 .9 2 2v5h2v2h-2v5c0 1.1-.9 2-2 2z', path: '/HealthWellness' },
    { name: 'Notifications', icon: 'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z', path: '/notifications' },
    { name: 'Profile', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', path: '/Profile' },
    { name: 'Settings', icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.3-.06.62-.06.94s.02.64.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', path: '/settings' },
  ];

  const handleNavClick = (page, path) => {
    setActivePage(page);
    navigate(path);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-4 transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header (Fixed at the top of the Sidebar) */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">LifeHub</h2>
        <button onClick={toggleSidebar} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {/* Scrollable Navigation */}
      <nav className="overflow-y-auto h-[calc(100vh-80px)]">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleNavClick(item.name, item.path)}
            className={`flex items-center space-x-2 p-2 rounded-lg mb-2 cursor-pointer ${
              activePage === item.name ? 'bg-purple-500' : 'hover:bg-slate-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
            </svg>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;