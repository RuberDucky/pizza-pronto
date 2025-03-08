import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Container } from '../components/Container';

export const SplashScreen = () => {
  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-lg">Loading...</Text>
      </View>
    </Container>
  );
};
