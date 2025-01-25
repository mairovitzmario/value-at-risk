import React, { createContext, useContext, useState } from "react";

const StocksContext = createContext();

export const StocksProvider = ({ children }) => {
    const [stocks, setStocks] = useState([]);

    const addStock = (newObject) => {
        setStocks((prev) => [...prev, newObject]);
    };

    const removeStock = (index) => {
        setStocks((prev) => prev.filter((_, i) => i !== index));
    };

    const editStock = (index, updatedFields) => {
        setStocks((prev) =>
            prev.map((stock, i) =>
                i === index ? { ...stock, ...updatedFields } : stock
            )
        );
    };

    const resetStocks = () => {
        setStocks([]);
    };

    return (
        <StocksContext.Provider value={{ stocks: stocks, addStock: addStock, removeStock: removeStock, editStock: editStock, resetStocks: resetStocks }}>
            {children}
        </StocksContext.Provider>
    );
};

export const useStocks = () => useContext(StocksContext);