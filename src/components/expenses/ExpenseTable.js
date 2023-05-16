import React, {useEffect, useState } from 'react';

const ExpenseTable = ({ expenses, deleteTransaction }) => {
  const [expenseSelected, setExpenseSelected] = useState('');

const onExpenseSelected = (expense) => {
  if(expenseSelected === expense._id) {
    setExpenseSelected('');
  } else {
    setExpenseSelected(expense._id);
  }
};


  return (
    <>
      {expenses.length > 0 ? (
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
                    {expenses.map((expense) => (
                      <tr key={expense._id}
                      class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                      onClick={() => onExpenseSelected(expense)}
                      >
                        <td className="whitespace-nowrap px-6 py-4 font-medium">{new Date(expense.date).toLocaleDateString()}</td>
                        {/* <td className="whitespace-nowrap px-6 py-4">{expense.type}</td> */}
                        <td className={`whitespace-nowrap px-6 py-4 ${expense.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>{expense.amount.toLocaleString()}</td>
                        <td className="whitespace-nowrap px-6 py-4">{expense.description}</td>
                        <td className="whitespace-nowrap px-6 py-4">{expense.categories.join(", ")}</td>
                        <td className="whitespace-nowrap px-6 py-4">{expense.accountName}</td>
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
