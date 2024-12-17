import React, { useEffect, useState } from 'react';
import { Box, H2, Text } from '@adminjs/design-system';
import { apiClient } from '../constants.js';
import { CustomerType } from '../../utils/enum-utils.js';

const StatisticCard = ({ title, value }) => (
  <Box
    backgroundColor="#E6F7FF" // Light blue color
    padding="lg"
    borderRadius="lg"
    width="18%" // Adjust the width to be smaller for each card
    height="120px"
    display="flex"
    flexDirection="column"
    justifyContent="space-between"
    alignItems="center" // Center align the text
  >
    <Text color="grey100" fontSize="xl">
      {title}
    </Text>
    <Box display="flex" justifyContent="space-between" width="100%">
      <H2 color="grey900" fontSize="xl">
        {value}
      </H2>
    </Box>
  </Box>
);
const DashboardHeader = () => {
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalCitizen, setTotalCitizen] = useState(0);
  const [totalOrganization, setTotalOrganization] = useState(0);
  const [totalMineral, setTotalMineral] = useState(0);
  const [totalAppointment, setTotalAppointment] = useState(0);
  useEffect(() => {
    const getTotalCustomer = async () => {
      const response = await apiClient.get('/dashboard/count-customer');
      setTotalCustomer(response.data?.response ?? 0);
    };
    const getTotalCitizen = async () => {
      const response = await apiClient.get('/dashboard/count-customer', {
        params: CustomerType.individual,
      });
      setTotalCitizen(response.data?.response ?? 0);
    };
    const getTotalOrganization = async () => {
      const response = await apiClient.get('/dashboard/count-customer', {
        params: CustomerType.organization,
      });
      setTotalOrganization(response.data?.response ?? 0);
    };
    const getTotalMineral = async () => {
      const response = await apiClient.get('/dashboard/count-mineral');
      setTotalMineral(response.data?.response ?? 0);
    };
    const getTotalAppointment = async () => {
      const response = await apiClient.get('/dashboard/count-appointment');
      setTotalAppointment(response.data?.response ?? 0);
    };
    getTotalCustomer();
    getTotalCitizen();
    getTotalOrganization();
    getTotalMineral();
    getTotalAppointment();
  }, []);
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      mb="xl"
      padding="md"
      backgroundColor="white"
    >
      <StatisticCard title="Нийт үйлчлүүлэгчдийн тоо" value={totalCustomer} />
      <StatisticCard title="Нийт дээжийн тоо" value={totalMineral} />
      <StatisticCard title="Нийт захиалага" value={totalAppointment} />
      <StatisticCard title="Хувь хүн" value={totalCitizen} />
      <StatisticCard title="Байгууллага" value={totalOrganization} />
    </Box>
  );
};
export default DashboardHeader;
