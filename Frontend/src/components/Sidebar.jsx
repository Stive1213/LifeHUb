import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("Dashboard");
  const [userData, setUserData] = useState({
    username: "",
    totalPoints: 0,
    profileImage: "https://via.placeholder.com/40",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found. Please log in.");

        const response = await fetch("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData({
          username: data.username || "Guest",
          totalPoints: data.totalPoints || 0,
          profileImage: data.profileImage.startsWith("http")
            ? data.profileImage
            : `http://localhost:5000${data.profileImage}`,
        });
      } catch (err) {
        setError(err.message);
        setUserData({
          username: "Guest",
          totalPoints: 0,
          profileImage: "https://via.placeholder.com/40",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const pageMap = {
      "/dashboard": "Dashboard",
      "/tasks-goals": "Tasks & Goals",
      "/budget-tracker": "Budget Tracker",
      "/calendar": "Calendar",
      "/habits": "Habits",
      "/journal": "Journal",
      "/social-circle": "Social Circle",
      "/documents": "Documents",
      "/quick-tools": "Quick Tools",
      "/community-hub": "Community Hub",
      "/wellness": "Wellness",
      "/assistant": "Assistant",
      "/gamification": "Gamification",
      "/health-wellness": "Health & Wellness",
      "/notifications": "Notifications",
      "/profile": "Profile",
      "/settings": "Settings",
    };
    setActivePage(pageMap[path] || "Dashboard");
  }, [location]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tasks & Goals", path: "/tasks-goals" },
    { name: "Budget Tracker", path: "/budget-tracker" },
    { name: "Calendar", path: "/calendar" },
    { name: "Habits", path: "/habits" },
    { name: "Journal", path: "/journal" },
    { name: "Social Circle", path: "/social-circle" },
    { name: "Documents", path: "/documents" },
    { name: "Quick Tools", path: "/quick-tools" },
    { name: "Community Hub", path: "/community-hub" },
    { name: "Wellness", path: "/wellness" },
    { name: "Assistant", path: "/assistant" },
    { name: "Gamification", path: "/gamification" },
    { name: "Health & Wellness", path: "/health-wellness" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  const handleNavClick = (page, path) => {
    setActivePage(page);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r 
      p-4 transition-transform duration-300 ease-in-out z-50 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {loading ? "Loading..." : `Hi, ${userData.username}`}
            </h2>
            <p className="text-sm text-gray-600">
              {loading ? "..." : `${userData.totalPoints} Points`}
            </p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-900">
          ✖
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">
          {error.includes("token")
            ? "Please log in to see your profile."
            : "Error loading profile."}
        </p>
      )}

      {/* Nav Items */}
      <nav className="overflow-y-auto h-[calc(100vh-160px)]">
        {navItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleNavClick(item.name, item.path)}
            className={`flex items-center space-x-2 p-2 rounded-lg mb-2 cursor-pointer 
              transition-colors duration-200
              ${
                activePage === item.name
                  ? "bg-blue-600 text-white font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            <span>{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 w-[calc(100%-2rem)]">
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
