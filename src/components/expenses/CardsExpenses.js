import React, { useEffect, useState } from 'react'
import axios from 'axios';

const CardsExpenses = ({ creditCards}) => {

  return creditCards ? (
    <>
    {creditCards.length > 0 ? (
    <div className="overflow-x-auto">
       <table className="min-w-full text-left text-sm font-light shadow-lg rounded-lg">
            <thead className="border-b font-medium">
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
                    <tr key={creditCard._id} className="border-b transition duration-300 ease-in-out hover:bg-neutral-100">
                        <td className="whitespace-nowrap px-6 py-4">{creditCard.name}</td>
                        <td className="whitespace-nowrap px-6 py-4">{`$${creditCard.currentBalance.toLocaleString()}`}</td>
                        <td className="whitespace-nowrap px-6 py-4">{`$${creditCard.creditLimit.toLocaleString()}`}</td>
                        <td className="whitespace-nowrap px-6 py-4">{`$${creditCard.availableCredit.toLocaleString()}`}</td>
                        <td className={`border px-6 py-4 ${creditCard.utilization.toFixed(2) > 30 ? 'text-red-600' : 'text-black'}`}>{`${creditCard.utilization.toFixed(2)}%`}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    ) : (
        <p className="text-center">No credit cards available.</p>
    )}
</>  

  )
    : ( 
        <p className="text-center">Loading...</p>
    )
}

export default CardsExpenses;