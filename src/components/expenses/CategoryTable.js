import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryTable = ({ refreshToken, newExpenses1, categories }) => {

  const getCategoryTotal = (category) => {
    return newExpenses1.reduce((acc, expense) => {
      if (expense.type === 'expense' && expense.categories === category._id) {
        acc += expense.amount;
      }
      return acc;
    }, 0);
  };

  return categories ? (
    <>
      {categories.length === 0 ? (
        <p className="text-center">No categories added yet.</p>
      ) : (
        <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
          <thead className="border-b font-medium">
            <tr className="bg-custom-brown-color">
              <th className="px-6 py-6">Category</th>
              <th className="px-6 py-4">Current</th>
              <th className="px-6 py-4">Budget</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100"
              >
                <td className="whitespace-nowrap px-6 py-4">{category.name}</td>
                <td
                  className={`whitespace-nowrap px-6 py-4 ${
                    getCategoryTotal(category) > category.budget ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {`$${getCategoryTotal(category).toLocaleString()}`}
                </td>
                <td className="whitespace-nowrap px-6 py-4">{`$${category.budget.toLocaleString()}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  ) : (
    <p className="text-center">Loading...</p>
  );
};

export default CategoryTable;
