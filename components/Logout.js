import React from 'react'
import { useAuth } from '../context/useAuth'
import logoutPng from '../assets/logout1.png'
import { Image, TouchableOpacity } from 'react-native'

const Logout = () => {
    const { logout } = useAuth()

    return (
        <TouchableOpacity onPress={logout}>
            <Image source={logoutPng} className='h-8 w-8 cursor-pointer hover:scale-105 ease-in-out transition-all duration-300' alt="Logout" />
        </TouchableOpacity>
    )
}

export default Logout