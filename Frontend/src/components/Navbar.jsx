import { useState, useEffect } from 'react';
import axios from 'axios';

function Navbar({ toggleSidebar, toggleTheme, theme, isSidebarOpen }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [userData, setUserData] = useState({ username: 'User', profileImage: 'https://via.placeholder.com/40' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view user data');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      try {
        const response = await axios.get('http://localhost:5000/api/user', { headers });
        const { points, username, profileImage } = response.data;
        setTotalPoints(points || 0);
        setUserData({
          username: username || 'User',
          profileImage: profileImage || 'https://via.placeholder.com/40',
        });
        setError(''); // Clear error on success
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.error || 'Error fetching user data';
        setError(errorMessage);
        if (errorMessage === 'User not found') {
          // Handle "User not found" specifically
          setTotalPoints(0); // Reset to 0 instead of mock 150
          setUserData({ username: 'Guest', profileImage: 'https://via.placeholder.com/40' });
          localStorage.removeItem('token'); // Clear invalid token
        } else {
          // Fallback for other errors
          setTotalPoints(150);
          setUserData({ username: 'User', profileImage: 'https://via.placeholder.com/40' });
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center shadow">
      {/* Left Side: Hamburger Menu and Logo */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">LifeHub</h1>
      </div>

      {/* Right Side: Points Counter, Theme Toggle, and User Profile */}
      <div className="flex items-center space-x-4">
        {/* Points Counter */}
        <div className="bg-purple-500 text-white px-3 py-1 rounded-full">
          {totalPoints} pts
        </div>

        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="text-white">
          {theme === 'dark' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-2">
          <img
            src={userData.profileImage}
            alt="User profile"
            className="w-10 h-10 rounded-full"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
          />
          <span>{userData.username}</span>
        </div>

        {/* Error Display */}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    </nav>
  );
}

export default Navbar;