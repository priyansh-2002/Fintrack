import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import FilterAltOffRoundedIcon from '@mui/icons-material/FilterAltOffRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

import {
  categoryOptions,
  dateRangeOptions,
  sortFieldOptions,
  type TransactionFilters as TransactionFiltersState,
  type UserRole,
} from '@/types/finance';

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  role: UserRole;
  onFilterChange: (updates: Partial<TransactionFiltersState>) => void;
  onReset: () => void;
  onExport: () => void;
  onAdd: () => void;
}

export const TransactionFilters = ({
  filters,
  role,
  onFilterChange,
  onReset,
  onExport,
  onAdd,
}: TransactionFiltersProps) => {
  // Filter toolbar: controls the search input, filter selects, and action buttons above the transactions table.
  return (
    <div className="rounded-[28px] border border-(--app-border) bg-(--app-surface-strong)/85 p-5 shadow-[0_18px_60px_rgba(15,35,43,0.08)]">
      <div className="grid gap-4 xl:grid-cols-[2.4fr_1fr_1fr_1fr_1fr_auto]">
        {/* Search control: filters rows by matching title, category, note, or account text. */}
        <TextField
          value={filters.search}
          onChange={(event) => onFilterChange({ search: event.target.value })}
          label="Search transactions"
          placeholder="Search by title, category, note, or account"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon className="text-(--app-muted)" />
              </InputAdornment>
            ),
          }}
        />

        {/* Type selector: filters the table by income or expense and resets the category scope to keep options aligned. */}
        <FormControl fullWidth>
          <Select
            value={filters.type}
            displayEmpty
            onChange={(event) =>
              onFilterChange({
                type: event.target.value as TransactionFiltersState['type'],
                category: 'all',
              })
            }
          >
            <MenuItem value="all">All types</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </Select>
        </FormControl>

        {/* Category selector: narrows the visible transactions to one finance category. */}
        <FormControl fullWidth>
          <Select
            value={filters.category}
            displayEmpty
            onChange={(event) =>
              onFilterChange({
                category: event.target.value as TransactionFiltersState['category'],
              })
            }
          >
            <MenuItem value="all">All categories</MenuItem>
            {categoryOptions
              .filter((category) =>
                filters.type === 'all' ? true : category.type === filters.type,
              )
              .map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Date range selector: controls the time window used for the visible ledger rows. */}
        <FormControl fullWidth>
          <Select
            value={filters.dateRange}
            onChange={(event) =>
              onFilterChange({
                dateRange: event.target.value as TransactionFiltersState['dateRange'],
              })
            }
          >
            {dateRangeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort selector: controls which field the ledger table is ordered by. */}
        <FormControl fullWidth>
          <Select
            value={filters.sortBy}
            onChange={(event) =>
              onFilterChange({
                sortBy: event.target.value as TransactionFiltersState['sortBy'],
              })
            }
          >
            {sortFieldOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                Sort by {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Action group: reset, export, and admin-only add buttons live in this trailing toolbar cluster. */}
        <div className="flex flex-wrap gap-3 xl:justify-end">
          <Button variant="outlined" startIcon={<FilterAltOffRoundedIcon />} onClick={onReset}>
            Reset
          </Button>
          <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={onExport}>
            Export
          </Button>
          {role === 'admin' ? (
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={onAdd}>
              Add
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
