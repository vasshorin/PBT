import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';


const CreateNewExpense = ({ onExpenseAdded, refreshToken }) => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [type, setType] = useState('expense');
  const [data, setData] = useState({
    categories: [],
    accounts: [],
    creditCards: [],
  });

  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    if (refreshToken) {
      const fetchData = async () => {
        try {
          const headers = {
            'auth-token-refresh': refreshToken,
          };

          const [categoriesResponse, accountsResponse, creditCardsResponse] = await Promise.all([
            axios.get('https://bninja.onrender.com/api/getCategories', { headers }),
            axios.get('https://bninja.onrender.com/api/getAccounts', { headers }),
            axios.get('https://bninja.onrender.com/api/getCreditCards', { headers }),
          ]);

          setData({
            categories: categoriesResponse.data.categories,
            accounts: accountsResponse.data.accounts,
            creditCards: creditCardsResponse.data.creditCards,
          });

          setDataFetched(true);
        } catch (error) {
          console.error(error);
        }
      };

      fetchData();
    }
  }, [refreshToken]);


  const calculateBalance = (account, type) => {
    if (account.type === 'credit') {
      const creditLimit = account.creditLimit;
      const balance = account.currentBalance;
      const availableCredit = account.availableCredit;

      let newBalance, newAvailableCredit, newUtilization;

      if (type === 'expense') {
        newAvailableCredit = availableCredit - Number(amount);
        newUtilization = ((creditLimit - newAvailableCredit) / creditLimit) * 100;
        newBalance = balance + Number(amount);
      } else {
        newAvailableCredit = availableCredit + Number(amount);
        newUtilization = ((creditLimit - newAvailableCredit) / creditLimit) * 100;
        newBalance = balance - Number(amount);
      }

      return {
        newBalance,
        newAvailableCredit,
        newUtilization,
        newCreditLimit: creditLimit,
      };
    } else {
      const balance = account.balance;
      const newBalance = type === 'expense' ? balance - amount : balance + Number(amount);
      return {
        newBalance,
      };
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const savedUser = localStorage.getItem('user');
    if (!refreshToken || !selectedAccount) {
      return;
    }

    const { newBalance, newAvailableCredit, newUtilization, newCreditLimit } = calculateBalance(
      selectedAccount,
      type
    );

    let res;
    let transactionType;
    const headers = { 'auth-token-refresh': refreshToken };

    if (selectedAccount.type === 'credit') {
      res = await axios.put(
        `https://bninja.onrender.com/api/updateCreditCardBalance/${selectedAccount._id}`,
        {
          balance: newBalance,
          availableCredit: newAvailableCredit,
          utilization: newUtilization,
        },
        { headers }
      );
      transactionType = 'credit';
    } else {
      res = await axios.put(
        `https://bninja.onrender.com/api/updateAccountBalance/${selectedAccount._id}`,
        { balance: newBalance },
        { headers }
      );
      transactionType = 'bank';
    }

    console.log(res);
    const userId = JSON.parse(savedUser)._id;
    let accountId = null;
    let creditCardId = null;
    if (selectedAccount.type === 'bank') {
      accountId = selectedAccount._id;
    } else if (selectedAccount.type === 'credit') {
      creditCardId = selectedAccount._id;
    }

    let categoryId = null;
    if (selectedCategory && selectedCategory._id) {
      categoryId = selectedCategory._id;
    }

    const utcDate = moment.utc(date).format('YYYY-MM-DD');

    const res2 = await axios.post(
      'https://bninja.onrender.com/api/newTransaction',
      {
        userId,
        type,
        amount,
        date: utcDate,
        description,
        categoryId,
        accountType: transactionType,
        accId: accountId,
        credId: creditCardId,
      },
      { headers }
    );

    onExpenseAdded(res2.data.transaction);
    console.log(res2);

    setDate('');
    setDescription('');
    setAmount('');
    setSelectedAccount(null);
    setSelectedCategory(null);
    setType('');
  };

  const { categories, accounts, creditCards } = data;

  return dataFetched ? (
   <form className="w-full max-w-full bg-white shadow-lg rounded pt-4 pb-8 mb-10 border-t border-gray-200" onSubmit={onSubmit}>
  <div className="flex flex-wrap justify-between">
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-4">
      <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="date">
        Date
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="date"
        type="date"
        placeholder="Enter date"
        value={date}
        required
        onChange={(e) => setDate(e.target.value)}
      />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-4">
      <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="type">
        Type
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="type"
        value={type}
        required
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">Expense type</option>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-4">
      <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="description">
        Description
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="description"
        type="text"
        placeholder="Enter description"
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-4">
      <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="amount">
        Amount
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="amount"
        type="number"
        step=".01"
        placeholder="Enter the amount"
        required
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-4">
      <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="categories">
        Categories
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="categories"
        required
        value={selectedCategory ? selectedCategory.name : ''}
        onChange={(e) => {
          const category = categories.find((category) => category.name === e.target.value);
          setSelectedCategory(category);
        }}
      >
        <option value="">Select a category</option>
        {Array.isArray(categories) &&
          categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
      </select>
    </div>
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-4">
      <label className="block text-gray-700 font-bold mb-2 ml-2" htmlFor="accounts">
        Accounts
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
        {Array.isArray(accounts) &&
          accounts.concat(creditCards).map((account) => (
            <option key={account._id} value={account.name}>
              {account.name}
            </option>
          ))}
      </select>
    </div>
    <div className="w-full flex justify-center">
      <button
        className="bg-custom-blue-color hover:bg-blue-700 text-white font-bold py-2 px-20 mt-8 ml-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Submit
      </button>
    </div>
  </div>
</form>
) : (
  <div>Loading...</div>
);


};

export default CreateNewExpense;
