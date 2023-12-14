import { View, Text, TextInput, Button, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import googlePng from '../assets/google.png'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/useAuth';
import axiosInstance from '../api/axios';
import 'core-js/stable/atob';
import { jwtDecode } from 'jwt-decode';

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
      console.log(data.token)
      const user = jwtDecode(data.token); // Decode JWT to get user data
      console.log(user)
      login(user, { accessToken: data.token, refreshToken: data.refreshToken });
      navigate.navigate('Main');
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error.response?.data?.message || 'Error logging in';
      console.error('Login error:', errorMessage);
      alert(errorMessage);
    }
    
  };



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
          <TouchableOpacity>
            <Image source={googlePng} className="h-12 w-12 my-4" />
          </TouchableOpacity>
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
