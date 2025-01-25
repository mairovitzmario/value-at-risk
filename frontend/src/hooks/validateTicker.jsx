import { useState, useEffect } from 'react';
import { fetchTickerValidation } from '../utils/fetch_api';

const validateTicker = (ticker) => {
    const [loadingState, setLoadingState] = useState('loading');



    const fetchData = async () => {
        const result = await fetchTickerValidation(ticker);

        if (result.error || result.data == false) {
            setError(result.error);
            setLoadingState('error');
        } else {
            setData(result.data);
            setLoadingState('success');
        }
    };

    fetchData();


    return { loadingState };
};

export default validateTicker;
