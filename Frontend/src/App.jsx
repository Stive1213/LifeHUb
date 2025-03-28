import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Auth from './pages/Auth'; 
// Import the Auth page
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulate authentication state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log('Sidebar toggled. isSidebarOpen:', !isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Simulate login (called from Auth page via window.location.href)
  if (window.location.pathname === '/dashboard') {
    setIsAuthenticated(true);
  }

  return (
    <>
      {!isAuthenticated ? (
        <Auth />
      ) : (
        <div className={`flex min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
          {/* Sidebar */}
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Navbar */}
            <Navbar
              toggleSidebar={toggleSidebar}
              toggleTheme={toggleTheme}
              theme={theme}
              isSidebarOpen={isSidebarOpen}
            />

            {/* Dashboard Content */}
            <main className="flex-1 p-6">
              <Dashboard />
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default App;