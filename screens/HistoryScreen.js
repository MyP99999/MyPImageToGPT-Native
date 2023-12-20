import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useHistory } from '../context/useHistory';
import Navbar from '../components/Navbar';

const HistoryScreen = ({ route }) => {
    const [historyItem, setHistoryItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { historyId } = route.params;
    const { fetchHistoryById } = useHistory();

    useEffect(() => {
        const fetchHistoryItem = async () => {
            try {
                setLoading(true);
                const response = await fetchHistoryById(historyId);
                setHistoryItem(response.data); // Assuming the response has a data property
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchHistoryItem();
    }, [historyId]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Failed to load history item</Text>
            </View>
        );
    }

    return (
        <>
            <Navbar ret={true} />
            <View className='flex-1 bg-slate-500 p-2 pt-4'>
                <View>
                    {/* Question Section */}
                    <View className='w-3/4'>
                        <Text className='text-white text-xl'>
                            Question:
                        </Text>
                        <Text className='text-white text-xl bg-slate-600 text-center p-1 rounded-md'>
                            {historyItem.question}
                        </Text>
                    </View>

                    {/* Answer Section */}
                    <View className='w-3/4 ml-auto mt-2'>
                        <Text className='text-white text-xl text-right'>
                            Answer:
                        </Text>
                        <Text className='text-white text-xl bg-slate-600 text-center p-1 rounded-md'>
                            {historyItem.answer} 
                        </Text>
                    </View>
                </View>
            </View>

        </>
    );
};

export default HistoryScreen;
