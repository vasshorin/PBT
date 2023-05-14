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
            <div class="flex flex-col md:flex-row items-center mb-6">
                <h2 class="text-2xl font-bold mr-4 mb-2 md:mb-0">Credit Card</h2>
                <div class="flex flex-col md:flex-row items-center">
                    <div class="flex items-center mb-2 md:mb-0">
                        <label for="credit-card-name" class="mr-2">Name:</label>
                        <input id="credit-card-name" type="text" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter card name" value={creditCardName} onChange={(e) => setCreditCardName(e.target.value)} />
                    </div>
                    <div class="flex items-center ml-4 mb-2 md:mb-0">
                        <label for="credit-card-balance" class="mr-2">Balance:</label>
                        <input id="credit-card-balance" type="text" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter current balance" value={creditCardBalance} onChange={(e) => setCreditCardBalance(e.target.value)} />
                    </div>
                    <div class="flex items-center ml-4 mb-2 md:mb-0">
                        <label for="credit-card-limit" class="mr-2">Limit:</label>
                        <input id="credit-card-limit" type="text" class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter credit limit" value={creditCardLimit} onChange={(e) => setCreditCardLimit(e.target.value)} />
                    </div>
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4 focus:outline-none focus:shadow-outline" onClick={handleAddCreditCard}>Add</button>
                </div>
            </div>
            {creditCards.length === 0 && <p className="text-center">No credit cards added yet.</p>}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="px-4 py-2">Credit Card</th>
                        <th className="px-4 py-2">Balance</th>
                        <th className="px-4 py-2">Limit</th>
                        <th className="px-4 py-2">Available Credit</th>
                        <th className="px-4 py-2">Utilization</th>
                    </tr>
                </thead>
                <tbody>
                    {creditCards.map((creditCard) => (
                        <tr key={creditCard._id} className="bg-white">
                            <td className="border px-4 py-2">{creditCard.name}</td>
                            <td className="border px-4 py-2">{`$${creditCard.currentBalance}`}</td>
                            <td className="border px-4 py-2">{`$${creditCard.creditLimit}`}</td>
                            <td className="border px-4 py-2">{`$${creditCard.availableCredit}`}</td>
                            <td className="border px-4 py-2">{`${creditCard.utilization.toFixed(2)}%`}</td>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4 focus:outline-none focus:shadow-outline"
                                onClick={() => handleRemoveCreditCard(creditCard._id)}
                            >
                                Remove
                            </button>
                        </tr>
                    ))}
                </tbody>
            </table>


        </>
    )
}

export default CreditsCards