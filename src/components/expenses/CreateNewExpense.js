import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateNewExpense = ({ onExpenseAdded }) => {
  const [date, setDate] = useState('');
  const [description, setdescription] = useState('');
  const [amount, setAmount] = useState('');
  const [categories, setcategories] = useState('');
  const [accounts, setaccounts] = useState('');
  const [creditCards, setcreditCards] = useState('');
  const [account, setaccount] = useState('');
  const [balance, setbalance] = useState('');
  const [type, settype] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);


  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRefreshToken = localStorage.getItem('refreshToken');
    if (savedUser && savedRefreshToken) {
      setRefreshToken(savedRefreshToken);
    }
  }, []);

  useEffect(() => {
    const handleGetAccounts = async () => {
      const res = await axios.get('http://localhost:5050/api/getAccounts', {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
      console.log(res.data.accounts);
      setaccounts(res.data.accounts);
    };
  
    const handleGetCategories = async () => {
      const res = await axios.get('http://localhost:5050/api/getCategories', {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
      console.log(res.data.categories);
      setcategories(res.data.categories);
    };
  
    const handleGetCreditCards = async () => {
      const res = await axios.get('http://localhost:5050/api/getCreditCards', {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
      console.log(res.data.creditCards);
      setcreditCards(res.data.creditCards);
    };
  
    handleGetCategories();
    handleGetAccounts();
    handleGetCreditCards();
  }, [refreshToken]);
  

  const onSubmit = async (e) => {
    e.preventDefault();
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      // handle user not logged in
      return;
    }
    if (!selectedAccount) {
      // handle no account selected
      return;
    }
  
    let newBalance;
    let newCreditLimit;
    let newAvailableCredit;
    let newUtilization;
  
    if (selectedAccount.type === 'credit') {
      const creditLimit = selectedAccount.creditLimit;
      const balance = selectedAccount.currentBalance;
      const availableCredit = selectedAccount.availableCredit;
      const utilization = selectedAccount.utilization;
      if (type === 'expense') {
        newAvailableCredit = availableCredit - Number(amount);
        newUtilization = ((creditLimit - newAvailableCredit) / creditLimit) * 100;
        newBalance = balance + Number(amount);
      } else {
        newAvailableCredit = availableCredit + Number(amount);
        newUtilization = ((creditLimit - newAvailableCredit) / creditLimit) * 100;
        newBalance = balance - Number(amount);
      }
      newCreditLimit = creditLimit;
    } else {
      const balance = selectedAccount.balance;
      newBalance = type === 'expense' ? balance - amount : balance + Number(amount);
    }
  
    let res;
    let transactionType;
    if (selectedAccount.type === 'credit') {
      res = await axios.put(`http://localhost:5050/api/updateCreditCardBalance/${selectedAccount._id}`, {
        balance: newBalance,
        availableCredit: newAvailableCredit,
        utilization: newUtilization,
      }, {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
    } else {
      res = await axios.put(`http://localhost:5050/api/updateAccountBalance/${selectedAccount._id}`, {
        balance: newBalance,
      }, {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
    }
  
    // get the response from the server
    console.log(res);
    const userId = JSON.parse(savedUser)._id;
    let accountId = null;
    let creditCardId = null;
  
    if (selectedAccount.type === 'bank') {
      accountId = selectedAccount._id;
      transactionType = 'bank';
    } else if (selectedAccount.type === 'credit') {
      creditCardId = selectedAccount._id;
      transactionType = 'credit';
    }
  
    const res2 = await axios.post('http://localhost:5050/api/newTransaction', {
      userId: userId,
      type: type,
      amount: amount,
      date: date,
      description: description,
      categories: selectedCategory,
      accountType: transactionType,
      accId: accountId,
      credId: creditCardId,
    });
  
    onExpenseAdded(res2.data.transaction);
  
    // get the response from the server
    console.log(res2);
    // clear the form
    setDate('');
    setdescription('');
    setAmount('');
    setSelectedAccount(null);
    setSelectedCategory(null);
    settype('');
    window.location.reload();
  };
  

  return (
    <div className="flex justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
        <div className="flex flex-wrap justify-end">
          <div className="w-full md:w-1/6 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="type">
              type
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="type"
              value={type}
              onChange={(e) => settype(e.target.value)}
            >
              <option value="">Select an type level</option>
              <option value="expense">expense</option>
              <option value="income">income</option>
            </select>
          </div>
          <div className="w-full md:w-1/6 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              placeholder="Enter the date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/6 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
              description
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              type="text"
              placeholder="Enter a description"
              value={description}
              onChange={(e) => setdescription(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/6 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              type="number"
              step=".01"
              placeholder="Enter the amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/6 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="categories">
              categories
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {Array.isArray(categories) && categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-1/6 mb-4 md:mb-0">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="accounts">
              accounts
            </label>
            <select
  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
  id="accounts"
  value={selectedAccount ? selectedAccount.name : ''}
  onChange={(e) => {
    const account = accounts.concat(creditCards).find((account) => account.name === e.target.value);
    setSelectedAccount(account);
  }}
>
  <option value="">Select an account</option>
  {Array.isArray(accounts) && accounts.concat(creditCards).map((account) => (
    <option
      key={account._id}
      value={account.name}
    >
      {account.name}
    </option>
  ))}
</select>

          </div>
          <div className="w-full md:w-1/6 mb-4 md:mb-0 flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>



  );
};

export default CreateNewExpense;
