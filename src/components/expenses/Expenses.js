import React, { useState, useEffect } from 'react';
import CreateNewExpense from './CreateNewExpense';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});
  const [editingIndex, setEditingIndex] = useState(-1);

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


  const onExpenseUpdated = (index, expense) => {
    const newExpenses = [...expenses];
    newExpenses[index] = expense;
    setExpenses(newExpenses);
    setEditingIndex(-1);
  };

  const onEditClicked = (index) => {
    setEditingIndex(index);
  };

  const onExpenseSaved = async (index) => {
    const token = localStorage.getItem('refreshToken');
    const expense = expenses[index];
    const response = await axios.put(`http://localhost:5050/api/transactions/${expense._id}`, expense, {
      headers: { 'auth-token-refresh': token },
    });
    const newExpenses = [...expenses];
    newExpenses[index] = expense;
    setExpenses(newExpenses);
    setEditingIndex(-1);
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
              <th className="px-4 py-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={expense._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">
  {editingIndex === index ? (
    <>
      <input
        type="text"
        value={expense.type}
        onChange={(e) => {
          const newExpense = { ...expense, type: e.target.value };
          onExpenseUpdated(index, newExpense);
        }}
      />
      <button onClick={() => onExpenseSaved(index)}>Save</button>
    </>
  ) : (
    expense.type
  )}
</td>

                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={expense.amount}
                      onChange={(e) => {
                        const newExpense = { ...expense, amount : e.target.value };
                        onExpenseUpdated(index, newExpense);
                      }}
                    />
                  ) : (
                    expense.amount
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <input

                      type="text"
                      value={expense.date}
                      onChange={(e) => {
                        const newExpense = { ...expense, date: e.target.value };
                        onExpenseUpdated(index, newExpense);
                      }}
                    />
                  ) : (
                    expense.date
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={expense.description}
                      onChange={(e) => {
                        const newExpense = { ...expense, description: e.target.value };
                        onExpenseUpdated(index, newExpense);
                      }}
                    />
                  ) : (
                    expense.description
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={expense.categories}  
                      onChange={(e) => {
                        const newExpense = { ...expense, categories: e.target.value };
                        onExpenseUpdated(index, newExpense);
                      }}
                    />
                  ) : (
                    expense.categories
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={expense.accounts}
                      onChange={(e) => {
                        const newExpense = { ...expense, accounts: e.target.value };  
                        onExpenseUpdated(index, newExpense);
                      }}
                    />
                  ) : (
                    expense.accounts
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <input

                      type="text"
                      value={expense.importance}
                      onChange={(e) => {
                        const newExpense = { ...expense, importance: e.target.value };
                        onExpenseUpdated(index, newExpense);
                      }}
                    />
                  ) : (
                    expense.importance
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingIndex === index ? (
                    <button

                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        const newExpense = { ...expense, editing: false };
                        onExpenseUpdated(index, newExpense);
                      }}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => {
                        onEditClicked(index);
                      }}
                    >
                      Edit
                    </button>
                  )}


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
