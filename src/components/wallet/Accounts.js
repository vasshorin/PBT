import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Accounts = ({ refreshToken, user }) => {
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [accounts, setAccounts] = useState(['Bank account', 'Credit card']);
  const [toolDisplayPressed, setToolDisplayPressed] = useState(false);
  const [selectAccountId, setSelectAccountId] = useState('');

  const [isMobileView, setIsMobileView] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobileView(window.innerWidth <= 768); // Adjust the value as per your mobile view breakpoint
      };
  
      window.addEventListener("resize", handleResize);
      handleResize(); // Check on initial render
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

  // Get the list of accounts from the user db that's the same as the user that's logged in
  useEffect(() => {
    const handleGetAccounts = async () => {
      const res = await axios.get('https://crabby-plum-getup.cyclic.app/api/getAccounts', {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
      setAccounts(res.data.accounts);
    };

    handleGetAccounts();
  }, [refreshToken]);


  const handleAddAccount = async () => {
    const res = await axios.post('https://crabby-plum-getup.cyclic.app/api/newAccount', {
      name: accountName,
      balance: accountBalance,
    }, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setAccounts([res.data.account, ...accounts]);

    setAccountName('');
    setAccountBalance(0);
  };


  const handleRemoveAccount = async (accountId) => {
    const res = await axios.delete(`https://crabby-plum-getup.cyclic.app/api/deleteAccount/${accountId}`, {
      headers: {
        'auth-token-refresh': refreshToken,
      },
    });
    setAccounts(accounts.filter((account) => account._id !== accountId));
  };

  const handleUpdateAccount = async (accountId) => {
    const res = await axios.put(`https://crabby-plum-getup.cyclic.app/api/updateAccount/${accountId}`, {
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

  const handleAccountClick = (accountId) => {
    if (selectAccountId === accountId) {
      setSelectAccountId('');
    } else {
      setSelectAccountId(accountId);
    }
  };

  return (
    <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Your bank accounts</h2>
        <div className="flex items-center">
              <button
                className={`bg-custom-grey-color hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${
                  isMobileView ? "" : "sm:mr-4"
                }`}
        
                title="Tool"
                onClick={() => setToolDisplayPressed(!toolDisplayPressed)}
              >
                Edit
              </button>
            </div>
      </div>
      <div className="flex flex-col md:flex-row mb-8">
        <div className="flex flex-row md:mr-4 mb-4 md:mb-0">
          <div className="flex flex-row items-center mb-4">
            <label htmlFor="account-name" className={`mr-2 text-gray-700 text-sm font-bold`}>Name:</label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2`}
              type="text"
              placeholder="Enter the account name"
              value={accountName}
              required
              onChange={(e) => setAccountName(e.target.value)} />
            <label htmlFor="account-balance" className={`mr-2 text-gray-700 text-sm font-bold`}>Balance:</label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2`}
              type="text"
              placeholder="Enter the balance"
              value={accountBalance}
              required
              onChange={(e) => setAccountBalance(e.target.value)} />
            <button
              className={`bg-custom-green-color hover:bg-green-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline`}
              title="Add credit card"
              onClick={handleAddAccount}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-col mb-8">
        <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
          <div className="flex flex-col items-center mb-4">
            <ul className="list-disc w-full">
              {accounts.map((account) => (
                <li
                  key={account._id}
                  className="flex flex-row items-center py-2 px-4 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200 w-full flex-grow"
                >
                  <div className="account-item flex items-center mr-auto">
                    <p
                      className="text-gray-700 text-base cursor-pointer font-bold mr-4"
                      onClick={() => handleAccountClick(account._id)}
                    >
                      {account.name}
                    </p>
                    {selectAccountId === account._id && (
                      <div className="dropdown flex items-center ml-10 pl-10">
                        <p className="text-gray-700 text-sm font-bold mr-6 ml-6">
                          Balance: ${account.balance}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center ml-auto">
                    <button
                      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline ${toolDisplayPressed ? "" : "hidden"
                        }`}
                      title="Delete account"
                      onClick={() => handleRemoveAccount(account._id)}
                    >
                      <i class="ri-delete-bin-line"></i>
                    </button>
                    <button
                      className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${toolDisplayPressed ? "" : "hidden"
                        }`}
                      title="Edit credit card"
                      onClick={() => handleUpdateAccount(account._id)}
                    >
                      <i class="ri-pencil-line"></i>
                    </button>
                  </div>

                </li>

              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>

  );



}

export default Accounts;