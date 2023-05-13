import React, { useState, useEffect } from 'react';
import CreateNewExpense from './CreateNewExpense';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});
  const [editingIndex, setEditingIndex] = useState(-1);
  const [accountName, setAccountName] = useState('');


  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('refreshToken');
      const user = localStorage.getItem('user');
      const response = await axios.get(`http://localhost:5050/api/transactions`, {
        headers: { 'auth-token-refresh': token },
      });
      console.log(response.data.transactions);
      const transactions = response.data.transactions;
      const updatedTransactions = await Promise.all(transactions.map(async transaction => {
        const accountResponse = await axios.get(`http://localhost:5050/api/getAccount/${transaction.account}`, {
          headers: { 'auth-token-refresh': token },
        });
        const account = accountResponse.data.account;
        return {
          ...transaction,
          accountName: account.name
        };
      }));
      setExpenses(updatedTransactions);
    };

    fetchExpenses();
  }, []);

  const deleteTransaction = async (id) => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('refreshToken');

    // fetch the transaction data
    const responseGet = await axios.get(`http://localhost:5050/api/transactions/${id}`, {
      headers: { 'auth-token-refresh': token },
    });
    const transaction = responseGet.data;
    console.log(transaction);

    // Transaction is an object 
    let transactionAccount = transaction.transaction.account;

    // fetch the account data
    const responseGetAccount = await axios.get(`http://localhost:5050/api/getAccount/${transactionAccount}`, {
      headers: { 'auth-token-refresh': token },
    });
    const account = responseGetAccount.data;
    console.log("ACCOUNT " + account.account.balance);

    setAccountName(account.account.name);

    // create the updated account object
    let newBalance = account.account.balance + transaction.transaction.amount;

    console.log(account);

    // update the account
    const responsePut = await axios.put(`http://localhost:5050/api/updateAccountBalance/${transactionAccount}`, {
      balance: newBalance,
    }, {
      headers: { 'auth-token-refresh': token },
    }
    );
    console.log(responsePut.data);

    // delete the transaction
    const response = await axios.delete(`http://localhost:5050/api/transactions/${id}`, {
      headers: { 'auth-token-refresh': token },
    });
    setExpenses(expenses.filter((expense) => expense._id !== id));
  };

  const onExpenseAdded = (expense) => {
    setExpenses([...expenses, expense]);
  };

  return (
    <div>
      <CreateNewExpense onExpenseAdded={onExpenseAdded} />
      {expenses.length > 0 ? (
        <div>
          <table className="table-auto mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Categories</th>
                <th className="px-4 py-2 border">Accounts</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr key={expense._id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{expense.type}</td>
                  <td className="border px-4 py-2">${expense.amount.toFixed(2)}</td>
                  <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{expense.description}</td>
                  <td className="border px-4 py-2">{expense.categories.join(", ")}</td>
                  <td className="border px-4 py-2">{expense.accountName}</td>
                  <td>
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-4 rounded"
                      onClick={() => {
                        deleteTransaction(expense._id);
                      }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="table-auto mx-auto mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                expenses.reduce((acc, expense) => {
                  expense.categories.forEach((category) => {
                    acc[category] = (acc[category] || 0) + expense.amount;
                  });
                  return acc;
                }, {})
              ).map(([category, amount]) => (
                <tr key={category} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{category}</td>
                  <td className="border px-4 py-2">${amount.toFixed(2)}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
};


export default Expenses;
