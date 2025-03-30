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
import QuickTools from './pages/QuickTools';
import CommunityHub from './pages/CommunityHub';
import MentalWellness from './pages/MentalWellness';
import AIPoweredAssistant from './pages/AIPoweredAssistant';
import Gamification from './pages/Gamification';
import HealthWellness from './pages/HealthWellness';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings'; // Import the new page
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
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

        {/* Community Hub Route */}
        <Route
          path="/community-hub"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <CommunityHub />
                </main>
              </div>
            </div>
          }
        />

        {/* Mental Wellness Route */}
        <Route
          path="/wellness"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <MentalWellness />
                </main>
              </div>
            </div>
          }
        />

        {/* AI-Powered Life Assistant Route */}
        <Route
          path="/assistant"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <AIPoweredAssistant />
                </main>
              </div>
            </div>
          }
        />

        {/* Gamification Route */}
        <Route
          path="/gamification"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <Gamification />
                </main>
              </div>
            </div>
          }
        />
        <Route
          path="/HealthWellness"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <HealthWellness />
                </main>
              </div>
            </div>
          }
        />
         {/* Gamification Route */}
         <Route
          path="/Notifications"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <Notifications />
                </main>
              </div>
            </div>
          }
        />
        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <Profile />
                </main>
              </div>
            </div>
          }
        />

        {/* Settings Route */}
        <Route
          path="/settings"
          element={
            <div className={`min-h-screen ${theme === 'dark' ? 'gradient-bg' : 'bg-gray-100'}`}>
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <Navbar
                  toggleSidebar={toggleSidebar}
                  toggleTheme={toggleTheme}
                  theme={theme}
                  isSidebarOpen={isSidebarOpen}
                />
                <main className="flex-1 p-6">
                  <Settings toggleTheme={toggleTheme} theme={theme} />
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