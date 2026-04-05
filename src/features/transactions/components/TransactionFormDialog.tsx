import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/store/useAppStore';
import {
  expenseCategoryOptions,
  incomeCategoryOptions,
  type CategoryId,
  type TransactionFormValues,
} from '@/types/finance';

type ValidationErrors = Partial<Record<keyof TransactionFormValues, string>>;

const buildEmptyValues = (
  draftType: TransactionFormValues['type'],
): TransactionFormValues => ({
  title: '',
  amount: 0,
  type: draftType,
  category: draftType === 'income' ? 'salary' : 'groceries',
  account: 'Salary Account',
  date: dayjs().format('YYYY-MM-DD'),
  note: '',
});

export const TransactionFormDialog = () => {
  const {
    transactions,
    dialogMode,
    editingTransactionId,
    isTransactionDialogOpen,
    transactionDraftType,
    role,
    closeTransactionDialog,
    addTransaction,
    updateTransaction,
  } = useAppStore(
    useShallow((state) => ({
      transactions: state.transactions,
      dialogMode: state.dialogMode,
      editingTransactionId: state.editingTransactionId,
      isTransactionDialogOpen: state.isTransactionDialogOpen,
      transactionDraftType: state.transactionDraftType,
      role: state.role,
      closeTransactionDialog: state.closeTransactionDialog,
      addTransaction: state.addTransaction,
      updateTransaction: state.updateTransaction,
    })),
  );

  const selectedTransaction = useMemo(
    () =>
      transactions.find((transaction) => transaction.id === editingTransactionId) ?? null,
    [editingTransactionId, transactions],
  );

  const canManage = role === 'admin';
  const [values, setValues] = useState<TransactionFormValues>(
    buildEmptyValues(transactionDraftType),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (!isTransactionDialogOpen) {
      return;
    }

    setValues(
      selectedTransaction
        ? {
            title: selectedTransaction.title,
            amount: selectedTransaction.amount,
            type: selectedTransaction.type,
            category: selectedTransaction.category,
            account: selectedTransaction.account,
            date: selectedTransaction.date,
            note: selectedTransaction.note,
          }
        : buildEmptyValues(transactionDraftType),
    );
    setErrors({});
  }, [isTransactionDialogOpen, selectedTransaction, transactionDraftType]);

  const availableCategories =
    values.type === 'income' ? incomeCategoryOptions : expenseCategoryOptions;

  const handleFieldChange = <K extends keyof TransactionFormValues>(
    field: K,
    nextValue: TransactionFormValues[K],
  ) => {
    setValues((current) => {
      if (field === 'type') {
        const nextType = nextValue as TransactionFormValues['type'];
        const nextCategories =
          nextType === 'income' ? incomeCategoryOptions : expenseCategoryOptions;

        return {
          ...current,
          type: nextType,
          category: nextCategories[0].id,
        };
      }

      return {
        ...current,
        [field]: nextValue,
      };
    });

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const nextErrors: ValidationErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = 'Description is required.';
    }
    if (values.amount <= 0) {
      nextErrors.amount = 'Amount must be greater than zero.';
    }
    if (!values.account.trim()) {
      nextErrors.account = 'Account is required.';
    }
    if (!values.date) {
      nextErrors.date = 'Date is required.';
    }
    if (!values.category) {
      nextErrors.category = 'Category is required.';
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!canManage || !validateForm()) {
      return;
    }

    if (dialogMode === 'edit' && editingTransactionId) {
      updateTransaction(editingTransactionId, values);
    } else {
      addTransaction(values);
    }

    closeTransactionDialog();
  };

  return (
    <Dialog
      open={isTransactionDialogOpen}
      onClose={closeTransactionDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {dialogMode === 'edit' ? 'Edit transaction' : 'Add transaction'}
      </DialogTitle>
      <DialogContent className="space-y-5 pt-2">
        <Typography variant="body2" className="text-(--app-muted)">
          Keep the form focused on normalized fields so the data stays easy to chart,
          filter, and persist.
        </Typography>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Description"
            value={values.title}
            onChange={(event) => handleFieldChange('title', event.target.value)}
            error={Boolean(errors.title)}
            helperText={errors.title}
            fullWidth
          />
          <TextField
            label="Amount"
            type="number"
            value={values.amount}
            onChange={(event) =>
              handleFieldChange('amount', Number(event.target.value))
            }
            error={Boolean(errors.amount)}
            helperText={errors.amount}
            fullWidth
          />
          <FormControl fullWidth>
            <Select
              value={values.type}
              onChange={(event) =>
                handleFieldChange(
                  'type',
                  event.target.value as TransactionFormValues['type'],
                )
              }
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth error={Boolean(errors.category)}>
            <Select
              value={values.category}
              onChange={(event) =>
                handleFieldChange('category', event.target.value as CategoryId)
              }
            >
              {availableCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Account"
            value={values.account}
            onChange={(event) => handleFieldChange('account', event.target.value)}
            error={Boolean(errors.account)}
            helperText={errors.account}
            fullWidth
          />
          <TextField
            label="Date"
            type="date"
            value={values.date}
            onChange={(event) => handleFieldChange('date', event.target.value)}
            error={Boolean(errors.date)}
            helperText={errors.date}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </div>
        <TextField
          label="Note"
          value={values.note}
          onChange={(event) => handleFieldChange('note', event.target.value)}
          multiline
          minRows={3}
          fullWidth
        />
      </DialogContent>
      <DialogActions className="px-6 pb-6">
        <Button onClick={closeTransactionDialog}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canManage}>
          {dialogMode === 'edit' ? 'Save changes' : 'Create transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
