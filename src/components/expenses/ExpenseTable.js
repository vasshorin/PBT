import React, { useState, useEffect } from 'react';
import moment from 'moment';

const ExpenseTable = ({ expenses, deleteTransaction }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expensesPerPage] = useState(10);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('date');

  useEffect(() => {
    // Sort expenses by the specified column and order
    const sortedExpenses = [...expenses].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortedColumn] > b[sortedColumn] ? 1 : -1;
      } else {
        return a[sortedColumn] < b[sortedColumn] ? 1 : -1;
      }
    });
    setFilteredExpenses(sortedExpenses);
  }, [expenses, sortOrder, sortedColumn]);

  // Calculate indexes for pagination
  const indexOfLastExpense = currentPage * expensesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - expensesPerPage;
  const currentExpenses = filteredExpenses.slice(indexOfFirstExpense, indexOfLastExpense);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sorting order and update sorted column
  const handleSort = (column) => {
    if (column === sortedColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
      setSortedColumn(column);
    }
  };

  return (
    <>
      {filteredExpenses.length > 0 ? (
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">

                <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
                  <thead className="border-b font-medium">
                    <tr className="bg-custom-brown-color">
                      <th
                        className="px-8 py-6 cursor-pointer"
                        onClick={() => handleSort('date')}
                      >
                        Date{' '}
                        {sortedColumn === 'date' && (
                          <span className="text-xs">{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleSort('amount')}
                      >
                        Amount{' '}
                        {sortedColumn === 'amount' && (
                          <span className="text-xs pl-1">
                            {sortOrder === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-4">Description</th>
                      <th
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleSort('category.name')}
                      >
                        Categories{' '}
                        {sortedColumn === 'category.name' && (
                          <span className="text-xs pl-1">
                            {sortOrder === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </th>
                      <th
                        className="px-6 py-4 cursor-pointer"
                        onClick={() => handleSort('accountData.accountName')}
                      >
                        Accounts{' '}
                        {sortedColumn === 'accountData.accountName' && (
                          <span className="text-xs pl-1">
                            {sortOrder === 'asc' ? '▲' : '▼'}
                          </span>
                        )}
                      </th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {currentExpenses.map((expense) => (
                      <tr
                        key={expense._id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
                      >
                        <td className="whitespace-nowrap px-6 py-2 font-medium">
                          {moment(expense.date).format('YYYY-MM-DD')}
                        </td>
                        <td
                          className={`whitespace-nowrap px-6 py-2 ${expense.type === 'expense' ? 'text-red-500' : 'text-green-500'
                            }`}
                        >
                          {'$'}
                          {expense.amount.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">{expense.description}</td>
                        <td className="whitespace-nowrap px-6 py-2">
                          {expense.category ? expense.category.name : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                          {expense.accountData ? expense.accountData.accountName : 'N/A'}
                        </td>
                        <td className="whitespace-nowrap py-2">
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline"
                            onClick={() => deleteTransaction(expense._id)}
                          >
                            <i className="ri-delete-bin-line"></i>
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
        <p className="text-center">No expenses found</p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center mt-4">
        <nav className="block">
          <ul className="flex pl-0 rounded list-none flex-wrap">
            {Array.from({ length: Math.ceil(filteredExpenses.length / expensesPerPage) }).map(
              (item, index) => (
                <li key={index}>
                  <button
                    className={`px-3 py-1 rounded-full ${currentPage === index + 1
                        ? 'bg-custom-brown-color text-white'
                        : 'bg-transparent text-custom-brown-color'
                      }`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ExpenseTable;
