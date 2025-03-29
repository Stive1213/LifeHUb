import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Auth from './pages/Auth';
import TasksGoals from './pages/TasksGoals';
import BudgetTracker from './pages/BudgetTracker';
import CalendarPage from './pages/Calendar';
import Habits from './pages/Habits';
import Journal from './pages/Journal';
import SocialCircle from './pages/SocialCircle';
import DocumentVault from './pages/DocumentVault';
import QuickTools from './pages/QuickTools'; // Import the new page
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

        {/* Budget Tracker Route */}
        <Route
          path="/budget-tracker"
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
                  <BudgetTracker />
                </main>
              </div>
            </div>
          }
        />

        {/* Calendar Route */}
        <Route
          path="/calendar"
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
                  <CalendarPage />
                </main>
              </div>
            </div>
          }
        />

        {/* Habits Route */}
        <Route
          path="/habits"
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
                  <Habits />
                </main>
              </div>
            </div>
          }
        />

        {/* Journal Route */}
        <Route
          path="/journal"
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
                  <Journal />
                </main>
              </div>
            </div>
          }
        />

        {/* Social Circle Route */}
        <Route
          path="/social-circle"
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
                  <SocialCircle />
                </main>
              </div>
            </div>
          }
        />

        {/* Document Vault Route */}
        <Route
          path="/documents"
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
                  <DocumentVault />
                </main>
              </div>
            </div>
          }
        />

        {/* Quick Tools Route */}
        <Route
          path="/quick-tools"
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
                  <QuickTools />
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