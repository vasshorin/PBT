import React, { useState, useEffect } from 'react';
import CreateNewExpense from './CreateNewExpense';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:5050/expenses');
      setExpenses(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
        <h1>Add expense</h1>
        <CreateNewExpense />
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Comment</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Account</th>
            <th className="px-4 py-2">Importance</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td className="border px-4 py-2">{expense.date}</td>
              <td className="border px-4 py-2">{expense.comment}</td>
              <td className="border px-4 py-2">{expense.amount}</td>
              <td className="border px-4 py-2">{expense.category}</td>
              <td className="border px-4 py-2">{expense.account}</td>
              <td className="border px-4 py-2">{expense.importance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
