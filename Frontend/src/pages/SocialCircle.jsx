import { useState } from 'react';

function SocialCircle() {
  // Mock data for contacts
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'Abebe',
      birthday: '1995-03-30',
    },
    {
      id: '2',
      name: 'Kebede',
      birthday: '1990-04-15',
    },
  ]);

  // Mock data for messages
  const [messages, setMessages] = useState({
    '1': [
      { id: 'm1', sender: 'Abebe', text: 'Hi!', timestamp: '2025-03-29T10:00:00Z' },
      { id: 'm2', sender: 'You', text: 'Hey, how are you?', timestamp: '2025-03-29T10:01:00Z' },
    ],
    '2': [{ id: 'm3', sender: 'Kebede', text: 'Hello!', timestamp: '2025-03-29T09:00:00Z' }],
  });

  // State for new contact form
  const [newContact, setNewContact] = useState({
    name: '',
    birthday: '',
  });

  // State for new message input
  const [newMessage, setNewMessage] = useState('');

  // State for selected contact
  const [selectedContactId, setSelectedContactId] = useState(null);

  // Current date (March 29, 2025)
  const currentDate = new Date('2025-03-29');

  // Handle new contact form input changes
  const handleContactChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  // Handle adding a new contact
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.birthday) return;
    const contact = {
      id: Date.now().toString(),
      name: newContact.name,
      birthday: newContact.birthday,
    };
    console.log('Contact added:', contact);
    setContacts([...contacts, contact]);
    setMessages((prev) => ({ ...prev, [contact.id]: [] })); // Initialize empty message array for new contact
    setNewContact({ name: '', birthday: '' });
  };

  // Handle selecting a contact to message
  const handleSelectContact = (contactId) => {
    setSelectedContactId(contactId);
    setNewMessage(''); // Clear message input when switching contacts
  };

  // Handle new message input change
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage || !selectedContactId) return;
    const message = {
      id: Date.now().toString(),
      sender: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    console.log('Message sent:', message);
    setMessages((prev) => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), message],
    }));
    setNewMessage('');
  };

  // Get upcoming birthdays (within the next 7 days)
  const getUpcomingBirthdays = () => {
    const upcoming = [];
    const today = new Date(currentDate);

    contacts.forEach((contact) => {
      const birthday = new Date(contact.birthday);
      const birthdayThisYear = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

      // If birthday has passed this year, set it to next year
      if (birthdayThisYear < today) {
        birthdayThisYear.setFullYear(today.getFullYear() + 1);
      }

      const diffDays = Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 7) {
        const label = diffDays === 0 ? 'today' : diffDays === 1 ? 'tomorrow' : `in ${diffDays} days`;
        upcoming.push(`${contact.name}’s birthday ${label}`);
      }
    });

    return upcoming;
  };

  const upcomingBirthdays = getUpcomingBirthdays();

  return (
    <div className="text-white flex space-x-6">
      {/* Contact List */}
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Contacts</h3>

        {/* Add Contact Form */}
        <div className="mb-6">
          <h4 className="text-lg font-bold mb-2">Add Contact</h4>
          <form onSubmit={handleAddContact}>
            <div className="mb-4">
              <label htmlFor="contact-name" className="block text-sm text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={newContact.name}
                onChange={handleContactChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="Enter name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="contact-birthday" className="block text-sm text-gray-400 mb-2">
                Birthday
              </label>
              <input
                type="date"
                id="contact-birthday"
                name="birthday"
                value={newContact.birthday}
                onChange={handleContactChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Contact
            </button>
          </form>
        </div>

        {/* Contact List */}
        <div className="max-h-96 overflow-y-auto">
          {contacts.length > 0 ? (
            <ul className="space-y-4">
              {contacts.map((contact) => (
                <li key={contact.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold">{contact.name}</p>
                    <p className="text-sm text-gray-400">
                      Birthday: {new Date(contact.birthday).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSelectContact(contact.id)}
                    className="bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Message
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No contacts added yet.</p>
          )}
        </div>
      </div>

      {/* Messaging Area */}
      <div className="flex-1 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">
          {selectedContactId
            ? `Chat with ${contacts.find((c) => c.id === selectedContactId)?.name || ''}`
            : 'Select a Contact to Chat'}
        </h3>
        {selectedContactId ? (
          <>
            <div className="h-96 overflow-y-auto mb-4">
              {messages[selectedContactId]?.length > 0 ? (
                <ul className="space-y-2">
                  {messages[selectedContactId].map((message) => (
                    <li
                      key={message.id}
                      className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs p-3 rounded-lg ${
                          message.sender === 'You' ? 'bg-purple-500' : 'bg-slate-700'
                        }`}
                      >
                        <p className="text-sm font-bold">{message.sender}</p>
                        <p>{message.text}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleMessageChange}
                className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <p className="text-gray-400">Select a contact to start messaging.</p>
        )}
      </div>

      {/* Alerts */}
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Alerts</h3>
        {upcomingBirthdays.length > 0 ? (
          <ul className="space-y-4">
            {upcomingBirthdays.map((alert, index) => (
              <li key={index} className="bg-slate-700 p-4 rounded-lg">
                <p className="text-yellow-400">{alert}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No upcoming birthdays.</p>
        )}
      </div>
    </div>
  );
}

export default SocialCircle;