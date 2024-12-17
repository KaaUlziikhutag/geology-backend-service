import { ResourceOptions } from 'adminjs';
import axios from 'axios';

export const referenceNav: ResourceOptions['navigation'] = {
  name: 'reference',
  icon: 'Book',
};
export const customerNav: ResourceOptions['navigation'] = {
  name: 'Customer',
  icon: 'User',
};

export const companyNav: ResourceOptions['navigation'] = {
  name: 'Company',
  icon: 'Briefcase',
};
export const productNav: ResourceOptions['navigation'] = {
  name: 'Product',
  icon: 'Clipboard',
};
export const paymentNav: ResourceOptions['navigation'] = {
  name: 'payment',
  icon: 'DollarSign',
};

export const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY':
      'cH5BFgWYzUxUpFVjA98Cbp8UzOBqsqAJYniFMRKJCEpX6dePoMp0rfhKXUa3U1aGItLAw4s9FHbT3q3Our8yDuAhu2kMicgcqRJjnxMFhJohvT8qlpcbTu2UCLZfE1tY',
  },
});
