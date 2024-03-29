import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

const CardsExpenses = ({ refreshToken, creditCards }) => {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const [activeCard, setActiveCard] = useState(null);
  const [showChart, setShowChart] = useState(-1);

  // Transform the creditCards data into a format that the chart can use
  const chartData = creditCards.map((creditCard) => ({
    labels: [`Balance: $${creditCard.currentBalance}`,
      `Available Credit: $${creditCard.creditLimit - creditCard.currentBalance}`,

      ],
    datasets: [
      {
        data: [creditCard.currentBalance, creditCard.creditLimit - creditCard.currentBalance],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  }));

  const handleCardButtonClick = (card) => {
    setActiveCard((prevCard) => (prevCard === card ? null : card));
  };

  return (
    <>
      <div className="flex flex-row justify-center">
        {creditCards.length === 0 && <p className="text-center">No credit cards added yet.</p>}
        {creditCards.map((creditCard, index) => (
          <div key={creditCard._id} className="flex flex-col items-center">
            <button className="bg-custom-brown-color rounded-lg px-4 py-2 m-4 shadow" onClick={() => setShowChart(index)}>
              {creditCard.name}
            </button>
            {showChart === index && (
              <div className="flex justify-center">
                <Doughnut data={chartData[index]} />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  };

export default CardsExpenses;
