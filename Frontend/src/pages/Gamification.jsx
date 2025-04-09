import { useState, useEffect } from 'react';
import axios from 'axios';

function Gamification() {
  const [totalPoints, setTotalPoints] = useState(0);
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Fetch data function
  const fetchGamificationData = async () => {
    if (!token) {
      setError('Please log in to view gamification data');
      setLoading(false);
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch points
      const pointsRes = await axios.get('http://localhost:5000/api/gamification/points', { headers });
      setTotalPoints(pointsRes.data.totalPoints);

      // Fetch recent earnings
      const earningsRes = await axios.get('http://localhost:5000/api/gamification/earnings', { headers });
      setRecentEarnings(earningsRes.data);

      // Fetch badges
      const badgesRes = await axios.get('http://localhost:5000/api/gamification/badges', { headers });
      setBadges(badgesRes.data);

      // Fetch leaderboard
      const leaderboardRes = await axios.get('http://localhost:5000/api/gamification/leaderboard', {
        headers,
        params: { optIn: isOptedIn },
      });
      setLeaderboard(leaderboardRes.data);

      setError('');
    } catch (err) {
      console.error('Error fetching gamification data:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error fetching gamification data');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling setup
  useEffect(() => {
    fetchGamificationData();
    const interval = setInterval(fetchGamificationData, 10000); // Poll every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [isOptedIn, token]); // Refetch when opt-in changes

  // Handle leaderboard opt-in toggle
  const handleOptInChange = async () => {
    const newOptIn = !isOptedIn;
    setIsOptedIn(newOptIn);
    try {
      await axios.put(
        'http://localhost:5000/api/gamification/leaderboard/opt-in',
        { optIn: newOptIn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGamificationData(); // Refresh leaderboard immediately
    } catch (err) {
      console.error('Error updating opt-in:', err.response?.data || err.message);
      setError('Failed to update leaderboard preference');
      setIsOptedIn(!newOptIn); // Revert on error
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Gamification Layer</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Points Tracker */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Points Tracker</h3>
        <div className="mb-4">
          <p className="text-3xl">
            Total Points: <span className="text-purple-400">{totalPoints} pts</span>
          </p>
        </div>
        <h4 className="text-lg font-bold mb-2">Recent Earnings</h4>
        {recentEarnings.length > 0 ? (
          <ul className="space-y-2">
            {recentEarnings.map((earning) => (
              <li key={earning.id} className="bg-slate-700 p-3 rounded-lg">
                <p>{earning.description}</p>
                <p className="text-sm text-gray-400">{earning.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No recent earnings.</p>
        )}
      </div>

      {/* Badge Gallery and Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Badge Gallery */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Badge Gallery</h3>
          {badges.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="bg-slate-700 p-4 rounded-lg text-center">
                  <p className="text-3xl mb-2">{badge.icon}</p>
                  <p>{badge.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No badges earned yet.</p>
          )}
        </div>

        {/* Leaderboard */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isOptedIn}
                onChange={handleOptInChange}
                className="form-checkbox h-5 w-5 text-purple-500"
              />
              <span>Show my score on the leaderboard</span>
            </label>
          </div>
          {isOptedIn ? (
            leaderboard.length > 0 ? (
              <ul className="space-y-2">
                {leaderboard.map((entry) => (
                  <li
                    key={entry.id}
                    className={`p-3 rounded-lg ${
                      entry.name === 'You' ? 'bg-purple-500' : 'bg-slate-700'
                    }`}
                  >
                    <p>
                      {entry.name}: <span className="text-purple-400">{entry.points} pts</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No leaderboard data available.</p>
            )
          ) : (
            <p className="text-gray-400">Opt in to see the leaderboard.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gamification;