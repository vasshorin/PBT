import React, { useEffect, useState } from 'react'
import axios from 'axios';

const CreditsCards = ({ refreshToken, user }) => {
    const [creditCards, setCreditCards] = useState([]);
    const [creditCardName, setCreditCardName] = useState('');
    const [creditCardBalance, setCreditCardBalance] = useState(0);
    const [creditCardLimit, setCreditCardLimit] = useState(0);

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


    return (
        <>
            <div className="flex flex-col md:ml-4">
                <h2 className="text-xl font-bold mb-4">Credit Card</h2>
                <div className="flex flex-col md:flex-row mb-4">
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Credit card name"
                        value={creditCardName}
                        onChange={(e) => setCreditCardName(e.target.value)}
                    />
                    <h3 className="text-m font-bold mb-4">Current balance</h3>
                    <input
                        // Enter the balance of the new account
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
                        type="text"
                        placeholder="Current balance"
                        value={creditCardBalance}
                        onChange={(e) => setCreditCardBalance(e.target.value)}
                    />
                    <h3 className="text-m font-bold mb-4">Credit limit</h3>
                    <input
                        // Enter the limit of the new account   
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
                        type="text"
                        placeholder="Credit limit"
                        value={creditCardLimit}
                        onChange={(e) => setCreditCardLimit(e.target.value)}
                    />
                    <br />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline"
                        onClick={handleAddCreditCard}
                    >
                        Add
                    </button>
                </div>
                <ul>
                    {creditCards.map(creditCard => (
                        <li className="mb-2" key={creditCard._id}>
                            {creditCard.name} ({'$' + creditCard.currentBalance}) {creditCard.creditLimit}
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
                                onClick={() => handleRemoveCreditCard(creditCard._id)}
                            >
                                Remove
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
                                // onClick={() => handleUpdateAccount(account._id)}
                            >
                                Update
                            </button>

                        </li>
                    ))}
                </ul>

            </div>

        </>
    )
}

export default CreditsCards