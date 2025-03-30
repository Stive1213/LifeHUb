import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings({ toggleTheme, theme }) {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(true);

  const handleLogout = () => {
    // Mock logout (will be implemented in backend)
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // Mock delete account (will be implemented in backend)
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      navigate('/');
    }
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      {/* General Settings */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">General</h3>
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <button
            onClick={toggleTheme}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Notifications</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            className="form-checkbox h-5 w-5 text-purple-500"
          />
          <span>Enable Notifications</span>
        </label>
      </div>

      {/* Privacy Settings */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Privacy</h3>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={leaderboardOptIn}
            onChange={() => setLeaderboardOptIn(!leaderboardOptIn)}
            className="form-checkbox h-5 w-5 text-purple-500"
          />
          <span>Show my score on the leaderboard</span>
        </label>
      </div>

      {/* Account Settings */}
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Account</h3>
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Logout
          </button>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;