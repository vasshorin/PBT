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
      if(!token || !aToken) {
        navigate('/login');
      }
  
      const response = await axios.get(`https://crabby-plum-getup.cyclic.app/api/transactions`, {
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
            `https://crabby-plum-getup.cyclic.app/api/getCategory/${transaction.categories}`,
            {
              headers: { 'auth-token-refresh': token },
            }
          );

          const category = responseGetCategory.data.category;
          if (transaction.accountType === 'bank') {
            const responseGetAccount = await axios.get(
              `https://crabby-plum-getup.cyclic.app/api/getAccount/${transaction.account}`,
              {
                headers: { 'auth-token-refresh': token },
              }
            );
            const account = responseGetAccount.data.account;
            accountData = { accountName: account.name, accountBalance: account.balance };
          } else if (transaction.accountType === 'credit') {
            const responseGetCreditCard = await axios.get(
              `https://crabby-plum-getup.cyclic.app/api/getCreditCard/${transaction.credit}`,
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
      setExpenses(updatedTransactions);
    };
  
    fetchExpenses();
  }, [refreshedAccountData, refreshedCreditCardData]);

  const onExpenseAdded = (expense) => {
    setExpenses((prevExpenses) => [expense, ...prevExpenses]);
    setRerenderTable((prevValue) => !prevValue);
    setRefreshedAccountData(true);
  };
  
  return (
<div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
  <div className="max-w-full">
    <CreateNewExpense onExpenseAdded={onExpenseAdded} />  
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
        <CardExpenseDonut refreshToken={refreshToken} />
      </div>
    </div>
  </div>
</div>

  );
  
  };  


export default Expenses;
