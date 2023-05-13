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
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('refreshToken');
  
    try {
      // fetch the transaction data
      const responseGet = await axios.get(`http://localhost:5050/api/transactions/${id}`, {
        headers: { 'auth-token-refresh': token },
      });
      const transaction = responseGet.data;
      console.log(transaction);
  
      // Transaction is an object 
      let transactionAccount;
      let transactionAccountType = transaction.transaction.accountType;
      if (transactionAccountType === 'bank') {
        transactionAccount = transaction.transaction.account;
      } else if (transactionAccountType === 'credit') {
        transactionAccount = transaction.transaction.credit;
      }
      console.log(transactionAccount);
      // fetch the account data
      const responseGetAccount = await axios.get(`http://localhost:5050/api/get${transactionAccountType === 'bank' ? 'Account' : 'CreditCard'}/${transactionAccount}`, {
        headers: { 'auth-token-refresh': token },
      });
      const account = responseGetAccount.data;
      console.log(account);
  
      let newBalance = 0;
      let accountBalance;
      let accountName;
      
  
      if(transactionAccountType === 'bank') {
        accountBalance = account.account.balance;
        accountName = account.account.name;
      } else if (transactionAccountType === 'credit') {
        accountBalance = account.creditCard.currentBalance;
        accountName = account.creditCard.name;
      }
      console.log(transactionAccountType); // credit
      console.log(accountBalance); //1150
      console.log(transaction.transaction.amount); // 150

      let transactionType = transaction.transaction.type;

      // create the updated account object
      if(transactionAccountType === 'bank') {
        if (transactionType === 'expense') {
          newBalance = accountBalance + transaction.transaction.amount;
        }
        else if (transactionType === 'income') {
          newBalance = accountBalance - transaction.transaction.amount;
        }
      } else if (transactionAccountType === 'credit') {
        if (transactionType === 'expense') {
          newBalance = accountBalance - transaction.transaction.amount;
        }
        else if (transactionType === 'income') {
          newBalance = accountBalance + transaction.transaction.amount;
        }
      } else {
        newBalance = accountBalance; // set a default value
      }
  

      let newAvailableCredit;
      let newUtilization;
      if(transactionAccountType === 'credit') {
        if(transactionType === 'expense') {
          newAvailableCredit = account.creditCard.availableCredit + transaction.transaction.amount;
          newUtilization = (newBalance / account.creditCard.creditLimit) * 100;
        } else if (transactionType === 'income') {
          newAvailableCredit = account.creditCard.availableCredit - transaction.transaction.amount;
          newUtilization = (newBalance / account.creditCard.creditLimit) * 100;
        }
        console.log("New available credit " + newAvailableCredit);
        console.log("New utilization " + newUtilization);
      }
      
      // update the account
      if(transactionAccountType === 'bank') {
        const responsePut = await axios.put(`http://localhost:5050/api/updateAccountBalance/${transactionAccount}`, { 
          balance: newBalance,
        }, {
          headers: { 'auth-token-refresh': token },
        });
      } else if (transactionAccountType === 'credit') {
        const responsePut = await axios.put(`http://localhost:5050/api/updateCreditCardBalance/${transactionAccount}`, {
          balance: newBalance,
          availableCredit: newAvailableCredit,
          utilization: newUtilization,
        }, {
          headers: { 'auth-token-refresh': token },
        });
      }
  
      // delete the transaction
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
