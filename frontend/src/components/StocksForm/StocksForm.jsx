import './StocksForm.css'
import { useState, useEffect, useRef } from 'react';
import { Space, TextInput, NumberInput, Text, Button, Stack, Group, Input } from '@mantine/core';
import Chip from '@mui/material/Chip'
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useStocks } from '../../contexts/StocksContext';
import useComponentWidth from '../../hooks/useComponentWidth';
import { fetchTickerValidation } from '../../utils/fetch_api';
import { useViewportSize } from '@mantine/hooks';
import StockChip from '../StockChip/StockChip';
import React from 'react';



function StocksForm() {
  const { stocks, addStock, removeStock } = useStocks();
  const [stockTicker, setStockTicker] = useState('')
  const [stockAmount, setStockAmount] = useState('')

  const { width } = useViewportSize();
  const tickerInputRef = useRef(null);

  useEffect(() => {
    if (stockTicker === '') {
      tickerInputRef.current.focus();
    }
  }, [stockTicker]);

  function onStockAdd() {
    const newStock = { 'ticker': stockTicker, 'amount': stockAmount, 'state': 'loading' }

    addStock(newStock);
    setStockTicker('');
    setStockAmount('');
  }

  const [formWidth, formRef] = useComponentWidth();


  return (
    <>

      <div className='stocks-form' ref={formRef}>

        <Stack>
          <Space h={1} />

          <Input.Wrapper label="Enter all the stocks in your portfolio:" size='md'>
            <Group justify='space-between'>

              <TextInput
                miw={width < 530 ? '100%' : 'auto'}
                ref={tickerInputRef}
                value={stockTicker}
                onChange={(event) => setStockTicker(event.currentTarget.value)}
                size="md"
                placeholder="Stock ticker"
                leftSection={<ShowChartIcon />}
              />

              <NumberInput
                miw={width < 530 ? '100%' : 'auto'}
                value={stockAmount}
                onChange={setStockAmount}
                placeholder="Invested amount"
                leftSection={<AttachMoneyIcon />}
                size='md'
                hideControls
              />

            </Group>
          </Input.Wrapper>

          <Button variant="default" color="gray" size="md" onClick={onStockAdd}>Add stock</Button>
          <Group justify='center' maw={formWidth ? formWidth : 'auto'}>
            {stocks.map((stock, index) => (
              <StockChip key={index} index={index} />
            ))}
          </Group>
        </Stack>
      </div>


    </>
  );
}

export default StocksForm;