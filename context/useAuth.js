import React, { createContext, useContext, useEffect, useState } from 'react';
import 'core-js/stable/atob';
import { jwtDecode } from 'jwt-decode'; // Correct import statement for jwt-decode
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import axiosInstance from '../api/axios';

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
  console.log("first")
  try {
    const response = await axiosInstance.post(
      '/api/auth/refresh-token?refreshToken=' + refreshToken
    );
    const { token } = response.data;
    await AsyncStorage.setItem('accessToken', token);
    console.log("first2");
    // const userData = jwtDecode(token);
    // setUser(userData); // Update the user state with the new token data
    return token;
  } catch (error) {
    console.log('eroare')
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();


  const checkToken = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
   
    if (accessToken && !isTokenExpired(accessToken)) {
      console.log('valid access')
      setUser(jwtDecode(accessToken));
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
    }
    else if (refreshToken && !isTokenExpired(refreshToken)) {
      try {
        console.log('valid refresh')
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          setUser(jwtDecode(newAccessToken));
        } else {
          console.log('INvalid refresh')
          logout();
        }
      } catch (error) {
        console.error('Error while refreshing token:', error);
        logout();
      }
    } else if (user) {
      console.log('INvalid ACCESS')
      logout();
    }
  };

  useEffect(() => {
    checkToken()
  }, [])


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
    <AuthContext.Provider value={{ user, login, logout, setUser, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
