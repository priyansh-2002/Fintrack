import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import { Button, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CardShell } from '@/components/common/CardShell';
import { EmptyState } from '@/components/common/EmptyState';
import { PageIntro } from '@/components/common/PageIntro';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { CardPortfolioGrid } from '@/features/cards/components/CardPortfolioGrid';
import { AddCardDialog } from '@/features/cards/components/AddCardDialog';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useAppStore } from '@/store/useAppStore';
import { formatCompactCurrency } from '@/utils/currency';
import { getIssuerCount } from '@/utils/cards';

export const CardsPage = () => {
  const [isAddCardDialogOpen, setIsAddCardDialogOpen] = useState(false);
  const { cards, addCard, role } = useAppStore(
    useShallow((state) => ({
      cards: state.cards,
      addCard: state.addCard,
      role: state.role,
    })),
  );
  const isLoading = useSimulatedLoading();
  const canManage = role === 'admin';

  const totalBalance = useMemo(
    () => cards.reduce((sum, card) => sum + card.balance, 0),
    [cards],
  );
  const issuerCount = useMemo(() => getIssuerCount(cards), [cards]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Cards Workspace"
        title="A dedicated bank-card hub for every issuer, balance snapshot, and card identity."
        description="Cards were moved out of the dashboard so this route can own richer card visuals, issuer details, and add-card flows without crowding the main analytics screen."
        action={
          canManage ? (
            <Button
              variant="contained"
              startIcon={<AddCardRoundedIcon />}
              onClick={() => setIsAddCardDialogOpen(true)}
            >
              Add card
            </Button>
          ) : null
        }
      />

      {/* Card summary strip: surfaces the key overview numbers for the current stored card portfolio. */}
      <div className="grid gap-5 md:grid-cols-3">
        <CardShell title="Active Cards">
          <Typography variant="h4" className="text-(--app-heading)">
            {cards.length}
          </Typography>
          <Typography variant="body2" className="mt-2 text-(--app-muted)">
            Total cards currently stored in your FinTrack wallet workspace.
          </Typography>
        </CardShell>
        <CardShell title="Portfolio Value">
          <Typography variant="h4" className="text-(--app-heading)">
            {formatCompactCurrency(totalBalance)}
          </Typography>
          <Typography variant="body2" className="mt-2 text-(--app-muted)">
            Combined live balance across every connected card in the portfolio.
          </Typography>
        </CardShell>
        <CardShell title="Issuers">
          <Typography variant="h4" className="text-(--app-heading)">
            {issuerCount}
          </Typography>
          <Typography variant="body2" className="mt-2 text-(--app-muted)">
            Distinct banking issuers currently represented in the card collection.
          </Typography>
        </CardShell>
      </div>

      {/* Card gallery: this route now owns the full card list that used to live on the main dashboard. */}
      {cards.length ? (
        <CardShell
          title="Your Cards"
          subtitle="Every card keeps its issuer, network, masked number, expiry, and current balance together in one visual grid."
        >
          <CardPortfolioGrid cards={cards} />
        </CardShell>
      ) : (
        <EmptyState
          icon={<CreditCardRoundedIcon />}
          title="Your card collection is empty"
          description="Add a bank card to populate this new cards workspace with issuer-styled card visuals."
          action={
            canManage ? (
              <Button variant="contained" onClick={() => setIsAddCardDialogOpen(true)}>
                Add your first card
              </Button>
            ) : null
          }
        />
      )}

      {/* Add-card dialog: opens a two-step flow that asks for the issuing bank before the detailed card form. */}
      <AddCardDialog
        open={isAddCardDialogOpen}
        onClose={() => setIsAddCardDialogOpen(false)}
        onSubmit={(values) => {
          addCard(values);
          setIsAddCardDialogOpen(false);
        }}
      />
    </div>
  );
};
