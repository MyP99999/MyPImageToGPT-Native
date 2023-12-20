import { View, Text, TextInput, Button, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import googlePng from '../assets/google.png'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/useAuth';
import axiosInstance from '../api/axios';
import 'core-js/stable/atob';
import { jwtDecode } from 'jwt-decode';
import * as Google from "expo-auth-session/providers/google";

const LoginScreen = () => {
  const navigate = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = new Animated.Value(0); // Initial value for opacity: 0
  const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/authenticate', {
        username: email,
        password: password
      });
      const data = response.data;
      const user = jwtDecode(data.token); // Decode JWT to get user data

      login(user, { accessToken: data.token, refreshToken: data.refreshToken });
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || 'Error logging in';
      console.error('Login error:', errorMessage);
      alert(errorMessage);
    }
  };

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }
    ).start();
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "395725889654-nfgjk3jk44phk9ib9od38uc4uevreoj3.apps.googleusercontent.com",
    iosClientId: "",
    webClientId: "395725889654-d7s1b1bo6jfcc88v7lud9no33a2v6hoe.apps.googleusercontent.com",
    offlineAccess: true,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile

  });

  const onGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error('Google Sign-In initiation error:', error);
    }
  };
  
  useEffect(() => {
    const handleGoogleResponse = async () => {
      if (response?.type === 'success') {
        try {
          const token = response.authentication.accessToken;
          const res = await axiosInstance.post(`/api/auth/googleNative?code=${token}`);
          if (res.data.token) {
            const user = jwtDecode(res.data.token);
            login(user, { accessToken: res.data.token, refreshToken: res.data.refreshToken });
            navigate.navigate('Home');
          } else {
            console.error('Failed to log in');
          }
        } catch (error) {
          console.error('Google Sign-In processing error:', error);
        }
      }
    };
  
    if (response) {
      handleGoogleResponse();
    }
  }, [response]); // This useEffect will run whenever 'response' changes
  
  return (
    <SafeAreaView className="bg-slate-700 flex flex-1 justify-center items-center">
      <Animated.View className="flex w-full h-full bg-slate-900 justify-between items-center px-8 py-16"
      >
        <View>
          <Text className="text-xl text-white text-center">Welcome Back!</Text>
          <Text className="text-md text-white text-center mt-2">Please sign in to your account!</Text>
        </View>
        <View className="w-full">
          <TextInput
            className="text-white w-full mb-4 p-4 bg-gray-700 rounded-2xl"
            placeholder="Enter your email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="text-white w-full mb-8 p-4 bg-gray-700 rounded-2xl"
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => navigate.navigate('Forgot')}>
            <Text className="text-gray-400 text-right">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex items-center">
          <TouchableOpacity className="bg-blue-500 rounded-xl w-full" title="Login" onPress={handleSubmit}>
            <Text className="text-lg text-white p-4 text-center">Sign In</Text>
          </TouchableOpacity>
          <Text className="text-xl text-white mt-8">or</Text>
          <Text className="text-xl text-white mt-8">Sign in with Google</Text>
          <Text>

            <Button
              title="Sign in with Google"
              // disabled={!request}
              onPress={
                onGoogleLogin
              }
            />;
          </Text>

          <View className="flex flex-row justify-center items-center gap-1">
            <Text className="text-lg text-white">Don't Have An Account?</Text>
            <TouchableOpacity onPress={() => navigate.navigate('Register')}>
              <Text className="text-lg text-blue-500">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default LoginScreen;
