import React from 'react';

const ExpenseTable = ({ expenses, deleteTransaction }) => {
  return (
    <>
      {expenses.length > 0 ? (
        <table className="table-auto mx-auto">
          <thead>
            <tr>
            <th className="px-4 py-2 border">Type</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border">Categories</th>
                  <th className="px-4 py-2 border">Accounts</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense._id}>
                    <td className="border px-4 py-2">{expense.type}</td>
                    <td className="border px-4 py-2">${expense.amount.toFixed(2)}</td>
                    <td className="border px-4 py-2">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="border px-4 py-2">{expense.description}</td>
                    <td className="border px-4 py-2">{expense.categories.join(", ")}</td>
                    <td className="border px-4 py-2">{expense.accountName}</td>
                {/* <td className="border px-4 py-2"> */}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => deleteTransaction(expense._id)}
                  >
                    Delete
                  </button>
                {/* </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No expenses to display.</p>
      )}
    </>
  );
};

export default ExpenseTable;
