import { useState } from 'react';

function TasksGoals() {
  // Mock data for tasks
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Finish project proposal',
      deadline: '2025-03-28',
      category: 'Work',
      subtasks: ['Draft outline', 'Review with team'],
      isDone: false,
    },
    {
      id: '2',
      title: 'Buy groceries',
      deadline: '2025-03-27',
      category: 'Home',
      subtasks: ['Make list', 'Visit store'],
      isDone: false,
    },
  ]);

  // State for new task form
  const [newTask, setNewTask] = useState({
    title: '',
    deadline: '',
    category: 'Work',
    subtasks: [],
  });
  const [newSubtask, setNewSubtask] = useState('');
  const [filter, setFilter] = useState('All');

  // Mock data for goals
  const [goals, setGoals] = useState([
    {
      id: '1',
      title: 'Save for vacation',
      target: 'Save 5,000 ETB',
      deadline: '2025-12-31',
      progress: 20,
    },
    {
      id: '2',
      title: 'Run a marathon',
      target: 'Train 5 days/week',
      deadline: '2025-11-30',
      progress: 50,
    },
  ]);

  // State for new goal form
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: '',
    progress: 0,
  });
  const [editingGoal, setEditingGoal] = useState(null);

  // Handle Task Form
  const handleTaskChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setNewTask({ ...newTask, subtasks: [...newTask.subtasks, newSubtask] });
      setNewSubtask('');
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    const task = { ...newTask, id: Date.now().toString(), isDone: false };
    console.log('Task added:', task);
    setTasks([...tasks, task]);
    setNewTask({ title: '', deadline: '', category: 'Work', subtasks: [] });
  };

  const toggleTaskDone = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, isDone: !task.isDone } : task)));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const today = new Date('2025-03-28'); // Current date
    const deadline = new Date(task.deadline);
    if (filter === 'Due Today') {
      return deadline.toDateString() === today.toDateString();
    } else if (filter === 'Overdue') {
      return deadline < today && !task.isDone;
    }
    return true; // All
  });

  // Handle Goal Form
  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    if (editingGoal) {
      setEditingGoal({ ...editingGoal, [name]: value });
    } else {
      setNewGoal({ ...newGoal, [name]: value });
    }
  };

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return;
    const goal = { ...newGoal, id: Date.now().toString(), progress: parseInt(newGoal.progress) || 0 };
    console.log('Goal added:', goal);
    setGoals([...goals, goal]);
    setNewGoal({ title: '', target: '', deadline: '', progress: 0 });
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
  };

  const handleUpdateGoal = (e) => {
    e.preventDefault();
    if (!editingGoal.title || !editingGoal.target || !editingGoal.deadline) return;
    console.log('Goal updated:', editingGoal);
    setGoals(
      goals.map((goal) =>
        goal.id === editingGoal.id ? { ...editingGoal, progress: parseInt(editingGoal.progress) } : goal
      )
    );
    setEditingGoal(null);
  };

  return (
    <div className="text-white">
      <h2 className="text-2xl text-gray-400 font-bold mb-6">Tasks & Goals</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Tasks</h3>
          <form onSubmit={handleAddTask} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="task-title" className="block text-sm text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="task-title"
                  name="title"
                  value={newTask.title}
                  onChange={handleTaskChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label htmlFor="task-deadline" className="block text-sm text-gray-400 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  id="task-deadline"
                  name="deadline"
                  value={newTask.deadline}
                  onChange={handleTaskChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="task-category" className="block text-sm text-gray-400 mb-2">
                Category
              </label>
              <select
                id="task-category"
                name="category"
                value={newTask.category}
                onChange={handleTaskChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              >
                <option value="Work">Work</option>
                <option value="Home">Home</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Subtasks</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  className="flex-1 p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="Add a subtask"
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                >
                  Add
                </button>
              </div>
              <ul className="mt-2">
                {newTask.subtasks.map((subtask, index) => (
                  <li key={index} className="text-sm text-gray-400">
                    - {subtask}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Task
            </button>
          </form>
          <div className="flex space-x-2 mb-4">
            {['All', 'Due Today', 'Overdue'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg ${
                  filter === f ? 'bg-purple-500' : 'bg-slate-700'
                } hover:bg-purple-600 transition-colors`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left py-2">Title</th>
                  <th className="text-left py-2">Deadline</th>
                  <th className="text-left py-2">Category</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-t border-gray-700">
                    <td className="py-2">
                      <div>
                        <p>{task.title}</p>
                        {task.subtasks.length > 0 && (
                          <ul className="text-xs text-gray-400">
                            {task.subtasks.map((subtask, index) => (
                              <li key={index}>- {subtask}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>
                    <td className="py-2">{task.deadline}</td>
                    <td className="py-2">{task.category}</td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={task.isDone}
                        onChange={() => toggleTaskDone(task.id)}
                        className="accent-purple-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Goal Section */}
        <div className="bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Goals</h3>
          <form onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="goal-title" className="block text-sm text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="goal-title"
                  name="title"
                  value={editingGoal ? editingGoal.title : newGoal.title}
                  onChange={handleGoalChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="Enter goal title"
                />
              </div>
              <div>
                <label htmlFor="goal-target" className="block text-sm text-gray-400 mb-2">
                  Target
                </label>
                <input
                  type="text"
                  id="goal-target"
                  name="target"
                  value={editingGoal ? editingGoal.target : newGoal.target}
                  onChange={handleGoalChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="e.g., Save 5,000 ETB"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="goal-deadline" className="block text-sm text-gray-400 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  id="goal-deadline"
                  name="deadline"
                  value={editingGoal ? editingGoal.deadline : newGoal.deadline}
                  onChange={handleGoalChange}
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label htmlFor="goal-progress" className="block text-sm text-gray-400 mb-2">
                  Progress (%)
                </label>
                <input
                  type="number"
                  id="goal-progress"
                  name="progress"
                  value={editingGoal ? editingGoal.progress : newGoal.progress}
                  onChange={handleGoalChange}
                  min="0"
                  max="100"
                  className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                  placeholder="0-100"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              {editingGoal ? 'Update Goal' : 'Add Goal'}
            </button>
            {editingGoal && (
              <button
                type="button"
                onClick={() => setEditingGoal(null)}
                className="w-full bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-600 transition-colors mt-2"
              >
                Cancel
              </button>
            )}
          </form>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold">{goal.title}</h4>
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-sm text-gray-400">{goal.target}</p>
                <p className="text-sm text-gray-400">Deadline: {goal.deadline}</p>
                <div className="mt-2">
                  <div className="w-full bg-slate-600 rounded-full h-2.5">
                    <div
                      className="bg-purple-500 h-2.5 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{goal.progress}% Complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TasksGoals;