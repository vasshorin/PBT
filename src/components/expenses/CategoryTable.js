import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryTable = ({ refreshToken, expenses }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const handleGetCategories = async () => {
      const res = await axios.get('http://localhost:5050/api/getCategories', {
        headers: {
          'auth-token-refresh': refreshToken,
        },
      });
      setCategories(res.data.categories);
    };
    handleGetCategories();
  }, [refreshToken]);

  const getCategoryTotal = (category) => {
    return expenses.reduce((acc, expense) => {
      if (expense.type === 'expense' && expense.name.includes(category.name)) {
        acc += expense.amount;
      }
      return acc;
    }, 0);
  };

  return (
    <>
      {categories.length === 0 && <p className="text-center">No categories added yet.</p>}
      {categories.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-orange-100">
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Current</th>
                <th className="px-4 py-2 border">Budget</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="bg-white">
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2">{`$${getCategoryTotal(category).toLocaleString()}`}</td>
                  <td className="border px-4 py-2">{`$${category.budget.toLocaleString()}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default CategoryTable;
