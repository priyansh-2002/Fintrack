export const MOCK_USD_TO_INR_RATE = 83;

export const formatCurrency = (
  value: number,
  maximumFractionDigits = 0,
): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits > 0 ? 2 : 0,
  }).format(value);

export const formatCompactCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'narrowSymbol',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export const formatSignedCurrency = (value: number): string => {
  const prefix = value > 0 ? '+' : '';

  return `${prefix}${formatCurrency(value)}`;
};

export const convertLegacyUsdAmountToInr = (value: number): number =>
  Math.round(value * MOCK_USD_TO_INR_RATE * 100) / 100;
