import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [events, setEvents] = useState([]);
  const [habits, setHabits] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [error, setError] = useState("");

  const currentDate = new Date().toISOString().split("T")[0];
  const currentMonth = currentDate.slice(0, 7);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view dashboard");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get("http://localhost:5000/api/tasks", { headers }),
      axios.get("http://localhost:5000/api/transactions", { headers }),
      axios.get("http://localhost:5000/api/events", { headers }),
      axios.get("http://localhost:5000/api/habits", { headers }),
      axios.get("http://localhost:5000/api/journal", { headers }),
    ])
      .then(([tasksRes, transRes, eventsRes, habitsRes, journalRes]) => {
        setTasks(tasksRes.data);
        setTransactions(transRes.data);
        setEvents(eventsRes.data);
        setHabits(habitsRes.data);
        setJournalEntries(journalRes.data);
      })
      .catch((err) =>
        setError(err.response?.data?.error || "Error fetching dashboard data")
      );
  }, []);

  // helpers (same logic, shortened here for clarity)
  const getTasksToday = () =>
    tasks.filter((t) => t.deadline === currentDate && !t.isDone).length > 0
      ? `${tasks.length} Tasks Today`
      : "No tasks today";

  const getBudgetSpent = () => {
    const spent = transactions
      .filter(
        (t) =>
          t.type.toLowerCase() === "expense" && t.date.startsWith(currentMonth)
      )
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return spent > 0 ? `${spent.toFixed(2)} ETB Spent` : "No expenses this month";
  };

  const getUpcomingEvents = () => {
    const upcoming = events.filter((e) => new Date(e.date) >= new Date());
    return upcoming.length > 0
      ? `${upcoming.length} Upcoming`
      : "No upcoming events";
  };

  const getHabitStreak = () => {
    const streak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
    return streak > 0 ? `${streak} Days Streak` : "No habit streaks";
  };

  const getRecentActivity = () => {
    const activities = [
      ...tasks.map((t) => ({
        type: "Task",
        date: t.deadline,
        status: t.isDone ? "Done" : "Pending",
        details: t.title,
      })),
      ...transactions.map((t) => ({
        type: `Transaction (${t.type})`,
        date: t.date,
        status: "Logged",
        details: `${t.amount.toFixed(2)} ETB - ${t.category}`,
      })),
      ...events.map((e) => ({
        type: "Event",
        date: e.date,
        status: "Scheduled",
        details: e.title,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    return activities;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-gray-900">Welcome back, John!</h2>
          <p className="text-sm text-gray-600">
            Manage your tasks, budget, and more
          </p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Tasks</p>
            <h3 className="text-xl font-semibold text-gray-900">{getTasksToday()}</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Budget</p>
            <h3 className="text-xl font-semibold text-gray-900">{getBudgetSpent()}</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Events</p>
            <h3 className="text-xl font-semibold text-gray-900">{getUpcomingEvents()}</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Habits</p>
            <h3 className="text-xl font-semibold text-gray-900">{getHabitStreak()}</h3>
          </div>
        </div>

        {/* Budget Overview + Savings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 col-span-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Overview</h3>
            <div className="h-48">
              {transactions.length > 0 ? (
                <Line data={{ /* use your graph fn here */ }} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No budget data available
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-600">Savings Goal</p>
            <h3 className="text-xl font-semibold text-gray-900">--</h3>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          {getRecentActivity().length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-600 border-b border-gray-200">
                  <th className="text-left py-2">Activity</th>
                  <th className="text-left py-2">Date</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Details</th>
                </tr>
              </thead>
              <tbody>
                {getRecentActivity().map((a, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2">{a.type}</td>
                    <td className="py-2">{a.date}</td>
                    <td className="py-2 text-blue-600">{a.status}</td>
                    <td className="py-2">{a.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
