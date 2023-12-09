import { View, Text, TextInput, Button, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import googlePng from '../assets/google.png'
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigate = useNavigation()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = new Animated.Value(0); // Initial value for opacity: 0

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Email: ', email, 'Password: ', password);
  };
  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView className="bg-slate-600 flex flex-1 justify-center items-center">
      <Animated.View className="flex w-full h-full bg-slate-900 justify-between items-center px-8 py-16 rounded-md"
        style={{
          opacity: fadeAnim,
        }}
      >
        <View>
          <Text className="text-xl text-white text-center">Welcome Back!</Text>
          <Text className="text-md text-white text-center mt-2">Please sign in to your account!</Text>
        </View>
        <View className="w-full">
          <TextInput
            className="text-white w-full mb-4 p-4 bg-gray-700 rounded-lg"
            placeholder="Enter your email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="text-white w-full mb-8 p-4 bg-gray-700 rounded-lg"
            placeholder="Enter your password"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity>
            <Text className="text-gray-400 text-right">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full flex items-center">
          <TouchableOpacity className="bg-blue-500 rounded-lg w-full" title="Login" onPress={handleLogin}>
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
