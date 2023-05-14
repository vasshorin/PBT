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
    {creditCards.length === 0 && <p className="text-center">No credit cards added yet.</p>}
    <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-2 py-2">Credit Card</th>
                    <th className="px-2 py-2">Balance</th>
                    <th className="px-2 py-2">Limit</th>
                    <th className="px-2 py-2">Available Credit</th>
                    <th className="px-2 py-2">Utilization</th>
                </tr>
            </thead>
            <tbody>
                {creditCards.map((creditCard) => (
                    <tr key={creditCard._id} className="bg-white">
                        <td className="border px-2 py-2">{creditCard.name}</td>
                        <td className="border px-2 py-2">{`$${creditCard.currentBalance.toLocaleString()}`}</td>
                        <td className="border px-2 py-2">{`$${creditCard.creditLimit.toLocaleString()}`}</td>
                        <td className="border px-2 py-2">{`$${creditCard.availableCredit.toLocaleString()}`}</td>
                        <td className="border px-2 py-2">{`${creditCard.utilization.toFixed(2)}%`}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
</>  

  )
}

export default CardsExpenses;

// import React, { useEffect, useState } from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import axios from 'axios';

// const CardsExpenses = ({ refreshToken }) => {
//   const [creditCards, setCreditCards] = useState([]);

//   useEffect(() => {
//     // Get the list of credit cards from the user db that's the same as the user that's logged in
//     const handleGetCreditCards = async () => {
//       const res = await axios.get('http://localhost:5050/api/getCreditCards', {
//         headers: {
//           'auth-token-refresh': refreshToken,
//         },
//       });
//       setCreditCards(res.data.creditCards);
//     }
//     handleGetCreditCards();
//   }, [refreshToken]);

//   // Transform the creditCards data into a format that the chart can use
//   const chartData = {
//     labels: creditCards.map((creditCard) => creditCard.name),
//     datasets: [{
//       data: creditCards.map((creditCard) => creditCard.currentBalance),
//       backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8B008B', '#ADFF2F', '#1E90FF']
//     }]
//   };

//   return (
//     <>
//       {creditCards.length === 0 && <p className="text-center">No credit cards added yet.</p>}
//       <div className="flex justify-center">
//         <Doughnut data={chartData} />
//       </div>
//     </>
//   )
// }

// export default CardsExpenses;