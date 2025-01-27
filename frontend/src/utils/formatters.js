export const formatAbsoluteVaR = (value) => {
    const sign = value >= 0 ? '-' : '+';
    return `${sign}\$${Math.abs(value).toFixed(2)}`;
};

export const formatRelativeVaR = (value) => {
    const sign = value >= 0 ? '-' : '+';
    return `${sign}${(100 * Math.abs(value)).toFixed(2)}%`;
};

