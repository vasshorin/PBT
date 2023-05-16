import React, {useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseTable = ({ expenses, deleteTransaction, rerenderTable, newExpenses1, setNewExpenses1 }) => {
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
    setNewExpenses1(updatedTransactions);
  };

  fetchExpenses();
}, [refreshedAccountData, refreshedCreditCardData, rerenderTable]);

const deleteTransactionNew = async (id) => {
  try {
    const [savedUser, token] = [localStorage.getItem('user'), localStorage.getItem('refreshToken')];
    console.log("PASSED IN ID" + id)
    const { data: transaction } = await axios.get(`http://localhost:5050/api/transactions/${id}`, {
      headers: { 'auth-token-refresh': token },
    });

    const transactionAccountType = transaction.transaction.accountType;
    const transactionAccount = transactionAccountType === 'bank' ? transaction.transaction.account : transaction.transaction.credit;

    const { data: account } = await axios.get(`http://localhost:5050/api/get${transactionAccountType === 'bank' ? 'Account' : 'CreditCard'}/${transactionAccount}`, {
      headers: { 'auth-token-refresh': token },
    });

    const accountBalance = transactionAccountType === 'bank' ? account.account.balance : account.creditCard.currentBalance;
    
    const accountName = transactionAccountType === 'bank' ? account.account.name : account.creditCard.name;

    let newBalance = accountBalance;
    const transactionType = transaction.transaction.type;

    if (transactionAccountType === 'bank') {
      newBalance = transactionType === 'expense' ? accountBalance + transaction.transaction.amount : accountBalance - transaction.transaction.amount;
    } else if (transactionAccountType === 'credit') {
      newBalance = transactionType === 'expense' ? accountBalance - transaction.transaction.amount : accountBalance + transaction.transaction.amount;
    }
    console.log(newBalance);

    if (transactionAccountType === 'credit') {
      const availableCredit = account.creditCard.availableCredit;
      const newAvailableCredit = transactionType === 'expense' ? availableCredit + transaction.transaction.amount : availableCredit - transaction.transaction.amount;
      const newUtilization = newAvailableCredit === 0 ? 1 : newBalance / newAvailableCredit;
      await axios.put(`http://localhost:5050/api/updateCreditCardBalance/${transactionAccount}`, { balance: newBalance, availableCredit: newAvailableCredit, utilization: newUtilization }, {
        headers: { 'auth-token-refresh': token },
      });
    } else {
      await axios.put(`http://localhost:5050/api/updateAccountBalance/${transactionAccount}`, { balance: newBalance }, {
        headers: { 'auth-token-refresh': token },
      });
    }

    const { data: deletedTransaction } = await axios.delete(`http://localhost:5050/api/transactions/${id}`, {
      headers: { 'auth-token-refresh': token },
    });

    const updatedExpenses = expenses.filter((expense) => expense._id !== id);
    setNewExpenses(updatedExpenses);
    setRefreshedAccountData(true);
    setRefreshedCreditCardData(true);
  } catch (error) {
    console.log(error.response.data.message);
  }
};

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
                            onClick={() => deleteTransactionNew(expense._id)}
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
