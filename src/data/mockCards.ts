import type { UserCard } from '@/types/finance';

export const mockCards: UserCard[] = [
  {
    id: 'card-1',
    title: 'Travel Card',
    issuer: 'hdfc-bank',
    holderName: 'Priyansh',
    network: 'visa',
    type: 'credit',
    balance: 310100,
    cardNumber: '7283232373195842',
    expiry: '09/28',
  },
  {
    id: 'card-2',
    title: 'Business Card',
    issuer: 'amex-india',
    holderName: 'Priyansh',
    network: 'amex',
    type: 'credit',
    balance: 1778400,
    cardNumber: '3253824311006721',
    expiry: '02/30',
  },
];
