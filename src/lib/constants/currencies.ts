export const DEFAULT_CURRENCIES = [
  'ARS',
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CNY',
  'INR',
  'AUD',
  'CAD',
  'CHF',
] as const;

export type Currency = typeof DEFAULT_CURRENCIES[number];