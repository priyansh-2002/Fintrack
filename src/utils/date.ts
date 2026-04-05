import dayjs from 'dayjs';

export const formatShortDate = (date: string): string =>
  dayjs(date).format('DD MMM');

export const formatLongDate = (date: string): string =>
  dayjs(date).format('MMM D, YYYY');

export const getMonthKey = (date: string): string =>
  dayjs(date).format('YYYY-MM');

export const getMonthLabel = (monthKey: string): string =>
  dayjs(`${monthKey}-01`).format('MMM YYYY');

export const getLatestTransactionDate = (dates: string[]): dayjs.Dayjs =>
  dates.reduce(
    (latest, currentDate) =>
      dayjs(currentDate).isAfter(latest) ? dayjs(currentDate) : latest,
    dayjs(dates[0]),
  );
