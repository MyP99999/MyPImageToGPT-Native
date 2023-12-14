import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './useAuth';
import axiosInstance from '../api/axios';
import { useNavigation } from '@react-navigation/native';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [open, setOpen] = useState(false); // State to control the visibility

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axiosInstance.get(`/history/user/${user?.id}`);
                setHistory(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchHistory();
    }, [user]);

    const fetchHistory = async () => {
        try {
            const response = await axiosInstance.get(`/history/user/${user?.id}`);
            setHistory(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchHistoryById = async (historyID) => {
        try {
            const response = await axiosInstance.get(`/history/user/${user?.id}/${historyID}`);
            return response
        } catch (error) {
            console.log(error);
        }
    };


    const toggleHistory = () => {

        setOpen(!open);

    };

    return (
        <HistoryContext.Provider value={{ open, setOpen, history, fetchHistory, toggleHistory, fetchHistoryById }}>
            {children}
        </HistoryContext.Provider>
    );
};

export default HistoryProvider;
