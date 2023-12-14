import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuth } from '../context/useAuth'
import Navbar from '../components/Navbar'
import { useHistory } from '../context/useHistory'
import History from '../components/History'

const MainScreen = () => {
  const { logout } = useAuth()
  const { open } = useHistory()

  return (
    <View>
      <Navbar />
      {open ? (
        <History />
      ) : (
        <Text>MainScreen</Text>
      )}
      <TouchableOpacity className="bg-red-500" onPress={() => logout()}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MainScreen