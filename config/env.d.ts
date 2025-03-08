import { API_BASE_URL } from '@env';

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    login: '/admin/login',
    orders: '/orders/getOrders/admin',
    
  },
};