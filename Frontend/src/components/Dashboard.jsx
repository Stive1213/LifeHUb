import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [events, setEvents] = useState([]);
  const [habits, setHabits] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [error, setError] = useState('');

  const currentDate = new Date().toISOString().split('T')[0];
  const currentMonth = currentDate.slice(0, 7); // e.g., "2025-03"

  // Fetch data from all endpoints on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view dashboard');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get('http://localhost:5000/api/tasks', { headers }),
      axios.get('http://localhost:5000/api/transactions', { headers }),
      axios.get('http://localhost:5000/api/events', { headers }),
      axios.get('http://localhost:5000/api/habits', { headers }),
      axios.get('http://localhost:5000/api/journal', { headers }),
    ])
      .then(([tasksRes, transRes, eventsRes, habitsRes, journalRes]) => {
        setTasks(tasksRes.data);
        setTransactions(transRes.data);
        setEvents(eventsRes.data);
        setHabits(habitsRes.data);
        setJournalEntries(journalRes.data);
      })
      .catch((err) => setError(err.response?.data?.error || 'Error fetching dashboard data'));
  }, []);

  // Helper functions to calculate widget values
  const getTasksToday = () => {
    const todayTasks = tasks.filter((task) => task.deadline === currentDate && !task.isDone);
    return todayTasks.length > 0 ? `${todayTasks.length} Tasks Today` : 'No tasks today';
  };

  const getBudgetSpent = () => {
    const monthExpenses = transactions
      .filter((t) => t.type.toLowerCase() === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    return monthExpenses > 0 ? `${monthExpenses.toFixed(2)} ETB Spent` : 'No expenses this month';
  };

  const getUpcomingEvents = () => {
    const upcoming = events.filter((e) => new Date(e.date) >= new Date());
    return upcoming.length > 0 ? `${upcoming.length} Upcoming` : 'No upcoming events';
  };

  const getHabitStreak = () => {
    const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;
    return maxStreak > 0 ? `${maxStreak} Days Streak` : 'No habit streaks';
  };

  const getBudgetOverview = () => {
    const income = transactions
      .filter((t) => t.type.toLowerCase() === 'income' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactions
      .filter((t) => t.type.toLowerCase() === 'expense' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const total = income - expenses;
    return total !== 0 ? `${total.toFixed(2)} ETB` : 'No budget data';
  };

  const getSavingsGoal = () => {
    const savings = transactions
      .filter((t) => t.type.toLowerCase() === 'income' && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + parseFloat(t.amount), 0) * 0.2; // 20% of income
    return savings > 0 ? `${savings.toFixed(2)} ETB` : 'No savings data';
  };

  const getRecentActivity = () => {
    const activities = [
      ...tasks.map((t) => ({
        type: 'Completed Task',
        date: t.deadline,
        status: t.isDone ? 'Done' : 'Pending',
        details: t.title,
      })),
      ...transactions.map((t) => ({
        type: `Added ${t.type === 'income' ? 'Income' : 'Expense'}`,
        date: t.date,
        status: 'Pending',
        details: `${t.amount.toFixed(2)} ETB - ${t.category}`,
      })),
      ...events.map((e) => ({
        type: 'Scheduled Event',
        date: e.date,
        status: 'Pending',
        details: `${e.title} at ${e.time}`,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    return activities.length > 0 ? activities : [];
  };

  // Habit Progress Graph Data (from Habits.jsx)
  const getHabitGraphData = () => {
    const topHabit = habits.reduce((max, habit) => (habit.streak > max.streak ? habit : max), habits[0]);
    if (!topHabit) return { labels: [], datasets: [] };

    const labels = [];
    const data = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 6); // Last 7 days

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dateString = day.toISOString().split('T')[0];
      labels.push(day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
      data.push(topHabit.completionHistory.includes(dateString) ? 1 : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: `${topHabit.name} Progress`,
          data,
          fill: false,
          borderColor: '#8b5cf6',
          backgroundColor: '#8b5cf6',
          tension: 0.1,
        },
      ],
    };
  };

  // Income/Expenses Graph Data
  const getBudgetGraphData = () => {
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 6); // Last 7 days

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dateString = day.toISOString().split('T')[0];
      labels.push(day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));

      const dailyIncome = transactions
        .filter((t) => t.type.toLowerCase() === 'income' && t.date === dateString)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const dailyExpense = transactions
        .filter((t) => t.type.toLowerCase() === 'expense' && t.date === dateString)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      incomeData.push(dailyIncome);
      expenseData.push(dailyExpense);
    }

    return {
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          fill: false,
          borderColor: '#4ade80', // Green
          backgroundColor: '#4ade80',
          tension: 0.1,
        },
        {
          label: 'Expenses',
          data: expenseData,
          fill: false,
          borderColor: '#f87171', // Red
          backgroundColor: '#f87171',
          tension: 0.1,
        },
      ],
    };
  };

  const graphOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#d1d5db' },
        grid: { color: '#334155' },
      },
      x: {
        ticks: { color: '#d1d5db' },
        grid: { color: '#334155' },
      },
    },
    plugins: {
      legend: { labels: { color: '#d1d5db' } },
    },
    maintainAspectRatio: false,
  };

  const habitGraphOptions = {
    ...graphOptions,
    scales: {
      ...graphOptions.scales,
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value) => (value === 1 ? 'Completed' : 'Not Completed'),
          color: '#d1d5db',
        },
      },
    },
  };

  const handleLinkClick = (link) => {
    console.log(`Navigating to ${link}...`);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleCreateReport = () => {
    console.log('Creating report...');
  };

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-400">Welcome back, John!</h2>
        <p className="text-sm text-gray-400">Manage your tasks, budget, and more</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {/* Top Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Tasks</p>
          <h3 className="text-2xl font-bold">{getTasksToday()}</h3>
          <button
            onClick={() => handleLinkClick('Tasks & Goals')}
            className="text-sm text-purple-400 hover:text-purple-300 mt-2"
          >
            View Details
          </button>
        </div>
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Budget</p>
          <h3 className="text-2xl font-bold">{getBudgetSpent()}</h3>
          <button
            onClick={() => handleLinkClick('Budget Tracker')}
            className="text-sm text-purple-400 hover:text-purple-300 mt-2"
          >
            View Details
          </button>
        </div>
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Events</p>
          <h3 className="text-2xl font-bold">{getUpcomingEvents()}</h3>
          <button
            onClick={() => handleLinkClick('Calendar')}
            className="text-sm text-purple-400 hover:text-purple-300 mt-2"
          >
            View Details
          </button>
        </div>
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Habits</p>
          <h3 className="text-2xl font-bold">{getHabitStreak()}</h3>
          <button
            onClick={() => handleLinkClick('Habits')}
            className="text-sm text-purple-400 hover:text-purple-300 mt-2"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-gray-400">Budget Overview</p>
              <h3 className="text-2xl font-bold">{getBudgetOverview()}</h3>
            </div>
            <div className="flex space-x-2">
              <button className="text-sm text-purple-400">Income</button>
              <button className="text-sm text-blue-400">Expenses</button>
            </div>
          </div>
          <div className="h-48">
            {transactions.length > 0 ? (
              <Line data={getBudgetGraphData()} options={graphOptions} />
            ) : (
              <div className="h-full bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">No budget data available</p>
              </div>
            )}
          </div>
        </div>
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-400">Savings Goal</p>
          <h3 className="text-2xl font-bold">{getSavingsGoal()}</h3>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Reports Overview</h3>
            <div className="flex space-x-2">
              <button className="text-sm text-gray-400">Select date</button>
              <button onClick={handleExport} className="text-sm text-purple-400">
                Export data
              </button>
              <button onClick={handleCreateReport} className="text-sm bg-purple-500 text-white px-3 py-1 rounded-lg">
                Create report
              </button>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-400">Habit Progress</p>
            <div className="h-32">
              {habits.length > 0 ? (
                <Line data={getHabitGraphData()} options={habitGraphOptions} />
              ) : (
                <div className="h-full bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No habit data available</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Social Engagement</p>
            <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">
                {journalEntries.length > 0
                  ? 'Map Placeholder (Engagement)'
                  : 'No journal data available'}
              </p>
            </div>
          </div>
        </div>

        <div className="widget-card bg-slate-800 p-4 rounded-lg shadow col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <button className="text-sm text-gray-400">
              {new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' })}
            </button>
          </div>
          <div className="overflow-x-auto">
            {getRecentActivity().length > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400">
                    <th className="text-left py-2">Activity</th>
                    <th className="text-left py-2">Date</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {getRecentActivity().map((activity, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-2">{activity.type}</td>
                      <td className="py-2">
                        {new Date(activity.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className={`py-2 ${activity.status === 'Done' ? 'text-green-400' : 'text-yellow-400'}`}>
                        {activity.status}
                      </td>
                      <td className="py-2">{activity.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-center py-4">No recent activity available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;