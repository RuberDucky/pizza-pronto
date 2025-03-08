import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Order } from '../services/orderService';
import { formatDate } from '../utils/dateUtils';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(order)}
      className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{order.customerInfo.name}</Text>
          <Text className="text-gray-500">{formatDate(order.createdAt)}</Text>
        </View>

        <View>
          <Text
            className={`rounded-full px-2 py-1 text-center text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </Text>
        </View>
      </View>

      <View className="mt-2">
        <Text className="text-sm text-gray-700">
          {order.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup'}
        </Text>

        <Text className="mt-1 text-sm font-medium text-gray-700">
          {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
        </Text>

        {order.orderType === 'delivery' && (
          <Text className="mt-1 text-sm text-gray-600">
            📍 {order.customerInfo.street} {order.customerInfo.houseNumber},{' '}
            {order.customerInfo.postalCode} {order.customerInfo.city}
          </Text>
        )}
      </View>

      <View className="mt-3 border-t border-gray-200 pt-2">
        <Text className="text-right text-lg font-bold">€{order.grandTotal.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};
