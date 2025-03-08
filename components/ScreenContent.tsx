import React from 'react';
import { View, Text } from 'react-native';
import { Container } from './Container';
import { EditScreenInfo } from './EditScreenInfo';

interface ScreenContentProps {
  title: string;
  path: string;
}

export const ScreenContent = ({ title, path }: ScreenContentProps) => {
  return (
    <Container>
      <View className="items-center">
        <Text className="text-xl font-bold">{title}</Text>
        <EditScreenInfo path={path} />
      </View>
    </Container>
  );
};
