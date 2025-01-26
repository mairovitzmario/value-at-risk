import React from 'react';
import { useEffect, useState } from 'react';

function useStocksFormValidation(stockTicker, stockAmount) {
    const [isTickerError, setIsTickerError] = useState(false);
    const [isAmountError, setIsAmountError] = useState(false);


    useEffect(() => {
        setIsTickerError(false)
    }, [stockTicker])

    useEffect(() => {
        setIsAmountError(false)
    }, [stockAmount])


    const validateStocksForm = () => {
        let isValid = true;

        if (stockTicker.trim() === '') {
            setIsTickerError(true);
            isValid = false;
        } else {
            setIsTickerError(false);
        }

        if (stockAmount === '') {
            setIsAmountError(true);
            isValid = false;
        } else {
            setIsAmountError(false);
        }

        return isValid;
    };

    return {
        isTickerError,
        isAmountError,
        validateStocksForm,
    };
}

export default useStocksFormValidation;