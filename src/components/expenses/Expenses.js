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

  const deleteTransaction = async (id) => {
    const token = localStorage.getItem('refreshToken');
    const response = await axios.delete(`http://localhost:5050/api/transactions/${id}`, {
      headers: { 'auth-token-refresh': token },
    });
    setExpenses(expenses.filter((expense) => expense._id !== id));
  };

  const onExpenseAdded = (expense) => {
    setExpenses([...expenses, expense]);
  };
  


  const onLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setAccessToken('');
    setUser({});
  };

  return (
    <div>
      <CreateNewExpense onExpenseAdded={onExpenseAdded} />
      {expenses.length > 0 ? (
        <table className="table-auto mx-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Amount</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Categories</th>
            <th className="px-4 py-2 border">Accounts</th>
            <th className="px-4 py-2 border">Importance</th>
          </tr>
        </thead>
        <tbody>
  {expenses.map((expense) => (
    <tr key={expense._id} className="hover:bg-gray-100">
      <td className="border px-4 py-2">{expense.type}</td>
      <td className="border px-4 py-2">${expense.amount.toFixed(2)}</td>
      <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
      <td className="border px-4 py-2">{expense.description}</td>
      <td className="border px-4 py-2">{expense.categories.join(", ")}</td>
      <td className="border px-4 py-2">{expense.accounts}</td>
      <td className="border px-4 py-2">{expense.importance}</td>
      <td className="border px-4 py-2">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            deleteTransaction(expense._id);
          }}
        >
          Delete
        </button>
      </td>
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
