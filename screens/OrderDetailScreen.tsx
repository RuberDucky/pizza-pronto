import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Container } from '../components/Container';
import { Order } from '../services/orderService';
import { formatDate } from '../utils/dateUtils';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { printReceipt } from '../services/printService';

// Define the navigation param list types
type RootStackParamList = {
  OrderDetail: { order: Order };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  printButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  printButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

// Define the navigation prop type
type OrderDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderDetail'>;

// Define the route prop type
type OrderDetailRouteProp = RouteProp<RootStackParamList, 'OrderDetail'>;

// Define props for the component
type OrderDetailScreenProps = {
  route: OrderDetailRouteProp;
};

// The component with proper typing
export const OrderDetailScreen = ({ route }: OrderDetailScreenProps) => {
  const { order } = route.params;
  const navigation = useNavigation<OrderDetailNavigationProp>();
  const [isPrinting, setIsPrinting] = useState(false);

  // Safe formatting function to handle potentially undefined values
  const formatPrice = (value?: number): string => {
    return value !== undefined ? `€${value.toFixed(2)}` : '€0.00';
  };

  // Handle printing order receipt
  const handlePrintOrder = async () => {
    setIsPrinting(true);
    try {
      await printReceipt(order);
      Alert.alert('Success', 'Receipt sent to printer');
    } catch (error) {
      console.error('Print error:', error);
      Alert.alert('Print Error', 'Failed to print receipt. Please check printer connection.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Container>
        <ScrollView className="flex-1 px-4 py-6">
          <View className="mb-6 flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
              <Text className="text-blue-600">← Back</Text>
            </TouchableOpacity>
            <Text className="text-2xl font-bold">Order Details</Text>
          </View>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-md">
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => {
                  const orderId = order._id;
                  Clipboard.setString(orderId);
                  Alert.alert('Copied!', 'Order ID copied to clipboard');
                }}
                className="flex-row items-center">
                <Text className="text-lg font-semibold">Order #{order._id}</Text>
                <Ionicons name="copy-outline" size={16} color="#4B5563" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
            <View className="mt-1 flex-row items-center justify-between">
              <Text className="text-gray-500">{formatDate(order.createdAt)}</Text>
              <View
                className={`rounded-full px-3 py-1 ${
                  order.status.toLowerCase() === 'completed'
                    ? 'bg-green-100'
                    : order.status.toLowerCase() === 'pending'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                }`}>
                <Text
                  className={`text-sm font-medium ${
                    order.status.toLowerCase() === 'completed'
                      ? 'text-green-800'
                      : order.status.toLowerCase() === 'pending'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                  }`}>
                  {order.status}
                </Text>
              </View>
            </View>
          </View>

          {/* Print button */}
          <TouchableOpacity
            style={styles.printButton}
            onPress={handlePrintOrder}
            disabled={isPrinting}>
            {isPrinting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Ionicons name="print-outline" size={20} color="white" />
            )}
            <Text style={styles.printButtonText}>
              {isPrinting ? 'Printing...' : 'Print Receipt'}
            </Text>
          </TouchableOpacity>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-md">
            <Text className="mb-2 text-lg font-semibold">Customer Information</Text>
            <Text className="text-gray-700">Name: {order.customerInfo.name}</Text>
            <Text className="text-gray-700">Phone: {order.customerInfo.phone}</Text>
            <Text className="text-gray-700">
              Address: {order.customerInfo.street} {order.customerInfo.houseNumber},
              {order.customerInfo.floor && ` Floor: ${order.customerInfo.floor},`}{' '}
              {order.customerInfo.postalCode} {order.customerInfo.city}
            </Text>
          </View>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-md">
            <Text className="mb-2 text-lg font-semibold">Order Items</Text>
            {order.orderItems.map((item, index) => (
              <View
                key={item._id}
                className={`${index > 0 ? 'mt-2 border-t border-gray-100 pt-2' : ''}`}>
                <View className="flex-row justify-between">
                  <Text className="flex-1 text-gray-800" style={{ flexWrap: 'wrap' }}>
                    {item.quantity}x {item.name}
                  </Text>
                  <Text className="ml-2 text-right font-medium" style={{ flexShrink: 0 }}>
                    {formatPrice(
                      item.price !== undefined && item.quantity !== undefined
                        ? item.price * item.quantity
                        : undefined
                    )}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Size: {item.size}</Text>
              </View>
            ))}
          </View>

          <View className="mb-6 rounded-lg bg-white p-4 shadow-md">
            <Text className="mb-2 text-lg font-semibold">Payment Summary</Text>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Subtotal</Text>
              <Text className="text-gray-700">{formatPrice(order.subtotal)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-700">Tax</Text>
              <Text className="text-gray-700">{formatPrice(order.totalTax)}</Text>
            </View>
            <View className="mt-2 border-t border-gray-200 pt-2">
              <View className="flex-row justify-between">
                <Text className="font-semibold">Total</Text>
                <Text className="font-bold">{formatPrice(order.grandTotal)}</Text>
              </View>
            </View>
          </View>

          {order.specialInstructions && (
            <View className="mb-6 rounded-lg bg-white p-4 shadow-md">
              <Text className="mb-2 text-lg font-semibold">Special Instructions</Text>
              <Text className="text-gray-700">{order.specialInstructions}</Text>
            </View>
          )}
        </ScrollView>
      </Container>
    </SafeAreaView>
  );
};
