import React, { useEffect, useState } from 'react'
import axios from 'axios';

const CardsExpenses = ({refreshToken}) => {
    const [creditCards, setCreditCards] = useState([]);

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

  return (
    <>
    {creditCards.length > 0 ? (
    <div className="overflow-x-auto">
       <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
            <thead className="border-b font-medium dark:border-neutral-500">
            <tr className='bg-custom-brown-color'>
                    <th className="px-6 py-4">Credit Card</th>
                    <th className="px-6 py-4">Balance</th>
                    <th className="px-6 py-4">Limit</th>
                    <th className="px-6 py-4">Available Credit</th>
                    <th className="px-6 py-4">Utilization</th>
                </tr>
            </thead>
            <tbody>
                {creditCards.map((creditCard) => (
                    <tr key={creditCard._id} class="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
                        <td className="whitespace-nowrap px-6 py-4">{creditCard.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{`$${creditCard.currentBalance.toLocaleString()}`}</td>
                        <td className="whitespace-nowrap px-6 py-4">{`$${creditCard.creditLimit.toLocaleString()}`}</td>
                        <td className="whitespace-nowrap px-6 py-4">{`$${creditCard.availableCredit.toLocaleString()}`}</td>
                        <td className="border px-6 py-4">{`${creditCard.utilization.toFixed(2)}%`}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    ) : (
        <p className="text-center"></p>
    )}
</>  

  )
}

export default CardsExpenses;