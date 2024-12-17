import React, { useEffect, useState } from 'react';
import { useCurrentAdmin } from 'adminjs';
import { Select } from '@adminjs/design-system';
import { apiClient } from '../constants.js';

const DistrictSelect = (props) => {
  const { onChange, record } = props;
  const [districts, setDistricts] = useState([]);
  const [currentAdmin] = useCurrentAdmin();

  useEffect(() => {
    const fetchDistricts = async () => {
      if (record?.params?.provinceId) {
        const response = await apiClient.get(
          `/reference/district/${record?.params?.provinceId}`,
          {
            headers: {
              Authorization: `Bearer ${currentAdmin?.token}`,
            },
          },
        );
        if (response.status == 200) {
          setDistricts(
            response.data?.response?.map((d) => ({
              value: d.id,
              label: d.name,
            })),
          );
        }
      }
    };
    fetchDistricts();
  }, [record?.params?.provinceId]);

  return (
    <Select
      value={record?.params?.districtId}
      options={districts}
      onChange={(selected) => onChange('districtId', selected.value)}
    />
  );
};

export default DistrictSelect;
