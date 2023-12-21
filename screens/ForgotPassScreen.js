import { View, Text, TextInput, Button, Image, TouchableOpacity, Animated } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import Icon
import axiosInstance from '../api/axios';

const ForgotPassScreen = () => {
    const navigate = useNavigation()
    const [email, setEmail] = useState('');
    const fadeAnim = new Animated.Value(0); // Initial value for opacity: 0

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(email)
        try {
            const response = await axiosInstance.post(`/api/auth/forgot-password?email=${email}`)

            console.log(response)
            if (response.status === 200 || response.status === 201) { // Check for successful response status
                alert("You have received an email to reset your password!")
            } else {
                // Handle errors, show messages to user
                console.error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during reseting.');
        }
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
    }, []);

    return (
        <SafeAreaView className="bg-slate-700 flex flex-1 justify-center items-center">
            <Animated.View className="flex w-full h-full bg-slate-900 justify-between items-center px-8 py-16"
                style={{
                    opacity: fadeAnim,
                }}
            >
                <View className="w-full">
                    <TouchableOpacity onPress={() => navigate.navigate('Login')}>
                        <Icon name="arrow-left" size={40} color="#fff" />
                    </TouchableOpacity>
                    <View className="mt-12">
                        <Text className="text-xl text-white text-center">Forgot password?</Text>
                        <Text className="text-md text-white text-center mt-2">Please enter your email!</Text>
                    </View>
                </View>
                <View className="w-full mb-52">
                    <TextInput
                        className="text-white w-full mb-4 p-4 bg-gray-700 rounded-2xl"
                        placeholder="Enter your email"
                        placeholderTextColor="#ccc"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TouchableOpacity className="bg-blue-500 rounded-xl w-full" onPress={handleSubmit}>
                        <Text className="text-lg text-white p-4 text-center">Submit</Text>
                    </TouchableOpacity>
                </View>
                <View className="w-full flex items-center">
                    <Text></Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

export default ForgotPassScreen