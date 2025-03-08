import { Order } from '../services/orderService';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  OrderDetail: { order: Order };
};
