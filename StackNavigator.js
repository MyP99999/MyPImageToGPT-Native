import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import MainScreen from './screens/MainScreen';
import PaymentScreen from './screens/PaymentScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPassScreen from './screens/ForgotPassScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {

    const { user } = false;

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: ({ current }) => {
                    return {
                        cardStyle: {
                            opacity: current.progress,
                        },
                    };
                },
            }}
        >
            {user ? (
                <>
                    <Stack.Group>
                        <Stack.Screen name="Main" component={MainScreen} />
                        <Stack.Screen name="Payment" component={PaymentScreen} />
                    </Stack.Group>
                </>
            ) : (
                <Stack.Group>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="Forgot" component={ForgotPassScreen} />
                </Stack.Group>
            )}
        </Stack.Navigator>
    )
}

export default StackNavigator