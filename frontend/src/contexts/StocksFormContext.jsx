import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const StocksFormContext = createContext();

export const StocksFormProvider = ({ children }) => {
    const [stockTicker, setStockTicker] = useState('');
    const [stockAmount, setStockAmount] = useState('');
    const tickerInputRef = useRef(null);

    useEffect(() => {
        if (stockTicker === '') {
            tickerInputRef.current.focus();
        }
    }, [stockTicker]);


    return (
        <StocksFormContext.Provider value={{ stockTicker, setStockTicker, stockAmount, setStockAmount, tickerInputRef }}>
            {children}
        </StocksFormContext.Provider>
    );
};

export const useStocksFormContext = () => useContext(StocksFormContext);