import { Chip } from "@mui/material";
import { useStocks } from "../../contexts/StocksContext";
import { useState, useEffect } from "react";
import { fetchTickerValidation } from "../../utils/fetch_api";

function StockChip({ index }) {
    const { stocks, editStock, removeStock } = useStocks();

    useEffect(() => {
        const validateTicker = async () => {
            const result = await fetchTickerValidation(stocks[index].ticker);

            if (result.error || result.data === false) {

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
