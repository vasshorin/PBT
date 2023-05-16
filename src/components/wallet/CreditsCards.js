import React, { useEffect, useState } from 'react'
import axios from 'axios';

const CreditsCards = ({ refreshToken }) => {
    const [creditCards, setCreditCards] = useState([]);
    const [creditCardName, setCreditCardName] = useState('');
    const [creditCardBalance, setCreditCardBalance] = useState(0);
    const [creditCardLimit, setCreditCardLimit] = useState(0);
    const [toolDisplayPressed, setToolDisplayPressed] = useState(false);
    const [selectCardId, setSelectCardId] = useState('');

    useEffect(() => {
        // Get the list of credit cards from the user db that's the same as the user that's logged in
        const handleGetCreditCards = async () => {
            const res = await axios.get('http://localhost:5050/api/getCreditCards', {
                headers: {
                    'auth-token-refresh': refreshToken,
                },
            });
            setCreditCards(res.data.creditCards);
        }
        handleGetCreditCards();
    }, [refreshToken]);

    function handleCardClick(creditCard) {
        if (selectCardId === creditCard) {
            setSelectCardId(null);
        } else {
            setSelectCardId(creditCard);
        }
    };


    const handleAddCreditCard = async () => {
        console.log("Name " + creditCardName)
        console.log("Balance " + creditCardBalance)
        console.log("Limit " + creditCardLimit)

        // Calculate available credit and utilization rate
        const availableCredit = creditCardLimit - creditCardBalance;
        const utilization = (creditCardBalance / creditCardLimit) * 100;
        console.log("Available credit " + availableCredit)
        console.log("Utilization " + utilization)

        // Add the new credit card to the db
        const response = await axios.post(`http://localhost:5050/api/newCreditCard`, {
            name: creditCardName,
            currentBalance: creditCardBalance,
            creditLimit: creditCardLimit,
            availableCredit: availableCredit,
            utilization: utilization,
        }, {
            headers: { 'auth-token-refresh': refreshToken },
        });
        console.log(response.data);
        setCreditCards([response.data.creditCard, ...creditCards]);
    };

    const handleRemoveCreditCard = async (creditCardId) => {
        const res = await axios.delete(`http://localhost:5050/api/deleteCreditCard/${creditCardId}`, {
            headers: {
                'auth-token-refresh': refreshToken,
            },
        });
        setCreditCards(creditCards.filter((creditCard) => creditCard._id !== creditCardId));
    };

    const handleUpdateCreditCard = async (creditCardId) => {
        const res = await axios.put(`http://localhost:5050/api/updateCreditCard/${creditCardId}`, {
            name: creditCardName,
            currentBalance: creditCardBalance,
            creditLimit: creditCardLimit,
        }, {
            headers: {
                'auth-token-refresh': refreshToken,
            },
        });
        setCreditCards(creditCards.map((creditCard) => (creditCard._id === creditCardId ? res.data.creditCard : creditCard)));
    };




    return (
        <>
            <div class="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold">Your credit Cards</h2>
                    <div className="flex items-center">
                        <button
                            className="text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline"
                            title="Add credit card"
                        >
                            <i class="ri-add-circle-line"></i>
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
                            title="Tool"
                            onClick={() => setToolDisplayPressed(!toolDisplayPressed)}
                        >
                            Edit
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row mb-8">
                    <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                        <div className="flex flex-col items-center mb-4">
                            <label htmlFor="credit-card-limit" className={`mr-2 text-gray-700 text-sm font-bold w-full ${toolDisplayPressed ? '' : 'hidden'}`}>Name:</label>
                            <input
                                className={`shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 w-full ${toolDisplayPressed ? '' : 'hidden'}`}
                                type="text"
                                placeholder="Card name"
                                value={creditCardName}
                                onChange={(e) => setCreditCardName(e.target.value)}
                            />
                            {/* <label htmlFor="credit-card-name" className={`mr-2 text-gray-700 text-sm font-bold ${toolDisplayPressed ? 'hidden' : ''}`}>Name:</label> */}
                        </div>
                    </div>
                    <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                        <div className="flex flex-col items-center mb-4">
                            <label htmlFor="credit-card-limit" className={`mr-2 text-gray-700 text-sm font-bold ${toolDisplayPressed ? '' : 'hidden'}`}>Balance:</label>
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 ${toolDisplayPressed ? '' : 'hidden'}`}
                                type="text"
                                placeholder="Enter current balance"
                                value={creditCardBalance}
                                onChange={(e) => setCreditCardBalance(e.target.value)}
                            />
                            {/* <label htmlFor="credit-card-balance" className={`mr-2 text-gray-700 text-sm font-bold ${toolDisplayPressed ? 'hidden' : ''}`}>Balance:</label> */}
                        </div>
                    </div>
                    <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                        <div className="flex flex-col items-center mb-4">
                            <label htmlFor="credit-card-limit" className={`mr-2 text-gray-700 text-sm font-bold ${toolDisplayPressed ? '' : 'hidden'}`}>Limit:</label>
                            <input
                                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 ${toolDisplayPressed ? '' : 'hidden'}`}
                                type="text"
                                placeholder="Enter credit limit"
                                value={creditCardLimit}
                                onChange={(e) => setCreditCardLimit(e.target.value)}
                            />

                        </div>
                        <button
                            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline ${toolDisplayPressed ? '' : 'hidden'}`}
                            title="Add credit card"
                            onClick={handleAddCreditCard}
                        >
                            Add
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-col mb-8">
                    <div className="flex flex-col md:mr-4 mb-4 md:mb-0">
                        <div className="flex flex-col items-center mb-4">
                            <ul className="list-disc w-full">
                                {creditCards.map((creditCard) => (
                                    <li
                                        key={creditCard._id}
                                        className="flex flex-row items-center py-2 px-4 mb-2 rounded-lg bg-gray-100 hover:bg-gray-200 w-full flex-grow"
                                    >
                                        <div className="credit-card-item flex items-center mr-auto">
                                            <p
                                                className="text-gray-700 text-base cursor-pointer font-bold mr-4"
                                                onClick={() => handleCardClick(creditCard)}
                                            >
                                                {creditCard.name}
                                            </p>
                                            {selectCardId === creditCard && (
                                                <div className="dropdown flex items-center ml-10 pl-10">
                                                    <p className="text-gray-700 text-sm font-bold mr-6 ml-6">
                                                        Current Balance: ${creditCard.currentBalance}
                                                    </p>
                                                    <br />
                                                    <p className="text-gray-700 text-sm font-bold mr-6 ml-6">
                                                        Credit Limit: ${creditCard.creditLimit}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center ml-auto">
                                            <button
                                                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 ml-4 rounded-full mr-2 focus:outline-none focus:shadow-outline ${toolDisplayPressed ? "" : "hidden"
                                                    }`}
                                                title="Delete credit card"
                                                onClick={() => handleRemoveCreditCard(creditCard)}
                                            >
                                                <i class="ri-delete-bin-line"></i>
                                            </button>
                                            <button
                                                className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline ${toolDisplayPressed ? "" : "hidden"
                                                    }`}
                                                title="Edit credit card"
                                                onClick={() => handleUpdateCreditCard(creditCard)}
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


        </>
    )
}

export default CreditsCards