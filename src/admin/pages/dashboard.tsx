import { Box, H1, H2, Link, Loader, Text } from '@adminjs/design-system';
import { ApiClient, useNotice, useTranslation } from 'adminjs';
import React, { FC, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, // Register category scale for the x-axis
  LinearScale, // Register linear scale for the y-axis
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardHeader from '../components/dashboard-header.js';
import SalesChart from '../components/sales-chart.js';

const api = new ApiClient();
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
type ApiGetPageResponse = { text: string };

const fetchChartData = async () => {
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'User Registrations',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.1,
      },
    ],
  };
};
const Dashboard: FC = () => {
  const [chartData, setChartData] = useState(null);
  const addNotice = useNotice();
  const {
    tc,
    tm,
    i18n: { language },
  } = useTranslation();

  useEffect(() => {
    // Fetch the chart data
    fetchChartData().then((data) => setChartData(data));
  }, []);
  // useEffect(() => {
  //   api.getPage<ApiGetPageResponse>({ pageName: 'customPage' }).then((res) => {
  //     setText(tm(res.data.text, { defaultValue: res.data.text }));
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [language]);

  const sendSimpleNotice = () =>
    addNotice({
      message: 'CustomPage.message',
      type: 'success',
    });

  const sendTranslatedNotice = () =>
    addNotice({
      message: 'CustomPage.messageWithInterpolation',
      options: {
        someParams: ['param 1', 'param2'].join(', '),
      },
      body: (
        <>
          {tm('CustomPage.message')} <Link>{tc('CustomPage.button')}</Link>
        </>
      ),
    } as any);

  return (
    <Box variant="grey" padding="xl">
      <H1>Хянах самбар</H1>
      <DashboardHeader />
      {/* <SalesChart /> */}
    </Box>
  );
};

export default Dashboard;
