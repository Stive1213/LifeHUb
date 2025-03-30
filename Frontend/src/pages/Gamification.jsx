import { useState } from 'react';

function Gamification() {
  // Mock data for points
  const totalPoints = 150;
  const recentEarnings = [
    { id: '1', description: '+10 for completing a task', date: '2025-03-29' },
    { id: '2', description: '+5 for daily login', date: '2025-03-29' },
    { id: '3', description: '+20 for achieving a goal', date: '2025-03-28' },
  ];

  // Mock data for badges
  const badges = [
    { id: '1', name: 'Budget Boss', icon: '💰' },
    { id: '2', name: 'Task Master', icon: '✅' },
    { id: '3', name: 'Habit Hero', icon: '🌟' },
  ];

  // Mock data for leaderboard
  const leaderboard = [
    { id: '1', name: 'Abebe', points: 200 },
    { id: '2', name: 'Kebede', points: 180 },
    { id: '3', name: 'You', points: 150 },
    { id: '4', name: 'Tigist', points: 120 },
  ];

  // State for leaderboard opt-in (mocked as opted in by default)
  const [isOptedIn, setIsOptedIn] = useState(true);

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Gamification Layer</h2>

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
                onChange={() => setIsOptedIn(!isOptedIn)}
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