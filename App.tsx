import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SplashScreen } from './screens/SplashScreen';
import { OrderDetailScreen } from './screens/OrderDetailScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RootStackParamList } from './navigation/types';

import './global.css';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Main navigator component that depends on auth state
const RootNavigator = () => {
  const { isLoading, userToken } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        // User is signed in
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </>
      ) : (
        // User is not signed in
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
