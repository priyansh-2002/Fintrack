# FinTrack – Finance Dashboard UI

FinTrack is a modern SaaS-style Finance Dashboard built using React, TypeScript, TailwindCSS, MUI, and Zustand.  
This project demonstrates clean architecture, modular state management, reusable components, and a scalable frontend structure using mock financial data.

---

## 🚀 Features

### Dashboard
- Financial summary (Balance, Income, Expenses)
- Money flow visualization
- Scheduled payments panel
- Recent transactions rail
- Quick send money panel
- Dashboard metric tiles

### Transactions
- Transaction table
- Add / Edit transactions
- Filtering and search
- Categorization
- CSV export

### Cards
- Card portfolio grid
- Add new card
- Card management UI

### Role-Based UI
- Viewer → View-only access
- Admin → Add/Edit transactions and cards

### Insights
- Spending insights
- Monthly comparisons
- Financial statistics

### UI/UX
- Responsive SaaS layout
- Sidebar navigation
- Topbar with actions
- Dialogs and modals
- Empty states
- Skeleton loaders
- Clean card-based UI

### State Management
Managed using **Zustand** with modular slices:
- financeSlice
- cardsSlice
- preferencesSlice
- uiSlice

### Data Persistence
- Local storage used for saving user preferences and data

---

## 🏗️ Project Architecture

```
src/
│
├── app/                # App setup, providers, theme
├── components/         # Shared UI components
│   ├── common/
│   └── layout/
│
├── features/           # Feature-based modules
│   ├── dashboard/
│   ├── transactions/
│   └── cards/
│
├── pages/              # Application pages
├── store/              # Zustand store & slices
├── data/               # Mock data
├── hooks/              # Custom hooks
├── utils/              # Utility functions
├── types/              # TypeScript types
└── styles/             # Global styles
```

This architecture follows a **feature-based scalable frontend architecture** used in production SaaS applications.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React | Frontend library |
| TypeScript | Type safety |
| TailwindCSS | Styling |
| MUI | UI components |
| Zustand | State management |
| Vite | Build tool |
| Recharts | Charts |
| LocalStorage | Data persistence |

---

## 📦 Installation & Setup

```bash
git clone https://github.com/yourusername/fintrack.git
cd fintrack
npm install
npm run dev
```

---

## 📊 State Management Structure

The global state is divided into slices:

- **financeSlice** → transactions, balance, income, expenses
- **cardsSlice** → card data
- **preferencesSlice** → dark mode, user preferences
- **uiSlice** → dialogs, loading states, UI controls

This modular structure improves scalability and maintainability.

---

## ✨ Optional Enhancements Implemented
- CSV Export
- Skeleton Loading UI
- Empty States
- Dialog Forms
- Modular Store Architecture
- Reusable UI Components
- Clean SaaS Layout

---

## 📱 Responsiveness
The application is responsive and works across:
- Desktop
- Tablet
- Mobile

---

## 📌 Notes
This project uses **mock data** and focuses on **frontend architecture, UI/UX, and state management**, not backend implementation.

---

## 👨‍💻 Author
**Priyansh**

---

## 📄 License
This project is for educational and evaluation purposes.