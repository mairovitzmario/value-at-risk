import React from 'react';
import { useEffect, useState } from 'react';
import showErrorNotification from '../utils/show_error_notification';

function useFormValidation(stockTicker, stockAmount) {
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

        if (isValid === false) {
            showErrorNotification('Fill in the stock details!')
        }

        return isValid;
    };

    const validateMainForm = (stocks) => {

        let isValid = true;

        if (stocks.length === 0) {
            isValid = false;
            setIsTickerError(true);
            setIsAmountError(true);
            showErrorNotification("Stock list can't be empty!")
        }
        else if (stocks.some(stock => stock.state !== 'success')) {
            isValid = false;
            setIsTickerError(true);
            setIsAmountError(true);
            showErrorNotification("All stock tickers must be validated!");
        }
        else {
            setIsTickerError(false);
            setIsAmountError(false);
        }

        return isValid;
    }

    return {
        isTickerError,
        isAmountError,
        validateStocksForm,
        validateMainForm
    };
}

export default useFormValidation;