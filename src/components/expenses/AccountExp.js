import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AccountsExp = ({ refreshToken }) => {
  const [accounts, setAccounts] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get('http://localhost:5050/api/getAccounts', {
          headers: {
            'auth-token-refresh': refreshToken,
          },
        });
        setAccounts(res.data.accounts);
      } catch (error) {
        console.error(error);
      }

    };

    fetchAccounts();
  }, [refreshToken]);


  return (
    <>
      {accounts.length > 0 ? (

        <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
          <thead className="border-b font-medium">
            <tr className='bg-custom-brown-color'>
              <th className="px-6 py-4 text-left">Account Name</th>
              <th className="px-6 py-4 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account._id} class="border-b transition duration-300 ease-in-out hover:bg-neutral-100">
                <td className=" px-6 py-4">{account.name}</td>
                <td className=" px-6 py-4">{`$${account.balance.toFixed(2)}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className='text-center'>No accounts found</p>
      )}
    </>
  );
};

export default AccountsExp;