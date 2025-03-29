import { useState } from 'react';

function Journal() {
  // Mock data for journal entries
  const [entries, setEntries] = useState([
    {
      id: '1',
      date: '2025-03-27',
      text: 'Felt great today after a productive morning!',
      mood: 'Happy',
    },
    {
      id: '2',
      date: '2025-03-26',
      mood: 'Sad',
      text: 'Had a tough day at work, feeling overwhelmed.',
    },
    {
      id: '3',
      date: '2025-03-25',
      mood: 'Neutral',
      text: 'Just an average day, nothing special.',
    },
  ]);

  // State for new journal entry form
  const [newEntry, setNewEntry] = useState({
    text: '',
    mood: 'Happy',
  });

  // Current date (March 29, 2025)
  const currentDate = '2025-03-29';

  // Available moods with icons
  const moods = [
    { name: 'Happy', icon: '😊', color: 'text-green-400' },
    { name: 'Sad', icon: '😢', color: 'text-blue-400' },
    { name: 'Neutral', icon: '😐', color: 'text-gray-400' },
    { name: 'Excited', icon: '🎉', color: 'text-yellow-400' },
    { name: 'Stressed', icon: '😓', color: 'text-red-400' },
  ];

  // Handle form input changes
  const handleEntryChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setNewEntry({ ...newEntry, mood });
  };

  // Handle adding a new journal entry
  const handleAddEntry = (e) => {
    e.preventDefault();
    if (!newEntry.text) return;
    const entry = {
      id: Date.now().toString(),
      date: currentDate,
      text: newEntry.text,
      mood: newEntry.mood,
    };
    console.log('Entry added:', entry);
    setEntries([entry, ...entries]); // Add to the top of the list
    setNewEntry({ text: '', mood: 'Happy' });
  };

  // Calculate mood summary for the current month (March 2025)
  const getMoodSummary = () => {
    const marchEntries = entries.filter((entry) => entry.date.startsWith('2025-03'));
    const totalEntries = marchEntries.length;
    if (totalEntries === 0) return 'No entries this month.';

    const moodCounts = marchEntries.reduce((acc, entry) => {
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
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Daily Journal</h2>

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