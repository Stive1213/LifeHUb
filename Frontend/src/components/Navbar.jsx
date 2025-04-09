import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Added for logout navigation

function Navbar({ toggleSidebar, toggleTheme, theme, isSidebarOpen }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [userData, setUserData] = useState({
    username: 'Guest',
    profileImage: 'https://via.placeholder.com/40',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // For logout redirection

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        setUserData({ username: 'Guest', profileImage: 'https://via.placeholder.com/40' });
        setTotalPoints(0);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const { totalPoints, username, profileImage } = response.data;
        const resolvedProfileImage = profileImage.startsWith('http')
          ? profileImage
          : `http://localhost:5000${profileImage}`;

        setTotalPoints(totalPoints || 0);
        setUserData({
          username: username || 'Guest',
          profileImage: resolvedProfileImage,
        });
        setError(''); // Clear error on success
      } catch (err) {
        console.error('Error fetching user data:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.error || 'Error fetching user data';
        setError(errorMessage);

        if (err.response?.status === 401 || errorMessage === 'User not found') {
          // Handle unauthorized or invalid token
          setTotalPoints(0);
          setUserData({ username: 'Guest', profileImage: 'https://via.placeholder.com/40' });
          localStorage.removeItem('token');
          navigate('/login'); // Redirect to login
        } else {
          // Fallback for other errors
          setTotalPoints(0); // Avoid mock data; reset to 0
          setUserData({ username: 'Guest', profileImage: 'https://via.placeholder.com/40' });
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData({ username: 'Guest', profileImage: 'https://via.placeholder.com/40' });
    setTotalPoints(0);
    setError('');
    navigate('/login');
  };

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

      {/* Right Side: Points Counter, Theme Toggle, User Profile, and Logout */}
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
        <div className="flex items-center space-x-2 relative group">
          <img
            src={userData.profileImage}
            alt="User profile"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/40')}
          />
          <span>{userData.username}</span>
          {/* Dropdown for Logout */}
          <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800 rounded-lg shadow-lg hidden group-hover:block">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-white hover:bg-red-500 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    </nav>
  );
}

export default Navbar;