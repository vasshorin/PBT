import React, {useEffect, useState} from 'react';
import axios from 'axios';

const AccountsExp = ({refreshToken}) => {
    const [accountName, setAccountName] = useState('');
    const [accountBalance, setAccountBalance] = useState(0);
    const [accounts, setAccounts] = useState('');

      
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


  return (
    <>
     {accounts.length > 0 ? (
      
      <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
      <thead className="border-b font-medium dark:border-neutral-500">
            <tr className='bg-custom-brown-color'>
                <th className="px-6 py-4 text-left">Account Name</th>
                <th className="px-6 py-4 text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id} class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                  <td className=" px-6 py-4">{account.name}</td>
                  <td className=" px-6 py-4">{`$${account.balance}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No accounts found</p>
        )}
    </>
    );
};

export default AccountsExp;