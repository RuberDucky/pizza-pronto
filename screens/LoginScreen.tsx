import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { Container } from '../components/Container';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../context/AuthContext';
import { apiConfig } from 'config/env';

export const LoginScreen = () => {
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Make API call to the login endpoint
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(`${data.token}`);

      if (response.ok && data.token) {
        // Save the token using AuthContext
        await login(data.token);
        return true;
      } else {
        // If login failed, show error message
        Alert.alert('Login Failed', data.message || 'Please check your credentials and try again');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login Error', 'An error occurred during login. Please try again.');
      return false;
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View className="w-full max-w-sm items-center px-6">
          <Text className="mb-2 text-3xl font-bold">Welcome back</Text>
          <Text className="mb-8 text-center text-gray-500">
            Enter your credentials to access your account
          </Text>

          <LoginForm onLogin={handleLogin} />
        </View>
      </ScrollView>
    </Container>
  );
};
