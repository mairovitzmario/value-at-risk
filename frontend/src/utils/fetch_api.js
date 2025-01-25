export const fetchTickerValidation = async (ticker) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/validate-ticker?ticker=${ticker}`);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        const data = await response.json();
        return { data: data, error: null };
    } catch (error) {
        return { data: null, error: error.message };
    }

};

export async function fetchVaRCalculation(payload) {
    const response = await fetch('http://127.0.0.1:8000/var', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
}