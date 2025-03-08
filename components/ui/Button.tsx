import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  onPress,
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 border-blue-600';
      case 'outline':
        return 'bg-transparent border-gray-300';
      case 'ghost':
        return 'bg-transparent border-transparent';
      default:
        return 'bg-blue-600 border-blue-600';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-white';
      case 'outline':
        return 'text-gray-800';
      case 'ghost':
        return 'text-blue-600';
      default:
        return 'text-white';
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-md border py-3 ${getButtonStyles()} ${
        disabled || loading ? 'opacity-50' : 'opacity-100'
      }`}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#0000ff'} />
      ) : (
        <Text className={`text-center font-medium ${getTextStyles()}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
