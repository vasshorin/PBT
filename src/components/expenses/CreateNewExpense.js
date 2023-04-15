import React, { useState } from 'react';
import axios from 'axios';

const CreateNewExpense = () => {
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [importance, setImportance] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const res = axios.post('/api/newExpense', {
      date: date,
      comment: comment,
      amount: amount,
      category: category,
      account: account,
      importance: importance
    })
    console.log({ date, comment, amount, category, account, importance });
    // get the response from the server
    console.log(res);
    // clear the form
    setDate('');
    setComment('');
    setAmount('');
    setCategory('');
    setAccount('');
    setImportance('');
    
  };

  return (
    <div className="flex justify-center">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={onSubmit}>
    <div className="flex flex-wrap justify-end">
    <div className="w-full md:w-1/6 mb-4 md:mb-0">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="date">
            Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            placeholder="Enter the date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/6 mb-4 md:mb-0">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="comment">
            Comment
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="comment"
            type="text"
            placeholder="Enter a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/6 mb-4 md:mb-0">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">
            Amount
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="amount"
            type="number"
            step=".01"
            placeholder="Enter the amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="w-full md:w-1/6 mb-4 md:mb-0">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
            Category
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="food">Food</option>
            <option value="transportation">Transportation</option>
            <option value="utilities">Utilities</option>
            <option        value="entertainment">Entertainment</option>
        <option value="housing">Housing</option>
        <option value="clothing">Clothing</option>
        <option value="other">Other</option>      
      </select>
    </div>
    <div className="w-full md:w-1/6 mb-4 md:mb-0">
      <label className="block text-gray-700 font-bold mb-2" htmlFor="account">
        Account
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="account"
        type="text"
        placeholder="Enter the account"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
      />
    </div>
    <div className="w-full md:w-1/6 mb-4 md:mb-0">
      <label className="block text-gray-700 font-bold mb-2" htmlFor="importance">
        Importance
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="importance"
        value={importance}
        onChange={(e) => setImportance(e.target.value)}
      >
        <option value="">Select an importance level</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>
    <div className="w-full md:w-1/6 mb-4 md:mb-0 flex items-center justify-center">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Submit
      </button>
    </div>
  </div>
  </form>
</div>



  );
};

export default CreateNewExpense;
