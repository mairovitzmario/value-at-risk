import './App.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import React, { useState } from "react";

import { Space, MantineProvider, Title, Text, Slider, Button } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DateInput } from '@mantine/dates';
import { useViewportSize } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';

import DateRangeIcon from '@mui/icons-material/DateRange';

import StocksForm from './components/StocksForm/StocksForm';
import ResultsModal from './components/ResultsModal/ResultsModal';

import { useStocksContext } from './contexts/StocksContext';
import parseDataToPayload from './utils/parse_data_to_payload';
import { useStocksFormContext } from './contexts/StocksFormContext';
import useFormValidation from './hooks/useFormValidation';


function App() {

  const { stocks } = useStocksContext();
  const { stockTicker, stockAmount } = useStocksFormContext();
  const { validateMainForm } = useFormValidation(stockTicker, stockAmount);

  const [dateValue, setDateValue] = useState(new Date());
  const [confidenceLevel, setConfidenceLevel] = useState(95);
  const [result, setResult] = useState({});

  const [openedResults, { open: openResults, close: closeResults }] = useDisclosure(false);

  const { width } = useViewportSize();

  const onFormSubmit = () => {
    console.log(stocks)
    const isFormValid = validateMainForm(stocks);

    if (isFormValid) {
      const payload = parseDataToPayload(stocks, dateValue, confidenceLevel);
      setResult(payload);
      openResults();

    }
    else {

    }

  }


  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} forceColorScheme='dark' withGlobalStyles withNormalizeCSS>
      < Notifications />

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

          <Button fullWidth variant="filled" size="md" onClick={onFormSubmit}>Calculate VaR</Button>
          <ResultsModal payload={result} close={closeResults} opened={openedResults} />
        </form>

      </div>

    </MantineProvider>
  );
}

export default App;
