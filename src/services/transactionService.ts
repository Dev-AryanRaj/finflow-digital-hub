
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  category: string;
  status: TransactionStatus;
  counterparty?: string;
  currency: string;
}

// Mock transactions data for development
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date(2025, 3, 5),
    description: 'Salary Deposit',
    amount: 3500,
    type: 'credit',
    category: 'Income',
    status: 'completed',
    counterparty: 'ABC Company',
    currency: 'USD'
  },
  {
    id: '2',
    date: new Date(2025, 3, 4),
    description: 'Grocery Shopping',
    amount: 87.45,
    type: 'debit',
    category: 'Food',
    status: 'completed',
    counterparty: 'Whole Foods',
    currency: 'USD'
  },
  {
    id: '3',
    date: new Date(2025, 3, 3),
    description: 'Online Purchase',
    amount: 129.99,
    type: 'debit',
    category: 'Shopping',
    status: 'completed',
    counterparty: 'Amazon',
    currency: 'USD'
  },
  {
    id: '4',
    date: new Date(2025, 3, 2),
    description: 'Utility Bill',
    amount: 65.00,
    type: 'debit',
    category: 'Bills',
    status: 'completed',
    counterparty: 'Energy Provider',
    currency: 'USD'
  },
  {
    id: '5',
    date: new Date(2025, 3, 1),
    description: 'Restaurant Payment',
    amount: 42.75,
    type: 'debit',
    category: 'Dining',
    status: 'completed',
    counterparty: 'Local Bistro',
    currency: 'USD'
  },
  {
    id: '6',
    date: new Date(2025, 2, 28),
    description: 'Freelance Payment',
    amount: 750,
    type: 'credit',
    category: 'Income',
    status: 'completed',
    counterparty: 'Client XYZ',
    currency: 'USD'
  },
  {
    id: '7',
    date: new Date(2025, 2, 25),
    description: 'Mobile Phone Bill',
    amount: 35.99,
    type: 'debit',
    category: 'Bills',
    status: 'completed',
    counterparty: 'Telecom Provider',
    currency: 'USD'
  },
  {
    id: '8',
    date: new Date(2025, 2, 20),
    description: 'Gym Membership',
    amount: 49.99,
    type: 'debit',
    category: 'Health',
    status: 'completed',
    counterparty: 'Fitness Club',
    currency: 'USD'
  },
  {
    id: '9',
    date: new Date(2025, 2, 15),
    description: 'Book Purchase',
    amount: 24.95,
    type: 'debit',
    category: 'Entertainment',
    status: 'completed',
    counterparty: 'Book Store',
    currency: 'USD'
  },
  {
    id: '10',
    date: new Date(2025, 2, 10),
    description: 'Investment Dividend',
    amount: 125.50,
    type: 'credit',
    category: 'Investment',
    status: 'completed',
    counterparty: 'Investment Fund',
    currency: 'USD'
  },
  {
    id: '11',
    date: new Date(2025, 2, 5),
    description: 'Transfer to Savings',
    amount: 300,
    type: 'debit',
    category: 'Transfer',
    status: 'completed',
    counterparty: 'Own Account',
    currency: 'USD'
  },
  {
    id: '12',
    date: new Date(2025, 2, 1),
    description: 'Car Insurance',
    amount: 89.75,
    type: 'debit',
    category: 'Insurance',
    status: 'completed',
    counterparty: 'Insurance Co.',
    currency: 'USD'
  }
];

/**
 * Get all transactions for a user
 */
export const getTransactions = async (): Promise<Transaction[]> => {
  return mockTransactions;
};

/**
 * Get transaction by ID
 */
export const getTransactionById = async (id: string): Promise<Transaction | undefined> => {
  return mockTransactions.find(transaction => transaction.id === id);
};

/**
 * Filter transactions by type, date range, or category
 */
export const filterTransactions = async (
  filters: {
    type?: 'credit' | 'debit' | 'all';
    dateFrom?: Date;
    dateTo?: Date;
    category?: string;
    search?: string;
  }
): Promise<Transaction[]> => {
  let filtered = [...mockTransactions];
  
  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(transaction => transaction.type === filters.type);
  }
  
  if (filters.dateFrom) {
    filtered = filtered.filter(transaction => transaction.date >= filters.dateFrom!);
  }
  
  if (filters.dateTo) {
    filtered = filtered.filter(transaction => transaction.date <= filters.dateTo!);
  }
  
  if (filters.category) {
    filtered = filtered.filter(transaction => transaction.category === filters.category);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(transaction => 
      transaction.description.toLowerCase().includes(searchLower) || 
      transaction.counterparty?.toLowerCase().includes(searchLower) ||
      transaction.category.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

/**
 * Get transaction categories
 */
export const getTransactionCategories = async (): Promise<string[]> => {
  const categories = new Set<string>();
  mockTransactions.forEach(transaction => categories.add(transaction.category));
  return Array.from(categories);
};

/**
 * Get spending summary by category for a date range
 */
export const getSpendingByCategory = async (
  dateFrom: Date,
  dateTo: Date
): Promise<{category: string; amount: number}[]> => {
  const filtered = mockTransactions.filter(
    transaction => 
      transaction.date >= dateFrom && 
      transaction.date <= dateTo &&
      transaction.type === 'debit'
  );
  
  const categoryMap = new Map<string, number>();
  
  filtered.forEach(transaction => {
    const currentAmount = categoryMap.get(transaction.category) || 0;
    categoryMap.set(transaction.category, currentAmount + transaction.amount);
  });
  
  const result: {category: string; amount: number}[] = [];
  categoryMap.forEach((amount, category) => {
    result.push({ category, amount });
  });
  
  return result.sort((a, b) => b.amount - a.amount);
};

/**
 * Get income vs expenses summary by month
 */
export const getMonthlyFinancialSummary = async (
  months: number = 6
): Promise<{month: string; income: number; expenses: number}[]> => {
  const result: {month: string; income: number; expenses: number}[] = [];
  
  const today = new Date();
  
  for (let i = 0; i < months; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);
    
    const monthlyTransactions = mockTransactions.filter(
      transaction => 
        transaction.date >= startOfMonth && 
        transaction.date <= endOfMonth
    );
    
    const income = monthlyTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = monthlyTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthName = startOfMonth.toLocaleString('default', { month: 'short' });
    
    result.push({
      month: `${monthName} ${year}`,
      income,
      expenses
    });
  }
  
  return result.reverse();
};
