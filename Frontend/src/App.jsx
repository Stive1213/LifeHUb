import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to true (Sidebar visible)
  const [theme, setTheme] = useState('dark');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log('Sidebar toggled. isSidebarOpen:', !isSidebarOpen); // Debug log
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} toggleTheme={toggleTheme} theme={theme} />

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;