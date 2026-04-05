import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import {
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';

import { EmptyState } from '@/components/common/EmptyState';
import {
  categoryMeta,
  type SortDirection,
  type Transaction,
  type TransactionSortField,
} from '@/types/finance';
import { formatCurrency } from '@/utils/currency';
import { formatLongDate } from '@/utils/date';

interface TransactionTableProps {
  transactions: Transaction[];
  canManage: boolean;
  sortBy: TransactionSortField;
  sortDirection: SortDirection;
  onSort: (field: TransactionSortField) => void;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  onAddFirstTransaction: () => void;
}

const sortableColumns: Array<{
  key: TransactionSortField;
  label: string;
}> = [
  { key: 'date', label: 'Date' },
  { key: 'title', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount' },
];

export const TransactionTable = ({
  transactions,
  canManage,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  onAddFirstTransaction,
}: TransactionTableProps) => {
  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptLongRoundedIcon />}
        title="No transactions match the current filters"
        description="Try widening the date range, clearing the search term, or add a transaction to seed the table with fresh data."
        action={
          canManage ? (
            <Button variant="contained" onClick={onAddFirstTransaction}>
              Add your first transaction
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-(--app-border) bg-(--app-surface-strong)/90 shadow-[0_18px_60px_rgba(15,35,43,0.08)]">
      <TableContainer className="overflow-x-auto">
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {sortableColumns.map((column) => (
                <TableCell key={column.key}>
                  <TableSortLabel
                    active={sortBy === column.key}
                    direction={sortBy === column.key ? sortDirection : 'desc'}
                    onClick={() => onSort(column.key)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Type</TableCell>
              <TableCell>Account</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow hover key={transaction.id}>
                <TableCell>
                  <Typography variant="body2" className="font-semibold text-(--app-text)">
                    {formatLongDate(transaction.date)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" className="font-semibold text-(--app-text)">
                    {transaction.title}
                  </Typography>
                  <Typography variant="caption" className="mt-1 block text-(--app-muted)">
                    {transaction.note || 'No note added'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={categoryMeta[transaction.category].label}
                    size="small"
                    style={{
                      color: categoryMeta[transaction.category].color,
                      backgroundColor: `${categoryMeta[transaction.category].color}14`,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    className={
                      transaction.type === 'income'
                        ? 'font-semibold text-emerald-600 dark:text-emerald-300'
                        : 'font-semibold text-rose-600 dark:text-rose-300'
                    }
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type}
                    size="small"
                    className="capitalize"
                    color={transaction.type === 'income' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{transaction.account}</TableCell>
                <TableCell align="right">
                  {canManage ? (
                    <div className="flex justify-end gap-1">
                      <Tooltip title="Edit transaction">
                        <IconButton onClick={() => onEdit(transaction.id)}>
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete transaction">
                        <IconButton onClick={() => onDelete(transaction.id)}>
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : (
                    <Typography variant="caption" className="text-(--app-muted)">
                      Viewer access
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
