import React, {useEffect, useState } from 'react';
import axios from 'axios';

const ExpenseTable = ({ expenses, deleteTransaction, rerenderTable, newExpenses1, setNewExpenses1 }) => {
  const [expenseSelected, setExpenseSelected] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshedAccountData, setRefreshedAccountData] = useState(false);
  const [refreshedCreditCardData, setRefreshedCreditCardData] = useState(false);
  const [newExpenses, setNewExpenses] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);
  const [arrow, setArrow] = useState('down');


  // Calculate indexes for the pagination
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = newExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);



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
    setNewExpenses1(updatedTransactions.reverse());
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

const sortExpensesByDate = () => {
  const sortedExpenses = [...newExpenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (sortOrder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

  setNewExpenses(sortedExpenses);
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

const sortExpensesByAmount = () => {
  const sortedExpenses = [...newExpenses].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.amount - b.amount;
    } else {
      return b.amount - a.amount;
    }
  });

  setNewExpenses(sortedExpenses);
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

const sortExpensesByCategory = () => {
  const sortedExpenses = [...newExpenses].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.category.name.localeCompare(b.category.name);
    } else {
      return b.category.name.localeCompare(a.category.name);

    }
  });

  setNewExpenses(sortedExpenses);
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};


const sortExpensesByAccount = () => {
  const sortedExpenses = [...newExpenses].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.accountData.accountName.localeCompare(b.accountData.accountName);
    } else {
      return b.accountData.accountName.localeCompare(a.accountData.accountName);
    }
  });

  setNewExpenses(sortedExpenses);
  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
};

// console.log(expenses);


  return (
    <>
      {newExpenses.length > 0 ? (
      <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr className="bg-orange-100">
                  <th className="px-8 py-6 cursor-pointer">
                    <div className="flex items-center justify-between" onClick={sortExpensesByDate}>
                      <span>Date</span>
                      {sortOrder === 'asc' ? (
                        <span className="text-xs">&#x25B2;</span>
                      ) : (
                        <span className="text-xs">&#x25BC;</span>
                      )}
                    </div>
                  </th>
                  {/* <th className="px-6 py-4">Type</th> */}
                  <th className="px-6 py-4 cursor-pointer">
                    <div className="flex items-center justify-between" onClick={sortExpensesByAmount}>
                      <span>Amount</span>
                      {sortOrder === 'asc' ? (
                        <span className="text-xs pl-1">&#x25B2;</span>
                      ) : (
                        <span className="text-xs pl-1">&#x25BC;</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 cursor-pointer">
                    <div className="flex items-center justify-between" onClick={sortExpensesByCategory}>
                      <span>Categories</span>
                      {sortOrder === 'asc' ? (
                        <span className="text-xs pl-1">&#x25B2;</span>
                      ) : (
                        <span className="text-xs pl-1">&#x25BC;</span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer">
                    <div className="flex items-center justify-between" onClick={sortExpensesByAccount}>
                      <span>Accounts</span>
                      {sortOrder === 'asc' ? (
                        <span className="text-xs pl-1">&#x25B2;</span>
                      ) : (
                        <span className="text-xs pl-1">&#x25BC;</span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-500">
                 {currentExpenses.map((expense) => (
                   <tr
                     key={expense._id}
                     className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                     onClick={() => onExpenseSelected(expense)}
                   >
                     <td className="whitespace-nowrap px-6 py-2 font-medium">{new Date(expense.date).toLocaleDateString()}</td>
                     {/* <td className="whitespace-nowrap px-6 py-4">{expense._id}</td> */}
                     <td
                       className={`whitespace-nowrap px-6 py-2 ${
                         expense.type === 'expense' ? 'text-red-500' : 'text-green-500'
                       }`}
                     >
                       {'$'}
                       {expense.amount.toLocaleString()}
                     </td>
                     <td className="whitespace-nowrap px-6 py-2">{expense.description}</td>
                     <td className="whitespace-nowrap px-6 py-2">{expense.category.name}</td>
                     <td className="whitespace-nowrap px-6 py-2">{expense.accountData.accountName}</td>
                     <td className="whitespace-nowrap py-2">
                       <button
                         className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline`}
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
    {/* Pagination */}
      <div className="flex justify-center mt-4">
        <nav className="inline-flex rounded-md shadow">
          <ul className="flex space-x-1">
            {Array.from({ length: Math.ceil(newExpenses.length / expensesPerPage) }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  } hover:bg-blue-500 hover:text-white`}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ExpenseTable;
