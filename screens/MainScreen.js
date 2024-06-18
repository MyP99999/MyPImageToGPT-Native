import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import Navbar from '../components/Navbar'
import { useHistory } from '../context/useHistory'
import History from '../components/History'
import { SelectList } from 'react-native-dropdown-select-list'
import coin from "../assets/coin.png"
import addphoto from "../assets/addimage.png"
import takephoto from "../assets/takephoto.png"
import { useTokens } from '../context/useTokens'
import axiosInstance, { refreshAccessToken } from '../api/axios'
import * as ImagePicker from 'expo-image-picker';

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
  const [imageLoading, setImageLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [resultLoading, setResultLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
console.log(image)
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
    setResultLoading(true)
    setResult('');
    if (tokens >= price) {
      // setLoading(true);
      try {
        const response = await axiosInstance.post('/bot/chat', {
          prompt: inputValue,
          userId: user.id,
          price: price,
          model: model,
        });
        const data = response.data.toString();
        setResultLoading(false)
        setResult(data);
        setInputValue('');
        fetchHistory()
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

  const pickImage = async () => {
    setImage('')
    setImageLoading(true)
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
        console.log("uploaded")
        setImageLoading(false)

      }
    } catch (E) {
      console.log(E);
    }
  };

  const takeImage = async () => {
    setImage('')
    setImageLoading(true)

    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      let img = result.assets[0].uri
      console.log(result)
      console.log(img)

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(img); // Correctly accessing the URI from the assets array
        console.log("uploaded")
        setImageLoading(false)

      }
    } catch (E) {
      console.log(E);
    }
  };


  const doOCR = async () => {
    setOcrLoading(true)
    console.log(image)
    const formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg', // or the correct type of your image
      name: 'upload.jpg',
    });

    try {
      const response = await axiosInstance.post('/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setOcrLoading(false)
      setInputValue(response.data)
    } catch (error) {
      console.error(error);
    }
  };

  const toggleCheckbox = () => {
    setIsChecked(!isChecked);
  }


  return (
    <View
      className="h-full w-full"
    >
      <Navbar />
      {open ? (
        <History />
      ) : (
        <View className="flex-1 bg-slate-800">
          <ScrollView className="bg-slate-500 flex-1 p-3">
            <Text className="text-white text-lg">{resultLoading ? 'Loading..' : result}</Text>
          </ScrollView>
          <View className="bg-slate-900 flex-1 justify-center ">
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
                <View className='mt-2 hidden'>
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
              <View className='flex justify-center items-center'>

                <View className='flex flex-row w-8 h-8 gap-1 justify-center'>
                  <TouchableOpacity onPress={pickImage}>
                    <Image source={addphoto} alt="add" className='w-7 h-7' />
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={takeImage}>
                    <Image source={takephoto} alt="add" className='w-7 h-7' />
                  </TouchableOpacity> */}
                </View>

                <TouchableOpacity className="p-3 bg-blue-600 rounded-md w-full">
                  <Text className="text-white" onPress={doOCR}>Extract Text</Text>
                </TouchableOpacity>
                {/* Checkbox Input */}
                {/* <TouchableOpacity onPress={toggleCheckbox} className="mt-3">
                  <View className="flex flex-row items-center">
                    <View style={{
                      width: 20,
                      height: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: '#000',
                      backgroundColor: isChecked ? '#000' : '#FFF',
                      marginRight: 8,
                    }}>
                      {isChecked ? (
                        <Text style={{ color: 'white' }}>✓</Text>
                      ) : (
                        <Text style={{ color: 'black' }}>X</Text>
                      )}
                    </View>
                    <Text className='text-white'>Complex OCR</Text>
                  </View>
                </TouchableOpacity> */}
                {image &&
                  <View>
                    <Text className="text-green-400 text-center">Uploaded!</Text>
                    <TouchableOpacity className="w-4 mx-auto" onPress={() => setImage('')}>
                      <Text className="text-center text-white bg-red-500">X</Text>
                    </TouchableOpacity>
                  </View>
                }


              </View>
              <View className="flex flex-row j items-center w-1/4">
                <Text className="text-white">Price: </Text>
                <Text className="text-yellow-500 mr-1">{price}</Text>
                <Image source={coin} className='w-4 h-4' alt="add" />
              </View>
            </View>
            <View className="flex-1  mt-2 mx-2  bg-gray-600 rounded-lg p-2">
              <TextInput
                value={inputValue}
                placeholder={ocrLoading ? 'Loading...' : 'Enter your prompt or extract it from a photo'}
                placeholderTextColor="#C0C0C0"
                onChangeText={setInputValue}
                className="h-full w-full text-white font-semibold"
                textAlignVertical="top"
                multiline
              />
            </View>
            <TouchableOpacity disabled={imageLoading || ocrLoading} className="bg-blue-600 mx-auto my-3 p-2 rounded-md" onPress={handleSubmit}>
              <Text className='text-center text-white'>Resolve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
      }
    </View>
  )
}

export default MainScreen