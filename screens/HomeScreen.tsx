import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container } from '../components/Container';
import { useAuth } from '../context/AuthContext';
import { Order, fetchOrders } from '../services/orderService';
import { OrderCard } from '../components/OrderCard';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const { userToken, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const loadOrders = async () => {
    try {
      setError(null);
      const data = await fetchOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { order });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Container>
        <View className="flex-1 px-4">
          <View className="flex-row items-center justify-between pb-4 pt-12">
            <Text className="text-2xl font-bold">Orders</Text>
            <TouchableOpacity onPress={handleLogout} className="p-2">
              <Ionicons name="log-out-outline" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          {loading && !refreshing ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="mt-2 text-gray-600">Loading orders...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-red-600">{error}</Text>
              <TouchableOpacity
                onPress={loadOrders}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2">
                <Text className="text-white">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : orders.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Ionicons name="receipt-outline" size={64} color="#CBD5E1" />
              <Text className="mt-4 text-lg text-gray-400">No orders found</Text>
            </View>
          ) : (
            <FlatList
              data={orders}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => <OrderCard order={item} onPress={handleOrderPress} />}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          )}
        </View>
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
});
