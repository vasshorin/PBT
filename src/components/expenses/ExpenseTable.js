import React, {useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseTable = ({ expenses, deleteTransaction, rerenderTable }) => {
  const [expenseSelected, setExpenseSelected] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshedAccountData, setRefreshedAccountData] = useState(false);
  const [refreshedCreditCardData, setRefreshedCreditCardData] = useState(false);
  const [newExpenses, setNewExpenses] = useState([]);


const onExpenseSelected = (expense) => {
  if(expenseSelected === expense._id) {
    setExpenseSelected('');
  } else {
    setExpenseSelected(expense._id);
  }
};

useEffect(() => {
  const fetchExpenses = async () => {
    const token = localStorage.getItem('refreshToken');
    const aToken = localStorage.getItem('accessToken');
    const response = await axios.get(`http://localhost:5050/api/transactions`, {
      headers: {
        'auth-token-refresh': token,
        'auth-token-access': aToken
      },
    });
    setRefreshToken(token);
    setAccessToken(aToken);

    const transactions = response.data.transactions;

    const updatedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        let accountData = {};

        const responseGetCategory = await axios.get(
          `http://localhost:5050/api/getCategory/${transaction.categories}`,
          {
            headers: { 'auth-token-refresh': token },
          }
        );

        const category = responseGetCategory.data.category;
        if (transaction.accountType === 'bank') {
          const responseGetAccount = await axios.get(
            `http://localhost:5050/api/getAccount/${transaction.account}`,
            {
              headers: { 'auth-token-refresh': token },
            }
          );
          const account = responseGetAccount.data.account;
          accountData = { accountName: account.name, accountBalance: account.balance };
        } else if (transaction.accountType === 'credit') {
          const responseGetCreditCard = await axios.get(
            `http://localhost:5050/api/getCreditCard/${transaction.credit}`,
            {
              headers: { 'auth-token-refresh': token },
            }
          );
          const creditCard = responseGetCreditCard.data.creditCard;
          accountData = {
            accountName: creditCard.name,
            accountBalance: creditCard.currentBalance,
            availableCredit: creditCard.availableCredit,
            utilization: creditCard.utilization,
          };
        }
        

        return { ...transaction, accountData, category };
      })
    );
    setNewExpenses(updatedTransactions);
  };

  fetchExpenses();
}, [refreshedAccountData, refreshedCreditCardData, rerenderTable]);


// console.log(expenses);


  return (
    <>
      {newExpenses.length > 0 ? (
        <div class="flex flex-col">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr className='bg-orange-100'>
                      <th className="px-6 py-4">Date</th>
                      {/* <th className="px-6 py-4">Type</th> */}
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Categories</th>
                      <th className="px-6 py-4">Accounts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newExpenses.map((expense) => (
                      <tr key={expense._id}
                      class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                      onClick={() => onExpenseSelected(expense)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{new Date(expense.date).toLocaleDateString()}</td>
                        {/* <td className="whitespace-nowrap px-6 py-4">{expense._id}</td> */}
                        <td className={`whitespace-nowrap px-6 py-4 ${expense.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>{'$'}{expense.amount.toLocaleString()}</td>
                        <td className="whitespace-nowrap px-6 py-4">{expense.description}</td>
                        <td className="whitespace-nowrap px-6 py-4">{expense.category.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{expense.accountData.accountName}</td>
                        <td className="whitespace-nowrap py-4">
                          <button
                            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline ${onExpenseSelected ? 'visible' : 'hidden'}`}
                            onClick={() => deleteTransaction(expense._id)}
                          >
                            <i class="ri-delete-bin-line"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No expenses to display.</p>
      )}
    </>
  );
};

export default ExpenseTable;
