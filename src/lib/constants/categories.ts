export const DEFAULT_CATEGORIES = [
  {key: "clothing", label: "Clothing"},
  {key: "dining-out", label: "Dining Out"},
  {key: "education", label: "Education"},
  {key: "electronics", label: "Electronics"},
  {key: "emergency-fund", label: "Emergency Fund"},
  {key: "entertainment", label: "Entertainment"},
  {key: "gifts", label: "Gifts"},
  {key: "groceries", label: "Groceries"},
  {key: "health", label: "Health"},
  {key: "home", label: "Home"},
  {key: "insurance", label: "Insurance"},
  {key: "personal-care", label: "Personal Care"},
  {key: "pets", label: "Pets"},
  {key: "subscriptions", label: "Subscriptions"},
  {key: "transportation", label: "Transportation"},
  {key: "travel", label: "Travel"},
  {key: "utilities", label: "Utilities"},
  {key: "work-related", label: "Work-related"},
  {key: "other", label: "Other"},
] as const;

export type Category = typeof DEFAULT_CATEGORIES[number];
