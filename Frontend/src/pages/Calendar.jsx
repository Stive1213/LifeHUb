import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
  });
  const [view, setView] = useState('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState('');

  // Fetch events on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view events');
      return;
    }

    axios
      .get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEvents(response.data))
      .catch((err) => setError(err.response?.data?.error || 'Error fetching events'));
  }, []);

  // Handle form input changes
  const handleEventChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Handle date change from calendar
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setNewEvent({ ...newEvent, date: date.toISOString().split('T')[0] });
  };

  // Handle adding a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    const token = localStorage.getItem('token');
    const inviteLink = `https://meet.example.com/${newEvent.title.toLowerCase().replace(/\s/g, '-')}-${Date.now()}`;
    const event = { ...newEvent, inviteLink };
    try {
      const response = await axios.post(
        'http://localhost:5000/api/events',
        event,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents([...events, response.data]);
      setNewEvent({ title: '', date: '', time: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error adding event');
    }
  };

  // Filter events for the selected date (for monthly view) or week (for weekly view)
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      if (view === 'month') {
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      } else {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      }
    });
  };

  // Get upcoming events for the event list
  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Custom tile content for the calendar to show events
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dayEvents = getEventsForDate(date);
    return dayEvents.length > 0 ? (
      <div className="text-xs text-purple-400">
        {dayEvents.map((event) => (
          <p key={event.id}>
            {event.title} - {event.time}
          </p>
        ))}
      </div>
    ) : null;
  };

  // Weekly view rendering
  const renderWeeklyView = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dayEvents = getEventsForDate(day);
      days.push(
        <div key={i} className="p-2 border border-gray-700">
          <p className="font-bold">
            {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
          </p>
          {dayEvents.length > 0 ? (
            dayEvents.map((event) => (
              <p key={event.id} className="text-sm text-purple-400">
                {event.title} - {event.time}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-400">No events</p>
          )}
        </div>
      );
    }
    return <div className="grid grid-cols-7 gap-2">{days}</div>;
  };

  return (
    <div className="text-white flex">
      <div className="flex-1">
        <h2 className="text-2xl text-gray-400 font-bold mb-6">Calendar & Event Planner</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Calendar View */}
        <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Calendar</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'month' ? 'bg-purple-500' : 'bg-slate-700'
                } hover:bg-purple-600 transition-colors`}
              >
                Monthly
              </button>
              <button
                onClick={() => setView('week')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'week' ? 'bg-purple-500' : 'bg-slate-700'
                } hover:bg-purple-600 transition-colors`}
              >
                Weekly
              </button>
            </div>
          </div>
          {view === 'month' ? (
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileContent={tileContent}
              className="bg-slate-800 text-white border-none"
              calendarType="gregory"
            />
          ) : (
            renderWeeklyView()
          )}
        </div>

        {/* Event Form */}
        <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
          <h3 className="text-xl font-bold mb-4">Add Event</h3>
          <form onSubmit={handleAddEvent}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="event-title" className="block text-sm text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="event-title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleEventChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <label htmlFor="event-date" className="block text-sm text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="event-date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleEventChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="event-time" className="block text-sm text-gray-400 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  id="event-time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleEventChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
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
      </div>

      {/* Event List */}
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow ml-6">
        <h3 className="text-xl font-bold mb-4">Upcoming Events</h3>
        {upcomingEvents.length > 0 ? (
          <ul className="space-y-4">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(event.date);
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(today.getDate() + 1);
              let dateLabel = eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
              if (eventDate.toDateString() === today.toDateString()) {
                dateLabel = 'Today';
              } else if (eventDate.toDateString() === tomorrow.toDateString()) {
                dateLabel = 'Tomorrow';
              }
              return (
                <li key={event.id} className="bg-slate-700 p-4 rounded-lg">
                  <p className="font-bold">
                    {dateLabel}: {event.title}
                  </p>
                  <p className="text-sm text-gray-400">{event.time}</p>
                  <p className="text-sm text-purple-400">
                    <a href={event.inviteLink} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-400">No upcoming events.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;