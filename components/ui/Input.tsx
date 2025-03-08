import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  error?: string;
}

export const Input = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder = '',
  error,
}: InputProps) => {
  return (
    <View className="mb-4">
      <Text className="mb-1.5 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className={`rounded-md border px-3 py-2 text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
      />
      {error ? <Text className="mt-1 text-xs text-red-500">{error}</Text> : null}
    </View>
  );
};
