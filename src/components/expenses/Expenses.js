import React, { useState, useEffect } from 'react';
import CreateNewExpense from './CreateNewExpense';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [availableCredit, setAvailableCredit] = useState(0);
  const [utilization, setUtilization] = useState(0);


  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('refreshToken');
      const response = await axios.get(`http://localhost:5050/api/transactions`, {
        headers: { 'auth-token-refresh': token },
      });
      const transactions = response.data.transactions;
  
      const updatedTransactions = await Promise.all(transactions.map(async transaction => {
        let accountData = {};
  
        if (transaction.accountType === "bank") {
          const responseGetAccount = await axios.get(`http://localhost:5050/api/getAccount/${transaction.account}`, {
            headers: { 'auth-token-refresh': token },
          });
          const account = responseGetAccount.data.account;
          accountData = { accountName: account.name, accountBalance: account.balance };
        } else if (transaction.accountType === "credit") {
          const responseGetCreditCard = await axios.get(`http://localhost:5050/api/getCreditCard/${transaction.credit}`, {
            headers: { 'auth-token-refresh': token },
          });
          const creditCard = responseGetCreditCard.data.creditCard;
          accountData = { accountName: creditCard.name, accountBalance: creditCard.currentBalance, availableCredit: creditCard.availableCredit, utilization: creditCard.utilization };
        }
  
        return { ...transaction, ...accountData };
      }));
  
      setExpenses(updatedTransactions);
    };
  
    fetchExpenses();
  }, []);
  
  const deleteTransaction = async (id) => {
    try {
      const [savedUser, token] = [localStorage.getItem('user'), localStorage.getItem('refreshToken')];
      const { data: transaction } = await axios.get(`http://localhost:5050/api/transactions/${id}`, {
        headers: { 'auth-token-refresh': token },
      });
      console.log(transaction);
  
      const transactionAccountType = transaction.transaction.accountType;
      const transactionAccount = transactionAccountType === 'bank' ? transaction.transaction.account : transaction.transaction.credit;
      console.log(transactionAccount);
  
      const { data: account } = await axios.get(`http://localhost:5050/api/get${transactionAccountType === 'bank' ? 'Account' : 'CreditCard'}/${transactionAccount}`, {
        headers: { 'auth-token-refresh': token },
      });
      console.log(account);
  
      const accountBalance = transactionAccountType === 'bank' ? account.account.balance : account.creditCard.currentBalance;
      const accountName = transactionAccountType === 'bank' ? account.account.name : account.creditCard.name;
  
      let newBalance = accountBalance;
      const transactionType = transaction.transaction.type;
  
      if (transactionAccountType === 'bank') {
        newBalance = transactionType === 'expense' ? accountBalance + transaction.transaction.amount : accountBalance - transaction.transaction.amount;
      } else if (transactionAccountType === 'credit') {
        newBalance = transactionType === 'expense' ? accountBalance - transaction.transaction.amount : accountBalance + transaction.transaction.amount;
      }

  
      let newAvailableCredit, newUtilization;
  
      if (transactionAccountType === 'credit') {
        newAvailableCredit = transactionType === 'expense' ? account.creditCard.availableCredit + transaction.transaction.amount : account.creditCard.availableCredit - transaction.transaction.amount;
        newUtilization = (newBalance / account.creditCard.creditLimit) * 100;
      }
  
      const endpoint = transactionAccountType === 'bank' ? `http://localhost:5050/api/updateAccountBalance/${transactionAccount}` : `http://localhost:5050/api/updateCreditCardBalance/${transactionAccount}`;
  
      const responsePut = await axios.put(endpoint, transactionAccountType === 'bank' ? { balance: newBalance } : { balance: newBalance, availableCredit: newAvailableCredit, utilization: newUtilization }, {
        headers: { 'auth-token-refresh': token },
      });
  
      const responseDelete = await axios.delete(`http://localhost:5050/api/transactions/${id}`, {
        headers: { 'auth-token-refresh': token },
      });
  
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  
  
  const onExpenseAdded = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };
  
  return (
    <div>
      <CreateNewExpense onExpenseAdded={onExpenseAdded} />
      {expenses.length > 0 ? (
        <div className="flex flex-row justify-center">
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
