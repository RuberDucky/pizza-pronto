import { apiConfig } from 'config/env';
import { getToken } from '../utils/authUtils';

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  taxPercentage: number;
  size: string;
  _id: string;
}

export interface CustomerInfo {
  name: string;
  street: string;
  houseNumber: string;
  city: string;
  postalCode: string;
  floor: string;
  phone: string;
}

export interface Order {
  _id: string;
  status: string;
  orderType: string;
  specialInstructions: string;
  orderItems: OrderItem[];
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  acceptedBy: string;
  createdBy: string;
  customerInfo: CustomerInfo;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  message: string;
  orders: Order[];
}

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const token = await getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.orders}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: OrdersResponse = await response.json();
    return data.orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};
