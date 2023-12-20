// TokenPurchasePage.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../context/useAuth';
import axiosInstance from '../api/axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutForm = () => {
  const { confirmPayment, handleCardAction } = useStripe();
  const [amount, setAmount] = useState('');
  const [cardDetails, setCardDetails] = useState();
  const [loading, setLoading] = useState(false);
  const { user, checkToken, refreshAccessToken } = useAuth()
  const navigation = useNavigation()

  const handleSubmit = async () => {
    await checkToken();

    if (!cardDetails?.complete || !amount) {
      Alert.alert("Error", "Please enter complete card details and amount.");
      return;
    }
    setLoading(true);
  
    try {
      const parsedAmount = parseInt(amount, 10);
  
      const response = await axiosInstance.post('/create-payment-intent', {
        amount: parsedAmount,
        userId: user?.id,
      });
      const clientSecret = response.data.clientSecret;
      
      const paymentIntent = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });
      
      if (paymentIntent.error) {
        Alert.alert("Error", paymentIntent.error.message);
      } else {
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        refreshAccessToken(refreshToken)
        navigation.navigate('Main')
        Alert.alert("Success", "Payment succeeded!");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={amount}
        onChangeText={(newAmount) => setAmount(newAmount)}
        placeholder="Amount"
        keyboardType="numeric"
      />

      <CardField
        postalCodeEnabled={false}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handleSubmit} title="Pay" disabled={loading} />
    </View>
  );
};

const PaymentScreen = () => {
  return <CheckoutForm />;
};

export default PaymentScreen;
