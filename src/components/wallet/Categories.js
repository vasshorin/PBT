import React, { useEffect, useState } from 'react'
import axios from 'axios';

const Categories = ({ refreshToken, user }) => {
    const [categoryName, setcategoryName] = useState('');
    const [categories, setCategories] = useState([]);
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
        <div className="bg-white rounded-md shadow-md p-6 w-full md:w-1/2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Categories</h2>
                <div className="flex items-center">
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-2 focus:outline-none focus:shadow-outline"
                        title="Add category"
                        onClick={handleAddCategory}
                    >
                        +
                    </button>
                    <button
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                        title="Tool"
                        onClick={() => setToolDisplayPressed(!toolDisplayPressed)}
                    >
                        <svg
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M18 5v5.586l-5.293-5.293a1 1 0 00-1.414 0l-7 7a1 1 0 000 1.414l5.293 5.293H5a1 1 0 100 2h10a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 100 2h1v3a1 1 0 01-1 1H7a1 1 0 01-1-1V7h1a1 1 0 100-2H5a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 100-2h-1V5a1 1 0 011-1h2a1 1 0 100-2h-2z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mb-8">
                <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                    <div className="flex flex-row items-center mb-4">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                            type="text"
                            placeholder="Enter a new category"
                            value={categoryName}
                            onChange={(e) => setcategoryName(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row mb-8">
                <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                    <div className="flex flex-row items-center mb-4">
                        <ul className="list-disc">
                            {categories.map((category) => (
                                <li key={category} className="flex flex-row items-center mb-4">
                                    <button
                                        className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mr-2 focus:outline-none focus:shadow-outline ${toolDisplayPressed ? '' : 'hidden'}`}
                                        title="Remove category"
                                        onClick={() => handleRemoveCategory(category)}
                                    >
                                        -
                                    </button>
                                    <p className="text-gray-700 text-base">{category}</p>
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