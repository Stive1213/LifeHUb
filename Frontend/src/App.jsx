import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
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
import Notifications from './pages/Notifications';
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

  const renderProtectedPage = (Component) => (
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
          <Component />
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Auth />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={renderProtectedPage(Dashboard)} />
          <Route path="/tasks-goals" element={renderProtectedPage(TasksGoals)} />
          <Route path="/budget-tracker" element={renderProtectedPage(BudgetTracker)} />
          <Route path="/calendar" element={renderProtectedPage(CalendarPage)} />
          <Route path="/habits" element={renderProtectedPage(Habits)} />
          <Route path="/journal" element={renderProtectedPage(Journal)} />
          <Route path="/social-circle" element={renderProtectedPage(SocialCircle)} />
          <Route path="/documents" element={renderProtectedPage(DocumentVault)} />
          <Route path="/quick-tools" element={renderProtectedPage(QuickTools)} />
          <Route path="/community-hub" element={renderProtectedPage(CommunityHub)} />
          <Route path="/wellness" element={renderProtectedPage(MentalWellness)} />
          <Route path="/assistant" element={renderProtectedPage(AIPoweredAssistant)} />
          <Route path="/gamification" element={renderProtectedPage(Gamification)} />
          <Route path="/notifications" element={renderProtectedPage(Notifications)} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;