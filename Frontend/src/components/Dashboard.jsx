import { useState } from 'react';

function Dashboard() {
  const [widgets] = useState([
    { id: '1', type: 'stats', title: 'Tasks', value: '3 Tasks Today', change: '+2', link: 'Tasks & Goals' },
    { id: '2', type: 'stats', title: 'Budget', value: '500 ETB Spent', change: '-10%', link: 'Budget Tracker' },
    { id: '3', type: 'stats', title: 'Events', value: '2 Upcoming', change: '+1', link: 'Calendar' },
    { id: '4', type: 'stats', title: 'Habits', value: '5 Days Streak', change: '+1', link: 'Habits' },
    { id: '5', type: 'graph', title: 'Budget Overview', value: '5000 ETB', change: '+24.6%' },
    { id: '6', type: 'profit', title: 'Savings Goal', value: '3000 ETB', change: '+26.1%' },
    { id: '7', type: 'reports', title: 'Reports Overview' },
    { id: '8', type: 'orders', title: 'Recent Activity' },
  ]);

  const handleLinkClick = (link) => {
    console.log(`Navigating to ${link}...`);
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleCreateReport = () => {
    console.log('Creating report...');
  };

  return (
    <div className="text-white">
      {/* Welcome Message */}
      <div className="mb-6"> 
        <h2 className="text-2xl font-bold  text-gray-400">Welcome back, John!</h2>
        <p className="text-sm text-gray-400">Manage your tasks, budget, and more</p>
      </div>

      {/* Top Widgets: Tasks, Budget, Events, Habits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {widgets
          .filter((widget) => widget.type === 'stats')
          .map((widget) => (
            <div key={widget.id} className="widget-card bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-400">{widget.title}</p>
              <h3 className="text-2xl font-bold">{widget.value}</h3>
              <p className={`text-sm ${widget.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {widget.change}
              </p>
              <button
                onClick={() => handleLinkClick(widget.link)}
                className="text-sm text-purple-400 hover:text-purple-300 mt-2"
              >
                View Details
              </button>
            </div>
          ))}
      </div>

      {/* Middle Section: Budget Overview and Savings Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Budget Overview */}
        {widgets
          .filter((widget) => widget.type === 'graph')
          .map((widget) => (
            <div key={widget.id} className="widget-card bg-slate-800 p-4 rounded-lg shadow col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-gray-400">{widget.title}</p>
                  <h3 className="text-2xl font-bold">{widget.value}</h3>
                  <p className="text-sm text-green-400">{widget.change}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm text-purple-400">Income</button>
                  <button className="text-sm text-blue-400">Expenses</button>
                </div>
              </div>
              <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Graph Placeholder (Income/Expenses)</p>
              </div>
            </div>
          ))}

        {/* Savings Goal */}
        {widgets
          .filter((widget) => widget.type === 'profit')
          .map((widget) => (
            <div key={widget.id} className="widget-card bg-slate-800 p-4 rounded-lg shadow">
              <p className="text-sm text-gray-400">{widget.title}</p>
              <h3 className="text-2xl font-bold">{widget.value}</h3>
              <p className="text-sm text-green-400">{widget.change}</p>
              <div className="h-48 bg-gray-700 rounded-lg mt-4 flex items-center justify-center">
                <p className="text-gray-400">Graph Placeholder (Savings)</p>
              </div>
            </div>
          ))}
      </div>

      {/* Bottom Section: Reports Overview and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Reports Overview */}
        {widgets
          .filter((widget) => widget.type === 'reports')
          .map((widget) => (
            <div key={widget.id} className="widget-card bg-slate-800 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{widget.title}</h3>
                <div className="flex space-x-2">
                  <button className="text-sm text-gray-400">Select date</button>
                  <button onClick={handleExport} className="text-sm text-purple-400">
                    Export data
                  </button>
                  <button onClick={handleCreateReport} className="text-sm bg-purple-500 text-white px-3 py-1 rounded-lg">
                    Create report
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-400">Habit Progress</p>
                <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Gauge Placeholder (Habit Progress)</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Social Engagement</p>
                <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">Map Placeholder (Engagement)</p>
                </div>
              </div>
            </div>
          ))}

        {/* Recent Activity */}
        {widgets
          .filter((widget) => widget.type === 'orders')
          .map((widget) => (
            <div key={widget.id} className="widget-card bg-slate-800 p-4 rounded-lg shadow col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{widget.title}</h3>
                <button className="text-sm text-gray-400">Jan 2024</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="text-left py-2">Activity</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-700">
                      <td className="py-2">Completed Task</td>
                      <td className="py-2">Dec 30, 10:00 AM</td>
                      <td className="py-2 text-green-400">Done</td>
                      <td className="py-2">$329.40</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-2">Added Expense</td>
                      <td className="py-2">Dec 29, 12:30 AM</td>
                      <td className="py-2 text-yellow-400">Pending</td>
                      <td className="py-2">$177.24</td>
                    </tr>
                    <tr className="border-t border-gray-700">
                      <td className="py-2">Scheduled Event</td>
                      <td className="py-2">Dec 25, 12:32 PM</td>
                      <td className="py-2 text-yellow-400">Pending</td>
                      <td className="py-2">$52.16</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;