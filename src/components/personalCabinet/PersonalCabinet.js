import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PersonalCabinet = () => {
  const [categoryName, setcategoryName] = useState('');
  const [newAccount, setNewAccount] = useState('');
  const [accountTypes, setAccountTypes] = useState(['Bank account', 'Credit card']);
  const [accountType, setAccountType] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [accountDescription, setAccountDescription] = useState('');
  const [categories, setCategories] = useState(['Food', 'Transportation', 'Utilities']);
  const [accounts, setAccounts] = useState(['Bank account', 'Credit card']);
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [user, setUser] = useState({});
  

  useEffect(() => {
    const savedRefreshToken = localStorage.getItem('refreshToken');
    const savedAccessToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');
    if (savedRefreshToken && savedUser && savedAccessToken) {
      setRefreshToken(savedRefreshToken);
      setAccessToken(savedAccessToken);
      setUser(JSON.parse(savedUser));
      console.log('token', savedRefreshToken);
    }
  }, []);
  
// Add account to the list of accounts from the user db that's the same as the user that's logged in
// The accoint model is: {type: String, name: String, balance: Number, description: String}
  const handleAddAccount = async () => {
    const res = await axios.post('http://localhost:5050/api/newAccount', {
      type: accountType,
      name: accountName,
      balance: accountBalance,
      description: accountDescription,
    }, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setAccounts([...accounts, newAccount]);
    setNewAccount('');
  };


  // Get the list of accounts from the user db that's the same as the user that's logged in
  useEffect(() => {
  const handleGetAccounts = async () => {
    const res = await axios.get('http://localhost:5050/api/getAccounts', {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setAccounts(res.data.accounts);
  };

  const handleGetCategories = async () => {
    const res = await axios.get('http://localhost:5050/api/getCategories', {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setCategories(res.data.categories);
  };

  handleGetCategories();
  handleGetAccounts();
  }, [refreshToken]);
  

  const handleRemoveAccount = async (accountId) => {
    const res = await axios.delete(`http://localhost:5050/api/deleteAccount/${accountId}`, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setAccounts(accounts.filter((account) => account._id !== accountId));
  };

  const handleUpdateAccount = async (accountId) => {
    const res = await axios.put(`http://localhost:5050/api/updateAccount/${accountId}`, {
      type: accountType,
      name: accountName,
      balance: accountBalance,
      description: accountDescription,
    }, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setAccounts(accounts.map((account) => {
      if (account._id === accountId) {
        return res.data;
      }
      return account;
    }));
  };


// Add category to the list of categories from the user db that's the same as the user that's logged in
// The category model is: {name: String}
  const handleAddCategory = async () => {
    const res = await axios.post('http://localhost:5050/api/newCategory', {
      name: categoryName,
    }, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setCategories([...categories, categoryName]);
    setcategoryName('');
  };
  
  // Remove category from the list of categories from the user db that's the same as the user that's logged in
  const handleRemoveCategory = async (categoryName) => {
    const res = await axios.delete(`http://localhost:5050/api/deleteCategory/${categoryName}`, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setCategories(categories.filter((cat) => cat !== categoryName));

  };


  // Logout the user
  const handleLogout = () => {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setRefreshToken('');
    setAccessToken('');
    setUser({});
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Personal Cabinet</h1>
      <div className="flex flex-col md:flex-row mb-8">
        <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-4">Categories</h2>
          <div className="flex flex-col md:flex-row mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter a new category"
              value={categoryName}
              onChange={(e) => setcategoryName(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
              onClick={handleAddCategory}
            >
              Add
            </button>
          </div>
          <ul>
            {categories.map((category) => (
              <li key={category} className="flex justify-between items-center mb-2">
                <span>{category}</span>
                <button

                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleRemoveCategory(category)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col md:ml-4">
          <h2 className="text-xl font-bold mb-4">Accounts</h2>
          <div className="flex flex-col md:flex-row mb-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Enter the account name"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
            <input 
            // Enter the balance of the new account
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
              type="text"
              placeholder="Enter the balance"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
            />
            <input
            // Enter the description of the new account
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
              type="text"
              placeholder="Enter the description"
              value={accountDescription}
              onChange={(e) => setAccountDescription(e.target.value)}
            />
            <input
            // Enter the new account type
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
              type="text"
              placeholder="Enter the account type"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
              onClick={handleAddAccount}
            >
              Add
            </button>
          </div>
          <ul>
  {accounts.map((account) => (
    <li className="mb-2" key={account._id}>
      {account.name} ({account.balance}) {account.type} {account.description} {' '}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
        onClick={() => handleRemoveAccount(account._id)}
      >
        Remove
      </button>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
        onClick={() => handleUpdateAccount(account._id)}
      >
        Update
      </button>

    </li>
  ))}
</ul>

        </div>
      </div>
    </div>

  );
};

export default PersonalCabinet;