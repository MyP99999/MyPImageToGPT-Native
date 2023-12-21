import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import Navbar from '../components/Navbar'
import { useHistory } from '../context/useHistory'
import History from '../components/History'
import coin from "../assets/coin.png"
import { SelectList } from 'react-native-dropdown-select-list'
import { useTokens } from '../context/useTokens'
import axiosInstance, { refreshAccessToken } from '../api/axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import RNTesseractOcr from 'react-native-tesseract-ocr';

const MainScreen = () => {
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo-1106');
  const [prompt, setPrompt] = useState('code')
  const [price, setPrice] = useState(1)
  const { open, fetchHistory } = useHistory()
  const { user, checkToken } = useAuth();
  const { tokens, spendTokens } = useTokens()
  const [image, setImage] = useState('')

  const modelOptions = [
    { key: 'gpt-3.5-turbo-1106', value: 'gpt-3.5' },
    { key: 'gpt-4-1106-preview', value: 'gpt-4' },
  ];
  const promptOptions = [
    { key: 'code', value: 'code' },
    { key: 'ceva', value: 'ceva' },
  ];

  async function handleSubmit() {
    await checkToken();
    setResult('');
    if (tokens >= price) {
      // setLoading(true);
      try {
        const response = await axiosInstance.get('/bot/chat', {
          params: {
            prompt: inputValue,
            userId: user.id,
            price: price,
            model: model,
          }
        });
        const data = response.data.toString();
        setResult(data);
        setInputValue('');
        fetchHistory()
        // setSelectedImage(null)
        spendTokens(price)
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    } else {
      alert("You don't have enough tokens!");
    }
  }

  const calculatePrice = useCallback((text, model) => {
    const letterCount = text.replace(/\s/g, '').length; // Remove spaces to count only letters
    let price = 1;
    if (letterCount > 100) {
      // Subtract the first 100 free characters and calculate the price for the remaining characters
      price += Math.ceil((letterCount - 100) / 100);
    }
    if (model == 'gpt-4-1106-preview') {
      price += 4; // Add 5 tokens for GPT-4
    }
    return price;
  }, []);

  useEffect(() => {
    setPrice(calculatePrice(inputValue, model));
  }, [inputValue, model, calculatePrice]);

  const getPermissionAsync = async () => {
    // Camera roll permissions
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      let img = result.assets[0].uri

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(img); // Correctly accessing the URI from the assets array
      }
    } catch (E) {
      console.log(E);
    }
  };

  const takeImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        console.log(result.uri);
        // You can setState here to display the image or use the image URI as needed
      }
    } catch (E) {
      console.log(E);
    }
  };

  const tessOptions = {
    whitelist: null,  // Add any Tesseract options you need
    blacklist: null
  };

  const recognizeTextFromImage = async () => {
    try {
      console.log(image)
      if (image) {

        const recognizedText = await RNTesseractOcr.recognize(image, RNTesseractOcr.LANG_ENGLISH, tessOptions);
        console.log('OCR Result: ', recognizedText);
        // Process the recognized text as needed
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View className="h-full w-full">
      <Navbar />
      {open ? (
        <History />
      ) : (
        <View className="flex-1 bg-slate-800">
          <ScrollView className="bg-slate-500 flex-1 p-3">
            <Text className="text-white text-lg">{result}</Text>
          </ScrollView>
          <View className="bg-slate-900 flex-1 ">
            <View className="flex flex-row justify-between items-center p-2">
              <View style={{ position: 'relative', width: '25%' }}>
                <SelectList
                  setSelected={setModel}
                  data={modelOptions}
                  search={false}
                  boxStyles={{
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    backgroundColor: '#16191C',
                    padding: 0,
                    maxWidth: 90,
                    alignSelf: 'center',
                  }}
                  maxHeight={150}
                  inputStyles={{
                    color: 'white',
                    fontSize: 12,
                  }}
                  dropdownStyles={{
                    position: 'absolute', // Set position to absolute
                    top: '100%', // Position it right below the input box
                    left: 0,
                    right: 0,
                    backgroundColor: 'gray',
                    zIndex: 1000, // Ensure it's above other element
                  }}
                  dropdownItemStyles={{
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                    margin: 3,
                  }}
                  dropdownTextStyles={{
                    color: 'white',
                    fontSize: 12,
                  }}
                  defaultOption={modelOptions.find(option => option.key === model)} // Find the default option based on state
                />
                <View className='mt-4'>
                  <SelectList
                    setSelected={setPrompt}
                    data={promptOptions}
                    search={false}
                    boxStyles={{
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      backgroundColor: '#16191C',
                      padding: 0,
                      maxWidth: 90,
                      alignSelf: 'center',
                    }}
                    maxHeight={150}
                    inputStyles={{
                      color: 'white',
                      fontSize: 12,
                    }}
                    dropdownStyles={{
                      position: 'absolute', // Set position to absolute
                      top: '100%', // Position it right below the input box
                      left: 0,
                      right: 0,
                      backgroundColor: 'gray',
                      zIndex: 1000, // Ensure it's above other element
                    }}
                    dropdownItemStyles={{
                      borderBottomWidth: 1,
                      borderBottomColor: '#eee',
                      margin: 3,
                    }}
                    dropdownTextStyles={{
                      color: 'white',
                      fontSize: 12,
                    }}
                    defaultOption={promptOptions.find(option => option.key === prompt)} // Find the default option based on state
                  />
                </View>
              </View>
              <View className='w-24'>
                <Button title="Pick an image from camera roll" onPress={pickImage} />
                <Button title="Take a photo" onPress={takeImage} />
              </View>

              <TouchableOpacity className="p-3 bg-blue-600 rounded-md">
                <Text className="text-white" onPress={recognizeTextFromImage}>Extract Text</Text>
              </TouchableOpacity>
              <View className="flex flex-row items-center">
                <Text className="text-white">Price: </Text>
                <Text className="text-yellow-500">{price}</Text>
                <Image source={coin} className='w-4 h-4' alt="add" />
              </View>
            </View>
            <View className="flex-1 border-2 mt-8 mx-2 border-gray-700 bg-gray-700 rounded-lg">
              <TextInput
                value={inputValue}
                onChangeText={setInputValue}
                className="h-full w-full text-white font-semibold p-2"
                textAlignVertical="top"
                multiline
              />
            </View>
            <TouchableOpacity className="bg-blue-600 w-1/3 mx-auto my-3 p-2 rounded-md" onPress={handleSubmit}>
              <Text className='text-center text-white'>Resolve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
      }
    </View >
  )
}

export default MainScreen