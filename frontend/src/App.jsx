import './App.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import React, { useState } from "react";
import { Space, Input, NumberInput, MantineProvider, Title, Text, Slider, Button } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import DateRangeIcon from '@mui/icons-material/DateRange';
import StocksForm from './components/StocksForm/StocksForm';
import { useStocks } from './contexts/StocksContext';
import { fetchVaRCalculation } from './utils/fetch_api';
import ShowResults from './components/ShowResults/ShowResults';


function App() {

  const { stocks, resetStocks } = useStocks();
  const [dateValue, setDateValue] = useState();
  const [confidenceLevel, setConfidenceLevel] = useState(95);

  const processData = () => {
    const stockTickers = stocks.map(stock => stock.ticker);
    let stockAmounts = stocks.map(stock => parseFloat(stock.amount));
    const initial_investment = stockAmounts.reduce((sum, amount) => sum + amount, 0);
    const weights = stockAmounts.map(amount => amount / initial_investment);
    const confidence_level = confidenceLevel / 100
    const currentDate = new Date();
    const time = 1 + Math.ceil((dateValue - currentDate) / (1000 * 60 * 60 * 24));

    const payload = {
      "stocks": stockTickers,
      "weights": weights,
      "time": time,
      "initial_investment": initial_investment,
      "confidence_level": confidence_level
    }

    return payload;
  }


  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} forceColorScheme='dark' withGlobalStyles withNormalizeCSS>
      <div className='wrapper'>


        <Title order={1} size={'4rem'}>Value-at-Risk</Title>

        <Space h='xl' />

        <form className='main-form' action="">

          <StocksForm />

          <Space h='xl' />

          <DateInput
            value={dateValue}
            onChange={setDateValue}
            minDate={new Date()}
            label="Enter the time horizon:"
            placeholder="Date"
            size='md'
            leftSection={<DateRangeIcon />}
          />

          <Space h='xl' />


          <Text fw={500}>Enter confidence level: {confidenceLevel}%</Text>

          <Slider
            value={confidenceLevel}
            onChange={setConfidenceLevel}
            color="blue"
            size="lg"
            marks={[
              { value: 95, label: '95%' },
            ]}
          />

          <Space h='xl' />
          <Space h='xl' />

          <ShowResults payload={processData()} />
        </form>

      </div>
    </MantineProvider>
  );
}

export default App;
