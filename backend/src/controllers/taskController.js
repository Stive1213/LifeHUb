const { db } = require('../config/db');

const getTasks = (req, res) => {
  db.all('SELECT * FROM tasks WHERE user_id = ?', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const tasks = rows.map((task) => ({
      ...task,
      subtasks: JSON.parse(task.subtasks || '[]'),
      isDone: !!task.isDone,
    }));
    res.json(tasks);
  });
};

const createTask = (req, res) => {
  const { title, deadline, category, subtasks } = req.body;
  const subtasksJson = JSON.stringify(subtasks || []);
  db.run(
    'INSERT INTO tasks (user_id, title, deadline, category, subtasks, isDone) VALUES (?, ?, ?, ?, ?, 0)',
    [req.user.id, title, deadline, category, subtasksJson],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run('UPDATE user_points SET points = points + 10 WHERE user_id = ?', [req.user.id]);
      res.status(201).json({ id: this.lastID, title, deadline, category, subtasks, isDone: false });
    }
  );
};

const updateTask = (req, res) => {
  const { isDone } = req.body;
  db.run(
    'UPDATE tasks SET isDone = ? WHERE id = ? AND user_id = ?',
    [isDone ? 1 : 0, req.params.id, req.user.id],
    function (err) {
      if (err || this.changes === 0) return res.status(404).json({ error: 'Task not found' });
      if (isDone) {
        db.run('UPDATE user_points SET points = points + 20 WHERE user_id = ?', [req.user.id]);
      }
      res.json({ message: 'Task updated' });
    }
  );
};

module.exports = { getTasks, createTask, updateTask };