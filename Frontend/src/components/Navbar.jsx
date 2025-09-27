import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar, toggleTheme, theme, isSidebarOpen }) {
  const [totalPoints, setTotalPoints] = useState(0);
  const [userData, setUserData] = useState({
    username: "Guest",
    profileImage: "https://via.placeholder.com/40",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserData({
          username: "Guest",
          profileImage: "https://via.placeholder.com/40",
        });
        setTotalPoints(0);
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const { totalPoints, username, profileImage } = response.data;
        const resolvedProfileImage = profileImage?.startsWith("http")
          ? profileImage
          : `http://localhost:5000${profileImage}`;

        setTotalPoints(totalPoints || 0);
        setUserData({
          username: username || "Guest",
          profileImage: resolvedProfileImage,
        });
        setError("");
      } catch (err) {
        setError("Session expired, please log in again");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({
      username: "Guest",
      profileImage: "https://via.placeholder.com/40",
    });
    setTotalPoints(0);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Left side: Logo + Sidebar toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-gray-800">LifeHub</h1>
      </div>

      {/* Right side: Points, Theme toggle, Profile */}
      <div className="flex items-center gap-4">
        {/* Points badge */}
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {totalPoints} pts
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          {theme === "dark" ? (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 
                6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 
                0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 
                11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 
                018.646 3.646 9.003 9.003 0 0012 
                21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Profile with dropdown */}
        <div className="relative group">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src={userData.profileImage}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
              onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
            />
            <span className="font-medium text-gray-800">
              {userData.username}
            </span>
          </div>
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg hidden group-hover:block">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
