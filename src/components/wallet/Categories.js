import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Categories = ({ refreshToken, user }) => {
    const [categoryName, setcategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoryBudget, setCategoryBudget] = useState(0);
    const [toolDisplayPressed, setToolDisplayPressed] = useState(false);

    // Get the list of accounts from the user db that's the same as the user that's logged in
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

    // Add category to the list of categories from the user db that's the same as the user that's logged in
    const handleAddCategory = async () => {
        console.log(categoryName);
        console.log(categoryBudget);
        const res = await axios.post('http://localhost:5050/api/newCategory', {
            name: categoryName,
            budget: categoryBudget,
        }, {
            headers: {
                'auth-token-refresh': refreshToken,
            },
        });
        setCategories([res.data.category, ...categories]);
        setcategoryName('');
        setCategoryBudget('');
    };

    // Remove category from the list of categories from the user db that's the same as the user that's logged in
    const handleRemoveCategory = async (categoryId) => {
        const res = await axios.delete(`http://localhost:5050/api/deleteCategory/${categoryId}`, {
            headers: {
                'auth-token-refresh': refreshToken,
            },
        });
        setCategories(categories.filter((category) => category._id !== categoryId));

    };
    return (
        <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Spending Categories</h2>
                <div className="flex items-center">
                    <button
                        className="text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline"
                        title="Add category"
                    // onClick={handleAddCategory}
                    >
                        <i class="ri-add-line"></i>
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                        title="Tool"
                        onClick={() => setToolDisplayPressed(!toolDisplayPressed)}
                    >
                        {/* <i class="ri-tools-line"></i> */}
                        Edit
                    </button>
                </div>
            </div>
            <div className={`flex flex-col md:flex-row mb-8`}>
                <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                    <div className="flex flex-row items-center mb-4">
                        <label htmlFor="category-name" className={`mr-2 text-gray-700 text-sm font-bold`}>Name:</label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2`}
                            type="text"
                            placeholder="Enter a new category"
                            value={categoryName}
                            onChange={(e) => setcategoryName(e.target.value)}
                        />
                        <label htmlFor="category-name" className={`mr-2 text-gray-700 text-sm font-bold`}>Balance:</label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2`}
                            type="number"
                            placeholder="Budget"
                            value={categoryBudget}
                            onChange={(e) => setCategoryBudget(e.target.value)}
                        />
                        <button
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full ml-2 focus:outline-none focus:shadow-outline`}
                            title="Add category"
                            onClick={handleAddCategory}
                        >
                            <i class="ri-add-line"></i>
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-col mb-8">
                <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                    <div className="flex flex-col items-center mb-4">
                        <ul className="list-disc w-full">
                            {categories.map((category) => (
                                <li key={category._id}
                                    className="flex flex-row items-center py-2 px-4 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200 w-full flex-grow">
                                    <p className="text-gray-700 text-base cursor-pointer font-bold mr-4" >{category.name}</p>
                                    <div className="flex items-center ml-auto">
                                        <button
                                            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline ${toolDisplayPressed ? "" : "hidden"
                                                }`}
                                            title="Delete category"
                                            onClick={() => handleRemoveCategory(category._id)}
                                        >
                                            <i class="ri-delete-bin-line"></i>
                                        </button>
                                        <button
                                            className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${toolDisplayPressed ? "" : "hidden"
                                                }`}
                                            title="Edit category"
                                            onClick={() => handleRemoveCategory(category)}
                                        >
                                            <i class="ri-pencil-line"></i>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Categories