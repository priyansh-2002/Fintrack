export interface QuickContact {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface ScheduledPayment {
  id: string;
  name: string;
  amount: number;
  cadence: string;
}

export const quickContacts: QuickContact[] = [
  { id: 'contact-1', name: 'Aarav Mehta', initials: 'AM', color: '#ffd7a8' },
  { id: 'contact-2', name: 'Diya Sharma', initials: 'DS', color: '#c5f1de' },
  { id: 'contact-3', name: 'Isha Nair', initials: 'IN', color: '#d8d4ff' },
  { id: 'contact-4', name: 'Rohan Kapoor', initials: 'RK', color: '#bfe5ff' },
];

export const scheduledPayments: ScheduledPayment[] = [
  { id: 'payment-1', name: 'Airtel Fiber', amount: 1249, cadence: 'Monthly' },
  { id: 'payment-2', name: 'Notion', amount: 1579, cadence: 'Monthly' },
  { id: 'payment-3', name: 'Netflix', amount: 829, cadence: 'Monthly' },
];
