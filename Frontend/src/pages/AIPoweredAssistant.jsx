import { useState, useEffect } from 'react';

function AIPoweredAssistant() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [token] = useState(localStorage.getItem('token')); // Assuming token is stored in localStorage after login

  // Fetch assistant response from backend
  const getAssistantResponse = async (input) => {
    try {
      const response = await fetch('http://localhost:5000/api/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question: input }),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error fetching assistant response:', error);
      return { response: 'Sorry, something went wrong.', tips: ['Try again later.'] };
    }
  };

  // Handle user input submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage = { sender: 'user', text: userInput };
    setMessages([...messages, userMessage]);

    const { response, tips } = await getAssistantResponse(userInput);
    setMessages((prev) => [
      ...prev,
      { sender: 'assistant', text: response },
      ...(tips.map(tip => ({ sender: 'assistant', text: `Tip: ${tip}` }))),
    ]);

    setUserInput('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="text-white flex space-x-6">
      {/* Chat Box */}
      <div className="flex-1 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Life Assistant Chat</h3>
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-slate-700 rounded-lg">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-slate-600 text-gray-200'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">Ask me anything! For example, "What should I do about my expenses?"</p>
          )}
        </div>
        {/* Chat Input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
            placeholder="Type your question (e.g., 'What should I do about my expenses?')"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>

      {/* Tips Section (Optional, can be removed since tips are now in chat) */}
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Life Tips</h3>
        <p className="text-gray-400">Ask me a question to get personalized tips!</p>
      </div>
    </div>
  );
}

export default AIPoweredAssistant;