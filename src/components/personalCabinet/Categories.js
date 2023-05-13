import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Categories = ({ refreshToken, user }) => {
    const [categoryName, setcategoryName] = useState('');
    const [categories, setCategories] = useState([]);

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
        const res = await axios.post('http://localhost:5050/api/newCategory', {
            name: categoryName,
        }, {
            headers: {
                'auth-token-refresh': refreshToken,
            },
        });
        setCategories([...categories, categoryName]);
        setcategoryName('');
    };

    // Remove category from the list of categories from the user db that's the same as the user that's logged in
    const handleRemoveCategory = async (categoryName) => {
        const res = await axios.delete(`http://localhost:5050/api/deleteCategory/${categoryName}`, {
            headers: {
                'auth-token-refresh': refreshToken,
            },
        });
        setCategories(categories.filter((cat) => cat !== categoryName));

    };

    return (
        <>
            <div className="flex flex-col md:flex-row mb-8">
                <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                    <h2 className="text-xl font-bold mb-4">Categories</h2>
                    <div className="flex flex-col md:flex-row mb-4">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text"
                            placeholder="Enter a new category"
                            value={categoryName}
                            onChange={(e) => setcategoryName(e.target.value)}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
                            onClick={handleAddCategory}
                        >
                            Add
                        </button>
                    </div>
                    <ul>
                        {categories.map((category) => (
                            <li key={category} className="flex justify-between items-center mb-2">
                                <span>{category}</span>
                                <button

                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    onClick={() => handleRemoveCategory(category)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Categories