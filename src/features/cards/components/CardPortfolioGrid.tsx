import { Chip, Typography } from '@mui/material';

import { EmptyState } from '@/components/common/EmptyState';
import type { UserCard } from '@/types/finance';
import { formatCurrency } from '@/utils/currency';
import {
  getCardNetworkLabel,
  getCardTheme,
  getIssuerLabel,
  getMaskedCardNumber,
} from '@/utils/cards';

export const CardPortfolioGrid = ({
  cards,
}: {
  cards: UserCard[];
}) => {
  if (!cards.length) {
    return (
      <EmptyState
        icon="💳"
        title="No cards added yet"
        description="Add your first bank card to start building a dedicated cards workspace."
      />
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {cards.map((card, index) => {
        const theme = getCardTheme(card.issuer);

        return (
          <article
            key={card.id}
            className="page-enter overflow-hidden rounded-[30px] border border-[rgba(255,255,255,0.5)] shadow-[0_28px_70px_rgba(12,18,32,0.14)]"
            style={{
              background: theme.gradient,
              animationDelay: `${index * 90}ms`,
            }}
          >
            {/* Card face: mirrors the premium bank-card visual while keeping issuer, balance, network, and masked digits together. */}
            <div className="relative p-6" style={{ color: theme.text }}>
              <div
                className="absolute inset-x-0 top-0 h-28 rounded-b-[44px]"
                style={{ background: `linear-gradient(180deg, ${theme.surface}, transparent)` }}
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <Typography variant="overline" className="tracking-[0.2em]" sx={{ color: `${theme.text}B8` }}>
                    {getIssuerLabel(card.issuer)}
                  </Typography>
                  <Typography variant="h5" className="mt-2">
                    {card.title}
                  </Typography>
                </div>
                <Chip
                  label={card.type === 'credit' ? 'Credit' : 'Debit'}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.58)',
                    color: theme.text,
                    fontWeight: 700,
                  }}
                />
              </div>

              <div className="relative mt-10 flex items-end justify-between gap-4">
                <div>
                  <Typography variant="body2" sx={{ color: `${theme.text}B8` }}>
                    Available balance
                  </Typography>
                  <Typography variant="h4" className="mt-2">
                    {formatCurrency(card.balance)}
                  </Typography>
                </div>
                <Typography variant="body1" className="font-extrabold tracking-[0.18em]">
                  {getCardNetworkLabel(card.network)}
                </Typography>
              </div>

              <div className="relative mt-12 grid gap-5 sm:grid-cols-[1.4fr_0.8fr]">
                <div>
                  <Typography variant="caption" className="uppercase tracking-[0.16em]" sx={{ color: `${theme.text}B8` }}>
                    Card number
                  </Typography>
                  <Typography variant="body1" className="mt-2 font-semibold tracking-[0.22em]">
                    {getMaskedCardNumber(card.cardNumber)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" className="uppercase tracking-[0.16em]" sx={{ color: `${theme.text}B8` }}>
                    Expiry
                  </Typography>
                  <Typography variant="body1" className="mt-2 font-semibold">
                    {card.expiry}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Card metadata tray: surfaces the holder, issuer, and network details below the visual card face. */}
            <div className="grid gap-3 border-t border-[rgba(17,24,39,0.08)] bg-[rgba(255,255,255,0.62)] px-6 py-4 text-(--app-heading) sm:grid-cols-3 dark:bg-[rgba(20,17,29,0.28)]">
              <div>
                <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
                  Holder
                </Typography>
                <Typography variant="body2" className="mt-2 font-semibold text-(--app-heading)">
                  {card.holderName}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
                  Issuer
                </Typography>
                <Typography variant="body2" className="mt-2 font-semibold text-(--app-heading)">
                  {getIssuerLabel(card.issuer)}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
                  Network
                </Typography>
                <Typography variant="body2" className="mt-2 font-semibold text-(--app-heading)">
                  {getCardNetworkLabel(card.network)}
                </Typography>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};
