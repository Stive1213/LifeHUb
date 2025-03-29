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
    else if (path === '/quick-tools') setActivePage('Quick Tools'); // Highlight Quick Tools
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
    // ... other items ...
  ];

  const handleNavClick = (page, path) => {
    setActivePage(page);
    navigate(path);
  };

  const handleGetTemplate = () => {
    console.log('Getting template...');
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-4 transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">LifeHub</h2>
        <button onClick={toggleSidebar} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <nav>
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
      <div className="absolute bottom-4">
        <button
          onClick={handleGetTemplate}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Get template
        </button>
      </div>
    </div>
  );
}

export default Sidebar;