import { useState } from 'react';

function AIPoweredAssistant() {
  // State for chat conversation
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Mock static tips
  const staticTips = [
    'Based on your budget, try reducing dining out expenses.',
    'Set a daily goal to drink 8 glasses of water.',
    'Take a 5-minute break every hour to boost productivity.',
  ];

  // Mock AI response logic
  const getAssistantResponse = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('overspending') || lowerInput.includes('budget')) {
      return 'Try cutting back on transport or dining out.';
    } else if (lowerInput.includes('productivity') || lowerInput.includes('time')) {
      return 'Consider using the Pomodoro technique to manage your time better.';
    } else {
      return 'I’m not sure about that, but here’s a tip: Set small, achievable goals to stay motivated!';
    }
  };

  // Handle user input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to conversation
    const userMessage = { sender: 'user', text: userInput };
    setMessages([...messages, userMessage]);

    // Simulate assistant response
    const assistantResponse = getAssistantResponse(userInput);
    setMessages((prev) => [...prev, { sender: 'assistant', text: assistantResponse }]);

    // Clear input
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
            <p className="text-gray-400">Ask me anything! For example, "Am I overspending?"</p>
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
            placeholder="Type your question (e.g., 'Am I overspending?')"
          />
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Send
          </button>
        </form>
      </div>

      {/* Tips Section */}
      <div className="w-80 bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Life Tips</h3>
        {staticTips.length > 0 ? (
          <ul className="space-y-4">
            {staticTips.map((tip, index) => (
              <li key={index} className="bg-slate-700 p-4 rounded-lg">
                <p>{tip}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No tips available.</p>
        )}
      </div>
    </div>
  );
}

export default AIPoweredAssistant;
