import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Dogh
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

const BarPlot = ({ data }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data) {
      setChartData({
        labels: Object.keys(data),
        datasets: [
          {
            label: 'Expenses by Category',
            data: Object.values(data),
            backgroundColor: '#3182CE',
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {chartData && (
        <Bar
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value, index, values) {
                    return '$' + value;
                  },
                },
              },
            },
            plugins: {
              title: {
                display: true,
                text: 'Expenses by Category',
              },
              legend: {
                display: false,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BarPlot;
