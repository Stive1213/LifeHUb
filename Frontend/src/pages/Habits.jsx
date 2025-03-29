import { useState } from 'react';

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

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Habit Builder</h2>

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
        <p className="text-gray-400">{getWeeklySummary()}</p>
      </div>
    </div>
  );
}

export default Habits;