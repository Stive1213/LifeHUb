import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Auth from './pages/Auth';
import TasksGoals from './pages/TasksGoals';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState('dark');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log('Sidebar toggled. isSidebarOpen:', !isSidebarOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Router>
      <Routes>
        {/* Auth Page Route */}
        <Route path="/" element={<Auth />} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <div className={`flex min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className="flex-1 flex flex-col">
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <Dashboard />
                </main>
              </div>
            </div>
          }
        />

        {/* Tasks & Goals Route */}
        <Route
          path="/tasks-goals"
          element={
            <div className={`flex min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className="flex-1 flex flex-col">
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <TasksGoals />
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;