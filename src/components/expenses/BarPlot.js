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
      const categories = Object.keys(data);
      const colors = ['#3182CE', '#E53E3E', '#48BB78', '#F6E05E', '#C53030']; // Manually define colors
      const backgroundColors = categories.map((_, i) => colors[i % colors.length]);

      setChartData({
        labels: categories,
        datasets: [
          {
            label: 'Expenses by Category',
            data: Object.values(data),
            backgroundColor: backgroundColors,
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