import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Checkbox } from './ui/Checkbox';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        await onLogin(email, password);
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="w-full">
      <Text className="mb-6 text-center text-2xl font-bold">Login</Text>

      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        error={errors.email}
      />

      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter your password"
        error={errors.password}
      />

      <View className="mb-6 flex-row items-center justify-between">
        <Checkbox
          checked={rememberMe}
          onToggle={() => setRememberMe(!rememberMe)}
          label="Remember me"
        />
        <TouchableOpacity>
          <Text className="text-blue-600">Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <Button title="Sign in" onPress={handleSubmit} loading={loading} />

      <View className="mt-6 flex-row justify-center">
        <Text className="text-gray-600">Don't have an account?</Text>
        <TouchableOpacity className="ml-1">
          <Text className="font-medium text-blue-600">Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
