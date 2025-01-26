import { Chip } from "@mui/material";
import { useStocks } from "../../contexts/StocksContext";
import { useState, useEffect } from "react";
import { fetchTickerValidation } from "../../utils/fetch_api";
import showErrorNotification from "../../utils/show_error_notification";

function StockChip({ index }) {
    const { stocks, editStock, removeStock } = useStocks();

    useEffect(() => {
        const validateTicker = async () => {
            const result = await fetchTickerValidation(stocks[index].ticker);

            if (result.error || result.data === false) {
                showErrorNotification(`Ticker ${stocks[index].ticker} is not valid!`)
                editStock(index, { state: 'error' });
            } else {

                editStock(index, { state: 'success' });
            }
        };

        validateTicker();


    }, []);

    return (
        <Chip
            key={index}
            label={`${stocks[index].ticker} - $${stocks[index].amount}`}
            onDelete={() => removeStock(index)}
            color={
                stocks[index].state === 'loading'
                    ? 'warning'
                    : stocks[index].state === 'error'
                        ? 'error'
                        : 'info'
            }
        />
    );
}

export default StockChip;
