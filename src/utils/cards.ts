import {
  bankCardOptions,
  type BankCardBrand,
  type CardNetwork,
  type UserCard,
} from '@/types/finance';

const issuerThemeMap: Record<
  BankCardBrand,
  {
    gradient: string;
    accent: string;
    text: string;
    surface: string;
  }
> = {
  'hdfc-bank': {
    gradient: 'linear-gradient(135deg, #eff8f7 0%, #d7ebe8 100%)',
    accent: '#0f766e',
    text: '#18212a',
    surface: 'rgba(255,255,255,0.62)',
  },
  'icici-bank': {
    gradient: 'linear-gradient(135deg, #fff1e6 0%, #f3d8c2 100%)',
    accent: '#c2410c',
    text: '#261915',
    surface: 'rgba(255,255,255,0.56)',
  },
  'axis-bank': {
    gradient: 'linear-gradient(135deg, #f7efff 0%, #e0d6f7 100%)',
    accent: '#7c3aed',
    text: '#20192b',
    surface: 'rgba(255,255,255,0.56)',
  },
  'sbi-card': {
    gradient: 'linear-gradient(135deg, #eaf3ff 0%, #d3e6fb 100%)',
    accent: '#2563eb',
    text: '#162235',
    surface: 'rgba(255,255,255,0.56)',
  },
  'amex-india': {
    gradient: 'linear-gradient(135deg, #edf1ff 0%, #dfe5ff 100%)',
    accent: '#4338ca',
    text: '#171c32',
    surface: 'rgba(255,255,255,0.58)',
  },
  'kotak-bank': {
    gradient: 'linear-gradient(135deg, #fff0f2 0%, #f9d8df 100%)',
    accent: '#be123c',
    text: '#2b1822',
    surface: 'rgba(255,255,255,0.56)',
  },
};

const networkLabelMap: Record<CardNetwork, string> = {
  visa: 'VISA',
  mastercard: 'MASTERCARD',
  amex: 'AMEX',
  rupay: 'RUPAY',
};

export const getIssuerLabel = (issuer: BankCardBrand) =>
  bankCardOptions.find((option) => option.value === issuer)?.label ?? 'Bank Card';

export const getCardTheme = (issuer: BankCardBrand) =>
  issuerThemeMap[issuer] ?? issuerThemeMap['hdfc-bank'];

export const getCardNetworkLabel = (network: CardNetwork) => networkLabelMap[network];

export const normalizeCardNumber = (value: string) =>
  value.replace(/\D/g, '').slice(0, 16);

export const formatCardNumberInput = (value: string) =>
  normalizeCardNumber(value)
    .replace(/(.{4})/g, '$1 ')
    .trim();

export const getMaskedCardNumber = (cardNumber: string) => {
  const digits = normalizeCardNumber(cardNumber);
  const lastFour = digits.slice(-4).padStart(4, '*');

  return `**** **** **** ${lastFour}`;
};

export const getIssuerCount = (cards: UserCard[]) => new Set(cards.map((card) => card.issuer)).size;
