import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import ToggleButton from './ToggleButton'
import coin from "../assets/coin.png"
import add from "../assets/add.png"
import { useTokens } from '../context/useTokens'
import { useHistory } from '../context/useHistory'
import { useNavigation } from '@react-navigation/native'

const Navbar = () => {
    const { tokens } = useTokens()
    const { toggleHistory } = useHistory()
    const navigation = useNavigation();

    return (
        <View className="bg-slate-900 h-16 flex flex-row items-center justify-between px-4">
            <ToggleButton toggleHistory={toggleHistory} />
            <TouchableOpacity className='bg-blue-400' onPress={() => navigation.navigate('Payment')
            }>
                <Text>
                    ceva
                </Text>
            </TouchableOpacity>
            <View className='flex flex-row gap-3 items-center'>
                <Image source={coin} alt="coin" className='w-8 h-8' />
                <Text className='font-semibold text-yellow-500 text-lg'>{tokens} tokens</Text>
                <TouchableOpacity className='text-3xl text-white font-semibold hover:text-yellow-500 hover:scale-125 transition duration-300 ease-in-out'>
                    <Image source={add} className='w-8 h-8' alt="add" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Navbar