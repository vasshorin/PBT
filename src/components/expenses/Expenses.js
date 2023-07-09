import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateNewExpense from './CreateNewExpense';
import BarPlot from './BarPlot';
import axios from 'axios';
import CardsExpenses from './CardsExpenses';
import ExpenseTable from './ExpenseTable';
import AccountsExp from './AccountExp';
import CardExpenseDonut from './CardExpenseDonut';
import CategoryTable from './CategoryTable';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshedAccountData, setRefreshedAccountData] = useState(false);
  const [refreshedCreditCardData, setRefreshedCreditCardData] = useState(false);
  const [rerenderTable, setRerenderTable] = useState(false);
  const [newExpenses1, setNewExpenses1] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('refreshToken');
      const aToken = localStorage.getItem('accessToken');
      if (!token || !aToken) {
        navigate('/login');
      }

      const response = await axios.get(`http://localhost:5050/api/transactions`, {
        headers: {
          'auth-token-refresh': token,
          'auth-token-access': aToken,
        },
      });
      setRefreshToken(token);
      setAccessToken(aToken);

      const transactions = response.data.transactions;

      const categories = await fetchCategories(token); // Fetch categories

      const groupedTransactions = groupTransactionsByAccountType(transactions); // Group transactions by account type

      const updatedTransactions = await Promise.all(
        groupedTransactions.map(async (group) => {
          const { accountType, transactions } = group;

          let accountData = {};

          if (accountType === 'bank') {
            const accountIds = transactions.map((transaction) => transaction.account);
            const accounts = await fetchAccounts(token, accountIds); // Fetch account data in bulk
            accountData = mapAccountData(accounts);
          } else if (accountType === 'credit') {
            const creditCardIds = transactions.map((transaction) => transaction.credit);
            const creditCards = await fetchCreditCards(token, creditCardIds); // Fetch credit card data in bulk
            accountData = mapCreditCardData(creditCards);
          }

          const updatedTransactions = transactions.map((transaction) => ({
            ...transaction,
            accountData,
            category: categories[transaction.categories], // Assign category based on the fetched categories
          }));

          return updatedTransactions;
        })
      );

      const flattenedTransactions = updatedTransactions.flat(); // Flatten the array of transactions
      setExpenses(flattenedTransactions);
    };

    fetchExpenses();
  }, [refreshedAccountData, refreshedCreditCardData, refreshToken, navigate]);

  const fetchCategories = async (token) => {
    const response = await axios.get('http://localhost:5050/api/categories', {
      headers: {
        'auth-token-refresh': token,
      },
    });

    const categories = response.data.categories.reduce((map, category) => {
      map[category._id] = category;
      return map;
    }, {});

    return categories;
  };

  const groupTransactionsByAccountType = (transactions) => {
    const groupedTransactions = transactions.reduce((map, transaction) => {
      const accountType = transaction.accountType;
      if (!map[accountType]) {
        map[accountType] = [];
      }
      map[accountType].push(transaction);
      return map;
    }, {});

    return Object.entries(groupedTransactions).map(([accountType, transactions]) => ({
      accountType,
      transactions,
    }));
  };

  const fetchAccounts = async (token, accountIds) => {
    const response = await axios.post(
      'http://localhost:5050/api/accounts',
      {
        accountIds,
      },
      {
        headers: {
          'auth-token-refresh': token,
        },
      }
    );

    return response.data.accounts;
  };

  const fetchCreditCards = async (token, creditCardIds) => {
    const response = await axios.post(
      'http://localhost:5050/api/creditCards',
      {
        creditCardIds,
      },
      {
        headers: {
          'auth-token-refresh': token,
        },
      }
    );

    return response.data.creditCards;
  };

  const mapAccountData = (accounts) => {
    const accountData = {};
    accounts.forEach((account) => {
      accountData[account._id] = {
        accountName: account.name,
        accountBalance: account.balance,
      };
    });
    return accountData;
  };

  const mapCreditCardData = (creditCards) => {
    const creditCardData = {};
    creditCards.forEach((creditCard) => {
      creditCardData[creditCard._id] = {
        accountName: creditCard.name,
        accountBalance: creditCard.currentBalance,
        availableCredit: creditCard.availableCredit,
        utilization: creditCard.utilization,
      };
    });
    return creditCardData;
  };

  const onExpenseAdded = (expense) => {
    setExpenses((prevExpenses) => [expense, ...prevExpenses]);
    setRerenderTable((prevValue) => !prevValue);
    setRefreshedAccountData(true);
  };


  
  return (
<div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
  <div className="max-w-full">
    <CreateNewExpense 
    onExpenseAdded={onExpenseAdded}
    refreshToken={refreshToken}
     />  
  </div>
  <div className="flex flex-col sm:flex-row">
    <div className="flex flex-col mr-0 sm:mr-3 w-full sm:w-1/2">
      <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Expenses</h2>
      <div className="mb-4 shadow-lg">
        <ExpenseTable expenses={expenses} rerenderTable={rerenderTable} setRerenderTable={setRerenderTable} newExpenses1={newExpenses1} setNewExpenses1={setNewExpenses1} />
      </div>
    </div>
    <div className="flex flex-col ml-0 sm:ml-3 w-full sm:w-1/2">
      <h2 className="text-2xl font-medium text-gray-900 text-center mb-2">Account Summary</h2>
      <div className="my-8 py-8 shadow-lg">
        <CategoryTable refreshToken={refreshToken} newExpenses1={newExpenses1} /> 
      </div>
      <div className="mb-8 shadow-lg">
        <AccountsExp refreshToken={refreshToken} />
      </div>
      <div className="mb-4 shadow-lg">
        <CardsExpenses refreshToken={refreshToken} />
      </div>
      <div className="flex flex-col justify-center">
        {/* <CardExpenseDonut refreshToken={refreshToken} /> */}
      </div>
    </div>
  </div>
</div>

  );
  
  };  


export default Expenses;
