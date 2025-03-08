import AsyncStorage from '@react-native-async-storage/async-storage';

// Save token to AsyncStorage
export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

// Get token from AsyncStorage
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Remove token from AsyncStorage (for logout)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('userToken');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};
