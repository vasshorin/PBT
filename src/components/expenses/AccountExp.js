import React from 'react';

const AccountsExp = ({ accounts }) => {
  return accounts ? (
    <>
      {accounts.length > 0 ? (
        <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
          <thead className="border-b font-medium">
            <tr className='bg-custom-brown-color'>
              <th className="px-6 py-6 text-left">Account Name</th>
              <th className="px-6 py-4 text-left">Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account._id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100">
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
  ) : (
    <p className='text-center'>Loading...</p>
  );
};

export default AccountsExp;
