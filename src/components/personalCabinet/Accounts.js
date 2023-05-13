import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Accounts = ({ refreshToken, user }) => {
    // const [categoryName, setcategoryName] = useState('');
    // const [newAccount, setNewAccount] = useState('');
    // const [accountTypes, setAccountTypes] = useState(['Bank account', 'Credit card']);
    const [accountType, setAccountType] = useState('');
    const [accountName, setAccountName] = useState('');
    const [accountBalance, setAccountBalance] = useState(0);
    const [accounts, setAccounts] = useState(['Bank account', 'Credit card']);
      
      const handleAddAccount = async () => {
        const res = await axios.post('http://localhost:5050/api/newAccount', {
          type: accountType,
          name: accountName,
          balance: accountBalance,
        }, {
          headers: {
            'auth-token-refresh': refreshToken,
          },
        });
        setAccounts([res.data.account, ...accounts]);
    
        setAccountType('');
        setAccountName('');
        setAccountBalance(0);
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
  return (
    <>
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
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
            >
              <option value="credit">Credit card</option>
              <option value="bank">Bank account</option>
            </select>
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
    </>
  )
}

export default Accounts;