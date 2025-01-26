import './App.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import React, { useState } from "react";

import { Space, MantineProvider, Title, Text, Slider, } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DateInput } from '@mantine/dates';
import { useViewportSize } from '@mantine/hooks';

import DateRangeIcon from '@mui/icons-material/DateRange';

import StocksForm from './components/StocksForm/StocksForm';
import ShowResults from './components/ShowResults/ShowResults';

import { useStocks } from './contexts/StocksContext';
import parseDataToPayload from './utils/parse_data_to_payload';


function App() {

  const { stocks } = useStocks();
  const [dateValue, setDateValue] = useState();
  const [confidenceLevel, setConfidenceLevel] = useState(95);

  const { width } = useViewportSize();



  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} forceColorScheme='dark' withGlobalStyles withNormalizeCSS>
      <div className='wrapper'>

        <Title order={1} size={width < 450 ? '3rem' : '4rem'}>Value-at-Risk</Title>

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
            min={90}
            max={99}
            color="blue"
            size="lg"
            marks={[
              { value: 90, label: '90%' },
              { value: 95, label: '95%' },
              { value: 99, label: '99%' },
            ]}
          />

          <Space h='xl' />
          <Space h='xl' />

          <ShowResults payload={parseDataToPayload(stocks, confidenceLevel, dateValue)} />
        </form>

      </div>
    </MantineProvider>
  );
}

export default App;
