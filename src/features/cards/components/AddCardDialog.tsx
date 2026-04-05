import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import {
  bankCardOptions,
  cardNetworkOptions,
  cardTypeOptions,
  type BankCardBrand,
  type CardFormValues,
} from '@/types/finance';
import { formatCurrency } from '@/utils/currency';
import { formatCardNumberInput, getCardTheme, getIssuerLabel } from '@/utils/cards';

interface AddCardDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CardFormValues) => void;
}

const initialValues = (): CardFormValues => ({
  title: '',
  issuer: bankCardOptions[0].value,
  holderName: 'Priyansh',
  network: 'visa',
  type: 'credit',
  balance: 0,
  cardNumber: '',
  expiry: '',
});

export const AddCardDialog = ({
  open,
  onClose,
  onSubmit,
}: AddCardDialogProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState<CardFormValues>(initialValues);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setValues(initialValues());
    }
  }, [open]);

  const issuerTheme = useMemo(() => getCardTheme(values.issuer), [values.issuer]);

  const updateField = <Key extends keyof CardFormValues>(
    key: Key,
    value: CardFormValues[Key],
  ) => {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleContinue = () => {
    if (!values.issuer) {
      return;
    }

    if (!values.title.trim()) {
      updateField('title', `${getIssuerLabel(values.issuer)} Card`);
    }

    setStep(2);
  };

  const handleSubmit = () => {
    if (
      !values.title.trim() ||
      !values.holderName.trim() ||
      !values.cardNumber.trim() ||
      !values.expiry.trim()
    ) {
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      holderName: values.holderName.trim(),
      cardNumber: values.cardNumber.replace(/\s/g, ''),
      expiry: values.expiry.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        className: 'rounded-[28px]',
      }}
    >
      <DialogTitle>
        {step === 1 ? 'Choose your bank card' : 'Add bank card details'}
      </DialogTitle>
      <DialogContent dividers className="space-y-5">
        {step === 1 ? (
          <>
            <Typography variant="body2" className="text-(--app-muted)">
              First tell FinTrack which bank card you want to add. The card style and issuer
              identity will follow this selection.
            </Typography>
            <div className="grid gap-3 sm:grid-cols-2">
              {bankCardOptions.map((option) => {
                const selected = option.value === values.issuer;
                const theme = getCardTheme(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateField('issuer', option.value as BankCardBrand)}
                    className={`rounded-3xl border p-4 text-left transition duration-200 ${
                      selected
                        ? 'border-(--app-accent) shadow-[0_20px_40px_rgba(15,35,43,0.08)]'
                        : 'border-(--app-border)'
                    }`}
                    style={{ background: theme.gradient }}
                  >
                    <Typography variant="body2" className="uppercase tracking-[0.16em]" sx={{ color: `${theme.text}B8` }}>
                      Issuer
                    </Typography>
                    <Typography variant="h6" className="mt-3" sx={{ color: theme.text }}>
                      {option.label}
                    </Typography>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <Typography variant="body2" className="text-(--app-muted)">
              Fill the card details. The live preview uses the issuer theme you selected in step 1.
            </Typography>
            <div
              className="rounded-[28px] p-5"
              style={{
                background: issuerTheme.gradient,
                color: issuerTheme.text,
              }}
            >
              <Typography variant="overline" className="tracking-[0.16em]" sx={{ color: `${issuerTheme.text}B8` }}>
                {getIssuerLabel(values.issuer)}
              </Typography>
              <Typography variant="h5" className="mt-3">
                {values.title || 'Card title preview'}
              </Typography>
              <Typography variant="h4" className="mt-8">
                {formatCurrency(Number(values.balance || 0))}
              </Typography>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Card title"
                value={values.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Travel Card"
                fullWidth
              />
              <TextField
                label="Card holder name"
                value={values.holderName}
                onChange={(event) => updateField('holderName', event.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Network"
                value={values.network}
                onChange={(event) => updateField('network', event.target.value as CardFormValues['network'])}
                fullWidth
              >
                {cardNetworkOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Card type"
                value={values.type}
                onChange={(event) => updateField('type', event.target.value as CardFormValues['type'])}
                fullWidth
              >
                {cardTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Current balance"
                type="number"
                value={values.balance}
                onChange={(event) => updateField('balance', Number(event.target.value))}
                fullWidth
              />
              <TextField
                label="Expiry (MM/YY)"
                value={values.expiry}
                onChange={(event) => updateField('expiry', event.target.value.slice(0, 5))}
                placeholder="09/28"
                fullWidth
              />
              <TextField
                label="Card number"
                value={formatCardNumberInput(values.cardNumber)}
                onChange={(event) => updateField('cardNumber', event.target.value)}
                placeholder="1234 5678 9012 3456"
                fullWidth
                className="sm:col-span-2"
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {step === 2 ? (
          <Button onClick={() => setStep(1)} variant="text">
            Back
          </Button>
        ) : null}
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          onClick={step === 1 ? handleContinue : handleSubmit}
          variant="contained"
        >
          {step === 1 ? 'Continue' : 'Add card'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
