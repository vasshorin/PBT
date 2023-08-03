import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';

const ExpenseTable = ({ expenses, deleteTransaction, rerenderTable, newExpenses1, setNewExpenses1 }) => {
  const [expenseSelected, setExpenseSelected] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [newExpenses, setNewExpenses] = useState([]);

  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshedAccountData, setRefreshedAccountData] = useState(false);
  const [refreshedCreditCardData, setRefreshedCreditCardData] = useState(false);

  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);

  const currentMonthStart = moment().startOf('month');
  const currentMonthEnd = moment().endOf('month');

  const [startDate, setStartDate] = useState(currentMonthStart);
  const [endDate, setEndDate] = useState(currentMonthEnd);

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('refreshToken');
      const aToken = localStorage.getItem('accessToken');
      const response = await axios.get(`https://bninja.onrender.com/api/transactions`, {
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
            `https://bninja.onrender.com/api/getCategory/${transaction.categories}`,
            {
              headers: { 'auth-token-refresh': token },
            }
          );

          const category = responseGetCategory.data.category;
          if (transaction.accountType === 'bank') {
            const responseGetAccount = await axios.get(
              `https://bninja.onrender.com/api/getAccount/${transaction.account}`,
              {
                headers: { 'auth-token-refresh': token },
              }
            );
            const account = responseGetAccount.data.account;
            accountData = { accountName: account.name, accountBalance: account.balance };
          } else if (transaction.accountType === 'credit') {
            const responseGetCreditCard = await axios.get(
              `https://bninja.onrender.com/api/getCreditCard/${transaction.credit}`,
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

          return { ...transaction, accountData, category};
        })
      );

      setNewExpenses(updatedTransactions);
      setNewExpenses1(updatedTransactions.reverse());
      setFilteredExpenses(updatedTransactions);
      console.log(updatedTransactions)
    };

    fetchExpenses();
  }, [refreshedAccountData, refreshedCreditCardData, rerenderTable]);


  const filterExpensesByDate = () => {
    const currentDate = moment();
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
  
    if (startDate && endDate) {
      const filtered = newExpenses.filter((expense) => {
        const expenseDate = moment(expense.date);
        return expenseDate >= startDate && expenseDate <= endDate;
      });
      setFilteredExpenses(filtered);
      setNewExpenses1(filtered);
    } else {
      const filtered = newExpenses.filter((expense) => {
        const expenseDate = moment(expense.date);
        return expenseDate >= startOfMonth && expenseDate <= endOfMonth;
      });
      setFilteredExpenses(filtered);
      setNewExpenses1(filtered);
    }
  };
  

  useEffect(() => {
    const currentMonthStart = moment().startOf('month');
    const currentMonthEnd = moment().endOf('month');
    setStartDate(currentMonthStart);
    setEndDate(currentMonthEnd);
  }, []);
  
  useEffect(() => {
    filterExpensesByDate();
  }, [startDate, endDate]);
  

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date);
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date);
  };





  const onExpenseSelected = (expense) => {
    if (expenseSelected === expense._id) {
      setExpenseSelected('');
    } else {
      setExpenseSelected(expense._id);
    }
  };

  const deleteTransactionNew = async (id) => {
    try {
      const [savedUser, token] = [localStorage.getItem('user'), localStorage.getItem('refreshToken')];
      console.log("PASSED IN ID" + id)
      const { data: transaction } = await axios.get(`https://bninja.onrender.com/api/transactions/${id}`, {
        headers: { 'auth-token-refresh': token },
      });

      const transactionAccountType = transaction.transaction.accountType;
      const transactionAccount = transactionAccountType === 'bank' ? transaction.transaction.account : transaction.transaction.credit;

      const { data: account } = await axios.get(`https://bninja.onrender.com/api/get${transactionAccountType === 'bank' ? 'Account' : 'CreditCard'}/${transactionAccount}`, {
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
        await axios.put(`https://bninja.onrender.com/api/updateCreditCardBalance/${transactionAccount}`, { balance: newBalance, availableCredit: newAvailableCredit, utilization: newUtilization }, {
          headers: { 'auth-token-refresh': token },
        });
      } else {
        await axios.put(`https://bninja.onrender.com/api/updateAccountBalance/${transactionAccount}`, { balance: newBalance }, {
          headers: { 'auth-token-refresh': token },
        });
      }

      const { data: deletedTransaction } = await axios.delete(`https://bninja.onrender.com/api/transactions/${id}`, {
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
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredExpenses(sortedExpenses);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortExpensesByAmount = () => {
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.amount - b.amount;
      } else {
        return b.amount - a.amount;
      }
    });

    setFilteredExpenses(sortedExpenses);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  const sortExpensesByCategory = () => {
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.category.name.localeCompare(b.category.name);
      } else {
        return b.category.name.localeCompare(a.category.name);
      }
    });

    setFilteredExpenses(sortedExpenses);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  const sortExpensesByAccount = () => {
    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.accountData.accountName.localeCompare(b.accountData.accountName);
      } else {
        return b.accountData.accountName.localeCompare(a.accountData.accountName);
      }
    });

    setFilteredExpenses(sortedExpenses);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Calculate indexes for the pagination
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;



  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {newExpenses.length > 0 ? (
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <div className="flex items-center space-x-2 mb-4">
                  <label htmlFor="start-date">Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    onChange={handleStartDateChange}
                    value={startDate ? startDate.toISOString().split('T')[0] : ''}
                  />
                                  <label htmlFor="end-date">End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    onChange={handleEndDateChange}
                    value={endDate ? endDate.toISOString().split('T')[0] : ''}
                  />
                </div>

                <div className="flex items-center space-x-2 mb-4">
  
                </div>
                <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
                  <thead className="border-b font-medium">
                    <tr className="bg-custom-brown-color">
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
                      <th className="px-6 py-4">Actions</th>
                      
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {currentExpenses.map((expense) => (
                      // console.log(expense),
                      <tr
                        key={expense._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                        onClick={() => onExpenseSelected(expense)}
                      >
                        {/* <td className="whitespace-nowrap px-6 py-2 font-medium">{expense.formattedDate}</td> */}
                        {/* <td className="whitespace-nowrap px-6 py-2 font-medium">{new Date(expense.date).toLocaleDateString()}</td> */}
                        <td className="whitespace-nowrap px-6 py-2 font-medium">{moment(expense.date).add(1, 'day').format('YYYY-MM-DD')}</td>


                        {/* <td className="whitespace-nowrap px-6 py-4">{expense._id}</td> */}
                        <td
                          className={`whitespace-nowrap px-6 py-2 ${expense.type === 'expense' ? 'text-red-500' : 'text-green-500'
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
        <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
        <thead className="border-b font-medium">
          <tr className="bg-custom-brown-color">
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
            <th className="px-6 py-4">Actions</th>
          </tr>
        </thead>
      </table>
      )}
    </>
  );
};

export default ExpenseTable;