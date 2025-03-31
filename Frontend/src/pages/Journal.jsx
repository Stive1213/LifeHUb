import { useState, useEffect } from 'react';
import axios from 'axios';

function Journal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    text: '',
    mood: 'Happy',
  });
  const [error, setError] = useState('');

  // Current date (dynamic)
  const currentDate = new Date().toISOString().split('T')[0];

  // Available moods with icons
  const moods = [
    { name: 'Happy', icon: '😊', color: 'text-green-400' },
    { name: 'Sad', icon: '😢', color: 'text-blue-400' },
    { name: 'Neutral', icon: '😐', color: 'text-gray-400' },
    { name: 'Excited', icon: '🎉', color: 'text-yellow-400' },
    { name: 'Stressed', icon: '😓', color: 'text-red-400' },
  ];

  // Fetch journal entries on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view journal entries');
      return;
    }

    axios
      .get('http://localhost:5000/api/journal', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEntries(response.data))
      .catch((err) => setError(err.response?.data?.error || 'Error fetching journal entries'));
  }, []);

  // Handle form input changes
  const handleEntryChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setNewEntry({ ...newEntry, mood });
  };

  // Handle adding a new journal entry
  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (!newEntry.text) return;
    const token = localStorage.getItem('token');
    const entry = { date: currentDate, text: newEntry.text, mood: newEntry.mood };
    try {
      const response = await axios.post(
        'http://localhost:5000/api/journal',
        entry,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntries([response.data, ...entries]);
      setNewEntry({ text: '', mood: 'Happy' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding journal entry');
    }
  };

  // Calculate mood summary for the current month
  const getMoodSummary = () => {
    const currentMonth = currentDate.slice(0, 7); // e.g., "2025-03"
    const monthEntries = entries.filter((entry) => entry.date.startsWith(currentMonth));
    const totalEntries = monthEntries.length;
    if (totalEntries === 0) return 'No entries this month.';

    const moodCounts = monthEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {});

    const summary = Object.entries(moodCounts)
      .map(([mood, count]) => {
        const percentage = Math.round((count / totalEntries) * 100);
        return `${percentage}% ${mood}`;
      })
      .join(', ');

    return `This month: ${summary}`;
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-6">Daily Journal</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Entry Form */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">New Entry</h3>
        <form onSubmit={handleAddEntry}>
          <div className="mb-4">
            <label htmlFor="entry-text" className="block text-sm text-gray-400 mb-2">
              Write about your day
            </label>
            <textarea
              id="entry-text"
              name="text"
              value={newEntry.text}
              onChange={handleEntryChange}
              className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              rows="5"
              placeholder="How was your day?"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">How are you feeling?</label>
            <div className="flex space-x-4">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  type="button"
                  onClick={() => handleMoodSelect(mood.name)}
                  className={`text-2xl p-2 rounded-lg ${
                    newEntry.mood === mood.name
                      ? 'bg-purple-500'
                      : 'bg-slate-700 hover:bg-slate-600'
                  } transition-colors`}
                  title={mood.name}
                >
                  <span className={mood.color}>{mood.icon}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Save
          </button>
        </form>
      </div>

      {/* Timeline and Mood Summary */}
      <div className="flex space-x-6">
        {/* Timeline */}
        <div className="flex-1 bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Timeline</h3>
          <div className="max-h-96 overflow-y-auto">
            {entries.length > 0 ? (
              <ul className="space-y-4">
                {entries.map((entry) => {
                  const mood = moods.find((m) => m.name === entry.mood);
                  const snippet = entry.text.split(' ').slice(0, 5).join(' ') + '...';
                  return (
                    <li key={entry.id} className="bg-slate-700 p-4 rounded-lg">
                      <p className="font-bold">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-400">{snippet}</p>
                      <p className={`text-sm ${mood?.color}`}>
                        {mood?.icon} {entry.mood}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-400">No journal entries yet.</p>
            )}
          </div>
        </div>

        {/* Mood Summary */}
        <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Mood Summary</h3>
          <p className="text-gray-400">{getMoodSummary()}</p>
        </div>
      </div>
    </div>
  );
}

export default Journal;