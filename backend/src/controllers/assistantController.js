const { db } = require('../config/db');

const getAssistantResponse = (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'Question is required' });

  const lowerQuestion = question.toLowerCase();
  const userId = req.user.id;

  const sendResponse = (text, tips = []) => {
    res.json({ response: text, tips });
  };

  // Helper function to get current date parts
  const now = new Date();
  const today = now.toISOString().split('T')[0]; // e.g., "2025-04-08"
  const currentMonth = today.slice(0, 7); // e.g., "2025-04"

  // Tasks
  if (lowerQuestion.includes('task') || lowerQuestion.includes('what should i do')) {
    db.all('SELECT * FROM tasks WHERE user_id = ? AND deadline = ?', [userId, today], (err, tasks) => {
      if (err) return res.status(500).json({ error: err.message });
      const taskCount = tasks.length;
      const taskList = tasks.map(t => t.title).join(', ');
      const response = taskCount > 0 
        ? `You have ${taskCount} task(s) today: ${taskList}.`
        : "You have no tasks scheduled for today.";
      const tips = taskCount > 3 
        ? ['Prioritize your tasks by urgency to avoid overwhelm.', 'Break larger tasks into smaller steps.']
        : ['Add a new task to keep productive!', 'Review your goals to align your tasks.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Goals
  if (lowerQuestion.includes('goal')) {
    db.all('SELECT * FROM goals WHERE user_id = ?', [userId], (err, goals) => {
      if (err) return res.status(500).json({ error: err.message });
      const activeGoals = goals.filter(g => g.progress < 100);
      const response = activeGoals.length > 0 
        ? `You have ${activeGoals.length} active goal(s): ${activeGoals.map(g => g.title).join(', ')}.`
        : "You have no active goals right now.";
      const tips = activeGoals.length > 0 
        ? ['Focus on one goal at a time for better progress.', 'Set milestones to track your goals.']
        : ['Set a new goal to stay motivated!', 'Review past achievements for inspiration.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Transactions (Budget/Expenses)
  if (lowerQuestion.includes('expense') || lowerQuestion.includes('spending') || lowerQuestion.includes('budget')) {
    db.all('SELECT * FROM transactions WHERE user_id = ? AND type = "expense" AND date LIKE ?', [userId, `${currentMonth}%`], (err, transactions) => {
      if (err) return res.status(500).json({ error: err.message });
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const response = `You’ve spent $${totalSpent.toFixed(2)} this month.`;
      const tips = totalSpent > 500 // Arbitrary threshold; adjust as needed
        ? ['Consider reducing discretionary spending (e.g., dining out).', 'Set a monthly budget limit.']
        : ['Great job keeping expenses low!', 'Save extra funds for a future goal.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Events
  if (lowerQuestion.includes('event') || lowerQuestion.includes('calendar')) {
    db.all('SELECT * FROM events WHERE user_id = ? AND date = ?', [userId, today], (err, events) => {
      if (err) return res.status(500).json({ error: err.message });
      const eventCount = events.length;
      const eventList = events.map(e => e.title).join(', ');
      const response = eventCount > 0 
        ? `You have ${eventCount} event(s) today: ${eventList}.`
        : "You have no events scheduled for today.";
      const tips = eventCount > 2 
        ? ['Plan your day to avoid overlapping events.', 'Set reminders for each event.']
        : ['Schedule a relaxing activity today!', 'Invite friends to a new event.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Habits
  if (lowerQuestion.includes('habit')) {
    db.all('SELECT * FROM habits WHERE user_id = ?', [userId], (err, habits) => {
      if (err) return res.status(500).json({ error: err.message });
      const activeHabits = habits.filter(h => h.streak > 0);
      const response = activeHabits.length > 0 
        ? `You’re maintaining ${activeHabits.length} habit(s): ${activeHabits.map(h => h.name).join(', ')}.`
        : "You have no active habits right now.";
      const tips = activeHabits.length < 2 
        ? ['Start a new habit to build consistency.', 'Pair habits with existing routines.']
        : ['Keep up the good work on your habits!', 'Track your progress daily.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Journal
  if (lowerQuestion.includes('journal') || lowerQuestion.includes('mood')) {
    db.all('SELECT * FROM journal_entries WHERE user_id = ? AND date = ?', [userId, today], (err, entries) => {
      if (err) return res.status(500).json({ error: err.message });
      const response = entries.length > 0 
        ? `Your mood today was "${entries[0].mood}": ${entries[0].text}`
        : "You haven’t journaled today yet.";
      const tips = entries.length > 0 && entries[0].mood === 'sad' 
        ? ['Take a short walk to lift your mood.', 'Talk to a friend about your day.']
        : ['Write a quick journal entry now!', 'Reflect on something positive today.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Communities
  if (lowerQuestion.includes('community') || lowerQuestion.includes('social')) {
    db.all('SELECT c.* FROM communities c INNER JOIN subscriptions s ON c.id = s.community_id WHERE s.user_id = ?', [userId], (err, communities) => {
      if (err) return res.status(500).json({ error: err.message });
      const response = communities.length > 0 
        ? `You’re subscribed to ${communities.length} community(ies): ${communities.map(c => c.name).join(', ')}.`
        : "You’re not subscribed to any communities.";
      const tips = communities.length < 2 
        ? ['Join a community to connect with others!', 'Post in a community to engage.']
        : ['Share a helpful tip in your communities.', 'Check for new posts today.'];
      sendResponse(response, tips);
    });
    return;
  }

  // Default response
  sendResponse('I’m not sure how to answer that. Try asking about your tasks, expenses, or habits!', ['Set a small goal for today to stay motivated.']);
};

module.exports = { getAssistantResponse };