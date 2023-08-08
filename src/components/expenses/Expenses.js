import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateNewExpense from './CreateNewExpense';
import CardsExpenses from './CardsExpenses';
import ExpenseTable from './ExpenseTable';
import AccountsExp from './AccountExp';
import CardExpenseDonut from './CardExpenseDonut';
import CategoryTable from './CategoryTable';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [updateTable, setUpdateTable] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    categories: [],
    accounts: [],
    creditCards: [],
  });

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('refreshToken');
    const aToken = localStorage.getItem('accessToken');
    if (!token || !aToken) {
      navigate('/login');
      return;
    }

    const headers = { 'auth-token-refresh': token };

    const [categoriesResponse, accountsResponse, creditCardsResponse] = await Promise.all([
      axios.get(`https://bninja.onrender.com/api/getCategories`, { headers }),
      axios.get(`https://bninja.onrender.com/api/getAccounts`, { headers }),
      axios.get(`https://bninja.onrender.com/api/getCreditCards`, { headers }),
    ]);

    const categories = categoriesResponse.data.categories;
    const accounts = accountsResponse.data.accounts;
    const creditCards = creditCardsResponse.data.creditCards;

    setData({ categories, accounts, creditCards });
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchExpenses = useCallback(async () => {
    const token = localStorage.getItem('refreshToken');
    const aToken = localStorage.getItem('accessToken');
    if (!token || !aToken) {
      navigate('/login');
      return;
    }

    const response = await axios.get(`https://bninja.onrender.com/api/transactions`, {
      headers: {
        'auth-token-refresh': token,
        'auth-token-access': aToken,
      },
    });

    setRefreshToken(token);
    setAccessToken(aToken);

    const transactions = response.data.transactions;

    // Process transactions concurrently
    const updatedTransactions = await Promise.all(
      transactions.map(async (transaction) => {
        let accountData = {};
        let category = {};

        if (transaction.categories) {
          const responseGetCategory = await axios.get(
            `https://bninja.onrender.com/api/getCategory/${transaction.categories}`,
            {
              headers: { 'auth-token-refresh': token },
            }
          );
          category = responseGetCategory.data.category;
        }

        if (transaction.accountType === 'bank') {
          const account = data.accounts.find((account) => account._id === transaction.account);
          if (account) {
            accountData = { accountName: account.name, accountBalance: account.balance };
          }
        } else if (transaction.accountType === 'credit') {
          const creditCard = data.creditCards.find((creditCard) => creditCard._id === transaction.credit);
          if (creditCard) {
            accountData = {
              accountName: creditCard.name,
              accountBalance: creditCard.currentBalance,
              availableCredit: creditCard.availableCredit,
              utilization: creditCard.utilization,
            };
          }
        }

        return { ...transaction, accountData, category };
      })
    );

    setExpenses(updatedTransactions);

  }, [data.accounts, data.creditCards, navigate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('refreshToken');

      // Fetch the transaction to be deleted
      const { data: transaction } = await axios.get(`https://bninja.onrender.com/api/transactions/${id}`, {
        headers: { 'auth-token-refresh': token },
      });

      const transactionAccountType = transaction.transaction.accountType;
      const transactionAccount = transactionAccountType === 'bank' ? transaction.transaction.account : transaction.transaction.credit;

      // Fetch the associated account or credit card
      const { data: account } = await axios.get(`https://bninja.onrender.com/api/get${transactionAccountType === 'bank' ? 'Account' : 'CreditCard'}/${transactionAccount}`, {
        headers: { 'auth-token-refresh': token },
      });

      const accountBalance = transactionAccountType === 'bank' ? account.account.balance : account.creditCard.currentBalance;
      let newBalance = accountBalance;
      const transactionType = transaction.transaction.type;

      if (transactionAccountType === 'bank') {
        newBalance = transactionType === 'expense' ? accountBalance + transaction.transaction.amount : accountBalance - transaction.transaction.amount;
      } else if (transactionAccountType === 'credit') {
        newBalance = transactionType === 'expense' ? accountBalance - transaction.transaction.amount : accountBalance + transaction.transaction.amount;
      }

      // Update the account or credit card balance
      if (transactionAccountType === 'credit') {
        const availableCredit = account.creditCard.availableCredit;
        const newAvailableCredit = transactionType === 'expense' ? availableCredit + transaction.transaction.amount : availableCredit - transaction.transaction.amount;
        const newUtilization = newAvailableCredit === 0 ? 1 : newBalance / newAvailableCredit;

        await axios.put(`https://bninja.onrender.com/api/updateCreditCardBalance/${transactionAccount}`, {
          balance: newBalance,
          availableCredit: newAvailableCredit,
          utilization: newUtilization
        }, {
          headers: { 'auth-token-refresh': token },
        });
      } else {
        await axios.put(`https://bninja.onrender.com/api/updateAccountBalance/${transactionAccount}`, {
          balance: newBalance
        }, {
          headers: { 'auth-token-refresh': token },
        });
      }

      // Delete the transaction
      await axios.delete(`https://bninja.onrender.com/api/transactions/${id}`, {
        headers: { 'auth-token-refresh': token },
      });

      // Update the expenses state
      const updatedExpenses = expenses.filter((expense) => expense._id !== id);
      setExpenses(updatedExpenses);

      // Trigger data refresh
      setUpdateTable(prevUpdateTable => !prevUpdateTable);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }, [expenses]);

  const onExpenseAdded = useCallback((expense) => {
    setExpenses((prevExpenses) => [expense, ...prevExpenses]);
    setUpdateTable(prevUpdateTable => !prevUpdateTable);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-full">
        <CreateNewExpense
          onExpenseAdded={onExpenseAdded}
          refreshToken={refreshToken}
          categories={data.categories}
          accounts={data.accounts}
          creditCards={data.creditCards}
        />
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col mr-0 sm:mr-3 w-full sm:w-1/2">
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Expenses</h2>
          <div className="mb-4 shadow-lg">
            <ExpenseTable expenses={expenses} deleteTransaction={deleteTransaction} />
          </div>
        </div>
        <div className="flex flex-col ml-0 sm:ml-3 w-full sm:w-1/2">
          <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Account Summary</h2>
          <div className="my-8 py-8">
            <CategoryTable newExpenses1={expenses} categories={data.categories} />
          </div>
          <div className="mb-8 shadow-lg">
            <AccountsExp accounts={data.accounts} />
          </div>
          <div className="mb-4 shadow-lg">
            <CardsExpenses creditCards={data.creditCards} />
          </div>
          <div className="flex flex-col justify-center">
            <CardExpenseDonut creditCards={data.creditCards} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
