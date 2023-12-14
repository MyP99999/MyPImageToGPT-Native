import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuth';

const TokensContext = createContext();

export const useTokens = () => useContext(TokensContext);

export const TokensProvider = ({ children }) => {
    const { user } = useAuth();
    const [tokens, setTokens] = useState(0);

    useEffect(() => {
        setTokens(user?.tokens)
    }, [user?.tokens]);

    const addTokens = async (amount) => {
        setTokens((prevTokens) => prevTokens + amount);
    }

    const spendTokens = async (amount) => {
        setTokens((prevTokens) => prevTokens - amount);
    }

    return (
        <TokensContext.Provider value={{ tokens, spendTokens, addTokens }}>
            {children}
        </TokensContext.Provider>
    );
};

export default TokensProvider;
