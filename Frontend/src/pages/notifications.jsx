import { useState } from 'react';

function Notifications() {
  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    { id: '1', message: "Task 'Finish report' due in 1 hour", timestamp: '2025-03-29 10:00', read: false },
    { id: '2', message: "Goal 'Run 5km' achieved!", timestamp: '2025-03-29 09:30', read: true },
    { id: '3', message: 'Friend request from Abebe', timestamp: '2025-03-28 15:00', read: false },
  ]);

  // Mark a notification as read/unread
  const toggleReadStatus = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: !notification.read } : notification
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`p-4 rounded-lg flex justify-between items-center ${
                  notification.read ? 'bg-slate-700' : 'bg-purple-600'
                }`}
              >
                <div>
                  <p>{notification.message}</p>
                  <p className="text-sm text-gray-400">{notification.timestamp}</p>
                </div>
                <button
                  onClick={() => toggleReadStatus(notification.id)}
                  className="text-white px-3 py-1 rounded-lg bg-slate-600 hover:bg-slate-500 transition-colors"
                >
                  {notification.read ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No notifications available.</p>
        )}
      </div>
    </div>
  );
}

export default Notifications;