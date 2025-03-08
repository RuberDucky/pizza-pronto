import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
}

export const Checkbox = ({ checked, onToggle, label }: CheckboxProps) => {
  return (
    <TouchableOpacity className="flex-row items-center" onPress={onToggle}>
      <View
        className={`flex h-5 w-5 items-center justify-center rounded border ${
          checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
        }`}>
        {checked && <Text className="text-xs text-white">✓</Text>}
      </View>
      <Text className="ml-2 text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
};
