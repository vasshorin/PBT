import React, { useState, useEffect } from 'react';

const PersonalCabinet = () => {
  const [newCategory, setNewCategory] = useState('');
  const [newAccount, setNewAccount] = useState('');
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
    }
  }, []);
  
  const handleAddCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category) => {
    setCategories(categories.filter((c) => c !== category));
  };

  const handleAddAccount = () => {
    if (newAccount.trim() !== '') {
      setAccounts([...accounts, newAccount.trim()]);
      setNewAccount('');
    }
  };

  const handleRemoveAccount = (account) => {
    setAccounts(accounts.filter((a) => a !== account));
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
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
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
              <li className="mb-2" key={category}>
                {category}{' '}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
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
              placeholder="Enter a new account"
              value={newAccount}
              onChange={(e) => setNewAccount(e.target.value)}
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
              <li className="mb-2" key={account}>
                {account}{' '}
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
                  onClick={() => handleRemoveAccount(account)}
                >
                  Remove
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