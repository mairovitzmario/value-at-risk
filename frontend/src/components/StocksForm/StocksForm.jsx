import './StocksForm.css'

import React, { useState, useEffect, useRef } from 'react';

import { Space, TextInput, NumberInput, Text, Button, Stack, Group, Input } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';


import Chip from '@mui/material/Chip'
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import StockChip from '../StockChip/StockChip';

import { fetchTickerValidation } from '../../utils/fetch_api';
import { useStocksContext } from '../../contexts/StocksContext';
import useComponentWidth from '../../hooks/useComponentWidth';
import useFormValidation from '../../hooks/useFormValidation';
import showErrorNotification from '../../utils/show_error_notification';
import { useStocksFormContext } from '../../contexts/StocksFormContext';




function StocksForm() {
  const { stocks, addStock } = useStocksContext();
  const { stockTicker, setStockTicker, stockAmount, setStockAmount, tickerInputRef } = useStocksFormContext();
  const { isTickerError, isAmountError, validateStocksForm } = useFormValidation(stockTicker, stockAmount);

  const { width } = useViewportSize();
  const [formWidth, formRef] = useComponentWidth();





  function onStockAdd() {
    const isFormValid = validateStocksForm();

    if (isFormValid) {
      const newStock = { 'ticker': stockTicker.trim(), 'amount': stockAmount, 'state': 'loading' };

      addStock(newStock);
      setStockTicker('');
      setStockAmount('');
    }
  }



  return (
    <>

      <div className='stocks-form' ref={formRef}>

        <Stack>
          <Space h={1} />

          <Input.Wrapper label="Enter all the stocks in your portfolio:" size='md'>
            <Group justify='space-between'>

              <TextInput
                error={isTickerError ? true : false}
                ref={tickerInputRef}
                value={stockTicker}
                onChange={(event) => setStockTicker(event.currentTarget.value)}
                miw={width < 530 ? '100%' : 'auto'}
                size="md"
                placeholder="Stock ticker"
                leftSection={<ShowChartIcon />}
              />

              <NumberInput
                error={isAmountError ? true : false}

                value={stockAmount}
                onChange={setStockAmount}
                miw={width < 530 ? '100%' : 'auto'}
                placeholder="Invested amount"
                leftSection={<AttachMoneyIcon />}
                size='md'
                hideControls
              />

            </Group>
          </Input.Wrapper>

          <Button variant="default" color="gray" size="md" onClick={onStockAdd}>Add stock</Button>
          <Group justify='center' maw={formWidth ? formWidth : 'auto'}>
            {stocks.map((_, index) => (
              <StockChip key={index} index={index} />
            ))}
          </Group>
        </Stack>
      </div>


    </>
  );
}

export default StocksForm;