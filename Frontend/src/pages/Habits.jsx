import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';

// Register Chart.js components for line graph
ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

function Habits() {
  // Mock data for habits
  const [habits, setHabits] = useState([
    {
      id: '1',
      name: 'Drink Water',
      frequency: 'Daily',
      streak: 5,
      completionHistory: [
        '2025-03-24',
        '2025-03-25',
        '2025-03-26',
        '2025-03-27',
        '2025-03-28',
      ],
    },
    {
      id: '2',
      name: 'Read a Book',
      frequency: 'Daily',
      streak: 2,
      completionHistory: ['2025-03-27', '2025-03-28'],
    },
  ]);

  // State for new habit form
  const [newHabit, setNewHabit] = useState({
    name: '',
    frequency: 'Daily',
  });

  // State for selected habit to display in the graph
  const [selectedHabitId, setSelectedHabitId] = useState(habits.length > 0 ? habits[0].id : '');

  // Current date (March 29, 2025)
  const currentDate = '2025-03-29';

  // Handle form input changes
  const handleHabitChange = (e) => {
    setNewHabit({ ...newHabit, [e.target.name]: e.target.value });
  };

  // Handle adding a new habit
  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabit.name) return;
    const habit = {
      ...newHabit,
      id: Date.now().toString(),
      streak: 0,
      completionHistory: [],
    };
    console.log('Habit added:', habit);
    setHabits([...habits, habit]);
    // If this is the first habit, set it as the selected habit for the graph
    if (habits.length === 0) {
      setSelectedHabitId(habit.id);
    }
    setNewHabit({ name: '', frequency: 'Daily' });
  };

  // Handle marking a habit as done
  const toggleHabitDone = (habitId) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isDoneToday = habit.completionHistory.includes(currentDate);
        let newStreak = habit.streak;
        let newCompletionHistory = [...habit.completionHistory];

        if (isDoneToday) {
          // Unmark as done: Remove today's date and recalculate streak
          newCompletionHistory = newCompletionHistory.filter((date) => date !== currentDate);
          // Recalculate streak by finding the last consecutive sequence
          let streak = 0;
          let tempDate = new Date(currentDate);
          tempDate.setDate(tempDate.getDate() - 1); // Start from yesterday
          while (newCompletionHistory.includes(tempDate.toISOString().split('T')[0])) {
            streak++;
            tempDate.setDate(tempDate.getDate() - 1);
          }
          newStreak = streak;
        } else {
          // Mark as done: Add today's date and update streak
          newCompletionHistory.push(currentDate);
          // Check if the previous day was completed to continue the streak
          const yesterday = new Date(currentDate);
          yesterday.setDate(yesterday.getDate() - 1);
          const wasDoneYesterday = habit.completionHistory.includes(
            yesterday.toISOString().split('T')[0]
          );
          newStreak = wasDoneYesterday ? habit.streak + 1 : 1;
        }

        return {
          ...habit,
          streak: newStreak,
          completionHistory: newCompletionHistory,
        };
      })
    );
  };

  // Calculate weekly summary (last 7 days)
  const getWeeklySummary = () => {
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 6); // Last 7 days including today
    const totalPossibleCompletions = habits.length * 7; // Total habits * 7 days
    let totalCompletions = 0;

    habits.forEach((habit) => {
      if (habit.frequency === 'Daily') {
        habit.completionHistory.forEach((date) => {
          const completionDate = new Date(date);
          if (completionDate >= startDate && completionDate <= new Date(currentDate)) {
            totalCompletions++;
          }
        });
      }
    });

    const completionPercentage =
      totalPossibleCompletions > 0
        ? Math.round((totalCompletions / totalPossibleCompletions) * 100)
        : 0;
    return `Completed ${completionPercentage}% this week`;
  };

  // Prepare data for the line graph
  const getGraphData = () => {
    const selectedHabit = habits.find((habit) => habit.id === selectedHabitId);
    if (!selectedHabit) return { labels: [], datasets: [] };

    // Last 7 days (March 23–29)
    const labels = [];
    const data = [];
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 6); // Start from March 23

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dateString = day.toISOString().split('T')[0];
      labels.push(day.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));
      data.push(selectedHabit.completionHistory.includes(dateString) ? 1 : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: `${selectedHabit.name} Progress`,
          data,
          fill: false,
          borderColor: '#8b5cf6', // Purple line
          backgroundColor: '#8b5cf6',
          tension: 0.1,
        },
      ],
    };
  };

  // Graph options to customize appearance
  const graphOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 1,
          callback: (value) => (value === 1 ? 'Completed' : 'Not Completed'),
          color: '#d1d5db', // Gray text
        },
        grid: {
          color: '#334155', // Slate grid lines
        },
      },
      x: {
        ticks: {
          color: '#d1d5db', // Gray text
        },
        grid: {
          color: '#334155', // Slate grid lines
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#d1d5db', // Gray legend text
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl text-gray-400 font-bold mb-6">Habit Builder</h2>

      {/* Add Habit Form */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Add Habit</h3>
        <form onSubmit={handleAddHabit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="habit-name" className="block text-sm text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="habit-name"
                name="name"
                value={newHabit.name}
                onChange={handleHabitChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="Enter habit name"
              />
            </div>
            <div>
              <label htmlFor="habit-frequency" className="block text-sm text-gray-400 mb-2">
                Frequency
              </label>
              <select
                id="habit-frequency"
                name="frequency"
                value={newHabit.frequency}
                onChange={handleHabitChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add Habit
          </button>
        </form>
      </div>

      {/* Habit List */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Habits</h3>
        {habits.length > 0 ? (
          <ul className="space-y-4">
            {habits.map((habit) => {
              const isDoneToday = habit.completionHistory.includes(currentDate);
              const reminderText = isDoneToday ? 'Great job!' : 'Check this today!';
              return (
                <li key={habit.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={isDoneToday}
                      onChange={() => toggleHabitDone(habit.id)}
                      className="accent-purple-500"
                    />
                    <div>
                      <p className="font-bold">{habit.name}</p>
                      <p className="text-sm text-gray-400">
                        Streak: {habit.streak} {habit.frequency === 'Daily' ? 'days' : 'weeks'}
                      </p>
                      <p className={`text-sm ${isDoneToday ? 'text-green-400' : 'text-red-400'}`}>
                        {reminderText}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No habits added yet.</p>
        )}
      </div>

      {/* History */}
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">History</h3>
        <p className="text-gray-400 mb-4">{getWeeklySummary()}</p>

        {/* Habit Progress Graph */}
        {habits.length > 0 ? (
          <div>
            <div className="mb-4">
              <label htmlFor="habit-select" className="block text-sm text-gray-400 mb-2">
                Select Habit to View Progress
              </label>
              <select
                id="habit-select"
                value={selectedHabitId}
                onChange={(e) => setSelectedHabitId(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              >
                {habits.map((habit) => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-64">
              <Line data={getGraphData()} options={graphOptions} />
            </div>
          </div>
        ) : (
          <p className="text-gray-400">Add habits to view progress.</p>
        )}
      </div>
    </div>
  );
}

export default Habits;