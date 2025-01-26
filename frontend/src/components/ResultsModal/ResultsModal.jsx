import { Modal, Button, ColorInput, Input, Space, Flex, Title, Loader, Skeleton, Text } from '@mantine/core';
import { useState, useContext, useEffect } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { fetchVaRCalculation } from '../../utils/fetch_api';

function ResultsModal({ payload, opened, close }) {

    const [results, setResults] = useState();
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (opened) {
                try {
                    setResults(null);
                    console.log("Payload", payload)
                    const data = await fetchVaRCalculation(payload);
                    console.log('Fetched VaR data:', data);
                    setResults(data);
                } catch (error) {
                    console.error('Error fetching VaR calculation:', error);
                    setIsError(true);
                }
            }
        };

        fetchData();
    }, [opened, payload]);

    const LoadingModal = () => (
        <>
            <Space h='md' />
            <Skeleton height={'2rem'} mt={6} width='45%' radius="lg" />
            <Skeleton height={12} mt={6} width='52%' radius="lg" />
            <Space h='xl' />
            <Skeleton height={'2rem'} mt={6} width='50%' radius="lg" />
            <Skeleton height={12} mt={6} width='52%' radius="lg" />
            <Space h='xl' />
            <Skeleton height={'2rem'} mt={6} width='55%' radius="lg" />
            <Skeleton height={12} mt={6} width='52%' radius="lg" />
            <Space h='md' />
        </>
    )


    const SuccessModal = () => (
        <>
            <Space h='md' />
            <Title order={2} size={'2rem'}>Historical VaR</Title>
            <Text>{`-\$${results.historical.absolute.toFixed(2)} or -${(100 * results.historical.relative).toFixed(2)}% of your initial portfolio`}</Text>

            <Space h='xl' />
            <Title order={2} size={'2rem'}>Parametric VaR</Title>
            <Text>{`-\$${results.parametric.absolute.toFixed(2)} or -${(100 * results.parametric.relative).toFixed(2)}% of your initial portfolio`}</Text>
            <Space h='xl' />
            <Title order={2} size={'2rem'}>Monte-Carlo VaR</Title>
            <Text>{`-\$${results.monte_carlo.absolute.toFixed(2)} or -${(100 * results.monte_carlo.relative).toFixed(2)}% of your initial portfolio`}</Text>
            <Space h='md' />
        </>
    )

    const ErrorModal = () => (
        <>

        </>

    )

    return (
        <>
            <Modal opened={opened} onClose={close} size="lg" centered withCloseButton={false}>
                {!results ? (
                    <LoadingModal />
                ) : (
                    <SuccessModal />
                )}
            </Modal>
        </>

    )
}

export default ResultsModal;