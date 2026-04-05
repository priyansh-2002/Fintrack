import { mockCards } from '@/data/mockCards';
import type { CardFormValues, UserCard } from '@/types/finance';
import type { StoreSlice } from '@/store/useAppStore';

export interface CardsSlice {
  cards: UserCard[];
  addCard: (values: CardFormValues) => void;
}

export const createCardsSlice: StoreSlice<CardsSlice> = (set) => ({
  cards: mockCards,
  addCard: (values) =>
    set((state) => ({
      cards: [
        {
          id: crypto.randomUUID(),
          ...values,
          title: values.title.trim(),
          holderName: values.holderName.trim(),
          cardNumber: values.cardNumber.trim(),
          expiry: values.expiry.trim(),
        },
        ...state.cards,
      ],
    })),
});
