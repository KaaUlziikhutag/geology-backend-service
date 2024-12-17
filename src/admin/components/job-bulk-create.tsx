// /admin/components/BulkCreate.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  CheckBox,
} from '@adminjs/design-system';
import { ApiClient } from 'adminjs';

// Placeholder options for dropdowns - can be replaced with real data later
const labOptions = [
  { value: 1, label: 'Lab 1' },
  { value: 2, label: 'Lab 2' },
];
const serviceOptions = [
  { value: 1, label: 'Service 1' },
  { value: 2, label: 'Service 2' },
];
const methodOptions = [
  { value: 1, label: 'Method 1' },
  { value: 2, label: 'Method 2' },
];

const BulkCreate = ({ action, resource, record, currentAdmin }) => {
  const api = new ApiClient();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([
    { lab: '', service: '', method: '', isActive: false },
  ]);
  const [laboratories, setLaboratories] = useState([]);
  const [products, setProducts] = useState([]);
  // Handler for adding a new empty row
  const handleAddRow = () => {
    setRows([...rows, { lab: '', service: '', method: '', isActive: false }]);
  };

  // Handler for removing a row
  const handleRemoveRow = (index) => {
    setRows(rows.filter((_, idx) => idx !== index));
  };

  // Handler for updating row data
  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  // Handler for bulk creation
  const handleBulkCreate = async () => {
    try {
      const response = await action.callApi({
        data: rows,
        recordId: record?.id,
      });
      if (response?.data?.message) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error while bulk creating:', error);
      alert('Bulk creation failed.');
    }
  };
  useEffect(() => {
    const fetchLaboratory = async () => {
      setLoading(true);
      const response = await api.resourceAction({
        resourceId: 'Laboratory',
        actionName: 'list',
      });
      setLaboratories(
        response.data.records.map((record) => ({
          value: record.id,
          label: record.params.name,
        })),
      );
      setLoading(false);
    };
    const fetchProducts = async () => {
      setLoading(true);
      const response = await api.resourceAction({
        resourceId: 'Product',
        actionName: 'list',
      });
      setProducts(
        response.data.recourds.map((record) => ({
          value: record.id,
          label: record.params.name,
        })),
      );
      setLoading(false);
    };
    fetchLaboratory();
    fetchProducts();
  }, []);
  if (loading) return <div>Loading...</div>;
  return (
    <Box variant="grey" padding="lg">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Лаборатори</TableCell>
            <TableCell>Үйлчилгээ</TableCell>
            <TableCell>Аргачлал</TableCell>
            <TableCell>Идэвхтэй эсэх</TableCell>
            <TableCell>Үйлдэл</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={row.lab}
                  options={laboratories}
                  placeholder="Лаборатори сонгох"
                  onChange={(value) =>
                    handleRowChange(index, 'lab', value ? value.value : '')
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={row.service}
                  options={serviceOptions}
                  placeholder="Select Service"
                  onChange={(value) =>
                    handleRowChange(index, 'service', value ? value.value : '')
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={row.method}
                  options={methodOptions}
                  placeholder="Select Method"
                  onChange={(value) =>
                    handleRowChange(index, 'method', value ? value.value : '')
                  }
                />
              </TableCell>
              <TableCell>
                <CheckBox
                  checked={row.isActive}
                  onChange={(e) => handleRowChange(index, 'isActive', e.target)}
                />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleRemoveRow(index)}
                  variant="primary"
                  size="sm"
                >
                  Засах
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleRemoveRow(index)}
                  variant="danger"
                  size="sm"
                >
                  Устгах
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={5} textAlign="center">
              <Button onClick={handleAddRow} variant="success">
                Нэмэх
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box marginTop="lg">
        <Button onClick={handleBulkCreate} variant="primary" size="lg">
          Хадгалах
        </Button>
      </Box>
    </Box>
  );
};

export default BulkCreate;
