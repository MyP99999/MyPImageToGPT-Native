import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import Logout from './Logout'
import { useAuth } from '../context/useAuth'
import { useHistory } from '../context/useHistory'
import { useNavigation } from '@react-navigation/native'

const History = ({ id }) => {
    const { user } = useAuth()
    const { history } = useHistory()
    const reversedHistory = [...history].reverse();
    const navigation = useNavigation()

    const handleViewPress = (historyId) => {
        // Use the passed navigation to navigate to the specific history item
        navigation.navigate('History', { historyId });
    };

    return (
        <View className="bg-slate-700 flex-1">
            <View className="flex-1">
                <ScrollView>
                    <Text className="text-center p-1 text-lg font-bold text-white">History</Text>
                    {reversedHistory.length > 0 && reversedHistory.map((item) => (
                        <View key={item.id} className={`${id == item.id ? 'bg-slate-800 border-2 border-slate-900' : 'bg-slate-900'} rounded-lg py-4 mb-1 w-full flex flex-row items-center justify-between px-4`}>
                            <Text className="text-lg text-white">
                                {item.question.length > 20 ? `${item.question.substring(0, 10)}..` : item.question}
                            </Text>
                            <TouchableOpacity className="bg-blue-500 hover:bg-blue-700 transition-all ease-in-out duration-300 p-1 rounded-md" onPress={() => handleViewPress(item.id)}>
                                <Text>
                                    View
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View className="bg-slate-900 h-16 absolute bottom-0 w-full flex flex-row justify-between items-center p-4">
                <Text className="text-white">{user?.sub}</Text>
                <TouchableOpacity>
                    <Logout />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default History
