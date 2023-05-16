import React, { useState, useEffect } from 'react';
import CreateNewExpense from './CreateNewExpense';
import BarPlot from './BarPlot';
import axios from 'axios';
import CardsExpenses from './CardsExpenses';
import ExpenseTable from './ExpenseTable';
import AccountsExp from './AccountExp';
import CardExpenseDonut from './CardExpenseDonut';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [accountName, setAccountName] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);
  const [availableCredit, setAvailableCredit] = useState(0);
  const [utilization, setUtilization] = useState(0);
  const [user, setUser] = useState({});
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshedAccountData, setRefreshedAccountData] = useState(false);
  const [refreshedCreditCardData, setRefreshedCreditCardData] = useState(false);


  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('refreshToken');
      const aToken = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:5050/api/transactions`, {
        headers: { 'auth-token-refresh': token,
        'auth-token-access': aToken
       },

      });
      setRefreshToken(token);
      setAccessToken(aToken);

      if(!aToken) {
        // redirect to login
          window.location.href = '/login';
      }
      console.log("TOKEN" + accessToken)

      const transactions = response.data.transactions;


      const updatedTransactions = await Promise.all(transactions.map(async transaction => {
        let accountData = {};

        if (transaction.accountType === "bank") {
          const responseGetAccount = await axios.get(`http://localhost:5050/api/getAccount/${transaction.account}`, {
            headers: { 'auth-token-refresh': token },
          });
          const account = responseGetAccount.data.account;
          accountData = { accountName: account.name, accountBalance: account.balance };
        } else if (transaction.accountType === "credit") {
          const responseGetCreditCard = await axios.get(`http://localhost:5050/api/getCreditCard/${transaction.credit}`, {
            headers: { 'auth-token-refresh': token },
          });
          const creditCard = responseGetCreditCard.data.creditCard;
          accountData = { accountName: creditCard.name, accountBalance: creditCard.currentBalance, availableCredit: creditCard.availableCredit, utilization: creditCard.utilization };
        }

        return { ...transaction, ...accountData };
      }));

      setExpenses(updatedTransactions);
    };

    fetchExpenses();
  }, []);

  const deleteTransaction = async (id) => {
    try {
      const [savedUser, token] = [localStorage.getItem('user'), localStorage.getItem('refreshToken')];
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
      setExpenses(updatedExpenses);
      setRefreshedAccountData(true);
      setRefreshedCreditCardData(true);
      window.location.reload();
    } catch (error) {
      console.log(error.response.data.message);
    }
  };


  const onExpenseAdded = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col">
      {/* <h2 className="text-lg font-medium text-gray-900 text-center">Transactions</h2> */}
        <CreateNewExpense onExpenseAdded={onExpenseAdded} />
        <div className="flex flex-row">
          <div className="flex flex-col ml-3">
          <h2 className="text-lg font-medium text-gray-900 text-center">Transactions</h2>
            <ExpenseTable expenses={expenses} deleteTransaction={deleteTransaction} />
          </div>
          <div className="flex flex-col ml-4">
          <h2 className="text-lg font-medium text-gray-900 text-center ">Account Summary</h2>

            <table className="w-full border-collapse text-sm shadow-lg">
              <thead>
                <tr className='bg-orange-100'>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Amount</th>
                </tr>
              </thead>  
              <tbody>
                {Object.entries(
                  expenses.reduce((acc, expense) => {
                    if (expense.type === "expense") {
                      expense.categories.forEach((category) => {
                        acc[category] = (acc[category] || 0) + expense.amount;
                      });
                    }
                    return acc;
                  }, {})
                ).map(([category, amount]) => (
                  <tr key={category} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{category}</td>
                    <td className="border px-4 py-2">${amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-row justify-center mt-4 shadow-lg">
              <AccountsExp refreshToken={refreshToken} />
            </div>
            <div className="flex flex-row justify-center mt-4 shadow-lg">
              <CardsExpenses refreshToken={refreshToken} />
            </div>
            <div className="flex flex-row justify-center mt-4 shadow-lg">
              {/* <BarPlot data={expenses.reduce((acc, expense) => {
                if (expense.type === 'expense') {
                  expense.categories.forEach((category) => {
                    acc[category] = (acc[category] || 0) + expense.amount;
                  });
                }
                return acc;
              }, {})} /> */}
            </div>
            <div className="flex flex-col justify-center mt-4">
              <CardExpenseDonut refreshToken={refreshToken} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};


export default Expenses;
