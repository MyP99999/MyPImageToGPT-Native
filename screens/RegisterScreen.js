import { View, Text, TextInput, Button, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import googlePng from '../assets/google.png'
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../api/axios';

const RegisterScreen = () => {
  const navigate = useNavigation()
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const fadeAnim = new Animated.Value(0); // Initial value for opacity: 0

  const handleRegister = async () => {
    try {
      const response = await axiosInstance.post('/api/auth/register', {
        username,
        email,
        password
      });
      if (response.status === 200 || response.status === 201) { // Check for successful response status
        alert("You have received an email to activate the account!")
      } else {
        // Handle errors, show messages to user
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
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

  return (
    <SafeAreaView className="bg-slate-700 flex flex-1 justify-center items-center">
      <Animated.View className="flex w-full h-full bg-slate-900 justify-between items-center px-8 py-16"
        style={{
          opacity: fadeAnim,
        }}
      >
        <View>
          <Text className="text-xl text-white text-center">Create New Account</Text>
          <Text className="text-md text-white text-center mt-2">Please fill in the form to continue</Text>
        </View>
        <View className="w-full">
          <TextInput
            className="text-white w-full mb-4 p-4 bg-gray-700 rounded-2xl"
            placeholder="Enter your username"
            placeholderTextColor="#ccc"
            value={username}
            onChangeText={setUsername}
          />
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
        </View>
        <View className="w-full flex items-center">
          <TouchableOpacity className="bg-blue-500 rounded-xl w-full" onPress={handleRegister}>
            <Text className="text-lg text-white p-4 text-center">Sign Up</Text>
          </TouchableOpacity>
          <Text className="text-xl text-white mt-8">or</Text>
          <Text className="text-xl text-white mt-8">Sign Up with Google</Text>
          <TouchableOpacity>
            <Image source={googlePng} className="h-12 w-12 my-4" />
          </TouchableOpacity>
          <View className="flex flex-row justify-center items-center gap-1">
            <Text className="text-lg text-white">Already Have An Account?</Text>
            <TouchableOpacity onPress={() => navigate.navigate('Login')}>
              <Text className="text-lg text-blue-500">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default RegisterScreen