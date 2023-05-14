import React, {useEffect, useState} from 'react';
import axios from 'axios';

const AccountsExp = ({refreshToken, deleteTransaction, refreshedAccountData}) => {
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

  }, [refreshToken]);

  return (
    <>
     {accounts.length > 0 ? (
          <table className="w-full border-collapse text-sm">
            <thead>
            <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Account Name</th>
                <th className="px-4 py-2 text-left">Balance</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account._id}>
                  <td className="border px-4 py-2">{account.name}</td>
                  <td className="border px-4 py-2">{`$${account.balance}`}</td>
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