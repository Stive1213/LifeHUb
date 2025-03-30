import { useState } from 'react';

function HealthWellness() {
  // Mock data for fitness, diet, and sleep
  const [fitnessActivities, setFitnessActivities] = useState([
    { id: '1', type: 'Run', duration: '30 mins', calories: 300, date: '2025-03-29' },
    { id: '2', type: 'Yoga', duration: '45 mins', calories: 150, date: '2025-03-28' },
  ]);
  const [dietLogs, setDietLogs] = useState([
    { id: '1', meal: 'Breakfast - Oatmeal', calories: 200, date: '2025-03-29' },
    { id: '2', meal: 'Lunch - Salad', calories: 350, date: '2025-03-29' },
  ]);
  const [waterIntake, setWaterIntake] = useState(6); // Glasses of water today
  const [sleepLogs, setSleepLogs] = useState([
    { id: '1', hours: 7, date: '2025-03-29' },
    { id: '2', hours: 8, date: '2025-03-28' },
  ]);

  // Mock health stats
  const healthStats = {
    weeklySteps: 42000,
    averageSleep: 7.5,
  };

  // State for form inputs
  const [newActivity, setNewActivity] = useState({ type: '', duration: '', calories: '' });
  const [newMeal, setNewMeal] = useState({ meal: '', calories: '' });
  const [newSleep, setNewSleep] = useState('');

  // Handlers for adding new entries
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.type || !newActivity.duration || !newActivity.calories) return;
    setFitnessActivities([
      ...fitnessActivities,
      {
        id: Date.now().toString(),
        type: newActivity.type,
        duration: newActivity.duration,
        calories: parseInt(newActivity.calories),
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewActivity({ type: '', duration: '', calories: '' });
  };

  const handleAddMeal = (e) => {
    e.preventDefault();
    if (!newMeal.meal || !newMeal.calories) return;
    setDietLogs([
      ...dietLogs,
      {
        id: Date.now().toString(),
        meal: newMeal.meal,
        calories: parseInt(newMeal.calories),
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewMeal({ meal: '', calories: '' });
  };

  const handleAddWater = () => {
    setWaterIntake(waterIntake + 1);
  };

  const handleAddSleep = (e) => {
    e.preventDefault();
    if (!newSleep) return;
    setSleepLogs([
      ...sleepLogs,
      {
        id: Date.now().toString(),
        hours: parseInt(newSleep),
        date: new Date().toISOString().split('T')[0],
      },
    ]);
    setNewSleep('');
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Health & Wellness</h2>

      {/* Health Stats */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Health Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700 p-4 rounded-lg">
            <p>Weekly Steps: <span className="text-purple-400">{healthStats.weeklySteps.toLocaleString()}</span></p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <p>Average Sleep: <span className="text-purple-400">{healthStats.averageSleep} hours</span></p>
          </div>
        </div>
      </div>

      {/* Fitness Tracking */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Fitness Tracking</h3>
        {/* Add Activity Form */}
        <form onSubmit={handleAddActivity} className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Activity (e.g., Run)"
            value={newActivity.type}
            onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="text"
            placeholder="Duration (e.g., 30 mins)"
            value={newActivity.duration}
            onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="number"
            placeholder="Calories"
            value={newActivity.calories}
            onChange={(e) => setNewActivity({ ...newActivity, calories: e.target.value })}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add
          </button>
        </form>
        {/* Activity List */}
        {fitnessActivities.length > 0 ? (
          <ul className="space-y-2">
            {fitnessActivities.map((activity) => (
              <li key={activity.id} className="bg-slate-700 p-3 rounded-lg">
                <p>{activity.type} - {activity.duration} ({activity.calories} calories)</p>
                <p className="text-sm text-gray-400">{activity.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No activities logged.</p>
        )}
      </div>

      {/* Diet Tracking */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Diet Tracking</h3>
        {/* Add Meal Form */}
        <form onSubmit={handleAddMeal} className="mb-4 flex space-x-2">
          <input
            type="text"
            placeholder="Meal (e.g., Breakfast - Oatmeal)"
            value={newMeal.meal}
            onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          />
          <input
            type="number"
            placeholder="Calories"
            value={newMeal.calories}
            onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add Meal
          </button>
        </form>
        {/* Water Intake */}
        <div className="mb-4">
          <p>Water Intake Today: <span className="text-purple-400">{waterIntake} glasses</span></p>
          <button
            onClick={handleAddWater}
            className="mt-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add Glass of Water
          </button>
        </div>
        {/* Meal List */}
        {dietLogs.length > 0 ? (
          <ul className="space-y-2">
            {dietLogs.map((log) => (
              <li key={log.id} className="bg-slate-700 p-3 rounded-lg">
                <p>{log.meal} ({log.calories} calories)</p>
                <p className="text-sm text-gray-400">{log.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No meals logged.</p>
        )}
      </div>

      {/* Sleep Tracking */}
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Sleep Tracking</h3>
        {/* Add Sleep Form */}
        <form onSubmit={handleAddSleep} className="mb-4 flex space-x-2">
          <input
            type="number"
            placeholder="Hours slept"
            value={newSleep}
            onChange={(e) => setNewSleep(e.target.value)}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add Sleep
          </button>
        </form>
        {/* Sleep List */}
        {sleepLogs.length > 0 ? (
          <ul className="space-y-2">
            {sleepLogs.map((log) => (
              <li key={log.id} className="bg-slate-700 p-3 rounded-lg">
                <p>{log.hours} hours</p>
                <p className="text-sm text-gray-400">{log.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No sleep logged.</p>
        )}
      </div>
    </div>
  );
}

export default HealthWellness;