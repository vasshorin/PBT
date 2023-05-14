import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const CardsExpenses = ({ refreshToken }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
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
    };
    handleGetCreditCards();
  }, [refreshToken]);

  // Transform the creditCards data into a format that the chart can use
  const chartData = creditCards.map((creditCard) => ({
    labels: [creditCard.name],
    datasets: [
      {
        data: [creditCard.currentBalance, creditCard.creditLimit - creditCard.currentBalance],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  }));

  return (
    <>
      {creditCards.length === 0 && <p className="text-center">No credit cards added yet.</p>}
      {creditCards.map((creditCard, index) => (
        <div key={creditCard._id} className="flex justify-center">
          <Doughnut data={chartData[index]} />
        </div>
      ))}
    </>
  );
};

export default CardsExpenses;
