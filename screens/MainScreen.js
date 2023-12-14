import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '../context/useAuth'
import Navbar from '../components/Navbar'
import { useHistory } from '../context/useHistory'
import History from '../components/History'

const MainScreen = () => {
  const { open } = useHistory()

  return (
    <View className="h-full w-full">
      <Navbar />
      {open ? (
        <History />
      ) : (
        <Text>MainScreen</Text>
      )}
    </View>
  )
}

export default MainScreen