import {
  LayoutDashboard,
  TrendingDown,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  CreditCard,
  PiggyBank,
  Tags,
  Sparkles,
  Settings,
} from "lucide-react";

export const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: TrendingDown,
    subItems: [
      {
        title: "Expenses",
        url: "/expenses",
        icon: ArrowDownCircle,
      },
      {
        title: "Incomes",
        url: "/incomes",
        icon: ArrowUpCircle,
      },
    ],
  },
  {
    title: "Accounts",
    url: "/accounts",
    icon: Wallet,
    subItems: [
      {
        title: "Bank Accounts",
        url: "/bank",
        icon: CreditCard,
      },
      {
        title: "Savings",
        url: "/savings",
        icon: PiggyBank,
      },
    ],
  },
  {
    title: "Categories",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Sparkles,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
