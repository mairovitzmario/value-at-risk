const parseDataToPayload = (stocks, confidenceLevel, dateValue) => {
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
    console.log('PAYLOAD:', payload)
    return payload;
}

export default parseDataToPayload;