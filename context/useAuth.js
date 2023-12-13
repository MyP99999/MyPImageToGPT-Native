import React, { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import statement for jwt-decode
import axiosInstance from '../api/axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    return exp ? (Date.now() / 1000) > exp : false;
  } catch (error) {
    console.error('Error decoding the token:', error);
    return true;
  }
};

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await axiosInstance.post(
      'http://localhost:8080/api/auth/refresh-token?refreshToken=' + refreshToken
    );
    const { token } = response.data;
    await AsyncStorage.setItem('accessToken', token);
    return token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const bootstrapAsync = async () => {
      let accessToken;
      let refreshToken;
      try {
        accessToken = await AsyncStorage.getItem('accessToken');
        refreshToken = await AsyncStorage.getItem('refreshToken');
      } catch (e) {
        console.error('Error getting tokens:', e);
      }

      if (accessToken && !isTokenExpired(accessToken)) {
        setUser(jwtDecode(accessToken));
      } else if (refreshToken && !isTokenExpired(refreshToken)) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);
          if (newAccessToken) {
            setUser(jwtDecode(newAccessToken));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Error while refreshing token:', error);
          logout();
        }
      } else {
        logout();
      }
    };

    bootstrapAsync();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
    } catch (e) {
      console.error('Error removing tokens:', e);
    }
    setUser(null);
    navigation.navigate('Login');
  };

  const login = async (userData, tokens) => {
    try {
      await AsyncStorage.setItem('accessToken', tokens.accessToken);
      await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
      console.log(AsyncStorage.getItem('accessToken'))
      console.log(AsyncStorage.getItem('refreshToken'))
    } catch (e) {
      console.error('Error storing tokens:', e);
    }
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
