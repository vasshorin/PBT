import React, { useState, useEffect } from 'react';
import CreateNewExpense from './CreateNewExpense';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('refreshToken');
      const user = localStorage.getItem('user');
      const response = await axios.get(`http://localhost:5050/api/transactions`, {
        headers: { 'auth-token-refresh': token },
      });
      setExpenses(response.data.transactions);
    };
    fetchExpenses();
  }, []);

  const onLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken('');
    setUser({});
  };

  return (
    <div>
      <CreateNewExpense />
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      {expenses.length > 0 ? (
        <table className="table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Categories</th>
              <th className="px-4 py-2">Accounts</th>
              <th className="px-4 py-2">Importance</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                <td className="border px-4 py-2">{expense.type}</td>
                <td className="border px-4 py-2">{expense.amount}</td>
                <td className="border px-4 py-2">{expense.date}</td>
                <td className="border px-4 py-2">{expense.description}</td>
                <td className="border px-4 py-2">{expense.categories}</td>
                <td className="border px-4 py-2">{expense.accounts}</td>
                <td className="border px-4 py-2">{expense.importance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses found.</p>
      )}

      {/* Add logout */}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={(onLogout) => {
          localStorage.removeItem('user');
          localStorage.removeItem('refreshToken');
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Expenses;
