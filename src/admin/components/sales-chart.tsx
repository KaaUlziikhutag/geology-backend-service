import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Box } from '@adminjs/design-system';

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const salesData = {
  labels: ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар'],
  datasets: [
    {
      label: '2024 он',
      data: [65, 59, 80, 81, 56, 55],
      borderColor: '#42A5F5',
      backgroundColor: '#E3F2FD',
    },
    {
      label: '2023 он',
      data: [40, 55, 60, 65, 70, 75],
      borderColor: '#9CCC65',
      backgroundColor: '#F1F8E9',
    },
  ],
};

const SalesChart = () => (
  <Box variant="white" padding="lg" borderRadius="lg" mb="lg">
    <Line data={salesData} />
  </Box>
);

export default SalesChart;
