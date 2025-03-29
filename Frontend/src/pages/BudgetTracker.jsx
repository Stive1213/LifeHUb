import { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetTracker() {
  // Mock data for transactions
  const [transactions, setTransactions] = useState([
    {
      id: '1',
      type: 'Income',
      amount: 5000,
      category: 'Salary',
      date: '2025-03-01',
      description: 'Monthly salary',
    },
    {
      id: '2',
      type: 'Expense',
      amount: 1000,
      category: 'Food',
      date: '2025-03-15',
      description: 'Grocery shopping',
    },
    {
      id: '3',
      type: 'Expense',
      amount: 500,
      category: 'Transport',
      date: '2025-03-20',
      description: 'Taxi fare',
    },
  ]);

  // State for new transaction form
  const [newTransaction, setNewTransaction] = useState({
    type: 'Income',
    amount: '',
    category: '',
    date: '',
    description: '',
  });

  // Handle form input changes
  const handleTransactionChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  // Handle adding a new transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!newTransaction.amount || !newTransaction.category || !newTransaction.date) return;
    const transaction = {
      ...newTransaction,
      id: Date.now().toString(),
      amount: parseFloat(newTransaction.amount),
    };
    console.log('Transaction added:', transaction);
    setTransactions([...transactions, transaction]);
    setNewTransaction({ type: 'Income', amount: '', category: '', date: '', description: '' });
  };

  // Calculate summary
  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  // Calculate spending by category for the pie chart (only for expenses)
  const expenseCategories = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount);
      return acc;
    }, {});

  const pieChartData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  // Forecast (static for now)
  const forecast = netBalance > 0 ? `You’ll have ${netBalance} ETB by month-end.` : 'You’re overspending!';

  return (
    <div className="text-white">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">Budget Tracker</h2>

      {/* Input Form */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Add Transaction</h3>
        <form onSubmit={handleAddTransaction}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="transaction-type" className="block text-sm text-gray-400 mb-2">
                Type
              </label>
              <select
                id="transaction-type"
                name="type"
                value={newTransaction.type}
                onChange={handleTransactionChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              >
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
              </select>
            </div>
            <div>
              <label htmlFor="transaction-amount" className="block text-sm text-gray-400 mb-2">
                Amount (ETB)
              </label>
              <input
                type="number"
                id="transaction-amount"
                name="amount"
                value={newTransaction.amount}
                onChange={handleTransactionChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
                placeholder="Enter amount"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="transaction-category" className="block text-sm text-gray-400 mb-2">
                Category
              </label>
              <select
                id="transaction-category"
                name="category"
                value={newTransaction.category}
                onChange={handleTransactionChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              >
                <option value="">Select category</option>
                {newTransaction.type === 'Income' ? (
                  <>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other Income">Other Income</option>
                  </>
                ) : (
                  <>
                    <option value="Food">Food</option>
                    <option value="Transport">Transport</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Other Expense">Other Expense</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label htmlFor="transaction-date" className="block text-sm text-gray-400 mb-2">
                Date
              </label>
              <input
                type="date"
                id="transaction-date"
                name="date"
                value={newTransaction.date}
                onChange={handleTransactionChange}
                className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="transaction-description" className="block text-sm text-gray-400 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              id="transaction-description"
              name="description"
              value={newTransaction.description}
              onChange={handleTransactionChange}
              className="w-full p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:border-purple-500"
              placeholder="Enter description"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Add Transaction
          </button>
        </form>
      </div>

      {/* Spending Overview */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Spending Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold">Total Income</h4>
            <p className="text-2xl text-green-400">{totalIncome} ETB</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold">Total Expenses</h4>
            <p className="text-2xl text-red-400">{totalExpenses} ETB</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h4 className="text-lg font-bold">Net Balance</h4>
            <p className={`text-2xl ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netBalance} ETB
            </p>
          </div>
        </div>
        {Object.keys(expenseCategories).length > 0 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center">No expenses to display in the pie chart.</p>
        )}
      </div>

      {/* Forecast */}
      <div className="bg-slate-800 p-6 rounded-lg shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Forecast</h3>
        <p className="text-gray-400">{forecast}</p>
      </div>

      {/* Transaction List */}
      <div className="bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Type</th>
                <th className="text-left py-2">Amount</th>
                <th className="text-left py-2">Category</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t border-gray-700">
                  <td className="py-2">{transaction.date}</td>
                  <td className="py-2">
                    <span
                      className={
                        transaction.type === 'Income' ? 'text-green-400' : 'text-red-400'
                      }
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-2">{transaction.amount} ETB</td>
                  <td className="py-2">{transaction.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BudgetTracker;