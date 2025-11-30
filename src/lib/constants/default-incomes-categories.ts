export const DEFAULT_INCOMES_CATEGORIES = [
  { key: "salary", label: "Salary" },
  { key: "bonus", label: "Bonus" },
  { key: "side-income", label: "Side Income"},
  {key: "freelance", label: "Freelance"},
  {key: "investment", label: "Investment"},
  {key: "gift", label: "Gift"},
  {key: "bonus", label: "Bonus"},
  {key: "refund", label: "Refund"},
  {key: "other", label: "Other"},
] as const;

export const incomeKeys = DEFAULT_INCOMES_CATEGORIES.map(c => c.key);